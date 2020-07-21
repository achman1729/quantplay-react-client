import React from 'react'
import {Container, Row, Col, Button} from 'react-bootstrap'
import "../Stylesheets/Card.scss"
import ApiGet from '../ApiGet'
import PriceVol from './PriceVol'

const {series, seriesVolume} = ApiGet('aapl','2019-01-01','2019-12-31')

// working on Card of watchlist
export default function CardStock() {
    return (

            <Container fluid className="text-center bg-light p-1 border border-warning rounded-lg">
                <Row className="p-2">
                    <Col xs={5} id="symbol" className="h1 ">Symbol</Col>
                    <Col xs={5} id="rtprice" className="h1 display-4 text-success">123.45 usd</Col>
                    <Col xs={1} className="justify-content-end" id="rmbutton"><Button variant="outline-warning" size="xs" className="p-1">remove</Button></Col>
                </Row>
                <Row>
                    <Col xs={5} id="logo">Company Logo</Col>
                    <Col xs={6}>
                        <Row className="h1">
                            <Col id="rtday"> 1.00% </Col><Col id="rtmonth"> 2.00% </Col><Col id="rtyear"> 3.00% </Col>
                        </Row>
                        <Row>
                            <Col> day </Col><Col> month </Col><Col> year </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col xs={5} id="wiki" className="font-italic small">Wiki</Col>
                    <Col id="chart"><PriceVol series={series} seriesVolume={seriesVolume}/></Col>
                </Row>
            </Container>

    )
}