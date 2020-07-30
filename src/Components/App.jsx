import React, { useReducer } from "react"
import { BrowserRouter, Route, Switch } from "react-router-dom"
import Watchlist from "./Watchlist"
import Portfolio from "./Portfolio"
import Header from "./Header"
import Login from "./Login"
import Register from "./Register"
import Profile from "./Profile"
import SearchBar from './Search'
import WatchlistAsync from "./WatchlistAsync"
// import StateContext from './store'
// import stateReducer from './stateReducer'

function reducer(state, action) {
  switch (action.type) {
      case "setSymbol": {
          return {
            ...state,
              symbol: action.data
          }
        }
      case "setPrice": {
          return {
            ...state,
              price: action.data
          } 
        }
      case "setName": {
          return {
            ...state,
              name: action.data
          }
        }
      case "setStartDate": {
          return {
            ...state,
              startDate: action.data
          }
      }
      case "setEndDate": {
          return {
            ...state,
              endDate: action.data
          }
      }
      case "addToWatchlist": {
        return{
          ...state,
          // watchlist: state.watchList.concat(action.data)
          watchlist: [...state.watchlist, action.data]

        }
      }
      default:
          return state
  }
}
const initialState = { symbol: undefined, price: undefined, name: undefined, startDate: undefined, endDate: undefined, watchlist: []}

export const StateContext = React.createContext()

function App() {
  // create a reducer

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <>
    <StateContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/watchlist" component={WatchlistAsync} />
          <Route exact path="/watchlist" component={Watchlist} />
          <Route exact path="/portfolio" component={Portfolio} />
          <Route exact path="/search" component={SearchBar} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/profile" component={Profile} />
        </Switch>
      </BrowserRouter>
    </StateContext.Provider>
    </>
  )
}

export default App
