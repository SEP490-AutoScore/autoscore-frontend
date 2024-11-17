import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function useHeader({
  breadcrumbLink,
  breadcrumbPage,
  breadcrumbLink_2,
  breadcrumbPage_2,
  breadcrumbPage_3,
}: {
  breadcrumbLink?: string;
  breadcrumbPage: string;
  breadcrumbLink_2?: string;
  breadcrumbPage_2?: string;
  breadcrumbPage_3?: string;
}) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              {breadcrumbPage_2 ? (
                <BreadcrumbLink href={breadcrumbLink}>
                  {breadcrumbPage}
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
                    <BreadcrumbLink href={breadcrumbLink_2}>
                      {breadcrumbPage_2}
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
