import { useEffect, useRef, useState } from "react";
import { select, type Selection } from "d3-selection";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type Simulation,
} from "d3-force";
import { zoom, zoomIdentity, type ZoomBehavior } from "d3-zoom";
import { drag } from "d3-drag";
import { scaleSqrt } from "d3-scale";
import "d3-transition";
import { nodeId, type ClusterNode, type EntryNode, type GraphLink, type GraphNode, type LifeGraphApiResponse } from "@/types/life-graph";

interface UseLifeGraphOptions {
  onClusterSelect: (cluster: ClusterNode) => void;
  onEntrySelect: (entry: EntryNode, parentColor: string, parentLabel: string) => void;
  onDeselect?: () => void;
  data?: LifeGraphApiResponse | null;
  fallbackClusterFill?: boolean;
  layout?: "graph" | "timeline";
  showClusterCountBadge?: boolean;
}

export function useLifeGraph({
  onClusterSelect,
  onEntrySelect,
  onDeselect,
  data,
  fallbackClusterFill = false,
  layout = "graph",
  showClusterCountBadge = false,
}: UseLifeGraphOptions) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onClusterSelectRef = useRef(onClusterSelect);
  const onEntrySelectRef = useRef(onEntrySelect);
  const onDeselectRef = useRef(onDeselect);
  const resetSelectionRef = useRef<() => void>(() => {});
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const nodeSelRef = useRef<Selection<SVGGElement, GraphNode, SVGGElement, unknown> | null>(null);
  const linkSelRef = useRef<Selection<SVGPathElement, GraphLink, SVGGElement, unknown> | null>(null);
  const [mutedClusters, setMutedClusters] = useState<Set<string>>(new Set());

  onClusterSelectRef.current = onClusterSelect;
  onEntrySelectRef.current = onEntrySelect;
  onDeselectRef.current = onDeselect;

  const graphData = data ?? null;

  useEffect(() => {
    const svgEl = svgRef.current;
    const container = containerRef.current;
    if (!svgEl || !container) return;

    const svg = select(svgEl);
    const g = svg.append("g");
    let width = container.clientWidth;
    let height = container.clientHeight;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const zoomBehavior = zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (ev) => g.attr("transform", ev.transform.toString()));
    svg.call(zoomBehavior);
    if (window.innerWidth <= 720) {
      const scale = 0.68;
      svg.call(
        zoomBehavior.transform,
        zoomIdentity
          .translate((width * (1 - scale)) / 2, (height * (1 - scale)) / 2)
          .scale(scale),
      );
    }
    zoomBehaviorRef.current = zoomBehavior;

    const apiClusters = graphData?.clusters ?? [];
    const apiEntries = graphData?.entries ?? [];
    const apiRelations = graphData?.relations ?? [];

    // Identify which clusters are parents to guarantee:
    // Parent clusters are ALWAYS strictly larger than child clusters
    const parentIds = new Set(
      apiClusters.map((c) => c.parentId).filter((id): id is string => Boolean(id))
    );

    const getDirectCount = (clusterId: string) =>
      apiEntries.filter((entry) => entry.clusterIds.includes(clusterId)).length;

    const graphClusters = apiClusters.map((cluster) => {
      const isParent = parentIds.has(cluster.id);
      const isChild = Boolean(cluster.parentId);
      const directCount = getDirectCount(cluster.id);

      const familyCount = isParent
        ? directCount +
          apiClusters
            .filter((c) => c.parentId === cluster.id)
            .reduce((sum, child) => sum + getDirectCount(child.id), 0)
        : directCount;

      let r: number;
      if (isParent) {
        // Parent clusters are prominent but refined (38px - 46px)
        const parentScale = scaleSqrt().domain([0, 20]).range([38, 46]);
        r = Math.max(38, Math.min(48, parentScale(familyCount)));
      } else if (isChild) {
        // Child clusters are tighter and sleek (20px - 26px)
        const childScale = scaleSqrt().domain([0, 10]).range([20, 26]);
        r = Math.max(19, Math.min(27, childScale(directCount)));
      } else {
        // Standalone independent clusters (26px - 32px)
        const standaloneScale = scaleSqrt().domain([0, 10]).range([26, 32]);
        r = Math.max(25, Math.min(33, standaloneScale(directCount)));
      }

      return {
        id: cluster.id,
        label: cluster.name,
        color: cluster.color,
        count: directCount,
        photo: cluster.image?.url ?? "",
        parent: cluster.parentId ?? null,
        isParent,
        r,
      };
    });

    const graphHighlights = apiEntries.map((entry) => ({
      id: entry.id,
      label: entry.title,
      parent: entry.clusterIds[0] ?? "",
      date: entry.occurredAt ? entry.occurredAt.slice(0, 10) : "",
    })).filter((entry) => entry.parent);
    const graphRelations = apiRelations.map((relation) => [relation.source, relation.target, relation.weight] as [string, string, number]);

    const clusterColor = (id: string) => graphClusters.find((cluster) => cluster.id === id)?.color ?? "#2A3448";
    const nodes: GraphNode[] = [
      ...graphClusters.map((cluster) => ({ ...cluster, kind: "cluster" as const })),
      ...graphHighlights.map((highlight) => ({ ...highlight, kind: "entry" as const, r: 5 })),
    ];
    const links: GraphLink[] = [
      ...graphRelations.map(([source, target, weight]) => ({ source, target, weight, kind: "cluster" as const })),
      ...graphClusters
        .filter((cluster) => cluster.parent)
        .map((cluster) => ({ source: cluster.parent!, target: cluster.id, weight: 1, kind: "cluster" as const })),
      ...graphHighlights.map((highlight) => ({ source: highlight.parent, target: highlight.id, weight: 1, kind: "entry" as const })),
    ];

    // ── Pattern A: Clustered Multi-Focal Sector Gravity ──
    // Maps each cluster to its spatial home sector for predictable, production-grade layout
    const getSectorFocalPoint = (clusterId: string, w: number, h: number): { x: number; y: number } => {
      switch (clusterId) {
        // Sector 1 (West / North-West): Projects Hub
        case "projects":
          return { x: w * 0.28, y: h * 0.36 };
        case "orbitos":
          return { x: w * 0.16, y: h * 0.22 };
        case "catalyst":
          return { x: w * 0.28, y: h * 0.16 };
        case "ashura-core-s3-idf":
          return { x: w * 0.13, y: h * 0.34 };
        case "huddle":
          return { x: w * 0.18, y: h * 0.48 };
        case "sync-city":
          return { x: w * 0.30, y: h * 0.52 };

        // Sector 2 (East / North-East): Learnings
        case "learnings":
          return { x: w * 0.72, y: h * 0.30 };
        case "sys-arch":
          return { x: w * 0.64, y: h * 0.16 };
        case "dist-sys":
          return { x: w * 0.82, y: h * 0.18 };
        case "fullstack":
          return { x: w * 0.86, y: h * 0.32 };

        // Sector 3 (East / Mid-East): Writings
        case "writings":
          return { x: w * 0.80, y: h * 0.52 };
        case "deep-dives":
          return { x: w * 0.88, y: h * 0.62 };
        case "field-notes":
          return { x: w * 0.72, y: h * 0.62 };

        // Sector 4 (Center-North): Wins & Milestones
        case "wins":
          return { x: w * 0.50, y: h * 0.20 };

        // Sector 5 (Center-Mid): Quotes & Philosophy
        case "quotes":
          return { x: w * 0.50, y: h * 0.44 };

        // Sector 6 (South-West): Spotify & Hip Hop Culture
        case "spotify":
          return { x: w * 0.30, y: h * 0.76 };
        case "hiphop-bars":
          return { x: w * 0.18, y: h * 0.80 };

        // Sector 7 (Center-South): Daily Thread
        case "daily-thread":
          return { x: w * 0.48, y: h * 0.78 };

        // Sector 8 (South-East): Books & Gaming
        case "books":
          return { x: w * 0.66, y: h * 0.74 };
        case "video-games":
          return { x: w * 0.80, y: h * 0.80 };

        default: {
          const clusterObj = apiClusters.find((c) => c.id === clusterId);
          if (clusterObj?.parentId) {
            const parentFocal = getSectorFocalPoint(clusterObj.parentId, w, h);
            return { x: parentFocal.x + 35, y: parentFocal.y + 35 };
          }
          return { x: w * 0.5, y: h * 0.5 };
        }
      }
    };

    // Pre-seed initial node positions near their sector focal points
    nodes.forEach((node) => {
      const focal =
        node.kind === "cluster"
          ? getSectorFocalPoint(node.id, width, height)
          : getSectorFocalPoint(node.parent, width, height);

      node.x = focal.x + (Math.random() - 0.5) * 16;
      node.y = focal.y + (Math.random() - 0.5) * 16;
    });

    const linkSel = g
      .append("g")
      .selectAll<SVGPathElement, GraphLink>("path")
      .data(links)
      .join("path")
      .attr("class", (link) => (link.kind === "cluster" ? "edge" : "thread"))
      .attr("stroke", (link) => link.kind === "cluster" ? null : clusterColor(nodeId(link.source as GraphNode | string)))
      .attr("stroke-width", (link) => link.kind === "cluster" ? Math.max(1, link.weight * 0.5) : 0.75);
    linkSelRef.current = linkSel;

    const nodeSel = g
      .append("g")
      .selectAll<SVGGElement, GraphNode>("g")
      .data(nodes)
      .join("g")
      .attr("class", (node) => node.kind === "cluster" ? "node" : "node satellite")
      .attr("data-cluster", (node) => node.kind === "cluster" ? node.id : node.parent);
    nodeSelRef.current = nodeSel;

    const clusterG = nodeSel.filter((node): node is ClusterNode => node.kind === "cluster");
    clusterG
      .append("clipPath")
      .attr("id", (node) => `clip-${node.id}`)
      .append("circle")
      .attr("r", (node) => node.r - 1.5);
    clusterG
      .append("image")
      .attr("class", "core-photo")
      .attr("href", (node) => node.kind === "cluster" ? node.photo : "")
      .attr("clip-path", (node) => `url(#clip-${node.id})`)
      .attr("x", (node) => -node.r)
      .attr("y", (node) => -node.r)
      .attr("width", (node) => node.r * 2)
      .attr("height", (node) => node.r * 2)
      .attr("preserveAspectRatio", "xMidYMid slice")
      .attr("fill", (node) => node.kind === "cluster" ? node.color : "none");
    clusterG
      .append("circle")
      .attr("class", "core")
      .attr("r", (node) => node.r)
      .attr("fill", (node) => node.kind === "cluster" && fallbackClusterFill && !node.photo ? node.color : "none")
      .attr("stroke", (node) => node.kind === "cluster" ? node.color : "none")
      .attr("stroke-width", 3);

    if (showClusterCountBadge) {
      const badge = clusterG
        .append("g")
        .attr("class", "count-badge")
        .attr("transform", (node) => `translate(${node.r * 0.72},${node.r * 0.72})`);
      badge.append("circle").attr("r", 11).attr("fill", (node) => node.kind === "cluster" ? node.color : "none").attr("stroke", "var(--ink)").attr("stroke-width", 2);
      badge.append("text").attr("class", "count").attr("font-size", 11).text((node) => node.kind === "cluster" ? node.count : "");
    }
    clusterG
      .append("text")
      .attr("class", "label")
      .attr("text-anchor", "middle")
      .attr("y", (node) => node.r + 18)
      .text((node) => node.label);

    const entryG = nodeSel.filter((node): node is EntryNode => node.kind === "entry");
    entryG.append("circle").attr("fill", (node) => node.kind === "entry" ? clusterColor(node.parent) : "none");
    entryG
      .append("text")
      .attr("class", "label")
      .attr("text-anchor", "start")
      .attr("x", 9)
      .attr("y", 3.5)
      .text((node) => node.label);

    const sim = forceSimulation<GraphNode>(nodes)
      .force(
        "link",
        forceLink<GraphNode, GraphLink>(links)
          .id((node) => node.id)
          .distance((link) => (link.kind === "cluster" ? 115 : 42))
          .strength((link) => (link.kind === "cluster" ? 0.35 : 0.9)),
      )
      .force(
        "charge",
        forceManyBody<GraphNode>().strength((node) =>
          node.kind === "cluster"
            ? (node as ClusterNode).isParent
              ? -480
              : -320
            : -35,
        ),
      )
      .force("center", forceCenter(width / 2, height / 2))
      .force(
        "collide",
        forceCollide<GraphNode>().radius((node) =>
          node.r + (node.kind === "cluster" ? ((node as ClusterNode).isParent ? 22 : 16) : 24),
        ),
      );

    if (layout === "graph") {
      sim
        .force(
          "x",
          forceX<GraphNode>((node) => {
            const focal =
              node.kind === "cluster"
                ? getSectorFocalPoint(node.id, width, height)
                : getSectorFocalPoint(node.parent, width, height);
            return focal.x;
          }).strength((node) => (node.kind === "cluster" ? 0.08 : 0.04)),
        )
        .force(
          "y",
          forceY<GraphNode>((node) => {
            const focal =
              node.kind === "cluster"
                ? getSectorFocalPoint(node.id, width, height)
                : getSectorFocalPoint(node.parent, width, height);
            return focal.y;
          }).strength((node) => (node.kind === "cluster" ? 0.08 : 0.04)),
        );
    }

    sim.on("tick", () => {
      linkSel.attr("d", (link) => {
        const source = link.source as GraphNode;
        const target = link.target as GraphNode;
        return `M${source.x},${source.y} L${target.x},${target.y}`;
      });
      nodeSel.attr("transform", (node) => `translate(${node.x},${node.y})`);
    });

    if (layout === "timeline") {
      sim
        .force("x", forceX<GraphNode>((_, index) => {
          const padding = Math.min(110, width * 0.12);
          const usableWidth = Math.max(width - padding * 2, 1);
          return padding + (usableWidth * index) / Math.max(nodes.length - 1, 1);
        }).strength(0.08))
        .force("y", forceY<GraphNode>((_, index) => height / 2 + Math.sin(index * 1.2) * Math.min(height * 0.25, 110)).strength(0.08));
    }

    const dragBehavior = drag<SVGGElement, GraphNode>()
      .on("start", (event, node) => {
        if (!event.active) sim.alphaTarget(0.15).restart();
        node.fx = node.x;
        node.fy = node.y;
      })
      .on("drag", (event, node) => {
        node.fx = event.x;
        node.fy = event.y;
      })
      .on("end", (event, node) => {
        if (!event.active) sim.alphaTarget(0);
        node.fx = null;
        node.fy = null;
      });
    nodeSel.call(dragBehavior);

    const neighborsOf = (id: string) => {
      const neighbors = new Set([id]);
      links.forEach((link) => {
        const source = nodeId(link.source as GraphNode | string);
        const target = nodeId(link.target as GraphNode | string);
        if (source === id) neighbors.add(target);
        if (target === id) neighbors.add(source);
      });
      return neighbors;
    };

    let clickedClusterId: string | null = null;
    const showClusterDescriptions = (clusterId: string) => {
      svg.classed("is-hovering", true);
      nodeSel.classed("show-description", (node) => node.id === clusterId || (node.kind === "entry" && node.parent === clusterId));
    };
    const focusCluster = (clusterId: string) => {
      const neighbors = neighborsOf(clusterId);
      nodeSel.classed("dim", (item) => !neighbors.has(item.id));
      showClusterDescriptions(clusterId);
      linkSel.classed("lit", (link) => nodeId(link.source as GraphNode | string) === clusterId || nodeId(link.target as GraphNode | string) === clusterId);
      linkSel.filter((link) => link.kind === "entry").classed("active", (link) => nodeId(link.source as GraphNode | string) === clusterId);
    };

    const resetSelection = () => {
      clickedClusterId = null;
      nodeSel.classed("selected", false);
      nodeSel.classed("dim", false);
      nodeSel.classed("show-description", false);
      linkSel.classed("lit", false);
      linkSel.classed("active", false);
      svg.classed("is-hovering", false);
      onDeselectRef.current?.();
    };
    resetSelectionRef.current = resetSelection;

    nodeSel.on("mouseenter", (_event, node) => {
      const clusterId = node.kind === "cluster" ? node.id : node.parent;
      focusCluster(clusterId);
    });
    nodeSel.on("mouseleave", () => {
      if (clickedClusterId) {
        focusCluster(clickedClusterId);
      } else {
        nodeSel.classed("dim", false);
        linkSel.classed("lit", false);
        linkSel.classed("active", false);
        svg.classed("is-hovering", false);
        nodeSel.classed("show-description", false);
      }
    });
    nodeSel.on("click", (event, node) => {
      event.stopPropagation();
      const clusterId = node.kind === "cluster" ? node.id : node.parent;
      clickedClusterId = clusterId;
      focusCluster(clusterId);
      if (node.kind === "cluster") {
        nodeSel.classed("selected", (item) => item.id === node.id);
        onClusterSelectRef.current(node);
      } else {
        const parent = graphClusters.find((cluster) => cluster.id === node.parent);
        if (parent) onEntrySelectRef.current(node, parent.color, parent.label);
      }
    });

    // Deselect active node when clicking on empty SVG canvas background
    svg.on("click", (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as Element | null;
      if (target && (target.closest(".node") || target.closest(".edge") || target.closest(".thread"))) {
        return;
      }
      resetSelection();
    });

    // Deselect active node when clicking on container background outside interactive controls
    const onContainerClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as Element | null;
      if (!target) return;
      if (
        target.closest(".panel") ||
        target.closest(".zoom-controls") ||
        target.closest(".view-toggle") ||
        target.closest(".node") ||
        target.closest(".today-timeline")
      ) {
        return;
      }
      resetSelection();
    };
    container.addEventListener("click", onContainerClick);

    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      svg.attr("viewBox", `0 0 ${width} ${height}`);
      sim.force("center", forceCenter(width / 2, height / 2));
      sim.alpha(0.3).restart();
    };
    window.addEventListener("resize", onResize);

    return () => {
      container.removeEventListener("click", onContainerClick);
      window.removeEventListener("resize", onResize);
      sim.stop();
      svg.selectAll("*").remove();
      nodeSelRef.current = null;
      linkSelRef.current = null;
    };
  }, [fallbackClusterFill, graphData, layout, showClusterCountBadge]);

  function toggleClusterMute(id: string) {
    setMutedClusters((previous) => {
      const next = new Set(previous);
      const willMute = !next.has(id);
      if (willMute) next.add(id);
      else next.delete(id);
      nodeSelRef.current?.filter((node) => node.kind === "cluster" && node.id === id).style("display", willMute ? "none" : "");
      nodeSelRef.current?.filter((node) => node.kind === "entry" && node.parent === id).style("display", willMute ? "none" : "");
      linkSelRef.current?.filter((link) => nodeId(link.source as GraphNode | string) === id || nodeId(link.target as GraphNode | string) === id).style("display", willMute ? "none" : "");
      return next;
    });
  }

  function zoomBy(factor: number) {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    select(svgRef.current).transition().duration(250).call(zoomBehaviorRef.current.scaleBy, factor);
  }

  function clearSelection() {
    resetSelectionRef.current();
  }

  return { svgRef, containerRef, mutedClusters, toggleClusterMute, zoomBy, clearSelection };
}
