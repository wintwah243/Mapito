import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import { GoogleGenerativeAI } from '@google/generative-ai';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userdb from './models/User.js';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import authenticate from './middleware/authenticate.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Roadmap from './models/Roadmap.js';
import { roadmapDetails } from './utils/data.js';
import { protect } from './middleware/authMiddleware.js';
import User from './models/User.js';
import bcrypt from 'bcrypt';

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
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

//setup for passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://mapito.onrender.com/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile received:", profile.id);

        // First, try to find by googleId
        let user = await userdb.findOne({ googleId: profile.id });

        if (user) {
          // Existing Google user - update and return
          user.verified = true;
          user.confirmationCode = null;
          user.verifytoken = null;
          await user.save();
          console.log("Existing Google user updated:", user._id);
          return done(null, user);
        }

        // If no user found by googleId, check if email already exists
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await userdb.findOne({ email: email });
          
          if (user) {
            // User exists with same email but different auth method
            // Link Google account to existing user
            user.googleId = profile.id;
            user.verified = true;
            user.confirmationCode = null;
            user.verifytoken = null;
            await user.save();
            console.log("Linked Google account to existing user:", user._id);
            return done(null, user);
          }
        }

        // No existing user found - create new user
        user = new userdb({
          googleId: profile.id,
          fullName: profile.displayName,
          email: email || "",
          profileImageUrl: profile.photos?.[0]?.value || "",
          verified: true,
          confirmationCode: null,
          verifytoken: null,
        });

        await user.save();
        console.log("New Google user created:", user._id);
        return done(null, user);

      } catch (err) {
        console.error("Error in Google strategy:", err);
        return done(err, null);
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Add rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 requests per window
  message: 'Too many requests, please try again later'
});

app.use('/api/generate-roadmap', apiLimiter);

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function getPredefinedRoadmap(goal) {
  const lowerGoal = goal.toLowerCase();

  const roadmaps = {
    frontend: `Learn HTML fundamentals\n Master CSS and responsive design\n Learn JavaScript (ES6+)\n Choose a framework (React, Vue, Angular)\n Build portfolio projects\n Practice interview questions\n Explore UI libraries and material\n Learn web performance and WCAG guidelines`,
    backend: `Learn a server language (Node.js, Python, Java)\n Understand databases (SQL & NoSQL)\n Learn API development (REST, GraphQL)\n Study authentication & security\n Build scalable applications\n Explore cloud platforms for deployment\n Learn backend testing to ensure reliability\n Learn how to set up logging`,
    "data analyst": `Learn Data Fundamentals\n Excel & Google Sheets for Analysis\n Master SQL for Data Queries\n Data Cleaning & Preparation\n Statistical Analysis & Probability\n Python or R for Data Analysis\n Data Visualization & Storytelling\n Build Portfolio Projects`,
    "data scientist": `Learn Python or R Fundamentals\n Mathematics & Statistics for Data Science\n Data Manipulation & Analysis\n Explore Data Visualization\n Master Databases & SQL\n Learn Machine Learning Fundamentals\n Build Portfolio Projects\n Prepare for Interviews`,
    mobile: `Understand mobile development basics\n Choose a development platform\n Learn front-end development tools and programming\n Build simple mobile apps\n Learn mobile APIs and device integration\n Implement backend integration\n Understand app performance and testing\n Publish and maintain your app`,
    devops: `Understand DevOps fundamentals\n Learn version control with Git\n Containerization with Docker\n Configuration Management & Automation\n Get familiar with CI/CD Pipelines\n Cloud Platforms & Services\n Monitoring & Logging\n Security & Best Practices`,
    "software engineer": `Choose one or more languages(e.g., Python, Java, C++)\n Learn object-oriented programming (OOP)\n Learn data structures and algorithms\n Explore version control systems like Git\n Understand software development methodologies\n Practice building real-world projects\n software testing and quality assurance\n problem-solving and system design skills`,
    "software developer": `Choose one or more languages(e.g., Python, Java, C++)\n Learn object-oriented programming (OOP)\n Learn data structures and algorithms\n Explore version control systems like Git\n Understand software development methodologies\n Practice building real-world projects\n software testing and quality assurance\n problem-solving and system design skills`,
    cyber: `Learn the fundamentals of cybersecurity\n Understand computer networks and protocols\n Master operating system security\n Learn cryptography basics\n Get hands-on with penetration testing\n Understand web application security\n Learn incident detection and response\n Explore advanced security and career specialization`,
    business: `Learn the fundamentals of business analysis\n Master requirement elicitation techniques\n Understand process modeling and documentation\n Develop strong soft skills and stakeholder management\n Learn data analysis basics\n Explore business intelligence tools and software\n Understand Agile and Scrum methodologies\n Practice real-world projects and case studies`,
    ai: `Build a strong foundation in mathematics\n Learn programming languages (e.g., Python)\n Master machine learning fundamentals\n Get hands-on with deep learning\n Understand data preprocessing and feature engineering\n Work on real-world AI projects\n Learn about AI model deployment\n Explore ethical AI and latest research trends`,
    web: `Learn HTML fundamentals\n Master CSS for styling webpages\n Learn JavaScript for frontend interactivity\n Choose a framework (React, Vue, Angular)\n Understand backend basics\n Explore how databases work\n Deploy web applications\n Improve web performance and security`,
    full:`Master frontend fundamentals\n Learn a modern frontend framework\n Understand backend development\n Learn working with databases\n Explore user authentication and authorization\n Learn deployment and DevOps basics\n Practice full-stack project development\n Focus on performance, testing, and maintenance`,
    ui:`Learn the fundamentals of design principles\n Understand user interface components and patterns\n Get proficient with design tools\n Study user experience (UX) basics\n Practice creating wireframes and prototypes\n Learn accessibility standards\n Collaborate with developers\n Build a strong portfolio`,
    ux:`Learn the fundamentals of user experience design\n Master user research techniques\n Understand personas and user journey mapping\n Practice wireframing and prototyping\n Learn usability testing and analysis\n Explore information architecture and interaction design\n Understand accessibility and inclusive design\n Build a strong portfolio`,
    uiux:`Learn design fundamentals\n Master user research and analysis\n Understand wireframing and prototyping\n Develop strong UI design skills\n Learn information architecture and interaction design\n Learn accessibility and inclusive design principles\n Collaborate with stakeholders and developers\n Build a UI/UX portfolio`,
    cloud:`Understand cloud computing basics.\n Get hands-on with major cloud providers\n Learn virtual machines and containerization\n Master cloud networking concepts\n Understand cloud storage and databases\n Learn automation and infrastructure as code (IaC)\n Explore security and compliance\n Deploying and managing cloud applications`,
    solution:`Understand the fundamentals of software architecture\n Gain deep knowledge of cloud platforms\n Learn about system design and scalability\n Master integration patterns and APIs\n Develop skills in security architecture\n Understand DevOps and infrastructure automation\n Practice architecture documentation and communication\n Build real-world solution architecture projects`,
    project:`Learn the fundamentals of project management\n Master project planning\n Develop scheduling and budgeting skills\n Enhance communication and leadership skills\n Understand risk management\n Learn project tracking and monitoring\n Get familiar with quality management\n Apply project management in real-world scenarios`,
    "data engineer": `Learn Programming & SQL Fundamentals\n Understand Data Warehousing & ETL Concepts\n Learn Big Data Tools & Technologies\n Data Storage & NoSQL Databases\n Data Pipeline Orchestration & Workflow Automation\n Cloud Platforms & Data Services\n Data Quality, Governance & Security\n Build Data Engineering Projects & Portfolio`,
    android: `Learn Java or Kotlin Fundamentals\n Understand Android Fundamentals\n Learn UI Design & Material Design Guidelines\n Data Storage & Databases\n Networking & APIs\n Android Architecture & MVVM\n Advanced Topics: Coroutines, Jetpack, & Testing\n Build Android Projects & Portfolio`,
    ios: `Learn Swift Programming\n Understand Xcode & iOS Fundamentals\n UI Design & SwiftUI/UIKit\n Data Storage & Core Data\n Networking & APIs\n iOS Architecture & MVVM\n Advanced Topics: Combine, Swift Concurrency, & Testing\n Build iOS Projects & Portfolio\n`,
    "qa engineer": `Learn Software Testing Fundamentals\n Master Manual Testing Techniques\n Learn Automation Testing Basics\n Master Automation Tools & Frameworks\n Learn API Testing\n Understand Performance & Security Testing\n Version Control & CI/CD\n Build QA Projects & Portfolio`,
    blockchain: `Learn Programming Fundamentals\n Understand Blockchain Basics\n Learn Ethereum & Smart Contracts\n Master Decentralized Applications (DApps)\n Learn Blockchain Platforms & Tools\n Understand Token Standards & DeFi\n Security & Best Practices\n Build Blockchain Projects & Portfolio`,
    "software architect": `Master Programming & Design Fundamentals\n Learn Software Architecture Principles\n Understand System Design\n Explore Cloud Platforms & Infrastructure\n Master Microservices & APIs\n Learn Security, Performance & Reliability\n Build Architectural Projects & Portfolio\n Prepare for Interviews & Continuous Learning`,
    game: `Learn Programming Fundamentals\n Understand Game Development Fundamentals\n Learn a Game Engine (Unity/Unreal)\n Game Physics & Mathematics\n Graphics & Rendering\n AI & Game Mechanics\n Networking & Multiplayer\n Build Game Projects & Portfolio`,
    it: `Learn Computer Hardware & Operating Systems\n Networking Fundamentals\n Learn IT Support Tools & Troubleshooting\n Operating System Administration\n Security & Antivirus Management\n Learn Cloud & Virtualization Basics\n Practice IT Support & Helpdesk Scenarios\n Build IT Portfolio & Certifications`,
    network: `Learn Networking Fundamentals\n Master Routing & Switching\n Learn Network Protocols & Services\n Network Security Fundamentals\n Hands-On Networking Labs\n Learn Wireless & Cloud Networking\n Network Monitoring & Troubleshooting\n Build Projects & Portfolio`,
    system: `Learn about computer architecture\n Understand networking fundamentals\n Learn system administration\n Study virtualization and containerization\n Learn about server monitoring\n Understand backup and recovery strategies\n Explore cloud platforms such as AWS\n Study security best practices`
  };

  for (const [key, roadmap] of Object.entries(roadmaps)) {
    if (lowerGoal.includes(key)) {
      return roadmap;
    }
  }

  // Generic fallback roadmap
  return `Research ${goal} fundamentals\n Find quality learning resources\n Practice consistently\n Build small projects\n Seek feedback and iterate`;
}

// generate roadmap based on user's goal
app.post('/api/generate-roadmap', authenticate, async (req, res) => {
  const { goal } = req.body;

  if (!goal || typeof goal !== 'string') {
    return res.status(400).json({
      error: 'Invalid input',
      details: 'Goal must be a non-empty string'
    });
  }

  const processedGoal = goal.trim().toLowerCase();

  try {
    // Find a matching predefined roadmap
    const matchedKey = Object.keys(roadmapDetails).find(key =>
      processedGoal.includes(key)
    );

    if (!matchedKey) {
      // No roadmap available
      return res.status(404).json({
        error: 'Roadmap topic is not available',
        details: `Sorry, we currently don’t have a roadmap for "${goal}".`
      });
    }
    
    // Use predefined roadmap
    const details = roadmapDetails[matchedKey];
    const roadmap = getPredefinedRoadmap(matchedKey);

    // Save to database
    await new Roadmap({
      userId: req.user._id,
      goal: processedGoal,
      content: roadmap,
      source: 'predefined',
      details: JSON.stringify(details)
    }).save();

    return res.json({
      roadmap,
      source: 'predefined',
      details
    });

  } catch (error) {
    console.error('Error generating roadmap:', error.message);

    // Handle database or other unexpected errors
    return res.status(500).json({
      error: 'Failed to generate roadmap',
      details: error.message,
      suggestion: 'Please try again later or with a different goal'
    });
  }
});

// Format the roadmap response consistently
function formatRoadmapResponse(text) {
  return text
    .replace(/(\d)\./g, '$1. ')        // Standardize numbering
    .replace(/\n+/g, '\n')             // Remove extra newlines
    .replace(/^\s*-\s*/gm, '')         // Remove bullet points if present
    .replace(/Step \d+:?/gi, '')       // Remove "Step X:" prefixes
    .trim();
}

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

  // Truncate very long notes to prevent abuse
  const processedNote = note.length > 10000 ? note.substring(0, 10000) + '...' : note;

  try {
    // Try Gemini first
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

    // Fallback 1: Try Hugging Face API
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

      // Fallback 2: Simple text processing
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
};

// Save roadmap to DB
app.post('/api/save-roadmap', async (req, res) => {
  try {
    const { goal, content, source, details } = req.body;
    const roadmap = new Roadmap({ goal, content, source, details });
    await roadmap.save();
    res.status(201).json(roadmap);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save roadmap' });
  }
});

// Get all saved roadmaps
app.get('/api/roadmaps', async (req, res) => {
  try {
    const roadmaps = await Roadmap.find().sort({ createdAt: -1 });
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roadmaps' });
  }
});

app.post('/api/roadmaps', authenticate, async (req, res) => {
  try {
    const { goal, roadmap, details } = req.body;

    const newRoadmap = new Roadmap({
      userId: req.user._id,
      goal,
      roadmap,
      details,
    });

    await newRoadmap.save();

    res.status(201).json({ message: 'Roadmap saved successfully', roadmap: newRoadmap });
  } catch (error) {
    console.error('Error saving roadmap:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/roadmaps/latest', authenticate, async (req, res) => {
  try {
    const user = req.user;

    const latest = await Roadmap.findOne({ userId: user._id }).sort({ createdAt: -1 });

    if (!latest) {
      return res.json({});
    }

    res.json({
      goal: latest.goal,
      roadmap: latest.content,
      details: latest.details || []
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// user delete account 
app.post('/api/auth/delete-account', protect, async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// AI Mentor Chat Endpoint
app.post('/api/ai-mentor', async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      error: 'Invalid input',
      details: 'Message must be a non-empty string'
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-pro" });
    const prompt = `
You are an AI programming mentor for beginners. 
Answer clearly and concisely to the following programming-related question:

${message}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiText = response.text();

    return res.json({ reply: aiText });

  } catch (error) {
    console.error('AI Mentor API error:', error.message);
    return res.status(500).json({
      error: 'Failed to get AI Mentor reply',
      details: error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
