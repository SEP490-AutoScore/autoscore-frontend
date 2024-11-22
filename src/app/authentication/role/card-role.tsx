import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import { Separator } from "@/components/ui/separator";
  import { EllipsisVertical } from "lucide-react";
  
  interface RoleProps {
    roleId: number;
    roleName: string;
    roleCode: string;
    description: string;
    status: boolean;
    lastUpdatedAt: string;
    lastUpdatedBy: string;
    totalUser: number;
  }
  
  export function CardRole({
    roleName,
    description,
    totalUser,
    lastUpdatedAt,
  }: RoleProps) {
    return (
      <Card className="w-full">
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>{roleName}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Role Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">View Detail</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Update</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <p>{description}</p>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter>
          <div className="flex w-full flex-col">
            <div className="flex items-center justify-between">
              <p>{totalUser}</p>
              <p>{lastUpdatedAt}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Participants</p>
              <p className="text-muted-foreground">Last Updated</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  }
  