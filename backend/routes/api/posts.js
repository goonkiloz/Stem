const express = require('express');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { requireAuth } = require('../../utils/auth');

const { upload } = require('../../utils/upload.js');
const s3 = require('../../utils/aws.js')

const { Post, Comment, User, Like, Dislike } = require('../../db/models');

const validatePost = [
    check('filePath')
        .exists({ checkFalsy: true })
        .withMessage('Video is required'),
    handleValidationErrors
]

const validateComment = [
    check('comment')
        .exists({ checkFalsy: true })
        .withMessage("Comment is Required"),
    handleValidationErrors
]

router.get('/', async (req, res) => {

    const posts = await Post.findAll({
        include: { model: User,
            attributes: ['id', 'username', 'profileImg']}
    });

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
        where: {id: postId},
        include: { model: User,
                   attributes: ['id', 'username', 'profileImg']}
    });

    res.status(200);
    res.json(post);
})

router.post('/', requireAuth, upload.single('filePath'), async ( req, res ) => {
    const { user } = req;
    const { title, description } = req.body;
    const file = req?.file


    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }


    const newPost = await Post.create({
        title: title,
        userId: user.id,
        filepath: file?.location,
        description: description
    })

    res.status(201)
    res.json(newPost)
})

router.put('/:postId', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const { postId } = req.params;
    const { title, description } = req.body;

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

    // const files = [...req.files]

    // let videoFile;

    // files.forEach((file) => {
    //     // console.log(file)
    //     if(file.mimetype === 'video/mp4') {
    //         videoFile = file
    //     }
    // })

    // if(!videoFile) {
    //     const err = new Error()
    //     err.message = "Video required"
    //     res.status(400)
    //     return res.json(err)
    // }

    // if(videoFile.location !== post.filepath) {
    //     await s3.deleteFileFromS3(post.filepath, null)
    // }

    const updatedPost = await post.update({
        title: title,
        description: description
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

    console.log(postId)

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

    await s3.deleteFileFromS3(post.filepath, null)
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
        err.message = "Post couldn't be found"
        res.status(404)
        return res.json(err)
    }

    if(comment.slice(0, 1) === ' ' || comment.slice(-1) === ' ') {
        const err = new Error()
        err.message = 'comment cannot start or end with whitespacing'
        res.status(400)
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

// ----------------------------------- Likes/Dislikes routes -------------------------------------------------

router.get('/:postId/likes', async ( req, res ) => {
    const { postId } = req.params;

    const post = await Post.findOne({
        where: { id: postId },
        include: {
            model: Like,
            include: [
                {model: User,
                 attributes: ['id', 'username', 'profileImg']}
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
        Likes: post.Likes
    })
})

router.get('/:postId/dislikes', async ( req, res ) => {
    const { postId } = req.params;

    const post = await Post.findOne({
        where: { id: postId },
        include: {
            model: Dislike,
            include: [
                {model: User,
                 attributes: ['id', 'username', 'profileImg']}
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
        Dislikes: post.Dislikes
    })
})

router.post('/:postId/likes', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const { postId } = req.params;

    const post = await Post.findOne({
        where: { id: postId },
        include: {
            model: Like
        }
    })

    if(!post) {
        const err = new Error()
        err.message = "Post couldn't be found"
        res.status(404)
        return res.json(err)
    }

    const likeCheck = await post.Likes.map((like) => {
        if(like.userId === user.id) {
            return true
        }
        return false
    })

    if (likeCheck.includes(true)) {
        const err = new Error()
        err.message = "User already liked this Post"
        res.status(400)
        return res.json(err)
    }

    const newLike = await Like.create({
        userId: user.id,
        postId: postId
    })

    res.status(201)
    res.json(newLike)
})

router.post('/:postId/dislikes', requireAuth, async ( req, res ) => {
    const { user } = req;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const { postId } = req.params;

    const post = await Post.findOne({
        where: { id: postId },
        include: {
            model: Dislike
        }
    })

    if(!post) {
        const err = new Error()
        err.message = "Post couldn't be found"
        res.status(404)
        return res.json(err)
    }

    const dislikeCheck = await post.Dislikes.map((dislike) => {
        if(dislike.userId === user.id) {
            return true
        }
        return false
    })

    if (dislikeCheck.includes(true)) {
        const err = new Error()
        err.message = "User already liked this Post"
        res.status(400)
        return res.json(err)
    }

    const newDislike = await Dislike.create({
        userId: user.id,
        postId: postId
    })

    res.status(201)
    res.json(newDislike)
})

module.exports = router
