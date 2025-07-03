"use client";
import React, { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import { SearchBar } from "../../components/SearchBar";
import { BrandCtaButton } from "../../components/BrandCtaButton";
import DropdownButton from "../../components/DropdownButton";
import { ViewModeIconButton } from "../../components/ViewModeIconButton";
import { MyFileCard } from "../../components/MyFileCard";
import { listProjects, deleteProject, duplicateProject, renameProject } from "../../lib/projectStorage";

export default function MyFilesPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    setProjects(listProjects());
  }, []);

  function refreshProjects() {
    setProjects(listProjects());
  }

  function handleOpen(id: string) {
    window.location.href = `/canvas?projectId=${id}`;
  }

  function handleDelete(id: string) {
    deleteProject(id);
    refreshProjects();
  }

  function handleDuplicate(id: string) {
    const newProject = duplicateProject(id);
    refreshProjects();
    if (newProject) window.location.href = `/canvas?projectId=${newProject.id}`;
  }

  function handleRename(id: string) {
    const newTitle = prompt('Enter new project name:');
    if (newTitle) {
      renameProject(id, newTitle);
      refreshProjects();
    }
  }

  return (
    <div className="min-h-screen w-full" style={{ background: 'var(--background)', position: 'relative' }}>
      <Sidebar />
      {/* Top bar: Dropdown, SearchBar, Create button */}
      <div style={{ position: 'absolute', top: 24, right: 24, zIndex: 10, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ViewModeIconButton
            icon={
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.24498 5.46225C0.832156 5.46225 0.521456 5.35796 0.312873 5.14937C0.104291 4.94079 0 4.6214 0 4.1912V1.27105C0 0.845193 0.104291 0.527974 0.312873 0.319392C0.521456 0.106464 0.832156 0 1.24498 0H4.21727C4.63009 0 4.94079 0.106464 5.14937 0.319392C5.35796 0.527974 5.46225 0.845193 5.46225 1.27105V4.1912C5.46225 4.6214 5.35796 4.94079 5.14937 5.14937C4.94079 5.35796 4.63009 5.46225 4.21727 5.46225H1.24498ZM1.25801 4.54318H4.19772C4.3107 4.54318 4.39544 4.51494 4.45193 4.45845C4.51276 4.39761 4.54318 4.30635 4.54318 4.18468V1.27105C4.54318 1.15372 4.51276 1.06681 4.45193 1.01032C4.39544 0.949484 4.3107 0.919066 4.19772 0.919066H1.25801C1.14503 0.919066 1.06029 0.949484 1.0038 1.01032C0.947311 1.06681 0.919066 1.15372 0.919066 1.27105V4.18468C0.919066 4.30635 0.947311 4.39761 1.0038 4.45845C1.06029 4.51494 1.14503 4.54318 1.25801 4.54318ZM7.78924 5.46225C7.37208 5.46225 7.05921 5.35796 6.85062 5.14937C6.64204 4.94079 6.53775 4.6214 6.53775 4.1912V1.27105C6.53775 0.845193 6.64204 0.527974 6.85062 0.319392C7.05921 0.106464 7.37208 0 7.78924 0H10.755C11.1678 0 11.4785 0.106464 11.6871 0.319392C11.8957 0.527974 12 0.845193 12 1.27105V4.1912C12 4.6214 11.8957 4.94079 11.6871 5.14937C11.4785 5.35796 11.1678 5.46225 10.755 5.46225H7.78924ZM7.80228 4.54318H10.742C10.8593 4.54318 10.9441 4.51494 10.9962 4.45845C11.0527 4.39761 11.0809 4.30635 11.0809 4.18468V1.27105C11.0809 1.15372 11.0527 1.06681 10.9962 1.01032C10.9441 0.949484 10.8593 0.919066 10.742 0.919066H7.80228C7.68495 0.919066 7.59804 0.949484 7.54155 1.01032C7.48506 1.06681 7.45682 1.15372 7.45682 1.27105V4.18468C7.45682 4.30635 7.48506 4.39761 7.54155 4.45845C7.59804 4.51494 7.68495 4.54318 7.80228 4.54318ZM1.24498 12C0.832156 12 0.521456 11.8957 0.312873 11.6871C0.104291 11.4785 0 11.1592 0 10.729V7.81532C0 7.38512 0.104291 7.06573 0.312873 6.85714C0.521456 6.64856 0.832156 6.54427 1.24498 6.54427H4.21727C4.63009 6.54427 4.94079 6.64856 5.14937 6.85714C5.35796 7.06573 5.46225 7.38512 5.46225 7.81532V10.729C5.46225 11.1592 5.35796 11.4785 5.14937 11.6871C4.94079 11.8957 4.63009 12 4.21727 12H1.24498ZM1.25801 11.0809H4.19772C4.3107 11.0809 4.39544 11.0527 4.45193 10.9962C4.51276 10.9397 4.54318 10.8528 4.54318 10.7355V7.81532C4.54318 7.69799 4.51276 7.61108 4.45193 7.55459C4.39544 7.49375 4.3107 7.46334 4.19772 7.46334H1.25801C1.14503 7.46334 1.06029 7.49375 1.0038 7.55459C0.947311 7.61108 0.919066 7.69799 0.919066 7.81532V10.7355C0.919066 10.8528 0.947311 10.9397 1.0038 10.9962C1.06029 11.0527 1.14503 11.0809 1.25801 11.0809ZM7.78924 12C7.37208 12 7.05921 11.8957 6.85062 11.6871C6.64204 11.4785 6.53775 11.1592 6.53775 10.729V7.81532C6.53775 7.38512 6.64204 7.06573 6.85062 6.85714C7.05921 6.64856 7.37208 6.54427 7.78924 6.54427H10.755C11.1678 6.54427 11.4785 6.64856 11.6871 6.85714C11.8957 7.06573 12 7.38512 12 7.81532V10.729C12 11.1592 11.8957 11.4785 11.6871 11.6871C11.4785 11.8957 11.1678 12 10.755 12H7.78924ZM7.80228 11.0809H10.742C10.8593 11.0809 10.9441 11.0527 10.9962 10.9962C11.0527 10.9397 11.0809 10.8528 11.0809 10.7355V7.81532C11.0809 7.69799 11.0527 7.61108 10.9962 7.55459C10.9441 7.49375 10.8593 7.46334 10.742 7.46334H7.80228C7.68495 7.46334 7.59804 7.49375 7.54155 7.55459C7.48506 7.61108 7.45682 7.69799 7.45682 7.81532V10.7355C7.45682 10.8528 7.48506 10.9397 7.54155 10.9962C7.59804 11.0527 7.68495 11.0809 7.80228 11.0809Z" fill="var(--icon-secondary)"/>
              </svg>
            }
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          />
          <ViewModeIconButton
            icon={
              <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.750372 1.55236C0.543921 1.55236 0.367246 1.47844 0.220347 1.3306C0.0734491 1.17864 0 0.99384 0 0.776181C0 0.562628 0.0734491 0.379877 0.220347 0.227926C0.367246 0.0759754 0.543921 0 0.750372 0C0.956824 0 1.1335 0.0759754 1.2804 0.227926C1.4273 0.379877 1.50074 0.562628 1.50074 0.776181C1.50074 0.99384 1.4273 1.17864 1.2804 1.3306C1.1335 1.47844 0.956824 1.55236 0.750372 1.55236ZM3.38263 1.27515C3.24764 1.27515 3.13251 1.22793 3.03722 1.13347C2.94591 1.03491 2.90025 0.915811 2.90025 0.776181C2.90025 0.63655 2.94591 0.519507 3.03722 0.425051C3.13251 0.330595 3.24764 0.283368 3.38263 0.283368H11.5117C11.6467 0.283368 11.7618 0.330595 11.8571 0.425051C11.9524 0.519507 12 0.63655 12 0.776181C12 0.915811 11.9524 1.03491 11.8571 1.13347C11.7618 1.22793 11.6467 1.27515 11.5117 1.27515H3.38263ZM0.750372 5.27926C0.543921 5.27926 0.367246 5.20329 0.220347 5.05133C0.0734491 4.89938 0 4.71663 0 4.50308C0 4.28953 0.0734491 4.10678 0.220347 3.95483C0.367246 3.80287 0.543921 3.7269 0.750372 3.7269C0.956824 3.7269 1.1335 3.80287 1.2804 3.95483C1.4273 4.10678 1.50074 4.28953 1.50074 4.50308C1.50074 4.71663 1.4273 4.89938 1.2804 5.05133C1.1335 5.20329 0.956824 5.27926 0.750372 5.27926ZM3.38263 4.99589C3.24764 4.99589 3.13251 4.94867 3.03722 4.85421C2.94591 4.75975 2.90025 4.64271 2.90025 4.50308C2.90025 4.36345 2.94591 4.24641 3.03722 4.15195C3.13251 4.05339 3.24764 4.00411 3.38263 4.00411H11.5117C11.6467 4.00411 11.7618 4.05339 11.8571 4.15195C11.9524 4.24641 12 4.36345 12 4.50308C12 4.64271 11.9524 4.75975 11.8571 4.85421C11.7618 4.94867 11.6467 4.99589 11.5117 4.99589H3.38263ZM0.750372 9C0.543921 9 0.367246 8.92608 0.220347 8.77823C0.0734491 8.62628 0 8.44148 0 8.22382C0 8.01027 0.0734491 7.82957 0.220347 7.68172C0.367246 7.52977 0.543921 7.4538 0.750372 7.4538C0.956824 7.4538 1.1335 7.52977 1.2804 7.68172C1.4273 7.82957 1.50074 8.01027 1.50074 8.22382C1.50074 8.44148 1.4273 8.62628 1.2804 8.77823C1.1335 8.92608 0.956824 9 0.750372 9ZM3.38263 8.72279C3.24764 8.72279 3.13251 8.67556 3.03722 8.58111C2.94591 8.48255 2.90025 8.36345 2.90025 8.22382C2.90025 8.08419 2.94591 7.96715 3.03722 7.87269C3.13251 7.77823 3.24764 7.73101 3.38263 7.73101H11.5117C11.6467 7.73101 11.7618 7.77823 11.8571 7.87269C11.9524 7.96715 12 8.08419 12 8.22382C12 8.36345 11.9524 8.48255 11.8571 8.58111C11.7618 8.67556 11.6467 8.72279 11.5117 8.72279H3.38263Z" fill="var(--icon-secondary)"/>
              </svg>
            }
            active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          />
        </div>
        <DropdownButton label="Last modified" options={["Last modified", "Name", "Created"]} />
        <SearchBar value={search} onChange={e => setSearch(e.target.value)} />
        <BrandCtaButton icon="􀅼.svg" size="md">Create</BrandCtaButton>
      </div>
      <div
        className="ml-64"
        style={{
          paddingTop: '24px',
          paddingLeft: '32px',
        }}
      >
        <h5
          className="text-xl font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          My Files
        </h5>
        {/* Future my files content goes here */}
        {projects.length > 0 ? (
          viewMode === 'grid' ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '24px',
                marginTop: '32px',
                alignItems: 'start',
                width: '100%',
                paddingRight: '24px',
              }}
            >
              {projects.map((project, idx) => (
                <MyFileCard
                  key={project.id}
                  id={project.id}
                  image={project.mockupId ? require('../../lib/mockups').mockups.find((m: any) => m.id === project.mockupId)?.image : ''}
                  title={project.title}
                  lastEdited={project.updatedAt ? `Edited ${new Date(project.updatedAt).toLocaleDateString()}` : ''}
                  view="grid"
                  onOpen={handleOpen}
                  onRename={handleRename}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginTop: '32px',
                alignItems: 'stretch',
                maxWidth: '45vw',
                marginLeft: 0,
                paddingRight: '24px',
              }}
            >
              {projects.map((project, idx) => (
                <MyFileCard
                  key={project.id}
                  id={project.id}
                  image={project.mockupId ? require('../../lib/mockups').mockups.find((m: any) => m.id === project.mockupId)?.image : ''}
                  title={project.title}
                  lastEdited={project.updatedAt ? `Edited ${new Date(project.updatedAt).toLocaleDateString()}` : ''}
                  view="list"
                  onOpen={handleOpen}
                  onRename={handleRename}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )
        ) : (
          <div 
            style={{
              marginTop: '32px',
              width: '100%',
              borderRadius: '20px',
              background: 'linear-gradient(90deg, var(--surface-primary) 0%, var(--surface-secondary) 100%)',
              boxShadow: '0 2px 12px 0 rgba(0,0,0,0.06)',
              padding: '40px 48px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
              minHeight: '180px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Highlight Border Overlay with Ellipse Mask */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '20px',
                border: '2px solid var(--border-invert)',
                opacity: 0.15,
                pointerEvents: 'none',
                zIndex: 2,
                WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 80% 0%, #000 80%, transparent 100%)',
                maskImage: 'radial-gradient(ellipse 80% 60% at 80% 0%, #000 80%, transparent 100%)'
              }}
            />
            <div style={{ position: 'relative', zIndex: 3, width: '100%' }}>
              <h2 
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '2rem',
                  fontWeight: 600,
                  marginBottom: '8px'
                }}
              >
                How would you like to start?
              </h2>
              <p 
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '1.15rem',
                  marginBottom: '24px'
                }}
              >
                Select a mockup from the library, or import your logos.
              </p>
              <BrandCtaButton icon="􀅼.svg" size="md">
                Canvas project
              </BrandCtaButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 