var path = require('path'),
    webpack = require('webpack'),
    HtmlwebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.join(__dirname, 'src'),
    entry: {
        vendor: './vendor',
        bundle: './index.jsx'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: "bundle.js"
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {test: /\.jsx$/, loaders: ['babel'], include: path.join(__dirname, 'src')},
            {test: /\.scss$/, loader: 'style!css!sass'},
            {test: /\.css$/, loader: 'style!css'}
        ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js', Infinity),
        new HtmlwebpackPlugin({
            template: './index.html'
        })
    ]
};