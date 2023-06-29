import { 
    countNews, 
    createService, 
    findAllService, 
    topNewsService, 
    findByIdService, 
    searchByTitleService, 
    byUserService, 
    updateService, 
    eraseService,
    likeNewsService,
    deleteLikeNewsService,
    addCommentService,
    deleteCommentService
} from "../services/news.service.js"

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


        // if (news.length === 0) {
        //     res.status(400).send({ message: "There are no resgistered news" })
        // }

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

export const byUser = async (req, res) => {
    try {

        const id = req.userId

        const news = await byUserService(id)

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

export const update = async (req, res) => {
    try {

        const {title, text, banner} = req.body
        const {id}  = req.params

        if (!title && !text && !banner) {
            res.status(400).send({ message: "submit at least one field to update the news" })
        }

        const news = await findByIdService(id)

        if (news.user.id != req.userId){
            res.status(400).send({ message: "You didn't update this news" })
        }

        await updateService(id, title, text, banner)
        return res.send({message: "News successfully updated!"})

    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

export const erase = async (req, res) => {
    try {

        const {id}  = req.params

        const news = await findByIdService(id)

        if (news.user.id != req.userId){
            res.status(400).send({ message: "You didn't delete this News" })
        }

        await eraseService(id)

        return res.send({message: "News deleted successfully"})



    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

export const likeNews = async (req, res) => {
    try {

        const {id} = req.params
        const userId = req.userId
        
        const newsLiked = await likeNewsService(id, userId)
        console.log(newsLiked)

        if(!newsLiked){
            await deleteLikeNewsService(id, userId)
            return res.status(200).send({message: "like successfully removed"})
        }
        
        res.send({message: "Like done successfully"})
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

export const addComment = async (req, res) => {
    try {

        const {id} = req.params
        const userId = req.userId
        const {comment} = req.body

        if(!comment){
            return res.status(400).send({message: "Write a message to comment"})
        }

        await addCommentService(id, comment, userId)

        res.send({message: "Comment successfully completed"})
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}

export const deleteComment = async (req, res) => {
    try {

        const {idNews, idComment} = req.params
        const userId = req.userId

        console.log(idNews, idComment, userId)

        const commentDelete = await deleteCommentService(idNews, idComment, userId)

        const commentFinder = commentDelete.coments.find(comment => comment.idComment == idComment)

        if (!commentFinder){
            return res.status(404).send({message: "Comment not found"})
        }

        if(commentFinder.userId !== userId){
            return res.status(400).send({message: "You can't delete this comment"})
        }

        res.send({message: "Comment successfully removed"})
    } catch (e) {
        res.status(500).send({ message: e.message })
    }
}