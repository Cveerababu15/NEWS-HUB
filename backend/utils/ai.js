const axios = require("axios");

const HF_API = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";

exports.summarizeNews = async (text) => {
  try {
    const res = await axios.post(
      HF_API,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`
        }
      }
    );

    return res.data[0]?.summary_text || text;

  } catch (error) {
    console.log("AI Failed → Using fallback");
    return text.substring(0, 100); // fallback summary
  }
};