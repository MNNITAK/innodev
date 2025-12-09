import DashboardSidebar from "../../components/dashboard/DashboardSidebar.jsx";
import DashboardHeader from "../../components/dashboard/DashboardHeader.jsx";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar - fixed width, separate scroll context */}
      <DashboardSidebar />
      
      {/* Main Content Wrapper - One single scrollable area for Header + Page Content */}
      <div className="flex-1 h-full overflow-y-auto relative isolate scroll-smooth">
        {/* Header flows naturally, so it scrolls up/hides when user scrolls down */}
        <DashboardHeader />
        
        {/* Main Page Content */}
        <main className="w-full p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;