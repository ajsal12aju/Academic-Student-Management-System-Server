const testGet = async (_, res) => {
  try {
    const message = "Server is running, GET method returned OK";
    res.status(200).json({ message });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const testPost = async (req, res) => {
  try {
    const { name } = req.body;
    let message = "";
    if (name && name != "") {
      const greetings = `Hi ${name} ,greetings`;
      message = "Server is running, POST method returned OK";
      return res.status(200).json({ greetings, message });
    }
    message =
      "Server is running, POST method returned OK ,But incomplete request body";
    return res.status(400).json({ message });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" ,message:error.message});
  }
};

module.exports = testGet;
module.exports = testPost;
