import React from "react";
import * as _ from "lodash";
import "./Chats.view.scss";
import { Link } from "react-router-dom";

const Chats = ({ socket }) => {
	// const [ visitor, setVisitor ] = React.useState({});
	const [roomsData, setRoomsData] = React.useState([]);

	React.useEffect(() => {
		// socket.emit('get_visitor');

		// socket.on("get_visitor", (visitorData) => {
		//     console.log(visitorData, "Fetching from Chats")
		//     setVisitor(visitorData);
		// })

		socket.emit("get_rooms", "chat");

		socket.on("get_rooms", (roomsData) => {
			console.log(roomsData, "Fetched chats");
			setRoomsData(roomsData);
		});
	}, []);

	// const name = _.get(visitor, "name", "");

	return (
		<div className="chats">
			<h1>Chats</h1>
			{/* <p>{name}</p> */}
			{roomsData.map((room, index) => (
				<div key={index}>
					<p>
						Room {index} {room.title.replace("-", " ")}
					</p>
					<Link to={`/dashboard/chat/${room.id}`}>
						<button>Go to Room</button>
					</Link>
				</div>
			))}
		</div>
	);
};

export default Chats;
