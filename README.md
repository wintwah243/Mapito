**Features**
- Generate roadmap presented in a linear branching visual format with AI
- Download roapmap with PDF file
- Take quizzesssss
- Chat with AI assistant chatbot
- Solve Problems and Run in Code Editor
- Test (or play) Typing Speed game For Fun with WPM calculation
- Summarize user's long note with AI
- AI mock interview with Camera ON or OFF
- Documentation links for different resources
- Reset Password with Nodemailer
- Google Login
- Update profile info (name, bio, profile pic)
- Password Hashing
- User Profile Pic Upload with Cloudinary

**Backup Plan Features**
- We initially utilizes GEMINI to respond when users use core features.
- Backup Plan 1 : We use Hugging Face for our fallback if GEMINI api fails (due to exceeding free limit) or network error.
- Backup Plan 2 : We prepared predefined responses for core features (related to AI) if Hugging Face api fails or network error.
