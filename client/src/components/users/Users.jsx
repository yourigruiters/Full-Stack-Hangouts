import React from "react";
import "./Users.scss";

const Users = ({ users }) => {
	return (
		<section className="users">
			{users.map((user, index) => (
				<article key={index} className="users__peoplelist">
					<img
						src={`https://www.countryflags.io/${user.countryCode}/flat/64.png`}
						className="users__peoplelist__flag"
					/>
					<p className="users__peoplelist__text">{user.name}</p>
				</article>
			))}
		</section>
	);
};

export default Users;
