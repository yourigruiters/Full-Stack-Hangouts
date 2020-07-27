import React from "react";
import { Link } from "react-router-dom";
import Button from "../button/Button";
import Paragraph from "../paragraph/Paragraph";
import "./Room.scss";

const Room = ({ room }) => {
	return (
		<section className="room">
			<Paragraph>Room {room.title}</Paragraph>
			<Link to={`/dashboard/chats/${room.slug}`}>
				<Button type="primary">Go to Room</Button>
			</Link>
		</section>
	);
};

export default Room;
