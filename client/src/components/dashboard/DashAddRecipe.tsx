import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, PlusCircle, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { DashHeader } from "./DashHeader";

export function DashAddRecipe() {
  return (
    <div className="flex flex-col min-h-screen w-full sm:gap-4 sm:py-4 sm:pl-14 flex-col">
      <DashHeader />
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Add Recipe
            </h1>

            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button variant="outline" size="sm">
                Save Recipe
              </Button>
            </div>
          </div>
          <Select>
            <SelectTrigger id="category" aria-label="Select Method">
              <SelectValue placeholder="Manual" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clothing">Manual</SelectItem>
              <SelectItem value="electronics">Url Only</SelectItem>
            </SelectContent>
          </Select>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-0">
                <CardHeader>
                  <CardTitle>Recipe Details</CardTitle>
                  <CardDescription>Fill in your recipe details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Title</Label>
                      <Input
                        id="title"
                        type="text"
                        className="w-full"
                        defaultValue="Vul hier de titel in"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                        className="min-h-32"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">Werkwijze</Label>
                      <Textarea
                        id="werkwijze"
                        defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                        className="min-h-32"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">
                        Bereidtijd (in minuten)
                      </Label>
                      <Input id="stock-1" type="number" defaultValue="60" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Ingredienten</CardTitle>
                  <CardDescription>
                    Lipsum dolor sit amet, consectetur adipiscing elit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ingredient</TableHead>
                        <TableHead>Aantal</TableHead>
                        <TableHead>Eenheid</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Label htmlFor="stock-1" className="sr-only">
                            Ingredient
                          </Label>
                          <Input
                            id="stock-1"
                            type="number"
                            defaultValue="100"
                          />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="stock-1" className="sr-only">
                            Aantal
                          </Label>
                          <Input
                            id="stock-1"
                            type="number"
                            defaultValue="100"
                          />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="price-1" className="sr-only">
                            Eenheid
                          </Label>
                          <Input
                            id="price-1"
                            type="number"
                            defaultValue="99.99"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Label htmlFor="stock-1" className="sr-only">
                            Ingredient
                          </Label>
                          <Input
                            id="stock-1"
                            type="number"
                            defaultValue="100"
                          />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="stock-2" className="sr-only">
                            Aantal
                          </Label>
                          <Input
                            id="stock-2"
                            type="number"
                            defaultValue="143"
                          />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="price-2" className="sr-only">
                            Eenheid
                          </Label>
                          <Input
                            id="price-2"
                            type="number"
                            defaultValue="99.99"
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Label htmlFor="stock-1" className="sr-only">
                            Ingredient
                          </Label>
                          <Input
                            id="stock-1"
                            type="number"
                            defaultValue="100"
                          />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="stock-3" className="sr-only">
                            Aantal
                          </Label>
                          <Input id="stock-3" type="number" defaultValue="32" />
                        </TableCell>
                        <TableCell>
                          <Label htmlFor="price-3" className="sr-only">
                            Eenheid
                          </Label>
                          <Input
                            id="price-3"
                            type="number"
                            defaultValue="99.99"
                          />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="justify-center border-t p-4">
                  <Button size="sm" variant="ghost" className="gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Ingredient
                  </Button>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-07-chunk-1">
                <CardHeader>
                  <CardTitle>Je zou het maar (w)eten</CardTitle>
                  <CardDescription>
                    Vul hier je tips in voor dit recept
                  </CardDescription>
                  <Textarea
                    id="tips"
                    defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                    className="min-h-32"
                  />
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger id="status" aria-label="Select status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Active</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                  <CardDescription>Your Recipe Image Here</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <img
                      alt="Product image"
                      className="aspect-square w-full rounded-md object-cover"
                      height="300"
                      src="https://via.placeholder.com/300"
                      width="300"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      <button>
                        <img
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="84"
                          src="https://via.placeholder.com/84"
                          width="84"
                        />
                      </button>
                      <button>
                        <img
                          alt="Product image"
                          className="aspect-square w-full rounded-md object-cover"
                          height="84"
                          src="https://via.placeholder.com/84"
                          width="84"
                        />
                      </button>
                      <button className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* <Card x-chunk="dashboard-07-chunk-5">
                  <CardHeader>
                    <CardTitle>Archive Product</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" variant="outline">
                      Archive Product
                    </Button>
                  </CardContent>
                </Card> */}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden">
            <Button variant="outline" size="sm">
              Discard
            </Button>
            <Button size="sm">Save Product</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
