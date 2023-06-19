import { countNews, createService, findAllService, topNewsService, findByIdService, searchByTitleService} from "../services/news.service.js"

export const create = async (req, res) => {
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

        return res.status(201).send({ message: "News Created!" })
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const findAll = async (req, res) => {
    try {
        let { limit, offset } = req.query

        limit = Number(limit)
        offset = Number(offset)

        if (!limit) {
            limit = 5
        }

        if (!offset) {
            offset = 0
        }



        const total = await countNews()
        if (offset >= total) {
            offset = total - limit
        }
        const news = await findAllService(limit, offset)
        const currentUrl = req.baseUrl


        const next = offset + limit

        const nextUrl = next < total ? `${currentUrl}?limit=${limit}&offset=${next}` : null

        const previous = (offset - limit) < 0 ? null : offset - limit
        const previousUrl = previous != null ? `${currentUrl}?limit=${limit}&offset=${previous}` : null


        if (news.length === 0) {
            res.status(400).send({ message: "There are no resgistered news" })
        }

        return res.send({
            nextUrl,
            previousUrl,
            limit,
            offset,
            total,

            results: news.map(item => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                coments: item.coments,
                name: item.user.name,
                userName: item.user.userName,
                userAvatar: item.user.avatar
            }))
        })

        // res.send(news)
    } catch (err) {
        res.status(500).send({ message: err.message })
    }
}

export const topNews = async (req, res) => {
    try {

        const news = await topNewsService()

        if (!news) {
            res.status(400).send({ message: "There are no resgistered news" })
        }

        return res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                coments: news.coments,
                name: news.user.name,
                userName: news.user.userName,
                userAvatar: news.user.avatar
            }
        })
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

export const findById = async (req, res) => {
    try {

        const { id } = req.params

        const news = await findByIdService(id)

        if (!news) {
            res.status(400).send({ message: "There are no resgistered news" })
        }

        return res.send({
            news: {
                id: news._id,
                title: news.title,
                text: news.text,
                banner: news.banner,
                likes: news.likes,
                coments: news.coments,
                name: news.user.name,
                userName: news.user.userName,
                userAvatar: news.user.avatar
            }
        })


    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

export const searchByTitle = async (req, res) => {
    try{

        const {title} = req.query

        const news = await searchByTitleService(title)

        if(news.length === 0 ){
            return res.status(400).send({message: "There are no news with this title"})
        }

        return res.send({
            results: news.map(item => ({
                id: item._id,
                title: item.title,
                text: item.text,
                banner: item.banner,
                likes: item.likes,
                coments: item.coments,
                name: item.user.name,
                userName: item.user.userName,
                userAvatar: item.user.avatar
            }))
        })

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}
