let User = mongoose.model("User");

async function updateWallet(userId, amount) {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const opts = { session };
    const A = await User.findOneAndUpdate(
                    { _id: userId }, { $inc: { wallet: amount } }, opts);

    const B = await Transaction(
                    { usersId: userId, amount: amount, type: "credit" })
                    .save(opts);

    await session.commitTransaction();
    session.endSession();
    return true;
  } catch (error) {
    // If an error occurred, abort the whole transaction and
    // undo any changes that might have happened
    await session.abortTransaction();
    session.endSession();
    throw error; 
  }
}