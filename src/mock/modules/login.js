import { MockServe } from '../MockServe'

const toLogin = MockServe(
    '/getMessage',
    {
        data: {
            'list|10': [
                {
                    'id|+1': 0,
                    'age|18-40': 20,
                    'sex|1': ['男', '女'],
                    name: '@cname',
                    email: '@email',
                    isShow: '@boolean'
                }
            ]
        }
    },
    'get'
)

const findByName = MockServe('/findByName', {
    data: {
        // 生成十个如下格式的数据
        'list|10': [
            {
                'id|+1': 1, // 数字从当前数开始依次 +1
                'age|18-40': 20, // 年龄为18-40之间的随机数字
                'sex|1': ['男', '女'], // 性别是数组中随机的一个
                name: '@cname', // 名字为随机中文名字
                email: '@email', // 随机邮箱
                isShow: '@boolean', // 随机获取boolean值
            },
        ],
    },
});

export default {
    toLogin,
    findByName
}