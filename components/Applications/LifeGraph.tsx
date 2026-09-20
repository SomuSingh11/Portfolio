"use client";

import { useState } from "react";
import "@/styles/lifegraph.css";
import { useLifeGraphData } from "@/hooks/data/useLifeGraphData";
import { useLifeGraph } from "@/hooks/data/useLifeGraph";
import type { PanelData } from "@/types/life-graph";

interface LifeGraphProps {
  preview?: boolean;
  onPreviewOpen?: () => void;
}

export default function LifeGraph({ preview = false, onPreviewOpen }: LifeGraphProps) {
  const [panelData, setPanelData] = useState<PanelData>(null);
  const { data: graphData, loading } = useLifeGraphData();
  const totalEntries = graphData?.entries.length ?? 0;

  const { svgRef, containerRef, mutedClusters, toggleClusterMute, zoomBy, clearSelection } = useLifeGraph({
    data: graphData,
    onClusterSelect: preview
      ? () => undefined
      : (cluster) => setPanelData({ kind: "cluster", cluster }),
    onHighlightSelect: preview
      ? () => undefined
      : (highlight, parentColor, parentLabel) =>
          setPanelData({ kind: "highlight", highlight, parentColor, parentLabel }),
  });

  function closePanel() {
    setPanelData(null);
    clearSelection();
  }

  const entriesForPanel = panelData?.kind === "cluster"
    ? graphData?.entries.filter((entry) => entry.clusterIds.includes(panelData.cluster.id)) ?? []
    : [];
  const matchedHighlightEntry =
    panelData?.kind === "highlight"
      ? graphData?.entries.find((entry) => entry.id === panelData.highlight.id)
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

      {loading && (
        <div className="lifegraph-loading" role="status" aria-live="polite">
          <span className="lifegraph-loading-spinner" />
          <span>Loading LifeGraph...</span>
        </div>
      )}

      <div className="legend">
        {(graphData?.clusters ?? []).map((cluster) => (
          <div
            key={cluster.id}
            className={`legend-item${mutedClusters.has(cluster.id) ? " muted" : ""}`}
            onClick={() => toggleClusterMute(cluster.id)}
          >
            <span className="legend-dot" style={{ background: cluster.color }} />
            {cluster.name}
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
            entriesForPanel.map((entry) => (
              <div className="entry" key={entry.title}>
                <div className="entry-date">{entry.occurredAt?.slice(0, 10) ?? ""}</div>
                <div className="entry-title">{entry.title}</div>
                <div className="entry-snip">{entry.content}</div>
                <div className="entry-type">{entry.type.label}</div>
              </div>
            ))}
          {panelData?.kind === "highlight" && (
            <div className="entry" style={{ cursor: "default" }}>
              <div className="entry-date">{matchedHighlightEntry?.occurredAt?.slice(0, 10) ?? panelData.highlight.date}</div>
              <div className="entry-title">{panelData.highlight.label}</div>
              <div className="entry-snip">{matchedHighlightEntry?.content ?? ""}</div>
              <div className="entry-type">{matchedHighlightEntry?.type.label ?? ""}</div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}