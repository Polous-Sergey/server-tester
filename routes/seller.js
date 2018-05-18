const router = require('express').Router();
const Product = require('../models/product');

const faker = require('faker');

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