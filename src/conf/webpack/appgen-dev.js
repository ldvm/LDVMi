module.exports = {
    entry: __dirname + '/../../app/assets_webpack/javascripts/appgen/main.jsx',
    devtool: 'source-map',
    cache: true,
    module: {
        loaders: [
            {test: /\.jsx$/, exclude: /node_modules/, loaders: ['react-hot', 'babel-loader']},
            {test: /\.css$/, loader: 'style!css'}
        ]
    },
    output: {
        path: __dirname + "/../../target/web/public/main/javascripts/appgen/main.js",
        publicPath: "http://localhost:9090/build/",
        filename: "main.js"
    }
};