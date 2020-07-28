import React from "react";
import * as _ from "lodash";
import "./ChatSingle.view.scss";
import Chat from '../../components/chat/Chat';
import { ChatLock, UserList, LeftArrow } from "../../icons/icons";


const ChatSingle = ({ socket, match }) => {
	const [messages, setMessages] = React.useState([]);
	const [isTyping, setIsTyping] = React.useState([]);
	const [users, setUsers] = React.useState([]);
	// const [queue, setQueue] = React.useState([]);
	const [sendIsTyping, setSendIsTyping] = React.useState(false);
	const [chatInput, setChatInput] = React.useState("");
	const [toggleList, setToggleList] = React.useState(false);
	const [roomInfo, setRoomInfo] = React.useState([]);

	const roomName = match.params.roomName;

	React.useEffect(() => {
		socket.emit("joining_room", roomName);

		socket.on("room_data", (roomData) => {
			setIsTyping(roomData.isTyping);
			setUsers(roomData.users);
			// setQueue(roomData.queue);

			const { title, privateroom, category, maxUsers } = roomData;
			setRoomInfo({
				title: title,
				private: privateroom,
				category: category,
				maxUsers: maxUsers,
			})
		});

		socket.on("changed_typing", (isTypingPeople) => {
			setIsTyping(isTypingPeople);
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
					<section className="chatsection__header--start">
						<article className="chatsection__header--icon">
							<LeftArrow />
						</article>
						<h1 className="chatsection__header--title">{roomInfo.title}</h1>
					</section>
					<article className="chatsection__header--buttons">
						<article className="iconbutton__people">
	<h2 className="people__amount">{users.length}/{roomInfo.maxUsers}</h2>
							<UserList />
						</article>
						<article className="iconbutton__lock">
							<ChatLock />
						</article>
					</article>
				</section>
				<Chat sendChatMessage={sendChatMessage} handleChange={handleChange} chatInput={chatInput} isTyping={isTyping} messages={messages}/>
			</section>
			<section className="usersection">
				<section className="usersection__header">
					<span><a className="toggle" onClick={() => {
						!toggleList ? setToggleList(true) : setToggleList(false)
					}}><h2 className="usersection__header--title">{toggleList ? 'X' : '<' } People</h2></a>
					</span>
				</section>
				<article className={toggleList ? 'usersection__content toggle--show' : 'usersection__content toggle--hide'}>
				{users.map((user, index) => (
        <article key={index} className="chat__message">
          <p className="chat__message--text">
            <span>
              {user.name} - <b>{user.country}:</b>{" "}
            </span>
            {user.countryCode}
          </p>
        </article>
      ))}
				</article> 
			</section>
		</section>
	);
};

export default ChatSingle;
