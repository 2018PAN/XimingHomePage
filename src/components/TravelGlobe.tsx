"use client";
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { VISITED_COUNTRIES, myCityFootprints } from '@/data/footprints';

export default function TravelGlobe({ mapboxToken, locale }: { mapboxToken: string, locale: string }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  
  const [theme, setTheme] = useState('light');
  const styleRef = useRef('mapbox://styles/mapbox/light-v11');

  const localeRef = useRef(locale);
  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  useEffect(() => {
    const checkTheme = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark' || 
                     document.body.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };
    checkTheme(); 
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
    return () => observer.disconnect();
  }, []);

  const updateMapLanguageAndCleanUp = (m: mapboxgl.Map, targetLocale: string) => {
    const style = m.getStyle();
    if (!style || !style.layers) return;

    const isZh = targetLocale.includes('zh');

    style.layers.forEach(layer => {
      if (layer.layout && layer.layout['text-field']) {
        m.setLayoutProperty(layer.id, 'text-field', [
          'coalesce',
          ['get', isZh ? 'name_zh-Hans' : 'name_en'],
          ['get', 'name']
        ]);
      }
      const hideLayers = ['poi-label', 'transit-label', 'settlement-minor-label', 'settlement-subdivision-label'];
      if (hideLayers.includes(layer.id)) {
        m.setLayoutProperty(layer.id, 'visibility', 'none');
      }
    });
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: styleRef.current, 
      center: [16.37, 48.20], 
      zoom: 1.6,
      minZoom: 1.5, 
      maxZoom: 4.5, 
      projection: 'globe' as any 
    });

    const setupCustomLayers = () => {
      const m = map.current;
      if (!m) return;

      m.setFog({
        'color': 'rgba(0, 0, 0, 0)', 'high-color': 'rgba(0, 0, 0, 0)', 'space-color': 'rgba(0, 0, 0, 0)', 'star-intensity': 0
      });

      const layers = m.getStyle().layers;
      if (layers) {
        layers.forEach(layer => {
          if (layer.type === 'sky') m.setLayoutProperty(layer.id, 'visibility', 'none');
        });
      }

      if (!m.getSource('country-boundaries')) {
        m.addSource('country-boundaries', { type: 'vector', url: 'mapbox://mapbox.country-boundaries-v1' });
      }

      let labelLayerId;
      if (layers) {
        for (const layer of layers) {
          if (layer.id.includes('label')) {
            labelLayerId = layer.id;
            break;
          }
        }
      }

      if (!m.getLayer('visited-countries')) {
        m.addLayer({
          id: 'visited-countries', type: 'fill', source: 'country-boundaries', 'source-layer': 'country_boundaries',
          paint: { 'fill-color': ['match', ['get', 'iso_3166_1_alpha_3'], VISITED_COUNTRIES, 'rgba(45, 212, 191, 0.4)', 'rgba(0, 0, 0, 0)'], 'fill-opacity': 0.8 }
        }, labelLayerId); 
      }

      if (!m.getSource('my-footprints')) {
        m.addSource('my-footprints', { type: 'geojson', data: myCityFootprints as any });
      }

      if (!m.getLayer('footprint-path')) {
        m.addLayer({
          id: 'footprint-path', type: 'line', source: 'my-footprints', filter: ['==', ['get', 'type'], 'route'], 
          paint: { 'line-width': 2, 'line-color': '#0F766E', 'line-opacity': 0.8, 'line-dasharray': [2.5, 2] }
        });
      }

      if (!m.getLayer('city-dots-base')) {
        m.addLayer({
          id: 'city-dots-base',
          type: 'circle',
          source: 'my-footprints',
          filter: ['==', ['get', 'type'], 'city'],
          paint: {
            'circle-radius': 8,
            'circle-color': '#0F766E',
            'circle-opacity': 0.4
          }
        });
      }

      if (!m.getLayer('city-dots-core')) {
        m.addLayer({
          id: 'city-dots-core',
          type: 'circle',
          source: 'my-footprints',
          filter: ['==', ['get', 'type'], 'city'],
          paint: {
            'circle-radius': 5,
            'circle-color': '#ffffff',
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#0F766E'
          }
        });
      }

      // 🚀 核心修改 1：动态判定当前是手机还是电脑，分配不同的隐形触控半径
      const isMobile = window.innerWidth < 768;
      
      if (!m.getLayer('city-dots-hitbox')) {
        m.addLayer({
          id: 'city-dots-hitbox',
          type: 'circle',
          source: 'my-footprints',
          filter: ['==', ['get', 'type'], 'city'],
          paint: {
            // 手机端给 25 像素的超大点击区，电脑端给 8 像素的精准悬停区
            'circle-radius': isMobile ? 20 : 10, 
            'circle-color': '#000000', 
            'circle-opacity': 0 
          }
        });
      }

      updateMapLanguageAndCleanUp(m, localeRef.current);
    };

    map.current.on('style.load', setupCustomLayers);

    // 🚀 核心修改 2：监听浏览器窗口变化，如果用户拉伸窗口，实时调整触控区大小
    const handleResize = () => {
      if (map.current && map.current.getLayer('city-dots-hitbox')) {
        const radius = window.innerWidth < 768 ? 25 : 8;
        map.current.setPaintProperty('city-dots-hitbox', 'circle-radius', radius);
      }
    };
    window.addEventListener('resize', handleResize);

    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });
    let popupTimeout: NodeJS.Timeout | null = null; // 用于延迟关闭弹窗

    const showCityPopup = (e: any) => {
      if (!map.current || !e.features || e.features.length === 0) return;
      
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;
      const cityName = localeRef.current.includes('zh') ? properties?.name_zh : properties?.name_en;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // 如果准备关弹窗，赶紧取消（防抖操作）
      if (popupTimeout) {
        clearTimeout(popupTimeout);
        popupTimeout = null;
      }

      popup.setLngLat(coordinates as [number, number])
           .setHTML(`<div class="custom-city-popup">${cityName || 'Unknown'}</div>`)
           .addTo(map.current);
    };

    
    // 💻 电脑端：悬停触发
    map.current.on('mouseenter', 'city-dots-hitbox', (e) => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = 'pointer';
      if (window.innerWidth >= 768) showCityPopup(e);
    });

    // 💻 电脑端：移出时延迟关闭
    map.current.on('mouseleave', 'city-dots-hitbox', () => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = '';
      if (window.innerWidth >= 768) {
        // 延迟 150 毫秒再消失，防止鼠标不小心滑出范围引起弹窗闪烁
        popupTimeout = setTimeout(() => {
          popup.remove();
        }, 150);
      }
    });

    // 📱 手机端：点击显示
    map.current.on('click', 'city-dots-hitbox', (e) => {
      if (window.innerWidth < 768) showCityPopup(e);
    });

    // 📱 手机端：点击地图空白处关闭弹窗
    map.current.on('click', (e) => {
      if (window.innerWidth < 768 && map.current) {
        const features = map.current.queryRenderedFeatures(e.point, { layers: ['city-dots-hitbox'] });
        if (!features || features.length === 0) {
          popup.remove();
        }
      }
    });

    const bounds: [[number, number], [number, number]] = [[-3.7, 31.2], [139.7, 48.9]];

    const mapPadding = window.innerWidth < 768 ? 10 : 50;
    map.current.fitBounds(bounds, { padding: mapPadding, duration: 2000 });

    return () => {
      window.removeEventListener('resize', handleResize); // 清理监听器
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken]);

  useEffect(() => {
    const targetStyle = theme === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/light-v11';
    if (map.current && styleRef.current !== targetStyle) {
      styleRef.current = targetStyle;
      map.current.setStyle(targetStyle); 
    }
  }, [theme]);

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      updateMapLanguageAndCleanUp(map.current, locale);
    }
  }, [locale]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <style>{`
        .mapboxgl-map { background: transparent !important; }
        .mapboxgl-canvas { background: transparent !important; outline: none !important; }
        .mapboxgl-ctrl-bottom-left, .mapboxgl-ctrl-bottom-right { display: none !important; }

        .mapboxgl-popup { pointer-events: none !important; }

        .mapboxgl-popup-content {
          background: rgba(20, 20, 20, 0.6) !important;
          backdrop-filter: blur(10px) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px !important;
          padding: 6px 12px !important;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
        }
        .mapboxgl-popup-tip { border-top-color: rgba(20, 20, 20, 0.6) !important; }
        .custom-city-popup { color: #ffffff; font-size: 0.95rem; font-weight: 500; letter-spacing: 0.05em; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }

        /* 🚀 新增：图例的电脑端样式 (左下角垂直排布) */
        .map-legend {
          position: absolute;
          bottom: 40px;
          left: 20px;
          z-index: 10;
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 24px;
          border-radius: 16px;
          background: var(--neutral-alpha-weak);
          backdrop-filter: blur(12px);
          border: 1px solid var(--neutral-alpha-medium);
          pointer-events: none;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .legend-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
        }
        .legend-text {
          font-size: 0.95rem;
          color: var(--neutral-on-background-medium);
          font-weight: 500;
          letter-spacing: 0.02em;
          white-space: nowrap;
        }

        /* 🚀 新增：图例的手机端样式 (底部居中横向胶囊) */
        @media (max-width: 768px) {
          .map-legend {
            bottom: 16px; /* 贴近底部 */
            left: 50%;
            transform: translateX(-50%); /* 强制水平居中 */
            flex-direction: row; /* 改为横向排列 */
            padding: 10px 16px;
            border-radius: 50px; /* 圆润的胶囊形状 */
            gap: 16px; /* 缩小各项之间的间距 */
            width: max-content;
          }
          .legend-item {
            gap: 6px; /* 缩小图标和文字的间距 */
          }
          .legend-text {
            font-size: 0.75rem; /* 字体改小，显得精致 */
          }
          .legend-icon {
            transform: scale(0.85); /* 整体等比缩小图标 */
          }
        }
      `}</style>
      
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      {/* 🚀 把之前写死在 style 里的样式全部换成 className */}
      <div className="map-legend">
        
        <div className="legend-item">
          <div className="legend-icon" style={{ background: 'rgba(45, 212, 191, 0.4)', border: '1px solid rgba(45, 212, 191, 0.8)', borderRadius: '4px' }}></div>
          <span className="legend-text">
            {locale.includes('zh') ? '去过的国家' : 'Visited Countries'}
          </span>
        </div>
        
        <div className="legend-item">
          <div className="legend-icon" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(15, 118, 110, 0.4)' }}></div>
            <div style={{ position: 'absolute', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1.5px solid #0F766E' }}></div>
          </div>
          <span className="legend-text">
            {locale.includes('zh') ? '去过的城市' : 'Visited Cities'}
          </span>
        </div>

        <div className="legend-item">
          <div className="legend-icon">
            <div style={{ width: '18px', borderTop: '2.5px dashed #0F766E' }}></div>
          </div>
          <span className="legend-text">
            {locale.includes('zh') ? '飞机航线' : 'Flight Routes'}
          </span>
        </div>

      </div>
    </div>
  );
}