var path = require('path'),
    webpack = require('webpack'),
    ExtractTextPlugin = require("extract-text-webpack-plugin"),
    SvgStore = require('webpack-svgstore-plugin'),
    argv = require('yargs').argv;

var publicPath = path.resolve(__dirname, 'source/public'),
    sourcePath = path.resolve(__dirname, 'source/resources'),
    env = process.env.NODE_ENV || 'development';

module.exports = {
    entry: {
        main: [
            'babel-polyfill',
            'webpack/hot/dev-server',
            path.resolve(__dirname, 'source/frontend/main.js')
        ]/*,
        styles: path.resolve(__dirname, 'source/resources/js/styles.js')*/
    },

    output: {
        path: path.resolve(publicPath, './built'),
        filename: '[name].js',
        //chunkFilename: '[id].js',
        publicPath: '/built/'
    },

    devServer: {
        contentBase: publicPath,
        publicPath: 'http://localhost:8080/built/'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, 'source/frontend'),
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-0', 'react']
                }
            },
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'source/frontend'),
                loaders: ['style', 'css', 'sass']
                //loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
            },
            {
                test: /\.html$/,
                //include: path.resolve(__dirname, 'source/resource/js/tpl'),
                loader: 'text-loader'
            },
            {
                test: /\.ttf$/,
                loader: "url-loader",
                query: { mimetype: "application/x-font-ttf" }
            }
        ],
    },

    resolve: {
        root: path.resolve(__dirname, 'source/frontend')
        /*alias: {
            app: path.resolve(__dirname, 'source/resources/js/app'),
            tpl: path.resolve(__dirname, 'source/resources/js/tpl'),
            styles: path.resolve(__dirname, 'source/resources/css/')
        }*/
    },

    target: "electron",

    plugins: [
        /*new webpack.ProvidePlugin({
            $:          "jquery"
        }),*/
        new webpack.DefinePlugin({
            'process.env'  : {
                'NODE_ENV' : JSON.stringify(env)
            },
            'NODE_ENV'     : env,
            '__DEV__'      : env === 'development',
            '__PROD__'     : env === 'production',
            '__TEST__'     : env === 'test',
            '__DEBUG__'    : env === 'development' && !argv.no_debug,
            '__BASENAME__' : JSON.stringify(process.env.BASENAME || '')
        }),
        new webpack.HotModuleReplacementPlugin()
        //new ExtractTextPlugin("[name].css"),
        /*new SvgStore(path.join(sourcePath, 'img/icons', '/*.svg'), '', {
            name: 'sallar.sprite.svg',
            baseUrl: 'http://127.0.0.1:8080/built',
            prefix: 'sallar-',
            svgoOptions: {
                // options for svgo
                plugins: [
                    { removeTitle: true }
                ]
            }
        })*/
    ]
}
