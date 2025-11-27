
import React from 'react';

interface ChoiceButtonProps {
  text: string;
  onClick?: () => void; // Made onClick optional
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset'; // Added type prop
}

const ChoiceButton: React.FC<ChoiceButtonProps> = ({ text, onClick, disabled = false, className = '', type = 'button' }) => {
  return (
    <button
      type={type} // Use the type prop
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-6 py-3 my-2 text-lg font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out
        bg-sky-600 hover:bg-sky-500 text-white
        disabled:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-70
        focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75
        ${className}
      `}
    >
      {text}
    </button>
  );
};

export default ChoiceButton;
