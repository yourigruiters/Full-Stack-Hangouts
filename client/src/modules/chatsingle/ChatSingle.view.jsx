import React from "react";
import * as _ from "lodash";
import "./ChatSingle.view.scss";
import { Link } from "react-router-dom";
import Chat from '../../components/chat/Chat';

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
		<section className="chatsingle">
			<section className="chatsection">
				<section className="chatsection__header">
					<h1 className="chatsection__header--title">Title</h1>
					<article className="chatsection__header--buttons"> X X</article>
				</section>
					<Chat sendChatMessage={sendChatMessage} handleChange={handleChange} chatInput={chatInput} isTyping={isTyping} messages={messages}/>
			</section>
			<section className="usersection">
				<section className="usersection__header">
					<h2 className="usersection__header--title">People</h2>
				</section>
				<article className="usersection__content">Placeholder content</article>
			</section>
		</section>
	);
};

export default ChatSingle;
