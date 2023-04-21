// 序列化存储 && 添加过期时间
class Storage {
    constructor(name = "storage") {
        this.name = name;
    }

    /**
     * 设置缓存
     * @param {*} key
     * @param {*} value
     * @param {*} [expires=null]
     * @memberof Storage
     */
    setItem(key, value, expires = null) {
        let obj = {
            key: key,
            value: value
        };
        expires &&
            (obj.expires = expires) &&
            (obj.$startTime = new Date().getTime());
        if (obj.expires) {
            //如果obj.expires设置了的话
            //以obj.key为key，obj为值放进去
            localStorage.setItem(obj.key, JSON.stringify(obj));
        } else {
            //如果options.expires没有设置，就判断一下value的类型
            let type = Object.prototype.toString.call(obj.value);
            //如果value是对象或者数组对象的类型，就先用JSON.stringify转一下，再存进去
            if (type == "[object Object]") {
                obj.value = JSON.stringify(obj.value);
            }
            if (type == "[object Array]") {
                obj.value = JSON.stringify(obj.value);
            }
            localStorage.setItem(obj.key, obj.value);
        }
    }

    //拿到缓存
    getItem(key) {
        let item = localStorage.getItem(key);
        if (!item) {
            // 没有值时 item为null
            return false;
        }

        //先将拿到的试着进行json转为对象的形式
        try {
            item = JSON.parse(item);
        } catch (error) {
            //如果不行就不是json的字符串，就直接返回
            item = item;
        }
        //如果有startTime的值，说明设置了失效时间
        if (item.$startTime) {
            let date = new Date().getTime();
            //何时将值取出减去刚存入的时间，与item.expires比较，如果大于就是过期了，如果小于或等于就还没过期
            if (date - item.$startTime > item.expires) {
                //缓存过期，清除缓存，返回false
                localStorage.removeItem(key);
                return false;
            } else {
                //缓存未过期，返回值
                return item.value;
            }
        } else {
            //如果没有设置失效时间，直接返回值
            return item;
        }
    }
    //移出缓存
    removeItem(key) {
        localStorage.removeItem(key);
    }
    //移出全部缓存
    clear() {
        localStorage.clear();
    }
}

export default new Storage();
