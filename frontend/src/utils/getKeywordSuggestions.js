/**
 * Keyword-based suggestion fallback for Gwen.
 * Provides randomized pools of questions to ensure variety even during fallback.
 */
export function getKeywordSuggestions(replyText) {
  const text = replyText.toLowerCase();

  // Helper to pick 3 random items from an array
  const pickRandom = (arr, count = 3) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  if (text.includes('trivilabs') || text.includes('agency')) {
    return pickRandom([
      "What services does TriviLabs offer?",
      "How much does TriviLabs charge?",
      "Who is Shivam's co-founder?",
      "Tell me about the TriviLabs vision",
      "Is TriviLabs hiring right now?",
      "What projects has TriviLabs completed?"
    ]);
  }

  if (
    text.includes('phd') || 
    text.includes('research') || 
    text.includes('rl') || 
    text.includes('reinforcement') ||
    text.includes('marl')
  ) {
    return pickRandom([
      "Which university is his top choice?",
      "What is his GRE target?",
      "What RL papers is he reading?",
      "What are his Multi-Agent RL goals?",
      "When does he plan to start PhD?",
      "Does he have any research publications?",
      "Tell me about his RL experiments"
    ]);
  }

  if (text.includes('project') || text.includes('built') || text.includes('gwen')) {
    return pickRandom([
      "What's his most important project?",
      "What tech stack does he use?",
      "Tell me about his latest build",
      "How long did Gwen take to build?",
      "Has he published any open source?",
      "What is his favorite coding language?",
      "What does he build for fun?"
    ]);
  }

  if (
    text.includes('skill') || 
    text.includes('tech') || 
    text.includes('stack') || 
    text.includes('python') ||
    text.includes('github')
  ) {
    return pickRandom([
      "What AI frameworks does he know?",
      "Does he work with PyTorch?",
      "What does he build with n8n?",
      "Is he more into Frontend or Backend?",
      "What developer tools does he love?",
      "How did he learn AI/ML?"
    ]);
  }

  if (
    text.includes('goal') || 
    text.includes('dream') || 
    text.includes('anthropic') || 
    text.includes('openai') ||
    text.includes('vision')
  ) {
    return pickRandom([
      "Where does he want to work?",
      "What is his long-term AI vision?",
      "What's his dream role at Anthropic?",
      "What is his gap year plan?",
      "Is he planning a startup?",
      "What motivates his daily work?"
    ]);
  }

  // Default varied pool
  return pickRandom([
    "Tell me about his projects 💻",
    "What are his goals? 🎯",
    "What is TriviLabs? 🏢",
    "What is his background? 🎓",
    "How can I reach him? ✉️",
    "What are his PhD plans? 📚",
    "What AI research does he do? 🧠"
  ]);
}
