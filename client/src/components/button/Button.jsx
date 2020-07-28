import React from "react";
import "./Button.scss";

const Button = ({ type, onClick, children }) => {
	return (
		<button className={`button button--${type}`} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
