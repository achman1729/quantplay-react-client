import React from 'react'
import { NavLink } from "react-router-dom"
import "../Stylesheets/Header.scss"

export default function Header() {
    return (
        <div>
            <nav className="header">
                <NavLink
                exact
                activeClassName="navbar__link--active"
                className="navbar__link"
                to="/watchlist"
                >
                Watchlist
                </NavLink>
                <NavLink
                activeClassName="navbar__link--active"
                className="navbar__link"
                to="/portfolio"
                >
                Portfolio
                </NavLink>
                <NavLink
                activeClassName="navbar__link--active"
                className="navbar__link"
                to="/post"
                >
                Post
                </NavLink>
            </nav>
            <form className="search-bar">
                <input type="text" id="search" name="search" placeholder="Search Stock.." />
            </form>

        </div>
    )
}
