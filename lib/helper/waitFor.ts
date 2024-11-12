export function waitFow(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
