import { useState } from "react";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ManualRecipe,
  manualRecipeSchema,
  URLRecipe,
  urlRecipeSchema,
} from "@/schemas/Recipe";
import { createManualRecipe } from "@/services/api/recipeService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MultipleSelector, { Option } from "@/components/ui/multi-select";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import FileUpload from "../ui/file-upload";
import { useAuth } from "@/context/AuthProvider";

type RecipeFormProps = {
  onRecipePosted: () => void;
};

const RecipeForm = ({ onRecipePosted }: RecipeFormProps) => {
  const [formType, setFormType] = useState<"manual" | "url">("manual");
  const [ingredients, setIngredients] = useState([
    { name: "", amount: "", unit: "" },
  ]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { user } = useAuth();

  const categoriesList: Option[] = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Diner", label: "Diner" },
    { value: "Dessert", label: "Dessert" },
    { value: "Sidedish", label: "Sidedish" },
  ];

  const {
    control,
    register: registerManual,
    handleSubmit: handleSubmitManual,
    formState: { errors: errorsManual, isSubmitting },
    setValue,
  } = useForm<ManualRecipe>({
    resolver: zodResolver(manualRecipeSchema),
  });

  const {
    register: registerURL,
    handleSubmit: handleSubmitURL,
    formState: { errors: errorsURL },
  } = useForm<URLRecipe>({
    resolver: zodResolver(urlRecipeSchema),
  });

  const handleFormTypeChange = (value: "manual" | "url") => {
    setFormType(value);
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", unit: "" }]);
  };

  const handleDeleteIngredient = (index: number) => {
    setIngredients((oldValues) => {
      return oldValues.filter((_, i) => i !== index);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      setSelectedImage(file);
      setValue("image", file, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });
    }
  };

  const handleManualSubmit: SubmitHandler<ManualRecipe> = async (data) => {
    if (!user?.id) {
      console.error("User ID is missing");
      return;
    }

    const completeData = {
      ...data,
      status,
      selectedCategories,
      userId: String(user.id),
    };

    try {
      await createManualRecipe(completeData);
      onRecipePosted();
    } catch (error) {
      console.error("Error creating recipe:", error);
    }
  };

  const handleURLSubmit: SubmitHandler<URLRecipe> = async (data) => {
    console.log("Testing URL Submit", data);
    // try {
    //   await createURLRecipe(data);
    // } catch (error) {
    //   console.error("Error creating recipe:", error);
    // }
  };

  const convertToOptions = (
    selectedValues: string[],
    optionsList: Option[],
  ): Option[] => {
    return optionsList.filter((option) =>
      selectedValues.includes(option.value),
    );
  };

  const optionsToValues = (options: Option[]): string[] => {
    return options.map((option) => option.value);
  };

  return (
    <div>
      <Select defaultValue={formType} onValueChange={handleFormTypeChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="manual">Manual</SelectItem>
          <SelectItem value="url">URL Only</SelectItem>
        </SelectContent>
      </Select>{" "}
      <br></br>
      {formType === "manual" ? (
        <form
          id="submitrecipe"
          onSubmit={handleSubmitManual(handleManualSubmit)}
        >
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recept Informatie</CardTitle>
                  <CardDescription>
                    Vul de details in van het recept
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="title">Title*</Label>
                      <Input
                        id="title"
                        placeholder="Geef je recept een titel"
                        {...registerManual("title", {
                          required: "Title is required",
                        })}
                      />
                      {errorsManual.title && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errorsManual.title.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="description">
                        Description (optioneel)
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Share je story over het recept en wat het speciaal maakt"
                        {...registerManual("description")}
                        className="min-h-32"
                      />
                      {errorsManual.description && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errorsManual.description.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="approach">Werkwijze*</Label>
                      <Textarea
                        id="approach"
                        placeholder="Leg uit hoe u uw recept moet maken, inclusief oventemperaturen, bak- of bereidingstijden en pangroottes, enz. Gebruik optionele kopteksten om de verschillende delen van het recept te ordenen (d.w.z. Voorbereiden, Bakken, Versieren)."
                        {...registerManual("approach")}
                        className="min-h-32"
                      />
                      {errorsManual.approach && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errorsManual.approach.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="preparationTime">
                        Bereidtijd (in minuten)
                      </Label>
                      <Input
                        id="preparationTime"
                        type="number"
                        {...registerManual("preparationTime", {
                          valueAsNumber: true,
                        })}
                        defaultValue={0}
                      />
                      {errorsManual.preparationTime && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errorsManual.preparationTime.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ingredienten*</CardTitle>
                  <CardDescription>Vul de ingredienten in</CardDescription>
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
                      {ingredients.map((ingredient, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Label
                              htmlFor={`ingredient-name-${index}`}
                              className="sr-only"
                            >
                              Ingredient
                            </Label>
                            <Input
                              id={`ingredient-name-${index}`}
                              {...registerManual(
                                `ingredients.${index}.name` as keyof ManualRecipe,
                              )}
                              defaultValue={ingredient.name}
                            />
                            {errorsManual.ingredients?.[index]?.name && (
                              <p className="text-xs italic text-red-500 mt-2">
                                {errorsManual.ingredients[index].name?.message}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Label
                              htmlFor={`ingredient-amount-${index}`}
                              className="sr-only"
                            >
                              Aantal
                            </Label>
                            <Input
                              id={`ingredient-amount-${index}`}
                              type="number"
                              {...registerManual(
                                `ingredients.${index}.amount` as keyof ManualRecipe,
                                { valueAsNumber: true },
                              )}
                              defaultValue={ingredient.amount}
                            />
                            {errorsManual.ingredients?.[index]?.amount && (
                              <p className="text-xs italic text-red-500 mt-2">
                                {
                                  errorsManual.ingredients[index].amount
                                    ?.message
                                }
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <Label
                              htmlFor={`ingredient-unit-${index}`}
                              className="sr-only"
                            >
                              Eenheid
                            </Label>
                            <Input
                              id={`ingredient-unit-${index}`}
                              {...registerManual(
                                `ingredients.${index}.unit` as keyof ManualRecipe,
                              )}
                              defaultValue={ingredient.unit}
                            />
                            {errorsManual.ingredients?.[index]?.unit && (
                              <p className="text-xs italic text-red-500 mt-2">
                                {errorsManual.ingredients[index].unit?.message}
                              </p>
                            )}
                          </TableCell>
                          <Button
                            onClick={() => handleDeleteIngredient(index)}
                            className="my-10"
                          >
                            <Trash2 className="h-5 w-5"></Trash2>
                          </Button>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="justify-center border-t p-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1"
                    type="button"
                    onClick={handleAddIngredient}
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Add Ingredient
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>
                    Je zou het maar (w)eten{" "}
                    <span className="text-sm"> (optioneel) </span>{" "}
                  </CardTitle>
                  <CardDescription>
                    Vul hier je tips in voor dit recept
                  </CardDescription>
                  <Textarea
                    id="tips"
                    {...registerManual("tips")}
                    className="min-h-32"
                  />
                  {errorsManual.tips && (
                    <p className="text-xs italic text-red-500 mt-2">
                      {errorsManual.tips.message}
                    </p>
                  )}
                </CardHeader>
                <CardContent></CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Product Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="status">Status</Label>
                      <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                          <Select
                            value={status}
                            onValueChange={(value) => {
                              setStatus(value);
                              field.onChange(value);
                            }}
                          >
                            <SelectTrigger aria-label="Select status">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errorsManual.status && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errorsManual.status.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="status">
                        Select multiple categories here
                      </Label>
                      {
                        <Controller
                          name="categories"
                          control={control}
                          render={({ field }) => {
                            const selectedValues: string[] = Array.isArray(
                              field.value,
                            )
                              ? field.value
                              : [];

                            const convertedOptions = convertToOptions(
                              selectedValues,
                              categoriesList,
                            );

                            return (
                              <MultipleSelector
                                onChange={(selectedOptions: Option[]) => {
                                  const selectedValues =
                                    optionsToValues(selectedOptions);
                                  field.onChange(selectedValues);
                                  setSelectedCategories(selectedValues);
                                }}
                                value={convertedOptions}
                                defaultOptions={categoriesList}
                                placeholder="Select Categories"
                                emptyIndicator={
                                  <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                                    no results found.
                                  </p>
                                }
                              />
                            );
                          }}
                        />
                      }
                      {errorsManual.categories && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errorsManual.categories.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle>Product Image</CardTitle>
                  <CardDescription>Your Recipe Image Here</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <Controller
                      control={control}
                      name="image"
                      render={({ field }) => (
                        <FileUpload
                          {...field}
                          value={selectedImage}
                          onChange={handleImageChange}
                        />
                      )}
                    />
                    {errorsManual.image && (
                      <p className="text-xs italic text-red-500 mt-2">
                        {errorsManual.image.message}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-dark-primary text-lg font-bold text-white w-full"
                >
                  {isSubmitting ? "Loading..." : "Add Recipe"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmitURL(handleURLSubmit)}>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recept Informatie</CardTitle>
                  <CardDescription>Fill in your recipe details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" {...registerURL("title")} />
                      {errorsURL.title && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errorsURL.title.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="url">URL</Label>
                      <Input id="url" {...registerURL("url")} />
                      {errorsURL.url && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errorsURL.url.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="image">Image URL</Label>
                      <Input id="image" {...registerURL("image")} />
                      {errorsURL.image && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errorsURL.image.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="categories">Categories</Label>
                      <Input id="categories" {...registerURL("categories")} />
                      {errorsURL.categories && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errorsURL.categories.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="tips">Tips</Label>
                      <Input id="tips" {...registerURL("tips")} />
                      {errorsURL.tips && (
                        <p className="text-xs italic text-red-500 mt-2">
                          {errorsURL.tips.message}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Button type="submit" variant="outline" size="sm">
            Discard
          </Button>
          <Button variant="outline" size="sm">
            Save Product
          </Button>
        </form>
      )}
    </div>
  );
};

export default RecipeForm;
