import { db } from "../connect.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

export const register = (req, res) => {

    const q = "SELECT * FROM users WHERE username = ? OR email = ?"

    db.query(q, [req.body.username, req.body.email], (err, data) => {
        if (err) return res.status(500).json(err)
        if (data.length) return res.status(409).json("User already exists!")
        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(req.body.password, salt)

        const q = "INSERT INTO users (`username`, `email`, `password`, `name`) VALUE (?)"
        const values = [req.body.username, req.body.email, hashedPassword, req.body.name]
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.status(200).json("User has been created!")
        })

    })

}

export const login = (req, res) => {
    const q = "SELECT * FROM users WHERE username = ?"
    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err)
        if (!data.length) return res.status(409).json("User not found!")

        const checkedPassword = bcrypt.compareSync(req.body.password, data[0].password)
        console.log(checkedPassword)
        if (!checkedPassword) return res.status(400).json("Wrong password or username!")

        const token = jwt.sign({ id: data[0].id }, "secretkey100500220000")
        const { password, ...other } = data[0]

        res.cookie("accessToken", token, {
            httpOnly: true,
        }).status(200).json(other)

    })
}


export const logout = (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(200).json("User has been logged out")
}

export const checkAuth = (req, res) => {
    const token = req.cookies.accessToken
    // console.log(token)
    if (!token) return res.status(401).json("User not logged in!")
    return res.status(200).json("User OK!")
}