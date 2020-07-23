import React from "react";
import * as _ from "lodash";
import "./Chats.view.scss";
import { Link } from "react-router-dom";

const Chats = ({ socket }) => {
	const [roomsData, setRoomsData] = React.useState([]);

	React.useEffect(() => {
		socket.emit("get_rooms", "chat");

		socket.on("get_rooms", (roomsData) => {
			console.log(roomsData, "Fetched chats");
			setRoomsData(roomsData);
		});
	}, []);

	return (
		<div className="chats">
			<h1>Chats</h1>
			{roomsData.map((room, index) => (
				<div key={index}>
					<p>
						Room {index} {room.title.replace("-", " ")}
					</p>
					<Link
						to={`/dashboard/chats/${room.title
							.replace(" ", "-")
							.toLowerCase()}`}
					>
						<button>Go to Room</button>
					</Link>
				</div>
			))}
		</div>
	);
};

export default Chats;
