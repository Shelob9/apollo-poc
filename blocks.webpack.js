const defaultConfig = require("./node_modules/@wordpress/scripts/config/webpack.config");
const path = require("path");
module.exports = {
  ...defaultConfig,
  entry: {
    blocks: path.resolve(process.cwd(), "blocks", "index.js")
    //front: path.resolve(process.cwd(), "src", "front.js")
  },
  output: {
    filename: "[name].js",
    path: path.resolve(process.cwd(), "blocks/build")
  }
};
