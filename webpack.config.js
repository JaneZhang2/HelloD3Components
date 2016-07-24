const path = require('path'),
    merge = require('webpack-merge'),
    webpack = require('webpack'),
    rucksack = require('rucksack-css'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    OpenBrowserPlugin = require('open-browser-webpack-plugin');


const PATHS = {
    src: path.join(__dirname, 'src'),
    dist: path.join(__dirname, 'dist')
};

const common = {
    context: PATHS.src,
    entry: {
        bundle: './index'
    },
    output: {
        path: PATHS.dist
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.(png|jpg)$/,
                loader: 'url?limit=8192'
            },
            {
                test: /\.(woff|woff2|eot|ttf|svg)(\?.*$|$)/,
                loader: 'url'
            },
            {
                test: /\.jsx?$/,
                loader: 'babel',
                include: PATHS.src
            }
        ]
    },
    postcss: [
        rucksack({
            autoprefixer: true
        })
    ],
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ]
};

module.exports = merge(common, {
    output: {
        publicPath: '/',
        filename: '[name].js'
    },
    devtool: 'eval-source-map',
    // devServer: {
    //     // contentBase: PATHS.build,
    //     // Enable history API fallback so HTML5 History API based
    //     // routing works. This is a good default that will come
    //     // in handy in more complicated setups.
    //     historyApiFallback: true,
    //     hot: true,
    //     inline: true,
    //     progress: true,
    //     // Display only errors to reduce the amount of output.
    //     stats: 'errors-only',
    //     // Parse host and port from env so this is easy to customize.
    //     //
    //     // If you use Vagrant or Cloud9, set
    //     // host: process.env.HOST || '0.0.0.0';
    //     //
    //     // 0.0.0.0 is available to all network devices unlike default
    //     // localhost
    //     host: '0.0.0.0',
    //     //process.env.HOST,
    //     port: process.env.PORT
    // },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.scss$/,
                loader: 'style!css!sass'
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
        // new OpenBrowserPlugin({url: 'http://localhost:8080'})
    ]
});

//!postcss!px2rem?remUnit=75&remPrecision=8
