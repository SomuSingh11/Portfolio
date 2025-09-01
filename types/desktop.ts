export interface WindowData {
  id: string;
  title: string;
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  innerWidth?: number;
  innerHeight?: number;
}

export interface IconData {
  id: string;
  name: string;
  icon: string;
  position: { x: number; y: number };
}

export interface DesktopContextMenuData {
  x: number;
  y: number;
  items: ContextMenuItem[];
}

export interface ContextMenuItem {
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
}
