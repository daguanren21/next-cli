const c = require('picocolors')
module.exports = pmInstance => {
    pmInstance.inject({
        name: 'Router',
        value: 'router',
        description: 'Structure the app with dynamic pages',
        link: 'https://router.vuejs.org/'
    })
    pmInstance.injectPrompt({
        name: 'historyMode',
        type: (pre, values) => values.features && values.features.includes('router') ? 'confirm' : null,
        message: `Use history mode for router? ${c.yellow(`(Requires proper server setup for index fallback in production)`)}`,
        description: `By using the HTML5 History API, the URLs don't need the '#' character anymore.`,
        link: 'https://router.vuejs.org/guide/essentials/history-mode.html'
    })

    pmInstance.onPromptComplete((answers, options) => {
        if (answers.features && answers.features.includes('router')) {
            options.plugins['@vue/cli-plugin-router'] = {
                historyMode: answers.historyMode
            }
        }
    })
}