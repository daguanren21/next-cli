const prompts = require("prompts");
const { defaults } = require("../utils/preset");
const PromptModule = require('./PromptModule')
const { getPromptModules } = require('./prompt')
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
        prompts([this.presetPrompt, this.featurePrompt, ...this.outroPrompts, ...this.injectedPrompts]).then(res => {
            console.log("记录用户选择", res)
        })

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
    async create(options = {}, preset = null) {
        // //处理用户输入
        // const preset = await this.promptAndResolvePreset();
        // // 初始化安装环境
        // await this.initPackageManagerEnv(preset)
        // // 生成项目文件，生成配置文件
        // const generator = await this.generate(preset)
        // //生成readme文件
        // await this.generateReadme(generator);

        // this.finished();
    }
}

module.exports = Creator