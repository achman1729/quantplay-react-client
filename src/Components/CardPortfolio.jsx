// very similar with stock card in watchlist, this card for visulizing portfolio data

import React from 'react'
import {Container, Row, Col, Button} from 'react-bootstrap'
import "../Stylesheets/Card.scss"
import PortfolioData from '../PortfolioGet'
import PortfolioChart from './PortfolioChart'

const {series, name, trades, description, creator, stats} = PortfolioData('myPort1')
// console.log(series.avg("close"))

// working on Card of watchlist
export default function CardPortfolio() {
    console.log(stats)
    return (

            <Container fluid className="text-center bg-light p-1 border border-warning rounded-lg">
                <Row className="p-2">
                    <Col xs={3} id="symbol" className="h4">{name}</Col>
                    <Col xs={6} id="valueLatest" className="h3 text-success ">{Math.round((series.atLast().get("close") + Number.EPSILON) * 100) / 100}</Col>
                    <Col xs={3} id="avatar" >{creator}</Col>
                </Row>
                <Row>
                    <Col xs={6} >
                        <Row className="justify-content-center h6">
                            <Col id="premium"> {Number.parseFloat(stats.premium * 100).toPrecision(2)}% </Col><Col id="volatility"> {Number.parseFloat(stats.volatility * 100).toPrecision(2)}% </Col><Col id="drawback"> {Number.parseFloat(stats.drawback * 100).toPrecision(2)}% </Col>
                        </Row>
                        <Row className="justify-content-center small">
                            <Col> Premium </Col><Col> Volatility </Col><Col> Max-drawback </Col>
                        </Row>
                    </Col>
                    <Col xs={6} >
                        <Row className="justify-content-center h6">
                            <Col id="rtday"> {Number.parseFloat(stats.dayReturn * 100).toPrecision(2)}% </Col><Col id="rtmonth"> {Number.parseFloat(stats.monthReturn * 100).toPrecision(2)}% </Col><Col id="rtyear"> {Number.parseFloat(stats.fullReturn * 100).toPrecision(2)}% </Col>
                        </Row>
                        <Row className="justify-content-center ">
                            <Col> day </Col><Col> month </Col><Col> all </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col xs={3} className="font-italic small text-wrap scroll">
                        <ul>{
                            trades.map(trade => (<li key={trade.date}>{trade.date + ", "
                                                    + trade.direction + ", "
                                                    + trade.target + ", "
                                                    + trade.percentage * 100 + "%"
                                                }</li>))
                        }
                        </ul>  
                    </Col>
                    <Col id="chart" xs={9}><PortfolioChart series={series} /></Col>
                </Row>
                <Row className="justify-content-around text-center">
                    <Button variant="outline-warning" size="lg" className="p-1">Edit</Button>
                    <Button variant="outline-warning" size="lg" className="p-1">Post</Button>
                    <Button variant="outline-warning" size="lg" className="p-1">Remove</Button>
                </Row>
            </Container>

    )
}
