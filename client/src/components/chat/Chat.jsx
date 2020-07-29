import React from "react";
import "./Chat.scss";
import Button from '../button/Button'

const Chat = ({ messages, sendChatMessage, chatInput, handleChange, isTyping }) => {

  // scrollChat breaks scroll but 'works'
  const scrollChat = () => {
    const div = document.querySelector('.chatsection__body');
    div.scrollTop = div.scrollHeight - div.clientHeight;
  }

  const shiftSubmit = (e) => {
    if (e.keyCode === 13 && e.shiftKey) {

    } else if (e.keyCode === 13) {
      sendChatMessage(e)
    }
    scrollChat()
  }

  return <section className="chat">
  <section className="chatsection__body">
    <article className="chat__area">
      {messages.map((message, index) => (
        <article key={index} className="chat__message">
          <article className="chat__message--time">{message.timestamp}</article>
          <p className={`chat__message--text chat__message--${message.type}`}>
            <span><b>{message.name}: </b></span>
            {message.message}
          </p>
        </article>
      ))}
    </article>
  </section>

  <section className="chatsection__footer">
    <form onSubmit={(e) => {sendChatMessage(e)}} className="chat__input">
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
    {isTyping.length > 0 && isTyping.length > 2 ? (
					<p className="isTypingSpacer__text">Multiple people are typing...</p>
				) : (
					<p className="isTypingSpacer__text">
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
