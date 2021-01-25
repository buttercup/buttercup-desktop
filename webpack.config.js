const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = [{
    entry: path.resolve(__dirname, "./source/renderer/index.tsx"),

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader",
                    options: {
                        configFile: path.resolve(__dirname, "./tsconfig.web.json")
                    }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.pug$/,
                use: "pug-loader"
            }
        ]
    },

    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "./build/renderer")
    },

    plugins: [
        new HTMLWebpackPlugin({
            filename: "index.html",
            inject: "body",
            template: path.resolve(__dirname, "./resources/renderer.pug")
        })
    ],

    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },

    target: "electron-renderer",

    watchOptions: {
        poll: 1000,
        ignored: /node_modules/
    }
}];
