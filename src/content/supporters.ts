export type Supporter = {
	/** Name as the supporter wants it displayed. */
	name: string;
	/** ISO date (YYYY-MM-DD) of the donation. Optional. */
	date?: string;
};

/**
 * Add a supporter by appending an entry below, newest last.
 * Only names are listed: no amounts, no messages.
 */
export const supporters: Supporter[] = [];
