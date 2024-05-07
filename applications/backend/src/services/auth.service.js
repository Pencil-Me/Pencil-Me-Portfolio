import axios from 'axios'

const API_URL = 'http://' + location.hostname + ':5001/api/'

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        username: user.username.value,
        password: user.password.value
      })
      .then((response) => {
        if (response.data.token) {
          user.password.value = ''

          localStorage.setItem('jwt', JSON.stringify(response.data.token))
          localStorage.setItem('user', JSON.stringify(user))
        }
        return response.data
      })
  }

  register(user) {
    return axios
      .put(API_URL + 'register', {
        username: user.username.value,
        email: user.email.value,
        password: user.password.value
      })
      .then((response) => {
        return response.data
      })
  }

  requestPassword(user) {
    return axios
      .post(API_URL + 'request-password', {
        email: user.email.value
      })
      .then((response) => {
        return response.data
      })
  }

  setNewPassword(payload) {
    return axios
      .post(API_URL + 'set-new-password', {
        password_new: payload.passwordnew
      })
      .then((response) => {
        return response.data
      })
  }

  logout() {
    localStorage.removeItem('user')
    localStorage.removeItem('jwt')
  }
}

export default new AuthService()
