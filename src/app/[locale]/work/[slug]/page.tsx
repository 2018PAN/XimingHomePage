import { notFound } from 'next/navigation'
import { CustomMDX } from '@/components/mdx'
import { getPosts } from '@/app/utils/utils'
import { AvatarGroup, Button, Flex, Heading, SmartImage, Text, Tag } from '@/once-ui/components'
import { baseURL, renderContent } from '@/app/resources';
import { routing } from '@/i18n/routing';
import { unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { formatDate } from '@/app/utils/formatDate';
import ScrollToHash from '@/components/ScrollToHash';
import { ProjectTOC } from '@/components/work/ProjectTOC';

import TargetCursor from '@/components/TargetCursor'; 

interface WorkParams {
    params: {
        slug: string;
        locale: string;
    };
}

export async function generateStaticParams(): Promise<{ slug: string; locale: string }[]> {
    const locales = routing.locales;
    
    // Create an array to store all posts from all locales
    const allPosts: { slug: string; locale: string }[] = [];

    // Fetch posts for each locale
    for (const locale of locales) {
        const posts = getPosts(['src', 'app', '[locale]', 'work', 'projects', locale]);
        allPosts.push(...posts.map(post => ({
            slug: post.slug,
            locale: locale,
        })));
    }

    return allPosts;
}

export function generateMetadata({ params: { slug, locale } }: WorkParams) {
    let post = getPosts(['src', 'app', '[locale]', 'work', 'projects', locale]).find((post) => post.slug === slug)
    
    if (!post) {
        return
    }

    let {
        title,
        publishedAt: publishedTime,
        summary: description,
        images,
        image,
        team,
    } = post.metadata
    let ogImage = image
        ? `https://${baseURL}${image}`
        : `https://${baseURL}/og?title=${title}`;

    return {
        title,
        description,
        images,
        team,
        openGraph: {
            title,
            description,
            type: 'article',
            publishedTime,
            url: `https://${baseURL}/${locale}/work/${post.slug}`,
            images: [
                {
                    url: ogImage,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImage],
        },
    }
}

export default function Project({ params }: WorkParams) {
    unstable_setRequestLocale(params.locale);
    let post = getPosts(['src', 'app', '[locale]', 'work', 'projects', params.locale]).find((post) => post.slug === params.slug)

    if (!post) {
        notFound()
    }

    const t = useTranslations();
    const { person } = renderContent(t);

    const avatars = post.metadata.team?.map((person) => ({
        src: person.avatar,
    })) || [];

    const headings = post.content.match(/^##\s+(.*)/gm) || [];
    const toc = headings.map(h => {
        const text = h.replace(/^##\s+/, '').trim();
        const id = text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/&/g, '-and-').replace(/[^a-zA-Z0-9\u4e00-\u9fa5\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+|-+$/g, '');
        return { id, text };
    });

    return (
        <Flex as="section"
            fillWidth maxWidth="m"
            direction="column" alignItems="center"
            gap="l">
            
            <TargetCursor />

            <ProjectTOC toc={toc} />

            <script
                type="application/ld+json"
                suppressHydrationWarning
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'BlogPosting',
                        headline: post.metadata.title,
                        datePublished: post.metadata.publishedAt,
                        dateModified: post.metadata.publishedAt,
                        description: post.metadata.summary,
                        image: post.metadata.image
                            ? `https://${baseURL}${post.metadata.image}`
                            : `https://${baseURL}/og?title=${post.metadata.title}`,
                            url: `https://${baseURL}/${params.locale}/work/${post.slug}`,
                        author: {
                            '@type': 'Person',
                            name: person.name,
                        },
                    }),
                }}
            />
            <Flex
                fillWidth maxWidth="m" gap="16"
                direction="column">
                <Button
                    href={`/${params.locale}/work`}
                    variant="tertiary"
                    size="m"
                    prefixIcon="chevronLeft">
                    {params.locale === 'zh' ? '返回项目' : 'Projects'}
                </Button>
                
                <Heading
                    variant="display-strong-m">
                    {post.metadata.title}
                </Heading>
                {post.metadata.tag && (
                    <Flex gap="8" wrap>
                        {(Array.isArray(post.metadata.tag) ? post.metadata.tag : [post.metadata.tag]).map((tagItem, index) => (
                            <Tag key={index} variant="neutral" size="l">
                                {t(`tags.${tagItem}`)}
                            </Tag>
                        ))}
                    </Flex>
                )}
            </Flex>
            {post.metadata.images.length > 0 && !(post.metadata as any).hideHeaderImage && (
                <SmartImage
                    aspectRatio="16 / 9"
                    radius="m"
                    alt="image"
                    src={post.metadata.images[0]}/>
            )}
            <Flex style={{margin: 'auto'}}
                as="article"
                maxWidth="m" fillWidth
                direction="column">
                <Flex
                    gap="12" marginBottom="24"
                    alignItems="center">
                    { post.metadata.team && (
                        <AvatarGroup
                            reverseOrder
                            avatars={avatars}
                            size="m"/>
                    )}
                    <Text
                        variant="body-default-m"
                        onBackground="neutral-weak">
                        {formatDate(post.metadata.publishedAt, false, params.locale)}
                    </Text>
                </Flex>
                <CustomMDX source={post.content} />

                {/* 加上这行隐形的“呼吸垫脚石” */}
                <div style={{ height: '25vh', width: '100%' }}></div>
            </Flex>
            <ScrollToHash />
        </Flex>
    )
}