var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Webpack = require('webpack');

module.exports = {
    entry: {
        bundle: __dirname +'/app/index.js',
        jquery: __dirname + '/node_modules/jquery/src/jquery.js',
        bootstrap: 'script-loader!'+__dirname +'/node_modules/bootstrap/dist/js/bootstrap.js',
        commonCss:[
            __dirname+'/node_modules/bootstrap/dist/css/bootstrap.css',
            __dirname + '/node_modules/animate.css/animate.css'
        ],
        dashUtils: __dirname + '/app/dash/js/dashboard.js',
        vendor: ['react', 'react-dom'],
        dash: __dirname + '/app/dash/index.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname+'/app/dist/',
        publicPath: '/app/dist/'
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