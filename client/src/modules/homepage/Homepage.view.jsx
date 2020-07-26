import React from "react";
import * as _ from "lodash";
import "./Homepage.view.scss";
import Button from "../../components/button/Button";
import Paragraph from "../../components/paragraph/Paragraph";
import homepage from "../../images/homepage.jpg";

const Homepage = ({ socket, history, visitorData, setVisitorData }) => {
  const handleFormData = (event) => {
    setVisitorData({ ...visitorData, name: event.target.value });
  };

  const loginNewVisitor = (event) => {
    event.preventDefault();

    socket.emit("connect_visitor", visitorData);

    socket.on("connect_visitor", () => {
      localStorage.setItem("userData", JSON.stringify(visitorData));
      // SET 1st PARAM of Function to REdux
      history.push("/dashboard/videos");
    });
  };

  const name = _.get(visitorData, "name", "");

  return (
    <section className="homepage">
      <section className="homepage__spacer">
        <section className="homepage__spacer__content">
          <h1>
            Welcome, <span>{name}</span>.
          </h1>
          <Paragraph>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
            debitis ratione suscipit maiores necessitatibus sapiente labore fuga
            perspiciatis, maxime officiis.
          </Paragraph>
          <section className="homepage__spacer__content__form">
            <form onSubmit={(e) => loginNewVisitor(e)}>
              <label>Username</label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleFormData(e)}
              />
              <Button type="primary">Enter hangouts</Button>
            </form>
          </section>
        </section>
      </section>
      <section className="homepage__spacer homepage__spacer--background" />
    </section>
  );
};

export default Homepage;
