import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import "../Stylesheets/Search.scss"

export default function Search() {
    const token = "token=cb0fa4bee45c5b25e4b7cdc1c74b3e54dd75720e"
    const tiingoApi = "/daily/"
    const [symbol, setSymbol] = useState()
    const [price, setPrice] = useState()
    const [name, setName] = useState()

    // setting date to the latest date a price that can be retrieved
    var today = new Date()
    var dd = String(today.getDate() - 3).padStart(2, '0')
    var mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    var yyyy = today.getFullYear()
    today = mm + '-' + dd + '-' + yyyy
    const date = today

    const onChange = (e) => {
        setSymbol(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()
        // constructing the API string
        Axios.get(`${tiingoApi + symbol}?${token}`)
        .then(res => {
            console.log(res.data.name)
            setName(res.data.name)
        })
        .catch(error => {
            console.log(error)
        })
        Axios.get(`${tiingoApi + symbol}/prices?startDate=${date}&format=json&&${token}`)
            .then(response => {
                console.log(response.data[0].close)
                setPrice(response.data[0].close)
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div className="search-container">
            <div className="form-group">
                <form className="search-bar" onSubmit={onSubmit}>
                    <input className="form-control" type="text" id="search" name="search" placeholder="Search Stock.." onChange={onChange} />
                    <button className="btn btn-dark">Search</button>
                </form>
                <div className="search-card">
                    <h1>Name: <span>{name}</span></h1><h3>Price: <span>{price}</span></h3>
                </div>
                <button className="btn btn-primary">Add to watchlist</button>
                <button className="btn btn-success">Add to portfolio</button>
            </div>
        </div>
    )
}
