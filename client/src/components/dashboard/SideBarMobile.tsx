import {
    Home,
    LineChart,
    Package,
    PanelLeft,
    ShoppingCart,
    Users2,
  } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
  import { Link } from "react-router-dom"

export const SideBarMobile = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" to={""}                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                   className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" to={""}                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                   className="flex items-center gap-4 px-2.5 text-foreground" to={""}                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                   className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" to={""}                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                   className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground" to={""}                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
    )
}