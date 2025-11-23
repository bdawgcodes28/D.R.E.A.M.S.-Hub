// /**
//  * @author  Elias Lopes
//  * @date    11/17/2025
//  * @description
//  *  This file defines a custom redis client
//  *  for caching data on the server side
//  */

// const { createClient } = require("redis");


// const client = createClient({
//   url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
// });

// client.on("connect", () => console.log("Redis connected!"));
// client.on("error", (err) => console.error("Redis error:", err));

// await client.connect();
