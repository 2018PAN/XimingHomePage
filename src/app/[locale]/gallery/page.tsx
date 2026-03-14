import { Flex } from '@/once-ui/components';
import dynamic from 'next/dynamic';
import { baseURL, renderContent } from '@/app/resources';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

// 🚀 导入之前创建的十字准星特效和新创建的流光文字特效
import CrosshairWrapper from '@/components/CrosshairWrapper'; 
import ShinyText from '@/components/ShinyText';

export async function generateMetadata(
    { params: { locale } }: { params: { locale: string } }
) {
    const t = await getTranslations({ locale });
    const { gallery } = renderContent(t); 
    
    const title = gallery.title;
    const description = gallery.description;
    const ogImage = `https://${baseURL}/og?title=${encodeURIComponent(title)}`;

    return {
        title,
        description,
        openGraph: {
            title, description, type: 'website',
            url: `https://${baseURL}/${locale}/gallery`,
            images: [{ url: ogImage, alt: title }],
        },
        twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    };
}

const TravelGlobe = dynamic(() => import('@/components/TravelGlobe'), { 
  ssr: false, 
  loading: () => <div style={{ height: '100%', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a1a1aa' }}>🌍 Loading map engine...</div>
});

export default function TravelGalleryPage(
    { params: { locale } }: { params: { locale: string } }
) {
  unstable_setRequestLocale(locale);
  
  const t = useTranslations();
  const { gallery } = renderContent(t);
  
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

  return (
    <Flex direction="column" fillWidth style={{ minHeight: 'calc(100vh - 80px)', display: 'flex' }}>
      
      <Flex direction="column" alignItems="center" marginBottom="48">
        <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>
          <ShinyText 
            text={gallery.description} 
            color="var(--neutral-medium)" // 使用你原来的颜色作为基础底色
            shineColor="#10b981"          // 高亮颜色设为科技绿，与准星呼应 (也可改成 #ffffff)
            speed={3}                     // 动画持续时间，单位秒，可以自行调节
          />
        </p>
      </Flex>

      <div style={{ flex: 1, width: '100%', minHeight: '500px', display: 'flex', justifyContent: 'center' }}>
        <CrosshairWrapper 
          style={{ width: '100%', maxWidth: '1400px', height: '100%', borderRadius: '16px' }}
        >
           <TravelGlobe mapboxToken={mapboxToken} locale={locale} />
        </CrosshairWrapper>
      </div>
      
    </Flex>
  );
}