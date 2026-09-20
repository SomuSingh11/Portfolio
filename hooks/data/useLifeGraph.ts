import { useEffect, useRef, useState } from "react";
import { select, type Selection } from "d3-selection";
import {
  forceCenter,
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
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
  data?: LifeGraphApiResponse | null;
}

export function useLifeGraph({ onClusterSelect, onEntrySelect, data }: UseLifeGraphOptions) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const onClusterSelectRef = useRef(onClusterSelect);
  const onEntrySelectRef = useRef(onEntrySelect);
  const zoomBehaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const nodeSelRef = useRef<Selection<SVGGElement, GraphNode, SVGGElement, unknown> | null>(null);
  const linkSelRef = useRef<Selection<SVGPathElement, GraphLink, SVGGElement, unknown> | null>(null);
  const [mutedClusters, setMutedClusters] = useState<Set<string>>(new Set());

  onClusterSelectRef.current = onClusterSelect;
  onEntrySelectRef.current = onEntrySelect;

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
    const graphClusters = apiClusters.map((cluster) => ({
      id: cluster.id,
      label: cluster.name,
      color: cluster.color,
      count: apiEntries.filter((entry) => entry.clusterIds.includes(cluster.id)).length,
      photo: cluster.image?.url ?? "",
    }));
    const graphHighlights = apiEntries.map((entry) => ({
      id: entry.id,
      label: entry.title,
      parent: entry.clusterIds[0] ?? "",
      date: entry.occurredAt ? entry.occurredAt.slice(0, 10) : "",
    })).filter((entry) => entry.parent);
    const graphRelations = apiRelations.map((relation) => [relation.source, relation.target, relation.weight] as [string, string, number]);

    const rScale = scaleSqrt()
      .domain([0, Math.max(...graphClusters.map((cluster) => cluster.count), 1)])
      .range([8, 46]);
    const clusterColor = (id: string) => graphClusters.find((cluster) => cluster.id === id)?.color ?? "#2A3448";
    const nodes: GraphNode[] = [
      ...graphClusters.map((cluster) => ({ ...cluster, kind: "cluster" as const, r: rScale(cluster.count) })),
      ...graphHighlights.map((highlight) => ({ ...highlight, kind: "entry" as const, r: 5 })),
    ];
    const links: GraphLink[] = [
      ...graphRelations.map(([source, target, weight]) => ({ source, target, weight, kind: "cluster" as const })),
      ...graphHighlights.map((highlight) => ({ source: highlight.parent, target: highlight.id, weight: 1, kind: "entry" as const })),
    ];

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
      .attr("fill", "none")
      .attr("stroke", (node) => node.kind === "cluster" ? node.color : "none")
      .attr("stroke-width", 3);

    const badge = clusterG
      .append("g")
      .attr("class", "count-badge")
      .attr("transform", (node) => `translate(${node.r * 0.72},${node.r * 0.72})`);
    badge.append("circle").attr("r", 11).attr("fill", (node) => node.kind === "cluster" ? node.color : "none").attr("stroke", "var(--ink)").attr("stroke-width", 2);
    badge.append("text").attr("class", "count").attr("font-size", 11).text((node) => node.kind === "cluster" ? node.count : "");
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
          .distance((link) => link.kind === "cluster" ? 130 : 46)
          .strength((link) => link.kind === "cluster" ? 0.35 : 0.9),
      )
      .force("charge", forceManyBody<GraphNode>().strength((node) => node.kind === "cluster" ? -420 : -40))
      .force("center", forceCenter(width / 2, height / 2))
      .force("collide", forceCollide<GraphNode>().radius((node) => node.r + (node.kind === "cluster" ? 26 : 34)))
      .on("tick", () => {
        linkSel.attr("d", (link) => {
          const source = link.source as GraphNode;
          const target = link.target as GraphNode;
          return `M${source.x},${source.y} L${target.x},${target.y}`;
        });
        nodeSel.attr("transform", (node) => `translate(${node.x},${node.y})`);
      });

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

    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      svg.attr("viewBox", `0 0 ${width} ${height}`);
      sim.force("center", forceCenter(width / 2, height / 2));
      sim.alpha(0.3).restart();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      sim.stop();
      svg.selectAll("*").remove();
      nodeSelRef.current = null;
      linkSelRef.current = null;
    };
  }, [graphData]);

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
    nodeSelRef.current?.classed("selected", false);
    nodeSelRef.current?.classed("dim", false);
    nodeSelRef.current?.classed("show-description", false);
    linkSelRef.current?.classed("lit", false).classed("active", false);
    if (svgRef.current) select(svgRef.current).classed("is-hovering", false);
  }

  return { svgRef, containerRef, mutedClusters, toggleClusterMute, zoomBy, clearSelection };
}
