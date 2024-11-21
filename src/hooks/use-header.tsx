import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

export function useHeader({
  breadcrumbLink,
  breadcrumbPage,
  breadcrumbLink_2,
  breadcrumbPage_2,
  breadcrumbPage_3,
  stateGive, // Optional state parameter
}: {
  breadcrumbLink?: string;
  breadcrumbPage: string;
  breadcrumbLink_2?: string;
  breadcrumbPage_2?: string;
  breadcrumbPage_3?: string;
  stateGive?: any; // Optional state type (can be anything, adjust as necessary)
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 sticky top-0 z-10 bg-background">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              {breadcrumbPage_2 ? (
                <BreadcrumbLink asChild>
                  <Link to={breadcrumbLink || ""}>{breadcrumbPage}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{breadcrumbPage}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {breadcrumbPage_2 && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  {breadcrumbPage_3 ? (
                    <BreadcrumbLink asChild>
                      <Link to={breadcrumbLink_2 || ""} state={stateGive}>{breadcrumbPage_2}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{breadcrumbPage_2}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </>
            )}
            {breadcrumbPage_3 && (
              <>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{breadcrumbPage_3}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
