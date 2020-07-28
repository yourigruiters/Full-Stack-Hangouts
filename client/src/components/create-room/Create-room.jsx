import React from "react";
import "./Create-room.scss";
import Button from "../button/Button";
import Paragraph from "../paragraph/Paragraph";
import Input from "../input/Input";
import Select from "../select/Select";

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

const CreateRoom = ({ setCreateIsOpen, type }) => {
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

		console.log("test");

		const checkFields = ["title", "password", "category"];
		const checkFieldErrors = {
			title: "Please enter a valid title",
			password: "Please enter a valid password",
			category: "Please chose a category",
		};
		const errors = {};
		let errorCounter = 0;

		checkFields.forEach((field) => {
			console.log("formdata fields", formData[field]);
			if (formData[field] === "") {
				errors[field] = checkFieldErrors[field];
				errorCounter++;
			} else {
				errors[field] = "";
			}
		});

		console.log("errors", errors);

		if (errorCounter === 0) {
			console.log(formData.title.replace(" ", "_").toLowerCase());
			const roomData = {
				title: formData.title,
				slug: "public-lounge",
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

			// Create room, on recieve push to room.
			console.log("cookie", roomData);
		}

		setFormErrors(errors);
	};

	return (
		<section className="create-room">
			<form onSubmit={(e) => handleSubmit(e)}>
				<Paragraph>Title:</Paragraph>
				<Input
					type="text"
					onChange={(e) => handleChange(e)}
					name="title"
					value={formData.title}
				/>
				{formErrors.title && <p>ERROR</p>}

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
					{formErrors.category && <p>ERROR</p>}
				</article>
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

				<Paragraph>Password:</Paragraph>
				<Input
					type="text"
					onChange={(e) => handleChange(e)}
					name="password"
					value={formData.password}
				/>
				{formErrors.password && <p>ERROR</p>}
				<Button type="create">Create</Button>
				<Button type="cancel" onClick={() => setCreateIsOpen(false)}>
					Cancel
				</Button>
			</form>
		</section>
	);
};

export default CreateRoom;
