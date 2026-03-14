"use client";
import { motion, useMotionValue, useTransform, type PanInfo } from 'motion/react';
import { useState, useEffect } from 'react';

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
}

function CardRotate({ children, onSendToBack, sensitivity }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // 拖拽时的微小 3D 倾斜反馈
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  function handleDragEnd(_event: any, info: PanInfo) {
    if (Math.abs(info.offset.x) > sensitivity || Math.abs(info.offset.y) > sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      style={{ 
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
        cursor: 'grab', x, y, rotateX, rotateY, zIndex: 10 
      }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic = {0.6}
      whileTap={{ cursor: 'grabbing' }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export default function CardStack({
  images = "", 
  sensitivity = 150,
}: {
  images: string;
  sensitivity?: number;
}) {
  const [stack, setStack] = useState<{id: number, src: string}[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (images) {
      const imageArray = images.split(',').map(img => img.trim());
      setStack(imageArray.map((src, index) => ({ id: index + 1, src })));
    }
    setIsMounted(true);
  }, [images]);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      maxWidth: '300px', 
      height: '450px', 
      margin: '40px auto', 
      perspective: 800 
    }}>
      {isMounted && stack.map((card, index) => {
        return (
          <CardRotate key={card.id} onSendToBack={() => {
            setStack(prev => {
              const newStack = [...prev];
              const index = newStack.findIndex(c => c.id === card.id);
              const [movedCard] = newStack.splice(index, 1);
              newStack.unshift(movedCard);
              return newStack;
            });
          }} sensitivity={sensitivity}>
            
            <motion.div
              style={{
                borderRadius: '16px', // 👈 完美的圆角半径
                overflow: 'hidden',
                width: '100%',
                height: '100%',
                backgroundColor: 'transparent',
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)' 
              }}
              animate={{
                rotateZ: (stack.length - index - 1) * 4, 
                scale: 1 + index * 0.05 - stack.length * 0.05, 
                transformOrigin: '90% 90%'
              }}
              initial={false}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <img
                src={card.src}
                alt={`Card ${card.id}`}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover', 
                  pointerEvents: 'none' 
                }}
              />
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}