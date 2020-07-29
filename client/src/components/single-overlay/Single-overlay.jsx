import React from "react";
import { withRouter } from "react-router-dom";
import "./Single-overlay.scss";
import Users from "../users/Users";
import Chat from "../chat/Chat";
import Video from "../video/Video";
import {
	ChatLocked,
	ChatOpen,
	UserList,
	Exit,
	BackArrow,
} from "../../icons/icons";

const SingleOverlay = ({ history, type, socket, match }) => {
	const [messages, setMessages] = React.useState([]);
	const [isTyping, setIsTyping] = React.useState([]);
	const [users, setUsers] = React.useState([]);
	const [sendIsTyping, setSendIsTyping] = React.useState(false);
	const [chatInput, setChatInput] = React.useState("");
	const [toggleList, setToggleList] = React.useState(false);
	const [error, setError] = React.useState(false);
	const [password, setPassword] = React.useState(false);
	const [roomInfo, setRoomInfo] = React.useState([]);

	// FROM CHRIS
	const [isPlaying, setIsPlaying] = React.useState(true);
	const [queue, setQueue] = React.useState([]);
	const [currentVideo, setCurrentVideo] = React.useState("");
	let videoPlayerReference = React.useRef(null);

	React.useEffect(() => {
		console.log("NEW VIDEO URL HAS ARRIVED, SHOULD START", isPlaying);
    // videoPlayerReference.playing = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentVideo, queue]);

	// STOP FROM CHRIS

	const roomName = match.params.roomName;

	React.useEffect(() => {
		socket.emit("joining_room", roomName);

		socket.on("room_not_found", () => {
			history.push(`/dashboard/${type}`);
		});

		socket.on("room_data", (roomData) => {
			// FROM CHRIS
			console.log("Checking current time", roomData.currentTime);
			if (roomData.currentTime !== 0 && videoPlayerReference.current) {
				// NOT WORKING ?
				console.log(videoPlayerReference);
				videoPlayerReference.current.seekTo(roomData.currentTime, "seconds");
			}
			setCurrentVideo(roomData.isPlaying);
			setQueue(roomData.queue);
			// STOP FROM CHRIS

			setIsTyping(roomData.isTyping);
			setUsers(roomData.users);

			const { title, privateroom, category, maxUsers } = roomData;
			setRoomInfo({
				title: title,
				private: privateroom,
				category: category,
				maxUsers: maxUsers,
			});
		});

		socket.on("changed_typing", (isTypingPeople) => {
			setIsTyping(isTypingPeople);
		});

		socket.on("message", (messageObject) => {
			const { user, type, message, chatColor } = messageObject;

			const today = new Date();
			let hour = today.getHours();
			hour = hour.toString().length === 2 ? hour : "0" + hour;
			let minutes = today.getMinutes();
			minutes = minutes.toString().length === 2 ? minutes : "0" + minutes;
			let seconds = today.getSeconds();
			seconds = seconds.toString().length === 2 ? seconds : "0" + seconds;
			const time = `${hour}:${minutes}:${seconds}`;

			setMessages((prevState) => {
				const newMessage = {
					name: user,
					timestamp: time,
					type,
					chatColor,
				};
				if (type === "joined" || type === "left") {
					newMessage.message = `has ${type} the chatroom`;
				} else if (type === "message") {
					newMessage.message = message;
				}

				return [...prevState, newMessage];
			});
		});

		socket.on("someone_left", (usersStillThere) => {
			setUsers(usersStillThere);
		});

		socket.on("leaving_room", () => {
			history.push(`/dashboard/${type}`);
		});

		// FROM CHRIS

		socket.on("playpause_changing", (isPlayingState) => {
			console.log("RECEIVED STATE", isPlayingState);
			setIsPlaying(isPlayingState);
		});

		socket.on("next_video", (newPlaylist, newVideo) => {
			console.log("Trying to set new video", newPlaylist, newVideo);
			setQueue((prevState) => {
				return newPlaylist;
			});
			setCurrentVideo((prevState) => {
				return newVideo;
			});
		});

		socket.on("video_progress", (roomData) => {
			setIsPlaying(true);
			videoPlayerReference.current.seekTo(roomData.currentTime, "seconds");
		});

    // STOP FROM CHRIS
    // eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const sendChatMessage = (event) => {
		event.preventDefault();

		if (chatInput === "") {
			setError(true);
			return;
		} else {
			setError(false);
		}

		const message = {
			room: roomName,
			message: chatInput,
		};

		socket.emit("sending_message", message);

		handleChange("");
	};

	const handleChange = (value) => {
		if (value.length === 1 && !sendIsTyping) {
			setSendIsTyping(true);
			socket.emit("started_typing", roomName);
		} else if (value.length === 0 && sendIsTyping) {
			setSendIsTyping(false);
			socket.emit("stopped_typing", roomName);
		}

		setChatInput(value);
	};

	const leaveRoom = () => {
		socket.emit("leaving_room", roomName);
	};

	// FROM CHRIS
	const sendVideoState = (videoState) => {
		socket.emit("playpause_changing", roomName, videoState);
	};

	const playNextVideoInPlaylist = () => {
		console.log("zero", "ask new video");
		socket.emit("next_video", roomName);
	};

	const handleProgress = (state) => {
		socket.emit("video_progress", roomName, state);
	};
	// STOP FROM CHRIS

	return (
		<section className="single-overlay">
			<section className="single-overlay__mainsection">
				<section className="single-overlay__mainsection__header">
					<section className="single-overlay__mainsection__header--start">
						<article
							className="single-overlay__mainsection__header--icon iconbutton"
							onClick={leaveRoom}
						>
							<BackArrow />
						</article>
						<h1 className="single-overlay__mainsection__header--title">
							{roomInfo.title}
						</h1>
					</section>

					<article className="single-overlay__mainsection__header--middle">
						<article
							className="iconbutton iconbutton--lock"
							onClick={() => {
								!password ? setPassword(true) : setPassword(false);
							}}
						>
							{roomInfo.privateroom ? <ChatLocked /> : <ChatOpen />}
						</article>
						<h4
							className={
								password && roomInfo.privateroom
									? "password password__active"
									: "password password__inactive"
							}
						>
							password
						</h4>
					</article>

					<section className="single-overlay__mainsection__header--end">
						<article className="buttons">
							<a
								className="buttons__toggle"
								onClick={() => {
									!toggleList ? setToggleList(true) : setToggleList(false);
								}}
							>
								<h4 className="iconbutton--people--amount">
									{users.length}/{roomInfo.maxUsers}
								</h4>
								<article className="iconbutton iconbutton--people">
									<UserList />
								</article>
							</a>
						</article>
					</section>
				</section>
				{type === "videos" ? (
					<Video
						queue={queue}
						handleProgress={handleProgress}
						sendVideoState={sendVideoState}
						playNextVideoInPlaylist={playNextVideoInPlaylist}
						videoPlayerReference={videoPlayerReference}
						currentVideo={currentVideo}
						isPlaying={isPlaying}
					/>
				) : (
					<Chat
						sendChatMessage={sendChatMessage}
						error={error}
						handleChange={handleChange}
						chatInput={chatInput}
						isTyping={isTyping}
						messages={messages}
					/>
				)}
			</section>

			<section
				className={
					toggleList
						? "subsection buttons__toggle--show"
						: "subsection buttons__toggle--hide"
				}
			>
				<section className="subsection__header">
					<a
						className="buttons__toggle--close"
						onClick={() => {
							!toggleList ? setToggleList(true) : setToggleList(false);
						}}
					>
						<article className="subsection__header--title iconbutton">
							<Exit />
						</article>
					</a>
				</section>
				<article className="subsection__content">
					{type === "videos" ? (
						<Chat
							sendChatMessage={sendChatMessage}
							error={error}
							handleChange={handleChange}
							chatInput={chatInput}
							isTyping={isTyping}
							messages={messages}
						/>
					) : (
						<Users users={users} />
					)}
				</article>
			</section>
		</section>
	);
};

export default withRouter(SingleOverlay);
