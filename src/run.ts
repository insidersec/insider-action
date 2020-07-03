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

function getArguments(): Array<string> {
  const technology = core.getInput('technology')
  let target = core.getInput('target') || '.'
  const security = core.getInput('security')
  const noJson = core.getInput('noJson')
  const noHtml = core.getInput('noHtml')
  const noBanner = core.getInput('noBanner')

  // required flags
  const args = ['-tech', technology, '-target', target]

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
