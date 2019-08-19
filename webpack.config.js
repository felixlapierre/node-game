const path = require('path');

module.exports = {
    entry: './src/static/game.ts',
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: '/node_modules/'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'game.js',
        path: path.resolve(__dirname, 'build/static')
    }
}