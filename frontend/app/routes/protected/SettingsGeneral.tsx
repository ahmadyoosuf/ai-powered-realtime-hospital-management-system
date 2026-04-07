import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Settings2 } from "lucide-react";

export function meta() {
  return [{ title: "Settings - General" }];
}

const SettingsGeneral = () => {
  return (
    <Card className="card shadow-sm border-none">
      <CardHeader className="text-center py-16">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-primary/10 p-4">
            <Settings2 className="h-10 w-10 text-primary" />
          </div>
        </div>
        <CardTitle className="font-bold text-2xl">General Settings</CardTitle>
        <CardDescription className="text-base mt-2">
          This feature is coming soon. You will be able to configure general
          system settings from this page.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center pb-16">
        <p className="text-sm text-muted-foreground">
          We are working hard to bring this feature to you. Stay tuned!
        </p>
      </CardContent>
    </Card>
  );
};

export default SettingsGeneral;
