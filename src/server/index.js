//讓Node.js的程式碼compile

require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
});
require("./server");
