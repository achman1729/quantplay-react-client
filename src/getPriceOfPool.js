import Axios from 'axios'
import formatDate from './formatDate'

// from pool(of stocks) and begin(date string, ex. '2017-12-31'), return array of objects, each containing a symbol and it's price info
export default async function getPriceOfPool(pool, begin) {
    let results = [] // array, each element is (json)object passing to PortfolioData()
    const token = "token=cb0fa4bee45c5b25e4b7cdc1c74b3e54dd75720e"
    const tiingoApi = "/daily/"

    const date = formatDate(new Date())
    let reqArray = []
    // function fetching stock prices from begin to today
    for (let i = 0; i < pool.length; i++) {
        let s = pool[i]
        // console.log('here ' + pool + ' here ' )
        // console.log(begin)
        // console.log(`${tiingoApi + s}/prices?startDate=${begin}&endDate=${date}&format=json&&${token}`)
        reqArray.push(Axios.get(`${tiingoApi + s}/prices?startDate=${begin}&endDate=${date}&format=json&&${token}`)
            .then(response => {
                console.log('here fetching')
                console.log(response.data)
                results.push({symbol: s, data: response.data})
            })
            .catch(error => {
                console.log(error)
            }))
    }
    Promise.all(reqArray).then((v) => {console.log(results)})
}
