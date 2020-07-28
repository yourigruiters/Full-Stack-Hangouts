import React from "react";
import * as _ from "lodash";
import "./VideoSingle.view.scss";
import { Link } from "react-router-dom";
import Button from "../../components/button/Button";
import ReactPlayer from 'react-player';


const VideoSingle = ({ socket, match }) => {
  const [messages, setMessages] = React.useState([]);
  const [isPlaying, setIsPlaying] = React.useState(true);

  const roomName = match.params.roomName;

	React.useEffect(() => {

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

  React.useEffect(() => {
    console.log("SENDING PLAYPAUSE CHANGE");
    socket.emit("playpause_changing", roomName, isPlaying);

    socket.on("playpause_changing", (isPlayingState) => {
      console.log('RECEEIVED FROM SERVER', isPlayingState);
      setIsPlaying(isPlayingState);
      console.log('PLAY STATE IS NOW', isPlaying);
    })
  }, [isPlaying]);


  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  }

	return (
		<section className="videosingle">
			<section className="videosection">
        <section className="videosection__header">
        <h1>Video Room Name</h1>
        </section>
        {/* COMPONENT HERE */}
        <section classname="videosection__video">
          <ReactPlayer 
            className="videosection__video__player"
            width='auto'
            height='auto'
            url={['https://www.youtube.com/watch?v=ysz5S6PUM-U', 'https://www.youtube.com/watch?v=Xzh8BdaaAvs']}
            playing={isPlaying}
            controls={true}
            volume={null}
            muted={true}
          />
          </section>
          <button onClick={() => handlePlayPause()}>{isPlaying ? 'Pause' : 'Play'}</button>
        
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
