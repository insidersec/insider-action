import fs = require('fs')
import * as installer from '../src/installer'

describe('installer', () => {
  it('acquires latest version of Insider', async () => {
    const insider = await installer.getInsider('latest')
    expect(fs.existsSync(insider)).toBe(true)
  }, 100000)

  it('acquires 2.0.4 version of Insider', async () => {
    const insider = await installer.getInsider('2.0.4')
    expect(fs.existsSync(insider)).toBe(true)
  }, 100000)

})
