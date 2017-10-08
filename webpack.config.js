var path = require('path');
var WebpackChunkHash = require('webpack-chunk-hash');
var webpack = require('webpack');
var argv = require('yargs').argv;

console.log(process.env.NODE_ENV)
const nodeEnv = process.env.NODE_ENV || 'development';
const isPro = (nodeEnv === "production");
console.log("当前环境", isPro
    ? "production"
    : "development");

let rules = [
    {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
            loader: 'babel-loader?cacheDirectory=true'
        }
    }
]
let plugins = [new webpack.DefinePlugin({
        // 定义全局变量
        'process.env': {
            //'NODE_ENV': JSON.stringify("development")
            'NODE_ENV': JSON.stringify("production")
        }
    })]
var app = ['index.js']
let outputConfig;
//生产环境路径配置
outputConfig = {
    path: path.join(__dirname, "dist"),
    // 所有输出文件的目标路径
    filename: 'index.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
};
//生产环境插件配置
plugins.push(new webpack.HashedModuleIdsPlugin())
if (isPro) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        // 最紧凑的输出
        beautify: false,
        // 删除所有的注释
        comments: false,
        sourceMap: true,
        compress: {
            // 在 UglifyJs 删除没有用到的代码时不输出警告
            warnings: false,
            // 删除所有的 `console` 语句 还可以兼容ie浏览器 drop_console: true,
            dead_code: true,
            drop_console: true,
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true
        }
    }))
}
module.exports = {
    context: path.resolve(__dirname, 'src'),
    devtool: 'source-map',
    entry: {
        app: app
    },
    output: outputConfig,
    // BASE_URL是全局的api接口访问地址
    plugins,
    // alias是配置全局的路径入口名称，只要涉及到下面配置的文件路径，可以直接用定义的单个字母表示整个路径
    resolve: {
        extensions: [
            '.js', '.json'
        ],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            path.join(__dirname, './src')
        ]
    },
    module: {
        rules
    }
};