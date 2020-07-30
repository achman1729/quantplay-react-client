import React from 'react'
// import {Container, Row, Col} from "react-bootstrap"

import BuildPortfolio from './BuildPortfolio'
// import CardPortfolio from './CardPortfolio'
import CardPortfolioAsync from './CardPortfolioAsync'

export default function Portfolio() {
    return (
        <>
        <CardPortfolioAsync />
        <BuildPortfolio />
        </>
    )
}
