import express from 'express'
import { login, register, logout, checkAuth } from '../controllers/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/checkauth', checkAuth)

export default router