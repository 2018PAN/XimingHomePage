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
      
      {/* 🚀 核心修改：加入响应式 CSS 样式 */}
      <style>{`
        .responsive-header {
          margin-bottom: 48px;
          font-size: 1.5rem;
          margin-top: 16px;
        }
        .responsive-map-container {
          min-height: 500px;
        }
        
        /* 当屏幕宽度小于 768px (手机端) 时，自动应用以下样式 */
        @media (max-width: 768px) {
          .responsive-header {
            margin-bottom: 0px !important; 
            margin-top: 8px !important;
            font-size: 1.15rem !important;
            position: relative;
            z-index: 20; 
          }
          
          .responsive-map-container {
            min-height: 100vw !important; 
            max-height: 65vh !important;
            
            margin-top: -0px !important; 
          }
        }
      `}</style>

      {/* 🚀 移除了写死的 marginBottom="48" 和内联的 fontSize，改用 className 接管 */}
      <Flex direction="column" alignItems="center" className="responsive-header">
        <p style={{ fontWeight: 600, margin: 0 }}>
          <ShinyText 
            text={gallery.description} 
            color="var(--neutral-medium)"
            shineColor="#10b981"
            speed={3}
          />
        </p>
      </Flex>

      {/* 给地图容器也加上了响应式 class */}
      <div className="responsive-map-container" style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <CrosshairWrapper 
          style={{ width: '100%', maxWidth: '1400px', height: '100%', borderRadius: '16px' }}
        >
           <TravelGlobe mapboxToken={mapboxToken} locale={locale} />
        </CrosshairWrapper>
      </div>
      
    </Flex>
  );
}