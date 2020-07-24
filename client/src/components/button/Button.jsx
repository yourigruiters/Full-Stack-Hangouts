import React from "react";
import "./Button.scss";

const Button = ({ type, children }) => {
	return <button className={`button button--${type}`}>{children}</button>;
};

export default Button;
