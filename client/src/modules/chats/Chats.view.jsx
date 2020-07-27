import React from "react";
import * as _ from "lodash";
import MainLayout from "../../components/main-layout/Main-layout";
import "./Chats.view.scss";

const Chats = ({ socket }) => {
	const [roomsData, setRoomsData] = React.useState([]);

	React.useEffect(() => {
		socket.emit("get_rooms", "chat");

		socket.on("get_rooms", (roomsData) => {
			console.log(roomsData, "Fetched chats");
			setRoomsData(roomsData);
		});
	}, []);

	const mainLayoutData = {
		title: "Chats",
		paragraph:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit quae quisquam, soluta, sapiente necessitatibus error doloribus perspiciatis accusantium aut accusamus officia blanditiis. Delectus nesciunt quas expedita.",
	};

	return (
		<MainLayout
			title={mainLayoutData.title}
			paragraph={mainLayoutData.paragraph}
			roomsData={roomsData}
		/>
	);
};

export default Chats;
