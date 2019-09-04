// webpack.common.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动生成页面
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 自动清理，清理dist旧文件
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    entry: {
        app: path.join(__dirname, './index.js'),

    },
    // output: {
    //     filename: '[name].bundle.js',
    //     path: path.resolve(__dirname, 'dist'),
    //     publicPath: '/'
    // },

    output: {
        path: __dirname,
        filename: 'dist/index.js',
        libraryTarget: 'umd',
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                },
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader'
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader'
                ]
            }
        ],
    }
};