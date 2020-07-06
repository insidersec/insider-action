import * as path from 'path'
import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as installer from './installer'

export async function run(): Promise<void> {
  try {
    const version = core.getInput('version') || 'latest'
    const insider = await installer.getInsider(version)

    const args = getArguments()

    core.info('🏃 Running Insider...')
    await exec.exec(`${insider}`, args)
    core.info(' Finished Insider')
  } catch (error) {
    core.setFailed(error.message)
  }
}

function getArguments(): string[] {
  let githubWorkspacePath = process.env['GITHUB_WORKSPACE']
  if (!githubWorkspacePath) {
    throw new Error('GITHUB_WORKSPACE not defined')
  }
  githubWorkspacePath = path.resolve(githubWorkspacePath)
  core.debug(`GITHUB_WORKSPACE = '${githubWorkspacePath}'`)

  const technology = core.getInput('technology')
  const target = core.getInput('target') || '.'
  const security = core.getInput('security')
  const noJson = core.getInput('noJson')
  const noHtml = core.getInput('noHtml')
  const noBanner = core.getInput('noBanner')

  githubWorkspacePath = path.resolve(githubWorkspacePath, target)
  core.info(`📂 Using ${githubWorkspacePath} as target`)

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
