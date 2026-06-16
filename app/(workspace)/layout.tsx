// Bypasses the dashboard sidebar/topbar shell. The root layout still provides
// <html>/<body> + ClerkProvider; this group renders full-viewport pages.
export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return children
}
