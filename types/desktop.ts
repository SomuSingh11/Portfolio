/**
 * 🖥️ Desktop Window Management Types
 *
 * This file defines the core TypeScript types used to manage a desktop-like UI system.
 * It acts as the single source of truth for:
 *
 * - Application identifiers (AppId)
 * - Window lifecycle and state management (normal, minimized, maximized)
 * - Window metadata such as position, size, and stacking order (z-index)
 * - Desktop icons and their layout
 * - Context menu structure and actions
 */

export type AppId =
  | "terminal"
  | "projects"
  | "about"
  | "skills"
  | "contact"
  | "github"
  | "resume"
  | "hashnode"
  | "achievements";

// Single source of truth for window state — can't be both minimized AND maximized
export type WindowState = "normal" | "minimized" | "maximized";

export interface WindowData {
  id: AppId;
  title: string;
  content: AppId;
  position: { x: number; y: number };
  size: { width: number; height: number };
  windowState: WindowState;
  zIndex: number;
}

export interface IconData {
  id: AppId;
  name: string;
  icon: string;
  position: { x: number; y: number };
}

export interface ContextMenuItem {
  label: string;
  icon?: string;
  action: () => void;
  disabled?: boolean;
}

export interface DesktopContextMenuData {
  x: number;
  y: number;
  items: ContextMenuItem[];
}
