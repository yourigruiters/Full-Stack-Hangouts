import React from "react";
import * as _ from "lodash";
import "./Videos.view.scss";
import { Link } from "react-router-dom";

const Videos = ({ socket }) => {
	// const [ visitor, setVisitor ] = React.useState({});
	const [roomsData, setRoomsData] = React.useState([]);

	React.useEffect(() => {
		// socket.emit('get_visitor');

		// socket.on("get_visitor", (visitorData) => {
		//     console.log(visitorData, "Fetching from Videos")
		//     setVisitor(visitorData);
		// })

		socket.emit("get_rooms", "video");

		socket.on("get_rooms", (roomsData) => {
			console.log(roomsData, "Fetched rooms");
			setRoomsData(roomsData);
		});
	}, []);

	// const name = _.get(visitor, "name", "");

	return (
		<div className="videos">
			<h1>Videos</h1>
			{/* <p>{name}</p> */}
			{roomsData.map((room, index) => (
				<div key={index}>
					<p>
						Room {index} {room.title.replace("-", " ")}
					</p>
					<Link
						to={`/dashboard/videos/${room.title
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

export default Videos;
