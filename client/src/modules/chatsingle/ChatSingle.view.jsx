import React from "react";
import * as _ from "lodash";
import "./ChatSingle.view.scss";
import { Link } from "react-router-dom";

const ChatSingle = ({ socket, match }) => {
  const [messages, setMessages] = React.useState([]);
  const [chatInput, setChatInput] = React.useState("");
  const roomName = match.params.roomName;

	React.useEffect(() => {

		socket.emit("joining_room", roomName);

		socket.on("message", (messageObject) => {
      const { user, type, message } = messageObject;
			setMessages((prevState) => {
        const newMessage = {
          name: user, 
          timestamp: new Date(),
        };
        if(type === 'joined' || type === 'left') {
          newMessage.message = `has ${type} the chatroom`;
          newMessage.type = type;
        } else if (type === 'message') {
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
      message: chatInput
    }
    socket.emit('sending_message', message);
    setChatInput('');
  }

	return (
		<div className="chatsingle">
			<h1>ChatSingle</h1>

			<div className="chat">
				<p>MESSAGES</p>
				{messages.map((message, index) => (
					<div key={index}><p><span>{message.name}: </span>{message.message}</p></div>
				))}
			</div>
      <form onSubmit={(e) => sendChatMessage(e)}>
        <input type="text" value={chatInput} placeholder="Type something..." onChange={(e) => setChatInput(e.target.value)}/>
        <input type="button" value="Send Message" />
      </form>
		</div>
	);
};

export default ChatSingle;
