"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function GridBackground({ theme = 'dark' }: { theme?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<any>(null); 
    
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => window.innerWidth < 768 || /Mobile|Android|iOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
        setIsMobile(checkMobile());
        
        const handleResize = () => setIsMobile(checkMobile());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // 如果还没挂载、或者是手机端，直接中止，不执行任何 Canvas 画图逻辑
        if (!mounted || isMobile || typeof window === 'undefined' || !canvasRef.current) return;

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
                this.ctx = canvas.getContext("2d", { alpha: true })!; 
                this.isDark = currentTheme === 'dark'; 

                this.options = {
                    speed: 0.05,
                    borderColor: this.isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
                    squareSize: 70,
                    specialBlockColor: "rgba(52, 211, 153, 0.8)", 
                    snakeHeadColor: this.isDark ? "rgba(255, 255, 255, 0.95)" : "rgba(0, 0, 0, 0.85)",
                    snakeColorDecay: 0.88,
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
                        // 默认保留 1 节身体
                        if (!this.shouldGrow && this.snakeBody.length > 1) this.snakeBody.pop();
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
                
                this.ctx.fillStyle = this.isDark ? '#080808' : '#fafafa';
                this.ctx.fillRect(0, 0, w, h);

                const offX = this.gridOffset.x % s;
                const offY = this.gridOffset.y % s;
                const startX = Math.floor(this.gridOffset.x / s) * s;
                const startY = Math.floor(this.gridOffset.y / s) * s;

                this.ctx.beginPath();
                this.ctx.strokeStyle = this.options.borderColor;
                this.ctx.lineWidth = 0.5;

                for (let x = -offX; x <= w; x += s) {
                    for (let y = -offY; y <= h; y += s) {
                        this.ctx.strokeRect(x, y, s, s);
                    }
                }
                this.ctx.stroke();

                if (this.specialBlock) {
                    const bx = Math.round(this.specialBlock.x * s + startX - this.gridOffset.x);
                    const by = Math.round(this.specialBlock.y * s + startY - this.gridOffset.y);
                    this.ctx.fillStyle = this.options.specialBlockColor;
                    this.ctx.fillRect(bx, by, s, s);
                }

                const colorValue = this.isDark ? 255 : 0;
                this.snakeBody.forEach((seg, i) => {
                    const sx = Math.round(seg.x * s + startX - this.gridOffset.x);
                    const sy = Math.round(seg.y * s + startY - this.gridOffset.y);
                    this.ctx.fillStyle = i === 0 ? this.options.snakeHeadColor : `rgba(${colorValue},${colorValue},${colorValue},${Math.max(0.05, Math.pow(this.options.snakeColorDecay, i))})`;
                    this.ctx.fillRect(sx, sy, s, s);
                });

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
    }, [mounted, isMobile, theme]); // 依赖项加上 isMobile

    if (!mounted) return null;

    // 手机端，返回 null，不再渲染 canvas，底层的全局背景就会透出来。
    if (isMobile) {
        return null;
    }

    // 电脑端：照常渲染 canvas 贪吃蛇
    return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />;
}