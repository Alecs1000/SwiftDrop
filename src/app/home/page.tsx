'use client';
import React, { useEffect, useState } from 'react';
import { Sidebar } from "../../components/Sidebar";
import { BrandCtaButton } from "../../components/BrandCtaButton";
import { ExploreCard } from '../../components/ExploreCard';
import { listProjects } from '../../lib/projectStorage';
import { MyFileCard } from '../../components/MyFileCard';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [projects, setProjects] = useState<any[]>([]);
  const router = useRouter();
  useEffect(() => {
    setProjects(listProjects());
  }, []);
  const hasRecentProjects = projects.length > 0;
  const sortedProjects = [...projects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  const recentProjects = sortedProjects.slice(0, 5);

  return (
    <div className="min-h-screen w-full">
      <Sidebar />
      <div 
        className="ml-64"
        style={{ 
          paddingTop: "24px",
          paddingLeft: "32px",
          paddingRight: "24px"
        }}
      >
        <h5 
          className="text-xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Home
        </h5>
        
        {/* Empty State Banner - 24px under the Home h5 */}
        {!hasRecentProjects ? (
          <>
            <div 
              style={{
                marginTop: "24px",
                width: "100%",
                borderRadius: "20px",
                background: "linear-gradient(90deg, var(--surface-primary) 0%, var(--surface-secondary) 100%)",
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.06)",
                padding: "40px 48px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
                minHeight: "180px",
                position: "relative",
                overflow: "hidden"
              }}
            >
              {/* Highlight Border Overlay with Ellipse Mask */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "20px",
                  border: "2px solid var(--border-invert)",
                  opacity: 0.15,
                  pointerEvents: "none",
                  zIndex: 2,
                  WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 80% 0%, #000 80%, transparent 100%)",
                  maskImage: "radial-gradient(ellipse 80% 60% at 80% 0%, #000 80%, transparent 100%)"
                }}
              />
              <div style={{ position: "relative", zIndex: 3, width: "100%" }}>
                <h2 
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "2rem",
                    fontWeight: 600,
                    marginBottom: "8px"
                  }}
                >
                  How would you like to start?
                </h2>
                <p 
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "1.15rem",
                    marginBottom: "24px"
                  }}
                >
                  Select a mockup from the library, or import your logos.
                </p>
                <BrandCtaButton icon="􀅼.svg" size="md">
                  Canvas project
                </BrandCtaButton>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                marginTop: 24,
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '24px',
                alignItems: 'start',
                paddingRight: '24px',
              }}
            >
              {recentProjects.map(project => (
                <MyFileCard
                  key={project.id}
                  id={project.id}
                  image={project.mockupId ? require('../../lib/mockups').mockups.find((m: any) => m.id === project.mockupId)?.image : ''}
                  title={project.title}
                  lastEdited={project.updatedAt ? `Edited ${new Date(project.updatedAt).toLocaleDateString()}` : ''}
                  view="grid"
                  onOpen={id => router.push(`/canvas?projectId=${id}`)}
                />
              ))}
            </div>
          </>
        )}
        {/* Always show Explore section below */}
        <h5
          className="text-xl font-semibold"
          style={{
            color: "var(--text-primary)",
            marginTop: "32px"
          }}
        >
          Explore
        </h5>
        {/* Explore Cards */}
        <div
          style={{
            width: '100%',
            marginTop: '24px',
            display: 'flex',
            flexDirection: 'row',
            gap: '24px',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
          }}
        >
          <ExploreCard
            title="Catering"
            subtitle="High quality garments."
            image="/cards assets/images/catering.png"
            alt="Catering uniforms"
            size="sm"
          />
          <ExploreCard
            title="Library"
            subtitle="Browse our full collection."
            image="/cards assets/images/Library.png"
            alt="Library collection"
            size="sm"
          />
          <ExploreCard
            title="Casual"
            subtitle="Everyday comfort and style."
            image="/cards assets/images/Casual.png"
            alt="Casual wear"
            size="sm"
          />
        </div>
      </div>
      
      {/* Primary CTA Button */}
      <div 
        className="fixed top-0 right-0"
        style={{
          paddingTop: "24px",
          paddingRight: "24px"
        }}
      >
        <BrandCtaButton icon="􀅼.svg">
          Create
        </BrandCtaButton>
      </div>
    </div>
  );
} 