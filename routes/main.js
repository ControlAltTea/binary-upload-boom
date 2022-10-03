const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const homeController = require("../controllers/home");
const postsController = require("../controllers/posts");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const User = require("../models/User");
const Post = require("../models/Post");

//Main Routes - simplified for now
router.get("/", homeController.getIndex);
router.get("/profile", ensureAuth, postsController.getProfile);
router.get("/feed", ensureAuth, postsController.getFeed);
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/logout", authController.logout);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

router.get("/search", ensureAuth, function (req, res) {
    const posts = Post.find({ user: req.user.id });
    User.find({ userName: { $ne: req.user.userName } }, function (err, result) {
        if (err) throw err;
        res.render("search", {
            result: result, posts: posts
        });
    });
});

router.post("/search", ensureAuth, function(req, res) {
    let searchfriend = req.body.searchfriend;
    if (searchfriend == req.user.username) {
        searchfriend = null;
    }

    User.find({ username: searchfriend }, function (err, result) {
        if (err) throw err;
        res.render('search', {
            result: result
        });
    });
});

module.exports = router;
