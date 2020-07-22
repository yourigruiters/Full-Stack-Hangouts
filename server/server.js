const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const port = 5000;

const rooms = [
	{
		id: 0,
		title: "Public-Lounge",
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
		title: "Public-Cinema",
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
];

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

// CREATE GENERAL FORM CHECKING FUNCTION

io.on("connection", (socket) => {
	socket.on("connect_visitor", (visitorData) => {
		console.log(visitorData, "second");
		socket.user = visitorData;

		socket.emit("connect_visitor");
	});

	socket.on("get_visitor", () => {
		console.log(socket.user, "HIHII");
		socket.emit("get_visitor", socket.user);
	});

	socket.on("get_rooms", (roomType) => {
		console.log(roomType, "HIHII");
		const filteredRooms = rooms.filter((room) => room.type === roomType);
		socket.emit("get_rooms", filteredRooms);
	});

	socket.on("disconnect", () => {
		// console.log('A user disconnected!');
	});
});

http.listen(port, () => {
	console.log(`listening on localhost at port: ${port}`);
});
