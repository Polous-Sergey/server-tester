const router = require('express').Router();
const Survey = require('../models/survey');
const Section = require('../models/section');
const Question = require('../models/question');
const Answer = require('../models/answer');

const Product = require('../models/product');

const checkJWT = require('../middlewares/check-jwt');

// const aws = require('aws-sdk');
// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const s3 = new aws.S3({
//     accessKeyId: "AKIAJZ5YUVKTMPGSL7JQ",
//     secretAccessKey: "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"
// });

// const upload = multer({
//     storage: multerS3({
//         s3: s3,
//         bucket: 'amazonowebapplication',
//         metadata: function (req, res, cb) {
//             cb(null, {fieldName: file.fieldName});
//         },
//         key: function (req, res, cb) {
//             cb(null, Date.now().toString());
//         }
//     })
// });

router.route('/products')
    .get(checkJWT, (req, res, next) => {
        Product.find({owner: req.decoded.user._id})
            .populate('owner')
            .populate('category')
            .exec((err, products) => {
                if (err) return console.log(err);
                if (products) {
                    res.json({
                        success: true,
                        products: products,
                        message: 'Successfuly'
                    });
                }
            });
    })
    .post(checkJWT, (req, res, next) => {
        let product = new Product();
        product.owner = req.decoded.user._id;
        product.category = req.body.categoryId;
        product.title = req.body.title;
        product.price = req.body.price;
        product.description = req.body.description;
        product.image = req.body.filePath;
        product.save();

        res.json({
            success: true,
            message: "Successfuly",
        });
    });

router.route('/survey')
// .get(checkJWT, (req, res, next) => {
    .get((req, res, next) => {
        Survey.findById(req.query.id)
            .populate('sections')
            // .deepPopulate('sections.questions')
            // .deepPopulate('sections.questions.answers')
            .exec((err, survey) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Error',
                    err: err
                });

                return console.log(err);
            }
            if (survey) {
                res.json({
                    success: true,
                    survey: survey,
                    message: 'Successfuly'
                });
            }
        });
    })
    // .populate('owner')
    // .populate('category')
    // .post(checkJWT, (req, res, next) => {
    .post((req, res, next) => {
        let survey = new Survey();
        survey.name = req.body.name;
        survey.sections = [];
        survey.save();

        res.json({
            success: true,
            survey: survey,
            message: "Successfuly",
        });
    });

router.route('/section')
// .get(checkJWT, (req, res, next) => {
    .get((req, res, next) => {
        Section.findById(req.query.id, (err, section) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Error',
                    err: err
                });

                return console.log(err);
            }
            if (section) {
                res.json({
                    success: true,
                    section: section,
                    message: 'Successfuly'
                });
            }
        });
    })
    // .populate('owner')
    // .populate('category')
    // .post(checkJWT, (req, res, next) => {
    .post((req, res, next) => {
        Survey.findById(req.body.surveyId, (err, survey) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Error',
                    err: err
                });

                return console.log(err);
            }
            if (survey) {
                let section = new Section();
                section.name = req.body.name;
                section.questions = [];
                section.save();

                survey.sections.push(section._id);
                survey.save();


                res.json({
                    success: true,
                    survey: survey,
                    message: 'Successfuly'
                });
            }
        });
    });

router.route('/question')
// .get(checkJWT, (req, res, next) => {
    .get((req, res, next) => {
        Question.findById(req.query.id, (err, question) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Error',
                    err: err
                });

                return console.log(err);
            }
            if (question) {
                res.json({
                    success: true,
                    question: question,
                    message: 'Successfuly'
                });
            }
        });
    })
    // .populate('owner')
    // .populate('category')
    // .post(checkJWT, (req, res, next) => {
    .post((req, res, next) => {
        Section.findById(req.body.sectionId, (err, section) => {
            if (err) {
                res.json({
                    success: false,
                    message: 'Error',
                    err: err
                });

                return console.log(err);
            }
            if (section) {
                let question = new Question();
                question.name = req.body.name;
                question.answers = [];
                question.save();

                section.questions.push(question._id);
                section.save();

                if (req.body.answers) {
                    req.body.answers.forEach((answerItem) => {
                        let answer = new Answer();
                        answer.name = answerItem.name;
                        answer.isTrue = answerItem.isTrue;
                        answer.save();

                        question.answers.push(answer._id);
                        question.save();
                    })
                }

                res.json({
                    success: true,
                    section: question,
                    message: 'Successfuly'
                });
            }
        });
    });

// router.route('/answer')
// // .get(checkJWT, (req, res, next) => {
//     .get((req, res, next) => {
//         Question.findById(req.query.id, (err, question) => {
//             if (err) {
//                 res.json({
//                     success: false,
//                     message: 'Error',
//                     err: err
//                 });
//
//                 return console.log(err);
//             }
//             if (question) {
//                 res.json({
//                     success: true,
//                     question: question,
//                     message: 'Successfuly'
//                 });
//             }
//         });
//     })
//     // .populate('owner')
//     // .populate('category')
//     // .post(checkJWT, (req, res, next) => {
//     .post((req, res, next) => {
//         Section.findById(req.body.sectionId, (err, section) => {
//             if (err) {
//                 res.json({
//                     success: false,
//                     message: 'Error',
//                     err: err
//                 });
//
//                 return console.log(err);
//             }
//             if (section) {
//                 let question = new Question();
//                 question.name = req.body.name;
//                 question.answers = [];
//                 question.save();
//
//                 section.questions.push(question._id);
//                 section.save();
//
//
//                 res.json({
//                     success: true,
//                     section: section,
//                     message: 'Successfuly'
//                 });
//             }
//         });
//     });

// router.get('/faker/test/:id', (req, res, next) => {
//     for (let i = 0; i < 20; i++) {
//         let product = new Product();
//         product.owner = '5ad46d05024b5925587ca5e8';
//         product.category = '5ad5c6b349e9e131abc69240';
//         product.image = faker.image.cats();
//         product.title = faker.commerce.productName();
//         product.description = faker.lorem.words();
//         product.price = faker.commerce.price();
//         product.save();
//     }
//
//     res.json({
//        message: 'Successfuly added 20 facer products'
//     });
// });

module.exports = router;