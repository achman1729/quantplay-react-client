import React from 'react'
import "../Stylesheets/Search.scss"

export default function SearchCard(props) {
    const {name,  price, today, oneYear, symbol} = props

    // create an onclick event for each button
    // it should send the symbol and date range to watchlist

    return (
        <div>
            <div className="search-card">
                <h1>Name: <span>{name}</span></h1><h3>Price: <span>{price}</span></h3>
            </div>
            <button className="btn btn-primary">Add to watchlist</button>
            <button className="btn btn-success">Add to portfolio</button>
        </div>
    )
}
