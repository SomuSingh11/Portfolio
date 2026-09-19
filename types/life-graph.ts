import type { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";

export interface ClusterSeed {
  id: string;
  label: string;
  color: string;
  count: number;
  photo: string;
}

export interface HighlightSeed {
  id: string;
  label: string;
  parent: string;
  date: string;
}

export interface Entry {
  date: string;
  title: string;
  snip: string;
  type: string;
}

export interface ClusterNode extends SimulationNodeDatum, ClusterSeed {
  kind: "cluster";
  r: number;
}

export interface DayNode extends SimulationNodeDatum, HighlightSeed {
  kind: "day";
  r: number;
}

export type GraphNode = ClusterNode | DayNode;

export interface GraphLink extends SimulationLinkDatum<GraphNode> {
  kind: "cluster" | "day";
  weight: number;
}

export type PanelData =
  | { kind: "cluster"; cluster: ClusterSeed & { count: number } }
  | { kind: "highlight"; highlight: HighlightSeed; parentColor: string; parentLabel: string }
  | null;

export const nodeId = (node: GraphNode | string): string =>
  typeof node === "string" ? node : node.id;
