'use client';

import React, { useEffect, useState } from 'react';
import { Flex, Text } from '@/once-ui/components';
// 如果下面的 styles 报错说未找到，可以直接删掉这行 import，因为我们用原生 CSS 替代了
import styles from './about.module.scss'; 

interface TableOfContentsProps {
    structure: {
        title: string;
        display: boolean;
        items: string[];
    }[];
    about: {
        tableOfContent: {
            display: boolean;
            subItems: boolean;
        };
    };
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ structure, about }) => {
    // 🚀 1. 新增：记录当前的高亮节点
    const [activeId, setActiveId] = useState<string>('');

    // 🚀 2. 新增：滚动监听逻辑 (支持主标题和子标题的双重探测)
    useEffect(() => {
        const handleScroll = () => {
            let currentId = '';
            // 默认初始化给第一个展示的元素
            const firstVisible = structure.find(s => s.display);
            if (firstVisible) currentId = firstVisible.title;

            for (const section of structure) {
                if (!section.display) continue;

                // 探测主标题
                let el = document.getElementById(section.title);
                if (el && el.getBoundingClientRect().top <= 300) {
                    currentId = section.title;
                }

                // 探测子标题
                if (about.tableOfContent.subItems && section.items) {
                    for (const item of section.items) {
                        el = document.getElementById(item);
                        if (el && el.getBoundingClientRect().top <= 300) {
                            currentId = item;
                        }
                    }
                }
            }
            setActiveId(currentId);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); 
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, [structure, about.tableOfContent.subItems]);

    const scrollTo = (id: string, offset: number) => {
        const element = document.getElementById(id);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            setActiveId(id); // 点击时立刻给反馈

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    };

    if (!about.tableOfContent.display) return null;

    return (
        <Flex
            style={{
                left: '0',
                top: '50%',
                transform: 'translateY(-50%)',
                whiteSpace: 'nowrap',
                zIndex: 50 // 防遮挡
            }}
            position="fixed"
            paddingLeft="24" gap="32"
            direction="column" hide="m">
            
            <style>{`
                .toc-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: none !important; /* 让位给 TargetCursor */
                    opacity: 0.5;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .toc-item:hover, .toc-item.active {
                    opacity: 1;
                }

                .toc-line {
                    height: 1.5px;
                    background-color: var(--neutral-on-background-strong);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-radius: 2px;
                }

                /* 主级与副级默认的线宽 */
                .toc-item.main .toc-line { width: 14px; }
                .toc-item.sub .toc-line { width: 8px; }


                .toc-text {
                    transition: all 0.3s ease;
                }

                .toc-item:hover .toc-text, .toc-item.active .toc-text {
                    transform: translateX(4px); 
                }
            `}</style>

            {structure
                .filter(section => section.display)
                .map((section, sectionIndex) => (
                <Flex key={sectionIndex} gap="12" direction="column">
                    
                    <div
                        className={`cursor-target toc-item main ${activeId === section.title ? 'active' : ''}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => scrollTo(section.title, 80)}
                        onKeyDown={(e) => { if (e.key === 'Enter') scrollTo(section.title, 80); }}
                    >
                        <div className="toc-line" />
                        <div className="toc-text">
                            <Text onBackground={activeId === section.title ? "neutral-strong" : "neutral-medium"}>
                                {section.title}
                            </Text>
                        </div>
                    </div>

                    {about.tableOfContent.subItems && (
                        <>
                            {section.items.map((item, itemIndex) => (
                                /* 保持原有 hide="l" 的 Flex 包裹器，保证响应式正常工作 */
                                <Flex hide="l" key={itemIndex}>
                                    {/* 🚀 5. 子标题改造为原生 div，加上 sub 样式和额外缩进 */}
                                    <div
                                        className={`cursor-target toc-item sub ${activeId === item ? 'active' : ''}`}
                                        role="button"
                                        tabIndex={0}
                                        style={{ paddingLeft: '24px' }} // 子目录向右缩进
                                        onClick={() => scrollTo(item, 80)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') scrollTo(item, 80); }}
                                    >
                                        <div className="toc-line" />
                                        <div className="toc-text">
                                            <Text onBackground={activeId === item ? "neutral-strong" : "neutral-medium"}>
                                                {item}
                                            </Text>
                                        </div>
                                    </div>
                                </Flex>
                            ))}
                        </>
                    )}
                </Flex>
            ))}
        </Flex>
    );
};

export default TableOfContents;