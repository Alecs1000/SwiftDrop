import React, { useRef, RefObject } from 'react';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image';

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
  opacity?: number;
  blendMode?: string;
}

interface CanvasKonvaClientProps {
  placedLogos: CanvasLogo[];
  selectedLogoId: string | null;
  setSelectedLogoId: (id: string | null) => void;
  updateLogo: (id: string, updates: Partial<CanvasLogo>) => void;
  mockupKonvaImg: HTMLImageElement | undefined;
  selectedImage: string | undefined;
  mockupDrawWidth: number;
  mockupDrawHeight: number;
  padding: number;
  onExport?: RefObject<((format: 'png' | 'jpg' | 'tiff') => void) | null>;
}

function LogoImage({ logo, selectedLogoId, setSelectedLogoId, updateLogo }: { logo: CanvasLogo; selectedLogoId: string | null; setSelectedLogoId: (id: string | null) => void; updateLogo: (id: string, updates: Partial<CanvasLogo>) => void }) {
  const [img] = useImage(logo.svgDataUrl || logo.image, 'anonymous');
  return (
    <KonvaImage
      id={`logo-${logo.id}`}
      image={img}
      x={logo.x}
      y={logo.y}
      width={logo.width}
      height={logo.height}
      rotation={logo.rotation}
      scaleX={logo.flip ? -1 : 1}
      scaleY={logo.mirror ? -1 : 1}
      draggable
      opacity={logo.opacity ?? 1}
      globalCompositeOperation={logo.blendMode as any ?? 'source-over'}
      onClick={() => setSelectedLogoId(logo.id)}
      onTap={() => setSelectedLogoId(logo.id)}
      onDragEnd={e => updateLogo(logo.id, { x: e.target.x(), y: e.target.y() })}
      onTransformEnd={e => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        updateLogo(logo.id, {
          x: node.x(),
          y: node.y(),
          width: Math.max(20, node.width() * Math.abs(scaleX)),
          height: Math.max(20, node.height() * Math.abs(scaleY)),
          rotation: node.rotation(),
        });
        node.scaleX(logo.flip ? -1 : 1);
        node.scaleY(logo.mirror ? -1 : 1);
      }}
      onDblClick={() => setSelectedLogoId(logo.id)}
      stroke={selectedLogoId === logo.id ? '#df7817' : undefined}
      strokeWidth={selectedLogoId === logo.id ? 2 : 0}
      shadowForStrokeEnabled={false}
      perfectDrawEnabled={false}
    />
  );
}

const CanvasKonvaClient: React.FC<CanvasKonvaClientProps> = ({
  placedLogos,
  selectedLogoId,
  setSelectedLogoId,
  updateLogo,
  mockupKonvaImg,
  selectedImage,
  mockupDrawWidth,
  mockupDrawHeight,
  padding,
  onExport,
}) => {
  const transformerRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  // Export logic here
  const handleExport = (format: 'png' | 'jpg' | 'tiff') => {
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
  };

  // Expose export to parent
  React.useEffect(() => {
    if (onExport && typeof handleExport === 'function') {
      onExport.current = handleExport;
    }
  }, [onExport, mockupDrawWidth, mockupDrawHeight, padding, stageRef.current]);

  React.useEffect(() => {
    if (transformerRef.current && selectedLogoId) {
      const stage = stageRef.current;
      const logoNode = stage.findOne(`#logo-${selectedLogoId}`);
      if (logoNode) {
        transformerRef.current.nodes([logoNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedLogoId, placedLogos]);

  if (!selectedImage || !mockupKonvaImg) return null;

  return (
    <Stage
      ref={stageRef}
      width={mockupDrawWidth + 2 * padding}
      height={mockupDrawHeight + 2 * padding}
      style={{ background: 'transparent' }}
      onMouseDown={e => {
        // Deselect if click on empty area (stage)
        if (e.target === e.target.getStage()) {
          setSelectedLogoId(null);
        }
      }}
    >
      <Layer>
        <KonvaImage
          image={mockupKonvaImg}
          width={mockupDrawWidth}
          height={mockupDrawHeight}
          x={padding}
          y={padding}
          listening={false}
          cornerRadius={12}
        />
        {placedLogos.map(logo => (
          <LogoImage key={logo.id} logo={logo} selectedLogoId={selectedLogoId} setSelectedLogoId={setSelectedLogoId} updateLogo={updateLogo} />
        ))}
        {selectedLogoId && (
          <Transformer
            ref={transformerRef}
            rotateEnabled
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit resize to minimum size
              if (newBox.width < 20 || newBox.height < 20) {
                return oldBox;
              }
              return newBox;
            }}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default CanvasKonvaClient; 