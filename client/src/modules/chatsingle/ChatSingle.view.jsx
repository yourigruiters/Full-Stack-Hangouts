import React from "react";
import SingleOverlay from "../../components/single-overlay/Single-overlay";

const ChatSingle = ({ socket }) => {
	return <SingleOverlay type="chats" socket={socket} />;
};

export default ChatSingle;
