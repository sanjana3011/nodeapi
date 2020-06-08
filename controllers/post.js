const Post = require("../models/post");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");
const cloudinary = require('cloudinary').v2
exports.postById = (req, res, next, id) => {
    Post.findById(id)
        .populate("postedBy", "_id name")
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({
                    error: err
                });
            }
            req.post = post;
            next();
        });
};

exports.getPosts = (req, res) => {
    Post.find({})
        .populate("postedBy", "_id name")
        .sort({created:'-1'})
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(posts);
        })
        .catch(err => console.log(err));
};

exports.createPost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req, async(err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Image could not be uploaded"
            });
        }
        let post = new Post(fields);

        //upload images
        let postPhotos=[];
        if (files.photos) {
            if(!files.photos.length){
                files.photos=[files.photos]             //for single img files, make single element array first
            }
            for(let i=0;i<files.photos.length;i++){
                await cloudinary.uploader.upload(
                    files.photos[i].path ,
                    {
                        resource_type: "image",
                        folder: `kokostore_uploads/post_images/`,
                        use_filename: true, 
                        unique_filename: true
                    } , 
                    (err, result)=> {
                        if(err){
                            return res.status(400).json({
                                error: "Post could not be created. Please refresh and try again."
                            })}
                        else
                            {postPhotos.push({link:result.secure_url, public_id:result.public_id})}
                    }
                );
            }
        }
        //assign post details
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;
        post.photos=postPhotos;

        //save post
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(result);
        });
        }
    );
};

exports.postsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate("postedBy", "_id name")
        .sort({created:'-1'})
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(posts);
        });
};

exports.isPoster = (req, res, next) => {
    let isPoster =
        req.post && req.auth && req.post.postedBy._id == req.auth._id;

    if (!isPoster) {
        return res.status(403).json({
            error: "User is not authorized"
        });
    }
    next();
};

exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.multiples = true;
    form.parse(req, async(err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photos could not be uploaded"
            });
        }

        //upload images
        let post = req.post;
        post = _.extend(post, fields);
        let postPhotos=[];
        if (files.photos) {
            if(!files.photos.length){
                files.photos=[files.photos]         //for single img files, make single element array first
            }
            for(let i=0;i<files.photos.length;i++){
                await cloudinary.uploader.upload(
                    files.photos[i].path ,
                    {
                        resource_type: "image",
                        folder: `kokostore_uploads/post_images/`,
                        use_filename: true, 
                        unique_filename: true
                    } , 
                    (err, result)=> {
                        if(err){
                            return res.status(400).json({
                                error: "Post could not be updated. Please refresh and try again."
                            })}
                        else
                            postPhotos.push({link:result.secure_url, public_id:result.public_id})
                    }
                )
                .catch(err=>{console.log(err)}) ;
                }
            }   
            post.photos=postPhotos;
            post.updated = Date.now();

        // save post
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json(post);
        });
    });
};


// exports.updatePost = (req, res, next) => {
//     let post = req.post;
//     post = _.extend(post, req.body);
//     post.updated = Date.now();
//     post.save(err => {
//         if (err) {
//             return res.status(400).json({
//                 error: err
//             });
//         }
//         res.json(post);
//     });
// };

exports.deletePost = (req, res) => {
    let post = req.post;
    for(let img in post.photos)
        cloudinary.uploader.destroy(post.photos[img].public_id, (result) =>{ console.log('Images deleted') });
        
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({
            message: "Post deleted successfully"
        });
    });
};

exports.photo = (req, res, next) => {
    res.set("Content-Type", req.post.photo.contentType);
    return res.send(req.post.photo.data);
};

exports.singlePost = (req, res) => {
    return res.json(req.post);
};