import React from 'react'
import './Sidebar.scss'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    return (
        <div>
            <h1>Sidebar</h1>
            <NavLink to="/dashboard/videos" exact>Go to Videos</NavLink>
            <NavLink to="/dashboard/chats" exact>Go to Chats</NavLink>
        </div>
    )
}

export default Sidebar
