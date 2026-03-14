'use client'; 

import React, { useRef } from 'react';

export default function CrosshairWrapper({ 
  children, 
  className = '', 
  style = {} 
}: { 
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const crosshairXRef = useRef<HTMLDivElement>(null);
  const crosshairYRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    // 如果是手机屏幕尺寸（宽度小于 768px），直接终止函数
    if (typeof window !== 'undefined' && window.innerWidth < 768) return;

    // 鼠标在组件内部移动时，获取鼠标相对于整个浏览器窗口 (Viewport) 的坐标
    if (!crosshairXRef.current || !crosshairYRef.current) return;

    const x = e.clientX;
    const y = e.clientY;

    crosshairXRef.current.style.top = `${y}px`;
    crosshairXRef.current.style.opacity = '1';
    
    crosshairYRef.current.style.left = `${x}px`;
    crosshairYRef.current.style.opacity = '1';
  };

  const handleMouseLeave = () => {
    // 鼠标移出地球所在的容器时隐藏准星
    if (crosshairXRef.current && crosshairYRef.current) {
      crosshairXRef.current.style.opacity = '0';
      crosshairYRef.current.style.opacity = '0';
    }
  };

  return (
    <>
      {/* 加上 @media 媒体查询，只有在电脑端（>=768px）才强制隐藏默认鼠标指针 */}
      <style>{`
        @media (min-width: 768px) {
          .force-hide-cursor,
          .force-hide-cursor * {
            cursor: none !important;
          }
        }
      `}</style>

      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`force-hide-cursor ${className}`}
        style={{ 
          position: 'relative', 
          ...style 
        }}
      >
        {/* ================= 十字准星线条 ================= */}
        {/* 水平线 */}
        <div 
          ref={crosshairXRef}
          style={{
            position: 'fixed',
            left: 0,
            top: '-10px',
            width: '100vw',
            height: '2px',
            backgroundColor: 'rgba(16, 185, 129, 0.6)', 
            pointerEvents: 'none', 
            transition: 'opacity 0.2s ease-out',
            opacity: 0, // 初始透明度为 0
            zIndex: 99999 // 极高层级，保证盖住页面外围的内容
          }}
        />
        {/* 垂直线 */}
        <div 
          ref={crosshairYRef}
          style={{
            position: 'fixed',
            top: 0,
            left: '-10px',
            height: '100vh',
            width: '2px',
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
            pointerEvents: 'none',
            transition: 'opacity 0.2s ease-out',
            opacity: 0, // 初始透明度为 0
            zIndex: 99999
          }}
        />

        {children}
      </div>
    </>
  );
}