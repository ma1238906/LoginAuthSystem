/**
 * 请求的方法
 */

import axios from 'axios'
import base from './base'
const qs = require('querystring')

const api ={
    /**
     * 登陆接口
     */
    getLogin(params){//params={username:'',password:''}
        return axios.post(base.host+ base.login,qs.stringify(params))
    },
    /**
     * 商品列表
     */
    getGoodsList(params){//{page:xx}
        return axios.get(base.goodsList,{
            params
        })
    },
    /**
     * 搜索商品数据
     */
    getSearch(params){
        return axios.get(base.search,{
            params
        })
    },
    /**
     * 获取类目
     * {id:cid}
     */
    getSelectCategory(params){
        return axios.get(base.selectCategory,{
            params
        })
    },
    /**
     * 添加商品
     */
     addGoods(params){
        return axios.get(base.addGoods,{
            params
        })
    },
    /**
     * 删除商品
     */
    deleteGoods(params){
        return axios.get(base.deleteGoods,{
            params
        })
    },
    /**
     * 获取登陆记录
     */
    getLoginInfo(params){
        return axios.get(base.host+base.loginInfo,{
            params
        })
    },
    /**
     * 通过客户端ID获取登陆记录
     */
    getSearchByID(params){
        return axios.get(base.host+base.searchById,{
            params
        })
    },
    /**
     * 获取客户端列表分页
     */
    getClientList(params){
        return axios.get(base.host+base.clientList,{
            params
        })
    },
    /**
     * 设置客户端程序登陆权限
     * @param {*} params 
     */
    getClientAuth(params){
        return axios.get(base.host+base.clientAuth,{
            params
        })
    },
    /**
     * 获取程序列表分页
     */
    getProgramList(params){
        return axios.get(base.host+base.programInfo,{
            params
        })
    },
    /**
     * 设置程序全局登陆权限
     */
    getProgramAuth(params){
        return axios.get(base.host+base.programAuth,{
            params
        })
    }
}

export default api
