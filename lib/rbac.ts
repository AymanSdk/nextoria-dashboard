import { RolePermissions } from "@/types";

// Define role-based permissions for your agency
export const rolePermissions: RolePermissions[] = [
  {
    role: "Admin",
    permissions: [
      { resource: "users", actions: ["create", "read", "update", "delete"] },
      { resource: "projects", actions: ["create", "read", "update", "delete"] },
      { resource: "clients", actions: ["create", "read", "update", "delete"] },
      {
        resource: "campaigns",
        actions: ["create", "read", "update", "delete"],
      },
      { resource: "content", actions: ["create", "read", "update", "delete"] },
      { resource: "leads", actions: ["create", "read", "update", "delete"] },
      { resource: "tasks", actions: ["create", "read", "update", "delete"] },
      { resource: "invoices", actions: ["create", "read", "update", "delete"] },
      { resource: "analytics", actions: ["read"] },
      { resource: "settings", actions: ["read", "update"] },
    ],
  },
  {
    role: "Marketer",
    permissions: [
      { resource: "projects", actions: ["create", "read", "update"] },
      { resource: "clients", actions: ["create", "read", "update"] },
      {
        resource: "campaigns",
        actions: ["create", "read", "update", "delete"],
      },
      { resource: "content", actions: ["create", "read", "update"] },
      { resource: "leads", actions: ["create", "read", "update", "delete"] },
      { resource: "tasks", actions: ["create", "read", "update"] },
      { resource: "analytics", actions: ["read"] },
    ],
  },
  {
    role: "Designer",
    permissions: [
      { resource: "projects", actions: ["read", "update"] },
      { resource: "clients", actions: ["read"] },
      { resource: "content", actions: ["create", "read", "update", "delete"] },
      { resource: "tasks", actions: ["read", "update"] },
      { resource: "campaigns", actions: ["read"] },
    ],
  },
  {
    role: "Developer",
    permissions: [
      { resource: "projects", actions: ["read", "update"] },
      { resource: "clients", actions: ["read"] },
      { resource: "campaigns", actions: ["read"] },
      { resource: "tasks", actions: ["read", "update"] },
      { resource: "analytics", actions: ["read"] },
    ],
  },
];

// Resource access mapping for navigation
export const resourceNavigation = {
  users: "/profile",
  clients: "/clients",
  campaigns: "/campaigns",
  content: "/content",
  leads: "/leads",
  tasks: "/tasks",
  invoices: "/invoices",
  analytics: "/analytics",
  settings: "/settings",
};

// Navigation items with required permissions
export const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: "Home",
    resource: "dashboard",
    action: "read",
  },
  {
    name: "Clients",
    href: "/clients",
    icon: "Users",
    resource: "clients",
    action: "read",
  },
  {
    name: "Campaigns",
    href: "/campaigns",
    icon: "Target",
    resource: "campaigns",
    action: "read",
  },
  {
    name: "Content Calendar",
    href: "/content",
    icon: "Calendar",
    resource: "content",
    action: "read",
  },
  {
    name: "Leads",
    href: "/leads",
    icon: "MessageSquare",
    resource: "leads",
    action: "read",
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: "Zap",
    resource: "tasks",
    action: "read",
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: "BarChart3",
    resource: "analytics",
    action: "read",
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: "FileText",
    resource: "invoices",
    action: "read",
  },
];

/**
 * Check if a user has permission to perform an action on a resource
 */
export function hasPermission(
  userRole: string,
  resource: string,
  action: string
): boolean {
  // Admin has all permissions
  if (userRole === "Admin") return true;

  const rolePermission = rolePermissions.find((rp) => rp.role === userRole);
  if (!rolePermission) return false;

  const resourcePermission = rolePermission.permissions.find(
    (p) => p.resource === resource
  );
  if (!resourcePermission) return false;

  return resourcePermission.actions.includes(action);
}

/**
 * Get all accessible navigation items for a user role
 */
export function getAccessibleNavigation(userRole: string) {
  return navigationItems.filter((item) =>
    hasPermission(userRole, item.resource, item.action)
  );
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(userRole: string, pathname: string): boolean {
  // Dashboard is accessible to all authenticated users
  if (pathname === "/") return true;

  // Find the navigation item for this route
  const navItem = navigationItems.find((item) => item.href === pathname);
  if (!navItem) return true; // Unknown routes are accessible by default

  return hasPermission(userRole, navItem.resource, navItem.action);
}

/**
 * Filter data based on user role and permissions
 */
export function filterDataByRole<T>(
  data: T[],
  userRole: string,
  userName: string,
  resource: string
): T[] {
  // Admin sees all data
  if (userRole === "Admin") return data;

  // For other roles, filter based on business logic
  switch (resource) {
    case "projects":
      // All roles can see projects they're involved in
      return data.filter(
        (item: any) =>
          item.projectManager === userName ||
          item.assignedTeam.includes(userName) ||
          item.createdBy === userName
      );

    case "clients":
      // Marketers see all clients, Designers/Developers see only assigned ones
      if (userRole === "Marketer") return data;
      return data.filter((item: any) => item.assignedManager === userName);

    case "campaigns":
      // Marketers see all campaigns, others see only assigned ones
      if (userRole === "Marketer") return data;
      return data.filter((item: any) => item.assignedTo === userName);

    case "content":
      // Designers see all content, others see only assigned ones
      if (userRole === "Designer") return data;
      return data.filter((item: any) => item.assignedTo === userName);

    case "leads":
      // Only marketers and admins see leads
      if (userRole === "Marketer") return data;
      return [];

    case "tasks":
      // Everyone sees only their assigned tasks
      return data.filter((item: any) => item.assignedTo === userName);

    case "invoices":
      // Only admins and marketers see invoices
      if (["Admin", "Marketer"].includes(userRole)) return data;
      return [];

    default:
      return data;
  }
}

/**
 * Get role-specific dashboard stats
 */
export function getRoleBasedStats(
  userRole: string,
  userName: string,
  allData: any
) {
  const { clients, campaigns, content, leads, tasks, invoices } = allData;

  const filteredClients = filterDataByRole(
    clients,
    userRole,
    userName,
    "clients"
  );
  const filteredCampaigns = filterDataByRole(
    campaigns,
    userRole,
    userName,
    "campaigns"
  );
  const filteredContent = filterDataByRole(
    content,
    userRole,
    userName,
    "content"
  );
  const filteredLeads = filterDataByRole(leads, userRole, userName, "leads");
  const filteredTasks = filterDataByRole(tasks, userRole, userName, "tasks");
  const filteredInvoices = filterDataByRole(
    invoices,
    userRole,
    userName,
    "invoices"
  );

  return {
    totalClients: filteredClients.length,
    activeCampaigns: filteredCampaigns.filter((c: any) => c.status === "Active")
      .length,
    newLeadsThisWeek: filteredLeads.filter((l: any) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(l.createdAt) > weekAgo;
    }).length,
    upcomingContent: filteredContent.filter((c: any) => {
      const upcoming = new Date();
      upcoming.setDate(upcoming.getDate() + 7);
      return new Date(c.scheduledDate) <= upcoming && c.status !== "Published";
    }).length,
    pendingTasks: filteredTasks.filter((t: any) =>
      ["Todo", "In Progress"].includes(t.status)
    ).length,
    completedTasks: filteredTasks.filter((t: any) => t.status === "Done")
      .length,
    monthlyRevenue: hasPermission(userRole, "invoices", "read")
      ? filteredInvoices
          .filter((i: any) => i.status === "Paid")
          .reduce((sum: number, i: any) => sum + i.amount, 0)
      : 0,
    conversionRate:
      filteredLeads.length > 0
        ? Math.round(
            (filteredLeads.filter((l: any) => l.status === "Converted").length /
              filteredLeads.length) *
              100
          )
        : 0,
  };
}

/**
 * Role-based UI configuration
 */
export const roleConfig = {
  Admin: {
    color: "#DC2626", // red-600
    badge: "bg-red-100 text-red-800",
    description: "Full access to all features and settings",
  },
  Marketer: {
    color: "#7C3AED", // violet-600
    badge: "bg-violet-100 text-violet-800",
    description: "Manage campaigns, leads, and client relationships",
  },
  Designer: {
    color: "#0891B2", // cyan-600
    badge: "bg-cyan-100 text-cyan-800",
    description: "Create and manage content and design assets",
  },
  Developer: {
    color: "#059669", // emerald-600
    badge: "bg-emerald-100 text-emerald-800",
    description: "Access to technical tasks and analytics",
  },
};
