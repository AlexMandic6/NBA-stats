require("@babel/polyfill");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require("copy-webpack-plugin");


module.exports = {
  entry: ['@babel/polyfill', __dirname + '/src/app/index.js'],
  entry: {
    index: './src/app/index.js',
    teams: './src/app/divisions.js',
    players: './src/app/playersTable.js',
    standings: './src/app/standings.js',
    playerProfile: './src/app/playerProfile.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/[name].bundle.js',
    // assetModuleFilename: 'images/[hash][ext][query]'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
      test: /\.(s[ac]|c)ss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: ""
            },
          },
          {
              loader: "css-loader",
          },
          {
            loader: "postcss-loader"
          },
          {
              loader:  "sass-loader"
          }
              ]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      filename: 'players.html',
      template: './src/players.html',
      chunks: ['players']
    }),
    new HtmlWebpackPlugin({
      filename: 'teams.html',
      template: './src/teams.html',
      chunks: ['teams']
    }),
    new HtmlWebpackPlugin({
      filename: 'standings.html',
      template: './src/standings.html',
      chunks: ['standings']
    }),
    new HtmlWebpackPlugin({
      filename: 'player.html',
      template: './src/player.html',
      chunks: ['playerProfile']
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        { from: './src/img', to: './img'},
      ]
    }),
  ],
  devServer: {
    contentBase: './dist',
    open: true
  }
}
