const { generateFitnessResponse } = require('../services/openaiService');

const handleChatMessage = async (req, res) => {
  try {
    const { message, userContext } = req.body;
    
    // Validate input
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
    
    // Build comprehensive context with defaults
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
    
    console.log('📨 Processing chat message:', {
      message: message.substring(0, 50) + '...',
      personality: context.personality,
      steps: context.movement.steps,
      sleep: context.sleep.hours,
      usageDuration: context.usageDuration
    });
    
    // Get AI response
    const response = await generateFitnessResponse(context, message);
    
    console.log('✅ Response generated successfully');
    
    res.json({
      success: true,
      response: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Chat Controller Error:', error.message);
    
    // Check if it's an OpenAI API error
    if (error.message.includes('API')) {
      return res.status(503).json({
        success: false,
        error: 'AI service temporarily unavailable. Please try again.'
      });
    }
    
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