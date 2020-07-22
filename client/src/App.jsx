import React from 'react';
import axios from 'axios';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { Switch, Route, withRouter } from 'react-router-dom';
import openSocket from 'socket.io-client';
import Homepage from './modules/homepage/Homepage.view';
import Dashboard from './modules/dashboard/Dashboard.view';

const generateNameConfig = {
  dictionaries: [adjectives, animals],
  style: 'capital',
  separator: ' ',
  length: 2,
};

const socket = openSocket("localhost:5000");

const App = ({ history }) => {
  
  const [ visitorData, setVisitorData ] = React.useState({name: "123", country: "", countryCode: ""});

  React.useEffect(() => {

      let visitor = {};
      const tempNotFakeStorage = true;
      // CHECK IF ANYTHING IS COMING FROM SESSIONSTORAGE
      if(tempNotFakeStorage) {
        axios.get("http://geoplugin.net/json.gp")
        .then(res => {
            const {
                geoplugin_countryCode,
                geoplugin_countryName,
            } = res.data;
    
            visitor = {
                name: uniqueNamesGenerator(generateNameConfig),
                countryCode: geoplugin_countryCode,
                country: geoplugin_countryName,
            };
  
            console.log("setting visitor", visitor);
            setVisitorData(visitor)
            // SEND TO SESSIONSTORAGE
          })
          .catch(err => console.error(err.message));
      } else {
        // visitor = {
        //   name: SESSIONSTORAGEEEE.NAME,
        //   countryCode: SESSIONSTORAGEEEE.NAME,
        //   country: SESSIONSTORAGEEEE.NAME,
      // }; 
      socket.emit("connect_visitor", visitor);
      }    
  
    

  }, [])

  return (
    <>
      <Switch>
        <Route path="/" exact render={(props) => <Homepage {...props} socket={socket} visitorData={visitorData} setVisitorData={setVisitorData} />} />
        <Route path="/dashboard" exact render={(props) => <Dashboard {...props} socket={socket} />} />
      </Switch>
    </>
  );
}

export default withRouter(App);
