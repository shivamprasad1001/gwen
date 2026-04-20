import React from 'react';
import GwenAvatar from '../../assets/gwen-avatar.svg?react';

const Header = () => {
  return (
    <header className="flex items-center gap-3 px-6 py-4 pl-16 border-b border-warm-border bg-warm-base z-30">
      {/* Avatar using SVGR Component */}
      <div className="w-[38px] h-[38px] rounded-full shadow-sm overflow-hidden flex-shrink-0">
        <GwenAvatar width="38" height="38" />
      </div>
      
      {/* Identity */}
      <div className="flex flex-col">
        <h1 className="font-lora text-[17px] font-medium text-warm-text-primary leading-tight">
          Gwen
        </h1>
        <p className="font-sans text-[12px] text-warm-text-secondary">
          Shivam's digital twin
        </p>
      </div>

      {/* Online Status */}
      <div className="ml-auto flex items-center gap-2">
        <div className="w-[6px] h-[6px] rounded-full bg-[#6DBE8C] shadow-[0_0_6px_#6DBE8C]" />
        <span className="text-[12px] text-warm-text-muted font-medium">online</span>
      </div>
    </header>
  );
};

export default Header;
