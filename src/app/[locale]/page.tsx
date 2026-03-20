"use client";

import React, { useState, useEffect } from 'react';
import { Flex, Text, Avatar, Button } from '@/once-ui/components';
import GridBackground from '@/components/GridBackground';
import TargetCursor from '@/components/TargetCursor';

export default function Home({ params: { locale } }: { params: { locale: string } }) {
    const [theme, setTheme] = useState('dark');
    
    // 🚀 新增：彻底掌控触屏设备的生杀大权
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // 智能检测主题
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

        // 🚀 终极物理触控探测：抓捕所有带触摸屏的设备（包含强行伪装成Mac的iPad）
        const checkTouch = () => {
            return (
                window.innerWidth <= 1024 || // 屏幕小于平板尺寸
                navigator.maxTouchPoints > 0 || // 物理屏幕支持触控点（绝杀 iPad 和安卓板）
                window.matchMedia('(hover: none) and (pointer: coarse)').matches
            );
        };
        setIsTouchDevice(checkTouch());

        const handleResize = () => setIsTouchDevice(checkTouch());
        window.addEventListener('resize', handleResize);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const isZh = locale.includes('zh');

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', zIndex: 9999 }}>
            <style>{`
                footer {
                    display: none !important;
                }
            `}</style>

            {/* 只有挂载完毕且【不是】触控设备时，才渲染这个光标组件！ */}
            {mounted && !isTouchDevice && (
                <TargetCursor />
            )}

            {/* 底层：贪吃蛇网格动画 */}
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
                        {isZh ? '项目展示' : 'Projects'}
                    </Button>
                    <Button variant="tertiary" prefixIcon="globe" href={`/${locale}/gallery`}>
                        {isZh ? '足迹' : 'Footprints'}
                    </Button>
                </Flex>
            </Flex>
            
        </div>
    );
}