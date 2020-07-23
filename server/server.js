const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

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
	},
];

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

// CREATE GENERAL FORM CHECKING FUNCTION
const emitMessage = (roomName, message) => {
  if(roomName && message) {
    io.to(roomName).emit("message", message);
  } else {
    console.log('ROOMNAME OR MESSAGE MISSING');
  }
}
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

		room.users.push(user);

		const message = {
			user: socket.user.name,
			type: "joined",
		};

    //FUNCTION TO SEND MSG
    emitMessage(roomName, message);
    // io.to(roomName).emit("message", message);
	});

  socket.on('sending_message', (messageObject) => {
    console.log(messageObject, 'RECEIVED CHAT MESSAGE');

    messageObject.user = socket.user.name;
    messageObject.type = 'message';
    console.log(messageObject, 'NEW MESSAGE OBJECT');

    emitMessage(messageObject.room, messageObject); 
  })

  socket.on('started_typing', (roomName) => {
    io.to(roomName).emit("started_typing", socket.user.name);
    console.log('started_typing')
  })
  socket.on('stopped_typing', (roomName) => {
    io.to(roomName).emit("stopped_typing", socket.user.name);
    console.log('stopped_typing')

  })

	socket.on("disconnect", () => {
		console.log("---OLD-DC---OLD-DC---OLD-DC---OLD-DC---OLD-DC---");
		// console.log('A user disconnected!');
		rooms = rooms.filter((room) => {
			room.users = room.users.filter((user) => {
				console.log(room.users, "ROOM USERS");
				console.log(user.id, " AND ", socket.id);
				if (user.id !== socket.id) {
					return user;
				}

				const message = {
					user: socket.user.name,
					type: "left",
				};

				io.to(room.title.replace(" ", "-").toLowerCase()).emit(
					"message",
					message
				);
				return;
			});
			console.log(room.users, "ROOM USERS");
			return room;
		});

		console.log("---DISCO---DISCO---DISCO---DISCO---DISCO---");
	});
});

http.listen(port, () => {
	console.log(`listening on localhost at port: ${port}`);
});
