import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Watchlist from "./Watchlist"
import Portfolio from "./Portfolio"
import Post from "./Post"
import Header from "./Header"
import Login from "./Login"
import Register from "./Register"
import Profile from "./Profile"
import SearchBar from './Search'

function App() {
  return (
    <>
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/watchlist" component={Watchlist} />
        <Route exact path="/portfolio" component={Portfolio} />
        <Route exact path="/post" component={Post} />
        <Route exact path="/search" component={SearchBar} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/profile" component={Profile} />
      </Switch>
    </BrowserRouter>
    </>
  )
}

export default App
