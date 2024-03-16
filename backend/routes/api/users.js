const express = require('express');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Follower, Post } = require('../../db/models');
const { upload } = require('../../utils/upload');

const router = express.Router();

//backend validation for signup
const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];

// Sign up
router.post('/', upload.single('profileImg'), validateSignup, async (req, res) => {

    const { email, password, firstName, lastName, username } = req.body;

    const { location } = req.file;

    const hashedPassword = bcrypt.hashSync(password);
    const user = await User.create({ email, username, firstName, lastName, hashedPassword, profileImg: key });


    const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        profileImg: location
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});

// Restore session user
router.get('/', (req, res) => {
    const { user } = req;
    if (user) {
        const safeUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        return res.json({
            user: safeUser
        });
    } else return res.json({ user: null });
});

// Get all users
router.get('/all', async (req, res) => {

    const users = await User.findAll({
        include: {
            model: Follower

        }
    })

    res.status(200)
    res.json(users)
})

// Get a user by userId
router.get('/:userId', async (req, res) => {
    const  { userId } = req.params;

    const user = await User.findOne({
        where: {id: userId}
    })

    if(!user) {
        const err = new Error()
        err.message = "User not Found"
        res.status(404)
        return res.json(err)
    }

    res.status(200)
    res.json(user)
})

// -------------------------------------------------------- Followers routes ----------------------------------------------------

// Get all followers by a userId
router.get('/:userId/followers', async ( req, res ) => {
    const { userId } = req.params;

    const user = await User.findOne({
        where: { id: userId }
    })

    if (!user) {
        const err = new Error()
        err.message = "No User Found"
        res.status(404)
        return res.json(err)
    }

    const followers = await Follower.findAll({
        where: { userId: userId},
        attributes: ['id'],
        include: {
            model: User,
            as: 'follower',
            attributes: ['id', 'username', 'profileImg']
        }
    })


    res.status(200)
    res.json(followers)
})

// Get all following
router.get('/:userId/following', async ( req, res ) => {
    const { userId } = req.params;

    const user = await User.findOne({
        where: { id: userId }
    })

    if (!user) {
        const err = new Error()
        err.message = "No User Found"
        res.status(404)
        return res.json(err)
    }

    const following = await Follower.findAll({
        where: {followerId: userId},
        attributes: ['id'],
        include: {
            model: User,
            as: 'followingUser',
            attributes: ['id', 'username', 'profileImg']

        }
    })


    res.status(200)
    res.json(following)
})

// Add a Follower
router.post('/:userId/follower', requireAuth, async ( req, res ) => {
    const { user } = req;
    const { userId } = req.params;

    if (!user) {
        const err = new Error()
        err.message = "Authentication required"
        res.status(401)
        return res.json(err)
    }

    const userCheck = await User.findOne({
        where: { id: userId}
    })

    if (!userCheck) {
        const err = new Error()
        err.message = "No User Found"
        res.status(404)
        return res.json(err)
    }

    const followingCheck = await Follower.findOne({
        where: { userId: userId, followerId: user.id}
    })

    if(followingCheck) {
        const err = new Error()
        err.message = "You are already following this user"
        res.status(400)
        return res.json(err)
    }

    const newFollower = await Follower.create({
        userId: userId,
        followerId: user.id
    })

    res.status(201)
    res.json(newFollower)

})

router.get('/:userId/posts', async ( req, res ) => {
    const { userId } = req.params;

    const userCheck = await User.findOne({
        where: { id: userId}
    })

    if (!userCheck) {
        const err = new Error()
        err.message = "No User Found"
        res.status(404)
        return res.json(err)
    }

    const post = await Post.findAll({
        where: {userId: userId}
    })

    res.status(200)
    res.json(post)

})


module.exports = router;
