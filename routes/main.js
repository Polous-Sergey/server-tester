const router = require('express').Router();
const async = require('async');
const Category = require('../models/category');
const Product = require('../models/product');
const Review = require('../models/review');

const checkJWT = require('../middlewares/check-jwt');

router.route('/categories')
    .get((req, res, next) => {
        Category.find({}, (err, categories) => {
            if (err) return console.log(err);

            res.json({
                success: true,
                message: 'Successful',
                categories: categories
            });
        });
    })
    .post((req, res, next) => {
        let category = new Category();
        category.name = req.body.name;
        category.save();
        res.json({
            success: true,
            message: 'Successful'
        });
    });


router.get('/categories/:id', (req, res, next) => {
    const perPage = 10;
    const page = req.query.page;

    async.parallel([
        function (calback) {
            Product.count({category: req.params.id}, (err, totalProducts) => {
                calback(err, totalProducts)
            });
        },

        function (callback) {
            Product.find({category: req.params.id})
                .skip(perPage * page)
                .limit(perPage)
                .populate('category')
                .populate('owner')
                .populate('review')
                .exec((err, products) => {
                    if (err) return console.log(err);
                    callback(err, products);
                });
        },

        function (callback) {
            Category.findOne({_id: req.params.id}, (err, category) => {
                callback(err, category)
            });
        }
    ], function (err, results) {
        let totalProducts = results[0];
        let products = results[1];
        let category = results[2];

        res.json({
            success: true,
            message: 'category',
            products: products,
            categoryName: category.name,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)

        });
    });

});

router.get('/products', (req, res, next) => {
    const pageSize = req.query.pageSize;
    const sortOrder = req.query.sortOrder;
    const filter = req.query.filter;
    const courseId = req.query.courseId;
    const perPage = 10;
    const page = req.query.pageNumber;

    async.parallel([
        function (calback) {
            Product.count({}, (err, totalProducts) => {
                calback(err, totalProducts)
            });
        },

        function (callback) {
            Product.find({})
                .skip(perPage * page)
                .limit(perPage)
                .populate('category')
                .populate('owner')
                .populate('reviews')
                .exec((err, products) => {
                    if (err) return console.log(err);
                    callback(err, products);
                });
        },
    ], function (err, results) {
        let totalProducts = results[0];
        let products = results[1];

        res.json({
            success: true,
            message: 'products',
            products: products,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)

        });
    });
});

router.get('/product/:id', (req, res, next) => {
    Product.findById({_id: req.params.id})
        .populate('category')
        .populate('owner')
        .deepPopulate('reviews.owner')
        .exec((err, product) => {
            if (err) {
                res.json({
                    succes: false,
                    message: 'Product is not found',
                    err: err
                });
            } else {
                res.json({
                    succes: true,
                    message: 'Success',
                    product: product
                });
            }
        });
});

router.post('/review', checkJWT, (req, res, next) => {
    async.waterfall([
        function (calback) {
            Product.findOne({_id: req.body.productId}, (err, product) => {
                if (err) {
                    console.log(err);
                    res.json({
                        success: false,
                        message: 'Product is not found'
                    })
                } else {
                    calback(err, product)
                }
            });
        },

        function (product) {
            let review = Review();
            review.owner = req.decoded.user._id;

            if (req.body.title) review.title = req.body.title;
            if (req.body.description) review.description = req.body.description;
            review.rating = req.body.rating;

            product.reviews.push(review._id);
            product.save();
            review.save();
            res.json({
                success: true,
                message: 'Successfully added the review'
            });
        }
    ]);
});

module.exports = router;