import React from 'react'
import { NavLink } from "react-router-dom"
import "../Stylesheets/Header.scss"
import { Navbar} from "react-bootstrap"

export default function Header() {
    return (
        <Navbar>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
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
            </Navbar.Collapse>
        </Navbar>
    )
}
