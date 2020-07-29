import React from 'react'
import "../Stylesheets/Search.scss"

export default function SearchCard(props) {
    return (
        <div>
            <div className="search-card">
                <h1>Name: <span>{props.name}</span></h1><h3>Price: <span>{props.price}</span></h3>
            </div>
            <button className="btn btn-primary">Add to watchlist</button>
            <button className="btn btn-success">Add to portfolio</button>
        </div>
    )
}
