async function validateReview(res, result, order) {
    let invalid = false;
    for (let i = 0; i < result.orders.length; i++) {
        if (result.orders[i].hash === order) {
            orderMatched = true;
        }
    }
    if (!orderMatched) throw new Error("Order not found")
    let reviewExists = false;
    for (let i = 0; i < result.reviews.length; i++) {
        if (result.reviews[i].orderHash === order) {
            reviewExists = true;
        }
    }
    if (reviewExists) throw new Error("Review exists")
}

module.exports = {
    validateReview
}