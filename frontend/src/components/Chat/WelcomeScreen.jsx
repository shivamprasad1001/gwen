import React from 'react';
import QuickChips from '../UI/QuickChips';
import gwenAvatarUrl from '../../assets/gwen-avatar.svg';

const SUGGESTIONS = [
  "Who is Shivam? 👤",
  "What is TriviLabs? 🏢",
  "His research goals 🧠",
  "Current projects 💻",
  "Tech stack ⚙️"
];

const WelcomeScreen = ({ onSendMessage }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-lg mx-auto transform -translate-y-6 md:-translate-y-12">
      {/* Large Avatar using animated SVG */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        overflow: 'hidden',
        margin: '0 auto 24px',
        border: '2px solid #E8D5BE',
        boxShadow: '0 4px 24px rgba(193,125,74,0.15)'
      }}>
        <img
          src={gwenAvatarUrl}
          width="80"
          height="80"
          alt="Gwen"
          style={{ display: 'block' }}
        />
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
