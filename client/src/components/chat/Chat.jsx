import React from "react";
import "./Chat.scss";
import Button from '../button/Button'

const Chat = ({ messages, sendChatMessage, chatInput, handleChange, isTyping }) => {
  
  const shiftSubmit = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {         
      sendChatMessage(e)
    }
  }

  return <section className="chat">
  <section className="chatsection__body">
    <article className="chat__area">
      {messages.map((message, index) => (
        <article key={index} className="chat__message">
          <p className="chat__message--text">
            <span>
              {message.timestamp} - <b>{message.name}:</b>{" "}
            </span>
            {message.message}
          </p>
        </article>
      ))}
    </article>
  </section>
  <section className="chatsection__footer">
    <form onSubmit={(e) => sendChatMessage(e)} className="chat__input">
      <textarea
        value={chatInput}
        placeholder="Type something..."
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => shiftSubmit(e)}
        className="chat__input--text"
      />
      <Button type="primary">Send Message</Button>
    </form>
    <article className="isTypingSpacer">
    {isTyping.length > 0 && isTyping.length > 2 ? (
					<p>Multiple people are typing...</p>
				) : (
					<p>
						{isTyping.map((user, index) => {
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
				)}
    </article>
  </section>
  </section>
;
};

export default Chat;
