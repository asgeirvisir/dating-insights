"use client";

import { useCallback } from "react";
import { toPng } from "html-to-image";
import { Download } from "lucide-react";

interface ChartExportButtonProps {
  /** Ref to the element to capture */
  targetRef: React.RefObject<HTMLDivElement | null>;
  /** Filename (without extension) */
  filename?: string;
}

export default function ChartExportButton({
  targetRef,
  filename = "chart",
}: ChartExportButtonProps) {
  const handleExport = useCallback(async () => {
    const node = targetRef.current;
    if (!node) return;

    try {
      const dataUrl = await toPng(node, {
        pixelRatio: 3,
        backgroundColor: "#1C1C1C",
        filter: (el) =>
          !(el instanceof HTMLElement && el.dataset.exportHide === "true"),
      });

      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
    }
  }, [targetRef, filename]);

  return (
    <button
      data-export-hide="true"
      onClick={handleExport}
      className="cursor-pointer rounded-md p-1.5 text-white/30 transition-colors hover:bg-white/[0.06] hover:text-white/60"
      aria-label="Export chart as PNG"
      title="Export as PNG"
    >
      <Download className="h-3.5 w-3.5" />
    </button>
  );
}
