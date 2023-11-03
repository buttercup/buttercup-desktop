const path = require("path");
const { DefinePlugin } = require("webpack");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const BCUPUI_ICONS_PATH = path.join(path.dirname(require.resolve("@buttercup/ui")), "icons");
const BCUP_PACKAGE_PATH = path.join(__dirname, "node_modules/buttercup/package.json");

const pkgInfo = require("./package.json");
const bcupCoreInfo = require(BCUP_PACKAGE_PATH);

module.exports = [
    {
        devtool: false,

        entry: path.resolve(__dirname, "./source/main/index.ts"),

        externals: [
            "@electron/remote",
            "delayable-setinterval",
            "electron",
            "electron-builder",
            "electron-is-dev",
            "electron-updater",
            "express",
            "keytar",
            "os-locale",
            "stacktracey",
            "zod"
        ].reduce((output, name) => ({ ...output, [name]: name }), {}),

        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                configFile: path.resolve(__dirname, "./tsconfig.json")
                            }
                        }
                    ],
                    exclude: /node_modules/
                }
            ]
        },

        output: {
            filename: "index.js",
            libraryTarget: "commonjs2",
            path: path.resolve(__dirname, "./build/main")
        },

        resolve: {
            extensions: [".ts", ".js"]
        },

        target: "electron-main",

        watchOptions: {
            poll: 1000,
            ignored: /node_modules/
        }
    },
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
                                configFile: path.resolve(__dirname, "./tsconfig.web.json")
                            }
                        }
                    ],
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
                    test: /\.(ttf|otf|woff|woff2|eot)$/i,
                    use: "file-loader"
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"]
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        "style-loader",
                        "css-loader",
                        {
                            loader: "sass-loader",
                            options: {
                                implementation: require("sass")
                            }
                        }
                    ]
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
                patterns: [
                    {
                        from: BCUPUI_ICONS_PATH,
                        to: "icons"
                    }
                ]
            }),
            new DefinePlugin({
                __CORE_VERSION__: JSON.stringify(bcupCoreInfo.version),
                __VERSION__: JSON.stringify(pkgInfo.version)
            })
        ],

        resolve: {
            alias: {
                buttercup: require.resolve("buttercup/web"),
                "react-dnd": path.resolve("node_modules/react-dnd"),
                "react/jsx-runtime": "react/jsx-runtime.js"
            },
            extensions: [".tsx", ".ts", ".js"]
        },

        target: "electron-renderer",

        watchOptions: {
            poll: 1000,
            ignored: /node_modules/
        }
    }
];
