import React from "react";
import "./Select.scss";

const Select = ({ type, name, onChange, children }) => {
	return (
		<select type={type} name={name} className="select" onChange={onChange}>
			{children}
		</select>
	);
};

export default Select;
