module.exports = {
    database: 'mongodb://127.0.0.1:27017/amazonapi',
    port: '2398',
    secret: 'TestAplication21',
};


// arr = [];
// let chain = Promise.resolve();
//
// let simpleF = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve("result");
//     }, 100);
// });
// for (let i = 1; i < 6; i++) {
//     arr.push(simpleF);
//
// }
//
//
// let results = [];
//
// // в цикле добавляем задачи в цепочку
// arr.forEach(function(url) {
//     chain = chain
//         .then(() => url)
//         .then((result) => {
//             results.push(result);
//         });
// });
//
// chain.then(() => {
//     console.log(results);
// });