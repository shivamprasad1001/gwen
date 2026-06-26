import { BookOpen } from 'lucide-react';
import gwenAvatarUrl from '../../assets/gwen-avatar.svg';

const Header = ({ onDocsClick }) => {
  return (
    <header className="flex items-center gap-3 px-6 py-4 pl-14 md:pl-16 border-b border-warm-border bg-warm-base z-30">
      {/* Avatar using animated SVG */}
      <div style={{
        width: 42,
        height: 42,
        borderRadius: '50%',
        overflow: 'hidden',
        flexShrink: 0,
        border: '1.5px solid #E8D5BE'
      }}>
        <img
          src={gwenAvatarUrl}
          width="42"
          height="42"
          alt="Gwen avatar"
          style={{ display: 'block' }}
        />
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

      {/* Online Status & Docs */}
      <div className="ml-auto flex items-center gap-2">
        <button 
          onClick={onDocsClick}
          className="text-[13px] font-medium text-warm-text-secondary hover:text-warm-accent transition-colors mr-4 border-r border-warm-border pr-4 hidden sm:block"
        >
          API Docs
        </button>
        {/* Mobile API Docs Button */}
        <button 
          onClick={onDocsClick}
          className="sm:hidden p-2 text-warm-text-secondary hover:text-warm-accent hover:bg-warm-surface rounded-lg transition-colors mr-2 flex items-center justify-center"
          aria-label="API Documentation"
          title="API Documentation"
        >
          <BookOpen size={18} />
        </button>
        <div className="w-[6px] h-[6px] rounded-full bg-[#6DBE8C] shadow-[0_0_6px_#6DBE8C]" />
        <span className="text-[12px] text-warm-text-muted font-medium">online</span>
      </div>
    </header>
  );
};

export default Header;
