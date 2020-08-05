/**
 * created by itwangyang 2020-8-5
 * 封装的local
 */

export default {
  // get
  get(key) {
    return JSON.parse(localStorage.getItem(key))
  },
  // set
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  // remove
  remove(key) {
    localStorage.removeItem(key)
  },
  // clear
  clear() {
    localStorage.clear()
  }
}