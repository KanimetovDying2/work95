class CreateIngredientDto {
  name: string;
  amount: string;
}

export class CreateCocktailDto {
  title: string;
  image: string;
  recipe: string;
  ingredients: CreateIngredientDto[];
}
