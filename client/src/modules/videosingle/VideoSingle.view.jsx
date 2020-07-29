import React from "react";
import * as _ from "lodash";
import SingleOverlay from "../../components/single-overlay/Single-overlay";

const VideoSingle = ({ socket }) => {
	return <SingleOverlay type="videos" socket={socket} />;
};

export default VideoSingle;
