const axios = require("axios");

// The upstream translator accepts an array, so a page's worth of strings costs
// one request instead of one request per string. Keeping this endpoint a thin
// proxy means adding batching did not widen what a caller can ask for.
exports.translateText = async (req, res) => {
  const { text, texts, target, source = "id", format = "text" } = req.body;

  const isBatch = Array.isArray(texts);
  const requested = isBatch ? texts : text;

  if (!requested || !requested.length || !target) {
    return res.status(400).json({ status: "fail", message: "Teks dan bahasa tujuan wajib diisi." });
  }

  const payload = isBatch ? requested.slice(0, 100) : requested;

  try {
    const response = await axios.post("https://libretranslate.de/translate", {
      q: payload,
      source: source,
      target: target,
      format: format,
    });

    if (isBatch) {
      const translatedTexts = response.data.translatedText || [];
      // The upstream service occasionally answers with fewer items than it was
      // given. Padding keeps the response aligned with the request so the caller
      // can pair each result back to the string it asked about.
      while (translatedTexts.length < payload.length) {
        translatedTexts.push(payload[translatedTexts.length]);
      }
      return res.status(200).json({ translatedTexts: translatedTexts.slice(0, payload.length) });
    }

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
