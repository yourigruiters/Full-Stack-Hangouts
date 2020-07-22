import React from 'react'
import * as _ from 'lodash';
import "./Dashboard.view.scss"

const Dashboard = ({ socket }) => {
    const [ visitor, setVisitor ] = React.useState({});

    React.useEffect(() => {
        socket.emit('get_visitor');
    
        socket.on("get_visitor", (visitorData) => {
            console.log(visitorData, "Fetching from Dashboard")
            setVisitor(visitorData);
        })  
    }, [])
    
    const name = _.get(visitor, "name", "");

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <p>{name}</p>
        </div>
    )
}

export default Dashboard
