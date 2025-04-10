import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card; 