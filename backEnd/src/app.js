const express = require('express')
const cors = require('cors')
const joi = require('joi')
const dotenv = require('dotenv');
const path = require('path');
const { getLocalIP } = require('../src/utils/index.js');

// 加载环境变量
const envFile = process.env.ENV === 'production' ? '../.env.production' : '../.env.development';
dotenv.config({ path: path.resolve(__dirname, envFile) });


const app = express()

// 常规中间件
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// 自定义响应方法
app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// 路由
const userRouter = require('./router/user')
app.use('/api', userRouter)

// 错误处理中间件
app.use((err, req, res, next) => {
    // Joi验证错误
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 其他错误
    res.cc(err)
})

// 启动服务
const port = process.env.SERVER_PORT || 6060;
const host = process.env.ENV === 'production' ? getLocalIP() : process.env.SERVER_HOST;

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}`);
});
