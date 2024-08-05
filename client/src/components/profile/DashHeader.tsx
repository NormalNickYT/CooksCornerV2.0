import { Link, useLocation } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { DashSideBarMobile } from "./DashSideBarMobile";
import React from "react";

export const DashHeader = () => {
  const location = useLocation();

  // Functie om de breadcrumbs te genereren
  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter(x => x);

    return pathnames.map((segment, index) => {
      const breadcrumbPath = `/${pathnames.slice(0, index + 1).join('/')}`;
      const isLast = index === pathnames.length - 1;
      const capitalizedSegment = segment.charAt(0).toUpperCase() + segment.slice(1);

      return (
        <React.Fragment key={breadcrumbPath}>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to={breadcrumbPath}>{capitalizedSegment}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {!isLast && (
            <span className="mx-2 text-gray-500">{'>'}</span>
          )}
        </React.Fragment>
      );
    });
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <DashSideBarMobile />
      <Breadcrumb className="hidden md:flex">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              <Link to="/dashboard" className="font-semibold"></Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {generateBreadcrumbs()}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};
