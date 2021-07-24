import fetch from "node-fetch";

export enum ChainType {
	Binance,
	Polygon,
	Ethereum,
}

export const scrapeTokens = async (type = ChainType.Ethereum): Promise<Record<string, string>> => {
	const matches: Record<string, string> = {};
	let url = "";
	switch (type) {
		case ChainType.Binance:
			url = "https://bscscan.com/tokens";
			break;
		case ChainType.Polygon:
		default: {
			url = "https://etherscan.io/tokens";
		}
	}

	const results = await fetch(url);
	const html = await results.text();
	const pattern = /<a class='text-primary' href='\/token\/(.*?)'>(.*?)<\/a>/g;
	let match = pattern.exec(html);
	while (match) {
		matches[match[1].toLowerCase()] = match[2];
		match = pattern.exec(html);
	}

	return matches;
};
