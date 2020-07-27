import React from "react";
import * as _ from "lodash";
import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import "./Chats.view.scss";
import Title from "../../components/title/Title";
import Paragraph from "../../components/paragraph/Paragraph";

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
		<section className="chats">
			<section className="chats__introduction">
				<article className="chats__introduction__content">
					<Title>Chats</Title>
					<Paragraph>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit quae
						quisquam, soluta, sapiente necessitatibus error doloribus
						perspiciatis accusantium aut accusamus officia blanditiis. Delectus
						nesciunt quas expedita.
					</Paragraph>
				</article>
				<article className="chats__introduction__button">
					<Button type="primary">Create a room</Button>
				</article>
			</section>
			<section className="chats__divider" />
			<section className="chats__filter">
				<article className="chats__filter__combo">
					<Paragraph>Category</Paragraph>
					<select>
						<option>...</option>
						<option>Cyka</option>
						<option>Blyat</option>
					</select>
				</article>
				<article className="chats__filter__combo">
					<Paragraph>Search</Paragraph>
					<input type="text" />
				</article>
			</section>
			<section className="chats__rooms">
				{roomsData.map((room, index) => (
					<section key={index}>
						<p>
							Room {index} {room.title}
						</p>
						<Link to={`/dashboard/chats/${room.slug}`}>
							<Button type="primary">Go to Room</Button>
						</Link>
					</section>
				))}
			</section>
		</section>
	);
};

export default Chats;
