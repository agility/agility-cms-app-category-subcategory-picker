'use client';

import { useState, useEffect, useRef } from 'react';
import { useAgilityAppSDK, useResizeHeight, getManagementAPIToken, contentItemMethods } from '@agility/app-sdk';
import { Category, Subcategory, CategoryPickerData } from '@/types';
import { fetchData } from '@/lib/fetchData';

export default function CategoryPickerField() {
  const { initializing, contentItem, appInstallContext, instance, locale } = useAgilityAppSDK();
  const containerRef = useResizeHeight(10);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(new Set());
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [columnCount, setColumnCount] = useState(1);

  // Get config values with defaults
  const categoriesListRef = appInstallContext?.configuration?.categoriesListReferenceName || 'ArticleCategories';
  const subcategoriesListRef = appInstallContext?.configuration?.subcategoriesListReferenceName || 'ArticleSubCategories';
  const categoryIdsFieldName = appInstallContext?.configuration?.categoryIdsFieldName || 'CategoriesIDs';
  const subcategoryIdsFieldName = appInstallContext?.configuration?.subcategoryIdsFieldName || 'SubcategoriesIDs';

  // Get instance and locale info
  const instanceGuid = instance?.guid || '';
  const currentLocale = locale || 'en-us';
  // Get managerUrl from window.location since it's not in the SDK types
  // The app runs in an iframe, so we can get it from the parent or current location
  const managerUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'manager.agilitycms.com';

  // Track window width for responsive column layout
  useEffect(() => {
    const updateColumnCount = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      if (width >= 900) {
        setColumnCount(3);
      } else if (width >= 600) {
        setColumnCount(2);
      } else {
        setColumnCount(1);
      }
    };

    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);
    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);


  // Load current field value
  useEffect(() => {
    if (initializing) return;

    try {
      //get the values from the 2 fields specified by the app config

      const categoryIds = contentItem?.values[categoryIdsFieldName]?.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id)) || [];
      const subcategoryIds = contentItem?.values[subcategoryIdsFieldName]?.split(',').map((id: string) => parseInt(id.trim())).filter((id: number) => !isNaN(id)) || [];

      setSelectedCategoryIds(new Set(categoryIds));
      setSelectedSubcategoryIds(new Set(subcategoryIds));
    } catch (error) {
      console.error('Error parsing field value:', error);
    }
  }, [contentItem, initializing, categoryIdsFieldName, subcategoryIdsFieldName]);

  // Fetch categories and subcategories
  useEffect(() => {
    if (initializing || !instanceGuid || !currentLocale || !managerUrl) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Get management API token
        const token = await getManagementAPIToken();
        if (!token) {
          throw new Error('Failed to get management API token');
        }

        const { categories: categoriesData, subcategories: subcategoriesData } = await fetchData(
          categoriesListRef,
          subcategoriesListRef,
          instanceGuid,
          currentLocale,
          token
        );

        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
      } catch (error) {
        console.error('Error fetching categories/subcategories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [initializing, categoriesListRef, subcategoriesListRef, instanceGuid, currentLocale, managerUrl]);

  // Save field value
  const saveFieldValue = (categoryIds: Set<number>, subcategoryIds: Set<number>) => {
    //this field does NOT set the value as a JSON object, it sets the value as a string of comma-separated values
    //on the 2 fields specified by the app config
    contentItemMethods.setFieldValue({
      name: categoryIdsFieldName,
      value: Array.from(categoryIds).join(','),
    });
    contentItemMethods.setFieldValue({
      name: subcategoryIdsFieldName,
      value: Array.from(subcategoryIds).join(','),
    });
  };

  // Handle category toggle
  const handleCategoryToggle = (categoryId: number) => {
    const newSelected = new Set(selectedCategoryIds);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
      // Also remove subcategories of this category
      const subcatsToRemove = subcategories
        .filter((sub) => sub.CategoryID === categoryId)
        .map((sub) => sub.ID);
      const newSubcats = new Set(selectedSubcategoryIds);
      subcatsToRemove.forEach((id) => newSubcats.delete(id));
      setSelectedSubcategoryIds(newSubcats);
      setSelectedCategoryIds(newSelected);
      saveFieldValue(newSelected, newSubcats);
    } else {
      newSelected.add(categoryId);
      setSelectedCategoryIds(newSelected);
      saveFieldValue(newSelected, selectedSubcategoryIds);
    }
  };

  // Handle subcategory toggle
  const handleSubcategoryToggle = (subcategoryId: number) => {
    const newSelected = new Set(selectedSubcategoryIds);
    if (newSelected.has(subcategoryId)) {
      newSelected.delete(subcategoryId);
    } else {
      newSelected.add(subcategoryId);
      // Ensure parent category is also selected
      const subcategory = subcategories.find((sub) => sub.ID === subcategoryId);
      if (subcategory) {
        const newCats = new Set(selectedCategoryIds);
        newCats.add(subcategory.CategoryID);
        setSelectedCategoryIds(newCats);
        setSelectedSubcategoryIds(newSelected);
        saveFieldValue(newCats, newSelected);
        return;
      }
    }
    setSelectedSubcategoryIds(newSelected);
    saveFieldValue(selectedCategoryIds, newSelected);
  };

  // Get subcategories for a category
  const getSubcategoriesForCategory = (categoryId: number) => {
    return subcategories.filter((sub) => sub.CategoryID === categoryId);
  };

  // Get selected categories and subcategories for read-only view
  const getSelectedCategories = () => {
    return categories.filter((cat) => selectedCategoryIds.has(cat.ID));
  };

  const getSelectedSubcategories = (categoryId: number) => {
    return subcategories.filter(
      (sub) => sub.CategoryID === categoryId && selectedSubcategoryIds.has(sub.ID)
    );
  };

  // Organize categories into columns for display
  const organizeIntoColumns = <T,>(items: T[], columns: number = 3): T[][] => {
    const itemsPerColumn = Math.ceil(items.length / columns);
    const result: T[][] = [];
    for (let i = 0; i < columns; i++) {
      result.push(items.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn));
    }
    return result;
  };

  if (initializing || loading) {
    return (
      <div ref={containerRef} className="p-6 min-h-[200px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
          <div className="text-center text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-white border border-gray-300 rounded min-h-[200px]">
      {!isEditing ? (
        // Read-only view
        <div className="p-6">
          <div className="border-b border-gray-200 pb-4 mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Selected Category(s) and Subcategory(s) are listed below. <br />Click 'Edit Categories' to alter your selection.
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-medium"
            >
              Edit
            </button>
          </div>

          {selectedCategoryIds.size === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No categories selected. Click 'Edit Categories' to make a selection.
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 gap-6">
              {organizeIntoColumns(getSelectedCategories(), columnCount).map((column, colIndex) => (
                <div key={colIndex} className="space-y-4">
                  {column.map((category) => {
                    const categorySubs = getSelectedSubcategories(category.ID);
                    return (
                      <div key={category.ID} className="space-y-2">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={true}
                            disabled
                            className="w-4 h-4 text-violet-600 border-gray-300 rounded cursor-not-allowed opacity-50"
                          />
                          <label className="ml-2 text-sm font-medium text-gray-700">
                            {category.Title}
                          </label>
                        </div>
                        {categorySubs.map((subcategory) => (
                          <div key={subcategory.ID} className="flex items-center ml-6">
                            <input
                              type="checkbox"
                              checked={true}
                              disabled
                              className="w-4 h-4 text-violet-600 border-gray-300 rounded cursor-not-allowed opacity-50"
                            />
                            <label className="ml-2 text-sm text-gray-600">
                              {subcategory.Title}
                            </label>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // Editable view
        <div className="p-6">
          <div className="border-b border-gray-200 pb-4 mb-4 flex justify-between items-center">
            <div className="text-sm">
              Select the items from the list below.
            </div>

          </div>

          <div className="grid grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 gap-6">
            {organizeIntoColumns(categories, columnCount).map((column, colIndex) => (
              <div key={colIndex} className="space-y-4">
                {column.map((category) => {
                  const categorySubs = getSubcategoriesForCategory(category.ID);
                  const isCategorySelected = selectedCategoryIds.has(category.ID);
                  return (
                    <div key={category.ID} className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={isCategorySelected}
                          onChange={() => handleCategoryToggle(category.ID)}
                          className="w-4 h-4 text-violet-600 accent-violet-700 border-gray-300 rounded focus:ring-violet-800 cursor-pointer"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">
                          {category.Title}
                        </label>
                      </div>
                      {categorySubs.map((subcategory) => {
                        const isSubcategorySelected = selectedSubcategoryIds.has(subcategory.ID);
                        return (
                          <div key={subcategory.ID} className="flex items-center ml-6">
                            <input
                              type="checkbox"
                              checked={isSubcategorySelected}
                              onChange={() => handleSubcategoryToggle(subcategory.ID)}
                              className="w-4 h-4 text-violet-600 accent-violet-700 border-gray-300 rounded focus:ring-violet-800 cursor-pointer"
                            />
                            <label className="ml-2 text-sm text-gray-600 cursor-pointer">
                              {subcategory.Title}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


