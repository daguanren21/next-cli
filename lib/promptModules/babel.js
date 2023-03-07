module.exports = pmInstance => {
    pmInstance.inject({
        name: 'Babel',
        value: 'babel',
        description: 'Transpile modern JavaScript to older versions (for compatibility)',
        link: 'https://babeljs.io/',
        selected: true
    })
}