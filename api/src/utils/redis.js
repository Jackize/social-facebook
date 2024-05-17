const { createClient } = require("redis");

let client = createClient({
  url: "redis://redis:6379",
});

const connectToRedis = async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
    }
    console.log("Connected to Redis");
    client.on("error", (err) => {
      console.log("Error: ", err);
    });
  } catch (error) {
    console.log("Error connecting to Redis: " + error);
    client.quit();
  }
};

module.exports = {
  client,
  connectToRedis,
};
