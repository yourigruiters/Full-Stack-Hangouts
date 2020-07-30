import React from "react";
import "./Sidebar.scss";
import { NavLink, withRouter } from "react-router-dom";
import { NavbarVideos, NavbarChats, NavbavLogout } from "../../icons/icons";

const Sidebar = ({ history, socket }) => {
	const logout = () => {
		leavingThroughSidebar();
		localStorage.removeItem("userData");
		history.push("/");
	};

	const leavingThroughSidebar = () => {
		socket.emit("leaving_through_sidebar");
	};

	return (
		<section className="sidebar">
			<nav className="sidebar__nav">
				<NavLink to="/dashboard/videos">
					<article
						className="sidebar__nav__combo"
						onClick={leavingThroughSidebar}
					>
						<NavbarChats />
						<p>Videos</p>
					</article>
				</NavLink>
				<NavLink to="/dashboard/chats">
					<article
						className="sidebar__nav__combo"
						onClick={leavingThroughSidebar}
					>
						<NavbarVideos />
						<p>Chats</p>
					</article>
				</NavLink>
			</nav>
			<div className="sidebar__logout">
				<article
					className="sidebar__nav__combo sidebar__nav__combo--logout"
					onClick={logout}
				>
					<NavbavLogout />
					<p>Logout</p>
				</article>
			</div>
		</section>
	);
};

export default withRouter(Sidebar);
