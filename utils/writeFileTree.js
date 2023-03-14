const fs = require('fs-extra')

const path = require('node:path');

function writeFileTree(dir, files) {
    Object.keys(files).forEach(name => {
        console.log(dir, name)
        const filePath = path.join(dir, name)
        fs.ensureDirSync(path.dirname(filePath))
        fs.writeFileSync(filePath, files[name])
    });
}

module.exports = {
    writeFileTree
}