import Somnus from './somnus'

export default {
  init(opts) {
    const somnus = new Somnus(opts)
    somnus.init()
    return somnus
  }
}
