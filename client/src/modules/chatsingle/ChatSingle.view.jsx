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
		// console.log(isTyping, "TESTE");
	}, [chatInput]);

	React.useEffect(() => {
		socket.emit("joining_room", roomName);

		socket.on("started_typing", (user) => {
			setSendIsTyping(true);

			if (!isTyping.includes(user)) {
				setIsTyping((prevState) => {
					const newIsTyping = [...prevState, user];
					return newIsTyping;
				});
			}
		});

		socket.on("stopped_typing", (user) => {
			setSendIsTyping(false);
			console.log("stoppedtyping", user, isTyping.includes(user), isTyping);
			if (isTyping.includes(user)) {
				console.log(
					"#####################################################################",
					user
				);
				setIsTyping((prevState) => {
					const newIsTyping = [...prevState].filter((isTypingUser) => {
						console.log(isTypingUser, user, "Newistyping");
						if (isTypingUser !== user) {
							return isTypingUser;
						}
						return false;
					});
					return newIsTyping;
				});
			}
		});

		socket.on("message", (messageObject) => {
			const { user, type, message } = messageObject;
			setMessages((prevState) => {
				const newMessage = {
					name: user,
					timestamp: new Date().toISOString(),
				};
				if (type === "joined" || type === "left") {
					newMessage.message = `has ${type} the chatroom`;
					newMessage.type = type;
				} else if (type === "message") {
					newMessage.message = message;
					newMessage.type = type;
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
			socket.emit("started_typing", roomName);
			console.log("started typing");
		} else if (value.length === 0) {
			socket.emit("stopped_typing", roomName);
			console.log("stopped typing");
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
					isTyping.map((user, index) => {
						console.log("Istyping map function in HTML", isTyping);
						return user;
					})
				)}
			</div>
		</div>
	);
};

export default ChatSingle;
