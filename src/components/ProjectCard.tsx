"use client";

import { AvatarGroup, Flex, Heading, RevealFx, SmartImage, SmartLink, Text, Tag } from "@/once-ui/components";
import { useEffect, useState } from "react";
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface ProjectCardProps {
    href: string;
    images: string[];
    title: string;
    content: string;
    description: string;
    avatars: { src: string }[];
    link: string;
    tag?: string | string[];
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
    href,
    images = [],
    title,
    content,
    description,
    avatars,
    link,
    tag,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const t = useTranslations();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTransitioning(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleImageClick = () => {
        if (images.length > 1) {
            setIsTransitioning(false);
            const nextIndex = (activeIndex + 1) % images.length;
            handleControlClick(nextIndex);

        }
    };

    const handleControlClick = (index: number) => {
        if (index !== activeIndex) {
            setIsTransitioning(false);
            setTimeout(() => {
                setActiveIndex(index);
                setIsTransitioning(true);
            }, 630);
        }
    };

    return (
        <Flex
            fillWidth gap="l"
            direction="row"           // 改为横向排版
            mobileDirection="column"  // 手机端自动切回上下排版
            alignItems="center"       // 垂直方向居中对齐     
        >
            {/* 图片区域 (占据 6 份宽度) */}
            <Flex flex={6} direction="column" gap="16" fillWidth>
                {images[activeIndex] && (
                    <Flex onClick={handleImageClick}>
                        <RevealFx
                            style={{ width: '100%' }}
                            delay={0.4}
                            trigger={isTransitioning}
                            speed="fast">
                            <Link
                                href={href}
                                style={{
                                    textDecoration: 'none', // 去掉可能存在的下划线
                                    display: 'block',        // 保证填满容器
                                    width: '100%'
                                }}
                            >
                                <SmartImage
                                    tabIndex={0}
                                    radius="l"
                                    alt={title}
                                    aspectRatio="16 / 9"
                                    src={images[activeIndex]}
                                    style={{
                                        border: '1px solid var(--neutral-alpha-weak)',
                                        cursor: 'none', // 🚀 隐藏小手
                                    }} />
                            </Link>
                        </RevealFx>
                    </Flex>
                )}
                {/* 轮播图指示条 */}
                {images.length > 1 && (
                    <Flex gap="4" fillWidth justifyContent="center">
                        {images.map((_, index) => (
                            <Flex
                                key={index}
                                onClick={() => handleControlClick(index)}
                                className="cursor-target"
                                style={{
                                    background: activeIndex === index
                                        ? 'var(--neutral-on-background-strong)'
                                        : 'var(--neutral-alpha-medium)',
                                    cursor: 'none', // 🚀 隐藏小手
                                    transition: 'background 0.3s ease',
                                }}
                                fillWidth
                                height="2">
                            </Flex>
                        ))}
                    </Flex>
                )}
            </Flex>

            {/* 文字区域 (占据 5 份宽度) */}
            <Flex flex={5} direction="column" gap="24">

                {/* 1. 标签与标题 */}
                {/* 🚀 核心修复 1：增加 alignItems="flex-start"，阻止 Flexbox 默认将子元素宽度拉伸到 100% */}
                <Flex direction="column" gap="12" alignItems="flex-start">
                    {title && (
                        <Link
                            href={href}
                            style={{
                                color: 'inherit',
                                // 🚀 核心修复 2：使用 inline-block + fit-content，完美拥抱内容宽度，多行时紧贴最长的那一行
                                display: 'inline-block', 
                                width: 'fit-content',
                                maxWidth: '100%' 
                            }}
                        >
                            <Heading
                                as="h2"
                                variant="heading-strong-xl"
                                style={{ 
                                    width: 'fit-content',
                                    maxWidth: '100%',
                                    margin: 0
                                }}
                            >
                                {title}
                            </Heading>
                        </Link>
                    )}
                    {tag && (
                        <Flex gap="8" wrap>
                            {(Array.isArray(tag) ? tag : [tag]).map((tagItem, index) => (
                                <Tag key={index} variant="neutral" size="l">
                                    {t(`tags.${tagItem}`)}
                                </Tag>
                            ))}
                        </Flex>
                    )}

                </Flex>



                {/* 2. 项目描述 */}
                {description?.trim() && (
                    <Text
                        wrap="balance"
                        variant="body-default-m"
                        onBackground="neutral-weak">
                        {description}
                    </Text>
                )}

                {/* 3. 底部链接 (Know more) */}
                <Flex gap="24" wrap paddingTop="8">
                    {content?.trim() && (
                        <SmartLink
                            suffixIcon="arrowRight"
                            style={{ margin: '0', width: 'fit-content' }}
                            href={href}>
                            <Text variant="body-default-s">
                                {t("projectCard.label") || "Know more"}
                            </Text>
                        </SmartLink>
                    )}
                    {link && (
                        <SmartLink
                            suffixIcon="arrowUpRightFromSquare"
                            style={{ margin: "0", width: "fit-content" }}
                            href={link}>
                            <Text variant="body-default-s">
                                {t("projectCard.link")}
                            </Text>
                        </SmartLink>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};