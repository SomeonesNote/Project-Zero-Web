import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  className = "",
  text = "로딩 중...",
}) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }[size];

  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  }[size];

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div
        className={`${sizeClasses} border-2 border-brand-primary border-t-transparent rounded-full animate-spin`}
      ></div>
      {text && (
        <p className={`text-brand-secondary font-medium ${textSizeClasses}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
