interface Props {
	/**
	 * The instance guid
	 */
	guid: string
}

export const getMgmtAPIUrl = ({ guid }: Props) => {
	let baseUrlSuffixes: { [key: string]: string } = {
		u: '',
		c: '-ca',
		e: '-eu',
		a: '-aus',
		d: '-dev'
	}

	// Extract the suffix after the last '-' in the guid.
	// Only treat it as an environment indicator if it's a single character
	// matching one of the known environment keys. This avoids misclassifying
	// standard GUIDs that end with characters like 'd'.
	const lastDashIndex = guid.lastIndexOf('-')
	const afterDash = lastDashIndex !== -1 ? guid.substring(lastDashIndex + 1) : guid
	const env = afterDash.length === 1 ? afterDash : ''

	// New format of guid
	if (baseUrlSuffixes.hasOwnProperty(env)) {
		return `https://mgmt${baseUrlSuffixes[env]}.aglty.io/api/v1/`
	}
	else {
		//use default url
		return `https://mgmt.aglty.io/api/v1/`
	}
}

