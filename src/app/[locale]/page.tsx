"use client";

import React, { useState, useEffect } from 'react';
import { Flex, Text, Avatar, Button } from '@/once-ui/components';
import GridBackground from '@/components/GridBackground';
import TargetCursor from '@/components/TargetCursor';

export default function Home({ params: { locale } }: { params: { locale: string } }) {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const checkTheme = () => {
            const htmlTheme = document.documentElement.getAttribute('data-theme');
            const bodyTheme = document.body.getAttribute('data-theme');
            const htmlClass = document.documentElement.className;
            const bodyClass = document.body.className;

            const isLight = htmlTheme === 'light' || bodyTheme === 'light' || 
                            htmlClass.includes('light') || bodyClass.includes('light');
                            
            setTheme(isLight ? 'light' : 'dark');
        };

        checkTheme(); 
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
        observer.observe(document.body, { attributes: true, attributeFilter: ['data-theme', 'class'] });

        return () => observer.disconnect();
    }, []);

    const isZh = locale.includes('zh');

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', zIndex: 9999 }}>
            <style>{`
                footer {
                    display: none !important;
                }
                /* 在手机端隐藏专属鼠标光标，防止卡在屏幕中间 */
                @media (max-width: 768px) {
                    .hide-on-mobile {
                        display: none !important;
                    }
                }
            `}</style>

            {/* 给光标套上一个手机端隐藏的壳子 */}
            <div className="hide-on-mobile">
                <TargetCursor />
            </div>

            {/* 底层：贪吃蛇网格动画 (内部已设置为手机端透明) */}
            <GridBackground theme={theme} />
            
            {/* 上层：主页内容 */}
            <Flex direction="column" alignItems="center" justifyContent="center" fillWidth fillHeight style={{ position: 'relative', zIndex: 10, pointerEvents: 'none' }}>
                
                <div style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar src="/images/avatar.jpg" size="xl" style={{ marginBottom: '24px' }} />
                    <Text variant="display-strong-m" onBackground="neutral-strong" style={{ letterSpacing: '0.05em' }}>
                        {isZh ? '王晰明' : 'Ximing Wang'}
                    </Text>
                    <Text variant="body-default-s" onBackground="neutral-weak" style={{ marginTop: '8px', letterSpacing: '0.1em', fontFamily: 'monospace' }}>
                        {isZh ? '今天仍是崭新的一天。' : 'After all, today is a new day.'}
                    </Text>
                </div>
                
                <Flex gap="24" marginTop="48" wrap justifyContent="center" style={{ pointerEvents: 'auto' }}>
                    <Button variant="tertiary" prefixIcon="person" href={`/${locale}/about`}>
                        {isZh ? '关于我' : 'About'}
                    </Button>
                    <Button variant="tertiary" prefixIcon="grid" href={`/${locale}/work`}>
                        {isZh ? '项目' : 'Projects'}
                    </Button>
                    <Button variant="tertiary" prefixIcon="globe" href={`/${locale}/gallery`}>
                        {isZh ? '足迹' : 'Footprints'}
                    </Button>
                </Flex>
            </Flex>
            
        </div>
    );
}