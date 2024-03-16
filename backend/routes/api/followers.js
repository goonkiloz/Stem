const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth')

const { Follower, User } = require('../../db/models');

router.get('/current/followers', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const followers = await Follower.findAll({
        where: {userId: user.id},
        attributes: ['id'],
        include: {
            model: User,
            as: 'follower',
            attributes: ['id', 'username', 'profileImg']
        }
    })
    console.log(followers)
    res.status(200)
    res.json(followers)
})

router.get('/current/following', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const follower = await Follower.findAll({
        where: {followerId: user.id},
        attributes: ['id'],
        include: {
            model: User,
            as: 'followingUser',
            attributes: ['id', 'username', 'profileImg']
        }
    })

    res.status(200)
    res.json(follower)
})

router.delete('/:followerId', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const { followerId } = req.params;

    const follower = await Follower.findOne({
        where: { id: followerId }
    })

    if (!follower) {
        const err = new Error()
        err.message = "You are not following this person"
        res.status(404)
        return res.json(err)
    }


    if(follower.followerId !== user.id && follower.userId !== user.id) {
        const err = new Error()
        err.message = "Forbidden"
        res.status(403)
        return res.json(err)
    }

    await follower.destroy()

    res.status(200)
    res.json({
        message: "Successfully deleted"
    })

})

module.exports = router
