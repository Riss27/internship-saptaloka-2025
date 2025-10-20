const axios = require("axios");

exports.translateText = async (req, res) => {
  const { text, target, source = "id", format = "text" } = req.body;

  if (!text || !target) {
    return res.status(400).json({ status: "fail", message: "Teks dan bahasa tujuan wajib diisi." });
  }

  try {
    const response = await axios.post("https://libretranslate.de/translate", {
      q: text,
      source: source,
      target: target,
      format: format,
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error("Translation API error:", error.message);
    res.status(500).json({
      status: "error",
      message: "Gagal menerjemahkan teks.",
      error: error.message,
    });
  }
};
