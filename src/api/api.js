import { importAll } from '../utils/modules'

const modules = importAll(require.context('./', false, /\w+Api.js$/))

console.log("APImodules:", modules)

export default modules