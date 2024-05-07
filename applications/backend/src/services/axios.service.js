import axios from 'axios'
import authHeader from './auth-header'
import store from '../stores'

class Axios {
  protected_get(url) {
    return axios
      .get(url, {
        headers: authHeader()
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        if (
          (error.response && error.response.data && error.response.data.code === 401) ||
          error.response.status === 401 ||
          error.code === 401
        ) {
          console.log('401 protected_get to ' + url)
          store.dispatch('auth/logout')
          this.$router.push('/login')
          return
        }
        return Promise.reject(error)
      })
  }
  get(url) {
    return axios.get(url).then((response) => {
      return response.data
    })
  }
  protected_post_multi(url, formData) {
    let header = authHeader()
    header['Content-Type'] = 'multipart/form-data'

    return axios
      .post(url, formData, {
        headers: header
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        if (
          (error.response && error.response.data && error.response.data.code === 401) ||
          error.response.status === 401 ||
          error.code === 401
        ) {
          console.log('401 protected_post_multi to ' + url)
          store.dispatch('auth/logout')
          return
        }
        return Promise.reject(error)
      })
  }
  protected_post(url, formData) {
    let header = authHeader()

    return axios
      .post(url, formData, {
        headers: header
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        if (
          (error.response && error.response.data && error.response.data.code === 401) ||
          error.response.status === 401 ||
          error.code === 401
        ) {
          console.log('401 protected_post to ' + url)
          store.dispatch('auth/logout')
          return
        }
        return Promise.reject(error)
      })
  }
  post(url, data) {
    return axios.post(url, data).then((response) => {
      return response.data
    })
  }
  put(url, data) {
    return axios.put(url, data).then((response) => {
      return response.data
    })
  }
  protected_put(url, data) {
    let header = authHeader()

    return axios
      .put(url, data, {
        headers: header
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        if (
          (error.response && error.response.data && error.response.data.code === 401) ||
          error.response.status === 401 ||
          error.code === 401
        ) {
          console.log('401 protected_put to ' + url)
          store.dispatch('auth/logout')
          return
        }
        return Promise.reject(error)
      })
  }
}

export default new Axios()
