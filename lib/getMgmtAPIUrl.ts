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

	let env = guid.substring(guid.length - 1);

	// New format of guid
	if (baseUrlSuffixes.hasOwnProperty(env)) {
		return `https://mgmt${baseUrlSuffixes[env]}.aglty.io/api/v1/`
	}
	else {
		//use default url
		return `https://mgmt.aglty.io/api/v1/`;
	}
}

