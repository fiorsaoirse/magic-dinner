export interface IRecipe {
  title: string;
  image: (string | null);
  energy?: {
    calories?: number,
    proteins?: number,
    fat?: number,
    carbs?: number
  };
  text: string;
  url: string;
}
