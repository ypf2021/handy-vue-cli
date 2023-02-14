const requireSvg = require.context('./svg', false, /\.svg$/)
// 函数 全部导入
const importAll = r => r.keys().map(r)

importAll(requireSvg)
