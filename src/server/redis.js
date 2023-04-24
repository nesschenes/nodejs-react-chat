const { createClient } = require("redis");
const Redisclient = createClient();

export default () => {
  Redisclient.on("ready", function (err) {
    console.log("Ready");
  });

  Redisclient.on("error", function (err) {
    console.log("Error " + err);
  });
};

exports.Redisclient = Redisclient;
