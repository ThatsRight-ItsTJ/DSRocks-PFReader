export const models = [
  "anthropic/claude-3.5-sonnet",
  "anthropic/claude-3-opus",
  "openai/chatgpt-4o-latest",
  "openai/gpt-4",
];

export const contexts = [
  { key: "academic", label: "Academic" },
  { key: "instantMessage", label: "Instant Message" },
  { key: "email", label: "Email" },
  { key: "oral", label: "Oral" },
];

export const instructions = [
  {
    key: "basicProofread",
    prompt: "Proofread this text",
  },
  {
    key: "awkwardParts",
    prompt: "Fix only awkward parts",
  },
  {
    key: "streamline",
    prompt: "Streamline any awkward words or phrases",
  },
  {
    key: "polish",
    prompt: "Polish any awkward words or phrases",
  },
  {
    key: "trim",
    prompt: "Trim the fat",
  },
  {
    key: "clarityAndFlow",
    prompt: "Improve clarity and flow",
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

  // Define style guidelines based on the context
  let styleGuidelines = "";
  switch (context.key) {
    case "academic":
      styleGuidelines =
        "Ensure the language is formal and adheres to academic writing standards.";
      break;
    case "instantMessage":
      styleGuidelines =
        "Use an informal tone appropriate for casual conversations.";
      break;
    case "email":
      styleGuidelines =
        "Employ a professional tone suitable for business emails.";
      break;
    case "oral":
      styleGuidelines =
        "Use language that would sound natural when spoken aloud.";
      break;
    default:
      styleGuidelines = "";
  }

  return `I want you to act as an expert in English language arts with advanced experience in proofreading, editing, spelling, grammar, proper sentence structure, and punctuation. You have critical thinking skills with the ability to analyze and evaluate information, arguments, and ideas, and to make logical and well-supported judgments and decisions. You will be provided content to proofread in the ${context.label.toLowerCase()} form. Your approach would be to carefully read through the communication to identify any errors, inconsistencies, or areas where clarity could be improved. Your specific instruction is to ${instruction.prompt.toLowerCase()}. ${styleGuidelines} Your overall goal is to ensure the communication is error-free, clear, and effective in achieving its intended purpose. You will make appropriate updates to increase readability, professionalism, and cohesiveness, while also ensuring that the intended meaning is conveyed accurately. I want you to only reply with the corrected text and the improvements, and nothing else; do not write explanations.`;
}
