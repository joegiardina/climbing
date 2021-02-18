const presets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      corejs: '3.6.5'
    }
  ]
];
const plugins = [
  [
     'module-resolver',
     {
       root: ['./src'],
       extensions: ['.js', '.json'],
       alias: {}
     }
   ]
];

module.exports = {
  presets,
  plugins,
};
