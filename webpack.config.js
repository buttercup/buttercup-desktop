const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = [{
    entry: path.resolve(__dirname, "./source/renderer/index.ts"),

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [{
                    loader: "ts-loader",
                    options: {
                        configFile: "tsconfig.web.json"
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
            inject: "head",
            template: path.resolve(__dirname, "./resources/renderer.pug")
        })
    ],

    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },

    watchOptions: {
        poll: 1000,
        ignored: /node_modules/
    }
}];
