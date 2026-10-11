import type { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";

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
  parentId?: string | null;
  image: {
    url: string;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
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

export interface LifeClusterRelation {
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
  customSvg: { url: string; altText?: string | null } | null;
}

export interface LifeGraphApiResponse {
  clusters: LifeGraphCluster[];
  entries: LifeGraphEntry[];
  relations: LifeClusterRelation[];
  settings: LifeGraphSettings | null;
}

export interface UseLifeGraphDataResult {
  data: LifeGraphApiResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export interface ClusterNode extends SimulationNodeDatum {
  kind: "cluster";
  id: string;
  label: string;
  color: string;
  count: number;
  photo: string;
  r: number;
  parent?: string | null;
  isParent?: boolean;
}

export interface EntryNode extends SimulationNodeDatum {
  kind: "entry";
  id: string;
  label: string;
  parent: string;
  date: string;
  r: number;
}

export type GraphNode = ClusterNode | EntryNode;

export interface GraphLink extends SimulationLinkDatum<GraphNode> {
  kind: "cluster" | "entry";
  weight: number;
}

export type PanelData =
  | { kind: "cluster"; cluster: ClusterNode }
  | { kind: "entry"; entry: EntryNode; parentColor: string; parentLabel: string }
  | null;

export const nodeId = (node: GraphNode | string): string =>
  typeof node === "string" ? node : node.id;
