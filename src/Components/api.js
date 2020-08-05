import Axios from 'axios'

export default Axios.create({
    baseURL: 'https://api.tiingo.com/tiingo/'
    // baseURL: 'http://localhost:8000/'

})
