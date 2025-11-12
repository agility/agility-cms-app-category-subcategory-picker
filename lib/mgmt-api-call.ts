import { getMgmtAPIUrl } from './getMgmtAPIUrl';

interface Props {
	/**
	 * The current manager url from the instance
	 */
	guid: string | null
	url: string
	token: string
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
}

/**
 * Make an authenticated call to the mgmt API using fetch.
 * @param {*} { url, method = "GET", managerUrl, token }
 */
export const mgmtAPICall = async ({
	url,
	method = 'GET',
	guid,
	token,
}: Props) => {
	if (!guid) throw new Error("The instance guid has not been set.")
	if (!token) throw new Error("Token not found. Please ensure the app is properly authenticated.")

	const baseURL = getMgmtAPIUrl({ guid });
	const fullUrl = `${baseURL}${url}`;

	const headers: HeadersInit = {
		'Authorization': `BEARER ${token}`,
		'X-Requested-With': 'XMLHttpRequest',
		'Content-Type': 'application/json',
	};

	let response: Response | null = null;

	try {
		// First attempt
		response = await fetch(fullUrl, {
			method,
			headers,
		});

		// If we get a 401, we might need to refresh the token
		// For now, we'll just throw an error
		if (response.status === 401) {
			throw new Error("Unauthorized. Token may have expired.");
		}

		if (response.status === 200) {
			const data = await response.json();
			return data;
		} else if (response.status === 204) {
			return { data: [], totalRecords: 0 };
		} else {
			throw new Error(`API call failed with status ${response.status}: ${response.statusText}`);
		}
	} catch (error: any) {
		if (error.message && error.message.includes('Unauthorized')) {
			throw error;
		}
		throw new Error(`API call failed: ${error.message || error}`);
	}
}

