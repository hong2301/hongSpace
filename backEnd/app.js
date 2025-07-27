const express = require('express')
const cors = require('cors')
const joi = require('joi')

const app = express()

// 常规中间件
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// 自定义响应方法 (放在常规中间件中)
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

// 错误处理中间件 (放在最后)
app.use((err, req, res, next) => {
    // Joi验证错误
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 其他错误
    res.cc(err)
})

port = '8888'
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`)
})