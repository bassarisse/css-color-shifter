/* eslint-env node */
var fs = require('fs')
var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var appVersion = require('./package.json').version

var isProd = process.env.NODE_ENV === 'production'

var buildBase = path.join(__dirname, 'build')
var mainPath = path.join(__dirname, 'app', 'entry')
var entryPoints = {}
var entryPointFiles

try {
    entryPointFiles = fs.readdirSync(mainPath)
} catch(err) {
    entryPointFiles = []
}

entryPointFiles
    .filter(fileName => ['.DS_Store', 'desktop.ini', 'Desktop.ini'].indexOf(fileName) === -1)
    .forEach(fileName => {
        var entryPointName = path.basename(fileName, path.extname(fileName))
        entryPoints[entryPointName] = path.join(mainPath, fileName)
    })

var extractStyles = new ExtractTextPlugin({
    filename: 'style_app_[chunkhash:8].css',
    allChunks: true,
})

var config = {
    entry: entryPoints,
    output: {
        path: buildBase,
        filename: 'app_[name]_[chunkhash:8].js',
        chunkFilename: 'app_[name]_[chunkhash:8].js',
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: {
                    loader: 'html',
                    options: {
                        interpolate: 'require',
                        attrs: ['img:src', 'link:href'],
                    },
                },
            },
            {
                test: /\.jsx?$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel',
                    options: {
                        presets: [
                            ['es2015', { modules: false }],
                            'stage-2',
                            'react',
                        ],
                        plugins: [
                            'transform-runtime',
                            'transform-strict-mode',
                            'transform-decorators-legacy',
                            [ 'emotion/babel', { inline: true }],
                        ],
                        env: {
                            development: {
                                plugins: [
                                    'transform-react-stateless-component-name',
                                ]
                            },
                            production: {
                                presets: [
                                    'react-optimize',
                                ],
                            },
                        }
                    }
                }
            },
            {
                test: /\.css$/,
                use: extractStyles.extract({
                    fallback: 'style',
                    use: 'css'
                })
            },
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    resolveLoader: {
        moduleExtensions: ['-loader'],
    },
    performance: {
        hints: isProd ? 'warning' : false,
    },
    plugins: [
        extractStyles,
        new webpack.DefinePlugin({
            APP_VERSION: JSON.stringify(appVersion),
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(__dirname, 'app/index.tmpl.html'),
        }),
        new CopyWebpackPlugin([
            { from: path.join(__dirname, 'app/favicon.ico'), to: 'favicon.ico' },
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            async: false,
            children: true,
            minChunks: 2,
        }),
    ]
}

if (isProd) {

    config.plugins.unshift(new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify('production'),
        },
    }))

    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        output: {
            comments: false,
        },
    }))

    config.plugins.push(new CleanWebpackPlugin(['build']))

} else {

    config.devServer = {
        inline: true,
        port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3333,
        contentBase: buildBase,
        historyApiFallback: {
            index: '/index.html',
        },
    }

    config.devtool = '#source-map'

}

module.exports = config
