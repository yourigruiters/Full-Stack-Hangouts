import React from "react";
import "./Form-overlay.scss";

const FormOverlay = ({ children }) => {
	return <section className="create-room">{children}</section>;
};

export default FormOverlay;
