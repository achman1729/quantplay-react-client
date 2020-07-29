import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import "../Stylesheets/Card.scss"
import PriceVol from './PriceVol'

export default function CardStock(props) {
    return (
        <Container fluid className="text-center bg-light p-1 border border-warning rounded-lg">
            <Row className="p-2">
                <Col xs={3} id="symbol" className="h1 ">{props.ticker}</Col>
                <Col xs={7} id="rtprice" className="h1 display-4 text-success">{props.series.atLast().get("close")}</Col>
                <Col xs={1} className="justify-content-end"><Button variant="outline-warning" size="xs" className="p-1">remove</Button></Col>
            </Row>
            <Row>
                <Col xs={3} className="justify-content-center h3">{props.companyName}</Col>
                <Col xs={9}>
                    <Row className="h1">
                        <Col id="rtday"> 1.00% </Col><Col id="rtmonth"> 2.00% </Col><Col id="rtyear"> 3.00% </Col>
                    </Row>
                    <Row>
                        <Col> day </Col><Col> month </Col><Col> year </Col>
                    </Row>
                </Col>
            </Row>
            <Row>
                <Col xs={3} className="font-italic small text-wrap scroll">{props.description}</Col>
                <Col id="chart" xs={9}><PriceVol series={props.series} seriesVolume={props.seriesVolume} /></Col>
            </Row>
        </Container>

    )
}
