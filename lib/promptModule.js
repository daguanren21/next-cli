class PromptModule {
    constructor(creator) {
        this.creator = creator
    }

    inject(feature) {
        this.creator.featurePrompt.choices.push(feature)
    }
    // 给 injectedPrompts 注入选项
    injectPrompt(prompt) {
        this.creator.injectedPrompts.push(prompt)
    }

    injectOptionForPrompt(name, option) {
        this.creator.injectedPrompts.find(f => {
            return f.name === name
        }).choices.push(option)
    }

    // 注入回调
    onPromptComplete(cb) {
        this.creator.promptCompleteCbs.push(cb)
    }
}

module.exports =PromptModule