const express = require("express");
const router = express.Router();

// ✅ CORRECT import (this fixes "not a function" error)
const { generateFitnessResponse } = require("../services/openaiService");

router.post("/message", async (req, res) => {
  try {
    const { message, userContext } = req.body || {};

    // ✅ Handle missing message safely
    if (!message) {
      return res.status(200).json({
        reply: "Please send a message so I can help you 🙂"
      });
    }

    // ✅ Call AI service
    const aiReply = await generateFitnessResponse(userContext, message);

    // ✅ Always return { reply }
    return res.status(200).json({
      reply: aiReply
    });

  } catch (error) {
    console.error("❌ Chat API error:", error);

    // ✅ Never crash frontend
    return res.status(200).json({
      reply: "Sorry, I had trouble answering that. Please try again."
    });
  }
});

module.exports = router;
