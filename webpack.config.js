
const path = require('path');

const CURRENT_NPM_TASK = process.env.npm_lifecycle_event;
const environment = CURRENT_NPM_TASK === 'build' ? 'production' : 'development';

const { CleanWebpackPlugin: cleanWebpack } = require('clean-webpack-plugin');

const plugins = {

    miniCssExtract: require('mini-css-extract-plugin'),
    htmlWebpack: require('html-webpack-plugin'),
    cleanWebpack,
};

const config = {
    entry: './src/index.js',
    output: {
        filename: 'main.[fullhash].js',
        path: path.resolve(__dirname, 'public'),
        publicPath: ''
    },
    plugins: [new plugins.htmlWebpack({ template: './src/index.html' })],
    devServer: {
        port: 8080,
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        hot: true,

    },
    mode: environment,
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader",
                options: {
                    // Disables attributes processing
                    sources: true,
                },
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'resolve-url-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ],
    },

};

if (environment === 'production') {
    // eslint-disable-next-line no-console
    console.log('environment:', environment);
    config.module.rules[1].use[0] = plugins.miniCssExtract.loader;
    config.module.rules[2].use[0] = plugins.miniCssExtract.loader;
    config.plugins.push(
        new plugins.miniCssExtract({ filename: 'main.[fullhash].css' }),
        new plugins.cleanWebpack(),
    );
}

module.exports = config;
