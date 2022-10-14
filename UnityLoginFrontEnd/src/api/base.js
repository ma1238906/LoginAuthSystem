/**
 * 接口路径配置：
 * 一般文件目录：base.js  index.js 
 * 但是公司不一定
 *      config
 *          login  index.js config.js 
 *       index.js 
 *       xxxx.js 
 */

const base ={
    host:'https://5y5007l723.zicp.fun',//基础路径
    goodsList:'/api/api/projectList', //商品列表
    search:'/api/api/search',//搜索
    selectCategory:'/api/api/backend/itemCategory/selectItemCategoryByParentId',//类目选择
    upLoadUrl:'/api/api/upload',//上传图片接口 post
    addGoods:'/api/api/backend/item/insertTbItem',//添加商品接口
    deleteGoods:'/api/api/backend/item/deleteItemById',//删除商品接口
    login:'/api/login',//登陆接口

    loginInfo:'/api/getLoginInfo',//获取登陆记录
    searchById:'/api/searchByClient',//通过客户端id筛选登陆记录
    clientList:'/api/getClientList',//获取客户端列表分页
    clientAuth:'/api/setClientState',//设置客户端程序登陆权限
    programInfo:'/api/programList',//获取程序列表
    programAuth:'/api/updateProgram'//设置程序全局登陆权限
}

export default base;
