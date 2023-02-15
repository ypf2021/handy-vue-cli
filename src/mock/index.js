import { importAll } from '../utils/modules'

const modules = importAll(require.context('./modules', false, /\.js$/))


export default modules