import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import axios from "axios";
import {
	uniqueNamesGenerator,
	adjectives,
	animals,
} from "unique-names-generator";
import openSocket from "socket.io-client";

import Homepage from "./modules/homepage/Homepage.view";
import Videos from "./modules/videos/Videos.view";
import Chats from "./modules/chats/Chats.view";
import VideoSingle from "./modules/videosingle/VideoSingle.view";
import ChatSingle from "./modules/chatsingle/ChatSingle.view";

import Layout from "./components/layout/Layout";
import Sidebar from "./components/sidebar/Sidebar";

import "./App.scss";

const generateNameConfig = {
	dictionaries: [adjectives, animals],
	style: "capital",
	separator: " ",
	length: 2,
};

const socket = openSocket("localhost:5000");

const App = ({ history }) => {
	const [isLoading, setIsLoading] = React.useState(true);
	const [formError, setFormError] = React.useState(false);
	const [visitorData, setVisitorData] = React.useState({
		name: "",
		country: "",
		countryCode: "",
	});

	// Whether to display sidebar or not
	const showSidebarArray = ["/"];
	const currentPage = history.location.pathname;
	const showSidebar = !showSidebarArray.includes(currentPage);

	// Setting up connection to application
	// Could be a new visitor or an sessionVisitor
	React.useEffect(() => {
		let visitor = {};
		const sessionVisitorData = JSON.parse(localStorage.getItem("userData"));
		// FIX - IF PAGE IS NOT / (ROOT) - SEND TO ROOT
		console.log("What is sessionVisitorData", sessionVisitorData);

		if (!sessionVisitorData) {
			// FIX - TAKE URL AND SEND USER BACK TO THAT URL IN THE END
			history.push("/");
			axios
				.get("http://geoplugin.net/json.gp")
				.then((res) => {
					const { geoplugin_countryCode, geoplugin_countryName } = res.data;

					visitor = {
						name: uniqueNamesGenerator(generateNameConfig),
						countryCode: geoplugin_countryCode,
						country: geoplugin_countryName,
					};

					console.log("setting visitor", visitor);
					setVisitorData(visitor);
				})
				.catch((err) => console.error(err.message));
		} else {
			// FIX - [Take from fix above] - IF USER WANTS TO ACTUALLY GO TO HOMEPAGE
			// WE DO SEND THEM TO OUR MAIN PAGE (VIDEOS)
			visitor = {
				name: sessionVisitorData.name,
				countryCode: sessionVisitorData.countryCode,
				country: sessionVisitorData.country,
			};
			socket.emit("connect_visitor", visitor);
			console.log(currentPage, "currentpage");
			if (currentPage === "/") {
				console.log("Sending to videos");
				history.push("/dashboard/videos");
			} else {
				history.push(currentPage);
			}
		}

		setIsLoading(false);
	}, []);

	return (
		<>
			<Switch>
				{isLoading ? (
					<>
						<h1>Loading...</h1>
					</>
				) : (
					<>
						{!showSidebar ? (
							<Route
								path="/"
								exact
								render={(props) => (
									<Homepage
										{...props}
										socket={socket}
										visitorData={visitorData}
										setVisitorData={setVisitorData}
										formError={formError}
										setFormError={setFormError}
									/>
								)}
							/>
						) : (
							<main>
								<Sidebar />
								<Layout>
									<Route
										path="/dashboard/videos/"
										exact
										render={(props) => <Videos {...props} socket={socket} />}
									/>
									<Route
										path="/dashboard/videos/:roomName"
										exact
										render={(props) => (
											<VideoSingle {...props} socket={socket} />
										)}
									/>
									<Route
										path="/dashboard/chats/"
										exact
										render={(props) => <Chats {...props} socket={socket} />}
									/>
									<Route
										path="/dashboard/chats/:roomName"
										exact
										render={(props) => (
											<ChatSingle {...props} socket={socket} />
										)}
									/>
								</Layout>
							</main>
						)}
					</>
				)}
			</Switch>
		</>
	);
};

export default withRouter(App);
