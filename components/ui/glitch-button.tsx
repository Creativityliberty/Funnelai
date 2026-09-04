'use client';

import React from 'react';
import { motion } from 'motion/react';

interface GlitchButtonProps {
  children: React.ReactNode;
  onClick?: (e?: any) => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
}

export const GlitchButton = ({ 
  children, 
  onClick, 
  className = '', 
  disabled = false,
  type = 'button'
}: GlitchButtonProps) => {
  return (
    <motion.button
      type={type}
      whileHover={!disabled ? { scale: 1.015 } : {}}
      whileTap={!disabled ? { scale: 0.985 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`relative overflow-hidden group cursor-pointer transition-all duration-300 font-semibold tracking-wide ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2.5">{children}</span>
      
      {!disabled && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300">
          <motion.div 
            className="absolute inset-0 bg-white/10"
            animate={{ 
              x: ["-100%", "100%"],
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </div>
      )}
    </motion.button>
  );
};
