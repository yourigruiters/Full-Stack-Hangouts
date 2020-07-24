import React from "react";
import "./Layout.scss";

const Layout = ({ children }) => {
	return <section className="layout">{children}</section>;
};

export default Layout;
