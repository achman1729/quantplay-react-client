import React from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Watchlist from "./Watchlist"
import Portfolio from "./Portfolio"
import Post from "./Post"
import Header from "./Header"

function App() {
  return (
    <>
    <BrowserRouter>
      <Header />
      <Switch>
        <Route exact path="/watchlist" component={Watchlist} />
        <Route exact path="/portfolio" component={Portfolio} />
        <Route exact path="/post" component={Post} />
      </Switch>
    </BrowserRouter>
    </>
  )
}

export default App
