
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type LogoProps = {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
  animated?: boolean;
};

export const Logo = ({ size = "md", withText = true, animated = true }: LogoProps) => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };
  
  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl"
  };

  return (
    <div 
      className={`flex items-center space-x-2 cursor-pointer ${animated ? 'transition-all duration-300' : ''}`}
      onClick={() => navigate('/')}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`relative ${sizeClasses[size]}`}>
        <img 
          src="/lovable-uploads/61b6b4ad-b40d-452b-a365-2824497eada7.png" 
          alt="Scripto Logo" 
          className={`${sizeClasses[size]} ${isHovering && animated ? 'scale-110' : ''} ${isLoaded && animated ? 'animate-fade-in' : ''}
            transition-transform duration-300`}
        />
        {animated && isHovering && (
          <div className="absolute inset-0 bg-cyan-400 opacity-20 rounded-full blur-md animate-pulse"></div>
        )}
      </div>
      
      {withText && (
        <h1 
          className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-cyan-500 to-blue-600 
            bg-clip-text text-transparent ${isLoaded && animated ? 'animate-fade-in' : ''}`}
        >
          SCRIPTO
        </h1>
      )}
    </div>
  );
};

export default Logo;
