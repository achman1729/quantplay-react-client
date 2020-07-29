import api from './api' 


// the app is connected via the api.js

export const replaceP = p => {
    // posting to create/replace portfolio
    console.log(p)
    return api
    .post('build', {
      first_name: p.first_name,
      last_name: p.last_name,
      email: p.email,
      name: p.name,
      begin: p.begin,
      cash: p.cash,
      benchmark: p.benchmark,
      trades: p.trades
    })
    .then(response => {
      console.log('portfolio created/replaced ' + response)
    })
}



export const getP = ps => {
    return api
        .get('ps', {
        //headers: { Authorization: ` ${this.getToken()}` }
        })
        .then(response => {
        console.log(response)
        return response
        })
        .catch(err => {
        console.log(err)
        })
}