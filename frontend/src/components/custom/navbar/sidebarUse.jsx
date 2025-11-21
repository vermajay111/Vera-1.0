import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/navbar/app-sidebar";

export default function sidebarUse({
  breadcrumbPage,
  contentClass = "",
  children,
}) {
  return (
    <>
      <AppSidebar />

      <SidebarInset>
        {/* NAVBAR / HEADER */}
        <header
          className="sticky top-0 flex h-16 items-center gap-2 px-4 
                     border-b border-gray-800 bg-black/40 backdrop-blur-md 
                     z-40"
        >
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />

          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Vera</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{breadcrumbPage}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        {/* PAGE CONTENT (controlled via props) */}
        <div className={contentClass}>{children}</div>
      </SidebarInset>
      </>
  );
}
