import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import OAuthStrategy from 'passport-google-oauth2';
import jwt from 'jsonwebtoken';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userdb from './models/User.js';
import rateLimit from 'express-rate-limit';
import axios from 'axios';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
  })
);

connectDB();
app.use(express.json());

//setup for session
app.use(session({
  secret:"e4d8aab3b6a0e2b114d5c76cb90d20cc54a39977746075609b28244acb00741b2021f63ea4b88598a457c2505640e85600587007386bdfaca9f0352b782405f0",
  resave:false,
  saveUninitialized: true
}));

//setup for passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuthStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://mapito.onrender.com/api/auth/google/callback",
      scope: ["profile", "email"]
  },
  async(accessToken, refreshToken, profile, done) => {
      
      try{
          let user = await userdb.findOne({googleId: profile.id});

          if(!user){
              user = new userdb({
                   googleId: profile.id,
                   fullName: profile.displayName,
                   email: profile.emails[0].value,
                   profileImageUrl: profile.photos[0].value
              });
              await user.save();
          }
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
              expiresIn: "1d",
          });
      
          return done(null, user);
      }catch(error){
          return done(error, null);
      }
  }
)
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use("/api/auth", authRoutes);
app.use("/uploads", express.static(path.join(__dirname,"uploads")));

// Add rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, 
  message: 'Too many requests, please try again later'
});

app.use('/api/generate-roadmap', apiLimiter);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// API route for roadmap
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
    console.error('Error generating roadmap:', error);
    
    if (error.status === 429) {
      // Return a pre-defined roadmap when rate limited
      const fallbackRoadmap = getFallbackRoadmap(req.body.goal);
      return res.status(200).json({ 
        roadmap: fallbackRoadmap,
        warning: 'Using fallback content due to API limits' 
      });
    }
    
    res.status(500).json({ error: 'Failed to generate roadmap' });
  }
});

//for backup plan
function getFallbackRoadmap(goal) {
  // Simple predefined roadmaps
  const fallbacks = {
    'frontend developer': `1. Learn HTML basics\n2. Master CSS fundamentals\n3. Learn JavaScript\n4. Pick a framework (React/Vue)\n5. Build projects`,
    'backend developer': `1. Learn a server language (Node/Python)\n2. Understand databases\n3. Learn API design\n4. Study authentication\n5. Build projects`,
    'data scientist': `1. Learn Python basics\n2. Study statistics\n3. Learn data analysis\n4. Master machine learning basics\n5. Work on datasets`
  };
  return fallbacks[goal.toLowerCase()] || 
    `1. Research ${goal} fundamentals\n2. Find learning resources\n3. Practice regularly\n4. Build small projects\n5. Seek feedback`;
}

//api route for ai mock interview
app.post('/api/mock-interview', async (req, res) => {
  const { role, answer, history } = req.body;

  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

  const prompt = `
You are a mock interviewer for the role of ${role}.
${history ? `Here is the conversation so far:\n${history}` : ''}
${answer ? `Candidate's latest answer: "${answer}". Give feedback and ask the next question.` : 'Start the interview by asking the first question.'}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const nextMessage = response.text();

    res.json({ message: nextMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate interview content' });
  }
});

//api route for summarize note
app.post('/api/summarize-note', async (req, res) => {
  const { note } = req.body;

  // Validate input
  if (!note || typeof note !== 'string') {
    return res.status(400).json({ 
      error: 'Invalid input',
      details: 'Note must be a non-empty string'
    });
  }
  
  const processedNote = note.length > 10000 ? note.substring(0, 10000) + '...' : note;

  try {
    // we will use Gemini first
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
    const prompt = `Summarize the following note in a short and clear paragraph: ${processedNote}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    
    return res.json({ 
      summary,
      source: 'gemini',
      length: summary.length 
    });
    
  } catch (geminiError) {
    console.error('Gemini API error:', geminiError);
    
    // For backup plan, we will use hugging face
    try {
      if (!process.env.HF_API_KEY) {
        throw new Error('Hugging Face API key not configured');
      }

      const hfResponse = await axios.post(
        'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
        { inputs: processedNote },
        { 
          headers: { 
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      if (!hfResponse.data || !hfResponse.data[0] || !hfResponse.data[0].summary_text) {
        throw new Error('Invalid response format from Hugging Face');
      }

      return res.json({ 
        summary: hfResponse.data[0].summary_text,
        source: 'huggingface',
        length: hfResponse.data[0].summary_text.length,
        warning: 'Using alternative summary service'
      });
      
    } catch (hfError) {
      console.error('Hugging Face fallback failed:', hfError);
      
      // for backup plan 2
      try {
        const summary = simpleFallbackSummary(processedNote);
        return res.json({ 
          summary,
          source: 'basic-fallback',
          length: summary.length,
          warning: 'Using simplified summary due to API limitations'
        });
      } catch (finalError) {
        console.error('All fallbacks failed:', finalError);
        return res.status(500).json({ 
          error: 'Failed to summarize note',
          details: {
            geminiError: geminiError.message,
            hfError: hfError.message,
            finalError: finalError.message
          },
          suggestion: 'Please try again later or with a shorter note'
        });
      }
    }
  }
});

// Improved simple fallback function
function simpleFallbackSummary(text) {
  if (!text) return 'No content to summarize';
  
  // Remove excessive whitespace and newlines
  const cleanText = text.replace(/\s+/g, ' ').trim();
  
  // Extract first few meaningful sentences
  const sentences = cleanText.split(/[.!?]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
    
  if (sentences.length === 0) {
    return cleanText.slice(0, 200) + (cleanText.length > 200 ? '...' : '');
  }
  
  // Take first 2-3 sentences that aren't too short/long
  const importantSentences = sentences
    .filter(s => s.length > 20 && s.length < 150)
    .slice(0, 3);
    
  if (importantSentences.length === 0) {
    return sentences.slice(0, 2).join('. ') + '.';
  }
  
  return importantSentences.join('. ') + '.';
}

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
