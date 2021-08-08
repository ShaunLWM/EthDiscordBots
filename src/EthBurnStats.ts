import "dotenv-safe/config";

import Discord from "discord.js";
import { ethers } from "ethers";
import WebSocket from "ws";

const client = new Discord.Client();
const timeset = +new Date();

client.once("ready", async () => {
	console.log("[EthPrice] Ready");
	if (!process.env.CHANNEL_LOGS) throw new Error("No CHANNEL_LOGS env");

	const logChannel = await client.channels.fetch(process.env.CHANNEL_LOGS as string);
	if (!logChannel.isText()) throw new Error("Not a text channel");

	const ws = new WebSocket("wss://mainnet.infura.io/ws/v3/db9d4a8b9a6640e0ab237fd8a103e6b5");
	const provider = new ethers.providers.JsonRpcProvider(
		"https://mainnet.infura.io/v3/db9d4a8b9a6640e0ab237fd8a103e6b5"
	);

	ws.on("open", () => {
		console.log(`Opened`);
		ws.send(
			JSON.stringify({
				id: 1,
				jsonrpc: "2.0",
				method: "eth_subscribe",
				params: ["newHeads"],
			})
		);
	});

	ws.on("error", (error) => {
		console.log(error);
	});

	ws.on("message", (msg) => {
		console.log(JSON.parse(msg));
	});

	// ws.on("message", async (message: string) => {
	// 	if (+new Date() < timeset + 5000) return;
	// 	if (!client.user || !message) return;
	// 	const json = JSON.parse(message) as BinanceWSStream;
	// 	await client.user.setPresence({
	// 		status: "online",
	// 		activity: {
	// 			name: `$${Number(json.data.c).toFixed(2)}`,
	// 			type: "WATCHING",
	// 			url: "https://www.twitch.tv/somecooltwitchstreamer",
	// 		},
	// 	});

	// 	timeset = +new Date();
	// });
});

client.login(process.env.BOT_BURNSTATS_TOKEN);
