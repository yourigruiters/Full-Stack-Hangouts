import React from "react";
import "./Select.scss";

const Select = ({ type, children }) => {
	return (
		<select type={type} className="select">
			{children}
		</select>
	);
};

export default Select;
