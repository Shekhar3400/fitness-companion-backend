const { generateFitnessResponse } = require('../services/groqService');

const handleChatMessage = async (req, res) => {
  try {
    const { message, userContext } = req.body;

    if (!message || !userContext) {
      return res.status(400).json({
        success: false,
        error: 'Message and userContext are required'
      });
    }

    if (!message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot be empty'
      });
    }

    const context = {
      personality: userContext.personality || 'balanced',
      usageDuration: userContext.usageDuration || 0,
      movement: {
        steps: userContext.steps || 5000,
        activityLevel: calculateActivityLevel(userContext.steps || 5000)
      },
      sleep: {
        hours: userContext.sleepHours || 7
      }
    };

    const response = await generateFitnessResponse(context, message);

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Chat Controller Error:', error.message);

    res.status(500).json({
      success: false,
      error: 'Failed to generate response. Please try again.'
    });
  }
};

const calculateActivityLevel = (steps) => {
  if (steps < 3000) return 'sedentary';
  if (steps < 7000) return 'lightly active';
  if (steps < 10000) return 'moderately active';
  return 'very active';
};

module.exports = { handleChatMessage };
