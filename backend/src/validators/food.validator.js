import { z } from "zod";

export const createMealSchema = z.object({
  mealType: z.enum(["breakfast", "brunch", "lunch", "dinner", "snack"]),
  imageUrl: z.string().url(),
  foods: z.array(
    z.object({
      name: z.string().min(1),
      grams: z.number().positive(),
      calories: z.number().nonnegative(),
      protein: z.number().nonnegative(),
      carbs: z.number().nonnegative(),
      fat: z.number().nonnegative()
    })
  ).optional()
});
