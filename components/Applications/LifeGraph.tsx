"use client";

import { useState } from "react";
import "@/styles/lifegraph.css";
import { clusterSeeds, entriesByCluster } from "@/data/lifegraph-data";
import { useLifeGraph } from "@/hooks/data/useLifeGraph";
import type { PanelData } from "@/types/life-graph";

interface LifeGraphProps {
  preview?: boolean;
  onPreviewOpen?: () => void;
}

export default function LifeGraph({ preview = false, onPreviewOpen }: LifeGraphProps) {
  const [panelData, setPanelData] = useState<PanelData>(null);
  const [totalEntries] = useState(() => clusterSeeds.reduce((sum, c) => sum + c.count, 0));

  const { svgRef, containerRef, mutedClusters, toggleClusterMute, zoomBy, clearSelection } = useLifeGraph({
    onClusterSelect: (cluster) => setPanelData({ kind: "cluster", cluster }),
    onHighlightSelect: (highlight, parentColor, parentLabel) =>
      setPanelData({ kind: "highlight", highlight, parentColor, parentLabel }),
  });

  function closePanel() {
    setPanelData(null);
    clearSelection();
  }

  const entriesForPanel = panelData?.kind === "cluster" ? entriesByCluster[panelData.cluster.id] ?? [] : [];
  const matchedHighlightEntry =
    panelData?.kind === "highlight"
      ? (entriesByCluster[panelData.highlight.parent] ?? []).find((e) => e.title === panelData.highlight.label)
      : undefined;

  return (
    <main
      className={`lifegraph-app${preview ? " lifegraph-preview" : ""}`}
      ref={containerRef}
      onClickCapture={preview ? onPreviewOpen : undefined}
    >
      <div className="header">
        <div className="title">
          lifegraph <em>· map</em>
        </div>
        <div className="meta">
          {totalEntries} entries logged
          <br />
          since March 2026
        </div>
      </div>

      <svg ref={svgRef} />

      <div className="legend">
        {clusterSeeds.map((c) => (
          <div
            key={c.id}
            className={`legend-item${mutedClusters.has(c.id) ? " muted" : ""}`}
            onClick={() => toggleClusterMute(c.id)}
          >
            <span className="legend-dot" style={{ background: c.color }} />
            {c.label}
          </div>
        ))}
      </div>

      <div className="zoom-controls">
        <button onClick={() => zoomBy(1.3)}>+</button>
        <button onClick={() => zoomBy(0.75)}>−</button>
      </div>

      <div className={`panel${panelData ? " open" : ""}`}>
        <div className="panel-head">
          <button className="close" onClick={closePanel} aria-label="Close details">
            ×
          </button>
          {panelData?.kind === "cluster" && (
            <>
              <div className="panel-eyebrow">{panelData.cluster.count} entries · cluster</div>
              <div className="panel-title">
                <span className="dot" style={{ background: panelData.cluster.color }} />
                {panelData.cluster.label}
              </div>
              <div className="panel-sub">Every entry tagged with this topic, newest first.</div>
            </>
          )}
          {panelData?.kind === "highlight" && (
            <>
              <div className="panel-eyebrow">{panelData.highlight.date} · highlighted entry</div>
              <div className="panel-title">
                <span className="dot" style={{ background: panelData.parentColor }} />
                {panelData.highlight.label}
              </div>
              <div className="panel-sub">Filed under {panelData.parentLabel}</div>
            </>
          )}
        </div>

        <div className="panel-body">
          {panelData?.kind === "cluster" &&
            entriesForPanel.map((e) => (
              <div className="entry" key={e.title}>
                <div className="entry-date">{e.date}</div>
                <div className="entry-title">{e.title}</div>
                <div className="entry-snip">{e.snip}</div>
                <div className="entry-type">{e.type.replace("_", " ")}</div>
              </div>
            ))}
          {panelData?.kind === "highlight" && (
            <div className="entry" style={{ cursor: "default" }}>
              <div className="entry-date">{panelData.highlight.date}</div>
              <div className="entry-title">{panelData.highlight.label}</div>
              <div className="entry-snip">{matchedHighlightEntry?.snip ?? ""}</div>
              <div className="entry-type">{(matchedHighlightEntry?.type ?? "experience").replace("_", " ")}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}