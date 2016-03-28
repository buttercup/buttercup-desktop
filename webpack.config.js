var path = require('path'),
    webpack = require('webpack');

module.exports = {
    entry: path.resolve(__dirname, 'source/resources/js/main.js'),

    output: {
        path: path.resolve(__dirname, 'source/public'),
        filename: 'sallar.js'
    },

    module: {
        loaders: [
            {
                test: /\.js[x]?$/,
                include: path.resolve(__dirname, 'source/resources/js'),
                loader: 'babel',
                query: {
                    presets: ['es2015', 'stage-1', 'react']
                }
            },
            {
                test: /\.scss?$/,
                include: path.resolve(__dirname, 'source/resources/css'),
                loaders: ['style', 'css', 'sass']
            },
            {
                test: /\.html$/,
                //include: path.resolve(__dirname, 'source/resource/js/tpl'),
                loader: 'text-loader'
            }
        ],
    },

    resolve: {
        alias: {
            app: path.resolve(__dirname, 'source/resources/js/app'),
            tpl: path.resolve(__dirname, 'source/resources/js/tpl')
        }
    },

    target: "electron",

    plugins: [
        new webpack.ProvidePlugin({
            $:          "jquery"
        })
    ]
}
