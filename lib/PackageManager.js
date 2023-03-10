const { semver, execa } = require('@vue/cli-shared-utils');

const fs = require('fs-extra');
const path = require('node:path');
const consola = require('consola');
const executeCommand = require('../utils/executeCommand');
const PACKAGE_MANAGER_CONFIG = {
    npm: {
        install: ['install']
    },
    pnpm: {
        install: ['install']
    }
}
class PackageManager {
    constructor({ context } = {}) {
        this.context = context || process.cwd()
        this.packageJson = fs.readJSONSync(path.resolve("./package.json"))
        const packageManager = this.packageJson.packageManager
        const [bin, version] = packageManager ? packageManager.split('@') : ['npm', '6.9.0']
        this.bin = bin
        this.needsPeerDepsFix = false
        const MIN_SUPPORTED_NPM_VERSION = version
        const npmVersion = execa.sync(this.bin, ['--version']).stdout
        console.log(npmVersion)
        if (semver.lt(npmVersion, MIN_SUPPORTED_NPM_VERSION)) {
            consola.error(new Error(`${this.bin}版本太低了，请升级`))
        }
        // if (semver.gte(npmVersion, '7.0.0')) {
        //     this.needsPeerDepsFix = true
        // }

    }

    // 安装
    async install() {
        const args = []
        return await this.runCommand('install', args)
    }
    async runCommand(command, args) {
        await executeCommand(this.bin, [...PACKAGE_MANAGER_CONFIG[this.bin][command], ...args], this.context)
    }
}
// const initialPackage = new PackageManager()
// let pm = new PackageManager();
// (async () => {
//     await pm.install()
// })()

module.exports= PackageManager
