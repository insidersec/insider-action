import * as core from '@actions/core'
import * as httpm from '@actions/http-client'
import * as tc from '@actions/tool-cache'
import * as os from 'os'
import * as path from 'path'

const osPlat: string = os.platform()
const osArch: string = os.arch()

export async function getInsider(version: string): Promise<string> {
  const release: GitHubRelease | null = await getRelease(version)
  if (!release) {
    throw new Error(`Cannot find Insider ${version} release`)
  }
  core.info(`✅ Insider version found: ${release.tag_name}`)
  const fileName = getFileName(release.tag_name)

  const downloadURL = `https://github.com/insidersec/insider/releases/download/${release.tag_name}/${fileName}`
  core.info(`⬇️ Downloading ${downloadURL}`)
  const downloadPath = await tc.downloadTool(downloadURL)

  core.info('📦 Extracting Insider...')
  let extPath: string
  if (osPlat == 'win32') {
    extPath = await tc.extractZip(downloadPath)
  } else {
    extPath = await tc.extractTar(downloadPath)
  }
  core.debug(`Extracted to ${extPath}`)

  const cachePath: string = await tc.cacheDir(
    extPath,
    'insider-action',
    release.tag_name
  )
  core.debug(`Cached to ${cachePath}`)

  const exePath: string = path.join(
    cachePath,
    osPlat == 'win32' ? 'insider.exe' : 'insider'
  )
  core.debug(`Exe path is ${exePath}`)

  return exePath
}

export interface GitHubRelease {
  id: number
  tag_name: string
}

const getRelease = async (version: string): Promise<GitHubRelease | null> => {
  const url = `https://github.com/insidersec/insider/releases/${version}`
  const http: httpm.HttpClient = new httpm.HttpClient()
  return (await http.getJson<GitHubRelease>(url)).result
}

const getFileName = (version: string): string => {
  const platform = osPlat == 'win32' ? 'windows' : osPlat == 'darwin' ? 'darwin' : 'linux'
  const arch = osArch == 'x64' ? 'x86_64' : 'i386'
  const ext = osPlat == 'win32' ? 'zip' : 'tar.gz'
  return `insider_${version}_${platform}_${arch}.${ext}`
}
