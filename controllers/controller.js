// -------------------- GET / --------------------
exports.indexGet = async (req, res) => {
  try {
    res.render("index", { title: "Hot takes" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// -------------------- GET /sign-up --------------------
exports.signupGet = async (req, res) => {
  try {
    res.render("signup", { title: "Hot takes" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
