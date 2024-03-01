const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const { upload } = require('../../utils/upload.js');
const s3 = require('../../utils/aws.js')

const { Post, Comment, User } = require('../../db/models');

const validatePost = [
    check('title')
        .exists({ checkFalsy: true })
        .withMessage('Title is required'),
    check('thumbnail')
        .exists({ checkFalsy: true })
        .withMessage('Thumbnail is required'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    handleValidationErrors
]

const validateComment = [
    check('comment')
        .exists({ checkFalsy: true })
        .withMessage("Comment is Required"),
    handleValidationErrors
]

router.get('/', async (req, res) => {
    const posts = await Post.findAll({});

    res.status(200);
    res.json(posts);
})

router.get('/current', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }


    const posts = await Post.findAll({
        where: {userId: user.id}
    });

    res.status(200);
    res.json(posts);

})

router.get('/:postId', async ( req, res ) => {
    const { postId } = req.params;

    const post = await Post.findOne({
        where: {id: postId}
    });

    res.status(200);
    res.json(post);
})

router.post('/', requireAuth, validatePost, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const { title, thumbnail, description } = req.body;

    const newPost = await Post.create({
        title: title,
        userId: user.id,
        thumbnail: thumbnail,
        description: description
    })

    res.status(201)
    res.json(newPost)
})

router.put('/:postId', requireAuth, validatePost, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const { postId } = req.params;
    const { title, thumbnail, description } = req.body;

    const post = await Post.findOne({
        where: {id: postId}
    })

    if(!post) {
        const err = new Error()
        err.message = "Post couldn't be found"
        res.status(404)
        return res.json(err)
    }

    if(post.userId !== user.id) {
        const err = new Error()
        err.message = "Forbidden"
        res.status(403)
        return res.json(err)
    }

    const updatedPost = await post.update({
        title,
        thumbnail,
        description
    })

    res.status(200)
    res.json(updatedPost)
})

router.delete('/:postId', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const { postId } = req.params;

    const post = await Post.findOne({
        where: {id: postId}
    })

    if(!post) {
        const err = new Error()
        err.message = "Post couldn't be found"
        res.status(404)
        return res.json(err)
    }

    if(post.userId !== user.id) {
        const err = new Error()
        err.message = "Forbidden"
        res.status(403)
        return res.json(err)
    }

    await post.destroy()

    res.status(200)
    res.json({
        message: "Successfully deleted"
    })
})

// ----------------------------------------Comment Routes----------------------------------------------------

router.get('/:postId/comments', async ( req, res ) => {
    const { postId } = req.params;

    const post = await Post.findOne({
        where: {id: postId},
        include: {
            model: Comment,
            include: [
                { model: User,
                  attributes: ['id', 'username']
                }
            ]
        }
    })

    if(!post) {
        const err = new Error()
        err.message = "Post couldn't be found"
        res.status(404)
        return res.json(err)
    }

    res.status(200)
    res.json({
        Comments: post.Comments
    })

})

router.post('/:postId/comments', requireAuth, validateComment, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const { postId } = req.params;
    const { comment } = req.body;

    const post = await Post.findOne({
        where: {id: postId}
    })

    if(!post) {
        const err = new Error()
        err.message = "Spot couldn't be found"
        res.status(404)
        return res.json(err)
    }

    const newComment = await Comment.create({
        userId: user.id,
        postId: postId,
        comment
    })

    res.status(201)
    res.json(newComment)

})


module.exports = router
