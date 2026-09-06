import { Router } from "express";
import { recipeFiltersSchema } from "@cookscorner/shared";
import { requireAuth } from "../../middleware/requireAuth";
import { uploadRecipeImage } from "../../middleware/upload";
import { validate } from "../../middleware/validate";
import { create, detail, list, listCategories, listMine, remove, update } from "./recipe.controller";

const router = Router();

// Public reads.
router.get("/recipes", validate(recipeFiltersSchema, "query"), list);
router.get("/categories", listCategories);

// Must come before /recipes/:idOrSlug, or "mine" is read as a slug.
router.get("/recipes/mine", requireAuth, listMine);
router.get("/recipes/:idOrSlug", detail);

// Writes.
router.post("/recipes", requireAuth, uploadRecipeImage.single("image"), create);
router.put("/recipes/:id", requireAuth, uploadRecipeImage.single("image"), update);
router.delete("/recipes/:id", requireAuth, remove);

export default router;
