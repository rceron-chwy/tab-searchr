// const fs = require('fs');
// const UglifyJS = require('uglify-js');
// const path = require('path');
require('shelljs/global');

// const rootDir = path.resolve('.');
// const favletInputDir = path.join(rootDir, 'favlet');
// const favletOutputDir = path.join(rootDir, 'app', 'constants');

// function createFavlet() {
//   fs.readFile(`${favletInputDir}/index.js`, { encoding: 'utf8' }, (erra, index) => {
//     if (erra) throw erra;
//     fs.readFile(`${favletInputDir}/template.js`, { encoding: 'utf8' }, (errb, template) => {
//       if (errb) throw errb;
//       const result = UglifyJS.minify(index, {
//         mangle: true,
//         compress: true
//       });
//       const modifiedData = template.replace(/__CODE__/g, result.code.toString());
//       fs.writeFile(`${favletOutputDir}/Debugger.js`, modifiedData, (err) => {
//         if (err) throw err;
//       });
//     });
//   });
// }

exports.replaceWebpack = () => {
  const replaceTasks = [{
    from: 'webpack/replace/JsonpMainTemplate.runtime.js',
    to: 'node_modules/webpack/lib/JsonpMainTemplate.runtime.js'
  }, {
    from: 'webpack/replace/process-update.js',
    to: 'node_modules/webpack-hot-middleware/process-update.js'
  }];

  replaceTasks.forEach(task => cp(task.from, task.to));
};

exports.copyAssets = (type) => {
  const env = type === 'build' ? 'prod' : type;
  rm('-rf', type);
  mkdir(type);
  mkdir(`${type}/content`);
  cp('chrome/extension/bundle/content/*', `${type}/content/`);
  cp(`chrome/manifest.${env}.json`, `${type}/manifest.json`);
  cp('-R', 'chrome/assets/*', type);
  exec(`pug -O "{ env: '${env}' }" -o ${type} chrome/views/`);
  console.log('\n');
  // console.log('[Generating debugger inject script]');
  // console.log('-'.repeat(80));
  // createFavlet();
};
