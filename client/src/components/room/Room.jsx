import React from "react";
import { Link } from "react-router-dom";
import Button from "../button/Button";
import Paragraph from "../paragraph/Paragraph";
import "./Room.scss";

const Room = ({ room, type }) => {
	return (
		<section className="room">
			<Paragraph>{room.title}</Paragraph>
			<Link to={`/dashboard/${type}/${room.slug}`}>
				<Button type="primary">Visit room</Button>
			</Link>
		</section>
	);
};

export default Room;
