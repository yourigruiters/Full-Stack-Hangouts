import React from "react";
import "./Video.scss";
import Button from "../button/Button";
import ReactPlayer from "react-player";

const Video = ({
	queue,
	handleProgress,
	sendVideoState,
	playNextVideoInPlaylist,
	videoPlayerReference,
	currentVideo,
	isPlaying,
}) => {
	return (
		<section className="video">
			<section className="video__videosection__video">
				<ReactPlayer
					className="video__videosection__video__player"
					width="100%"
					height="100%"
					ref={videoPlayerReference}
					url={currentVideo}
					playing={isPlaying}
					controls={true}
					volume={null}
					muted={true}
					onProgress={(e) => handleProgress(e)}
					onSeek={(e) => console.log("onSeek", e)}
					onPlay={() => sendVideoState(true)}
					onPause={() => sendVideoState(false)}
					onEnded={() => playNextVideoInPlaylist()}
				/>
			</section>
			<section className="video__videosection__content">
				{/* <section className="video__videosection__content__info">
            <h2>Cat Licks Paws (10 Hour Version)</h2>
            <h4>1.123.345 Views</h4>
          </section> */}
				<section className="video__videosection__content__queue">
					<section className="video__videosection__content__queue__header">
						<h2>Playlist</h2>
						<Button type="primary">Add to Queue</Button>
					</section>
					<section className="video__videosection__content__queue__videos">
						{queue.map((video, index) => (
							<h1 key={index}>{video}</h1>
						))}
					</section>
				</section>
			</section>
		</section>
	);
};

export default Video;
