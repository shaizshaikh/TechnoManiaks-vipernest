// Snowfall.js
import { useEffect } from 'react';

const Snowfall = () => {
  useEffect(() => {
    const canvas = document.getElementById('snowfallCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Snowflake array
    const snowflakes = [];
    const maxSnowflakes = 100;

    // Create snowflakes
    for (let i = 0; i < maxSnowflakes; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 4 + 1,
        density: Math.random() * maxSnowflakes,
      });
    }

    // Animation function
    const drawSnowflakes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.beginPath();

      for (let i = 0; i < snowflakes.length; i++) {
        const snowflake = snowflakes[i];
        ctx.moveTo(snowflake.x, snowflake.y);
        ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2, true);
      }

      ctx.fill();
      updateSnowflakes();
    };

    // Update snowflake positions
    const updateSnowflakes = () => {
      for (let i = 0; i < snowflakes.length; i++) {
        const snowflake = snowflakes[i];
        snowflake.y += Math.pow(snowflake.density, 2) + 1; // Falling speed

        // Respawn snowflakes at the top
        if (snowflake.y > canvas.height) {
          snowflakes[i] = {
            x: Math.random() * canvas.width,
            y: 0,
            radius: snowflake.radius,
            density: snowflake.density,
          };
        }
      }
    };

    // Animate
    const animateSnowfall = () => {
      drawSnowflakes();
      requestAnimationFrame(animateSnowfall);
    };

    animateSnowfall();

    // Handle window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  return <canvas id="snowfallCanvas" style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
};

export default Snowfall;
