module.exports = {
    entry: __dirname + '/../../app/assets_webpack/appgen/javascripts/main.jsx',
    devtool: 'source-map',
    cache: true,
    module: {
        loaders: [
            {test: /\.jsx$/, exclude: /node_modules/, loaders: ['react-hot', 'babel-loader']},
            {test: /\.less$/, loader: 'style!css!less'}
        ]
    },
    output: {
        path: __dirname + "/../../target/web/public/main/javascripts/appgen/main.js",
        publicPath: "http://localhost:9090/build/",
        filename: "main.js"
    }
};