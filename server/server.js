const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
	pingInterval: 30000,
	pingTimeout: 15000,
});

const port = 5000;

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
		private: false,
		password: "",
		category: "chill",
		maxUsers: 20,
		default: true,
		users: [
			{
				id: "ZAcruUixXkxDgUPHAAAB",
				name: "Systematic Flamingo",
				country: "Sweden",
				countryCode: "SE",
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
				country: "Sweden",
				countryCode: "SE",
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
				country: "Sweden",
				countryCode: "SE",
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
				country: "Sweden",
				countryCode: "SE",
			},
		],
		queue: [
			"https://www.youtube.com/watch?v=QoikCfr55So",
			"https://www.youtube.com/watch?v=BJkhMtvd_zQ",
			"https://www.youtube.com/watch?v=ClkLaDOo5zs",
		],
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
				country: "Sweden",
				countryCode: "SE",
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
				country: "Sweden",
				countryCode: "SE",
			},
		],
		queue: [],
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
				country: "Sweden",
				countryCode: "SE",
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
				country: "Sweden",
				countryCode: "SE",
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
				country: "Sweden",
				countryCode: "SE",
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
				country: "Sweden",
				countryCode: "SE",
			},
		],
		queue: [],
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
				country: "Sweden",
				countryCode: "SE",
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
				country: "Sweden",
				countryCode: "SE",
			},
		],
		queue: [],
		isTyping: [],
		playing: true,
		currentTime: 0,
	},
];

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
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

io.on("connection", (socket) => {
	socket.on("connect_visitor", (visitorData) => {
		const randomNumber = Math.floor(Math.random() * chatColors.length);
		const randomChatcolor = chatColors[randomNumber];
		socket.user = visitorData;
		socket.user.chatColor = randomChatcolor;
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

	socket.on("create_room", (roomData) => {
		const newRoom = roomData;

		newRoom.host = socket.user.name;

		rooms.push(newRoom);

		socket.emit("create_room", newRoom.slug);
	});

	socket.on("joining_room", (roomName) => {
		if (!socket.user) {
			socket.emit("room_not_found");
			return;
		}

		socket.join(roomName);

		let room = rooms.find((room) => room.slug === roomName);

		if (room === undefined) {
			socket.emit("room_not_found");
			return;
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
			chatColor: socket.user.chatColor,
		};

		const roomData = {
			title: room.title,
			privateroom: room.private,
			category: room.category,
			maxUsers: room.maxUsers,
			users: room.users,
			queue: room.queue,
			isTyping: room.isTyping,
			playing: room.playing,
			currentTime: room.currentTime,
		};

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
		io.to(roomName).emit("someone_left", usersStillThere);
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

	socket.on("next_video", (roomName) => {
		let room = rooms.find((room) => room.slug === roomName);
		const newPlaylist = room.queue;
		const newVideo = newPlaylist.shift();
		io.to(roomName).emit("next_video", newPlaylist, newVideo);
	});

	socket.on("video_progress", (roomName, stateObject) => {
		let room = rooms.find((room) => room.slug === roomName);
    if(Math.abs((room.currentTime - stateObject.playedSeconds)) > 3 ) {
      console.log('RUNNING SEEK TO SECOND', stateObject.playedSeconds, 'IN ROOM', room.slug)
      room.currentTime = stateObject.playedSeconds;
      io.to(roomName).emit("video_progress", room);
    } else {
      room.currentTime = stateObject.playedSeconds;
    }
	});

	socket.on("disconnect", () => {
		rooms.forEach((room) => {
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
				}

				emitTypingChange(room.slug, "stopped_typing", socket);
			}
		});
	});
});

http.listen(port, () => {
	console.log(`listening on localhost at port: ${port}`);
});
