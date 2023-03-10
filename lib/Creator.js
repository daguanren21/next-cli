const prompts = require("prompts");
const { defaults, vuePresets } = require("../utils/preset");
const PromptModule = require('./PromptModule')
const { getPromptModules } = require('./prompt')
const consola = require('consola')
const { execa, hasProjectGit, hasGit } = require('@vue/cli-shared-utils');
const PackageManager = require("./PackageManager");
const { writeFileTree } = require("../utils/writeFileTree");
class Creator {

    constructor(name, dir) {
        this.name = name;

        this.pkg = {};
        this.packageManager = null;
        //预设提示选项
        this.presetPrompt = this.resolvePresetPrompts();
        this.featurePrompt = this.resolveFeaturePrompts();
        //保存相关提示选项
        this.outroPrompts = this.resolveOutroPrompts();
        //其他提示选项
        this.injectedPrompts = []
        //回调
        this.promptCompleteCbs = []
        const promptAPI = new PromptModule(this)
        const promptModules = getPromptModules()
        promptModules.forEach(m => m(promptAPI))
        this.finalPrompts = [this.presetPrompt, this.featurePrompt, ...this.outroPrompts, ...this.injectedPrompts]
    }
    resolveOutroPrompts() {
        const outroPrompts = [
            {
                name: 'useConfigFiles',
                type: (prev, values) => values.preset === '__manual__' ? 'select' : null,
                message: 'Where do you prefer placing config for Babel, ESLint, etc.',
                choices: [{
                    title: 'In dedicated config files',
                    value: 'files'
                },
                {
                    title: 'In package.json',
                    value: 'pkg'
                }]
            },
            {
                name: 'save',
                type: (prev, values) => values.preset === '__manual__' ? 'confirm' : null,
                message: 'Save this as a preset for future projects?',
                initial: false
            },
            // 输入提示选项
            {
                name: 'saveName',
                type: (prev, values) => values.save ? 'text' : null,
                message: 'Save preset as:'
            }
        ]
        return outroPrompts
    }
    resolveFeaturePrompts() {
        return {
            name: 'features',
            type: prev => prev === '__manual__' ? 'multiselect' : null,
            message: 'Check the features needed for your project',
            choices: [],
        }
    }
    resolvePresetPrompts() {
        const presetChoices = Object.entries(defaults.presets).map(([name, preset]) => {
            return {
                title: `${name}(${Object.keys(preset.plugins).join(',')})`,
                value: name
            }
        })
        return {
            name: 'preset',
            type: "select",
            message: "pick a preset",
            choices: [...presetChoices, {
                title: 'Mnanually select features',
                value: '__manual__'
            }]
        }
    }
    async promptAndResolvePreset() {
        try {
            let preset;
            const { name } = this
            const res = await prompts(this.finalPrompts)
            if (res.preset && res.preset === 'Default (Vue 2)') {
                preset = vuePresets[res.preset]
            } else {
                throw new Error("暂不支持Vue3自定义配置")
            }
            // 添加 projectName 属性
            preset.plugins['@vue/cli-service'] = Object.assign({
                projectName: name
            }, preset)
            return preset
        } catch (error) {
            consola.error(error);
            process.exit(1)
        }

    }
    async initPackageManagerEnv(preset) {
        const { name, context } = this
        this.pm = new PackageManager({ context })
        const package = {
            name,
            version: '1.0.0',
            private: true,
            devDependencies: {}
        }
        const deps = Object.keys(preset.plugins)
        deps.forEach(dep => {
            let { version } = preset.plugins[dep]
            if (!version) {
                version = 'latest'
            }
            package.devDependencies[dep] = version
        })
        this.package = package

        // 写入package.json 文件
        await writeFileTree(context,{
            'package.json': JSON.stringify(package,null,2)
        })
    }
    async create() {
        //处理用户输入
        const preset = await this.promptAndResolvePreset();
        console.log('preset 值：', preset)
        // // 初始化安装环境
        await this.initPackageManagerEnv(preset)
        // // 生成项目文件，生成配置文件
        // const generator = await this.generate(preset)
        // //生成readme文件
        // await this.generateReadme(generator);

        // this.finished();
    }
}

module.exports = Creator