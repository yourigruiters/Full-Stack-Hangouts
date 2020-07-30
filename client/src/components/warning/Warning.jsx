import React from "react";
import "./Warning.scss";

const Warning = ({ children, type }) => {
	return (
		<article className={`warning warning--${type}`}>
			<p>{children}</p>
		</article>
	);
};

export default Warning;
