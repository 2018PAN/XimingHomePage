'use client';

import React, { useRef, useEffect } from 'react';

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

interface GridOffset {
  x: number;
  y: number;
}

interface SquaresProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
  speed?: number;
  borderColor?: CanvasStrokeStyle;
  squareSize?: number;
  hoverFillColor?: CanvasStrokeStyle;
}

const Squares: React.FC<SquaresProps> = ({
  direction = 'right',
  speed = 0.5,
  borderColor = 'rgba(128, 128, 128, 0.15)', // 调淡边框色，增加高级感
  squareSize = 40,
  hoverFillColor = 'rgba(16, 185, 129, 0.2)' // 使用科技绿作为交互色
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number | null>(null);
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
  const hoveredSquareRef = useRef<GridOffset | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const drawGrid = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 计算起始绘制点
      const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
      const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;

      ctx.lineWidth = 0.5;

      for (let x = -squareSize; x < canvas.width + squareSize; x += squareSize) {
        for (let y = -squareSize; y < canvas.height + squareSize; y += squareSize) {
          const squareX = x + (gridOffset.current.x % squareSize);
          const squareY = y + (gridOffset.current.y % squareSize);

          // 绘制悬停高亮
          if (
            hoveredSquareRef.current &&
            Math.floor((x + canvas.width) / squareSize) === hoveredSquareRef.current.x &&
            Math.floor((y + canvas.height) / squareSize) === hoveredSquareRef.current.y
          ) {
            ctx.fillStyle = hoverFillColor;
            ctx.fillRect(squareX, squareY, squareSize, squareSize);
          }

          ctx.strokeStyle = borderColor;
          ctx.strokeRect(squareX, squareY, squareSize, squareSize);
        }
      }

      // 添加径向遮罩，中心透明，四周变黑，增加深度感
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 1.5
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, '#060010'); // 极深紫色/黑色边缘

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1);
      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed) % squareSize;
          break;
        case 'left':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed) % squareSize;
          break;
        case 'up':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed) % squareSize;
          break;
        case 'down':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed) % squareSize;
          break;
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed) % squareSize;
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed) % squareSize;
          break;
      }

      drawGrid();
      requestRef.current = requestAnimationFrame(updateAnimation);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const hoveredSquareX = Math.floor((mouseX - (gridOffset.current.x % squareSize) + canvas.width) / squareSize);
      const hoveredSquareY = Math.floor((mouseY - (gridOffset.current.y % squareSize) + canvas.height) / squareSize);

      hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
    };

    const handleMouseLeave = () => {
      hoveredSquareRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    requestRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [direction, speed, borderColor, hoverFillColor, squareSize]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: -1, // 置于底层
        display: 'block',
        background: '#060010' // 基础底色
      }} 
    />
  );
};

export default Squares;