async function validateReview(res,result,order) {
    let orderMatched = false;
    for (let i = 0; i < result.orders.length; i++) {
        if (result.orders[i].hash === order) {
            orderMatched = true;
        }
    }
    if (!orderMatched) return res.sendStatus(404);
    let reviewExists = false;
    for (let i = 0; i < result.reviews.length; i++) {
        if (result.reviews[i].orderHash === order) {
            reviewExists = true;
        }
    }
    if (reviewExists) return res.sendStatus(403);
}

module.exports = {
    validateReview
}