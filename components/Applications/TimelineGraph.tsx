"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLifeGraph } from "@/hooks/data/useLifeGraph";
import type { ClusterNode, LifeGraphApiResponse } from "@/types/life-graph";

export interface TimelineGraphProps {
  entries: LifeGraphApiResponse["entries"];
  clusters: LifeGraphApiResponse["clusters"];
  onEntrySelect: (entry: LifeGraphApiResponse["entries"][number]) => void;
  scale: number;
}

export function TimelineGraph({ entries, clusters, onEntrySelect, scale }: TimelineGraphProps) {
  const previousScale = useRef(scale);
  const timelineData = useMemo<LifeGraphApiResponse>(() => {
    const timelineClusters = entries.map((entry) => {
      const parent = clusters.find((cluster) => entry.clusterIds.includes(cluster.id));
      const color = entry.type.color ?? parent?.color ?? "#8993a8";
      const media = entry.media[0];

      return {
        id: entry.id,
        name: entry.title,
        description: entry.excerpt ?? entry.content,
        color,
        sortOrder: 0,
        parentId: null,
        image: media
          ? { url: media.url, altText: media.altText, width: media.width, height: media.height }
          : null,
      };
    });

    return {
      clusters: timelineClusters,
      entries: [],
      relations: entries.slice(1).map((entry, index) => ({
        id: `timeline-${entries[index].id}-${entry.id}`,
        source: entries[index].id,
        target: entry.id,
        label: null,
        weight: 1,
        strength: 1,
        color: null,
      })),
      settings: null,
    };
  }, [clusters, entries]);

  const { svgRef, containerRef, zoomBy } = useLifeGraph({
    data: timelineData,
    fallbackClusterFill: true,
    layout: "timeline",
    showClusterCountBadge: false,
    onClusterSelect: (node: ClusterNode) => {
      const entry = entries.find((item) => item.id === node.id);
      if (entry) onEntrySelect(entry);
    },
    onEntrySelect: () => undefined,
  });

  useEffect(() => {
    const factor = scale / previousScale.current;
    if (factor !== 1) zoomBy(factor);
    previousScale.current = scale;
  }, [scale, zoomBy]);

  return (
    <div ref={containerRef} className="timeline-graph-shell">
      <svg ref={svgRef} className="timeline-graph" aria-label="Timeline entries" />
    </div>
  );
}
