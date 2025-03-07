export interface Receta {
    id:           string;
    name:         string;
    description:  string;
    ingredients:  string[];
    tags:   string[];
    time:         string;
    instructions: string[];
    alt_img?:     string;
    createdAt:    string;
    updatedAt:    string;
}