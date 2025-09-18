/**
 * Minimal loading spinner component
 * Use only for small inline loading states, not full pages
 */

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
  text?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  fullPage = false, 
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-2'
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-primary border-t-transparent ${sizeClasses[size]}`} />
  );

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          {spinner}
          {text && <p className="mt-4 text-gray-600 dark:text-gray-400">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {spinner}
      {text && <span className="ml-2 text-gray-600 dark:text-gray-400">{text}</span>}
    </div>
  );
} 