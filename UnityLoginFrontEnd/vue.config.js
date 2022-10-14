//配置参数
/**
 * devServer.proxy 
 * 如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请 求代理到 API 服务器
 */
 module.exports = {
    publicPath:'./',
    // 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
    // devServer: {
        // proxy: {
            // '/api': {
                // target: 'http://localhost:7777',//
                // ws: true,
                // changeOrigin: true,
                // pathRewrite:{
                //     //重写路径
                //     '^/api':''
                // }
            // },
        // },
    // }

}
