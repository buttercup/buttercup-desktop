const path = require("path");
const { DefinePlugin } = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const BCUPUI_ICONS_PATH = path.join(path.dirname(require.resolve("@buttercup/ui")), "icons");

const pkgInfo = require("./package.json");
const bcupCoreInfo = require("buttercup/package.json");

module.exports = [
    {
        devtool: false,

        entry: path.resolve(__dirname, "./source/renderer/index.tsx"),

        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                configFile: path.resolve(__dirname, "./tsconfig.web.json"),
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.pug$/,
                    use: "pug-loader",
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: "file-loader",
                },
                {
                    test: /\.(ttf|otf|woff|woff2|eot)$/i,
                    use: "file-loader",
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: ["style-loader", "css-loader", "sass-loader"],
                },
            ],
        },

        output: {
            filename: "index.js",
            path: path.resolve(__dirname, "./build/renderer"),
        },

        plugins: [
            new HTMLWebpackPlugin({
                filename: "index.html",
                inject: "body",
                template: path.resolve(__dirname, "./resources/renderer.pug"),
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: BCUPUI_ICONS_PATH,
                        to: "icons",
                    },
                ],
            }),
            new DefinePlugin({
                __CORE_VERSION__: JSON.stringify(bcupCoreInfo.version),
                __VERSION__: JSON.stringify(pkgInfo.version),
            }),
        ],

        resolve: {
            alias: {
                buttercup: require.resolve("buttercup/web"),
            },
            extensions: [".tsx", ".ts", ".js"],
        },

        target: "electron-renderer",

        watchOptions: {
            poll: 1000,
            ignored: /node_modules/,
        },
    },
];
