export default{
  base: 'http://192.168.1.142:3000',
  changeDate (timeString) {
    const timeDate = new Date(parseInt(timeString)).toLocaleString().replace(/\//g, '-').replace(/下|上/g, ' ').substring(0, 10);
    return timeDate;
  },
  resetLocalDate (key, val) {
    localStorage.setItem(key, JSON.stringify(val))
  },
  getLocalDate (key) {
    return JSON.parse(localStorage.getItem(key))
  },
  selectLocalDate (key, val) {
    let LocalDate = JSON.parse(localStorage.getItem(key))
    return LocalDate.filter((item) => item.id === id)
  },
  changePostBody (object) {
    return JSON.stringify(object).replace(/\"|{|}/g, '').replace(/\:/g, '=').replace(/\,/g, '&&')
  }
}
