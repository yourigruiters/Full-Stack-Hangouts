import React from "react";
import * as _ from "lodash";
import SingleOverlay from "../../components/single-overlay/Single-overlay";

const ChatSingle = ({ socket }) => {
	return <SingleOverlay type="chats" socket={socket} />;
};

export default ChatSingle;
