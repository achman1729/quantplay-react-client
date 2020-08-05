import React, { useContext } from 'react'
import "../Stylesheets/Search.scss"
import {StateContext} from './App'
import Axios from 'axios'
import ApiGet from '../ApiGet'

export default function SearchCard() {

    let {state, dispatch} = useContext(StateContext)
    let { symbol, price, name, startDate, endDate, watchlist } = state
    const token = "token=cb0fa4bee45c5b25e4b7cdc1c74b3e54dd75720e"
    const tiingoApi = "/daily/"
    const sdate = endDate
    const edate = startDate

    // create an onclick event for each button
    // it should send the symbol and date range to watchlist

    const onClick = () => {
        // const data = { series, seriesVolume, companyName, ticker, description } = ApiGet(symbol, startDate, endDate)

        // Axios.get(`${tiingoApi + symbol}?${token}`)
        // .then(res => {
        //     Axios.get(`${tiingoApi + symbol}/prices?startDate=${sdate}&endDate=${edate}&format=json&&${token}`)
        //     .then(response => {
        //         // dispatch({type: 'addToWatchlist', data: });
        //         console.log(response.data)
        //         // meta
        //         console.log(res.data)
        //         let data = ApiGet(res.data, response.data)
        //         console.log(`data: ${data.ticker}` )
        //         dispatch({ type: 'addToWatchlist', data: data})
        //         console.log(`watchlist: ${watchlist}`)
                
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
        // })
        // .catch(err => {
        //     console.log(err)
        // })
    }

    return (
        <div>
            <div className="search-card">
                <h1>Name: <span>{name}</span></h1><h3>Price: <span>{price}</span></h3>
            </div>
            <button className="btn btn-primary" onClick={onClick}>Add to watchlist</button>
            <button className="btn btn-success">Add to portfolio</button>
        </div>
    )
}
