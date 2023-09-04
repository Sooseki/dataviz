export const isValidUrl = (url: unknown): url is string => {
	if (!url || typeof url !== "string" || url.includes(" ")) return false;
	try {
		new URL(url);
	} catch {
		return false;
	}

	return true;
};
