module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: '14',
        browsers: '> 1%, not dead'
      },
      modules: process.env.BABEL_ENV === 'esm' ? false : 'auto'
    }]
  ],
  env: {
    test: {
      presets: [
        ['@babel/preset-env', {
          targets: { node: 'current' }
        }]
      ]
    }
  }
}; 