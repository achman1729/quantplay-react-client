import React, { useState, useEffect, useContext } from 'react'
import Axios from 'axios'
import "../Stylesheets/Search.scss"
import SearchCard from './SearchCard'
import {StateContext} from './App'

export default function Search() {
    const token = "token=cb0fa4bee45c5b25e4b7cdc1c74b3e54dd75720e"
    const tiingoApi = "https://api.tiingo.com/tiingo/daily/"
    const [visible, setVisible] = useState(false)

    let {state, dispatch} = useContext(StateContext)
    let { symbol } = state

    // setting date to the latest date a price that can be retrieved
    let today = new Date()
    const dd = String(today.getDate()-1).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0') //January is 0!
    const yyyy = today.getFullYear()
    today = mm + '-' + dd + '-' + yyyy
    const date = today
    var lastYear = yyyy - 1
    var oneYear = mm + '-' + dd + '-' + lastYear

    const onChange = (e) => {
        dispatch({type: 'setSymbol', data: e.target.value})
    }

    const onSubmit = (e) => {
        e.preventDefault()
        // constructing the API string
        Axios.get(`${tiingoApi + symbol}?${token}`)
        .then(res => {
            console.log(res.data.name)
            dispatch({type:'setName', data: res.data.name})
        })
        .catch(error => {
            console.log(error)
        })
        Axios.get(`${tiingoApi + symbol}/prices?startDate=${date}&format=json&&${token}`)
            .then(response => {
                console.log(response.data[0].close)
                dispatch({type: 'setPrice', data: response.data[0].close})
            })
            .catch(error => {
                console.log(error)
            })
        dispatch({type:'setStartDate', data: today })
        dispatch({type:'setEndDate', data: oneYear })

    }
 

    return (
        <div className="search-container">
            <div className="form-group">
                <form className="search-bar" onSubmit={onSubmit}>
                    <input className="form-control" type="text" id="search" name="search" placeholder="Search Stock.." onChange={onChange} />
                    <button className="btn btn-dark" onClick={() => {
                        setVisible(true)
                    }}>Search</button>
                </form>
                    {visible ? <SearchCard /> : null}
            </div>
        </div>
    )
}
