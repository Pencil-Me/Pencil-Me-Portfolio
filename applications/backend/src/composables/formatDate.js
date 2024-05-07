import moment from 'moment'

const formatDate = (value) => {
  return moment(String(value)).format('DD MMM YYYY')
}

export default formatDate
