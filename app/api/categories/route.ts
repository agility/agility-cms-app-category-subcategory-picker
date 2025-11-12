import { NextResponse } from 'next/server';
import { Category } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const listRef = searchParams.get('listRef') || 'ArticleCategories';

  // TODO: Replace with actual Agility CMS API call to fetch from the specified list
  // This should use the Agility SDK or API to fetch the list items
  // Use the listRef parameter to fetch from the correct list

  // Stub data for now - matches the screenshot examples
  const categories: Category[] = [
    { ID: 1, Title: 'Clinical Departments' },
    { ID: 2, Title: 'Imaging Modalities' },
    { ID: 3, Title: 'Contrast Agents' },
    { ID: 4, Title: 'Section' },
    { ID: 5, Title: 'Digital Portals' },
    { ID: 6, Title: 'Imaging Informatics' },
  ];

  return NextResponse.json(categories);
}

