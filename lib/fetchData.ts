import { Category, Subcategory } from '@/types';
import { mgmtAPICall } from './mgmt-api-call';

export interface FetchDataResult {
	categories: Category[];
	subcategories: Subcategory[];
}

interface ListItemResponse {
	contentItemID: number;
	itemContainerID: number;
	title: string;
	parentCategoryID?: number;
	ParentCategoryID?: number;
}

interface ListResponse {
	items: ListItemResponse[][];
	totalRecords: number;
}

export async function fetchData(
	categoriesListRef: string,
	subcategoriesListRef: string,
	instanceGuid: string,
	locale: string,
	token: string
): Promise<FetchDataResult> {
	try {
		// Build URLs for categories and subcategories
		const categoriesUrl = `instance/${instanceGuid}/${locale}/list/${categoriesListRef}?fields=contentItemID,itemContainerID,stateID,state,title&sortDirection=ASC&sortField=Title&take=250&skip=0&showDeleted=false`;
		const subcategoriesUrl = `instance/${instanceGuid}/${locale}/list/${subcategoriesListRef}?fields=contentItemID,itemContainerID,stateID,state,title,ParentCategoryID&sortDirection=ASC&sortField=Title&take=250&skip=0&showDeleted=false`;

		// Fetch both lists in parallel
		const [categoriesResponse, subcategoriesResponse] = await Promise.all([
			mgmtAPICall({
				url: categoriesUrl,
				method: 'GET',
				guid: instanceGuid,
				token
			}),
			mgmtAPICall({
				url: subcategoriesUrl,
				method: 'GET',
				guid: instanceGuid,
				token
			}),
		]);

		// Transform the response data to match our Category and Subcategory types
		const categories: Category[] = (categoriesResponse as ListResponse).items[0].map((item) => ({
			ID: item.itemContainerID,
			Title: item.title,
		}));

		const subcategories: Subcategory[] = (subcategoriesResponse as ListResponse).items[0].map((item) => ({
			ID: item.itemContainerID,
			Title: item.title,
			CategoryID: item.parentCategoryID || item.ParentCategoryID || 0, // Use parentCategoryID from the API response
		}));

		return {
			categories,
			subcategories,
		};
	} catch (error) {
		console.error('Error fetching categories/subcategories:', error);
		throw error;
	}
}

