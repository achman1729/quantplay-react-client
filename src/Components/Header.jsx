import React, { Component } from 'react'
import { NavLink, withRouter } from "react-router-dom"
import "../Stylesheets/Header.scss"

class Header extends Component {

    logOut(e) {
        e.preventDefault()
        localStorage.removeItem('usertoken')
        this.props.history.push(`/`)
      }

    render(){
        const loginReglink = (
            <nav className="header">
                <NavLink
                exact
                className="navbar__link"
                to="/login"
                >
                Login
                </NavLink>
                <NavLink
                exact
                className="navbar__link"
                to="/register"
                >
                Register
                </NavLink>
            </nav>
        )

        const userLink = (
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
                <NavLink
                exact
                className="navbar__link"
                to="/profile"
                >
                Profile
                </NavLink>       
                <NavLink
                exact
                className="navbar__link"
                to=""
                onClick={this.logOut.bind(this)}
                >
                Logout
                </NavLink>
            </nav>
        )

        return (
            <div>
                <nav className="header">
                    {localStorage.usertoken ? userLink : loginReglink}
                </nav>
                <form className="search-bar">
                    <input type="text" id="search" name="search" placeholder="Search Stock.." />
                </form>

            </div>
        )
    }
}
// withRouter pass updated match, location, and history props to the wrapped component whenever it renders.
export default withRouter(Header)