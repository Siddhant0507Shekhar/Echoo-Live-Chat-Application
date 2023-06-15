import React from 'react'
import "./navbar.css";
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <div id='Navbar'>
            <div id='header'>
                <div id='main_header'>
                    ECHOO
                    <svg preserveAspectRatio="xMidYMid meet" data-bbox="5.137 5.637 188.725 188.725" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="5.137 5.637 188.725 188.725" role="presentation" aria-hidden="true"><g><path class="st0" d="M149.8,80l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3s-21.9-8.3-30.3,0l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3
		S141.4,88.3,149.8,80z"></path><path class="st0" d="M49.2,120l-37.8,37.8c-8.3,8.3-8.3,21.9,0,30.3s21.9,8.3,30.3,0l37.8-37.8c8.3-8.3,8.3-21.9,0-30.3
		S57.6,111.7,49.2,120z"></path><path class="st0" d="M149.8,120c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3l37.8,37.8c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3
		L149.8,120z"></path><path class="st0" d="M41.7,12c-8.3-8.3-21.9-8.3-30.3,0s-8.3,21.9,0,30.3L49.2,80c8.3,8.3,21.9,8.3,30.3,0s8.3-21.9,0-30.3L41.7,12
		z"></path></g></svg>
                </div>
                <div id='logout'><a href='/api/logout'>Logout</a></div>
            </div>
            <div id='nav'>
                <div className='nav_links'>
                    <Link to='/chat'>Chats</Link>
                </div>
                <div className='nav_links'>
                    <Link to='/group_settings'>Group Settings</Link>
                </div>
                <div className='nav_links'>
                    <Link to='/ad-min'>Admin</Link>
                </div>
            </div>
        </div>
    )
}

export default Navbar;