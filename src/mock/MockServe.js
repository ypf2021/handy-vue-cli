import Mock from 'mockjs'

import config from '../config/myConfig'
import { isRightWebsite } from "../utils/check"
const { baseUrl, useMock } = config

Mock.setup({
    timeout: '300-600'
})

export function MockServe(url, params, method = "post") {
    if (!useMock) {
        return false
    }
    const allUrl = isRightWebsite(url) ? url : baseUrl + url
    const baseResponse = {
        code: 200,
        message: "成功"
    };
    if (!params.data) {
        let temp = params;
        params = {}
        params.data = temp
    }
    const resTemplate = { ...baseResponse, ...params }
    return Mock.mock(allUrl, method, resTemplate)
}