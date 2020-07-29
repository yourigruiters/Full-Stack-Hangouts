import React from "react";
import "./Video.scss";
import Button from "../button/Button";
import Paragraph from "../paragraph/Paragraph";
import Input from "../input/Input";
import ReactPlayer from "react-player";
import FormOverlay from "../form-overlay/Form-overlay";
import getYoutubeID from "get-youtube-id";

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

		const checkFields = ["link"];
		const checkFieldErrors = {
			link: "Please enter a valid Youtube link",
		};
		const errors = {};
		let errorCounter = 0;

		checkFields.forEach((field) => {
			if (formData[field] === "" || !YouTubeGetID(formData[field])) {
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
				{host === "" && <div>HAAAAAAAAAAAEREARER MAKE A FUCKING HOST</div>}
				<section className="video__content__queue">
					<section className="video__content__queue__header">
						<h2>Queue</h2>
						<h3>{host}</h3>
						{host === "" && (
							<Button type="primary" onClick={() => becomeHost()}>
								Become host
							</Button>
						)}
						{host === user && (
							<Button type="primary" onClick={() => playNextVideoInPlaylist()}>
								Next video
							</Button>
						)}
						{host !== user && host !== "" && (
							<Button type="primary" onClick={() => syncToHostProgress()}>
								Sync to host
							</Button>
						)}
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
					<section className="video__content__queue__table">
						<table>
							<thead>
								<tr>
									<td>#</td>
									<td>Title</td>
									<td>URL</td>
									<td>Thumbnail</td>
								</tr>
							</thead>
							<tbody>
								{queue.map((queueItem, index) => (
									<tr key={index}>
										<td colSpan="4">{queueItem}</td>
									</tr>
								))}
							</tbody>
						</table>
					</section>
				</section>
			</section>
		</section>
	);
};

export default Video;
