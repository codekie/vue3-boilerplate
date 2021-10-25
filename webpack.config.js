const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { getUserAgentRegExp } = require('browserslist-useragent-regexp');

const releaseId = require('./package.json').version;
const regexSupportedBrowsers = getUserAgentRegExp({
    allowHigherVersions: true,
});

module.exports = (env, argv) => {
    const isDev = argv.mode === 'development';
    console.log(`Running in ${argv.mode} mode`);

    return {
        entry: {
            page: './src/page/index.js',
            'component': './src/component/index.js',
        },
        devtool: 'source-map',
        output: {
            filename: `[name].${releaseId}.js`,
            path: path.resolve(__dirname, './dist'),
        },
        optimization: {
            minimize: !isDev,
            splitChunks: {
                cacheGroups: {
                    common: {
                        test: /[\\/]src[\\/]common[\\/]/,
                        name: 'common',
                        chunks: 'all',
                        priority: -10,
                    },
                },
            },
        },

        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: [
                        path.resolve(__dirname, 'src/'),
                        path.resolve(__dirname, 'static/'),
                    ],
                    exclude: [path.resolve(__dirname, 'node_modules/')],
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /.(sa|sc|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                esModule: false,
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                        {
                            loader: 'resolve-url-loader',
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(eot|ttf|woff|woff2)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: 'fonts/[name]-[hash][ext]',
                    },
                },
            ],
        },

        plugins: [
            new webpack.ProgressPlugin(),
            new webpack.DefinePlugin({
                RELEASE_ID: JSON.stringify(releaseId || ''),
                REGEX_SUPPORTED_BROWSERS: regexSupportedBrowsers,
            }),
            new HtmlWebpackPlugin({
                template: 'static/index.html',
                inject: 'body',
                templateParameters: {
                    releaseId,
                    regexSupportedBrowsers,
                },
            }),
            new MiniCssExtractPlugin({
                filename: 'styles/[name].[contenthash].css',
            }),
            new CopyPlugin({
                patterns: [
                    { from: 'static/images/', to: 'images/' },
                ],
            }),
        ],

        devServer: {
            allowedHosts: 'all',
            host: 'localhost',
            open: false,
            port: 'auto',
            static: {
                directory: path.join(__dirname, 'assets'),
                publicPath: '/assets',
            },
        },
    };
};
