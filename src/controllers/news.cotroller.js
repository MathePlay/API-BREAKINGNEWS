import { createService, findAllService } from "../services/news.service.js"

const create = async (req, res) => {
    try {
        const { authorization } = req.headers

        if (!authorization){
            res.status(401).send({ message: "You are not authorized" })
        }
        
        const parts = authorization.split(" ")
        
        const [schema, token] = parts

        if (parts.length !== 2){
            res.status(401).send({ message: "You are not authorized" })
        }

        if (schema !== "Bearer"){
            res.status(401).send({ message: "You are not authorized" })
        }

        const { title, text, banner } = req.body

        if (!title || !text || !banner) {
            res.status(400).send({ message: "submit all fields for registration" })
        }

        await createService({
            title,
            text,
            banner,
            user: { _id: "6484e9a25176c8ffe6cbe21d" }
        })

        res.status(201).send({ message: "News Created!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const findAll = async (req, res) => {
    try {
        const news = await findAllService()

        if (news.length === 0) {
            res.status(400).send({ message: "There are no resgistered news" })
        }

        res.send(news)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export {
    create,
    findAll
}