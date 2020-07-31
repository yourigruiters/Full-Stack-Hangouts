import React from "react";
import Button from "../button/Button";
import "./Chat.scss";

const Chat = ({
	messages,
	sendChatMessage,
	chatInput,
	handleChange,
	isTyping,
	error,
}) => {
	const shiftSubmit = (e) => {
		if (e.keyCode === 13 && e.shiftKey) {
		} else if (e.keyCode === 13) {
			sendChatMessage(e);
		}
	};

	return (
		<section className="chat">
			<section className="chatsection__body">
				<article className="chat__area">
					{messages.map((message, index) => (
						<article key={index} className="chat__message">
							<article className="chat__message--time">
								{message.timestamp}
							</article>
							<p
								className={`chat__message--text chat__message--${message.type}`}
							>
								<span>
									<b
										style={{ color: message.chatColor }}
										className={`chat__user chat__user--${message.chatColor}`}
									>
										{message.name}: <br></br>
									</b>
								</span>
								{message.message}
							</p>
						</article>
					))}
				</article>
			</section>

			<section className="chatsection__footer">
				<form
					onSubmit={(e) => {
						sendChatMessage(e);
					}}
					className="chat__input"
				>
					<textarea
						value={chatInput}
						placeholder="Type something..."
						onChange={(e) => handleChange(e.target.value)}
						onKeyDown={(e) => shiftSubmit(e)}
						className="chat__input--text"
					/>
					<Button type="primary">Send</Button>
				</form>

				<article className="isTypingSpacer">
					<p className="isTypingSpacer__text">
						{error && <span>Can't send empty message!</span>}
						{isTyping.length > 0 && isTyping.length > 2
							? "Multiple people are typing..."
							: isTyping.map((user, index) => {
									let string = "";
									string += user.name;
									if (index === 0 && isTyping.length === 1) {
										string += " is typing...";
									} else if (index === 0) {
										string += " and ";
									}
									if (index === 1) {
										string += " are typing...";
									}
									return string;
							  })}
					</p>
				</article>
			</section>
		</section>
	);
};

export default Chat;
