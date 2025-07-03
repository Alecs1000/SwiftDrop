import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { LEAD_BLACK, LEAD_BLACK_10, HARB_ORANGE, OFFWHITE } from "../lib/colors";

const tabs = [
  { key: "home", label: "Home", path: "/home" },
  { key: "library", label: "Library", path: "/library" },
  { key: "canvas", label: "Canvas", path: "/canvas" },
];

const PILL_WIDTH = 351;
const PILL_HEIGHT = 48;
const INNER_PILL_RADIUS = 40;
const PILL_PADDING = 4;

export default function DebugBanner() {
  const router = useRouter();
  const pathname = usePathname();
  // Set active tab based on current path
  const activeTab = tabs.find(tab => pathname.startsWith(tab.path))?.key || "home";
  const tabIndex = tabs.findIndex((t) => t.key === activeTab);
  const tabCount = tabs.length;
  const tabWidth = (PILL_WIDTH - 2 * PILL_PADDING) / tabCount;
  const innerPillWidth = tabWidth - 2 * PILL_PADDING;
  const innerPillHeight = PILL_HEIGHT - 2 * PILL_PADDING;
  const innerPillLeft = PILL_PADDING + tabIndex * tabWidth + PILL_PADDING;

  return (
    <div
      style={{
        position: "fixed",
        top: 40,
        left: "50%",
        transform: "translateX(-50%)",
        width: PILL_WIDTH,
        height: PILL_HEIGHT,
        borderRadius: 32,
        background: LEAD_BLACK_10,
        color: LEAD_BLACK,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        zIndex: 200,
        boxShadow: "0 1px 2.3px 0 rgba(31,31,31,0.18)",
        padding: 0,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        overflow: "visible",
      }}
    >
      {/* Animated inner pill */}
      <div
        style={{
          position: "absolute",
          top: PILL_PADDING,
          left: innerPillLeft,
          width: innerPillWidth,
          height: innerPillHeight,
          borderRadius: INNER_PILL_RADIUS,
          background: `${OFFWHITE}E6`, // 90% opacity
          zIndex: 1,
          transition: "left 0.3s cubic-bezier(.4,1,.4,1), width 0.3s cubic-bezier(.4,1,.4,1)",
          boxShadow: "0 1px 2.3px 0 rgba(31,31,31,0.10)",
        }}
      />
      {tabs.map(({ key, label, path }, i) => (
        <button
          key={key}
          onClick={() => router.push(path)}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: activeTab === key ? HARB_ORANGE : LEAD_BLACK,
            fontWeight: activeTab === key ? 700 : 400,
            fontSize: "1rem",
            cursor: "pointer",
            height: "100%",
            zIndex: 2,
            position: "relative",
          }}
        >
          <span style={{ fontSize: "1rem" }}>{label}</span>
        </button>
      ))}
    </div>
  );
} 