import Logo from "../assets/autoscore_logo.png";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AutoScoreSwitcher(
  { campus }: { campus: string | { name: string } }
) {
  const campusName = typeof campus === "string" ? campus : campus.name;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="pointer-events-none"
            >
              <img src={Logo} alt="Logo" className="flex size-8 items-center justify-center"/>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Auto Score</span>
                <span className="truncate text-xs">{campusName}</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
