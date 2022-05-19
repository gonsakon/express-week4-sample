var express = require('express');
var router = express.Router();
const appError = require("../service/appError");
const handleErrorAsync = require("../service/handleErrorAsync");
const Post = require("../models/postsModel");
const User = require("../models/usersModel");
const Comment = require('../models/commentsModel');
const {isAuth,generateSendJWT} = require('../service/auth');
router.get('/', async function(req, res, next) {
  const timeSort = req.query.timeSort == "asc" ? "createdAt":"-createdAt"
  const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
  const post = await Post.find(q).populate({
      path: 'user',
      select: 'name photo '
    }).populate({
      path: 'comments',
      select: 'comment user'
    }).sort(timeSort);
  // res.send('respond with a resource');
  res.status(200).json({
    post
  })
});

router.post('/',isAuth, handleErrorAsync(async function(req, res, next) {
  const { content } = req.body;
  if(content == undefined){
    return next(appError(400,"你沒有填寫 content 資料",next))
  }
  const newPost = await Post.create({
    user: req.user.id,
    content
  });
  res.status(200).json({
    status:"success",
    post: newPost
  })
}));

router.post('/:id/likes',isAuth, handleErrorAsync(async function(req, res, next) {
  const _id = req.params.id;
    await Post.findOneAndUpdate(
        { _id},
        { $addToSet: { likes: req.user.id } }
      );
      res.status(201).json({
        status: 'success',
        postId: _id,
        userId: req.user.id
      });
}));

router.delete('/:id/likes',isAuth, handleErrorAsync(async(req, res, next) =>  {
  const _id = req.params.id;
  await Post.findOneAndUpdate(
      { _id},
      { $pull: { likes: req.user.id } }
    );
    res.status(201).json({
      status: 'success',
      postId: _id,
      userId: req.user.id
    });

}))

router.post('/:id/comment',isAuth, handleErrorAsync(async(req, res, next) =>  {
  const user = req.user.id;
  const post = req.params.id;
  const {comment} = req.body;
  const newComment = await Comment.create({
    post,
    user,
    comment
  });
  res.status(201).json({
      status: 'success',
      data: {
        comments: newComment
      }
  });

}))

router.get('/user/:id', handleErrorAsync(async(req, res, next) =>  {
  const user = req.params.id;
  const posts = await Post.find({user}).populate({
    path: 'comments',
    select: 'comment user'
  });

  res.status(200).json({
      status: 'success',
      results: posts.length,
      posts
  });
}))

module.exports = router;
