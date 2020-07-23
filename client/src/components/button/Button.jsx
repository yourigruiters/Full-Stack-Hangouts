import React from "react";
import "./Button.scss";

const Button = ({ type, children }) => {
	return <section className={`button button--${type}`}>{children}</section>;
};

export default Button;
