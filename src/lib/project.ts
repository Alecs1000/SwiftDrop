export interface CanvasProject {
  id: string;
  title: string;
  mockupId: string;
  variantKey?: string;
  placedLogos: any[]; // Use your CanvasLogo type
  createdAt: string;
  updatedAt: string;
} 