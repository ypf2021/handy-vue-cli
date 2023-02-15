import { createStore } from 'vuex';
import { importAll } from '../utils/modules'

const modules = importAll(require.context('./modules', false, /\.js$/))

console.log("temp1 storeModules", modules)

for (const m in modules) {
  const { state, mutations } = modules[m];
  for (const i in state) {
    // 为每个 state 中的属性定义了一个 _newName 的mutation 可以用来修改这个属性的值
    const nameStr = '_new' + i;
    mutations[nameStr] = function (state, val) {
      state[i] = val;
    };
  }
}

console.log("temp2 storeModules", modules)

const store = createStore({ modules });  // 这里其实是 { modules：modules}， 缩写成{ modules }，
// modules 是一个对象 { modulesA:{action:{}, state:{}, mutations:{}}, modulesB:{action:{}, state:{}, mutations:{}} }
// 其实是模块化的处理
export default store;
