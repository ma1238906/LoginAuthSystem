//搭建express服务
const express = require('express')
const app = express()
//post 请求表单数据
app.use(express.urlencoded({ extended: true }))

app.all("*",function(req,res,next){
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin","*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers","content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS");
    if (req.method.toLowerCase() == 'options')
        res.send(200);  //让options尝试请求快速结束
    else
        next();
})

//静态文件托管 ----  访问：http:localhost:8989/static/图片.jpg
app.use('/static',express.static('upload'))

//路由
const router = require('./router')

//'/api'会使接口前加上api 例如访问login接口 需要localhost:8989/api/login
app.use('/api',router)


app.listen(7777,()=>{
    console.log(7777);
})
