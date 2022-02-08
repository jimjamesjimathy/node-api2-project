const express = require('express');
const router = express.Router();

const Post = require('./posts-model');

router.get('/', (req, res) => {
    Post.find()
        .then(i => {
            res.json(i);
        })
        .catch(err => {
            res.status(500).json({
                message: 'we don\'t have the info here, buddy.',
                err: err.message,
                stack: err.stack
            })
        }) 
})

router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            res.json(post)
        }
    } catch (err) {
        res.status(500).json({ message: "The post with the specified ID does not exist" })
    }
})

router.post('/', (req, res) => {
    const { title, contents } = req.body
        if(!title || !contents) {
            res.status(400).json({
                message: 'give us a name and some content, buddy.'
            })
        } else {
            Post.insert({ title, contents })
                .then(({id}) => {
                    return Post.findById(id)
                })
                .then(post => {
                    res.status(201).json(post)
                })
                .catch(err => {
                    res.status(500).json({ 
                        message: 'error saving the post, buddy.',
                        err: err.message,
                        stack: err.stack
                    })
                })
        }
})

router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) {
            res.status(404).json({
                message: "The post with the specified ID does not exist"
            })
        } else {
            await Post.remove(req.params.id)
            res.json(post)
        }
    } catch(err) {
            res.status(500).json({ 
                message: "The post could not be removed",
                err: err.message,
                stack: err.stack
            })
    }
})

router.put('/:id', (req, res) => {
    const {title, contents} = req.body
    if(!title || !contents) {
        res.status(400).json({
            message: '"Please provide title and contents for the post"'
        })
    } else {
        Post.findById(req.params.id)
            .then(postID => {
                if(!postID) {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist"
                    })
                } else { 
                    return Post.update(req.params.id, req.body)
                }
            })
            .then(data => {
                if(data) {
                    return Post.findById(req.params.id)
                }
            })
            .then(post => {
                res.status(200).json(post)
            })
            .catch(err => {
                res.status(500).json({
                    message: "The post information could not be modified",
                    err: err.message,
                })
            })
    }
})


router.get('/:id/comments', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post) {
            res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
            const messages = await Post.findPostComments(req.params.id)
            res.json(messages)
        }
    } catch (err) {
        res.status(500).json({ 
            message: "The comments information could not be retrieved",
            err: err.message,
            stack: err.stack
        })
    }
})



module.exports = router;