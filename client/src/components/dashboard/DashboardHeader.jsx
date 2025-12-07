import { LogOut as LogOutIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth0 } from "@auth0/auth0-react";

function DashboardHeader() {
  const { logout } = useAuth0();   // ← hook must be here

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });å
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search policies..." className="pl-9 bg-background" />
      </div>

      <div className="flex items-center gap-4">
        <Button 
        className="gap-2"
          onClick={handleLogout}>
          <LogOutIcon className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default DashboardHeader;
