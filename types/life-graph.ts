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


export interface LifeGraphMedia {
  role?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface LifeGraphCluster {
  id: string;
  name: string;
  description?: string | null;
  color: string;
  sortOrder: number;
  image: {
    url: string;
    altText?: string | null;
  } | null;
}

export interface LifeGraphEntryType {
  slug: string;
  label: string;
  icon?: string | null;
  color?: string | null;
}

export interface LifeGraphEntry {
  id: string;
  slug: string;
  type: LifeGraphEntryType;
  title: string;
  content?: string | null;
  excerpt?: string | null;
  occurredAt?: string | null;
  location?: string | null;
  sourceUrl?: string | null;
  metadata?: unknown;
  clusterIds: string[];
  media: LifeGraphMedia[];
}

export interface LifeGraphRelation {
  id: string;
  source: string;
  target: string;
  label?: string | null;
  weight: number;
  strength: number;
  color?: string | null;
}

export interface LifeGraphSettings {
  defaultZoom: number;
  clusterSpacing: number;
  entrySpacing: number;
  backgroundColor?: string | null;
  edgeColor?: string | null;
  nodeStyle?: unknown;
  edgeStyle?: unknown;
  customSvg: {
    url: string;
    altText?: string | null;
  } | null;
}

export interface LifeGraphApiResponse {
  clusters: LifeGraphCluster[];
  entries: LifeGraphEntry[];
  relations: LifeGraphRelation[];
  settings: LifeGraphSettings | null;
}

export interface UseLifeGraphDataResult {
  data: LifeGraphApiResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}