import React from "react";
import * as _ from "lodash";
import MainLayout from "../../components/main-layout/Main-layout";
import "./Chats.view.scss";

const Chats = ({ socket }) => {
	const [roomsData, setRoomsData] = React.useState([]);

	React.useEffect(() => {
		socket.emit("get_rooms", "chats");

		socket.on("get_rooms", (roomsData) => {
			setRoomsData(roomsData);
		});
	}, []);

	const mainLayoutData = {
		title: "Chats",
		type: "chats",
		paragraph:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit quae quisquam, soluta, sapiente necessitatibus error doloribus perspiciatis accusantium aut accusamus officia blanditiis. Delectus nesciunt quas expedita.",
	};

	return (
		<MainLayout
			title={mainLayoutData.title}
			type={mainLayoutData.type}
			paragraph={mainLayoutData.paragraph}
			roomsData={roomsData}
		/>
	);
};

export default Chats;
