const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const Profile = require("../../models/Profile")
const { check, validationResult } = require("express-validator")

// Get Logged In User's Profile
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"])

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" })
    }

    res.json(profile)
  } catch (err) {
    res.status(500).json("Server Error")
  }
})

// Create Profile
router.post(
  "/",
  [
    auth,
    [
      check("status")
        .not()
        .isEmpty(),
      check("skills")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body

    const profileFields = {}
    profileFields.user = req.user.id
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (bio) profileFields.bio = bio
    if (location) profileFields.location = location
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim())
    }

    profileFields.social = {}
    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    try {
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      )

      return res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  }
)

module.exports = router
