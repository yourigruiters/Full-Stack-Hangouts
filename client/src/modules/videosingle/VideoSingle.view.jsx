import React from "react";
import * as _ from "lodash";
import "./VideoSingle.view.scss";
import { Link } from "react-router-dom";
import Button from "../../components/button/Button";


const VideoSingle = ({ socket, match }) => {
	const [messages, setMessages] = React.useState([]);

	React.useEffect(() => {
		const roomName = match.params.roomName;
		console.log(roomName, "IS CHANGING AT RANDOM TIMES");

		socket.emit("joining_room", roomName);

		socket.on("message", (messageObject) => {
			setMessages((prevState) => {
				const message = {
					name: messageObject.user,
					message: `${messageObject.user} has ${messageObject.type} the chatroom`,
					timestamp: new Date(),
					type: "join",
				};

				return [...prevState, message];
			});
		});
	}, []);

	return (
		<section className="videosingle">
			<section className="videosection">
        <section className="videosection__header">
        <h1>Video Room Name</h1>
        </section>
        {/* COMPONENT HERE */}
        <section classname="videosection__video">
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/ZLm6q1-S6gM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </section>
        <section className="videosection__content">
          <section className="videosection__content__info">
            <h2>Cat Licks Paws (10 Hour Version)</h2>
            <h4>1.123.345 Views</h4>
          </section>
          <section className="videosection__content__queue">
            <section className="videosection__content__queue__header">
              <h2>Playlist</h2>
              <Button type="primary">Add to Queue</Button>
            </section>
            <section className="videosection__content__queue__videos">
              <h1>Video 1</h1>
              <h1>Video 2</h1>
              <h1>Video 3</h1>
            </section>
          </section>
        </section>
        
      </section>
      <section className="videochatsection">
        <div className="videochatsection__header">
          <h1>Chat</h1>
        </div>
        <div className="videochatsection__chat">
          <h1>testing</h1>
        </div>
        {/* chat component here */}
      </section>
		</section>
	);
};

export default VideoSingle;
