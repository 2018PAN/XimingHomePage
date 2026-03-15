"use client";

import { Flex, Tag, Text, RevealFx } from '@/once-ui/components';
import { ProjectCard } from '@/components';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ProjectsProps {
    projects: any[];
    range?: [number, number?];
    locale: string;
}

export function Projects({ projects, range, locale }: ProjectsProps) {
    const t = useTranslations();

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const sortedProjects = [...projects].sort((a, b) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

    const allTags = Array.from(new Set(
        sortedProjects.flatMap(p => 
            Array.isArray(p.metadata.tag) ? p.metadata.tag : [p.metadata.tag]
        ).filter(Boolean)
    ));

    const toggleTag = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const filteredProjects = selectedTags.length > 0
        ? sortedProjects.filter(post => {
            const postTags = Array.isArray(post.metadata.tag) ? post.metadata.tag : [post.metadata.tag];
            return selectedTags.some(t => postTags.includes(t));
        })
        : sortedProjects;

    const displayedProjects = range
        ? filteredProjects.slice(range[0] - 1, range[1] ?? filteredProjects.length)
        : filteredProjects;

    // 抽离出来的标签列表组件，方便复用
    const TagList = () => (
        <Flex gap="8" wrap alignItems="center">
            {allTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                    <div 
                        key={tag} 
                        className="cursor-target" 
                        role="button" 
                        tabIndex={0} 
                        onClick={() => toggleTag(tag)} 
                        onKeyDown={(e) => { if (e.key === 'Enter') toggleTag(tag); }}
                        style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s ease',
                            transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                            opacity: selectedTags.length === 0 || isSelected ? 1 : 0.8 
                        }}>
                        <Tag variant={isSelected ? "info" : "neutral"} size="l" style={{ pointerEvents: 'none' }}>
                            {t(`tags.${tag}`)}
                        </Tag>
                    </div>
                );
            })}
        </Flex>
    );

    return (
        <Flex fillWidth paddingX="l" direction="column">
            
            {/* 筛选器区域 */}
            {allTags.length > 0 && (
                <Flex direction="column" marginBottom="48">
                    
                    <Flex hide="s" direction="column" gap="16">
                        <Text variant="body-default-m" onBackground="neutral-weak">
                            {locale === 'zh' ? '项目筛选' : 'Filter by'}
                        </Text>
                        <TagList />
                    </Flex>

                    <Flex show="s" direction="column">
                        <Flex 
                            className="cursor-target"
                            alignItems="center" 
                            gap="8" 
                            onClick={() => setShowFilters(!showFilters)}
                            style={{ cursor: 'pointer', width: 'fit-content' }}
                        >
                            <Text variant="body-default-m" onBackground="neutral-weak">
                                {locale === 'zh' ? '筛选项目' : 'Filter by'}
                                {selectedTags.length > 0 && ` (${selectedTags.length})`}
                            </Text>
                            <Text variant="body-default-m" onBackground="neutral-weak" style={{
                                transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                                display: 'inline-block'
                            }}>
                                ▾
                            </Text>
                        </Flex>

                        <div style={{ 
                            display: 'grid', 
                            gridTemplateRows: showFilters ? '1fr' : '0fr',
                            transition: 'grid-template-rows 0.3s ease',
                        }}>
                            <div style={{ overflow: 'hidden' }}>
                                <Flex paddingTop="16">
                                    <TagList />
                                </Flex>
                            </div>
                        </div>
                    </Flex>
                </Flex>
            )}

            {/* 当没有项目匹配时的空状态 */}
            {displayedProjects.length === 0 && (
                <Flex fillWidth justifyContent="center" paddingY="xl">
                    <Text variant="body-default-m" onBackground="neutral-weak">
                        {locale === 'zh' ? '没有找到匹配的项目。' : 'No projects found for the selected tags.'}
                    </Text>
                </Flex>
            )}

            {/* 列表渲染逻辑保持不变... */}
            {displayedProjects.map((post, index) => (
                <RevealFx key={post.slug} translateY="48" delay={0.1}>
                    <Flex direction="row" mobileDirection="column" fillWidth gap="24" style={{ paddingBottom: '64px' }}>
                        {/* 左侧时间轴 (仅桌面) */}
                        <Flex hide="s" direction="column" alignItems="center" style={{ width: '100px', flexShrink: 0 }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--neutral-on-background-strong)', zIndex: 2, marginTop: '4px' }} />
                            <Text variant="heading-strong-s" onBackground="neutral-medium" style={{ marginTop: '16px' }}>
                                {new Date(post.metadata.publishedAt).getFullYear()}
                            </Text>
                            <Text variant="body-default-xs" onBackground="neutral-weak">
                                {locale === 'zh' 
                                    ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][new Date(post.metadata.publishedAt).getMonth()]
                                    : new Date(post.metadata.publishedAt).toLocaleDateString('en-US', { month: 'short' })
                                }
                            </Text>
                            <div style={{ width: '2px', flexGrow: 1, backgroundColor: 'var(--neutral-alpha-medium)', marginTop: '16px', marginBottom: '-48px' }} />
                        </Flex>

                        {/* 卡片区域 */}
                        <Flex flex={1} direction="column">
                            {/* 手机端顶部日期 */}
                            <Flex show="s" marginBottom="16" alignItems="center" gap="12">
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--neutral-on-background-strong)' }} />
                                <Text variant="heading-strong-s" onBackground="neutral-medium">
                                    {new Date(post.metadata.publishedAt).getFullYear()} {locale === 'zh' 
                                        ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][new Date(post.metadata.publishedAt).getMonth()]
                                        : new Date(post.metadata.publishedAt).toLocaleDateString('en-US', { month: 'short' })
                                    }
                                </Text>
                            </Flex>

                            <ProjectCard
                                href={`work/${post.slug}`}
                                images={post.metadata.images}
                                title={post.metadata.title}
                                description={post.metadata.summary}
                                content={post.content}
                                avatars={post.metadata.team?.map((member) => ({ src: member.avatar })) || []}
                                link={post.metadata.link || ""}
                                tag={post.metadata.tag}
                            />
                        </Flex>
                    </Flex>
                </RevealFx>
            ))}
        </Flex>
    );
}