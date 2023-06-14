import dotenv from 'dotenv'
import { findByIdService } from '../services/user.service.js'
import jwt from 'jsonwebtoken'

dotenv.config()

export const authMiddleware = (req, res, next) => {
    try {
        const { authorization } = req.headers

        if (!authorization) {
            res.status(401).send({ message: "You are not authorized" })
        }

        const parts = authorization.split(" ")

        if (parts.length !== 2) {
            res.status(401).send({ message: "You are not authorized" })
        }

        const [schema, token] = parts

        if (schema !== "Bearer") {
            res.status(401).send({ message: "You are not authorized" })
        }

        jwt.verify(token, process.env.SECRET_JWT, async (err, decoded) => {
            if (err) {
                res.status(401).send({ message: "Invalid Token!" })
            }

            const user = await findByIdService(decoded.id)

            if (!user || !user.id) {
                res.status(401).send({ message: "Invalid Token!" })
            }

            req.userId = user.id

            return next()
        })
        
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' })
    }
}
