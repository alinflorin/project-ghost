export const toPascalCase = (str: string): string | null => {
	if (str == null) {
		return null;
	}
	if (str.length === 0) {
		return str;
	}
	if (str.length === 1) {
		return str[0].toLowerCase();
	}
	return str[0].toLowerCase() + str.substring(1);
};
