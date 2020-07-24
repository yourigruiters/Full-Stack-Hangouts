import React from "react";
import * as _ from "lodash";
import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import "./Videos.view.scss";

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
						<Button type="primary">Go to Room</Button>
					</Link>
				</div>
			))}
		</div>
	);
};

export default Videos;
