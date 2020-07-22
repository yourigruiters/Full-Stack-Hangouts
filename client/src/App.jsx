import React from "react";
import axios from "axios";
import {
	uniqueNamesGenerator,
	adjectives,
	animals,
} from "unique-names-generator";
import { Switch, Route, withRouter } from "react-router-dom";
import openSocket from "socket.io-client";
import Homepage from "./modules/homepage/Homepage.view";
import Dashboard from "./modules/dashboard/Dashboard.view";
import Layout from "./components/layout/Layout";
import Sidebar from "./components/sidebar/Sidebar";
import Videos from "./modules/videos/Videos.view";
import Chats from "./modules/chats/Chats.view";

const generateNameConfig = {
	dictionaries: [adjectives, animals],
	style: "capital",
	separator: " ",
	length: 2,
};

const socket = openSocket("localhost:5000");

const App = ({ history }) => {
	const [isLoading, setIsLoading] = React.useState(true);
	const [visitorData, setVisitorData] = React.useState({
		name: "",
		country: "",
		countryCode: "",
	});

	const showSidebarArray = ["/"];
	const currentPage = history.location.pathname;
	const showSidebar = !showSidebarArray.includes(currentPage);
	console.log(showSidebar, "showsbra");

	React.useEffect(() => {
		let visitor = {};
		const sessionVisitorData = JSON.parse(localStorage.getItem("userData"));
		console.log(sessionVisitorData);
		// IF PAGE IS NOT / (ROOT) - SEND TO ROOT
		if (!sessionVisitorData) {
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
					// SEND TO SESSIONSTORAGE
				})
				.catch((err) => console.error(err.message));
		} else {
			visitor = {
				name: sessionVisitorData.name,
				countryCode: sessionVisitorData.countryCode,
				country: sessionVisitorData.country,
			};
			socket.emit("connect_visitor", visitor);
			// SHOULD PUSH TO WHERE THEY CAME FROM
			history.push("/dashboard/videos");
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
									/>
								)}
							/>
						) : (
							<>
								<Sidebar />
								<Layout>
									<Route
										path="/dashboard/videos/"
										exact
										render={(props) => <Videos {...props} socket={socket} />}
									/>
									<Route
										path="/dashboard/videos/:roomId"
										exact
										render={(props) => <Dashboard {...props} socket={socket} />}
									/>
									<Route
										path="/dashboard/chats/"
										exact
										render={(props) => <Chats {...props} socket={socket} />}
									/>
									<Route
										path="/dashboard/chats/:roomId"
										exact
										render={(props) => <Dashboard {...props} socket={socket} />}
									/>
								</Layout>
							</>
						)}
					</>
				)}
			</Switch>
		</>
	);
};

export default withRouter(App);
