"use client";

import { useState } from "react";
import type { Board } from "@/types";

const NAV_ICONS = {
  inbox: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2a1 1 0 0 1-.293.707L13 10.414V17a1 1 0 0 1-1.447.894l-4-2A1 1 0 0 1 7 15v-4.586L3.293 6.707A1 1 0 0 1 3 6V4Z" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 17a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M15.5 2A1.5 1.5 0 0 0 14 3.5v13a1.5 1.5 0 0 0 3 0v-13A1.5 1.5 0 0 0 15.5 2ZM10.5 6A1.5 1.5 0 0 0 9 7.5v9a1.5 1.5 0 0 0 3 0v-9A1.5 1.5 0 0 0 10.5 6ZM5.5 10A1.5 1.5 0 0 0 4 11.5v5a1.5 1.5 0 0 0 3 0v-5A1.5 1.5 0 0 0 5.5 10Z" />
    </svg>
  ),
  folder: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M3.75 3A1.75 1.75 0 0 0 2 4.75v3.26a3.235 3.235 0 0 1 1.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM3.75 9A1.75 1.75 0 0 0 2 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-4.5A1.75 1.75 0 0 0 16.25 9H3.75Z" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M13.78 7.59a.75.75 0 0 0-.78-.84h-3.06l.8-3.6a.75.75 0 0 0-1.398-.446L5.1 10.25a.75.75 0 0 0 .65 1.1h3.26l-.8 3.6a.75.75 0 0 0 1.398.446l4.22-7.5a.75.75 0 0 0 .95-1.256Z" clipRule="evenodd" />
    </svg>
  ),
  question: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M7.84 1.804A1 1 0 0 1 8.82 1h2.36a1 1 0 0 1 .98.804l.331 1.652a6.993 6.993 0 0 1 1.929 1.115l1.598-.54a1 1 0 0 1 1.186.447l1.18 2.044a1 1 0 0 1-.205 1.251l-1.267 1.113a7.047 7.047 0 0 1 0 2.228l1.267 1.113a1 1 0 0 1 .205 1.251l-1.18 2.044a1 1 0 0 1-1.186.447l-1.598-.54a6.993 6.993 0 0 1-1.929 1.115l-.33 1.652a1 1 0 0 1-.98.804H8.82a1 1 0 0 1-.98-.804l-.331-1.652a6.993 6.993 0 0 1-1.929-1.115l-1.598.54a1 1 0 0 1-1.186-.447l-1.18-2.044a1 1 0 0 1 .205-1.251l1.267-1.113a7.047 7.047 0 0 1 0-2.228L1.821 7.773a1 1 0 0 1-.205-1.251l1.18-2.044a1 1 0 0 1 1.186-.447l1.598.54A6.992 6.992 0 0 1 7.51 3.456l.33-1.652ZM10 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-1.048a.75.75 0 1 0-1.06-1.06l-2.5 2.5a.75.75 0 0 0 0 1.06l2.5 2.5a.75.75 0 0 0 1.06-1.06l-1.048-1.048h9.546A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
    </svg>
  ),
  task: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M6 4.75A.75.75 0 0 1 6.75 4h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 4.75ZM6 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 10Zm0 5.25a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H6.75a.75.75 0 0 1-.75-.75ZM1.99 4.75a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 15.25a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1v-.01ZM1.99 10a1 1 0 0 1 1-1H3a1 1 0 0 1 1 1v.01a1 1 0 0 1-1 1h-.01a1 1 0 0 1-1-1V10Z" clipRule="evenodd" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z" clipRule="evenodd" />
    </svg>
  ),
  note: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h6.879a1.5 1.5 0 0 1 1.06.44l4.122 4.12A1.5 1.5 0 0 1 17 7.622V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13Z" />
    </svg>
  ),
  report: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 1a6 6 0 0 0-3.815 10.631C7.237 12.5 8 13.443 8 14.456v.644a.75.75 0 0 0 .572.729 6.016 6.016 0 0 0 2.856 0A.75.75 0 0 0 12 15.1v-.644c0-1.013.762-1.957 1.815-2.825A6 6 0 0 0 10 1ZM8.863 17.414a.75.75 0 0 0-.226 1.483 9.066 9.066 0 0 0 2.726 0 .75.75 0 0 0-.226-1.483 7.553 7.553 0 0 1-2.274 0Z" />
    </svg>
  ),
  view: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41Z" clipRule="evenodd" />
    </svg>
  ),
  timeline: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
    </svg>
  ),
  chevronDown: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  ),
  chevronRight: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
  ),
};

interface WorkspaceItem {
  id: string;
  name: string;
  active?: boolean;
  dot?: "green" | "blue" | "orange";
  children?: WorkspaceItem[];
}

interface SidebarProps {
  board: Board | null;
  onAddTask?: (columnId: string) => void;
}

export default function Sidebar({ board }: SidebarProps) {
  const [workspaceOpen, setWorkspaceOpen] = useState(true);
  const [dashboardOpen, setDashboardOpen] = useState(true);
  const [activeNav, setActiveNav] = useState("bolt");
  const [searchQuery, setSearchQuery] = useState("");

  const workspaceItems: WorkspaceItem[] = [
    { id: "sales", name: "Sales CRM", dot: "green" },
    {
      id: "dashboard-crm",
      name: "Dashboard CRM",
      dot: "green",
      children: [
        { id: "task", name: "Task", active: true },
        { id: "calendar", name: "Calendar" },
        { id: "notes", name: "Notes" },
        { id: "report", name: "Report" },
        { id: "view", name: "View" },
      ],
    },
    { id: "project-mgmt", name: "Project Management", dot: "green" },
    { id: "dashboard-saas", name: "Dashboard Saas", dot: "blue" },
    { id: "hr-payroll", name: "HR Payroll", dot: "blue" },
    { id: "job-screening", name: "Job Screening", dot: "green" },
  ];

  const iconMap: Record<string, keyof typeof NAV_ICONS> = {
    task: "task",
    calendar: "calendar",
    notes: "note",
    report: "report",
    view: "view",
  };

  return (
    <aside className="sidebar flex h-full">
      {/* Icon rail */}
      <div className="icon-rail flex flex-col items-center py-4 gap-1">
        {(
          [
            "inbox",
            "users",
            "chart",
            "folder",
            "bolt",
            "question",
            "settings",
          ] as const
        ).map((icon, i) => (
          <button
            key={icon}
            onClick={() => setActiveNav(icon)}
            className={`icon-rail-btn ${activeNav === icon ? "active" : ""} ${i === 4 ? "mt-auto-marker" : ""}`}
            style={i === 5 ? { marginTop: "auto" } : {}}
            aria-label={icon}
          >
            {NAV_ICONS[icon]}
          </button>
        ))}
        <button className="icon-rail-btn logout-btn" aria-label="Logout">
          {NAV_ICONS.logout}
        </button>
      </div>

      {/* Main sidebar panel */}
      <div className="sidebar-panel flex flex-col h-full overflow-hidden">
        {/* Logo / Workspace header */}
        <div className="sidebar-header">
          <div className="workspace-logo">
            <span className="logo-icon">⚙</span>
          </div>
          <div className="workspace-info">
            <span className="workspace-name">{board?.name ?? "TaskFlow"}</span>
            <span className="workspace-badge">PRO</span>
          </div>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <span className="search-icon">{NAV_ICONS.search}</span>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <span className="search-shortcut">⌘K</span>
        </div>

        {/* Nav items */}
        <div className="sidebar-nav flex-1 overflow-y-auto">
          {/* Workspace section */}
          <div className="nav-section">
            <button
              className="nav-section-header"
              onClick={() => setWorkspaceOpen((v) => !v)}
            >
              <span className="nav-section-title">WORKSPACE</span>
              <span
                className={`nav-section-chevron ${workspaceOpen ? "open" : ""}`}
              >
                {NAV_ICONS.chevronDown}
              </span>
            </button>

            {workspaceOpen && (
              <ul className="nav-list">
                {workspaceItems.map((item) => (
                  <li key={item.id}>
                    {item.children ? (
                      <>
                        <button
                          className="nav-item nav-item-expandable"
                          onClick={() => setDashboardOpen((v) => !v)}
                        >
                          <span className="nav-item-icon">
                            {NAV_ICONS.folder}
                          </span>
                          <span className="nav-item-label">{item.name}</span>
                          <span
                            className={`nav-item-chevron ${dashboardOpen ? "open" : ""}`}
                          >
                            {NAV_ICONS.chevronDown}
                          </span>
                        </button>
                        {dashboardOpen && (
                          <ul className="nav-children">
                            {item.children.map((child) => (
                              <li key={child.id}>
                                <button
                                  className={`nav-child-item ${child.active ? "active" : ""}`}
                                >
                                  <span className="nav-child-icon">
                                    {NAV_ICONS[
                                      iconMap[child.id] ?? "task"
                                    ] ?? NAV_ICONS.task}
                                  </span>
                                  <span className="nav-child-label">
                                    {child.name}
                                  </span>
                                </button>
                              </li>
                            ))}
                            <li>
                              <button className="nav-child-item">
                                <span className="nav-child-icon">
                                  {NAV_ICONS.timeline}
                                </span>
                                <span className="nav-child-label">
                                  Timeline
                                </span>
                                <span className="dot dot-green" />
                              </button>
                            </li>
                          </ul>
                        )}
                      </>
                    ) : (
                      <button className="nav-item">
                        <span className="nav-item-icon">
                          {NAV_ICONS.folder}
                        </span>
                        <span className="nav-item-label">{item.name}</span>
                        {item.dot && (
                          <span className={`dot dot-${item.dot}`} />
                        )}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
