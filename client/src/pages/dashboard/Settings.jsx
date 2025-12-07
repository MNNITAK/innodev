import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Switch } from "../../components/ui/switch.jsx";
import { Label } from "../../components/ui/label.jsx";

export default function SettingsPage() {
  // ... Copy JSX exactly from source ...
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Configure your simulation preferences and account settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Settings</CardTitle>
            <CardDescription>Configure how simulations run</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-save">Auto-save Results</Label>
                <p className="text-sm text-muted-foreground">Automatically save simulation results after completion</p>
              </div>
              <Switch id="auto-save" defaultChecked />
            </div>
            {/* ... Other switches ... */}
             <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email when simulations complete</p>
              </div>
              <Switch id="notifications" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="detailed-logs">Detailed Logging</Label>
                <p className="text-sm text-muted-foreground">Enable verbose logging for debugging</p>
              </div>
              <Switch id="detailed-logs" />
            </div>
          </CardContent>
        </Card>
        {/* ... Model Config Card ... */}
        <Card>
          <CardHeader>
            <CardTitle>Model Configuration</CardTitle>
            <CardDescription>DeGroot model parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="convergence">Fast Convergence Mode</Label>
                <p className="text-sm text-muted-foreground">Use optimized convergence algorithm</p>
              </div>
              <Switch id="convergence" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="real-time">Real-time Updates</Label>
                <p className="text-sm text-muted-foreground">Show live updates during simulation</p>
              </div>
              <Switch id="real-time" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your simulation data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start bg-transparent">Export All Data</Button>
            <Button variant="outline" className="w-full justify-start bg-transparent">Import Configuration</Button>
            <Button variant="outline" className="w-full justify-start bg-transparent text-red-500 hover:text-red-500">Clear Simulation History</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}