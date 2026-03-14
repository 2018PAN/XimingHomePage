'use client'; // 🚀 客户端组件声明，因为使用了 useRef 和 useEffect

import { useEffect, useRef, FC, ReactNode } from 'react';
import { gsap } from 'gsap';

interface GridMotionProps {
  items?: (string | ReactNode)[];
  gradientColor?: string;
}

const GridMotion: FC<GridMotionProps> = ({ items = [], gradientColor = 'var(--page-background, black)' }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const mouseXRef = useRef<number>(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  );

  const totalItems = 28;
  const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
  const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    const handleMouseMove = (e: MouseEvent): void => {
      mouseXRef.current = e.clientX;
    };

    const updateMotion = (): void => {
      const maxMoveAmount = 300;
      const baseDuration = 0.8;
      const inertiaFactors = [0.6, 0.4, 0.3, 0.2];

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount = ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power3.out',
            overwrite: 'auto'
          });
        }
      });
    };

    const removeAnimationLoop = gsap.ticker.add(updateMotion);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      removeAnimationLoop();
    };
  }, []);

  // 🚀 将原有的 Tailwind CSS 转换为纯内联样式，确保在任何框架下都不会失效错位
  return (
    <div ref={gridRef} style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      <section
        style={{
          width: '100%',
          height: '100vh', 
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `radial-gradient(circle, ${gradientColor} 0%, transparent 100%)`
        }}
      >
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 4, backgroundSize: '250px' }}></div>
        <div 
          style={{ 
            gap: '1rem', 
            flex: 'none', 
            position: 'relative', 
            width: '150vw', 
            height: '150vh', 
            display: 'grid', 
            gridTemplateRows: 'repeat(4, minmax(0, 1fr))', 
            gridTemplateColumns: 'repeat(1, minmax(0, 1fr))', 
            transform: 'rotate(-15deg)', 
            transformOrigin: 'center', 
            zIndex: 2 
          }}
        >
          {Array.from({ length: 4 }, (_, rowIndex) => (
            <div
              key={rowIndex}
              style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', willChange: 'transform, filter' }}
              ref={el => {
                if (el) rowRefs.current[rowIndex] = el;
              }}
            >
              {Array.from({ length: 7 }, (_, itemIndex) => {
                const content = combinedItems[rowIndex * 7 + itemIndex];
                return (
                  <div key={itemIndex} style={{ position: 'relative' }}>
                    <div style={{ 
                      position: 'relative', width: '100%', height: '100%', overflow: 'hidden', 
                      borderRadius: '10px', backgroundColor: '#111', display: 'flex', 
                      alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem' 
                    }}>
                      {typeof content === 'string' && (content.startsWith('http') || content.startsWith('/')) ? (
                        <div
                          style={{
                            width: '100%', height: '100%', backgroundSize: 'cover', 
                            backgroundPosition: 'center', position: 'absolute', top: 0, left: 0,
                            backgroundImage: `url(${content})`
                          }}
                        ></div>
                      ) : (
                        <div style={{ padding: '1rem', textAlign: 'center', zIndex: 1 }}>{content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ position: 'relative', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'none' }}></div>
      </section>
    </div>
  );
};

export default GridMotion;