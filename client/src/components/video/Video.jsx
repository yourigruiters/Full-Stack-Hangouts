import React from "react";
import "./Video.scss";
import Button from "../button/Button";
import Paragraph from "../paragraph/Paragraph";
import Input from "../input/Input";
import Select from "../select/Select";
import ReactPlayer from "react-player";
import FormOverlay from "../form-overlay/Form-overlay";

const Video = ({
	queue,
	handleProgress,
	sendVideoState,
	playNextVideoInPlaylist,
	videoPlayerReference,
	currentVideo,
	isPlaying,
}) => {
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
			// ADD TO QUEUE
			// socket.emit("create_room", SOMETHING);
		}

		setFormErrors(errors);
	};

	return (
		<section className="video">
			<section className="video__video">
				<ReactPlayer
					className="video__video__player"
					width="100%"
					height="100%"
					ref={videoPlayerReference}
					url={currentVideo}
					playing={isPlaying}
					controls={true}
					volume={null}
					muted={true}
					onProgress={(e) => handleProgress(e)}
					onSeek={(e) => console.log("onSeek", e)}
					onPlay={() => sendVideoState(true)}
					onPause={() => sendVideoState(false)}
					onEnded={() => playNextVideoInPlaylist()}
				/>
			</section>
			<section className="video__content">
				<section className="video__content__queue">
					<section className="video__content__queue__header">
						<h2>Playlist</h2>
						<article className="video__content__queue__header__buttons">
							<Button
								type="primary"
								onClick={() => setCreateIsOpen(!createIsOpen)}
							>
								Add to Queue
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
											{formErrors.category && (
												<p className="create-room__combo__error">
													{formErrors.category}
												</p>
											)}
										</article>

										<article className="create-room__buttons">
											<Button type="create">Create</Button>
											<Button
												type="cancel"
												onClick={() => setCreateIsOpen(false)}
											>
												Cancel
											</Button>
										</article>
									</form>
								</FormOverlay>
							)}
						</article>
					</section>
					<section className="video__content__queue__videos">
						{queue.map((video, index) => (
							<h1 key={index}>{video}</h1>
						))}
					</section>
				</section>
			</section>
		</section>
	);
};

export default Video;
