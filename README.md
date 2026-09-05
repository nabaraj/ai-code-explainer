# Code Explainer AI

A web app that explains code in simple English using AI.

Built with Next.js, Monaco Editor, and Groq API. The goal is to keep it simple, fast, and avoid unnecessary API usage.

---

## Features

- Explain code in simple language
- Two modes:
  - Fast mode for short answers
  - Detailed mode for structured explanations
- Streaming response (text appears gradually)
- Copy explanation with one click
- Share explanation using a unique link
- Avoid duplicate API calls using hash-based caching
- Token estimation before sending request
- Basic input validation (empty or invalid code)

---

## Tech Stack

Frontend:

- Next.js (App Router)
- React
- Tailwind CSS
- Monaco Editor

Backend:

- Next.js API routes
- Groq API (streaming)

Database:

- MongoDB with Mongoose

---

## How it works

1. User pastes code into the editor
2. App checks if input looks like valid code
3. Code is cleaned and normalized
4. A hash is generated using code + mode
5. Database is checked:
   - If data exists, return saved explanation
   - If not, call AI API
6. Response is streamed to UI
7. Result is saved with:
   - hash
   - shortId (used for sharing)

---

## Share feature

Each explanation can be shared using a URL:

/shared/{shortId}

- Same input generates same hash
- Prevents duplicate entries
- Works across devices

---

## Project structure

app/
api/
explain-code/
share-code/
share-code/[sharedid]/
components/
lib/
models/
shared/[sharedid]/
types/

---

## Input validation

- Empty input is blocked
- Non-code text is rejected (basic check)
- Character limit is applied
- Helps reduce unnecessary API usage

---

## Cost optimization

- Hash-based caching avoids repeated API calls
- Token estimation before request
- Two modes to control token usage
- Streaming avoids large response buffering

---

## Setup

1. Clone the repo

git clone https://github.com/your-username/code-explainer.git  
cd code-explainer

2. Install dependencies

npm install

3. Add environment variables

Create `.env.local`:

MONGODB_URI=your_mongodb_url  
GROQ_API_KEY=your_groq_api_key

4. Run locally

npm run dev

---

## Future improvements

- History feature (view past explanations)
- Syntax highlighting for code
- Export explanation as text or PDF
- Better validation for different languages
- Authentication for saving personal history

---

## Notes

This project focuses on practical problems:

- Reducing API cost
- Improving readability
- Making explanations easy to share

---

## License

MIT
