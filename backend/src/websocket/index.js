import { Server } from "socket.io";
import { ticketModel, userModel } from "./../database/models.js";
import mongoose from "mongoose";
import fs from "fs";
import fileType from "file-type";

export let allSockets = [];

export function initIO(httpServer) {
	const io = new Server(httpServer, {
		origins: ["http://localhost:8080"],
		cors: {
			origin: "http://localhost:8080",
			methods: ["GET", "POST"],
			credentials: false,
		},
		allowEIO3: true,
	});

	io.on("connection", async (socket) => {
		if (socket.request._query.userId) {
			allSockets.push(socket);
			let user = await userModel.findById(socket.request._query.userId);
			if (user) {
				user.online = true;
				await user.save();
				socket.broadcast.emit("userChangeState", {
					userId: user._id,
					online: true,
				});
			}
		}

		socket.on("join-room", (id) => {
			socket.join(id);
		});

		socket.on("send-message", async (data) => {
			let ticket = await ticketModel.findById(data.ticket_id);
			let _id = mongoose.Types.ObjectId();
			console.log(data);
			let files;
			if (data.file) {
				fs.writeFile(
					`public/documents/_${_id}.${data.file.ext}`,
					data.file.file,
					(err) => console.log(err)
				);
				files = {
					name: data.file.name,
					_id,
					ext: data.file.ext,
				};
			}

			ticket.messages.unshift({
				_id,
				text: data.text,
				date: data.date,
				author: data.author,
				file: files,
			});
			ticket.save();

			let user = await userModel.findById(data.author, "username img");
			io.to(data.ticket_id).emit("send-message", {
				text: data.text,
				date: data.date,
				author: { _id: data.author, username: user.username, img: user.img },
				file: files,
				_id,
			});
		});

		socket.on("typing", (typing, user) => {
			socket.broadcast.emit("typing", { typing, user });
		});

		socket.on("logout", (id) => {
			socket.broadcast.emit("userChangeState", {
				userId: id,
				online: false,
			});
		});

		socket.on("disconnect", async () => {
			var i = allSockets.indexOf(socket);
			if (allSockets[i]) {
				let user = await userModel.findById(
					allSockets[i].request._query.userId
				);
				user.online = false;
				socket.broadcast.emit("typing", {
					typing: false,
					user: { _id: user._id },
				});
				socket.broadcast.emit("userChangeState", {
					userId: user._id,
					online: false,
				});
				await user.save();
				allSockets.splice(i, 1);
			}
		});
	});
	return io;
}
