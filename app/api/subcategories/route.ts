import { NextResponse } from 'next/server';
import { Subcategory } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listRef = searchParams.get('listRef') || 'ArticleSubCategories';

  // TODO: Replace with actual Agility CMS API call to fetch from the specified list
  // This should use the Agility SDK or API to fetch the list items
  // Use the listRef parameter to fetch from the correct list

  // Stub data for now - matches the screenshot examples
  const subcategories: Subcategory[] = [
    // Clinical Departments subcategories
    { ID: 1, Title: 'Advocacy & Governmental Affairs', CategoryID: 1 },
    { ID: 2, Title: 'Artificial Intelligence', CategoryID: 1 },
    { ID: 3, Title: 'Body Imaging', CategoryID: 1 },
    { ID: 4, Title: 'Breast Imaging', CategoryID: 1 },
    { ID: 5, Title: 'Cardiac Imaging', CategoryID: 1 },
    { ID: 6, Title: 'Cardiopulmonary Imaging', CategoryID: 1 },
    { ID: 7, Title: 'Diagnostic Imaging', CategoryID: 1 },
    { ID: 8, Title: 'Early Career', CategoryID: 1 },
    { ID: 9, Title: 'Emergency Imaging', CategoryID: 1 },
    { ID: 10, Title: 'Gastrointestinal', CategoryID: 1 },
    { ID: 11, Title: 'GI Imaging', CategoryID: 1 },
    { ID: 12, Title: 'Information Technology', CategoryID: 1 },
    { ID: 13, Title: 'Medical Imaging', CategoryID: 1 },
    { ID: 14, Title: 'Medical Physics', CategoryID: 1 },
    { ID: 15, Title: 'Medico-Legal', CategoryID: 1 },
    { ID: 16, Title: 'Molecular Imaging', CategoryID: 1 },
    { ID: 17, Title: 'MSK Imaging', CategoryID: 1 },
    { ID: 18, Title: 'Neuro Imaging', CategoryID: 1 },
    { ID: 19, Title: 'Nuclear Medicine', CategoryID: 1 },
    { ID: 20, Title: 'OB/GYN Imaging', CategoryID: 1 },
    { ID: 21, Title: 'Oncologic Imaging', CategoryID: 1 },
    { ID: 22, Title: 'Pediatric Imaging', CategoryID: 1 },
    { ID: 23, Title: 'Theranostics', CategoryID: 1 },
    { ID: 24, Title: 'Thoracic Imaging', CategoryID: 1 },
    { ID: 25, Title: 'Vascular Interventional', CategoryID: 1 },

    // Contrast Agents subcategories
    { ID: 26, Title: 'MRI Contrast', CategoryID: 3 },

    // Digital Portals subcategories
    { ID: 27, Title: 'Artificial Intelligence Portal', CategoryID: 5 },
    { ID: 28, Title: 'CT Imaging Portal', CategoryID: 5 },
    { ID: 29, Title: 'Interventional Imaging', CategoryID: 5 },
    { ID: 30, Title: 'MR Imaging Portal', CategoryID: 5 },
    { ID: 31, Title: 'Pediatric Imaging Portal', CategoryID: 5 },
    { ID: 32, Title: "Women's Health Community", CategoryID: 5 },

    // Imaging Informatics subcategories
    { ID: 33, Title: 'Advanced Visualization', CategoryID: 6 },
    { ID: 34, Title: 'Medical Displays', CategoryID: 6 },
    { ID: 35, Title: 'PACS', CategoryID: 6 },
    { ID: 36, Title: 'RIS', CategoryID: 6 },
    { ID: 37, Title: 'Voice Recognition', CategoryID: 6 },
    { ID: 38, Title: 'Workflow', CategoryID: 6 },

    // Imaging Modalities subcategories
    { ID: 39, Title: 'CAD', CategoryID: 2 },
    { ID: 40, Title: 'CT', CategoryID: 2 },
    { ID: 41, Title: 'Digital Mammography', CategoryID: 2 },
    { ID: 42, Title: 'Digital X-Ray', CategoryID: 2 },
    { ID: 43, Title: 'DR', CategoryID: 2 },
    { ID: 44, Title: 'Fluoroscopy', CategoryID: 2 },
    { ID: 45, Title: 'Mammography', CategoryID: 2 },
    { ID: 46, Title: 'Molecular Imaging.', CategoryID: 2 },
    { ID: 47, Title: 'MRI & MRA', CategoryID: 2 },
    { ID: 48, Title: 'Radionuclide', CategoryID: 2 },
    { ID: 49, Title: 'SPECT', CategoryID: 2 },
    { ID: 50, Title: 'Ultrasound', CategoryID: 2 },
    { ID: 51, Title: 'Vascular & Interventional', CategoryID: 2 },
    { ID: 52, Title: 'X-Ray', CategoryID: 2 },

    // Section subcategories
    { ID: 53, Title: 'Review Article', CategoryID: 4 },
    { ID: 54, Title: 'CME Article', CategoryID: 4 },
    { ID: 55, Title: 'Research Article', CategoryID: 4 },
    { ID: 56, Title: 'Case Study', CategoryID: 4 },
    { ID: 57, Title: 'Pediatric Case Study', CategoryID: 4 },
    { ID: 58, Title: 'Case Reviews', CategoryID: 4 },
    { ID: 59, Title: 'News Brief', CategoryID: 4 },
    { ID: 60, Title: 'Editorial', CategoryID: 4 },
    { ID: 61, Title: 'Guest Editorial', CategoryID: 4 },
    { ID: 62, Title: 'Eye On AI', CategoryID: 4 },
    { ID: 63, Title: 'First Impressions', CategoryID: 4 },
    { ID: 64, Title: 'Global Health', CategoryID: 4 },
    { ID: 65, Title: 'Radiology Matters', CategoryID: 4 },
    { ID: 66, Title: 'Radiology Spotlight', CategoryID: 4 },
    { ID: 67, Title: 'Wet Read', CategoryID: 4 },
    { ID: 68, Title: 'AR Connect', CategoryID: 4 },
    { ID: 69, Title: 'Sponsored', CategoryID: 4 },
    { ID: 70, Title: 'Supplement', CategoryID: 4 },
    { ID: 71, Title: 'Videos', CategoryID: 4 },
    { ID: 72, Title: 'How We Do It', CategoryID: 4 },
  ];

  return NextResponse.json(subcategories);
}

