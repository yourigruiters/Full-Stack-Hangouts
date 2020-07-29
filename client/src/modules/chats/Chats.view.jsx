import React from "react";
import MainLayout from "../../components/main-layout/Main-layout";
import "./Chats.view.scss";

const Chats = ({ socket }) => {
	const [roomsData, setRoomsData] = React.useState([]);

	React.useEffect(() => {
		socket.emit("get_rooms", "chats");

		socket.on("get_rooms", (roomsData) => {
			setRoomsData(roomsData);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const mainLayoutData = {
		title: "Chats",
		type: "chats",
		paragraph:
			"Find a topic you are passionate about and join a room to discuss it with like-minded people. If you cannot find a room for you - Create one!"
	};

	return (
		<MainLayout
			title={mainLayoutData.title}
			type={mainLayoutData.type}
			paragraph={mainLayoutData.paragraph}
			roomsData={roomsData}
			socket={socket}
		/>
	);
};

export default Chats;
