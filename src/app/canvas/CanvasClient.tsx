"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useImage from 'use-image';
import { v4 as uuidv4 } from 'uuid';
import CanvasSidebar from '../../components/CanvasSidebar';
import LeftSidebar from '../../components/LeftSidebar';
import { BrandCtaButton } from '../../components/BrandCtaButton';
import { loadProject, saveProject } from '../../lib/projectStorage';
import { CanvasProject } from '../../lib/project';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabaseClient';

// Logo instance type
interface CanvasLogo {
  id: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  flip: boolean;
  mirror: boolean;
  mainColor?: string;
  svgText?: string;
  svgDataUrl?: string;
  opacity?: number; // 0-1
  blendMode?: string; // e.g. 'source-over', 'multiply', 'overlay'
}

function isSvg(url: string) {
  return url.toLowerCase().endsWith('.svg');
}

function svgToDataUrl(svg: string) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const CanvasKonvaClient = dynamic(() => import('../../components/CanvasKonvaClient'), { ssr: false });

export default function CanvasClient() {
  const searchParams = useSearchParams();
  const mockupId = searchParams.get("id");
  const router = useRouter();
  const [mockup, setMockup] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mockupKonvaImg] = useImage(selectedImage || '', 'anonymous');
  const [mockupNaturalSize, setMockupNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [maxStage, setMaxStage] = useState(720);
  const [placedLogos, setPlacedLogos] = useState<any[]>([]);
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);
  const exportRef = useRef<((format: 'png' | 'jpg' | 'tiff') => void) | null>(null);

  // Fetch mockup from Supabase
  useEffect(() => {
    if (!mockupId) return;
    const fetchMockup = async () => {
      const { data, error } = await supabase.from('mockups').select('*').eq('id', mockupId).single();
      if (data) {
        setMockup(data);
        const { data: urlData } = supabase.storage.from('mockups').getPublicUrl(data.image_path);
        setSelectedImage(urlData.publicUrl);
      }
      if (error) console.error('Supabase fetch error:', error);
    };
    fetchMockup();
  }, [mockupId]);

  // When the mockup image loads, set its natural size
  useEffect(() => {
    if (selectedImage) {
      const img = new window.Image();
      img.onload = () => {
        setMockupNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = selectedImage;
    } else {
      setMockupNaturalSize(null);
    }
  }, [selectedImage]);

  useEffect(() => {
    function handleResize() {
      const padding = 48;
      const sidebarWidth = 320;
      const availableWidth = window.innerWidth - sidebarWidth - 2 * padding;
      const availableHeight = window.innerHeight - 2 * padding;
      const widthStage = availableWidth * 0.9;
      const heightStage = availableHeight * 0.9;
      const calculated = Math.max(480, Math.min(1024, widthStage, heightStage));
      setMaxStage(calculated);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const padding = 48;
  let stageWidth = maxStage;
  let stageHeight = maxStage;
  let mockupDrawWidth = maxStage;
  let mockupDrawHeight = maxStage;
  if (mockupNaturalSize) {
    const ratio = mockupNaturalSize.width / mockupNaturalSize.height;
    if (ratio > 1) {
      mockupDrawWidth = maxStage;
      mockupDrawHeight = maxStage / ratio;
    } else {
      mockupDrawHeight = maxStage;
      mockupDrawWidth = maxStage * ratio;
    }
    stageWidth = mockupDrawWidth;
    stageHeight = mockupDrawHeight;
  }

  // Prevent scroll on this page
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, []);

  // Utility: replace all fill colors in SVG with a new color
  function replaceSvgFill(svgText: string, newColor: string): string {
    return svgText.replace(/fill=["']#(?:[0-9a-fA-F]{3}){1,2}["']/g, `fill=\"${newColor}\"`);
  }

  // Add logo to canvas when selected from sidebar
  function handleLogoSelect(logoUrl: string, logoMeta?: { name?: string; id?: string }) {
    if (placedLogos.some(l => l.image === logoUrl)) return;
    // Load image to get natural size
    let naturalWidth = 120;
    let naturalHeight = 120;
    const img = new window.Image();
    img.onload = () => {
      naturalWidth = img.naturalWidth;
      naturalHeight = img.naturalHeight;
      // Aspect ratio fit
      const maxDim = 120;
      let width = naturalWidth;
      let height = naturalHeight;
      if (width > height) {
        if (width > maxDim) {
          height = height * (maxDim / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = width * (maxDim / height);
          height = maxDim;
        }
      }
      const newLogo = {
        id: logoMeta?.id,
        name: logoMeta?.name,
        image: logoUrl,
        x: (mockupDrawWidth / 2) - (width / 2) + padding,
        y: (mockupDrawHeight / 2) - (height / 2) + padding,
        width,
        height,
        rotation: 0,
        flip: false,
        mirror: false,
        opacity: 1,
        blendMode: 'source-over',
      };
      setPlacedLogos(prev => [...prev, newLogo]);
      setSelectedLogoId(newLogo.id || newLogo.image);
    };
    img.onerror = () => {};
    img.src = logoUrl;
  }

  function handleRemoveLogo(logoIdOrUrl: string, logoUrl?: string) {
    setPlacedLogos(prev => prev.filter(l => {
      if (logoIdOrUrl && l.id) return l.id !== logoIdOrUrl;
      if (logoUrl) return l.image !== logoUrl;
      return true;
    }));
  }

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        background: 'var(--surface-brand-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        overflow: 'hidden',
        minHeight: 0,
        position: 'relative',
      }}
    >
      {/* If no mockup is selected, show a centered CTA button */}
      {!mockup && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}>
          <BrandCtaButton size="lg" onClick={() => router.push('/library')}>
            Choose a Mockup
          </BrandCtaButton>
        </div>
      )}
      <LeftSidebar
        onLogoSelect={handleLogoSelect}
        placedLogos={placedLogos}
        onRemoveLogo={handleRemoveLogo}
        projectTitle={mockup?.name || 'Untitled project'}
        onProjectTitleChange={() => {}}
      />
      {/* Main canvas area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', minWidth: 0, marginLeft: 32, marginRight: 32 }}>
        {selectedImage && mockupKonvaImg ? (
          <>
            <CanvasKonvaClient
              placedLogos={placedLogos}
              selectedLogoId={selectedLogoId}
              setSelectedLogoId={setSelectedLogoId}
              updateLogo={() => {}}
              mockupKonvaImg={mockupKonvaImg}
              selectedImage={selectedImage}
              mockupDrawWidth={mockupDrawWidth}
              mockupDrawHeight={mockupDrawHeight}
              padding={padding}
              onExport={exportRef}
            />
          </>
        ) : null}
      </div>
      {/* Right sidebar */}
      <div style={{ width: 320, flexShrink: 0, background: 'transparent', position: 'relative', zIndex: 100 }}>
        <CanvasSidebar
          width={selectedLogoId ? placedLogos.find((l: any) => l.id === selectedLogoId)?.width : undefined}
          height={selectedLogoId ? placedLogos.find((l: any) => l.id === selectedLogoId)?.height : undefined}
          rotation={selectedLogoId ? placedLogos.find((l: any) => l.id === selectedLogoId)?.rotation : undefined}
          mainColor={selectedLogoId ? placedLogos.find((l: any) => l.id === selectedLogoId)?.mainColor : undefined}
          onChangeWidth={w => {
            if (selectedLogoId) setPlacedLogos((prev: any[]) => prev.map(l => l.id === selectedLogoId ? { ...l, width: w } : l));
          }}
          onChangeHeight={h => {
            if (selectedLogoId) setPlacedLogos((prev: any[]) => prev.map(l => l.id === selectedLogoId ? { ...l, height: h } : l));
          }}
          onChangeRotation={r => {
            if (selectedLogoId) setPlacedLogos((prev: any[]) => prev.map(l => l.id === selectedLogoId ? { ...l, rotation: r } : l));
          }}
          onMirrorVertical={() => {
            if (selectedLogoId) setPlacedLogos((prev: any[]) => prev.map(l => l.id === selectedLogoId ? { ...l, mirror: !l.mirror } : l));
          }}
          onMirrorHorizontal={() => {
            if (selectedLogoId) setPlacedLogos((prev: any[]) => prev.map(l => l.id === selectedLogoId ? { ...l, flip: !l.flip } : l));
          }}
          onChangeMainColor={color => {
            if (selectedLogoId) setPlacedLogos((prev: any[]) => prev.map(l => l.id === selectedLogoId ? { ...l, mainColor: color } : l));
          }}
          onExport={format => exportRef.current?.(format)}
          opacity={selectedLogoId ? placedLogos.find((l: any) => l.id === selectedLogoId)?.opacity : 1}
          blendMode={selectedLogoId ? placedLogos.find((l: any) => l.id === selectedLogoId)?.blendMode : undefined}
          onChangeOpacity={opacity => {
            if (selectedLogoId) setPlacedLogos((prev: any[]) => prev.map(l => l.id === selectedLogoId ? { ...l, opacity } : l));
          }}
          onChangeBlendMode={mode => {
            if (selectedLogoId) setPlacedLogos((prev: any[]) => prev.map(l => l.id === selectedLogoId ? { ...l, blendMode: mode } : l));
          }}
        />
      </div>
    </div>
  );
} 