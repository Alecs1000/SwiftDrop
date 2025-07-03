import React from "react";
import { IoHomeOutline, IoLibraryOutline, IoColorPaletteOutline } from "react-icons/io5";

const tabs = [
  { key: "home", label: "Home", Icon: IoHomeOutline },
  { key: "library", label: "Library", Icon: IoLibraryOutline },
  { key: "canvas", label: "Canvas", Icon: IoColorPaletteOutline },
];

type GlassBarProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export default function GlassBar({ activeTab, onTabChange }: GlassBarProps) {
  return (
    <nav
      className="fixed left-1/2 bottom-6 z-50 flex justify-center items-center"
      style={{
        transform: "translateX(-50%)",
        width: "min(351px, 90vw)",
        borderRadius: "52px",
        background: "rgba(255,255,255,0.7)",
        boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* Up to 640px: icons + labels, 62px high */}
      <div className="flex w-full h-[62px] sm:hidden">
        {tabs.map(({ key, label, Icon }) => (
          <div
            key={key}
            className="flex-1 flex justify-center items-center h-full relative"
            style={{ minWidth: 0 }}
          >
            {activeTab === key && (
              <div
                className="absolute"
                style={{
                  left: 8,
                  right: 8,
                  top: 4,
                  bottom: 4,
                  borderRadius: 48,
                  background: "rgba(255,255,255,0.55)",
                  zIndex: 1,
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
                }}
              />
            )}
            <button
              className="flex flex-col items-center justify-center w-full h-full relative z-10 focus:outline-none"
              aria-label={label}
              onClick={() => onTabChange(key)}
              style={{
                color: activeTab === key ? "#FF6A00" : "#A3A3A3",
                fontWeight: 500,
              }}
            >
              <Icon size={28} className={activeTab === key ? "text-[#FF6A00]" : "text-gray-400"} />
              <span
                className={`text-xs mt-1 font-medium ${
                  activeTab === key ? "text-[#FF6A00]" : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </button>
          </div>
        ))}
      </div>
      {/* Above 640px: only section names, 48px high */}
      <div className="hidden sm:flex w-full h-[48px] items-center">
        {tabs.map(({ key, label }) => (
          <div
            key={key}
            className="flex-1 flex justify-center items-center h-full relative"
            style={{ minWidth: 0 }}
          >
            {activeTab === key && (
              <div
                className="absolute"
                style={{
                  left: 8,
                  right: 8,
                  top: 4,
                  bottom: 4,
                  borderRadius: 48,
                  background: "rgba(255,255,255,0.55)",
                  zIndex: 1,
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.04)",
                }}
              />
            )}
            <button
              className="flex items-center justify-center w-full h-full relative z-10 focus:outline-none"
              aria-label={label}
              onClick={() => onTabChange(key)}
              style={{
                color: activeTab === key ? "#FF6A00" : "#A3A3A3",
                fontWeight: 500,
                fontSize: 16,
              }}
            >
              <span
                className={`text-base font-semibold ${
                  activeTab === key ? "text-[#FF6A00]" : "text-gray-500"
                }`}
              >
                {label}
              </span>
            </button>
          </div>
        ))}
      </div>
    </nav>
  );
} 