"use client"; // 👈 1. 声明为客户端组件

import { Flex, Tag, Text, RevealFx } from '@/once-ui/components'; // 删掉了 getPosts，加上了交互需要的组件
import { ProjectCard } from '@/components';
import { useTranslations } from 'next-intl';
import { useState } from 'react'; // 👈 2. 引入状态管理

interface ProjectsProps {
    projects: any[]; // 👈 3. 接收父组件传来的数据
    range?: [number, number?];
    locale: string;
}

export function Projects({ projects, range, locale }: ProjectsProps) {
    const t = useTranslations();

    // 🪄 状态魔法：记录当前选中了哪些标签
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // 1. 排序项目 (使用传进来的 projects)
    const sortedProjects = [...projects].sort((a, b) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

    // 2. 自动提取所有独一无二的标签 (用于生成筛选按钮)
    const allTags = Array.from(new Set(sortedProjects.map(p => p.metadata.tag).filter(Boolean)));

    // 3. 点击标签的交互逻辑
    const toggleTag = (tag: string) => {
        setSelectedTags(prev => 
            prev.includes(tag) 
                ? prev.filter(t => t !== tag) // 已选中 -> 取消选中
                : [...prev, tag]              // 未选中 -> 加入选中
        );
    };

    // 4. 根据选中的标签过滤项目
    const filteredProjects = selectedTags.length > 0
        ? sortedProjects.filter(post => selectedTags.includes(post.metadata.tag))
        : sortedProjects;

    // 5. 分页处理
    const displayedProjects = range
        ? filteredProjects.slice(range[0] - 1, range[1] ?? filteredProjects.length)
        : filteredProjects;

    return (
        <Flex
            fillWidth paddingX="l"
            direction="column">
            
            {/* 筛选器 UI 区域 */}
            {allTags.length > 0 && (
                <Flex gap="12" wrap marginBottom="48" alignItems="center">
                    <Text variant="body-default-s" onBackground="neutral-weak">
                        {locale === 'zh' ? '筛选项目：' : 'Filter by:'}
                    </Text>
                    
                    {allTags.map(tag => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                            <div 
                                key={tag} 
                                onClick={() => toggleTag(tag)} 
                                style={{ 
                                    cursor: 'pointer', 
                                    transition: 'all 0.2s ease',
                                    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                                    opacity: selectedTags.length === 0 || isSelected ? 1 : 0.6 // 没选中的稍微变暗，更凸显重点
                                }}>
                                <Tag variant={isSelected ? "info" : "neutral"} size="m">
                                    {t(`tags.${tag}`)}
                                </Tag>
                            </div>
                        );
                    })}
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

            {/* 时间轴和卡片区域 */}
            {displayedProjects.map((post, index) => (
                <RevealFx key={post.slug} translateY="48" delay={0.1}>
                    
                    <Flex direction="row" fillWidth style={{ paddingBottom: '64px' }}>

                        {/* 🕰️ 外部的高级时间轴区域 */}
                        <Flex direction="column" alignItems="center" style={{ width: '100px', flexShrink: 0, marginRight: '32px' }}>
                            
                            {/* 节点圆点 */}
                            <div style={{
                                width: '12px', height: '12px', borderRadius: '50%',
                                backgroundColor: 'var(--neutral-on-background-strong)',
                                zIndex: 2,
                                marginTop: '4px'
                            }} />

                            {/* 日期文本 */}
                            <Text variant="heading-strong-s" onBackground="neutral-medium" style={{ marginTop: '16px' }}>
                                {new Date(post.metadata.publishedAt).getFullYear()}
                            </Text>
                            <Text variant="body-default-xs" onBackground="neutral-weak">
                                {locale === 'zh' 
                                    ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'][new Date(post.metadata.publishedAt).getMonth()]
                                    : new Date(post.metadata.publishedAt).toLocaleDateString('en-US', { month: 'short' })
                                }
                            </Text>

                            {/* 贯穿的连接线 */}
                            <div style={{
                                width: '2px',
                                flexGrow: 1,
                                backgroundColor: 'var(--neutral-alpha-medium)',
                                marginTop: '16px',
                                marginBottom: '-48px'
                            }} />
                        </Flex>

                        {/* 卡片区域 */}
                        <Flex flex={1} style={{ marginTop: '48px' }}>
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