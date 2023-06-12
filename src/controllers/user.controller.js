import { createService, findAllService, updateService } from "../services/user.service.js"

const create = async (req, res) => {
    try {
        const { name, userName, email, password, avatar, background } = req.body

        if (!name || !userName || !email || !password || !avatar || !background) {
            res.status(400).send({ message: "submit all fields for registration" })
        }

        const user = await createService(req.body)

        if (!user) {
            return res.status(400).send({ message: "Error creating User" })
        }

        res.status(201).send({
            message: "User created sucessfully",
            user: {
                id: user._id,
                name,
                userName,
                email,
                avatar,
                background
            }
        })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const findAll = async (req, res) => {
    try {
        const users = await findAllService()

        if (users.length === 0) {
            res.status(400).send({ message: "There are no resgistered users" })
        }

        res.send(users)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const findById = async (req, res) => {

    try {
        const user = req.user

        res.send(user)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

const update = async (req, res) => {
    try {
        const { name, userName, email, password, avatar, background } = req.body

        if (!name && !userName && !email && !password && !avatar && !background) {
            res.status(400).send({ message: "submit at least one field for update" })
        }

        const { id, user } = req

        await updateService(
            id,
            name,
            userName,
            email,
            password,
            avatar,
            background
        )

        res.send({ message: "User sucessfully updated" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export { create, findAll, findById, update }