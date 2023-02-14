import axios from 'axios'
import Qs from 'qs';

import BaseConfig from '../config/myConfig';

import { ElLoading, ElMessage } from 'element-plus';

const instance = axios.create({
    timeout: 5000,
    baseURL: BaseConfig.baseUrl
})

// loading ，使用loading 需要同时在config里面加入 loading = true 并传入 ELloading配置 
const LoadingInstance = {
    _target: null, // 保存Loading实例
    _count: 0
};

instance.interceptors.request.use(
    (config) => {

        // 先把以前的删了，在添加新的
        config.repeat_request_cancel && removePending(config)
        addPending(config)

        // 添加loading组件
        if (config.loading) {
            LoadingInstance._count++;
            if (LoadingInstance._count === 1) {
                LoadingInstance._target = ElLoading.service(config.loadingConfig)
            }
        }

        // 添加auth
        if (BaseConfig.useAuth) {
            BaseConfig.auth && (config.auth = BaseConfig.auth)
        }

        // 登录功能拓展是携带token，这个token需要存入自己的 localStorage
        const token = localStorage.getItem(BaseConfig.tokenName)
        // 如果需要携带token
        if (token && typeof window !== 'undefined') {
            config.headers[BaseConfig.headerToken] = token
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    (response) => {
        // console.log("response", response)

        // 在请求完成之后删掉
        removePending(response.config)

        // 关闭 loading
        const isLoading = response.config.loading
        isLoading && closeLoading(isLoading)

        return response.data
    },
    (error) => {
        //  如果发生了错误统一处理
        const { config, response } = error

        // 先把原来的删掉
        error.config && removePending(error.config);

        // 关闭动画
        const isLoading = config?.loading;
        isLoading && closeLoading(isLoading);
        // // 进行重连
        // if (config?.retryTimes) {
        //     const { _retryCount = 0, retryDelay = 3000, retryTimes } = config;
        //     config._retryCount = _retryCount;
        //     if (_retryCount >= retryTimes) {
        //         return responseStatus(response, error);
        //     }
        //     config._retryCount++
        //     // 延时处理
        //     const delay = new Promise((resolve) => {
        //         setTimeout(() => {
        //             console.log(_retryCount)
        //             resolve();
        //         }, retryDelay)
        //     })
        //     delay.then(function () {
        //         return instance(config)
        //     })
        // }

        return responseStatus(response, error);
    }
)

function responseStatus(response, error) {
    if (response) {
        // 请求不成功但返回结果
        let { errorText } = error?.config || '';
        let errorTextDefault = '';
        switch (response.status) {
            case 401:
                errorTextDefault = '请先登录哦~';
                break;
            case 403:
                errorTextDefault = '登录信息已过期~';
                break;
            case 404:
                errorTextDefault = '没有找到信息';
                break;
            case 500:
                errorTextDefault = '服务器好像有点忙碌哦';
                break;
            default:
                errorTextDefault = '好像有点问题哦';
        }
        errorText = errorText ? errorText : errorTextDefault;
        console.log(errorText)
    } else {
        if (!window.navigator.onLine) {
            // 处理断网，跳转404
            console.log('你的网寄了')
        } else {
            console.log("服务器维护中")
        }
    }
    return Promise.reject(error);
}

// 封装统一操作
function myAxios(config, loadingConfig = {}) {
    // 判断是否传参
    if (Object.prototype.toString.call(config) === '[object Object]') {
        const defaultConfig = {
            method: 'post',
            type: 'json'
        }
        // 根据参数类型修改请求头，调整参数
        config = Object.assign(defaultConfig, config);
        switch (config.type) {
            case 'json':
                config.headers = {
                    'Content-Type': 'application/json',
                };
                break;
            case 'formData':
                config.headers = {
                    'Content-Type': 'multipart/form-data',
                };
                const params = config.data;
                let newParams = null;
                if (params) {
                    newParams = new FormData();
                    for (const i in params) {
                        newParams.append(i, params[i]);
                    }
                }
                config.data = newParams;
                break;;
            case 'urlencoded':
                config.headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                };
                config.transformRequest = [
                    (data) => {
                        return Qs.stringify(data);
                    },
                ];
                break;
            default:
                break;
        }
        if (config.method === 'get') {
            config.params = config.data;
        }
        return instance(config, loadingConfig)
    }
}

// 存储请求的map
const pendingMap = new Map()

/**
 * 生成每个请求唯一的键
 * @param {*} config 
 * @returns string
 */
function getPendingKey(config) {
    let { url, method, params, data } = config;
    if (typeof data === 'string') data = JSON.parse(data); // response里面返回的config.data是个字符串对象
    return [url, method, JSON.stringify(params), JSON.stringify(data)].join('&')
}

/**
 * 储存每个请求唯一值, 也就是cancel()方法, 用于取消请求
 * @param {*} config 
 */
function addPending(config) {
    const pendingKey = getPendingKey(config);
    config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
        if (!pendingMap.has(pendingKey)) {
            pendingMap.set(pendingKey, cancel)
        }
    })
}

/**
 * 删除重复的请求
 * @param {*} config 
 */
function removePending(config) {
    const pendingKey = getPendingKey(config);
    if (pendingMap.has(pendingKey)) {
        const cancelToken = pendingMap.get(pendingKey);
        cancelToken(pendingKey);
        pendingMap.delete(pendingKey);
    }
}

/**
 * 关闭loading动画
 * 
 * @param {boolean} isloading
 */
function closeLoading(isloading) {
    if (isloading && LoadingInstance._count > 0) {
        LoadingInstance._count--;
    }
    if (LoadingInstance._count === 0) {
        LoadingInstance._target.close();
        LoadingInstance._target = null;
    }
}



export default myAxios