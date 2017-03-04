var ExtractTextPlugin = require("extract-text-webpack-plugin");
var Webpack = require('webpack');

module.exports = {
    entry: {
        home: __dirname +'/app/home/index.js',
        jquery: __dirname + '/node_modules/jquery/src/jquery.js',
        common:[
            __dirname+'/node_modules/bootstrap/dist/css/bootstrap.css',
            __dirname + '/node_modules/animate.css/animate.css',
            'script-loader!'+__dirname +'/node_modules/bootstrap/js/dropdown.js',
            __dirname + '/app/common/constants.js',
            __dirname + '/app/common/utils.js'
        ],
        template:__dirname +'/app/common/css/template.css',
        vendor: ['react', 'react-dom', 'react-cookie'],
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
            name: ['vendor', 'jquery', 'common', 'manifest']
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
                use: 'babel-loader',
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