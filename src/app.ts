import "rootpath";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorHandler } from "./middlewares/error-handler";
import dotenv from "dotenv";
dotenv.config();
import { corsUrl } from "./config";
import "./database";
import routesV1 from "./routes/v1";

// Imprime un error cuando existe un error sin detectar
process.on("uncaughtException", (e) => {
  console.error(e);
});

const app = express();

app.use(express.urlencoded({ limit: "10mb", extended: false }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
    origin: corsUrl,
    optionsSuccessStatus: 200,
  }));

// routes
app.use("/v1", routesV1);

app.use("/", (req, res) => res.json("HOLA MUNDO")); // test route

// app.use('/api-docs', )

// global error handler
// app.use(errorHandler);
export default app;
