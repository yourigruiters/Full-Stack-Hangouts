import React from "react";
import * as _ from "lodash";
import MainLayout from "../../components/main-layout/Main-layout";
import "./Videos.view.scss";

const Videos = ({ socket }) => {
	const [roomsData, setRoomsData] = React.useState([]);

	React.useEffect(() => {
		socket.emit("get_rooms", "video");

		socket.on("get_rooms", (roomsData) => {
			console.log(roomsData, "Fetched rooms");
			setRoomsData(roomsData);
		});
	}, []);

	const mainLayoutData = {
		title: "Videos",
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

export default Videos;
