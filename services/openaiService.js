const OpenAI = require("openai");

let openai;

// ✅ Safe initialization (prevents Vercel crash)
try {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ OPENAI_API_KEY is missing");
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (err) {
  console.error("❌ Failed to initialize OpenAI:", err);
}

const generateFitnessResponse = async (userContext, message) => {
  if (!openai) {
    throw new Error("OpenAI client not initialized");
  }

  const systemPrompt = buildSystemPrompt(userContext);

  try {
    const completion = await openai.chat.completions.create({
      // 🔴 CHANGE ONLY THIS LINE
      model: "gpt-4o-mini",

      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw new Error("Failed to generate AI response");
  }
};

/* 🔽 YOUR buildSystemPrompt FUNCTION
   ⛔ UNCHANGED — EXACT SAME CODE
*/
const buildSystemPrompt = (context) => {
  const { personality, usageDuration, movement, sleep } = context;

  let personalityInstruction = '';
  if (personality === 'motivated') {
    personalityInstruction = `Use energetic, challenging language. Push for ambitious goals.`;
  } else if (personality === 'balanced') {
    personalityInstruction = `Use encouraging, steady language.`;
  } else if (personality === 'gentle') {
    personalityInstruction = `Use supportive, gentle language.`;
  }

  let experienceLevel = '';
  let adviceComplexity = '';
  if (usageDuration < 7) {
    experienceLevel = 'New user';
    adviceComplexity = `Keep advice very simple.`;
  } else if (usageDuration < 30) {
    experienceLevel = 'Intermediate user';
    adviceComplexity = `Provide more detailed guidance.`;
  } else {
    experienceLevel = 'Experienced user';
    adviceComplexity = `Offer advanced strategies.`;
  }

  let activityGuidance = '';
  if (movement.steps < 3000) {
    activityGuidance = `Very low activity. Suggest gentle movement.`;
  } else if (movement.steps < 7000) {
    activityGuidance = `Moderate activity. Encourage gradual increase.`;
  } else if (movement.steps < 10000) {
    activityGuidance = `Good activity level. Focus on consistency.`;
  } else {
    activityGuidance = `High activity. Emphasize recovery.`;
  }

  let sleepGuidance = '';
  if (sleep.hours < 6) {
    sleepGuidance = `Poor sleep. Prioritize rest.`;
  } else if (sleep.hours < 7) {
    sleepGuidance = `Below optimal sleep. Encourage more rest.`;
  } else if (sleep.hours <= 9) {
    sleepGuidance = `Good sleep. Normal training applies.`;
  } else {
    sleepGuidance = `Excessive sleep. Suggest evaluation.`;
  }

  return `You are a personalized AI fitness companion.

USER PROFILE:
- Personality: ${personality}
- Usage: ${usageDuration} days (${experienceLevel})
- Steps: ${movement.steps}
- Sleep: ${sleep.hours} hours

STYLE:
${personalityInstruction}

GUIDANCE:
${adviceComplexity}

ACTIVITY:
${activityGuidance}

SLEEP:
${sleepGuidance}

Keep responses concise, actionable, encouraging, and adaptive.`;
};

module.exports = { generateFitnessResponse };
