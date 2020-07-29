import React from "react";
import "./Video.scss";
import Button from "../button/Button";
import Paragraph from "../paragraph/Paragraph";
import Input from "../input/Input";
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
	roomName,
	socket,
}) => {
	const [createIsOpen, setCreateIsOpen] = React.useState(false);
	const [formData, setFormData] = React.useState({
		link: "",
	});
	const [formErrors, setFormErrors] = React.useState({});

	const handleChange = (event) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const YouTubeGetID = (url) => {
		url = url.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
		console.log(url, "url parts");
		return undefined !== url[2] ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const checkFields = ["link"];
		const checkFieldErrors = {
			link: "Please enter a valid Youtube link",
		};
		const errors = {};
		let errorCounter = 0;

		checkFields.forEach((field) => {
			console.log("youtube link", YouTubeGetID(formData[field]));
			if (
				formData[field] === "" &&
				YouTubeGetID(formData[field]) !== undefined
			) {
				errors[field] = checkFieldErrors[field];
				errorCounter++;
			} else {
				errors[field] = "";
			}
		});

		if (errorCounter === 0) {
			const videoData = {
				roomName,
				link: formData.link,
			};
			// ADD TO QUEUE
			socket.emit("add_video", videoData);
			setCreateIsOpen(false);
		}

		setFormErrors(errors);
	};

	console.log(currentVideo, "isplayng");

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
				{currentVideo === "" && (
					<article className="video__missing">
						<p className="video__missing__title">
							The queue is empty, add a new video to the queue to start
							watching!
						</p>
					</article>
				)}
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
											<Paragraph>Youtube link:</Paragraph>
											<Input
												type="text"
												onChange={(e) => handleChange(e)}
												name="link"
												value={formData.link}
											/>
											{formErrors.link && (
												<p className="create-room__combo__error">
													{formErrors.link}
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
						{queue.map((queueItem, index) => (
							<h1 key={index}>{queueItem}</h1>
						))}
					</section>
				</section>
			</section>
		</section>
	);
};

export default Video;
