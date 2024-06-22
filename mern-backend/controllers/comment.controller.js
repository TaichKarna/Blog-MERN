const errorHandler = require('../utils/error');
const Comment = require('../models/comment.model');

const createComment = async (req, res, next) => {

    try {
        const {userId, postId, content} = req.body;

        if(req.user.id !== userId){
            return next(errorHandler(403,"You are not allowed to create this comment"));
        }

        const newComment = new Comment({
            content,
            postId,
            userId,
        });

        console.log(newComment)

        await newComment.save();
        res.status(200).json(newComment);

    } catch (error) {
        next(error);
    }
}

const getComments = async (req, res, next) => {

    try{
        const commentList = await Comment.find({postId: req.params.postId}).sort({createdAt: -1});
        res.status(200).json(commentList);

    } catch (error) {
        next(error)
    }
}

const likeComment = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403,"You are not allowed to edit this comment"));

    }

    try {
        const comment = await Comment.findById(req.params.commentId);

        if(!comment) return next(errorHandler(404, "Comment not found"));

        const userIndex = comment.likes.indexOf(req.user.id);

        if(userIndex === -1){
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        } else {
            comment.numberOfLikes -= 1;            
            comment.likes.splice(userIndex,1);
        }
        await comment.save();
        res.status(200).json(comment);

    } catch (error) {
        next(error);
    }
}


const editComment = async (req, res, next) => {

    try {
        const comment = await Comment.findById(req.params.commentId);

        if(!comment) return next(errorHandler(404, "Comment not found"));

        if(req.user.id !== comment.userId){
            return next(errorHandler(403,"You are not allowed to edit this comment"));
        }
        comment.content = req.body.content;
        console.log(comment,req.body.content)

        await comment.save();
        res.status(200).json(comment);

    } catch (error) {
        next(error);
    }
}

const deleteComment = async (req, res, next) => {
    if(req.user.id !== req.params.userId || !req.user.isAdmin ){
        return next(errorHandler(403,"You are not allowed to delete this comment"));
    }

    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json("Comment has been deleted");
    } catch(error) {
        next(error);
    }
}



const getAllComments = async (req, res, next) => {
    if(!req.user.isAdmin) {
        return next(errorHandler(403,"You are not allowed to see comments"));
    }
    try{
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1;

        const commentList = await Comment.find()
        .sort({createdAt: sortDirection})
        .skip(startIndex)
        .limit(limit);;

        const totalComments = await Comment.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthComments = await Comment.countDocuments({
            createdAt: {$gte: oneMonthAgo}
        });
        
        res.status(200).json({
            comments: commentList,
            totalComments,
            lastMonthComments
        });

    } catch (error) {
        next(error)
    }
}

module.exports = {deleteComment, createComment, getComments, likeComment, editComment, getAllComments}