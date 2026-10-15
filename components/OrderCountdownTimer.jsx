"use client";

import { useEffect, useState } from "react";

export default function OrderCountdownTimer({ createdAt, onExpire }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, expired: false });

  useEffect(() => {
    const orderTime = new Date(createdAt).getTime();
    const expiryTime = orderTime + 24 * 60 * 60 * 1000;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = expiryTime - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, expired: true });
        if (onExpire) onExpire();
        clearInterval(interval);
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds, expired: false });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, onExpire]);

  if (timeLeft.expired) {
    return (
      <span className="text-xs text-red-500 font-semibold">
        ⏱ 24-hour edit/cancel window has closed.
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg">
      <span>⏱ Modifiable for:</span>
      <span className="font-mono font-bold">
        {String(timeLeft.hours).padStart(2, "0")}h {String(timeLeft.minutes).padStart(2, "0")}m {String(timeLeft.seconds).padStart(2, "0")}s
      </span>
    </div>
  );
}