import { getPosts } from '@/app/utils/utils';
import { Flex, Tag, Text, Heading, RevealFx } from '@/once-ui/components';

import { ProjectCard } from '@/components';
import { useTranslations } from 'next-intl';

interface ProjectsProps {
    range?: [number, number?];
    locale: string;
}

export function Projects({ range, locale }: ProjectsProps) {
    let allProjects = getPosts(['src', 'app', '[locale]', 'work', 'projects', locale]);

    const sortedProjects = allProjects.sort((a, b) => {
        return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
    });

    const displayedProjects = range
        ? sortedProjects.slice(range[0] - 1, range[1] ?? sortedProjects.length)
        : sortedProjects;

    return (
        <Flex
            fillWidth paddingX="l"
            direction="column">
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
                                marginTop: '4px' // 与右侧卡片顶部对齐
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
                                flexGrow: 1, // 自动填满下方所有空间
                                backgroundColor: 'var(--neutral-alpha-medium)',
                                marginTop: '16px',
                                marginBottom: '-48px' // 直接连通到下一个项目的圆点！
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