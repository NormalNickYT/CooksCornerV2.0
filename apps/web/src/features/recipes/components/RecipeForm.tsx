import { zodResolver } from "@hookform/resolvers/zod";
import { RECIPE_STATUSES, UNITS, type RecipeDetail } from "@cookscorner/shared";
import { GripVertical, Lock, LockOpen, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Controller, useFieldArray, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultipleSelector, { type Option } from "@/components/ui/multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FileUpload from "@/components/ui/file-upload";
import { errorMessage, fieldErrors } from "@/lib/api";
import { cn } from "@/lib/utils";
import { ScalingPreview } from "./ScalingPreview";
import {
  defaultRecipeFormValues,
  emptyIngredient,
  emptyStep,
  recipeFormSchema,
  toFormValues,
  toRecipeInput,
  type RecipeFormValues,
} from "../recipeForm.schema";

const STATUS_LABELS: Record<(typeof RECIPE_STATUSES)[number], string> = {
  draft: "Concept",
  active: "Gepubliceerd",
  archived: "Gearchiveerd",
};

const CATEGORY_OPTIONS: Option[] = [
  "Ontbijt",
  "Lunch",
  "Diner",
  "Dessert",
  "Bijgerecht",
  "Soep",
  "Vegetarisch",
  "Zoet",
].map((value) => ({ value, label: value }));

interface RecipeFormProps {
  /** Present when editing; absent when creating. */
  recipe?: RecipeDetail;
  onSubmit: (input: ReturnType<typeof toRecipeInput>, image: File | null) => Promise<unknown>;
  submitLabel?: string;
}

/**
 * The recipe editor.
 *
 * Ingredients and steps are managed by `useFieldArray`. The previous version
 * kept a parallel `useState` array alongside separately registered inputs, so
 * deleting row 1 removed the last row's registration while the values shifted
 * up: you lost a different line than the one you clicked.
 */
export function RecipeForm({ recipe, onSubmit, submitLabel = "Recept opslaan" }: RecipeFormProps) {
  const [image, setImage] = useState<File | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: recipe ? toFormValues(recipe) : defaultRecipeFormValues,
  });

  const ingredients = useFieldArray({ control, name: "ingredients" });
  const steps = useFieldArray({ control, name: "approachSteps" });

  // Drives the live preview, so the author sees scaling as they type.
  const watchedIngredients = watch("ingredients");
  const watchedServings = watch("servings");

  const handleFormSubmit: SubmitHandler<RecipeFormValues> = async (values) => {
    try {
      await onSubmit(toRecipeInput(values), image);
    } catch (error) {
      // Map server-side field errors back onto the form where possible.
      const fields = fieldErrors(error);
      let mapped = false;
      for (const [path, message] of Object.entries(fields)) {
        setError(path as keyof RecipeFormValues, { type: "server", message });
        mapped = true;
      }
      if (!mapped) toast.error(errorMessage(error, "Opslaan is niet gelukt"));
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recept</CardTitle>
                <CardDescription>Waar gaat het over?</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5">
                <Field label="Titel" error={errors.title?.message} required htmlFor="title">
                  <Input id="title" placeholder="Bijvoorbeeld: Tacos met gehakt" {...register("title")} />
                </Field>

                <Field label="Beschrijving" error={errors.description?.message} htmlFor="description">
                  <Textarea
                    id="description"
                    className="min-h-24"
                    placeholder="Waarom is dit recept bijzonder?"
                    {...register("description")}
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-3">
                  <Field
                    label="Voor hoeveel personen?"
                    error={errors.servings?.message}
                    required
                    htmlFor="servings"
                    hint="De hoeveelheden hieronder gelden voor dit aantal."
                  >
                    <Input
                      id="servings"
                      type="number"
                      min={1}
                      {...register("servings", { valueAsNumber: true })}
                    />
                  </Field>

                  <Field label="Voorbereiden (min)" error={errors.preparationTime?.message} htmlFor="preparationTime">
                    <Input
                      id="preparationTime"
                      type="number"
                      min={0}
                      {...register("preparationTime", { valueAsNumber: true })}
                    />
                  </Field>

                  <Field label="Koken (min)" error={errors.cookTime?.message} htmlFor="cookTime">
                    <Input
                      id="cookTime"
                      type="number"
                      min={0}
                      {...register("cookTime", { valueAsNumber: true })}
                    />
                  </Field>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingrediënten</CardTitle>
                <CardDescription>
                  Vul de hoeveelheden in voor {watchedServings || 1}{" "}
                  {watchedServings === 1 ? "persoon" : "personen"}. Breuken mogen: 1/2, 1,5 of ½.
                  Laat de hoeveelheid leeg voor iets als &quot;peper naar smaak&quot;.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {errors.ingredients?.message && (
                  <p className="text-sm text-destructive">{errors.ingredients.message}</p>
                )}

                {ingredients.fields.map((field, index) => {
                  const rowErrors = errors.ingredients?.[index];
                  return (
                    <div key={field.id} className="rounded-lg border p-3">
                      <div className="flex items-start gap-2">
                        <GripVertical
                          aria-hidden
                          className="mt-2.5 h-4 w-4 shrink-0 text-muted-foreground"
                        />

                        <div className="grid flex-1 gap-2 sm:grid-cols-[6rem_7rem_1fr]">
                          <div>
                            <Label htmlFor={`ingredients.${index}.amount`} className="sr-only">
                              Hoeveelheid
                            </Label>
                            <Input
                              id={`ingredients.${index}.amount`}
                              placeholder="250"
                              inputMode="decimal"
                              {...register(`ingredients.${index}.amount`)}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`ingredients.${index}.unit`} className="sr-only">
                              Eenheid
                            </Label>
                            <Input
                              id={`ingredients.${index}.unit`}
                              placeholder="g"
                              list="unit-suggestions"
                              {...register(`ingredients.${index}.unit`)}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`ingredients.${index}.name`} className="sr-only">
                              Ingrediënt
                            </Label>
                            <Input
                              id={`ingredients.${index}.name`}
                              placeholder="bloem"
                              {...register(`ingredients.${index}.name`)}
                            />
                          </div>
                        </div>

                        <Controller
                          control={control}
                          name={`ingredients.${index}.scalable`}
                          render={({ field: scalableField }) => (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className={cn(
                                    "shrink-0",
                                    !scalableField.value && "text-amber-600 dark:text-amber-500",
                                  )}
                                  aria-pressed={!scalableField.value}
                                  onClick={() => scalableField.onChange(!scalableField.value)}
                                >
                                  {scalableField.value ? (
                                    <LockOpen className="h-4 w-4" />
                                  ) : (
                                    <Lock className="h-4 w-4" />
                                  )}
                                  <span className="sr-only">
                                    {scalableField.value
                                      ? "Schaalt mee met het aantal personen"
                                      : "Schaalt niet mee"}
                                  </span>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="max-w-[16rem] text-sm">
                                  {scalableField.value
                                    ? "Schaalt mee. Klik om vast te zetten, handig voor zout of kruiden."
                                    : "Staat vast: blijft gelijk bij elk aantal personen."}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => ingredients.remove(index)}
                          disabled={ingredients.fields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Verwijder ingrediënt {index + 1}</span>
                        </Button>
                      </div>

                      {(rowErrors?.name || rowErrors?.amount || rowErrors?.unit) && (
                        <p className="mt-2 pl-6 text-sm text-destructive">
                          {rowErrors?.name?.message ??
                            rowErrors?.amount?.message ??
                            rowErrors?.unit?.message}
                        </p>
                      )}
                    </div>
                  );
                })}
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => ingredients.append({ ...emptyIngredient })}
                >
                  <PlusCircle className="h-4 w-4" />
                  Ingrediënt toevoegen
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bereiding</CardTitle>
                <CardDescription>Eén stap per veld.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {errors.approachSteps?.message && (
                  <p className="text-sm text-destructive">{errors.approachSteps.message}</p>
                )}

                {steps.fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold"
                    >
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <Label htmlFor={`approachSteps.${index}.content`} className="sr-only">
                        Stap {index + 1}
                      </Label>
                      <Textarea
                        id={`approachSteps.${index}.content`}
                        className="min-h-20"
                        placeholder={`Wat gebeurt er in stap ${index + 1}?`}
                        {...register(`approachSteps.${index}.content`)}
                      />
                      {errors.approachSteps?.[index]?.content && (
                        <p className="mt-1 text-sm text-destructive">
                          {errors.approachSteps[index]?.content?.message}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="mt-1 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => steps.remove(index)}
                      disabled={steps.fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Verwijder stap {index + 1}</span>
                    </Button>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-center border-t p-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => steps.append({ ...emptyStep })}
                >
                  <PlusCircle className="h-4 w-4" />
                  Stap toevoegen
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips</CardTitle>
                <CardDescription>Optioneel. Wat moet iemand weten die dit voor het eerst maakt?</CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="tips" className="sr-only">
                  Tips
                </Label>
                <Textarea id="tips" className="min-h-24" {...register("tips")} />
                {errors.tips && <p className="mt-1 text-sm text-destructive">{errors.tips.message}</p>}
              </CardContent>
            </Card>
          </div>

          <div className="grid auto-rows-max items-start gap-6">
            <ScalingPreview ingredients={watchedIngredients ?? []} baseServings={watchedServings} />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publiceren</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5">
                <Field label="Status" error={errors.status?.message} htmlFor="status">
                  <Controller
                    control={control}
                    name="status"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {RECIPE_STATUSES.map((status) => (
                            <SelectItem key={status} value={status}>
                              {STATUS_LABELS[status]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>

                <Field label="Categorieën" error={errors.categories?.message} required>
                  <Controller
                    control={control}
                    name="categories"
                    render={({ field }) => (
                      <MultipleSelector
                        value={(field.value ?? []).map((value) => ({ value, label: value }))}
                        defaultOptions={CATEGORY_OPTIONS}
                        creatable
                        placeholder="Kies of typ een categorie"
                        onChange={(options: Option[]) =>
                          field.onChange(options.map((option) => option.value))
                        }
                        emptyIndicator={
                          <p className="text-center text-sm text-muted-foreground">
                            Typ om een nieuwe categorie te maken.
                          </p>
                        }
                      />
                    )}
                  />
                </Field>

                <Field label="Bron (optioneel)" error={errors.sourceUrl?.message} htmlFor="sourceUrl">
                  <Input id="sourceUrl" placeholder="https://..." {...register("sourceUrl")} />
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Foto</CardTitle>
                <CardDescription>
                  {recipe?.image ? "Kies een nieuw bestand om de huidige foto te vervangen." : "JPG, PNG of WebP."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recipe?.image && !image && (
                  <img
                    src={recipe.image}
                    alt=""
                    className="mb-3 aspect-video w-full rounded-md object-cover"
                  />
                )}
                <FileUpload
                  value={image}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setImage(event.target.files?.[0] ?? null)
                  }
                />
              </CardContent>
            </Card>

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Bezig met opslaan..." : submitLabel}
            </Button>
          </div>
        </div>

        {/* Shared by every unit input, so the browser suggests known units
            while still accepting anything typed. */}
        <datalist id="unit-suggestions">
          {UNITS.map((unit) => (
            <option key={unit.id} value={unit.label} />
          ))}
        </datalist>
      </form>
    </TooltipProvider>
  );
}

interface FieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  children: React.ReactNode;
}

function Field({ label, error, hint, required, htmlFor, children }: FieldProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {hint && !error && <p className="text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default RecipeForm;
