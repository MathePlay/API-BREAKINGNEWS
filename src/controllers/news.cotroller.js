import { createService, findAllService } from "../services/news.service.js"

const create = async (req, res) => {
    try {

        const { title, text, banner } = req.body

        if (!title || !text || !banner) {
            res.status(400).send({ message: "submit all fields for registration" })
        }

        await createService({
            title,
            text,
            banner,
            user: req.userId
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