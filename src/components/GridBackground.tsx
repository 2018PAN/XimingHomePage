"use client";

import React, { useEffect, useRef } from 'react';

export default function GridBackground({ theme = 'dark' }: { theme?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<any>(null); 

    useEffect(() => {
        if (typeof window === 'undefined' || !canvasRef.current) return;

        const isPhone = /Mobile|Android|iOS|iPhone|iPad|iPod|Windows Phone|KFAPWI/i.test(navigator.userAgent);
        
        class GridAnimation {
            canvas: HTMLCanvasElement;
            ctx: CanvasRenderingContext2D;
            options: any;
            gridOffset: { x: number, y: number };
            hoveredSquare: any;
            animationFrame: any;
            currentOpacity: number;
            targetOpacity: number;
            lastTimestamp: number;
            specialBlock: any;
            snakeBody: any[];
            shouldGrow: boolean;
            isDark: boolean; 

            constructor(canvas: HTMLCanvasElement, currentTheme: string) {
                this.canvas = canvas;
                // 🚀 手机端关闭 alpha 缓冲区，强制硬件加速渲染
                this.ctx = canvas.getContext("2d", { alpha: !isPhone })!; 
                this.isDark = currentTheme === 'dark'; 

                this.options = {
                    speed: isPhone ? 0.04 : 0.05,
                    // 🚀 手机端线条稍微加亮 
                    borderColor: this.isDark 
                        ? (isPhone ? "rgba(255, 255, 255, 0.22)" : "rgba(255, 255, 255, 0.12)") 
                        : "rgba(0, 0, 0, 0.08)",
                    // 🚀 手机端格子保持 70，电脑端保持 70（按你代码现在的逻辑）
                    squareSize: isPhone ? 70 : 70,
                    specialBlockColor: "rgba(52, 211, 153, 0.8)", 
                    snakeHeadColor: this.isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(0, 0, 0, 0.85)",
                    snakeColorDecay: 0.85,
                    transitionDuration: 150,
                };
                
                this.gridOffset = { x: 0, y: 0 };
                this.hoveredSquare = null;
                this.currentOpacity = 0;
                this.targetOpacity = 0;
                this.lastTimestamp = 0;
                this.snakeBody = [];
                this.shouldGrow = false;
            }

            handleMouseMove = (event: MouseEvent) => {
                const mouseX = event.clientX;
                const mouseY = event.clientY;
                const s = this.options.squareSize;

                const startX = Math.floor(this.gridOffset.x / s) * s;
                const startY = Math.floor(this.gridOffset.y / s) * s;

                const hoveredSquareX = Math.floor((mouseX + this.gridOffset.x - startX) / s);
                const hoveredSquareY = Math.floor((mouseY + this.gridOffset.y - startY) / s);

                if (this.hoveredSquare?.x !== hoveredSquareX || this.hoveredSquare?.y !== hoveredSquareY) {
                    if (this.hoveredSquare) {
                        this.snakeBody.unshift({ x: this.hoveredSquare.x, y: this.hoveredSquare.y });
                        if (!this.shouldGrow && this.snakeBody.length > (isPhone ? 8 : 12)) this.snakeBody.pop();
                        this.shouldGrow = false;
                    }
                    this.hoveredSquare = { x: hoveredSquareX, y: hoveredSquareY };
                    this.targetOpacity = 0.6;

                    if (this.specialBlock && hoveredSquareX === this.specialBlock.x && hoveredSquareY === this.specialBlock.y) {
                        this.shouldGrow = true;
                        this.createSpecialBlock();
                    }
                }
            }

            init() {
                this.resizeCanvas();
                window.addEventListener("resize", () => this.resizeCanvas());
                window.addEventListener("mousemove", this.handleMouseMove);
                this.createSpecialBlock();
                this.animate();
            }

            resizeCanvas() {
                const dpr = window.devicePixelRatio || 1;
                const displayWidth = window.innerWidth;
                const displayHeight = window.innerHeight;
                this.canvas.width = Math.floor(displayWidth * dpr);
                this.canvas.height = Math.floor(displayHeight * dpr);
                this.canvas.style.width = `${displayWidth}px`;
                this.canvas.style.height = `${displayHeight}px`;
                this.ctx.scale(dpr, dpr);
            }

            createSpecialBlock() {
                const s = this.options.squareSize;
                const numSquaresX = Math.ceil(window.innerWidth / s);
                const numSquaresY = Math.ceil(window.innerHeight / s);
                const centerX = Math.floor(numSquaresX / 2);
                const centerY = Math.floor(numSquaresY / 2);
                const margin = 2; 

                let newX = 0, newY = 0, valid = false;
                while(!valid) {
                    newX = margin + Math.floor(Math.random() * (numSquaresX - 2 * margin));
                    newY = margin + Math.floor(Math.random() * (numSquaresY - 2 * margin));
                    const isUnderUI = Math.abs(newX - centerX) <= 4 && (newY >= centerY - 2 && newY <= centerY + 4);
                    if (!isUnderUI) valid = true;
                }
                this.specialBlock = { x: newX, y: newY };
            }

            drawGrid() {
                const dpr = window.devicePixelRatio || 1;
                const w = window.innerWidth;
                const h = window.innerHeight;
                const s = this.options.squareSize;

                this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
                
                // 1. 背景绘制
                this.ctx.fillStyle = this.isDark ? '#080808' : '#fafafa';
                this.ctx.fillRect(0, 0, w, h);

                const offX = this.gridOffset.x % s;
                const offY = this.gridOffset.y % s;
                const startX = Math.floor(this.gridOffset.x / s) * s;
                const startY = Math.floor(this.gridOffset.y / s) * s;

                // 2. 核心适配：手机端采用批处理线条绘制，极大提升性能
                this.ctx.beginPath();
                this.ctx.strokeStyle = this.options.borderColor;
                // 🚀 手机端线条强制 1 物理像素宽度，防止模糊
                this.ctx.lineWidth = isPhone ? (1 / dpr) : 0.5;

                if (isPhone) {
                    // 🚀 手机端优化算法：画长线而不是画小方块
                    for (let x = -offX; x <= w; x += s) {
                        const snapX = Math.round(x);
                        this.ctx.moveTo(snapX, 0);
                        this.ctx.lineTo(snapX, h);
                    }
                    for (let y = -offY; y <= h; y += s) {
                        const snapY = Math.round(y);
                        this.ctx.moveTo(0, snapY);
                        this.ctx.lineTo(w, snapY);
                    }
                } else {
                    // 电脑端保持原逻辑，支持 strokeRect 等，确保贪吃蛇视觉一致
                    for (let x = -offX; x <= w; x += s) {
                        for (let y = -offY; y <= h; y += s) {
                            this.ctx.strokeRect(x, y, s, s);
                        }
                    }
                }
                this.ctx.stroke();

                // 3. 绘制食物 (取整防止闪烁)
                if (this.specialBlock) {
                    const bx = Math.round(this.specialBlock.x * s + startX - this.gridOffset.x);
                    const by = Math.round(this.specialBlock.y * s + startY - this.gridOffset.y);
                    this.ctx.fillStyle = this.options.specialBlockColor;
                    this.ctx.fillRect(bx, by, s, s);
                }

                // 4. 绘制蛇身
                const colorValue = this.isDark ? 255 : 0;
                this.snakeBody.forEach((seg, i) => {
                    const sx = Math.round(seg.x * s + startX - this.gridOffset.x);
                    const sy = Math.round(seg.y * s + startY - this.gridOffset.y);
                    this.ctx.fillStyle = i === 0 ? this.options.snakeHeadColor : `rgba(${colorValue},${colorValue},${colorValue},${Math.max(0.05, Math.pow(this.options.snakeColorDecay, i))})`;
                    this.ctx.fillRect(sx, sy, s, s);
                });

                // 5. 渐变层
                const grad = this.ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, Math.max(w,h)/1.5);
                if (this.isDark) {
                    grad.addColorStop(0, "rgba(8, 8, 8, 0)");
                    grad.addColorStop(1, "rgba(4, 4, 4, 0.8)");
                } else {
                    grad.addColorStop(0, "rgba(250, 250, 250, 0)");
                    grad.addColorStop(1, "rgba(230, 230, 230, 0.5)");
                }
                this.ctx.fillStyle = grad;
                this.ctx.fillRect(0, 0, w, h);
            }

            updateAnimation(timestamp: number) {
                if (!this.lastTimestamp) this.lastTimestamp = timestamp;
                const deltaTime = timestamp - this.lastTimestamp;
                this.lastTimestamp = timestamp;

                if (this.currentOpacity !== this.targetOpacity) {
                    const progress = Math.min(deltaTime / this.options.transitionDuration, 1);
                    this.currentOpacity += (this.targetOpacity - this.currentOpacity) * progress;
                }

                this.gridOffset.x = (this.gridOffset.x - this.options.speed + this.options.squareSize) % this.options.squareSize;
                this.gridOffset.y = (this.gridOffset.y - this.options.speed + this.options.squareSize) % this.options.squareSize;

                this.drawGrid();
                this.animationFrame = requestAnimationFrame((t) => this.updateAnimation(t));
            }

            animate() {
                this.animationFrame = requestAnimationFrame((t) => this.updateAnimation(t));
            }

            destroy() {
                if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
                window.removeEventListener("mousemove", this.handleMouseMove);
            }
        }

        const anim = new GridAnimation(canvasRef.current, theme);
        anim.init();
        animRef.current = anim;
        return () => anim.destroy();
    }, []); 

    useEffect(() => {
        if (animRef.current) {
            const anim = animRef.current;
            anim.isDark = theme === 'dark';
            const isPhone = /Mobile|Android|iOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
            anim.options.borderColor = anim.isDark 
                ? (isPhone ? "rgba(255, 255, 255, 0.24)" : "rgba(255, 255, 255, 0.18)") 
                : "rgba(0, 0, 0, 0.12)";
        }
    }, [theme]);

    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />;
}