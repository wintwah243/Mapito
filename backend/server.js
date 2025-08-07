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
import authenticate from './middleware/authenticate.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Roadmap from './models/Roadmap.js';
import MockInterview from './models/MockInterview.js';
import { roadmapDetails } from './utils/data.js';

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
  new OAuthStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://mapito.onrender.com/api/auth/google/callback",
    scope: ["profile", "email"]
  },
    async (accessToken, refreshToken, profile, done) => {

      try {
        let user = await userdb.findOne({ googleId: profile.id });

        if (!user) {
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
      } catch (error) {
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Add rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window
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
    data: `Understand the basics of data analysis\n Master Microsoft Excel and Google Sheets\n Learn SQL for data querying\n Get started with data visualization\n Learn a programming language like Python or R\n Understand statistics and probability\n Practice data wrangling and cleaning\n Work on real-world projects and portfolios`,
    mobile: `Understand mobile development basics\n Choose a development platform\n Learn front-end development tools and programming\n Build simple mobile apps\n Learn mobile APIs and device integration\n Implement backend integration\n Understand app performance and testing\n Publish and maintain your app`,
    devops: `Understand DevOps fundamentals\n Learn version control with Git\n Gain proficiency in Linux and command-line\n Learn continuous integration (CI) tools\n Get familiar with containerization using Docker\n Study container orchestration with Kubernetes\n Learn cloud platforms and infrastructure as code\n Set up monitoring, logging, and alerting`,
    software: `Choose one or more languages(e.g., Python, Java, C++)\n Learn object-oriented programming (OOP)\n Learn data structures and algorithms\n Explore version control systems like Git\n Understand software development methodologies\n Practice building real-world projects\n software testing and quality assurance\n problem-solving and system design skills`,
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
  };

  for (const [key, roadmap] of Object.entries(roadmaps)) {
    if (lowerGoal.includes(key)) {
      return roadmap;
    }
  }

  // Generic fallback roadmap
  return `Research ${goal} fundamentals\n Find quality learning resources\n Practice consistently\n Build small projects\n Seek feedback and iterate`;
}

function getGenericFallbackSteps(goal) {
  return [
    `Understand the basics of ${goal}`,
    `Find quality tutorials or courses about ${goal}`,
    `Practice core concepts regularly`,
    `Start small projects using ${goal}`,
    `Explore real-world use cases`,
    `Join communities or forums around ${goal}`,
    `Get feedback and improve your work`,
    `Prepare a final project to showcase your ${goal} skills`
  ];
}

app.post('/api/generate-roadmap', authenticate, async (req, res) => {
  const { goal } = req.body;

  if (!goal || typeof goal !== 'string') {
    return res.status(400).json({
      error: 'Invalid input',
      details: 'Goal must be a non-empty string'
    });
  }

  const processedGoal = goal.trim().substring(0, 100).toLowerCase();

  try {
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });
    const prompt = `
Create an 8-step learning roadmap for becoming a ${processedGoal}.
For each step, include:
- A title
- A brief description of what should be learned at this step and time duration to complete this step and resource (e.g., w3school)

Format it like this:
1. Step Title - Description
...
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const roadmapText = response.text();

    await new Roadmap({
      userId: req.user?._id,
      goal: processedGoal,
      content: roadmapText,
      source: 'gemini'
    }).save();


    return res.json({ roadmap: roadmapText, source: 'gemini' });

  } catch (geminiError) {
    console.error('Gemini API error:', geminiError.message);

    try {
      const matchedKey = Object.keys(roadmapDetails).find(key =>
        processedGoal.includes(key)
      );

      const details = matchedKey
        ? roadmapDetails[matchedKey]
        : getGenericFallbackSteps(processedGoal);

      const roadmap = getPredefinedRoadmap(matchedKey || processedGoal);

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
        details,
        warning: 'Using predefined fallback roadmap'
      });
    } catch (finalError) {
      console.error('All fallbacks failed:', finalError.message);
      return res.status(500).json({
        error: 'Failed to generate roadmap',
        details: {
          geminiError: geminiError.message,
          finalError: finalError.message
        },
        suggestion: 'Please try again later or with a different goal description'
      });
    }
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

// mock-interview
async function saveMockInterview({ role, answer, history, response, source }) {
  try {
    await MockInterview.create({
      role,
      answer,
      history,
      response,
      source
    });
  } catch (error) {
    console.error('Failed to save mock interview:', error);
  }
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
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.0-flash" });
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

    await saveMockInterview({ role, answer, history, response: nextMessage, source: 'gemini' });
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

      const hfPrompt = `Act as a professional interviewer for ${role} position. ${answer ?
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

      await saveMockInterview({ role, answer, history, response: hfMessage, source: 'huggingface' });
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

        await saveMockInterview({ role, answer, history, response: predefinedResponse, source: 'predefined' });
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

  const followUpPrompt = "Do you have any questions for me about this role?";
  const closingStatement = "Thanks for the great conversation. That concludes our mock interview session. Good luck!";

  // If no answer provided, return first question
  if (!answer) {
    return questions[normalizedRole][0];
  }

  const usedQuestions = history
    ? questions[normalizedRole].filter(q => history.includes(q))
    : [];

  const availableQuestions = questions[normalizedRole].filter(
    q => !usedQuestions.includes(q)
  );

  // If all questions have been asked and follow-up was already sent, end the interview
  if (availableQuestions.length === 0 && history?.includes(followUpPrompt)) {
    return closingStatement;
  }

  // If all technical questions are done, send follow-up prompt
  if (availableQuestions.length === 0) {
    return followUpPrompt;
  }

  // Otherwise, continue with next question
  const nextQuestion = availableQuestions[0];
  const feedbacks = [
    "That's an interesting perspective.",
    "Good approach to the problem.",
    "Thanks for explaining your thought process.",
    "That's a valid way to look at it.",
    "I appreciate your detailed response."
  ];

  return `Thanks for your answer. ${
    feedbacks[Math.floor(Math.random() * feedbacks.length)]
  } Next question: ${nextQuestion}`;
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

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
