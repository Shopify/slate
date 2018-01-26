import path from 'path';
import webpack from 'webpack';
import MemoryFS from 'memory-fs';

export default function test(fixture, options = {}) {
  const compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      filename: 'test-out.js',
      path: path.resolve(__dirname),
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {loader: path.resolve(__dirname, '../../index.js'), options},
            {loader: 'css-loader'},
          ],
        },
      ],
    },
  });

  compiler.outputFileSystem = new MemoryFS();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
      }

      resolve(stats);
    });
  });
}
