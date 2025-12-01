import { useEffect, useState } from "react";

export function useCountdown(startMinutes: number = 9) {
  const [timeLeft, setTimeLeft] = useState(startMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return {
    minutes,
    seconds,
    isExpired: timeLeft <= 0,
  };
}
