"use client";

import { useEffect, useRef } from "react";

export default function BackgroundAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Create blobs
    const blobs = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 200 + 100,
      xSpeed: (Math.random() - 0.5) * 0.7,
      ySpeed: (Math.random() - 0.5) * 0.7,
      hue: Math.random() * 60 + 220, // Blue to purple range
    }));

    // Animation loop
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw gradient background
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      gradient.addColorStop(0, "rgba(30, 41, 59, 1)");
      gradient.addColorStop(1, "rgba(15, 23, 42, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw blobs
      blobs.forEach((blob) => {
        // Update position
        blob.x += blob.xSpeed;
        blob.y += blob.ySpeed;

        // Bounce off edges
        if (blob.x < -blob.radius || blob.x > canvas.width + blob.radius) {
          blob.xSpeed *= -1;
        }
        if (blob.y < -blob.radius || blob.y > canvas.height + blob.radius) {
          blob.ySpeed *= -1;
        }

        // Draw blob
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius
        );
        gradient.addColorStop(0, `hsla(${blob.hue}, 100%, 70%, 0.4)`);
        gradient.addColorStop(1, `hsla(${blob.hue}, 100%, 50%, 0)`);

        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
