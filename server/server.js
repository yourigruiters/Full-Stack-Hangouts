const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
	pingInterval: 30000,
	pingTimeout: 15000,
});
const cors = require("cors");

const port = process.env.PORT || 5000;

const chatColors = [
	"#1abc9c",
	"#16a085",
	"#2ecc71",
	"#27ae60",
	"#3498db",
	"#2980b9",
	"#9b59b6",
	"#8e44ad",
	"#f1c40f",
	"#f39c12",
	"#e67e22",
	"#d35400",
	"#e74c3c",
	"#c0392b",
];

let rooms = [
	{
		title: "Public Lounge",
		slug: "public-lounge",
		type: "chats",
		host: "",
		private: true,
		password: "bob",
		category: "chill",
		maxUsers: 20,
		default: true,
		users: [
			{
				id: "ZAcruUixXkxDgUPHAAAB",
				name: "Systematic Flamingo",
				country: "United States",
				countryCode: "US",
			},
			{
				id: "ZAcruUixXkxDgUPHAA123",
				name: "Thick Skink",
				country: "Mexico",
				countryCode: "MX",
			},
			{
				id: "ZAcruUixXkxDgUPHA345B",
				name: "Constitutional Cicada",
				country: "Japan",
				countryCode: "JP",
			},
		],
		queue: [],
		isTyping: [],
		playing: true,
		currentTime: 0,
	},
	{
		title: "Public Cinema",
		slug: "public-cinema",
		type: "videos",
		host: "",
		private: false,
		password: "",
		category: "chill",
		maxUsers: 20,
		default: true,
		users: [
			{
				id: "ZAcruUixXkxDgUPHAAAB",
				name: "Systematic Flamingo",
				country: "Mexico",
				countryCode: "MX",
			},
			{
				id: "ZAcruUixXkxDgUPHAA123",
				name: "Thick Skink",
				country: "United States",
				countryCode: "US",
			},
			{
				id: "ZAcruUixXkxDgUPHA345B",
				name: "Constitutional Cicada",
				country: "United States",
				countryCode: "US",
			},
		],
		queue: [],
		isPlaying: "https://www.youtube.com/watch?v=BAlx4kjI98g",
		isTyping: [],
		playing: true,
		currentTime: 0,
	},
	{
		title: "Animals playlist",
		slug: "animals-playlist",
		type: "videos",
		host: "",
		private: false,
		password: "",
		category: "animals",
		maxUsers: 20,
		default: true,
		users: [
			{
				id: "ZAcruUixXkxDgUPHAAAB",
				name: "Systematic Flamingo",
				country: "Mexico",
				countryCode: "MX",
			},
			{
				id: "ZAcruUixXkxDgUPHAA123",
				name: "Thick Skink",
				country: "United States",
				countryCode: "US",
			},
			{
				id: "ZAcruUixXkxDgUPHA345B",
				name: "Constitutional Cicada",
				country: "Sweden",
				countryCode: "SE",
			},
		],
		queue: [],
		isPlaying: "https://www.youtube.com/watch?v=BAlx4kjI98g",
		isTyping: [],
		playing: true,
		currentTime: 0,
	},
	{
		title: "Live soccer",
		slug: "live-soccer",
		type: "chats",
		host: "",
		private: false,
		password: "",
		category: "sports",
		maxUsers: 20,
		default: true,
		users: [
			{
				id: "ZAcruUixXkxDgUPHAAAB",
				name: "Systematic Flamingo",
				country: "Mexico",
				countryCode: "MX",
			},
			{
				id: "ZAcruUixXkxDgUPHAA123",
				name: "Thick Skink",
				country: "Sweden",
				countryCode: "SE",
			},
			{
				id: "ZAcruUixXkxDgUPHA345B",
				name: "Constitutional Cicada",
				country: "United States",
				countryCode: "US",
			},
		],
		queue: [],
		isTyping: [],
		playing: true,
		currentTime: 0,
	},
	{
		title: "Netflix",
		slug: "netflix-videos",
		type: "videos",
		host: "",
		private: false,
		password: "",
		category: "series",
		maxUsers: 20,
		default: true,
		users: [
			{
				id: "ZAcruUixXkxDgUPHAAAB",
				name: "Systematic Flamingo",
				country: "Mexico",
				countryCode: "MX",
			},
			{
				id: "ZAcruUixXkxDgUPHAA123",
				name: "Thick Skink",
				country: "United States",
				countryCode: "US",
			},
			{
				id: "ZAcruUixXkxDgUPHA345B",
				name: "Constitutional Cicada",
				country: "United States",
				countryCode: "US",
			},
		],
		queue: [],
		isPlaying: "https://www.youtube.com/watch?v=BAlx4kjI98g",
		isTyping: [],
		playing: true,
		currentTime: 0,
	},
	{
		title: "Music playlist",
		slug: "music-playlist",
		type: "videos",
		host: "",
		private: false,
		password: "",
		category: "music",
		maxUsers: 20,
		default: true,
		users: [
			{
				id: "ZAcruUixXkxDgUPHAAAB",
				name: "Systematic Flamingo",
				country: "United States",
				countryCode: "US",
			},
			{
				id: "ZAcruUixXkxDgUPHAA123",
				name: "Thick Skink",
				country: "Sweden",
				countryCode: "SE",
			},
			{
				id: "ZAcruUixXkxDgUPHA345B",
				name: "Constitutional Cicada",
				country: "Mexico",
				countryCode: "MX",
			},
		],
		queue: [],
		isPlaying: "https://www.youtube.com/watch?v=BAlx4kjI98g",
		isTyping: [],
		playing: true,
		currentTime: 0,
	},
];

app.use(cors());

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
	socket.on("connect_visitor", (visitorData) => {
		const randomNumber = Math.floor(Math.random() * chatColors.length);
		const randomChatcolor = chatColors[randomNumber];
		socket.user = visitorData;
		socket.user.chatColor = randomChatcolor;
		// FIX: Check visitorData to ensure everything is correct
		socket.emit("connect_visitor");
	});

	// CREATE GENERAL FORM CHECKING FUNCTION
	const emitMessage = (roomName, message) => {
		if (roomName && message) {
			io.to(roomName).emit("message", message);
		}
	};

	// CREATE GENERAL CHANGE IN TYPING FUNCTION
	const emitTypingChange = (roomName, type, socket) => {
		const roomIndex = rooms.findIndex((room) => room.slug === roomName);

		if (!socket.user) {
			socket.emit("room_not_found");
			return;
		}

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

	socket.on("get_visitor", () => {
		socket.emit("get_visitor", socket.user);
	});

	socket.on("get_rooms", (roomType) => {
		const filteredRooms = rooms.filter((room) => room.type === roomType);
		socket.emit("get_rooms", filteredRooms);
	});

	socket.on("create_room", (roomData) => {
		const newRoom = roomData;

		rooms.push(newRoom);

		socket.emit("create_room", newRoom.slug);
	});

	socket.on("joining_room", (roomName) => {
		if (!socket.user) {
			socket.emit("room_not_found");
			return;
		}

		socket.join(roomName);

		let roomIndex = rooms.findIndex((room) => room.slug === roomName);

		if (roomIndex === -1) {
			socket.emit("room_not_found");
			return;
		}

		const user = {
			id: socket.id,
			name: socket.user.name,
			country: socket.user.country || "Sweden",
			countryCode: socket.user.countryCode || "SE",
		};

		rooms[roomIndex].users.push(user);

		const message = {
			user: socket.user.name,
			type: "joined",
			chatColor: socket.user.chatColor,
		};

		const roomData = {
			title: rooms[roomIndex].title,
			privateroom: rooms[roomIndex].private,
			category: rooms[roomIndex].category,
			maxUsers: rooms[roomIndex].maxUsers,
			passwordToRoom: rooms[roomIndex].password,
			users: rooms[roomIndex].users,
			queue: rooms[roomIndex].queue,
			isPlaying: rooms[roomIndex].isPlaying,
			host: rooms[roomIndex].host,
			isTyping: rooms[roomIndex].isTyping,
			playing: rooms[roomIndex].playing,
			currentTime: rooms[roomIndex].currentTime,
		};

		console.log("JOINING ROOM, we're playying", roomData.isPlaying);

		emitMessage(roomName, message);
		io.to(roomName).emit("room_data", roomData);
	});

	socket.on("leaving_room", (roomName) => {
		const roomIndex = rooms.findIndex((room) => room.slug === roomName);

		if (roomIndex === -1) {
			socket.emit("leaving_room");
			return;
		}

		if (rooms[roomIndex].users.length < 1) {
			rooms.splice(roomIndex, 1);
			socket.emit("leaving_room");
			return;
		}

		const userIndex = rooms[roomIndex].users.findIndex(
			(user) => user.name === socket.user.name
		);

		const message = {
			user: socket.user.name,
			type: "left",
			chatColor: socket.user.chatColor,
		};

		rooms[roomIndex].users.splice(userIndex, 1);

		const usersStillThere = rooms[roomIndex].users;

		emitMessage(roomName, message);

		socket.emit("leaving_room");

		const isHost = rooms[roomIndex].host === socket.user.name;

		if (isHost) {
			rooms[roomIndex].host = "";
			io.to(room.slug).emit("new_host", "");
		}

		io.to(roomName).emit("someone_left", usersStillThere);
	});

	socket.on("leaving_through_sidebar", () => {
		rooms.forEach((room, index) => {
			const foundUser = room.users.findIndex(
				(user) => user.name === socket.user.name
			);

			if (foundUser !== -1) {
				room.users.splice(foundUser, 1);

				const message = {
					user: socket.user.name,
					type: "left",
					chatColor: socket.user.chatColor,
				};

				io.to(room.slug).emit("message", message);

				const isHost = rooms[index].host === socket.user.name;

				if (isHost) {
					rooms[index].host = "";
					io.to(room.slug).emit("new_host", "");
				}
			}

			emitTypingChange(room.slug, "stopped_typing", socket);
		});
	});

	socket.on("become_host", (roomName) => {
		const roomIndex = rooms.findIndex((room) => room.slug === roomName);

		rooms[roomIndex].host = socket.user.name;

		io.to(roomName).emit("new_host", socket.user.name);
	});

	socket.on("sending_message", (messageObject) => {
		messageObject.user = socket.user.name;
		messageObject.type = "message";
		messageObject.chatColor = socket.user.chatColor;
		emitMessage(messageObject.room, messageObject);
	});

	socket.on("started_typing", (roomName) => {
		emitTypingChange(roomName, "started_typing", socket);
	});

	socket.on("stopped_typing", (roomName) => {
		emitTypingChange(roomName, "stopped_typing", socket);
	});

	socket.on("playpause_changing", (roomName, isPlayingState) => {
		let room = rooms.find((room) => room.slug === roomName);
		room.playing = isPlayingState;
		io.to(roomName).emit("playpause_changing", isPlayingState);
	});

	socket.on("add_video", (videoData) => {
		const roomIndex = rooms.findIndex(
			(room) => room.slug === videoData.roomName
		);
		const newVideo = {
			user: videoData.user,
			title: videoData.title,
			link: videoData.link,
		};

		console.log(newVideo, "newVideo");

		rooms[roomIndex].queue.push(newVideo);

		io.to(videoData.roomName).emit("new_queue", rooms[roomIndex].queue);
	});

	socket.on("next_video", (roomName) => {
		const roomIndex = rooms.findIndex((room) => room.slug === roomName);
		let newVideo = "";
		if (rooms[roomIndex].queue.length !== 0) {
			newVideo = rooms[roomIndex].queue.shift();
			rooms[roomIndex].isPlaying = newVideo.link;
			newVideo = newVideo.link;
		} else {
			rooms[roomIndex].queue = [];
			newVideo = "";
		}

		const queueDetails = {
			queue: rooms[roomIndex].queue,
			newVideo: newVideo,
		};

		io.to(roomName).emit("next_video", queueDetails);
	});

	socket.on("sync_to_host", (roomName) => {
		const room = rooms.find((room) => room.slug === roomName);

		socket.emit("sync_to_host", room.currentTime);
	});

	socket.on("video_progress", (roomName, stateObject) => {
		let room = rooms.find((room) => room.slug === roomName);
		if (room.currentTime > 1 && stateObject.playedSeconds < 1) {
			return;
		}

		if (Math.abs(room.currentTime - stateObject.playedSeconds) > 3) {
			room.currentTime = stateObject.playedSeconds;
			io.to(roomName).emit("video_progress", room);
		} else {
			room.currentTime = stateObject.playedSeconds;
		}
	});

	socket.on("disconnect", () => {
		rooms.forEach((room, index) => {
			if (socket.user) {
				const foundUser = room.users.findIndex(
					(user) => user.name === socket.user.name
				);

				if (foundUser !== -1) {
					room.users.splice(foundUser, 1);

					const message = {
						user: socket.user.name,
						type: "left",
						chatColor: socket.user.chatColor,
					};

					io.to(room.slug).emit("message", message);

					const isHost = rooms[index].host === socket.user.name;

					if (isHost) {
						rooms[index].host = "";
						io.to(room.slug).emit("new_host", "");
					}
				}

				emitTypingChange(room.slug, "stopped_typing", socket);
			}
		});
	});
});

http.listen(port, () => {
	console.log(`listening on localhost at port: ${port}`);
});
