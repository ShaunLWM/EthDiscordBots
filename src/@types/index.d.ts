export interface GasTrackerResult {
	LastBlock: string;
	SafeGasPrice: string;
	ProposeGasPrice: string;
	FastGasPrice: string;
}

export interface IGasTrackerApi {
	status: "1" | "0";
	message: string;
	result: GasTrackerResult;
}

export interface EthereumResult {
	usd: number;
}

export interface ICoinGeckoApi {
	ethereum: EthereumResult;
}
