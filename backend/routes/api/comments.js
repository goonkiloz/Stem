const express = require('express');
const router = express.Router();

const { requireAuth } = require('../../utils/auth')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Comment } = require('../../db/models');

const validateComment = [
    check('comment')
        .exists({ checkFalsy: true })
        .withMessage("Comment is Required"),
    handleValidationErrors
]

router.get('/current', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const comments = await Comment.findAll({
        where: {userId: user.id}
    })

    res.status(200)
    res.json(comments)
})

router.put('/:commentId', requireAuth, validateComment, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const { commentId } = req.params;
    const { comment } = req.body;

    const currentComment = await Comment.findOne({
        where: {id: commentId}
    })

    if(!currentComment) {
        const err = new Error()
        err.message = "Comment couldn't be found"
        res.status(404)
        return res.json(err)
    };

    if(currentComment.userId !== user.id) {
        const err = new Error()
        err.message = "Forbidden"
        res.status(403)
        return res.json(err)
    };

    const updatedComment = await currentComment.update({
        comment
    })

    res.status(200)
    res.json(updatedComment)
})

router.delete('/:commentId', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const { commentId } = req.params;

    const comment = await Comment.findOne({
        where: {id: commentId}
    })

    if(!comment) {
        const err = new Error()
        err.message = "Comment couldn't be found"
        res.status(404)
        return res.json(err)
    };

    if(comment.userId !== user.id) {
        const err = new Error()
        err.message = "Forbidden"
        res.status(403)
        return res.json(err)
    };

    await comment.destroy()

    res.status(200)
    res.json({
        message: "Successfully deleted"
    })

})

module.exports = router
