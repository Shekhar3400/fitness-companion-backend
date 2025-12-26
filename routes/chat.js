const express = require("express");
const router = express.Router();

// ✅ DIRECT IMPORT (MATCHES DIRECT EXPORT)
const generateFitnessResponse = require("../services/openaiService");

router.post("/message", async (req, res) => {
  try {
    const { message, userContext } = req.body || {};

    if (!message) {
      return res.status(200).json({
        reply: "Please send a message so I can help you 🙂"
      });
    }

    const reply = await generateFitnessResponse(userContext, message);

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("❌ Chat API error:", error);
    return res.status(200).json({
      reply: "Sorry, I had trouble answering that. Please try again."
    });
  }
});

module.exports = router;
