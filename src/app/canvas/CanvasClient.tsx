"use client";
import React, { useState, useEffect, useRef } from "react";
import { LEAD_BLACK, LEAD_BLACK_10, LEAD_BLACK_50, OFFWHITE, HARB_ORANGE } from "../../lib/colors";
import { useSearchParams, useRouter } from "next/navigation";
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';
import { mockups, MockupVariant } from "../../lib/mockups";
import { v4 as uuidv4 } from 'uuid';
import CanvasSidebar from '../../components/CanvasSidebar';
import LeftSidebar from '../../components/LeftSidebar';
import { BrandCtaButton } from '../../components/BrandCtaButton';
import { loadProject, saveProject } from '../../lib/projectStorage';
import { CanvasProject } from '../../lib/project';
import dynamic from 'next/dynamic';

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

// Custom hook to load all logo images for placedLogos
function useLogoImages(placedLogos: { image: string }[]) {
  const [images, setImages] = useState<(HTMLImageElement | undefined)[]>([]);
  useEffect(() => {
    let isMounted = true;
    Promise.all(
      placedLogos.map(
        logo =>
          new Promise<HTMLImageElement | undefined>(resolve => {
            const img = new window.Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => resolve(undefined);
            img.src = logo.image;
          })
      )
    ).then(loadedImages => {
      if (isMounted) setImages(loadedImages);
    });
    return () => {
      isMounted = false;
    };
  }, [placedLogos.map(l => l.image).join(",")]);
  return images;
}

// Utility: fetch SVG and extract first fill color
async function extractSvgMainColor(svgUrl: string): Promise<string | undefined> {
  try {
    const res = await fetch(svgUrl);
    const text = await res.text();
    const match = text.match(/fill=["'](#(?:[0-9a-fA-F]{3}){1,2})["']/);
    if (match) return match[1];
  } catch {}
  return undefined;
}

// Utility: replace all fill colors in SVG with a new color
function replaceSvgFill(svgText: string, newColor: string): string {
  return svgText.replace(/fill=["']#(?:[0-9a-fA-F]{3}){1,2}["']/g, `fill=\"${newColor}\"`);
}

function isSvg(url: string) {
  return url.toLowerCase().endsWith('.svg');
}

function svgToDataUrl(svg: string) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

const CanvasKonvaClient = dynamic(() => import('./CanvasKonvaClient'), { ssr: false });

export default function CanvasClient() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const mockupId = searchParams.get("id");
  const router = useRouter();
  // State for project
  const [project, setProject] = useState<CanvasProject | null>(null);
  // Track selected variant (by key or index)
  const [selectedVariantKey, setSelectedVariantKey] = useState<string | null>(null);
  // Canvas state
  const [placedLogos, setPlacedLogos] = useState<any[]>([]);
  const [selectedLogoId, setSelectedLogoId] = useState<string | null>(null);
  // Hydrate from project if projectId is present
  useEffect(() => {
    if (projectId) {
      const loaded = loadProject(projectId);
      if (loaded) {
        setProject(loaded);
        setPlacedLogos(loaded.placedLogos || []);
        setSelectedVariantKey(loaded.variantKey || null);
      }
    }
  }, [projectId]);
  // Determine mockup from project or id
  let mockup = null;
  if (project && project.mockupId) {
    mockup = mockups.find(m => m.id === project.mockupId);
  } else if (mockupId) {
    mockup = mockups.find(m => m.id === mockupId);
  }
  let selectedImage = mockup?.image;
  let currentVariant = null;
  if (mockup && Array.isArray(mockup.variants) && mockup.variants.length > 1 && selectedVariantKey) {
    currentVariant = mockup.variants.find((v: any) => v.key === selectedVariantKey);
    if (currentVariant) selectedImage = currentVariant.image;
  }
  const [mockupNaturalSize, setMockupNaturalSize] = useState<{ width: number; height: number } | null>(null);
  const [mockupKonvaImg] = useImage(selectedImage || '', 'anonymous');

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

  // Responsive maxStage based on available space
  const [maxStage, setMaxStage] = useState(720);
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
      // Wide
      mockupDrawWidth = maxStage;
      mockupDrawHeight = maxStage / ratio;
    } else {
      // Tall or square
      mockupDrawHeight = maxStage;
      mockupDrawWidth = maxStage * ratio;
    }
    stageWidth = mockupDrawWidth;
    stageHeight = mockupDrawHeight;
  }

  // Add padding to the Stage and position the image inside
  const paddedStageWidth = stageWidth + 2 * padding;
  const paddedStageHeight = stageHeight + 2 * padding;

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

  async function handleLogoSelect(logoUrl: string) {
    if (placedLogos.some(l => l.image === logoUrl)) return;
    // Load image to get natural size
    let naturalWidth = 120;
    let naturalHeight = 120;
    if (isSvg(logoUrl)) {
      const res = await fetch(logoUrl);
      const svgText = await res.text();
      // Try to extract width/height from SVG attributes
      const widthMatch = svgText.match(/width=["'](\d+(?:\.\d+)?)/);
      const heightMatch = svgText.match(/height=["'](\d+(?:\.\d+)?)/);
      if (widthMatch && heightMatch) {
        naturalWidth = parseFloat(widthMatch[1]);
        naturalHeight = parseFloat(heightMatch[1]);
      }
      // Fallback: use viewBox if available
      const viewBoxMatch = svgText.match(/viewBox=["']\d+ \d+ (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)/);
      if (!widthMatch && !heightMatch && viewBoxMatch) {
        naturalWidth = parseFloat(viewBoxMatch[1]);
        naturalHeight = parseFloat(viewBoxMatch[2]);
      }
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
      const mainColor = extractSvgMainColorFromText(svgText) || '#000000';
      const svgDataUrl = svgToDataUrl(svgText);
      const newLogo: CanvasLogo & { mainColor?: string; svgText?: string; svgDataUrl?: string } = {
        id: uuidv4(),
        image: logoUrl,
        x: (stageWidth / 2) - (width / 2) + padding,
        y: (stageHeight / 2) - (height / 2) + padding,
        width,
        height,
        rotation: 0,
        flip: false,
        mirror: false,
        mainColor,
        svgText,
        svgDataUrl,
        opacity: 1,
        blendMode: 'source-over',
      };
      setPlacedLogos(prev => [...prev, newLogo]);
      setSelectedLogoId(newLogo.id);
      return;
    } else {
      // Raster image: load to get natural size
      await new Promise<void>(resolve => {
        const img = new window.Image();
        img.onload = () => {
          naturalWidth = img.naturalWidth;
          naturalHeight = img.naturalHeight;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = logoUrl;
      });
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
      const newLogo: CanvasLogo = {
        id: uuidv4(),
        image: logoUrl,
        x: (stageWidth / 2) - (width / 2) + padding,
        y: (stageHeight / 2) - (height / 2) + padding,
        width,
        height,
        rotation: 0,
        flip: false,
        mirror: false,
        opacity: 1,
        blendMode: 'source-over',
      };
      setPlacedLogos(prev => [...prev, newLogo]);
      setSelectedLogoId(newLogo.id);
    }
  }

  function extractSvgMainColorFromText(svgText: string): string | undefined {
    const match = svgText.match(/fill=["'](#(?:[0-9a-fA-F]{3}){1,2})["']/);
    if (match) return match[1];
    return undefined;
  }

  function handleRemoveLogo(logoUrl: string) {
    setPlacedLogos(prev => prev.filter(l => l.image !== logoUrl));
    if (selectedLogoId && placedLogos.find(l => l.image === logoUrl)?.id === selectedLogoId) {
      setSelectedLogoId(null);
    }
  }

  function updateLogo(id: string, updates: Partial<any>) {
    setPlacedLogos((prev: any[]) => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  }

  // For rendering in sidebar, pass image URLs
  const placedLogoUrls = placedLogos.map(l => l.image);

  function handleExport(format: 'png' | 'jpg' | 'tiff') {
    if (!stageRef.current) return;
    let mimeType = 'image/png';
    let ext = 'png';
    if (format === 'jpg') { mimeType = 'image/jpeg'; ext = 'jpg'; }
    if (format === 'tiff') { mimeType = 'image/tiff'; ext = 'tiff'; }
    // Export only the mockup area (crop out the padding)
    const dataURL = stageRef.current.toDataURL({
      mimeType,
      pixelRatio: 2,
      x: padding,
      y: padding,
      width: mockupDrawWidth,
      height: mockupDrawHeight,
    });
    const link = document.createElement('a');
    link.download = `canvas-export.${ext}`;
    link.href = dataURL;
    link.click();
  }

  // Autosave project (debounced)
  useEffect(() => {
    if (!projectId || !mockup) return;
    const timeout = setTimeout(() => {
      const updated: CanvasProject = {
        id: projectId,
        title: project?.title || mockup.title || 'Untitled Project',
        mockupId: mockup.id,
        variantKey: selectedVariantKey || undefined,
        placedLogos,
        createdAt: project?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveProject(updated);
      setProject(updated);
    }, 600);
    return () => clearTimeout(timeout);
  }, [projectId, mockup, selectedVariantKey, placedLogos]);

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
        padding: '',
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
      {/* Left Sidebar */}
      <LeftSidebar
        onLogoSelect={handleLogoSelect}
        placedLogos={placedLogoUrls}
        onRemoveLogo={handleRemoveLogo}
        projectTitle={project?.title || mockup?.title || 'Untitled project'}
        onProjectTitleChange={(title: string) => {
          if (!project) return;
          const updated = { ...project, title, updatedAt: new Date().toISOString() };
          setProject(updated);
          saveProject(updated);
        }}
      />
      {/* Centered Canvas (client-only) */}
      {selectedImage && mockupKonvaImg ? (
        <CanvasKonvaClient
          placedLogos={placedLogos}
          selectedLogoId={selectedLogoId}
          setSelectedLogoId={setSelectedLogoId}
          updateLogo={updateLogo}
          mockupKonvaImg={mockupKonvaImg}
          selectedImage={selectedImage}
          mockupDrawWidth={mockupDrawWidth}
          mockupDrawHeight={mockupDrawHeight}
          padding={padding}
        />
      ) : null}
      {/* Add the improved sidebar component */}
      <CanvasSidebar
        width={selectedLogoId ? placedLogos.find((l: any) => l.id === selectedLogoId)?.width : undefined}
        height={selectedLogoId ? placedLogos.find((l: any) => l.id === selectedLogoId)?.height : undefined}
        rotation={selectedLogoId ? placedLogos.find((l: any) => l.id === selectedLogoId)?.rotation : undefined}
        mainColor={selectedLogoId ? placedLogos.find((l: any) => l.id === selectedLogoId)?.mainColor : undefined}
        onChangeWidth={w => {
          if (selectedLogoId) updateLogo(selectedLogoId, { width: w });
        }}
        onChangeHeight={h => {
          if (selectedLogoId) updateLogo(selectedLogoId, { height: h });
        }}
        onChangeRotation={r => {
          if (selectedLogoId) updateLogo(selectedLogoId, { rotation: r });
        }}
        onMirrorVertical={() => {
          if (selectedLogoId) {
            const logo = placedLogos.find((l: any) => l.id === selectedLogoId);
            if (logo) updateLogo(selectedLogoId, { mirror: !logo.mirror });
          }
        }}
        onMirrorHorizontal={() => {
          if (selectedLogoId) {
            const logo = placedLogos.find((l: any) => l.id === selectedLogoId);
            if (logo) updateLogo(selectedLogoId, { flip: !logo.flip });
          }
        }}
        onChangeMainColor={color => {
          if (selectedLogoId) {
            const logo = placedLogos.find((l: any) => l.id === selectedLogoId);
            if (logo && logo.svgText) {
              // Update svgText and svgDataUrl with new color
              const newSvgText = replaceSvgFill(logo.svgText, color);
              const newSvgDataUrl = svgToDataUrl(newSvgText);
              updateLogo(selectedLogoId, { mainColor: color, svgText: newSvgText, svgDataUrl: newSvgDataUrl });
              // Deselect and reselect to force Transformer to reattach
              setSelectedLogoId(null);
              setTimeout(() => setSelectedLogoId(selectedLogoId), 0);
            } else {
              updateLogo(selectedLogoId, { mainColor: color });
            }
          }
        }}
        opacity={selectedLogoId ? placedLogos.find((l: any) => l.id === selectedLogoId)?.opacity : 1}
        blendMode={selectedLogoId ? placedLogos.find((l: any) => l.id === selectedLogoId)?.blendMode : 'normal'}
        onChangeOpacity={opacity => {
          if (selectedLogoId) updateLogo(selectedLogoId, { opacity });
        }}
        onChangeBlendMode={mode => {
          // Map UI mode to Konva globalCompositeOperation
          let gco = 'source-over';
          if (mode === 'multiply') gco = 'multiply';
          else if (mode === 'overlay') gco = 'overlay';
          else if (mode === 'normal') gco = 'source-over';
          if (selectedLogoId) updateLogo(selectedLogoId, { blendMode: gco });
        }}
        onExport={handleExport}
        mockup={mockup}
        onSelectVariant={variant => {
          setSelectedVariantKey(variant.key);
        }}
      />
    </div>
  );
} 