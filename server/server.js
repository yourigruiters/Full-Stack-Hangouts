const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
	pingInterval: 30000,
	pingTimeout: 15000,
});

const port = 5000;

let rooms = [
	{
		id: 0,
		title: "Public Lounge",
		slug: "public-lounge",
		type: "chat",
		host: "",
		private: false,
		password: "",
		category: "Chill",
		maxUsers: 20,
		default: true,
		users: [],
		queue: [],
		isTyping: [],
	},
	{
		id: 1,
		title: "Public Cinema",
		slug: "public-cinema",
		type: "video",
		host: "",
		private: false,
		password: "",
		category: "Chill",
		maxUsers: 20,
		default: true,
		users: [],
		queue: [],
		isTyping: [],
	},
	{
		id: 2,
		title: "Another chatroom 2",
		slug: "another-chatroom-2",
		type: "chat",
		host: "",
		private: false,
		password: "",
		category: "Chill",
		maxUsers: 20,
		default: true,
		users: [],
		queue: [],
		isTyping: [],
	},
];

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

// CREATE GENERAL FORM CHECKING FUNCTION
const emitMessage = (roomName, message) => {
	if (roomName && message) {
		io.to(roomName).emit("message", message);
	} else {
		console.log("ROOMNAME OR MESSAGE MISSING");
	}
};

// CREATE GENERAL CHANGE IN TYPING FUNCTION
const emitTypingChange = (roomName, type, socket) => {
	const roomIndex = rooms.findIndex(
		(room) => room.title.replace(" ", "-").toLowerCase() === roomName
	);

	const user = {
		id: socket.id,
		name: socket.user.name,
		country: socket.user.country,
		countryCode: socket.user.countryCode,
	};

	if (type === "started_typing") {
		const foundUser = rooms[roomIndex].isTyping.findIndex(
			(isTypingUser) => isTypingUser.name === user.name
		);

		if (foundUser === -1) {
			rooms[roomIndex].isTyping.push(user);
		}
	} else if (type === "stopped_typing") {
		const foundUser = rooms[roomIndex].isTyping.findIndex(
			(isTypingUser) => isTypingUser.name === user.name
		);

		if (foundUser !== -1) {
			rooms[roomIndex].isTyping.splice(foundUser, 1);
		}
	}

	const isTypingPeople = rooms[roomIndex].isTyping;

	io.to(roomName).emit("changed_typing", isTypingPeople);
};

io.on("connection", (socket) => {
	socket.on("connect_visitor", (visitorData) => {
		console.log(visitorData, "connected visitor");
		socket.user = visitorData;
		// FIX: Check visitorData to ensure everything is correct
		socket.emit("connect_visitor");
	});

	socket.on("get_visitor", () => {
		socket.emit("get_visitor", socket.user);
	});

	socket.on("get_rooms", (roomType) => {
		const filteredRooms = rooms.filter((room) => room.type === roomType);
		socket.emit("get_rooms", filteredRooms);
	});

	socket.on("joining_room", (roomName) => {
		console.log(roomName, "HAS A NEW USER JOINING");
		socket.join(roomName);

		let room = rooms.find(
			(room) => room.title.replace(" ", "-").toLowerCase() === roomName
		);

		console.log("#### ROOM", room);

		if (room === undefined) {
			rooms.push({
				id: rooms.length,
				title: roomName,
				type: "chat",
				host: "",
				private: false,
				password: "",
				category: "Chill",
				maxUsers: 20,
				default: true,
				users: [],
				queue: [],
			});

			room = rooms[rooms.length];
		}

		const user = {
			id: socket.id,
			name: socket.user.name,
			country: socket.user.country,
			countryCode: socket.user.countryCode,
		};

		console.log("#### ROOM STILL UNDEFINED", room, rooms, rooms.length);

		room.users.push(user);

		console.log("#### ROOM AFTER PUSHING", room);

		const message = {
			user: socket.user.name,
			type: "joined",
		};

		//FUNCTION TO SEND MSG
		emitMessage(roomName, message);
		// io.to(roomName).emit("message", message);
	});

	socket.on("sending_message", (messageObject) => {
		console.log(messageObject, "RECEIVED CHAT MESSAGE");

		messageObject.user = socket.user.name;
		messageObject.type = "message";
		console.log(messageObject, "NEW MESSAGE OBJECT");

		emitMessage(messageObject.room, messageObject);
	});

	socket.on("started_typing", (roomName) => {
		emitTypingChange(roomName, "started_typing", socket);
	});

	socket.on("stopped_typing", (roomName) => {
		emitTypingChange(roomName, "stopped_typing", socket);
	});

	socket.on("disconnect", () => {
		rooms = rooms.map((room) => {
			// FIX: Fake Socket.user - If not exist we use the fake socket.user
			emitTypingChange(
				room.title.replace(" ", "-").toLowerCase(),
				"stopped_typing",
				socket
			);

			// FIX kick user out, were only checking to write a message
			const foundUser = room.users.findIndex(
				(user) => user.name === socket.user.name
			);

			if (foundUser !== -1) {
				room.users.splice(foundUser, 1);

				const message = {
					user: socket.user.name,
					type: "left",
				};

				io.to(room.title.replace(" ", "-").toLowerCase()).emit(
					"message",
					message
				);
			}

			return room;
		});
	});
});

http.listen(port, () => {
	console.log(`listening on localhost at port: ${port}`);
});
