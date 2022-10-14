const express = require('express')
const router = express.Router()
//导入数据库 sqlFn('sql',[],res=>{})
const sqlFn = require('./mysql')
//导入模块 jsonwebtoken   密钥
const jwt = require('jsonwebtoken');
// config.jwtSecert
const config = require('./secert')

router.get('/', (req, res) => {
    res.send('hello')
})

//登录接口
/**
 * 语法：
 * 如60，"2 days"，"10h"，"7d"，Expiration time，过期时间
 *  jwt.sign({},'秘钥','过期时间,{expiresIn:20*1,'1day''1h'}')
 */

/**
 * 后台系统登录 login
 * 接受的字段：username,password
 * 测试：postman  
 */
router.post('/login', (req, res) => {
    let { username, password } = req.body
    //请求数据库
    let sql = "select * from admin where username=? and password=?";
    let arr = [username, password]
    sqlFn(sql, arr, result => {
        if (result.length > 0) {
            let token = jwt.sign({
                username: result[0].username,
                id: result[0].id
            }, config.jwtSecert, {
                expiresIn: 20 * 1
            })
            res.send({
                status: 200,
                data: token
            })
        } else {
            res.send({
                status: 404,
                msg: '信息错误'
            })
        }

    })
})

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/**
 * 客户端登陆接口
 * params:clientID programName ip/mac
 */
router.post("/clientLogin", (req, res) => {
    // var clientid = req.query.clientID;
    // var programname = req.query.programName;
    var clientid = req.body.clientID;
    var programname = req.body.programName;
    var ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddres || req.socket.remoteAddress || '';
    var info = {
        clientid: clientid,
        programname: programname,
        ip: ip
    }
    let sql = "select * from clientinfo where clientID=?"
    let arr = [info.clientid];
    sqlFn(sql, arr, result => {
        if (result.length > 0) {
            //存在该客户端
            var currentClient = result[0];
            let sql = "select * from programinfo where programName=?"
            let arr = [info.programname];
            sqlFn(sql, arr, result => {
                if (result.length > 0 && result[0].globalEntry == "true") {
                    //允许全局登陆
                    if (currentClient.allowLogin == "true") {
                        //该客户端允许登陆
                        res.send({ status: 200, msg: '允许登陆' })
                        writeLoginInfo(info.clientid, info.programname, info.ip)
                    }
                    else {
                        //该客户端不允许登陆
                        res.send({ status: 500, msg: '客户端不允许登陆' })
                    }
                }
                else {
                    //不允许全局登陆
                    res.send({ status: 500, msg: '未找到该程序或全局不允许登陆' })
                }
            })
        }
        else {
            //不存在该客户端
            let sql = "insert into clientinfo values(null,?,?,'','true')"
            let arr = [info.clientid, info.ip];
            sqlFn(sql, arr, result => {
                if (result.affectedRows > 0) {
                    //添加新客户端成功
                    let sql = "select * from programinfo where programName=?"
                    let arr = [info.programname];
                    sqlFn(sql, arr, result => {
                        if (result.length > 0 && result[0].globalEntry == "true") {
                            //全局允许登陆
                            res.send({ status: 200, msg: '允许登陆' })
                            writeLoginInfo(info.clientid, info.programname, info.ip)
                        }
                        else {
                            //全局不允许登陆
                            res.send({ status: 500, msg: '全局不允许登陆' })
                        }
                    })
                }
                else {
                    //添加新客户端失败
                    res.send({ status: 500, msg: '客户端添加失败' })
                }
            })

        }
    })

})

function writeLoginInfo(clientID, programName, ip) {
    let sql = "insert into projectlog values(null,?,?,?,?)"
    var currentTime = Date.now();
    var arr = [clientID, programName, currentTime, ip]
    sqlFn(sql, arr, result => {
        if (result.affectedRows > 0) {
            console.log('记录成功')
        }
    })
}

/**
 * 获取程序列表
 * params:page
 */
router.get("/programList", (req, res) => {
    const page = req.query.page || 1;
    const sqlLen = "select * from programinfo where id";//所有记录的长度
    sqlFn(sqlLen, null, data => {
        let len = data.length;
        const sql = "select * from programinfo order by id desc limit 8 offset " + (page - 1) * 8;
        sqlFn(sql, null, result => {
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: 8,
                    total: len
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })
})

/**
 * 通过客户ID筛选登陆记录
 */
router.get("/searchByClient", (req, res) => {
    var search = req.query.search;
    const sql = "select * from projectlog where clientID=?";
    const arr = req.query.search;
    sqlFn(sql, arr, (result) => {
        if (result.length > 0) {
            res.send({
                status: 200,
                result
            })
        } else {
            res.send({
                status: 500,
                msg: "暂无数据"
            })
        }
    })
})

/**
 * 添加程序接口
 * params： programName
 */
router.get("/addProgram", (req, res) => {
    var name = req.query.programName;
    var arr = [name]
    const sql = "insert into programinfo values(null,?,'true')";
    sqlFn(sql, arr, result => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: "添加程序成功"
            })
        }
        else {
            res.send({
                status: 500,
                msg: "添加程序失败"
            })
        }
    })
})

/**
 * 设置程序全局状态
 * params: programID programState
 */
router.get("/updateProgram", (req, res) => {
    var programid = req.query.programID;
    var state = req.query.programState;
    var arr = [state, programid];
    const sql = "UPDATE programinfo SET globalEntry=? WHERE id=?";
    sqlFn(sql, arr, result => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: "程序信息更新成功"
            })
        }
        else {
            res.send({
                status: 500,
                msg: "程序信息更新失败"
            })
        }
    })
})

/**
 * 获取登陆记录分页
 * params:page
 */
router.get("/getLoginInfo", (req, res) => {
    const page = req.query.page || 1;
    const sqlLen = "select * from projectlog where id";//所以记录的长度
    sqlFn(sqlLen, null, data => {
        let len = data.length;
        const sql = "select * from projectlog order by id desc limit 8 offset " + (page - 1) * 8;
        sqlFn(sql, null, result => {
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: 8,
                    total: len
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })
})

/**
 * 获取客户端分页
 * params:page
 */
router.get("/getClientList", (req, res) => {
    const page = req.query.page || 1;
    const sqlLen = "select * from clientinfo where id";//所有记录的长度
    sqlFn(sqlLen, null, data => {
        let len = data.length;
        const sql = "select * from clientinfo order by id desc limit 8 offset " + (page - 1) * 8;
        sqlFn(sql, null, result => {
            if (result.length > 0) {
                res.send({
                    status: 200,
                    data: result,
                    pageSize: 8,
                    total: len
                })
            } else {
                res.send({
                    status: 500,
                    msg: "暂无数据"
                })
            }
        })
    })
})

/**
 * 设置客户端是否可以登陆
 * params:clientID clientState
 */
router.get("/setClientState", (req, res) => {
    var clientid = req.query.clientID;
    var state = req.query.clientState;
    var arr = [state, clientid];
    const sql = "UPDATE clientinfo SET allowLogin=? WHERE id=?";
    sqlFn(sql, arr, result => {
        if (result.affectedRows > 0) {
            res.send({
                status: 200,
                msg: "客户端信息更新成功"
            })
        }
        else {
            res.send({
                status: 500,
                msg: "客户端信息更新失败"
            })
        }
    })
})

module.exports = router