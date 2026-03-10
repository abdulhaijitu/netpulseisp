

## Plan: Aceternity-Style Animated Sidebar

### What We're Doing
Replace the current shadcn sidebar with an Aceternity UI-inspired animated sidebar that expands on hover (desktop) and uses a slide-out drawer on mobile. Install `framer-motion` for smooth animations.

### Changes

**1. Install dependency**
- `framer-motion`

**2. Create `src/components/ui/animated-sidebar.tsx`**
- Adapted from the Aceternity sidebar component, converted from Next.js (`Link`/`Image`) to React Router (`NavLink`/`<img>`)
- Exports: `SidebarProvider`, `useSidebar`, `Sidebar`, `SidebarBody`, `DesktopSidebar`, `MobileSidebar`, `SidebarLink`
- Desktop: narrow icon strip (60px) that expands to 240px on hover with framer-motion `animate`
- Mobile: hamburger menu with AnimatePresence slide-in overlay

**3. Rewrite `src/components/layout/DashboardSidebar.tsx`**
- Replace shadcn `Sidebar` imports with new `animated-sidebar` imports
- Use `SidebarBody` containing logo, nav links (Main Menu + System sections), and footer with user info + logout
- Keep all existing logic: role-based filtering, branding, profile query, reseller nav
- Translate remaining Bengali strings (reseller nav items, role display names, "Loading...", "Logout")
- On hover expand: show labels next to icons; collapsed: icons only

**4. Update `src/components/layout/DashboardLayout.tsx`**
- Replace shadcn `SidebarProvider` with the new animated `SidebarProvider`
- Remove the old shadcn provider wrapper
- Translate remaining Bengali text in impersonation banner

**5. Update `src/components/layout/DashboardHeader.tsx`**
- Remove `SidebarTrigger` import from shadcn (no longer needed — sidebar auto-expands on hover)
- Keep mobile trigger or let the animated sidebar handle its own mobile toggle

### Visual Result
- Desktop: slim icon-only sidebar on the left, smoothly expands with labels on mouse hover
- Mobile: hamburger icon in header opens a full-height animated slide-in sidebar
- Same dark/themed styling, same nav structure, same role-based access

