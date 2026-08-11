const { GoogleGenAI } = require('@google/genai')

const handleChat = async (req, res, next) => {
  try {
    const { prompt, history = [] } = req.body

    if (!prompt) {
      return res.status(400).json({ success: false, message: 'Prompt is required' })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ 
        success: false, 
        message: 'GEMINI_API_KEY is missing in backend .env file. Please add it to enable Zealth AI.' 
      })
    }

    const ai = new GoogleGenAI({ apiKey })

    const systemInstruction = `You are Zealth AI, an advanced, professional medical clinic management assistant for the ZealthOS platform. 
Your goal is to help healthcare providers, clinic admins, and staff with practice management, data insights, and patient care guidance. 
Be concise, helpful, and professional.`

    // Format history for Gemini
    const formattedHistory = history.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }))

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: formattedHistory,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    })

    const response = await chat.sendMessage({ message: prompt })

    const reply = response.text

    return res.json({
      success: true,
      data: { reply }
    })

  } catch (error) {
    console.error('AI Error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to generate AI response. Please try again later.'
    })
  }
}

module.exports = {
  handleChat
}
