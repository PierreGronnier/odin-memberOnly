// -------------------- GET / --------------------
exports.indexGet = async (req, res) => {
  try {
    res.render("index", { title: "Hot takes" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};
