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
            'circle-radius': 8, // 底层光晕大一点
            'circle-color': '#0F766E',
            'circle-opacity': 0.4 // 半透明
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
            'circle-radius': 5, // 核心小一点
            'circle-color': '#ffffff', // 纯白内芯
            'circle-stroke-width': 1.5, // 加上一圈细细的描边更精致
            'circle-stroke-color': '#0F766E'
          }
        });
      }

      updateMapLanguageAndCleanUp(m, localeRef.current);
    };

    map.current.on('style.load', setupCustomLayers);

    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });

    // 监听鼠标移动到核心圆点图层上
    map.current.on('mouseenter', 'city-dots-core', (e) => {
      if (!map.current || !e.features || e.features.length === 0) return;
      map.current.getCanvas().style.cursor = 'pointer';

      const coordinates = (e.features[0].geometry as any).coordinates.slice();
      const properties = e.features[0].properties;
      const cityName = localeRef.current.includes('zh') ? properties?.name_zh : properties?.name_en;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup.setLngLat(coordinates as [number, number]).setHTML(`<div class="custom-city-popup">${cityName || 'Unknown'}</div>`).addTo(map.current);
    });

    // 监听鼠标移出核心圆点
    map.current.on('mouseleave', 'city-dots-core', () => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = '';
      popup.remove();
    });

    const bounds: [[number, number], [number, number]] = [[-3.7, 31.2], [139.7, 48.9]];
    map.current.fitBounds(bounds, { padding: 50, duration: 2000 });

    return () => {
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
      `}</style>
      
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />

      <div style={{ position: 'absolute', bottom: '40px', left: '20px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', borderRadius: '16px', background: 'var(--neutral-alpha-weak)', backdropFilter: 'blur(12px)', border: '1px solid var(--neutral-alpha-medium)', pointerEvents: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '18px', height: '18px', background: 'rgba(45, 212, 191, 0.4)', border: '1px solid rgba(45, 212, 191, 0.8)', borderRadius: '4px' }}></div>
          <span style={{ fontSize: '0.95rem', color: 'var(--neutral-on-background-medium)', fontWeight: 500, letterSpacing: '0.02em' }}>
            {locale.includes('zh') ? '去过的国家' : 'Visited Countries'}
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* 底层透明光晕 */}
            <div style={{ position: 'absolute', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'rgba(15, 118, 110, 0.4)' }}></div>
            {/* 顶层实心带描边圆点 */}
            <div style={{ position: 'absolute', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffffff', border: '1.5px solid #0F766E' }}></div>
          </div>
          <span style={{ fontSize: '0.95rem', color: 'var(--neutral-on-background-medium)', fontWeight: 500, letterSpacing: '0.02em' }}>
            {locale.includes('zh') ? '去过的城市' : 'Visited Cities'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '18px', height: '0px', borderTop: '2.5px dashed #0F766E' }}></div>
          <span style={{ fontSize: '0.95rem', color: 'var(--neutral-on-background-medium)', fontWeight: 500, letterSpacing: '0.02em' }}>
            {locale.includes('zh') ? '飞机航线' : 'Flight Routes'}
          </span>
        </div>
      </div>
    </div>
  );
}