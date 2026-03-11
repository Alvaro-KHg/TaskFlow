import React from 'react';
import './UI.css';

export const Badge = ({ variant = 'status', value, subjectIndex = 0 }) => {
  // Normalize string for classname usage
  const normalizedValue = value.replace(/[\s/]+/g, '.');
  
  let className = '';
  if (variant === 'status') {
    className = `badge-status--${normalizedValue}`;
  } else if (variant === 'priority') {
    className = `badge-prio--${normalizedValue}`;
  } else if (variant === 'type') {
    className = `badge-type--${normalizedValue}`;
  } else if (variant === 'subject') {
    className = `badge-subj--${subjectIndex % 7}`;
  }
  
  return (
    <span className={`badge ${className}`}>
      {value}
    </span>
  );
};

export const Tag = ({ text }) => {
  return (
    <span className="tag">
      #{text}
    </span>
  );
};

export const Avatar = ({ src, alt, size = 'md', tooltip }) => {
  return (
    <img 
      src={src} 
      alt={alt || "Avatar"} 
      className={`avatar ${size}`} 
      title={tooltip || alt}
    />
  );
};
