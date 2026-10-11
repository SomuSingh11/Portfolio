"use client";

import { useMemo, useState } from "react";
import "@/styles/lifegraph.css";
import { useLifeGraphData } from "../../hooks/data/useLifeGraphData";
import { useLifeGraph } from "../../hooks/data/useLifeGraph";
import { TimelineGraph } from "./TimelineGraph";
import type { PanelData, UseLifeGraphDataResult } from "../../types/life-graph";
import { CalendarDays, ChevronLeft, ChevronRight, Layers, Network, Plus, Minus, X } from "lucide-react";

interface LifeGraphProps {
  preview?: boolean;
  onPreviewOpen?: () => void;
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function LifeGraph({ preview = false, onPreviewOpen }: LifeGraphProps) {
  const [view, setView] = useState<"graph" | "today">("graph");
  const [timelineScale, setTimelineScale] = useState(1);
  const [timelineRange, setTimelineRange] = useState<"day" | "month" | "months" | "year" | "years">("day");
  const [selectedDate, setSelectedDate] = useState(() => {
    return dateKey(new Date());
  });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [panelData, setPanelData] = useState<PanelData>(null);
  const { data: graphData, loading }: UseLifeGraphDataResult = useLifeGraphData();

  const { svgRef, containerRef, zoomBy, clearSelection } = useLifeGraph({
    data: graphData,
    onClusterSelect: preview
      ? () => undefined
      : (cluster) => setPanelData({ kind: "cluster", cluster }),
    onEntrySelect: preview
      ? () => undefined
      : (highlight, parentColor, parentLabel) =>
          setPanelData({ kind: "entry", entry: highlight, parentColor, parentLabel }),
    onDeselect: preview ? () => undefined : () => setPanelData(null),
  });

  function closePanel() {
    setPanelData(null);
    clearSelection();
  }

  function handleSelectCluster(clusterId: string) {
    const cluster = graphData?.clusters.find((c) => c.id === clusterId);
    if (!cluster) return;
    const directCount = graphData?.entries.filter((e) => e.clusterIds.includes(cluster.id)).length ?? 0;
    setPanelData({
      kind: "cluster",
      cluster: {
        id: cluster.id,
        label: cluster.name,
        color: cluster.color,
        count: directCount,
        photo: cluster.image?.url ?? "",
        parent: cluster.parentId ?? null,
        r: 30,
        kind: "cluster",
      },
    });
  }

  function zoomCurrentView(factor: number) {
    if (view === "today") {
      setTimelineScale((current) => Math.min(2.5, Math.max(0.6, current * factor)));
      return;
    }
    zoomBy(factor);
  }

  const childClustersForPanel = useMemo(() => {
    if (panelData?.kind !== "cluster") return [];
    return graphData?.clusters.filter((cluster) => cluster.parentId === panelData.cluster.id) ?? [];
  }, [panelData, graphData]);

  const parentClusterForPanel = useMemo(() => {
    if (panelData?.kind !== "cluster" || !panelData.cluster.parent) return null;
    return graphData?.clusters.find((c) => c.id === panelData.cluster.parent) ?? null;
  }, [panelData, graphData]);

  const entriesForPanel = useMemo(() => {
    if (panelData?.kind !== "cluster" || !graphData) return [];
    if (childClustersForPanel.length > 0) {
      const childIds = new Set(childClustersForPanel.map((c) => c.id));
      return graphData.entries.filter((entry) =>
        entry.clusterIds.some((id) => id === panelData.cluster.id || childIds.has(id))
      );
    }
    return graphData.entries.filter((entry) => entry.clusterIds.includes(panelData.cluster.id));
  }, [panelData, graphData, childClustersForPanel]);
  const matchedHighlightEntry =
    panelData?.kind === "entry"
      ? graphData?.entries.find((entry) => entry.id === panelData.entry.id)
      : undefined;
  const timelineEntries = useMemo(() => {
    const anchor = new Date(`${selectedDate}T12:00:00`);
    const anchorYear = anchor.getFullYear();
    const anchorMonth = anchor.getMonth();
    const threeMonthStart = new Date(anchorYear, anchorMonth - 2, 1).getTime();
    const nextMonthStart = new Date(anchorYear, anchorMonth + 1, 1).getTime();

    return (graphData?.entries ?? [])
      .filter((entry) => {
        if (!entry.occurredAt) return false;
        const entryDate = new Date(entry.occurredAt);
        if (timelineRange === "day") return dateKey(entryDate) === selectedDate;
        if (timelineRange === "month") {
          return entryDate.getFullYear() === anchorYear && entryDate.getMonth() === anchorMonth;
        }
        if (timelineRange === "months") {
          return entryDate.getTime() >= threeMonthStart && entryDate.getTime() < nextMonthStart;
        }
        if (timelineRange === "year") return entryDate.getFullYear() === anchorYear;
        return true;
      })
      .sort((first, second) => new Date(first.occurredAt!).getTime() - new Date(second.occurredAt!).getTime());
  }, [graphData, selectedDate, timelineRange]);

  const entryCountsByDate = useMemo(() => {
    const counts = new Map<string, number>();
    graphData?.entries.forEach((entry) => {
      if (!entry.occurredAt) return;
      const key = dateKey(new Date(entry.occurredAt));
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });
    return counts;
  }, [graphData]);

  const calendarDays = useMemo(() => {
    const firstDay = calendarMonth.getDay();
    const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), index + 1)),
    ];
  }, [calendarMonth]);

  const selectDate = (date: Date) => {
    setSelectedDate(dateKey(date));
    setCalendarOpen(false);
  };

  const openTimelineEntry = (entry: typeof timelineEntries[number]) => {
    const parent = graphData?.clusters.find((cluster) => entry.clusterIds.includes(cluster.id));
    setPanelData({
      kind: "entry",
      entry: {
        id: entry.id,
        label: entry.title,
        parent: parent?.id ?? "",
        date: entry.occurredAt ? entry.occurredAt.slice(0, 10) : "",
        kind: "entry",
        r: 5,
      },
      parentColor: parent?.color ?? entry.type.color ?? "#8993a8",
      parentLabel: parent?.name ?? entry.type.label,
    });
  };

  return (
    <main
      className={`lifegraph-app${preview ? " lifegraph-preview" : ""}`}
      data-view={view}
      ref={containerRef}
      onClickCapture={preview ? onPreviewOpen : undefined}
    >
      {!preview && view === "graph" && (
        <div className="view-toggle" role="tablist" aria-label="LifeGraph view">
          <button className="active" onClick={() => setView("graph")} role="tab" aria-selected="true">
            <Network className="view-toggle-icon" />
            Graph
          </button>
          <button onClick={() => setView("today")} role="tab" aria-selected="false">
            <CalendarDays className="view-toggle-icon" />
            Timeline
          </button>
        </div>
      )}

      <svg ref={svgRef} className={view === "today" && !preview ? "is-hidden" : undefined} />

      {view === "today" && !preview ? (
        <section className="today-timeline" aria-label="Today's timeline">
          <div className="view-controls">
            <div className="view-toggle" role="tablist" aria-label="LifeGraph view">
              <button onClick={() => setView("graph")} role="tab" aria-selected="false">
                <Network className="view-toggle-icon" />
                Graph
              </button>
              <button className="active" onClick={() => setView("today")} role="tab" aria-selected="true">
                <CalendarDays className="view-toggle-icon" />
                Timeline
              </button>
            </div>

            <div className="timeline-toolbar">
            <div className="timeline-range-picker" role="tablist" aria-label="Timeline range">
              {[
                ["day", "Day"],
                ["month", "Month"],
                ["months", "3 Months"],
                ["year", "Year"],
                ["years", "All Years"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={timelineRange === value ? "active" : ""}
                  onClick={() => {
                    setTimelineRange(value as typeof timelineRange);
                    setCalendarOpen(false);
                  }}
                  role="tab"
                  aria-selected={timelineRange === value}
                >
                  {label}
                </button>
              ))}
            </div>

            {timelineRange === "day" && <div className="timeline-date-picker">
              <button className="timeline-date-button" onClick={() => setCalendarOpen((open) => !open)} aria-expanded={calendarOpen} aria-label="Select timeline date">
                <CalendarDays />
                <span>{new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
              </button>
              {calendarOpen && (
                <div className="timeline-calendar" role="dialog" aria-label="Select timeline date">
                <div className="timeline-calendar-head">
                  <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} aria-label="Previous month">
                    <ChevronLeft />
                  </button>
                  <strong>{calendarMonth.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</strong>
                  <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} aria-label="Next month">
                    <ChevronRight />
                  </button>
                </div>
                <div className="timeline-calendar-weekdays">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}
                </div>
                <div className="timeline-calendar-grid">
                  {calendarDays.map((date, index) => {
                    if (!date) return <span className="timeline-calendar-blank" key={`blank-${index}`} />;
                    const key = dateKey(date);
                    const count = entryCountsByDate.get(key) ?? 0;
                    return (
                      <button
                        key={key}
                        className={`${key === selectedDate ? "selected" : ""} ${count > 0 ? "has-entries" : ""}`}
                        onClick={() => selectDate(date)}
                      >
                        <span>{date.getDate()}</span>
                        {count > 0 && <small>{count}</small>}
                      </button>
                    );
                  })}
                </div>
                </div>
              )}
            </div>}
            </div>
          </div>

          {timelineEntries.length > 0 ? (
            <div className="timeline-scroll">
              <TimelineGraph
                entries={timelineEntries}
                clusters={graphData?.clusters ?? []}
                onEntrySelect={openTimelineEntry}
                scale={timelineScale}
              />
            </div>
          ) : (
            <div className="timeline-empty">
              <CalendarDays />
              <h2>No entries in this range</h2>
              <p>Choose another date or range to explore your LifeGraph.</p>
            </div>
          )}
        </section>
      ) : null}

      {loading && (
        <div className="lifegraph-loading" role="status" aria-live="polite">
          <span className="lifegraph-loading-spinner" />
          <span>Loading LifeGraph...</span>
        </div>
      )}

      {/* Modern floating glass zoom controls */}
      <div className="zoom-controls">
        <button onClick={() => zoomCurrentView(1.3)} aria-label="Zoom in">
          <Plus className="w-4 h-4" />
        </button>
        <button onClick={() => zoomCurrentView(0.75)} aria-label="Zoom out">
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Enhanced detail drawer panel */}
      <div className={`panel${panelData ? " open" : ""}`}>
        <div className="panel-head">
          <button className="close" onClick={closePanel} aria-label="Close details">
            <X className="w-4 h-4" />
          </button>
          {panelData?.kind === "cluster" && (
            <>
              <div className="panel-eyebrow">
                {childClustersForPanel.length > 0
                  ? `${childClustersForPanel.length} connected sub-clusters · Parent Cluster`
                  : `${panelData.cluster.count} entries · Cluster`}
              </div>
              <div className="panel-title">
                <span className="dot" style={{ background: panelData.cluster.color }} />
                {panelData.cluster.label}
              </div>
              {parentClusterForPanel && (
                <button
                  type="button"
                  className="panel-parent-badge"
                  onClick={() => handleSelectCluster(parentClusterForPanel.id)}
                  title={`View parent ${parentClusterForPanel.name}`}
                >
                  <span>Part of <strong>{parentClusterForPanel.name}</strong></span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="panel-sub">
                {childClustersForPanel.length > 0
                  ? "Master cluster containing connected child clusters."
                  : "Every entry tagged with this topic, newest first."}
              </div>
            </>
          )}
          {panelData?.kind === "entry" && (
            <>
              <div className="panel-eyebrow">{panelData.entry.date} · entry</div>
              <div className="panel-title">
                <span className="dot" style={{ background: panelData.parentColor }} />
                {panelData.entry.label}
              </div>
              <div className="panel-sub">Filed under {panelData.parentLabel}</div>
            </>
          )}
        </div>

        <div className="panel-body">
          {panelData?.kind === "cluster" && childClustersForPanel.length > 0 && (
            <div className="panel-section">
              <div className="panel-section-title">
                <Layers className="w-3.5 h-3.5" />
                <span>Connected Child Clusters ({childClustersForPanel.length})</span>
              </div>
              <div className="panel-children-grid">
                {childClustersForPanel.map((child) => {
                  const childCount =
                    graphData?.entries.filter((e) => e.clusterIds.includes(child.id)).length ?? 0;
                  return (
                    <button
                      key={child.id}
                      type="button"
                      className="panel-child-card"
                      onClick={() => handleSelectCluster(child.id)}
                      title={`Open ${child.name}`}
                    >
                      <div className="panel-child-info">
                        <span
                          className="panel-child-dot"
                          style={{
                            backgroundColor: child.color,
                            color: child.color,
                          }}
                        />
                        <div className="panel-child-text">
                          <span className="panel-child-name">{child.name}</span>
                          {child.description && (
                            <span className="panel-child-desc">{child.description}</span>
                          )}
                        </div>
                      </div>
                      <div className="panel-child-meta">
                        <span className="panel-child-count">{childCount} entries</span>
                        <ChevronRight className="panel-child-arrow" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {panelData?.kind === "cluster" && (
            <>
              {childClustersForPanel.length > 0 && entriesForPanel.length > 0 && (
                <div className="panel-section" style={{ paddingTop: 8, paddingBottom: 4 }}>
                  <div className="panel-section-title">
                    <span>Entries across {panelData.cluster.label} ({entriesForPanel.length})</span>
                  </div>
                </div>
              )}
              {entriesForPanel.map((entry) => (
                <div className="entry" key={entry.id || entry.title}>
                  <div className="entry-date">{entry.occurredAt?.slice(0, 10) ?? ""}</div>
                  <div className="entry-title">{entry.title}</div>
                  <div className="entry-snip">{entry.content}</div>
                  {entry.type?.label && <div className="entry-type">{entry.type.label}</div>}
                </div>
              ))}
            </>
          )}
          {panelData?.kind === "entry" && (
            <div className="entry" style={{ cursor: "default" }}>
              <div className="entry-date">{matchedHighlightEntry?.occurredAt?.slice(0, 10) ?? panelData.entry.date}</div>
              <div className="entry-title">{panelData.entry.label}</div>
              <div className="entry-snip">{matchedHighlightEntry?.content ?? ""}</div>
              {matchedHighlightEntry?.type?.label && (
                <div className="entry-type">{matchedHighlightEntry.type.label}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}