export interface Category {
  ID: number;
  Title: string;
}

export interface Subcategory {
  ID: number;
  Title: string;
  CategoryID: number;
}

export interface CategoryPickerData {
  [key: string]: string; // Dynamic field names for category and subcategory IDs (comma-separated)
  // Default field names (can be overridden via app config):
  // CategoriesIDs: string;
  // SubcategoriesIDs: string;
}

