import { describe, it, expect } from 'vitest'
import { getMgmtAPIUrl } from '../../lib/getMgmtAPIUrl'

// Sample GUIDs provided
const samples = [
	{ guid: '803b4d97-8c27-46c4-87c1-b9e60168519d', expected: 'https://mgmt.aglty.io/api/v1/' },
	{ guid: '67bc73e6-u', expected: 'https://mgmt.aglty.io/api/v1/' },
	{ guid: 'cdcodaco-d', expected: 'https://mgmt-dev.aglty.io/api/v1/' },
	{ guid: 'ccf21984-c', expected: 'https://mgmt-ca.aglty.io/api/v1/' },
	{ guid: 'ccf21984-a', expected: 'https://mgmt-aus.aglty.io/api/v1/' },
	{ guid: 'ccf21984-e', expected: 'https://mgmt-eu.aglty.io/api/v1/' },
]

describe('getMgmtAPIUrl', () => {
	it('returns correct base URL for known env suffixes', () => {
		for (const { guid, expected } of samples) {
			const url = getMgmtAPIUrl({ guid })
			console.log("Testing GUID:", guid, "=> URL:", url)

			expect(url).toBe(expected)
		}
	})
})
