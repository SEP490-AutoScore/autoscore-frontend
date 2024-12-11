import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface CardHeaderProps {
  title: string;
  description: string;
  content: string;
  icon: LucideIcon;
}

export function CardHeaderDashboard({
  title,
  description,
  content,
  icon: Icon,
}: CardHeaderProps) {
  return (
    <Card className="rounded-xl px-4 border bg-card text-card-foreground shadow flex items-center justify-left">
      <div className="p-4 h-16 w-16 text-white rounded-md bg-primary flex items-center justify-left px-4">
        <Icon className="h-6 w-6" />
      </div>
      <div className="w-full">
        <CardHeader className="pl-4">
          <CardTitle>{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
          <CardDescription className="text-sm">{content}</CardDescription>
        </CardHeader>
      </div>
    </Card>
  );
}
