interface GasTrackerResult {
	LastBlock: string;
	SafeGasPrice: string;
	ProposeGasPrice: string;
	FastGasPrice: string;
}

interface IGasTrackerApi {
	status: "1" | "0";
	message: string;
	result: GasTrackerResult;
}

interface EthereumResult {
	usd: number;
}

interface ICoinGeckoApi {
	ethereum: EthereumResult;
}

interface BinanceWSStream {
	stream: string;
	data: Data;
}

interface Data {
	e: string;
	E: number;
	s: string;
	p: string;
	P: string;
	w: string;
	x: string;
	c: string;
	Q: string;
	b: string;
	B: string;
	a: string;
	A: string;
	o: string;
	h: string;
	l: string;
	v: string;
	q: string;
	O: number;
	C: number;
	F: number;
	L: number;
	n: number;
}
