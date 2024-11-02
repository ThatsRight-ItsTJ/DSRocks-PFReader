export const models = process.env.NEXT_PUBLIC_OPENAI_MODEL?.split(
  ","
) as string[];

export const contexts = [
  { key: "academic", label: "Academic" },
  { key: "general", label: "General" },
  { key: "instantMessage", label: "Instant Message" },
  { key: "email", label: "Email" },
  { key: "oral", label: "Oral" },
  { key: "gitCommitMessage", label: "Git Commit Message" },
];

export const instructions = [
  {
    key: "basicProofread",
    prompt: "Proofreading the text",
  },
  {
    key: "awkwardParts",
    prompt: "Fixing only awkward parts",
  },
  {
    key: "streamline",
    prompt: "Streamlining any awkward words or phrases",
  },
  {
    key: "polish",
    prompt: "Polishing any awkward words or phrases",
  },
  {
    key: "trim",
    prompt: "Triming the fat",
  },
  {
    key: "clarityAndFlow",
    prompt: "Improving clarity and flow",
  },
  {
    key: "significantClarityAndFlow",
    prompt: "Significantly improving clarity and flow",
  },
];

export function generate_system_prompt(
  contextKey: string,
  instructionKey: string
) {
  // Lookup the context and instruction from the arrays
  const context = contexts.find((c) => c.key === contextKey);
  const instruction = instructions.find((i) => i.key === instructionKey);

  if (!context) {
    throw new Error("Invalid context key");
  }
  if (!instruction) {
    throw new Error("Invalid instruction key");
  }

  const styleGuidelines: string[] = [];

  // Define style guidelines based on the context
  switch (context.key) {
    case "academic":
      styleGuidelines.push(
        ...[
          "Ensuring the language is formal and adheres to academic writing standards.",
          "Abbreviations are acceptable.",
        ]
      );
      break;
    case "general":
      styleGuidelines.push(
        "Using a neutral tone appropriate for general audiences."
      );
      break;
    case "instantMessage":
      styleGuidelines.push(
        ...[
          "Using an informal tone appropriate for casual conversations.",
          "Emojis and abbreviations are acceptable.",
          "Making sure it's clear, concise, polite, and easy to understand.",
          "Using emojis sparingly if necessary.",
        ]
      );
      break;
    case "email":
      styleGuidelines.push(
        "Employing a professional tone suitable for business emails."
      );
      break;
    case "oral":
      styleGuidelines.push(
        ...[
          "Using language that would sound natural when spoken aloud.",
          "Avoiding complex sentence structures.",
        ]
      );
      break;
    case "gitCommitMessage":
      styleGuidelines.push(
        ...[
          "Treating provided text as a git commit message.",
          "Ensuring it's formatted with a short summary line, followed by a blank line, followed by a more detailed description.",
          "Ensuring that the summary line is less than 50 characters.",
          "Ensuring that the lines in the description are less than 72 characters.",
          "Avoiding using past tense, and use the imperative mood instead.",
        ]
      );
      break;
    default:
      break;
  }

  styleGuidelines.push(instruction.prompt + ".");

  return `As an expert in English language arts with advanced experience in proofreading, editing, spelling, grammar, proper sentence structure, and punctuation, your task is to ensure the given text is error-free, clear, and effective in achieving its intended purpose. You have critical thinking skills with the ability to analyze and evaluate information, arguments, and ideas, and to make logical and well-supported judgments and decisions.

Your approach should involve:
${styleGuidelines.map((guideline) => `- ${guideline}`).join("\n")}
- Carefully reading through the communication to identify any errors, inconsistencies, or areas where clarity could be improved.
- Keeping LaTeX and Markdown formatting intact if present.
- Making appropriate updates to increase readability, professionalism, and cohesiveness.
- Ensuring that the intended meaning is conveyed accurately.

Reply only with the corrected text. Do not provide explanations.`;
}
