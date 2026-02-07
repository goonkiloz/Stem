const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth');

const { Like, Dislike } = require('../../db/models');

router.get('/', async ( req, res ) => {
    const likes = await Like.findAll({})

    res.status(200)
    res.json(likes)
})

router.get('/dislikes', async ( req, res ) => {
    const likes = await Like.findAll({})

    res.status(200)
    res.json(likes)
})

router.get('/current', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const likes = await Like.findAll({
        where: { userId: user.id }
    })

    res.status(200)
    res.json(likes)
})

router.get('/dislikes/current', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const dislikes = await Dislike.findAll({
        where: { userId: user.id }
    })

    res.status(200)
    res.json(dislikes)
})

router.delete('/:likeId', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const { likeId } = req.params;

    const like = await Like.findOne({
        where: { id: likeId }
    })

    if(!like) {
        const err = new Error()
        err.message = "Like couldn't be found"
        res.status(404)
        return res.json(err)
    }

    if(like.userId !== user.id) {
        const err = new Error()
        err.message = "Forbidden"
        res.status(403)
        return res.json(err)
    }

    await like.destroy()

    res.status(200)
    res.json({
        message: "Successfully deleted"
    })
})

router.delete('/dislikes/:dislikeId', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const { dislikeId } = req.params;

    const dislike = await Dislike.findOne({
        where: { id: dislikeId }
    })

    if(!dislike) {
        const err = new Error()
        err.message = "Dislike couldn't be found"
        res.status(404)
        return res.json(err)
    }

    if(dislike.userId !== user.id) {
        const err = new Error()
        err.message = "Forbidden"
        res.status(403)
        return res.json(err)
    }

    await dislike.destroy()

    res.status(200)
    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router




