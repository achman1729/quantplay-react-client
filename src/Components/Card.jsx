import React from 'react'
import {Container, Row, Col, Button} from 'react-bootstrap'
import "../Stylesheets/Card.scss"
import ApiGet from '../ApiGet'
import PriceVol from './PriceVol'

const {series, seriesVolume, companyName, ticker, description} = ApiGet('aapl','2019-01-01','2019-12-31')

// working on Card of watchlist
export default function CardStock() {
    return (

            <Container fluid className="text-center bg-light p-1 border border-warning rounded-lg">
                <Row className="p-2">
                    <Col xs={3} id="symbol" className="h1 ">{ticker}</Col>
                    <Col xs={6} id="rtprice" className="h2 text-success">{series.atLast().get("close")}</Col>
                    <Col xs={2} ><Button variant="outline-warning" size="xs" className="p-1">remove</Button></Col>
                </Row>
                <Row>
                    <Col xs={3} className="justify-content-center h3">{companyName}</Col>
                    <Col xs={9}>
                        <Row className="h3">
                            <Col id="rtday"> 1.00% </Col><Col id="rtmonth"> 2.00% </Col><Col id="rtyear"> 3.00% </Col>
                        </Row>
                        <Row>
                            <Col> day </Col><Col> month </Col><Col> year </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col xs={3} className="font-italic small text-wrap scroll">{description}</Col>
                    <Col id="chart" xs={9}><PriceVol series={series} seriesVolume={seriesVolume}/></Col>
                </Row>
            </Container>

    )
}
