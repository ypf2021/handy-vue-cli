// 序列化存储


/**
 * 存储localstorafe
 * @export
 * @param {*} key
 * @param {*} value
 */
export function localSet(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 读取localStorage
 * @export
 * @param {*} key
 * @return {*} value || JSON.parse(value)
 */
export function localGet(key) {
    const value = window.localStorage.getItem(key)
    try {
        return JSON.parse(value)
    } catch (error) {
        return value
    }
}

/**
 * 删除指定loaclStorage
 * @export
 * @param {*} key
 */
export function localRemove(key) {
    window.localStorage.removeItem(key)
}

/**
 * 清空
 * @export
 */
export function clearLoacl() {
    window.localStorage.clear()
}