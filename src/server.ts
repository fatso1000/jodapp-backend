import app from "./app";
import { port } from "./config";

app
  .listen(port, () => {
    console.info(`Server running on port: ${port}`);
  })
  .on("error", (e) => console.error(e));
