const { readdir, stat } = require('fs').promises
const { resolve } = require('path')

function traverse(path) {
  return readdir(path)
    .then(
      children => Promise.all(children.map(child => resolve(path, child)).map(
        child => stat(child)
          .then(stat => stat.isDirectory())
          .then(isDir => isDir ? traverse(child) : [child]),
      )),
    )
    .then(files => files.reduce((carry, files) => carry.concat(files)))
}

module.exports = {
  traverse,
}
