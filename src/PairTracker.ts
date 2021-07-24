import "dotenv-safe/config";
import Discord from "discord.js";
import { ethers } from "ethers";
import { sleep } from "./utils/Helper";

const CHANNELS = process.env.BOT_PAIRTRACKER_CHANNELS
	? process.env.BOT_PAIRTRACKER_CHANNELS.split(",")
	: ["868292871181201408"];

const client = new Discord.Client();

client.once("ready", async () => {
	console.log("[PairTracker] Ready");
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
			New pair detected
			=================
			token0: ${token0}
			token1: ${token1}
			pairAddress: ${pairAddress}
		`);
			await sleep(500);
		}
	});
});

client.login(process.env.BOT_PAIRTRACKER_TOKEN);
