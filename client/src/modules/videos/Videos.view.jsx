import React from "react";
import MainLayout from "../../components/main-layout/Main-layout";

const Videos = ({ socket }) => {
	const [roomsData, setRoomsData] = React.useState([]);

	React.useEffect(() => {
		socket.emit("get_rooms", "videos");

		socket.on("get_rooms", (roomsData) => {
			setRoomsData(roomsData);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const mainLayoutData = {
		title: "Videos",
		type: "videos",
		paragraph:
			"Here in the video section you can filter through rooms and find a topic you are interested in - Create your own room to watch videos together with your friends or join a public room and make new ones.",
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

export default Videos;
