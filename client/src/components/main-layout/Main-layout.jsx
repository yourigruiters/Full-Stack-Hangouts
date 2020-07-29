import React from "react";
import { withRouter } from "react-router-dom";
import Button from "../button/Button";
import Title from "../title/Title";
import Paragraph from "../paragraph/Paragraph";
import Input from "../input/Input";
import Select from "../select/Select";
import "./Main-layout.scss";
import Room from "../room/Room";
import FormOverlay from "../form-overlay/Form-overlay";

const categories = ["animals", "chill", "sports", "series", "music", "various"];
const maxUsers = [
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
];

const MainLayout = ({ title, type, paragraph, roomsData, socket, history }) => {
	const [filterData, setFilterData] = React.useState({
		category: "",
		search: "",
	});
	const [rooms, setRooms] = React.useState([]);
	const [isLoading, setIsLoading] = React.useState(true);
	const [createIsOpen, setCreateIsOpen] = React.useState(false);
	const [formData, setFormData] = React.useState({
		title: "",
		private: false,
		password: "",
		category: "",
		maxUsers: 20,
	});
	const [formErrors, setFormErrors] = React.useState({});

	const handleChange = (event) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const checkFields = ["title", "password", "category"];
		const checkFieldErrors = {
			title: "Please enter a valid title",
			password: "Please enter a valid password",
			category: "Please chose a category",
		};
		const errors = {};
		let errorCounter = 0;

		checkFields.forEach((field) => {
			if (formData[field] === "") {
				errors[field] = checkFieldErrors[field];
				errorCounter++;
			} else {
				errors[field] = "";
			}
		});

		if (errorCounter === 0) {
			const slug = formData.title.replace(/ /g, "_").toLowerCase();
			const roomData = {
				title: formData.title,
				slug: slug,
				type: type,
				host: "",
				private: formData.private,
				password: formData.password,
				category: formData.category,
				maxUsers: formData.maxUsers,
				default: false,
				users: [],
				queue: [],
				isTyping: [],
				playing: true,
				currentTime: 0,
			};

			socket.emit("create_room", roomData);
		}

		setFormErrors(errors);
	};

	React.useEffect(() => {
		socket.on("create_room", (slug) => {
			history.push(`/dashboard/${type}/${slug}`);
		});
	}, []);

	React.useEffect(() => {
		setRooms(roomsData);
		setIsLoading(false);
	}, [roomsData]);

	const handleFilterChange = (event) => {
		setFilterData({ ...filterData, [event.target.name]: event.target.value });
	};

	React.useEffect(() => {
		if (!isLoading) {
			let filteredRooms = roomsData;

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
					<Button type="primary" onClick={() => setCreateIsOpen(!createIsOpen)}>
						Create a room
					</Button>
					{createIsOpen && (
						<FormOverlay>
							<form onSubmit={(e) => handleSubmit(e)}>
								<article className="create-room__combo">
									<Paragraph>Title:</Paragraph>
									<Input
										type="text"
										onChange={(e) => handleChange(e)}
										name="title"
										value={formData.title}
									/>
									{formErrors.title && (
										<p className="create-room__combo__error">
											{formErrors.title}
										</p>
									)}
								</article>

								<article className="create-room__combo">
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
									{formErrors.category && (
										<p className="create-room__combo__error">
											{formErrors.category}
										</p>
									)}
								</article>

								<article className="create-room__combo">
									<Paragraph>maxUsers:</Paragraph>
									<Select onChange={(e) => handleChange(e)} name="maxUsers">
										{maxUsers.map((userAmount, index) => {
											return (
												<option key={index} value={userAmount}>
													{userAmount}
												</option>
											);
										})}
									</Select>
								</article>

								<article className="create-room__combo">
									<Paragraph>Password:</Paragraph>
									<Input
										type="text"
										onChange={(e) => handleChange(e)}
										name="password"
										value={formData.password}
									/>
									{formErrors.password && (
										<p className="create-room__combo__error">
											{formErrors.password}
										</p>
									)}
								</article>

								<article className="create-room__buttons">
									<Button type="create">Create</Button>
									<Button type="cancel" onClick={() => setCreateIsOpen(false)}>
										Cancel
									</Button>
								</article>
							</form>
						</FormOverlay>
					)}
				</article>
			</section>
			<section className="main-layout__divider" />
			<section className="main-layout__filter">
				<article className="main-layout__filter__combo">
					<Paragraph>Category:</Paragraph>
					<Select onChange={(e) => handleFilterChange(e)} name="category">
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
						onChange={(e) => handleFilterChange(e)}
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

export default withRouter(MainLayout);
