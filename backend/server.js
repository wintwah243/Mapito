import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/generate-roadmap', async (req, res) => {
  const { goal } = req.body;

  if (!goal) {
    return res.status(400).json({ error: 'Goal is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

    const prompt = `
      You are a career roadmap expert.
      Generate a clear and beginner-friendly learning roadmap for someone who wants to become a "${goal}".
      Break it down into stages or milestones and make as short and clear as possible.
      Use simple language.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const roadmapText = response.text();

    res.json({ roadmap: roadmapText });
  } catch (error) {
    console.error('Error while generating roadmap:', error);
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
