import React from "react";
import "./Sidebar.scss";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
	return (
		<section className="sidebar">
			<nav className="sidebar__nav">
				<NavLink to="/dashboard/videos" exact>
					Go to Videos
				</NavLink>
				<NavLink to="/dashboard/chats" exact>
					Go to Chats
				</NavLink>
			</nav>
		</section>
	);
};

export default Sidebar;
