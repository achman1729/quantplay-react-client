import React, { useContext } from 'react'
import Card from './Card'
import ApiGet from '../ApiGet'
import {StateContext} from './App'

export default function Watchlist() {
    

    let {state, dispatch} = useContext(StateContext)
    let { symbol, startDate, endDate, watchlist } = state

    // const { series, seriesVolume, companyName, ticker, description } = watchlist
    
    const { series, seriesVolume, companyName, ticker, description } = ApiGet(symbol, startDate, endDate)
    // console.log(symbol)
    // console.log(companyName)
    return (
        // if (watchlist) {
        //     watchlist.forEach(watchItem => {
        //         <div>
        //         <Card series={watchItem.series} seriesVolume={watchItem.seriesVolume} companyName={watchItem.companyName} ticker={watchItem.ticker} description={watchItem.description} />
        //         </div>
        //     });
        // }
        <div>
            <Card series={series} seriesVolume={seriesVolume} companyName={companyName} ticker={ticker} description={description} />
        </div>
    )
}
