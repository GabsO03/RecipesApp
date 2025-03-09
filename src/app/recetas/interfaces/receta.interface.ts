export interface Recipe {
    id:           string;
    name:         string;
    description:  string;
    ingredients:  Ingredient[];
    tags:         string[];
    time:         string;
    instructions: string[];
    created_at:   Date;
    updated_at:   Date;
    alt_img:      string;
}

export interface Ingredient {
    amount:         string;
    unitMeasure:     string;
    nameIngredient: string;
}
