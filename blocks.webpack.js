const defaultConfig = require("./node_modules/@wordpress/scripts/config/webpack.config");
const path = require("path");
module.exports = {
  ...defaultConfig,
  entry: {
    editor: path.resolve(process.cwd(), "blocks", "index.js"),
    client: path.resolve(process.cwd(), "blocks", "client.js")
  },
  output: {
    filename: "[name].js",
    path: path.resolve(process.cwd(), "blocks/build")
  }
};
