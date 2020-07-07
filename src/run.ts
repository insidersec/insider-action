import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as glob from '@actions/glob'
import * as artifact from '@actions/artifact'
import * as path from 'path'
import * as installer from './installer'

export async function run(): Promise<void> {
  try {
    const version = core.getInput('version') || 'latest'
    const insider = await installer.getInsider(version)
    const insiderPath = path.dirname(insider)

    core.info(`📂 Using ${insiderPath} as working directory...`)
    process.chdir(insiderPath)

    const args = getArguments()

    core.info('🏃 Running Insider...')
    await exec.exec(`${insider}`, args)
    core.info(' Finished Insider')
    uploadArtifacts(insiderPath)
  } catch (error) {
    core.setFailed(error.message)
  }
}

async function uploadArtifacts(rootDirectory: string): Promise<void> {
  const artifactClient = artifact.create()
  const artifactName = 'insider-artifact'

  const files = await getReportFiles()
  const uploadResponse = await artifactClient.uploadArtifact(
    artifactName,
    files,
    rootDirectory,
    {continueOnError: false}
  )

  if (uploadResponse.failedItems.length > 0) {
    throw new Error(`Error to upload artifacts: ${uploadResponse.failedItems}`)
  }
  core.info(
    `祝 Upload report files with successfull: ${uploadResponse.artifactItems}`
  )
}

async function getReportFiles(): Promise<string[]> {
  const patterns = ['report-*.html', 'report-*.json']
  const globber = await glob.create(patterns.join('\n'))
  const files = await globber.glob()
  return files
}

function getArguments(): string[] {
  let githubWorkspacePath = process.env['GITHUB_WORKSPACE']
  if (!githubWorkspacePath) {
    throw new Error('GITHUB_WORKSPACE not defined')
  }
  githubWorkspacePath = path.resolve(githubWorkspacePath)
  core.debug(`GITHUB_WORKSPACE = '${githubWorkspacePath}'`)

  const technology = core.getInput('technology') || 'javascript' // TODO change this!
  const target = core.getInput('target') || '.'
  const security = core.getInput('security')
  const noJson = core.getInput('noJson')
  const noHtml = core.getInput('noHtml')
  const noBanner = core.getInput('noBanner')

  githubWorkspacePath = path.resolve(githubWorkspacePath, target)

  // required flags
  const args = ['-tech', technology, '-target', githubWorkspacePath]

  if (security) {
    args.push('-security', security)
  }
  if (noJson) {
    args.push('-no-json')
  }
  if (noHtml) {
    args.push('-no-html')
  }
  if (noBanner) {
    args.push('-no-banner')
  }

  return args
}
