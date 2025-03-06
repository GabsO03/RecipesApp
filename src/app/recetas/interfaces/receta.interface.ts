export interface Receta {
    id:           string;
    name:         string;
    description:  string;
    ingredients:  string[];
    categories:   string[];
    time:         string;
    instructions: string[];
    alt_img?:     string;
    createdAt:    string;
    updatedAt:    string;
}