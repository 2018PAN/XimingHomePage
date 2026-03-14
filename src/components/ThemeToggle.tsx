"use client";

import { useState, useEffect } from 'react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState('dark');
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        setTheme(currentTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <button 
            onClick={toggleTheme}
            onMouseEnter={() => setIsHovered(true)} // 🆕 鼠标进入时，把状态设为 true
            onMouseLeave={() => setIsHovered(false)} // 🆕 鼠标离开时，把状态设为 false
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px', // 稍微调大了一点点，让图标在圈里有呼吸感
                height: '36px',
                borderRadius: '50%', // 完美圆形
                border: 'none',
                background: isHovered ? 'var(--neutral-alpha-strong)' : 'var(--neutral-alpha-medium)', 
                color: 'var(--neutral-on-background-medium)', // Icon 会自动使用这个颜色
                cursor: 'pointer',
                transition: 'all 0.2s ease', // 所有的变化都会有丝滑的过渡动画
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {theme === 'dark' ? (
                // ☀️ 太阳的 SVG 图标
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            ) : (
                // 🌙 月亮的 SVG 图标
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            )}
        </button>
    );
}