const express = require("express")
const router = express.Router()
const { check, validationResult } = require("express-validator")
const auth = require("../../middleware/auth")
const User = require("../../models/User")
const Post = require("../../models/Post")
const Profile = require("../../models/Profile")

// Create Post
router.post(
  "/",
  [auth, check("text", "Text is required").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select("-password")
      if (!user) {
        res.status(400).json({ msg: "User Does not Exist" })
      }
      const newPost = new Post({
        user: req.user.id,
        text: req.body.text,
        avatar: user.avatar,
        name: user.name,
      })

      const post = await newPost.save()
      res.json(post)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)
// Get All Posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

router.delete("/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    if (!post) {
      return res.status(404).json({ msg: "Post Not Found!" })
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Access Denied" })
    }

    await post.remove()
    res.json({ msg: "Post Removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

router.put("/like/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "You've already liked this post" })
    }
    post.likes.unshift({ user: req.user.id })

    await post.save()
    res.json(post)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})
//Unlike a Post
router.put("/unlike/:post_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "This post hasn't been liked by you" })
    }

    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id)
    post.likes.splice(removeIndex, 1)

    await post.save()
    res.json(post)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// Add Comment
router.post(
  "/comment/:post_id",
  [auth, [check("text", "Text is required.")]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const user = await User.findById(req.user.id).select("-password")
      const post = await Post.findById(req.params.post_id)
      if (!post) {
        res.status(400).json({ msg: "Post not found" })
      }

      const newComment = {
        user: req.user.id,
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
      }

      post.comments.unshift(newComment)
      await post.save()
      res.json(post)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)

router.delete("/comment/:post_id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    const comment = post.comments.find(
      (comment) => comment.id.toString() === req.params.comment_id
    )
    if (!comment) {
      return res.status(400).json({ msg: "Comment Does not Exist" })
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(400).json({ msg: "Not Authorized" })
    }

    const removeIndex = post.comments
      .map((comment) => comment.id.toString())
      .indexOf(req.user.id)

    post.comments.splice(removeIndex)

    await post.save()
    res.json(post)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router
