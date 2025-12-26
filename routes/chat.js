const express = require("express");
const router = express.Router();

const { generateFitnessResponse } = require("../services/openaiService");

router.post("/message", async (req, res) => {
  try {
    const { message, userContext } = req.body || {};

    if (!message) {
      return res.status(200).json({
        success: false,
        response: "Please send a message so I can help you 🙂"
      });
    }

    const reply = await generateFitnessResponse(userContext, message);

    return res.status(200).json({
      success: true,
      response: reply
    });

  } catch (error) {
    console.error("❌ Chat API error:", error);

    return res.status(200).json({
      success: false,
      response: "Sorry, I encountered an error. Failed to get response."
    });
  }
});

module.exports = router;
