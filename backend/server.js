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

// API route for generate roadmap
app.post('/api/generate-roadmap', async (req, res) => {
  const { goal } = req.body;

  if (!goal || typeof goal !== 'string') {
    return res.status(400).json({ 
      error: 'Invalid input',
      details: 'Goal must be a non-empty string' 
    });
  }

  // Process the goal input
  const processedGoal = goal.trim().substring(0, 100); // Limit length

  try {
    // we will use gemini first
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
    const prompt = `
      Create a 5-step beginner-friendly learning roadmap for becoming a "${processedGoal}".
      Format as numbered steps with clear objectives.
      Keep each step concise (1-2 sentences).
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const roadmapText = response.text();
    
    return res.json({ 
      roadmap: roadmapText,
      source: 'gemini'
    });
    
  } catch (geminiError) {
    console.error('Gemini API error:', geminiError);
    
    // for backup plan, we will use huggin face
    try {
      if (!process.env.HF_API_KEY) {
        throw new Error('Hugging Face API key not configured');
      }

      const hfResponse = await axios.post(
        'https://api-inference.huggingface.co/models/google/flan-t5-xxl',
        {
          inputs: `Generate a 5-step learning roadmap for becoming a ${processedGoal}. Format as numbered steps.`
        },
        { 
          headers: { 
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (!hfResponse.data || !hfResponse.data[0] || !hfResponse.data[0].generated_text) {
        throw new Error('Invalid response format from Hugging Face');
      }

      const hfRoadmap = formatHuggingFaceResponse(hfResponse.data[0].generated_text);
      
      return res.json({ 
        roadmap: hfRoadmap,
        source: 'huggingface',
        warning: 'Using alternative AI service'
      });
      
    } catch (hfError) {
      console.error('Hugging Face fallback failed:', hfError);
      
      // backup plan 2
      try {
        const predefinedRoadmap = getPredefinedRoadmap(processedGoal);
        return res.json({ 
          roadmap: predefinedRoadmap,
          source: 'predefined',
          warning: 'Using generic roadmap template'
        });
      } catch (finalError) {
        console.error('All fallbacks failed:', finalError);
        return res.status(500).json({ 
          error: 'Failed to generate roadmap',
          details: {
            geminiError: geminiError.message,
            hfError: hfError.message
          },
          suggestion: 'Please try again later or with a different goal description'
        });
      }
    }
  }
});

// For Hugging Face's raw response into a cleaner roadmap
function formatHuggingFaceResponse(text) {
  // Basic cleaning and formatting
  return text
    .replace(/<\/?s>/g, '') // Remove any HTML tags
    .replace(/\n+/g, '\n')  // Remove extra newlines
    .trim();
}

// for predefined roadmaps
function getPredefinedRoadmap(goal) {
  const lowerGoal = goal.toLowerCase();
  
  const roadmaps = {
    'frontend': `1. Learn HTML fundamentals\n2. Master CSS and responsive design\n3. Learn JavaScript (ES6+)\n4. Choose a framework (React, Vue, Angular)\n5. Build portfolio projects`,
    'backend': `1. Learn a server language (Node.js, Python, Java)\n2. Understand databases (SQL & NoSQL)\n3. Learn API development (REST, GraphQL)\n4. Study authentication & security\n5. Build scalable applications`,
    'data science': `1. Learn Python and data analysis (Pandas, NumPy)\n2. Study statistics fundamentals\n3. Learn data visualization (Matplotlib, Seaborn)\n4. Explore machine learning basics\n5. Work on real-world datasets`,
    'mobile': `1. Choose a platform (iOS/Swift or Android/Kotlin)\n2. Learn UI/UX principles\n3. Understand mobile architecture\n4. Study platform-specific APIs\n5. Publish an app to store`,
    'devops': `1. Learn Linux fundamentals\n2. Master version control (Git)\n3. Understand CI/CD pipelines\n4. Learn containerization (Docker)\n5. Study cloud platforms (AWS, GCP, Azure)`
  };

  // Find the best matching roadmap
  for (const [key, roadmap] of Object.entries(roadmaps)) {
    if (lowerGoal.includes(key)) {
      return roadmap;
    }
  }

  // Generic fallback roadmap
  return `1. Research ${goal} fundamentals\n2. Find quality learning resources\n3. Practice consistently\n4. Build small projects\n5. Seek feedback and iterate`;
};

//api route for ai mock interview
app.post('/api/mock-interview', async (req, res) => {
  const { role, answer, history } = req.body;

  // Validate inputs
  if (!role || typeof role !== 'string') {
    return res.status(400).json({ 
      error: 'Invalid role',
      details: 'Role must be a non-empty string' 
    });
  }

  try {
    // we will use gemini first
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
    const prompt = `
      You are a professional interviewer for ${role} positions.
      ${history ? `Conversation history:\n${history}\n` : ''}
      ${answer ? 
        `The candidate responded: "${answer.substring(0, 500)}"\n\n` + 
        `Provide constructive feedback (1-2 sentences) and ask a relevant follow-up question.` : 
        `Start the interview by asking the first technical question for a ${role} position.`
      }
      Keep responses professional and concise.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const nextMessage = response.text();

    return res.json({ 
      message: nextMessage,
      source: 'gemini'
    });

  } catch (geminiError) {
    console.error('Gemini API error:', geminiError);
    
    // backup plan 1: we will use Hugging Face API
    try {
      if (!process.env.HF_API_KEY) {
        throw new Error('Hugging Face API key not configured');
      }

      const hfPrompt = `Act as a professional interviewer for ${role} position. ${
        answer ? 
        `The candidate said: "${answer.substring(0, 300)}". ` + 
        `Give brief feedback and ask a follow-up question.` : 
        `Ask the first technical interview question for ${role}.`
      }`;

      const hfResponse = await axios.post(
        'https://api-inference.huggingface.co/models/google/flan-t5-xxl',
        { inputs: hfPrompt },
        { 
          headers: { 
            Authorization: `Bearer ${process.env.HF_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (!hfResponse.data || !hfResponse.data[0] || !hfResponse.data[0].generated_text) {
        throw new Error('Invalid response format from Hugging Face');
      }

      const hfMessage = cleanInterviewResponse(hfResponse.data[0].generated_text);
      
      return res.json({ 
        message: hfMessage,
        source: 'huggingface',
        warning: 'Using alternative interview service'
      });

    } catch (hfError) {
      console.error('Hugging Face fallback failed:', hfError);
      
      // backup plan 2: Predefined interview questions
      try {
        const predefinedResponse = getPredefinedInterviewResponse(role, answer, history);
        return res.json({ 
          message: predefinedResponse,
          source: 'predefined',
          warning: 'Using generic interview questions'
        });
      } catch (finalError) {
        console.error('All fallbacks failed:', finalError);
        return res.status(500).json({ 
          error: 'Failed to generate interview content',
          details: {
            geminiError: geminiError.message,
            hfError: hfError.message
          },
          suggestion: 'Please try again later or refresh the interview'
        });
      }
    }
  }
});

// Clean up Hugging Face response
function cleanInterviewResponse(text) {
  return text
    .replace(/<\/?s>/g, '') // Remove HTML tags
    .replace(/\n+/g, '\n')  // Remove extra newlines
    .replace(/^(Feedback|Question):?/i, '') // Remove labels
    .trim();
}

// Predefined interview questions and responses
function getPredefinedInterviewResponse(role, answer, history) {
  const roles = {
    'frontend': 'Frontend Developer',
    'backend': 'Backend Developer',
    'fullstack': 'Full Stack Developer',
    'data': 'Data Scientist',
    'devops': 'DevOps Engineer'
  };

  // Normalize role
  const normalizedRole = Object.keys(roles).find(key => 
    role.toLowerCase().includes(key)) || 'technical';

  const questions = {
    'frontend': [
      "Can you explain how the Virtual DOM works in React?",
      "How would you optimize website performance?",
      "Explain the difference between CSS Grid and Flexbox."
    ],
    'backend': [
      "How would you design a RESTful API for a todo app?",
      "Explain database indexing and when you'd use it.",
      "Describe your approach to handling authentication."
    ],
    'fullstack': [
      "Walk me through how you'd build a full stack application.",
      "How would you handle state management across frontend and backend?",
      "Describe your experience with API design."
    ],
    'data': [
      "Explain the bias-variance tradeoff.",
      "How would you clean a messy dataset?",
      "Describe a machine learning project you've worked on."
    ],
    'devops': [
      "Explain CI/CD pipelines and their benefits.",
      "How would you troubleshoot a production outage?",
      "Describe your experience with containerization."
    ],
    'technical': [
      "Tell me about a challenging technical problem you solved.",
      "How do you stay updated with technology trends?",
      "Describe your experience with version control systems."
    ]
  };

  // If no answer provided, return first question
  if (!answer) {
    return questions[normalizedRole][0];
  }

  // If answer provided, give generic feedback and next question
  const usedQuestions = history ? 
    questions[normalizedRole].filter(q => history.includes(q)) : [];
    
  const availableQuestions = questions[normalizedRole].filter(
    q => !usedQuestions.includes(q)
  );

  const nextQuestion = availableQuestions.length > 0 
    ? availableQuestions[0] 
    : "Do you have any questions for me about this role?";

  return `Thanks for your answer. ${[
    "That's an interesting perspective.",
    "Good approach to the problem.",
    "Thanks for explaining your thought process.",
    "That's a valid way to look at it.",
    "I appreciate your detailed response."
  ][Math.floor(Math.random() * 5)]} Next question: ${nextQuestion}`;
};

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
