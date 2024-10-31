# Waner Proofreader

Waner Proofreader is an AI-powered tool designed to help non-native English speakers proofread their text smoothly. The tool is named after the historical figure 上官婉儿 (Shangguan Wan'er), a renowned Chinese poet and politician.

# Screenshots

![Waner Proofreader Screenshot](./screenshot.png)

# Installation

To run Waner Proofreader locally, ensure that you have Node.js installed on your machine. Follow these steps to set up the project:

1. Clone the repository:

   ```bash
   git clone https://github.com/AuroraDysis/waner-proofreader.git
   ```

2. Navigate to the project directory:

   ```bash
   cd waner-proofreader
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add the following environment variables:

   ```
   NEXT_URL=http://localhost:3000
   OPENAI_BASE_URL=https://openrouter.ai/api/v1
   OPENAI_API_KEY=<your_openrouter_api_key>
   ```

   Replace `<your_openrouter_api_key>` with your actual OpenRouter API key, which you can obtain by signing up at [OpenRouter](https://openrouter.ai/). If you want to use other providers, you may need to modify models in `src/lib/prompt.ts` accordingly.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open your web browser and visit `http://localhost:3000` to access Waner Proofreader.
