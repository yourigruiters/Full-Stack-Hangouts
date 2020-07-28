import React from "react";
import "./Input.scss";

const Input = ({ type, name, onChange }) => {
	return (
		<input
			type={type}
			name={name}
			onChange={onChange}
			className={`input input--${type}`}
		/>
	);
};

export default Input;
