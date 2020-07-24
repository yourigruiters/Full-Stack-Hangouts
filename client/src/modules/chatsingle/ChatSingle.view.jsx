import React from "react";
import * as _ from "lodash";
import "./ChatSingle.view.scss";
import { Link } from "react-router-dom";

const ChatSingle = ({ socket, match }) => {
	const [messages, setMessages] = React.useState([]);
	const [isTyping, setIsTyping] = React.useState([]);
	const [sendIsTyping, setSendIsTyping] = React.useState(false);
	const [chatInput, setChatInput] = React.useState("");

	const roomName = match.params.roomName;

	React.useEffect(() => {
		socket.emit("joining_room", roomName);

		socket.on("changed_typing", (user) => {
			setIsTyping(user);
		});

		socket.on("message", (messageObject) => {
			const { user, type, message } = messageObject;
			setMessages((prevState) => {
				const newMessage = {
					name: user,
					timestamp: new Date().toISOString(),
					type: type,
				};
				if (type === "joined" || type === "left") {
					newMessage.message = `has ${type} the chatroom`;
				} else if (type === "message") {
					newMessage.message = message;
				}

				return [...prevState, newMessage];
			});
		});
	}, []);

	const sendChatMessage = (event) => {
		event.preventDefault();

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

	return (
		<div className="chatsingle">
			<h1>ChatSingle</h1>

			<div className="chat">
				<p>MESSAGES</p>
				{messages.map((message, index) => (
					<div key={index}>
						<p>
							<span>
								{message.timestamp} - <b>{message.name}:</b>{" "}
							</span>
							{message.message}
						</p>
					</div>
				))}
			</div>
			<form onSubmit={(e) => sendChatMessage(e)}>
				<input
					type="text"
					value={chatInput}
					placeholder="Type something..."
					onChange={(e) => handleChange(e.target.value)}
				/>
				<input type="button" value="Send Message" />
			</form>
			<div className="isTypingSpacer">
				{isTyping.length > 0 && isTyping.length > 2 ? (
					<p>Multiple people are typing...</p>
				) : (
					isTyping.map((user, index) => <p key={index}>{user.name}</p>)
				)}
			</div>
		</div>
	);
};

export default ChatSingle;
