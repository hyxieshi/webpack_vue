const path = require("path")
const Eslint = require("eslint-webpack-plugin")
const HtmlWebp = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")
const { VueLoaderPlugin, default: loader } = require("vue-loader")
const { DefinePlugin } = require("webpack")
const CopyPlugin = require("copy-webpack-plugin")


const getStyleLoders = (styles) => {
    return [MiniCssExtractPlugin - loader,
        "css-loader",
    {
        // css 的兼容  需要在package 配置
        loader: "postcss-loader",
        options: {
            postcssOptions: {
                plugins: ["postcss-preset-env"]
            }
        }
    },
        styles
    ].filter(Boolean)
}



module.exports = {
    // 
    entry: './src/main.js',
    output: {
        // 开发环境不需要输出
        path: undefined,
        // 入口名
        filename: "static/js/[name].[contenthash:10].js",
        //
        chunkFilename: "static/js/[name].[contenthash:10].chunk.js",
        // 其余命
        assetModuleFilename: "static/js/[hash:10][ext][query]"
    },
    module: {
        rules: [
            // 样式
            {
                test: /\.css$/,
                use: getStyleLoders()
            },
            {
                test: /\.less$/,
                use: getStyleLoders("less-loader")
            },
            {
                test: /\.scss$/,
                use: getStyleLoders("scss-loader")
            },
            // 图片
            {
                test: /\.(jpg?g|png|gif|svg|webp)/,
                type: "asset",
                // 对于小与10kb的图片转成b64 减小请求 --asset
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024,
                    }
                }
            },
            // js
            // eslint
            {
                test: /\.js$/,
                // 只处理src
                include: path.resolve(__dirname, '../src'),
                loader: "babel-loader",
                options: {
                    // js压缩
                    cacheDirectory: true,
                    cacheCompression: false,
                }
            },
            // vue
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/vue-loader')
                }
            }
        ]
    },
    plugins: [
        new Eslint({
            context: path.resolve(__dirname, '../src'),
            // 代码检查排除 node 模块包
            exclude: 'node_modules',
            cache: true,
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache')
        }),
        new HtmlWebp({
            template: path.resolve(__dirname, '../public/index.html'),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "../public"),
                    to: path.resolve(__dirname, "../dist"),
                    toType: "dir",
                    noErrorOnMissing: true,
                    globOptions: {
                        ignore: ["**/index.html"],
                    },
                    info: {
                        minimized: true,
                    },
                },
            ],
        }),
        // 生产环境下css 的压缩
        new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:10].css",
            chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
        }),
        new VueLoaderPlugin(),
        // vue 错误
        new DefinePlugin({
            __VUE_OPTIONS_API__: "true",
            __VUE_PROD_DEVTOOLS__: "false",
        }),
    ],
    optimization: {
        // 压缩的操作
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ],

        // 分割成多个文件
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime - ${entrypoint.name}.js`
        }
    },
    resolve: {
        extensions: [".vue", ".js", ".json"]
    },
    // 不需要
    // devServer: {
    //     host: 'localhost',
    //     port: 3000,
    //     open: true,
    //     // 热更新
    //     hot: true,
    //     compress: true,

    //     historyApiFallback: true, // 解决vue-router刷新404问题
    // },
    // 生产
    mode: 'production',
    // 代码映射 用于更好的找到错误地方
    devtool: 'source-map',
}