// very similar with stock card in watchlist, this card for visulizing portfolio data

import React from 'react'
import {Container, Row, Col, Button} from 'react-bootstrap'
import "../Stylesheets/Card.scss"
import PortfolioData from '../PortfolioGet'
import PortfolioChart from './PortfolioChart'

const {series, name, trades, description, creator} = PortfolioData('myPort1')
// console.log(series.avg("close"))

// working on Card of watchlist
export default function CardPortfolio() {
    return (

            <Container fluid className="text-center bg-light p-1 border border-warning rounded-lg">
                <Row className="p-2">
                    <Col xs={3} id="symbol" className="h4">{name}</Col>
                    <Col xs={6} id="valueLatest" className="h3 text-success ">{series.atLast().get("close")}</Col>
                    <Col xs={3} id="avatar" >{creator}</Col>
                </Row>
                <Row>
                    <Col xs={6} >
                        <Row className="justify-content-center h6">
                            <Col id="premium"> 2.00% </Col><Col id="volatility"> 1.30% </Col><Col id="drawback"> 3.50% </Col>
                        </Row>
                        <Row className="justify-content-center small">
                            <Col> Premium </Col><Col> Volatility </Col><Col> Max-drawback </Col>
                        </Row>
                    </Col>
                    <Col xs={6} >
                        <Row className="justify-content-center h6">
                            <Col id="rtday"> 1.00% </Col><Col id="rtmonth"> 2.00% </Col><Col id="rtyear"> 3.00% </Col>
                        </Row>
                        <Row className="justify-content-center ">
                            <Col> day </Col><Col> month </Col><Col> year </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col xs={3} className="font-italic small text-wrap scroll">
                        <p>{description}</p>
                        {trades}
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
