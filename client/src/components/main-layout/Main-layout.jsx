import React from "react";
import Button from "../button/Button";
import Title from "../title/Title";
import Paragraph from "../paragraph/Paragraph";
import Input from "../input/Input";
import Select from "../select/Select";
import "./Main-layout.scss";
import Room from "../room/Room";
import { filter } from "lodash";

const categories = ["animals", "chill", "sports", "series", "music", "various"];

const MainLayout = ({ title, type, paragraph, roomsData }) => {
	const [filterData, setFilterData] = React.useState({
		category: "",
		search: "",
	});
	const [rooms, setRooms] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(true);

	React.useEffect(() => {
		setRooms(roomsData);
		setIsLoading(false);
	}, [roomsData]);

	const handleChange = (event) => {
		console.log("sdfds");
		setFilterData({ ...filterData, [event.target.name]: event.target.value });
	};

	React.useEffect(() => {
		if (!isLoading) {
			let filteredRooms = roomsData;
			console.log(filteredRooms);
			if (filterData.category !== "") {
				filteredRooms = filteredRooms.filter(
					(room) => room.category === filterData.category
				);
			}
			if (filterData.search !== "") {
				filteredRooms = filteredRooms.filter((room) => {
					return Object.keys(room).some((keys) => {
						if (typeof room[keys] === "string")
							return room[keys]
								.toLowerCase()
								.includes(filterData.search.toLowerCase());
					});
				});
			}

			setRooms(filteredRooms);
		}
	}, [filterData]);

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
					<Select onChange={(e) => handleChange(e)} name="category">
						<option value=""></option>
						{categories.map((category, index) => {
							return (
								<option key={index} value={category}>
									{category}
								</option>
							);
						})}
					</Select>
				</article>
				<article className="main-layout__filter__combo">
					<Paragraph>Search:</Paragraph>
					<Input
						type="text"
						onChange={(e) => handleChange(e)}
						name="search"
						value={filterData.search}
					/>
				</article>
			</section>
			<section className="main-layout__rooms">
				{rooms.map((room, index) => (
					<Room key={index} room={room} type={type}></Room>
				))}
			</section>
		</section>
	);
};

export default MainLayout;
