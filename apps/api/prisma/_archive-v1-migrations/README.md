# Archived v1 migrations

These are the migrations from before the v2 restructure. They are kept for
reference only and are no longer applied.

The v2 schema renamed `Post` to `Recipe`, changed `Ingredient.amount` from
`Int` to `Decimal` (so half a teaspoon can exist), dropped
`relationMode = "prisma"` in favour of real foreign keys with cascading
deletes, and added `Favorite`. Rather than layer a dozen migrations on top of
a model that had changed shape, v2 starts from a single baseline migration.

If you ever need to bring an existing v1 database forward instead of starting
fresh, use `prisma migrate diff` between this folder's final state and the
current `schema.prisma`.
