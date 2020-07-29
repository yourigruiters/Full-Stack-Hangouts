import React from "react";
import { Link } from "react-router-dom";
import Button from "../button/Button";
import Paragraph from "../paragraph/Paragraph";
import "./Room.scss";
import {
	ChatLocked,
	ChatOpen,
	UserList,
} from "../../icons/icons";

const Room = ({ room, type }) => {
	console.log(room, type)
	return (
		<section className="room">
			<section className="room__header">
				<article className="room__header__text">
					<Paragraph className="room__header__title">{room.title}</Paragraph>
					<Paragraph className="room__header__category">{room.category}</Paragraph>
				</article>
				<article className="room__header__people">
					<UserList />
					<h3 className="room__header__numbers">{room.users.length}/{room.maxUsers}</h3>
				</article>
			</section>
			<section className="room__footer">
				{!room.private ? <input type="text" className="room__footer__input" placeholder="Enter password"/> : ''}
				<Link to={`/dashboard/${type}/${room.slug}`}>
					<Button type="primary">Visit room</Button>
				</Link>
			</section>
		</section>
	);
};

export default Room;
