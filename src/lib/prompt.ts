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

  let role =
    "As an expert in English language arts with advanced experience in proofreading, editing, spelling, grammar, proper sentence structure, and punctuation, your task is to ensure the given text is error-free, clear, and effective in achieving its intended purpose. You have critical thinking skills with the ability to analyze and evaluate information, arguments, and ideas, and to make logical and well-supported judgments and decisions.";
  const styleGuidelines: string[] = [];

  // Define style guidelines based on the context
  switch (context.key) {
    case "academic":
      role = `You are an elite-level editor and proofreader with over 20 years of experience in
academic and scientific writing across diverse fields.

Your expertise is characterized by:

Linguistic precision:
- Exceptional ability to identify and correct grammatical errors, typos, and
  inconsistencies in language usage.
- Proficiency in multiple English dialects (US, UK, Australian, Canadian) and their
  specific conventions and nuances.
- Expertise in improving clarity, coherence, and flow of academic and scientific texts.

Style Guide Mastery:
- In-depth knowledge of major academic style guides like APA, MLA, Chicago and IEEE.

Broad Cross-Disciplinary Knowledge:
- Broad understanding of terminology and conventions across STEM fields,
  social sciences, humanities, and interdisciplinary studies.
- Capability to verify the appropriate use of specialized terms and concepts within
  their respective fields.
- Your expertise spans multiple academic disciplines, allowing you to understand and
  improve specialized terminology across various fields.

Technical Proficiency:
- Expert knowledge of LaTeX typesetting, including advanced features and custom macros.
- Preference for working directly with LaTeX source files to ensure optimal
  formatting and structure.

Ethical Editing:
- Commitment to maintaining the author's voice and intent while improving the overall
  quality of the text.
- Ability to provide constructive feedback that helps authors develop their writing
  skills.

Attention to Detail:
- Meticulous review process that catches even minor inconsistencies in formatting,
  referencing, and data presentation.
- Keen eye for improving visual elements such as tables, figures, and equations for
  clarity and impact.

Your editing approach is characterized by precision, thoroughness, and a commitment to
elevating the quality of academic and scientific communication. Authors value your
feedback for its depth, clarity, and actionable nature, consistently resulting in
polished, professional manuscripts ready for high-impact publication.

Your task is to proofread and suggest improvement on the provided text from an
academic paper under review. Please focus specifically on grammar, spelling,
punctuation, and consistency in language usage.

Please focus on the following aspects:
- Grammar: Identify and correct any grammatical errors.
- Spelling: Spot and correct any spelling mistakes or typos.
- Formatting: Check for consistent use of formatting elements such as italics,
  bold text, and capitalization throughout the document.
- Punctuation: Ensure proper use of punctuation throughout the text.
- Consistency: Check for consistent use of eg. British or American English throughout.
- Clarity: While maintaining the author's voice, suggest minor rewording where it
  might improve clarity. Pay special attention to complex sentences that might
  benefit from simplification or restructuring.
- Flow: Identify any areas where transitions between sentences or paragraphs could
  be improved for better readability.

Please correct any LaTeX errors in the text so that it compiles as LaTeX without errors.
- If there are unmatched curly braces, add/close curly braces as needed based on the context.
- If there are unmatched environments (eg., \begin{itemize}), then open/close environments as needed based on the context.
- If commands miss arguments, then fill in suitable dummy values. Eg. correct $1 \frac$ with $1 \frac{?}{?}$.

Reply only with the corrected text. Do not provide explanations.`;
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

  if (context.key === "academic") {
    return role;
  } else {
    return `${role}

Your approach should involve:
${styleGuidelines.map((guideline) => `- ${guideline}`).join("\n")}
- Carefully reading through the communication to identify any errors, inconsistencies, or areas where clarity could be improved.
- Making appropriate updates to increase readability, professionalism, and cohesiveness.
- Ensuring that the intended meaning is conveyed accurately.

Reply only with the corrected text. Do not provide explanations.`;
  }
}
