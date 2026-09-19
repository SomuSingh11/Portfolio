"use client";

import { useEffect, useState } from "react";
import "@/styles/lifegraph.css";
import { clusterSeeds, entriesByCluster } from "@/data/lifegraph-data";
import { useLifeGraph } from "@/hooks/data/useLifeGraph";
import type { PanelData } from "@/types/life-graph";

export default function LifeGraph() {
  const [panelData, setPanelData] = useState<PanelData>(null);
  const [mobileView, setMobileView] = useState<"graph" | "clusters">("graph");
  const [totalEntries] = useState(() => clusterSeeds.reduce((sum, c) => sum + c.count, 0));

  const { svgRef, containerRef, mutedClusters, toggleClusterMute, zoomBy, clearSelection } = useLifeGraph({
    onClusterSelect: (cluster) => setPanelData({ kind: "cluster", cluster }),
    onHighlightSelect: (highlight, parentColor, parentLabel) =>
      setPanelData({ kind: "highlight", highlight, parentColor, parentLabel }),
  });

  useEffect(() => {
    if (window.innerWidth <= 720) setMobileView("clusters");
  }, []);

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
    <main className="lifegraph-app" ref={containerRef}>
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

      <div className="view-toggle">
        <button className={mobileView === "graph" ? "active" : ""} onClick={() => setMobileView("graph")}>
          Graph
        </button>
        <button className={mobileView === "clusters" ? "active" : ""} onClick={() => setMobileView("clusters")}>
          Clusters
        </button>
      </div>

      <svg ref={svgRef} style={{ display: mobileView === "graph" ? "block" : "none" }} />

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

      {mobileView === "clusters" && (
        <div className="chip-view">
          {clusterSeeds.map((c) => (
            <div
              key={c.id}
              className="chip"
              onClick={() => setPanelData({ kind: "cluster", cluster: c })}
            >
              <div className="chip-left">
                <span className="chip-dot" style={{ background: c.color }} />
                <span className="chip-name">{c.label}</span>
              </div>
              <span className="chip-count">{c.count} entries</span>
            </div>
          ))}
        </div>
      )}
      {mobileView === "clusters" && (
        <div className="expand-hint">tap a topic to filter · pinch-zoom the full map isn't built for small screens yet</div>
      )}

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