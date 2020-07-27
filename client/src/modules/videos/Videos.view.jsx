import React from "react";
import * as _ from "lodash";
import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
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

	return (
		<div className="videos">
			<h1>Videos</h1>
			{roomsData.map((room, index) => (
				<div key={index}>
					<p>
						Room {index} {room.title}
					</p>
					<Link to={`/dashboard/chats/${room.slug}`}>
						<Button type="primary">Go to Room</Button>
					</Link>
				</div>
			))}
		</div>
	);
};

export default Videos;
