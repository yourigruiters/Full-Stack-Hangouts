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
console.log(room)
 // const { category } = room // Not used?
const imageArr = {
	music: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
	various: "https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
	chill: "https://images.unsplash.com/photo-1534276866337-55723bdee569?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
	animals: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1942&q=80",
	sports: "https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
	series: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80",
}

	return (
		<section className="room" style={{backgroundImage: `url(${imageArr[room.category]})` }}>
				<article className="room__header__text">
					<Paragraph className="room__header__title">{room.title}</Paragraph>
					<Paragraph className="room__header__category">Category: {room.category}</Paragraph>
				</article>
			<section className="room__header">
				<article className="room__header__people">
					<UserList />
					<h3 className="room__header__numbers">{room.users.length}/{room.maxUsers}</h3>
				</article>
			</section>
			<section className="room__footer">
				{!room.private ? <input type="text" className="room__footer__input" placeholder="Enter password"/> : ''}
				<Link to={`/dashboard/${type}/${room.slug}`}>
					<Button type="primary">Enter</Button>
				</Link>
			</section>
		</section>
	);
};

export default Room;
