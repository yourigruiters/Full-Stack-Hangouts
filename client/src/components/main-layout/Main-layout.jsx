import React from "react";
import Button from "../button/Button";
import Title from "../title/Title";
import Paragraph from "../paragraph/Paragraph";
import Input from "../input/Input";
import Select from "../select/Select";
import "./Main-layout.scss";
import Room from "../room/Room";

const MainLayout = ({ title, type, paragraph, roomsData }) => {
	return (
		<section className="main-layout">
			<section className="main-layout__introduction">
				<article className="main-layout__introduction__content">
					<Title>{title}</Title>
					<Paragraph>{paragraph}</Paragraph>
				</article>
				<article className="main-layout__introduction__button">
					<Button type="primary">Create a room</Button>
				</article>
			</section>
			<section className="main-layout__divider" />
			<section className="main-layout__filter">
				<article className="main-layout__filter__combo">
					<Paragraph>Category:</Paragraph>
					<Select>
						<option></option>
						<option>Cyka</option>
						<option>Blyat</option>
					</Select>
				</article>
				<article className="main-layout__filter__combo">
					<Paragraph>Search:</Paragraph>
					<Input type="text" />
				</article>
			</section>
			<section className="main-layout__rooms">
				{roomsData.map((room, index) => (
					<Room key={index} room={room} type={type}></Room>
				))}
			</section>
		</section>
	);
};

export default MainLayout;
