import React from 'react';
import QuickChips from '../UI/QuickChips';

const SUGGESTIONS = [
  "Who is Shivam? 👤",
  "What is TriviLabs? 🏢",
  "His research goals 🧠",
  "Current projects 💻",
  "Tech stack ⚙️"
];

const WelcomeScreen = ({ onSendMessage }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto transform -translate-y-12">
      {/* Monogram */}
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warm-accent to-[#8B5E3C] flex items-center justify-center text-white font-lora text-28px italic font-semibold shadow-warm-md mb-6">
        G
      </div>

      <h2 className="font-lora text-2xl font-medium text-warm-text-primary text-center mb-3">
        Hey, I'm Gwen 👋
      </h2>

      <p className="font-sans text-[15px] text-warm-text-secondary text-center leading-relaxed mb-4">
        Shivam's digital twin. Ask me about his research, projects, TriviLabs, or anything in between.
      </p>

      <QuickChips suggestions={SUGGESTIONS} onChipClick={onSendMessage} />
    </div>
  );
};

export default WelcomeScreen;
