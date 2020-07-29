import React from "react";
import SingleOverlay from "../../components/single-overlay/Single-overlay";

const VideoSingle = ({ socket }) => {
	return <SingleOverlay type="videos" socket={socket} />;
};

export default VideoSingle;
