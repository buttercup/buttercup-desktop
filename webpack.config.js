const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const BCUPUI_ICONS_PATH = path.join(path.dirname(require.resolve("@buttercup/ui")), "icons");

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
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: "file-loader"
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
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
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: BCUPUI_ICONS_PATH,
                to: "icons"
            }]
        })
    ],

    resolve: {
        alias: {
            buttercup: require.resolve("buttercup/web")
        },
        extensions: [".tsx", ".ts", ".js"]
    },

    target: "electron-renderer",

    watchOptions: {
        poll: 1000,
        ignored: /node_modules/
    }
}];
