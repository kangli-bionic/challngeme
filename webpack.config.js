var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Webpack = require('webpack');

module.exports = {
    entry: {
        bundle: __dirname +'/app/index.js',
        jquery: __dirname + '/node_modules/jquery/src/jquery.js',
        bootstrap: ['bootstrap',
            __dirname+'/app/js/jquery.easing.js'],
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
            name: ['vendor', 'jquery', 'bootstrap', 'manifest']
        }),
        new Webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
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
                test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader'
            }
        ]
    }

};