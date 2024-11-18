const path = require('path');
const webpack = require('webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { NODE_ENV = 'production' } = process.env;

/** @return {import("webpack").Configuration} */
module.exports = function (options) {
  const { plugins, ...config } = options;
  return {
    ...config,
    entry: path.resolve(__dirname, 'src/main.ts'),
    mode: NODE_ENV,
    target: 'node',
    externals: [],
    plugins: [
      ...plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          const lazyImports = [
            '@nestjs/microservices/microservices-module',
            '@nestjs/websockets/socket-module',
            'class-transformer/storage',
          ];
          if (!lazyImports.includes(resource)) {
            return false;
          }
          try {
            require.resolve(resource, {
              paths: [process.cwd()],
            });
          } catch (err) {
            return true;
          }
          return false;
        },
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(
              __dirname,
              'node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node',
            ),
            to: path.resolve(__dirname, 'dist'),
          },
          {
            from: path.resolve(
              __dirname,
              'node_modules/.prisma/client/query_engine-windows.dll.node',
            ),
            to: path.resolve(__dirname, 'dist'),
          },
        ],
      }),
    ],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'main.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      plugins: [
        new TsconfigPathsPlugin({ configFile: './tsconfig.build.json' }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
        },
      ],
    },
  };
};
