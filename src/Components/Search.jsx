import React, { useState, useEffect } from 'react'
import Axios from 'axios'

export default function Search() {
    const defaultSymbol = "goog"
    const token = "?token=cb0fa4bee45c5b25e4b7cdc1c74b3e54dd75720e"
    const tiingoApi = "/daily/"
    const [symbol, setSymbol] = useState(defaultSymbol)
    // const [bitcoinData, setBitcoinData] = useState({})

    const onChange = (e) => {
        setSymbol(e.target.value)
    }

    const onSubmit = (e) => {
        e.preventDefault()

        Axios.get(`${tiingoApi+symbol+token}`)
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error);
          });
    }

    return (
        <div>
            <form className="search-bar" onSubmit={onSubmit}>
                <input type="text" id="search" name="search" placeholder="Search Stock.." onChange={onChange} />
                <button>Search</button>
            </form>
        </div>
    )
}
