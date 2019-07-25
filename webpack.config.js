/**
 * For development: run `webpack`
 * For production: run `webpack --env=prod`
 */

const path = require("path");

const OUTPUT_DIR = path.resolve(__dirname, "./public");

const buildConfig = function (env) {
    const isProd = env === "prod";
    return {
        context: __dirname,
        entry: './src/entry.ts',
        output: {
            path: OUTPUT_DIR + "/js/",
            filename: "app.js",
        },
        devtool: isProd ? "none" : "source-map",
        resolve: {
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                }]
        },
        mode: isProd ? "production" : "development"
    };
};

module.exports = buildConfig;