import { db } from '../connect.js'
import jwt from "jsonwebtoken"

export const getUser = (req, res) => {
    const userId = req.params.userId
    const q = "SELECT * FROM users WHERE id = ?"
    db.query(q, [userId], (err, data) => {
        if (err) return res.status(500).json(err)
        const { password, ...info } = data[0]
        return res.json(info)

    })
}

export const updateUser = (req, res) => {
    console.log("UPDATING")
    const token = req.cookies.accessToken
    if (!token) return res.status(401).json("User not logged in!")

    jwt.verify(token, "secretkey100500220000", (err, userInfo) => {
        if (err) return res.status(403).json("Wrong token")

        const q = "UPDATE users SET `name` = ?, `city` = ?, `website` = ?, `profilePic` = ?, `coverPic` = ? WHERE id = ?"

        db.query(q, [req.body.name, req.body.city, req.body.website, req.body.profilePic, req.body.coverPic, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err)
            if (data.affectedRows > 0) return res.json("UPDATED!")
            return res.status(403).json("You can update only your records!")
        })
    })
}

export const getSuggestions = (req, res) => {

    const token = req.cookies.accessToken
    if (!token) return res.status(401).json("User not logged in!")

    jwt.verify(token, "secretkey100500220000", (err, userInfo) => {
        if (err) return res.status(403).json("Wrong token")

        const q = "SELECT id, name, profilePic FROM users WHERE `id` != ? AND id NOT IN (SELECT followedUserId FROM relationships WHERE `followerUserId` = ?)"
        db.query(q, [userInfo.id, userInfo.id], (err, data) => {
            if (err) return res.status(500).json(err)
            return res.status(200).json(data)
        })
    })

}