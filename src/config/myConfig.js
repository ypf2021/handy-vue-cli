const config = {
    // 存入本地的token名
    tokenName: 'token',
    // 请求头上的token名（按后端给的来）
    headerToken: 'Authorization',
    // 基本地址
    baseUrl: 'http://localhost:8888',
    // 是否启用mock模拟数据
    useMock: true,
    // 是否启用路由拦截
    useBeforeEach: false,
    // 是否启用auth认证
    useAuth: false,
    // http 的auth设置
    auth: {
        username: 'testeradmin',
        password: 'testerpassword',
    }
};
export default config