const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')
const port = 3000
const cookieParser = require('cookie-parser')
require('dotenv').config()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extends: true }))

app.get('/', verifyToken, (req, res) => {
    const isAdmin = req.user.role;
    console.log(isAdmin)
    if (isAdmin !== 'admin') {
        return res.send('Bạn không có quyền truy cập')
    }
    res.send('Helo')
})
app.post('/login', (req, res) => {

    const username = req.body.username;
    const role = 'user';
    const user = { name: username, role }
    const accessToken = jwt.sign(user, process.env.SECRET_KEY);
    res.cookie('user_accress', accessToken, { httpOnly: true });
    res.json({ message: `đăng nhập thành công` })
})

function verifyToken(req, res, next) {
    const user_accress = req.cookies.user_accress;
    if (!user_accress) {
        return res.send('Bạn chưa đăng nhập');
    }

    jwt.verify(user_accress, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).send('JWT không hợp lệ')
        }
        console.log(user);
        req.user = user;
        next();
    })
}

app.listen(port, () => {
    console.log('Listen on port', port)
})