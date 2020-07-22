import React from "react";
import * as _ from "lodash";
import "./VideoSingle.view.scss";
import { Link } from "react-router-dom";

const VideoSingle = ({ socket, match }) => {
	// const [roomsData, setRoomsData] = React.useState([]);

	React.useEffect(() => {
		const roomId = match.params.roomId;

		// socket.emit("get_rooms", "video");

		// socket.on("get_rooms", (roomsData) => {
		// 	console.log(roomsData, "Fetched rooms");
		// 	setRoomsData(roomsData);
		// });
	}, []);

	// const name = _.get(visitor, "name", "");

	return (
		<div className="videosingle">
			<h1>VideoSingle</h1>

			<div className="chat"></div>
		</div>
	);
};

export default VideoSingle;
