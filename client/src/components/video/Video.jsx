import React from "react";
import Button from "../button/Button";
import Paragraph from "../paragraph/Paragraph";
import Input from "../input/Input";
import ReactPlayer from "react-player";
import FormOverlay from "../form-overlay/Form-overlay";
import getYoutubeID from "get-youtube-id";
import Warning from "../warning/Warning";
import { Exit } from "../../icons/icons";
import "./Video.scss";

const Video = ({
	queue,
	handleProgress,
	sendVideoState,
	playNextVideoInPlaylist,
	videoPlayerReference,
	currentVideo,
	isPlaying,
	roomName,
	user,
	socket,
	host,
}) => {
	const [createIsOpen, setCreateIsOpen] = React.useState(false);
	const [formData, setFormData] = React.useState({
		link: "",
		title: "",
	});
	const [formErrors, setFormErrors] = React.useState({});

	const handleChange = (event) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};

	const YouTubeGetID = (url) => {
		const youtubeUrl = getYoutubeID(url);
		return youtubeUrl !== null;
	};

	const becomeHost = () => {
		socket.emit("become_host", roomName);
	};

	const syncToHostProgress = () => {
		socket.emit("sync_to_host", roomName);
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const checkFields = ["link", "title"];
		const checkFieldErrors = {
			link: "Please enter a valid Youtube link",
			title: "Please enter a valid title",
		};
		const errors = {};
		let errorCounter = 0;

		checkFields.forEach((field) => {
			if (
				formData[field] === "" ||
				(field === "link" && !YouTubeGetID(formData[field]))
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
				user,
				title: formData.title,
				link: formData.link,
			};

			socket.emit("add_video", videoData);
			setCreateIsOpen(false);
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
				{host === "" && (
					<Warning type="video">
						This room currently does not have an active host. Would you like to
						be in control of this room? Click on the <b>Become Host</b> button
						below and be in control!
					</Warning>
				)}
				<section className="video__content__queue">
					<section className="video__content__queue__header">
						{host === "" ? (
							<Button type="primary" onClick={() => becomeHost()}>
								Become Host
							</Button>
						) : (
							<p>
								Current host: <b>{host}</b>
							</p>
						)}
						<article className="video__content__queue__header__buttons">
							{host === user && (
								<Button
									type="primary"
									onClick={() => playNextVideoInPlaylist()}
								>
									Next Video
								</Button>
							)}
							{host !== user && host !== "" && (
								<Button type="primary" onClick={() => syncToHostProgress()}>
									Sync to Host
								</Button>
							)}
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
											<Button type="create">Add</Button>
											<a
												onClick={() => setCreateIsOpen(false)}
												className="create-room__buttons__exit"
											>
												<Exit />
											</a>
										</article>
									</form>
								</FormOverlay>
							)}
						</article>
					</section>
					<section className="video__content__queue__table">
						<h2>Queue</h2>
						<table>
							<thead>
								<tr>
									<th>#</th>
									<th>User</th>
									<th>Title</th>
									<th>URL</th>
								</tr>
							</thead>
							<tbody>
								{queue.length > 0 ? (
									queue.map((queueItem, index) => (
										<tr key={index}>
											<td>{index}</td>
											<td>{queueItem.user}</td>
											<td>{queueItem.title}</td>
											<td>{queueItem.link}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="4">
											There are currently no videos in the queue.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</section>
				</section>
			</section>
		</section>
	);
};

export default Video;
