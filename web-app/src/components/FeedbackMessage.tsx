import type { FeedbackVariant } from '../types/ui';

type FeedbackMessageProps = {
  message: string;
  variant: FeedbackVariant;
};

export function FeedbackMessage({ message, variant }: FeedbackMessageProps) {
  return (
    <div
      className={`feedback-bar feedback-${variant}`}
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      data-testid="feedback-message"
    >
      <span className="feedback-icon">
        {variant === 'success' && '✓'}
        {variant === 'error' && '!'}
        {variant === 'info' && 'i'}
      </span>
      <span>{message}</span>
    </div>
  );
}