import React, { useState, ReactNode } from 'react';

interface TooltipProps {
  commands: string[];
  children: ReactNode;
  title: string;
}

const Tooltip: React.FC<TooltipProps> = ({ commands, children, title }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="tooltip">
          <div className="tooltip-header">{title}</div>
          <div className="tooltip-body">
            <div className="tooltip-label">🔧 Commands executed:</div>
            {commands.map((command, index) => (
              <div key={index} className="tooltip-command">
                <span className="command-prompt">$</span>
                <span className="command-text">{command}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;