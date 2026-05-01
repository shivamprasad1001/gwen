import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, BrainCircuit, MessageSquare, Code, Hexagon, Github, TerminalSquare } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import gwenAvatar from '../../assets/gwen-avatar.svg';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <div
    className={cn(
      "p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-[0_8px_32px_rgba(193,125,74,0.1)] transition-all duration-700 opacity-0 translate-y-8 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(193,125,74,0.15)] group",
      delay
    )}
    style={{ animationFillMode: 'forwards' }}
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E8D5BE] to-[#C17D4A]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
      <Icon className="w-6 h-6 text-[#C17D4A]" />
    </div>
    <h3 className="text-xl font-semibold text-[#4A4540] mb-2">{title}</h3>
    <p className="text-[#706A64] leading-relaxed">{description}</p>
  </div>
);

const LandingPage = ({ onEnter }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-[100dvh] h-[100dvh] w-full bg-[#FAF7F2] overflow-hidden flex flex-col font-sans selection:bg-[#E8D5BE] selection:text-black">
      {/* Dynamic Animated Background */}
      <div className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-[2000ms] ease-in-out",
        mounted ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-[#C17D4A]/10 mix-blend-multiply filter blur-[100px] animate-blob" />
        <div className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[#E8D5BE]/40 mix-blend-multiply filter blur-[100px] animate-blob [animation-delay:2s]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-[#F0EBE1]/60 mix-blend-multiply filter blur-[100px] animate-blob [animation-delay:4s]" />

        {/* subtle noise texture for premium feel */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* Navigation / Header */}
      <nav className={cn(
        "relative z-10 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full transition-all duration-1000 transform",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
      )}>
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-[#C17D4A]/20 animate-float">
            <img src={gwenAvatar} alt="Gwen Avatar" className="w-6 h-6 object-contain" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#2C2825]">Gwen<span className="text-[#C17D4A]">.</span></span>
        </div>
        <a
          href="https://github.com/shivamprasad1001"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[#706A64] hover:text-[#C17D4A] transition-all font-medium bg-white/40 px-4 py-2 rounded-full border border-white/60 shadow-sm backdrop-blur-md hover:shadow-md hover:-translate-y-1 duration-300"
        >
          <Github className="w-4 h-4" />
          <span className="text-sm">shivamprasad1001</span>
        </a>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto w-full pb-20 pt-8 mt-auto mb-auto">

        {/* Badge */}
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-[#C17D4A]/20 text-[#C17D4A] font-medium text-sm mb-8 transition-all duration-1000 transform",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Sparkles className="w-4 h-4" />
          <span>Shivam's Personal Intelligence</span>
        </div>

        {/* Hero Title */}
        <h1 className={cn(
          "text-6xl md:text-8xl font-bold tracking-tighter text-[#2C2825] mb-6 transition-all duration-1000 delay-100 transform",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C17D4A] to-[#8C5A35]">Gwen.</span> <br />
          My Digital Brain.
        </h1>

        {/* Hero Subtitle */}
        <p className={cn(
          "text-xl text-[#706A64] mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-200 transform",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          I've trained Gwen on my entire professional journey—my projects, coding experience, tech stack, and thoughts. Ask her anything to learn everything about me.
        </p>

        {/* CTA Button */}
        <div className={cn(
          "relative transition-all duration-1000 delay-300 transform",
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {/* Glowing aura */}
          <div className="absolute inset-0 bg-[#C17D4A]/30 rounded-full blur-xl animate-pulse-glow pointer-events-none" />

          <button
            onClick={onEnter}
            className="relative z-10 group inline-flex items-center gap-3 px-8 py-4 bg-[#2C2825] text-white rounded-full font-medium text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_8px_32px_rgba(44,40,37,0.3)] active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#C17D4A] to-[#A36336] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center gap-2">
              Start Conversation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 mb-60 w-full text-left">
          <FeatureCard
            icon={TerminalSquare}
            title="My Experience & Stack"
            description="Query my professional work history, the technical stack I use daily, and my engineering achievements."
            delay={mounted ? "animate-fade-in-up [animation-delay:400ms]" : ""}
          />
          <FeatureCard
            icon={Code}
            title="Projects & Open Source"
            description="Ask about my GitHub repositories, open-source contributions, and the architecture behind my personal builds."
            delay={mounted ? "animate-fade-in-up [animation-delay:600ms]" : ""}
          />
          <FeatureCard
            icon={BrainCircuit}
            title="Deep Dives"
            description="Discuss my approach to problem-solving, system design, and the methodologies I use in production environments."
            delay={mounted ? "animate-fade-in-up [animation-delay:800ms]" : ""}
          />
        </div>

      </main>

    </div>
  );
};

export default LandingPage;
