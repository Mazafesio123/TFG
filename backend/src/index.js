import "@babel/polyfill";

import express from "express";
import http from "http";
import routers from "./router/index.js";
import cors from "cors";
import { initIO } from "./websocket/index.js";
import env from "./config.js";
import expressFileupload from 'express-fileupload';
import path from 'path';

const app = express();
const __dirname = path.dirname(global.__dirname = process.cwd());

app.use(cors({ credentials: true, origin: env.FRONTEND }));
app.use(expressFileupload({
	useTempFiles: true,
	tempFileDir: path.join(__dirname, './tmp')
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

export const httpServer = http.createServer(app);

for (const router of routers) {
	app.use("/api", router);
}

const socket = initIO(httpServer);
app.set("socketio", socket);

httpServer.listen(env.PORT, () =>
	console.log(`listening on http://localhost:${env.PORT}`)
);
