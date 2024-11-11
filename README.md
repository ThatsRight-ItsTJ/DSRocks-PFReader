# AI Article Generator

An AI-powered article generator that creates, humanizes, and proofreads content using multiple AI models.

## Requirements

### Node.js Environment
- Node.js >= 18.17.0 (LTS recommended)
- npm >= 9.x

### API Keys Required
- HuggingFace API key
- OpenRouter API key
- No API key required for api.airforce

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-article-generator
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
HUGGINGFACE_API_KEY=your_huggingface_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features

- Generate articles using LFM-40B-MOE model
- Humanize content using HuggingFace's Llama-2-70b
- Proofread and polish using Claude 3 Opus
- Real-time diff view of changes
- Adjustable article length and style

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel project settings
4. Deploy

### Netlify
1. Push your code to GitHub
2. Import your repository in Netlify
3. Add environment variables in Netlify project settings
4. Deploy

## License

MIT