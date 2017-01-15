var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Webpack = require('webpack');

module.exports = {
    entry: {
        bundle: __dirname +'/app/index.js',
        jquery: 'jquery',
        bootstrap: 'bootstrap',
        vendor: ['react', 'react-dom']
    },
    output: {
        filename: '[name].js',
        path: __dirname+'/app/',
        publicPath: '/app/'
    },
    plugins:[
        new ExtractTextPlugin({ filename: 'css/[name].css' , disable: false, allChunks: true}),
        new Webpack.optimize.CommonsChunkPlugin({
            name: ['vendor']
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    loader: ['css-loader']
                })
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader'
            }
        ]
    }

};