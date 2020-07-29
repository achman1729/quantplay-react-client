import api from './api' 
// import Axios from 'axios'

// the app is connected via the api.js

export const register = newUser=> {
    // posting to users/register the payload
    return api
    .post('users/register', {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      password: newUser.password
    })
    .then(response => {
      console.log('Registered')
    })
}

export const login = user => {
    // we will be setting usertoken inside the local storage with the response.data
    // response.data will contain the token which is the encoded object of our payload
    return api
      .post('/users/login', {
        email: user.email,
        password: user.password
      })
      .then(response => {
        if (response.data.error !== 'wrong password') {
          localStorage.setItem('usertoken', response.data)
        }
        return response.data
      })
      .catch(err => {
        console.log(err)
      })
  }

export const getProfile = user => {
    return api
        .get('users/profile', {
        //headers: { Authorization: ` ${this.getToken()}` }
        })
        .then(response => {
        console.log(response)
        return response.data
        })
        .catch(err => {
        console.log(err)
        })
}