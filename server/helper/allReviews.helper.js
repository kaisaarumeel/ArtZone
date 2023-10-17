

async function getAllReviewsFromSystem(users) {
  return users.flatMap((user) => user.reviews.map((review) => ({
    description: review.description,
    rating: review.rating,
    _id: review._id,
    userEmail: user.userEmail // Add userEmail to the review
  })));
}

module.exports = { getAllReviewsFromSystem }