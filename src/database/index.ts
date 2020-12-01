import mongoose, { ConnectionOptions, mongo } from "mongoose";

import { db } from "../config";

const dbOptions: ConnectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 10,
};

// database connection
mongoose
  .connect(db.uri, dbOptions)
  .then(() => {
    console.info("MONGOOSE CONNECTION DONE");
  })
  .catch((e) => {
    console.info("MONGOOSE CONNECTION ERROR!!!!");
    console.error(e);
  });

// CONNECTIONS EVENTS
// succesfully connection
mongoose.connection.on("connected", () => {
  console.info("MONGOOSE DEFAULT CONNECTION OPEN TO " + db.uri);
});

// if the connections throws an error
mongoose.connection.on("error", (err) => {
  console.info("MONGOOSE DEFAULT CONNECTION DISCONNECTED");
});

// when the connection is disconnected
mongoose.connection.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.info("MONGOOSE DEFAULT CONNECTION DISCONNECTED THROUGH APP");
    process.exit(0);
  });
});
