import "dotenv-safe/config";
import Discord from "discord.js";
import { ethers } from "ethers";
import { sleep } from "./utils/Helper";
import { ConfigManager } from "./utils/ConfigManager";
import { ChainType, scrapeTokens } from "./utils/TokenScraper";

interface ConfigSheet {
	tokens: Record<string, string>;
	lastUpdated: number;
}

const CHANNELS = process.env.BOT_PAIRTRACKER_CHANNELS
	? process.env.BOT_PAIRTRACKER_CHANNELS.split(",")
	: ["868292871181201408"];

const client = new Discord.Client();
const localConfig = new ConfigManager("pair_tracker.json");

client.once("ready", async () => {
	console.log("[PairTracker] Ready");
	let tokens = localConfig.get<ConfigSheet>("tokens") as Record<string, string>;
	if ((localConfig.get<ConfigSheet>("lastUpdated") as number) + 86400 < new Date().getTime() || !tokens) {
		tokens = await scrapeTokens(ChainType.Binance);
		localConfig.set<ConfigSheet>("tokens", tokens);
		localConfig.set("lastUpdated", new Date().getTime());
	}

	if (!tokens) {
		tokens = {};
	}

	const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org");
	const factory = new ethers.Contract(
		"0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
		["event PairCreated(address indexed token0, address indexed token1, address pair, uint)"],
		provider
	);

	factory.on("PairCreated", async (token0, token1, pairAddress) => {
		console.log();
		for (const channel of CHANNELS) {
			const c = await client.channels.fetch(channel);
			if (!c.isText()) continue;
			await c.send(`
			=================
			token0: ${tokens[token0.toLowerCase()] ?? token0}
			token1: ${tokens[token1.toLowerCase()] ?? token1}
			pairAddress: ${pairAddress}
		`);
			await sleep(500);
		}
	});
});

client.login(process.env.BOT_PAIRTRACKER_TOKEN);
