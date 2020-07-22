import React from 'react'
import * as _ from 'lodash';
import "./Homepage.view.scss"

const Homepage = ({ socket, history, visitorData, setVisitorData }) => {
    const handleFormData = (event) => {
        setVisitorData({...visitorData, name: event.target.value})
    }
 
    const loginNewVisitor = (event) => {
        event.preventDefault();

        socket.emit('connect_visitor', visitorData);
    
        socket.on("connect_visitor", () => {
            localStorage.setItem('userData', JSON.stringify(visitorData));
            // SET 1st PARAM of Function to REdux
            history.push("/dashboard")
        })  
    }




    return (
        <div className="homepage">
            <form onSubmit={(e) => loginNewVisitor(e)}>
            <input type="text" value={_.get(visitorData, "name", "")} onChange={(e) => handleFormData(e)} />

            </form>
        </div>
    )
}

export default Homepage
