// calculating stats of stock, parameter: series is from ApiGet()
export default function statsStock(series) {
    let v = series.toJSON().points // assume series period span more than one year
    let len = v.length
    let vL = v[len - 1][1]
    let latestDay = new Date(v[len - 1][0])
    let endingDayLastYear = new Date(latestDay.getFullYear() - 1, 12, 31)
    let endingDayLastYearIndex
    let continueLoop = true
    // in case last day is not a trading day so series contains only last trading day before end of the year
    for (let i = len - 2; continueLoop; i--) { 
        if (new Date(v[i][0]) <= endingDayLastYear ) {
            console.log('entered...')
            endingDayLastYear = new Date(v[i][0])
            endingDayLastYearIndex = i
            continueLoop = false
        }
    }

    let dayReturn = (vL - v[len - 2][1]) / v[len - 2][1]
    let rollingMonthReturn = (vL - v[len - 23][1]) / v[len - 23][1]
    let yearReturn = (vL - v[endingDayLastYearIndex][1]) / v[endingDayLastYearIndex][1]

    return {dayReturn: dayReturn, rollingMonthReturn: rollingMonthReturn, yearReturn: yearReturn}
}