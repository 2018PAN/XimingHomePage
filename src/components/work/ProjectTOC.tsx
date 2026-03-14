"use client"; 

import React, { useEffect, useState } from 'react';
import { Flex, Text } from '@/once-ui/components';

interface ProjectTOCProps {
    toc: {
        id: string;
        text: string;
    }[];
}

export function ProjectTOC({ toc }: ProjectTOCProps) {
    // 🚀 1. 新增：记录当前读到了哪个章节
    const [activeId, setActiveId] = useState<string>('');

    // 🚀 2. 新增：滚动监听逻辑 (Scroll Spy)
    useEffect(() => {
        const handleScroll = () => {
            let currentId = '';
            for (const item of toc) {
                const element = document.getElementById(item.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // 当标题距离屏幕顶部小于等于 150px 时，判定为进入该章节
                    if (rect.top <= 150) {
                        currentId = item.id;
                    }
                }
            }
            setActiveId(currentId);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // 初始化执行一次
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [toc]);

    // 原有的平滑滚动逻辑保留
    const scrollTo = (id: string, offset: number) => {
        const element = document.getElementById(id);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    if (!toc || toc.length === 0) return null;

    return (
        <Flex
            style={{
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                whiteSpace: 'nowrap',
                zIndex: 50 // 保证它不会被图片盖住
            }}
            position="fixed"     // 固定在屏幕上
            paddingLeft="24"     // 离左边界的距离
            gap="32"
            direction="column" 
            hide="l"             // 手机/平板屏幕较窄时自动隐藏
        >
            {/* 🚀 3. 注入高级交互动画 */}
            <style>{`
                .toc-item {
                    cursor: none !important; /* 隐藏原生鼠标，交给你的 TargetCursor */
                    opacity: 0.5;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                /* 悬浮或正在阅读该章节时，透明度拉满 */
                .toc-item:hover, .toc-item.active {
                    opacity: 1;
                }

                .toc-line {
                    height: 2px;
                    width: 16px; /* 默认宽度与你之前写的一致 */
                    background-color: var(--neutral-on-background-strong);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 2px;
                }




                .toc-text {
                    transition: all 0.3s ease;
                }

                /* 悬浮或选中时：文字向右微微平移，增加呼吸推挤感 */
                .toc-item:hover .toc-text, .toc-item.active .toc-text {
                    transform: translateX(4px); 
                }
            `}</style>

            {toc.map((item, index) => {
                const isActive = activeId === item.id;
                
                return (
                    <Flex
                        key={index}
                        gap="12"
                        alignItems="center"
                        className={`cursor-target toc-item ${isActive ? 'active' : ''}`}
                        role="button" // 让光标组件更好识别
                        tabIndex={0}
                        onClick={() => scrollTo(item.id, 80)}
                    >
                        <div className="toc-line" />
                        
                        <div className="toc-text">
                            <Text onBackground={isActive ? "neutral-strong" : "neutral-medium"}>
                                {item.text}
                            </Text>
                        </div>
                    </Flex>
                );
            })}
        </Flex>
    );
}