import React from "react";
import { Link, withRouter } from "react-router-dom";
import Button from "../button/Button";
import Paragraph from "../paragraph/Paragraph";
import "./Room.scss";
import { ChatLocked, ChatOpen, UserList } from "../../icons/icons";

const Room = ({ room, type, history }) => {
	const [passwordInput, setPasswordInput] = React.useState("");
	const [error, setError] = React.useState(false);

	const imageArr = {
		music:
			"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
		various:
			"https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
		chill:
			"https://images.unsplash.com/photo-1534276866337-55723bdee569?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
		animals:
			"https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1942&q=80",
		sports:
			"https://images.unsplash.com/photo-1552667466-07770ae110d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80",
		series:
			"https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80",
	};

	const goToRoom = () => {
		if (!room.private) {
			history.push(`/dashboard/${type}/${room.slug}/`);
		} else if (room.private && room.password === passwordInput) {
			history.push(`/dashboard/${type}/${room.slug}/${passwordInput}`);
		} else {
			setError(true);
		}
	};

	return (
		<section
			className="room"
			style={{ backgroundImage: `url(${imageArr[room.category]})` }}
		>
			<article className="room__overlay"></article>
			<article className="room__content">
				<section className="room__content__header">
					<section className="room__content__header__content">
						<article className="room__content__header__text">
							<Paragraph className="room__content__header__title">
								{room.title}
							</Paragraph>
							<Paragraph className="room__content__header__category">
								Category: {room.category}
							</Paragraph>
						</article>
					</section>
					<section className="room__content__header__content">
						<article className="room__content__header__people">
							<UserList />
							<h3 className="room__content__header__numbers">
								{room.users.length}/{room.maxUsers}
							</h3>
						</article>
					</section>
				</section>
				<section className="room__content__footer">
					<article className="room__content__footer__content">
						{room.private && (
							<input
								type="text"
								className="room__content__footer__input"
								placeholder="Enter password"
								value={passwordInput}
								onChange={(e) => setPasswordInput(e.target.value)}
							/>
						)}
						{error && (
							<article className="room__content__footer__error">
								Incorrect password
							</article>
						)}
					</article>
					<article className="room__content__footer__content">
						<Button type="primary" onClick={goToRoom}>
							Enter
						</Button>
					</article>
				</section>
			</article>
		</section>
	);
};

export default withRouter(Room);
