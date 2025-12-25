const express = require("express");
const router = express.Router();
const { generateFitnessResponse } = require("../services/openaiService");

router.post("/message", async (req, res) => {
  try {
    const { message, userContext } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Please send a message so I can help you 🙂"
      });
    }

    const aiReply = await generateFitnessResponse(userContext, message);

    // ✅ ALWAYS return { reply }
    return res.status(200).json({
      reply: aiReply
    });

  } catch (error) {
    console.error("❌ Chat API error:", error);

    // ✅ STILL return { reply } even on error
    return res.status(200).json({
      reply: "Sorry, I had trouble answering that. Please try again."
    });
  }
});

module.exports = router;
