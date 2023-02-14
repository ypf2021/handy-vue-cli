const ms = require.context('./', false, /\w+Api.js$/)
const modules = {}

// ms.keys()  ==>  ['./homeApi.js']
ms.keys().forEach((item) => {
    console.log(item)   // './homeApi.js'
    const name = item.substring(2, item.length - 3);
    // ms('./homeApi.js') ==> {homeApi:{接口函数}} 返回的是模块中暴露的内容
    modules[name] = ms(item).default
})
// console.log("ms.keys():", ms.keys())
// console.log("ms:", ms())

export default modules