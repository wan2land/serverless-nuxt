const { resolve } = require('path')

const { traverse } = require('./traverse')

describe('serverless-nuxt-plugin utils/traverse', () => {

  it('test traverse', async () => {
    await expect(traverse(resolve(__dirname, '..'))).resolves.toEqual([
      resolve(__dirname, '../index.js'),
      resolve(__dirname, 'traverse.js'),
      resolve(__dirname, 'traverse.test.js'),
    ])
  })
})
