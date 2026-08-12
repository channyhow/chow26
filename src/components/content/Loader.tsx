import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

export function Loader({ messages }: { messages: string[] }) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const availableMessages = messages.filter(Boolean);

  useEffect(() => {
    if (reduceMotion || availableMessages.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % availableMessages.length);
    }, 1600);

    return () => window.clearInterval(interval);
  }, [availableMessages.length, reduceMotion]);

  if (!availableMessages.length) return null;

  return (
    <div className="loader" role="status" aria-live="polite" aria-atomic="true">
      <div className="loader__messages">
        <span key={activeIndex}>{availableMessages[activeIndex]}</span>
      </div>
      <span className="loader__line" aria-hidden="true" />
    </div>
  );
}
