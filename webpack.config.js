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
    devtool: 'inline-source-map', // 站点地图，可以输出错误发生所在地
    resolve: {
        
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    
    },

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
            { test: /\.(tsx|ts)?$/, loader: "ts-loader" },
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
            },
            {
                test: /\.(js|ts|jsx|tsx)$/,
                loader: 'eslint-loader',
                enforce: "pre",
                include: [path.resolve(__dirname, 'src')], // 指定检查的目录
                options: { // 这里的配置项参数将会被传递到 eslint 的 CLIEngine 
                    formatter: require('eslint-friendly-formatter') // 指定错误报告的格式规范
                }
            }
        ],
    }
};