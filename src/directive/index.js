const ms = require.context('./', false, /\w.js$/);
const modules = {};
ms.keys().forEach((item) => {
    const name = item.substring(2, item.length - 3);
    if (name === 'index') { return; }
    console.log("name",name)
    modules[name] = ms(item).default
});
console.log("directive.modules", modules)
export default {
    install(app) {
        for (let item in modules) {
            app.directive(item, modules[item])
        }
    }
}