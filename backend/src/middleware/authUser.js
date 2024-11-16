const authUser = (req, res, next) => {
  if (req.user == null) {
    res.status(403).json({ message: "You need to login." });
  }
};

module.exports = { authUser };
