import { db } from '../connect.js'
import jwt from "jsonwebtoken"

export const addStory = (req, res) => {
    const token = req.cookies.accessToken
    if (!token) return res.status(401).json("User not logged in!")

    jwt.verify(token, "secretkey100500220000", (err, userInfo) => {
        if (err) return res.status(403).json("Wrong token")

        const q = "INSERT INTO stories (img, userId) VALUES (?, ?)"
        db.query(q, [req.body.img, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.status(200).json("Story has been added!")
        })
    })
}

export const getStory = (req, res) => {
    const token = req.cookies.accessToken
    if (!token) return res.status(401).json("User not logged in!")

    jwt.verify(token, "secretkey100500220000", (err, userInfo) => {
        if (err) return res.status(403).json("Wrong token")

        const q = "SELECT s.id, s.img, s.userId, u.name FROM stories AS s JOIN users AS u ON s.userId = u.id WHERE s.userId = ? UNION SELECT s.id, s.img, s.userId, u.name FROM stories AS s JOIN relationships AS r ON s.userId = r.followedUserId JOIN users AS u ON s.userId = u.id WHERE r.followerUserId = ? ORDER BY id DESC"
        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.status(200).json(data)
        })
    })
}
    ;