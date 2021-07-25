import "dotenv-safe/config";

import Discord from "discord.js";
import WebSocket from "ws";

const client = new Discord.Client();
let timeset = +new Date();

client.once("ready", async () => {
	console.log("[EthPrice] Ready");
	const ws = new WebSocket("wss://stream.binance.com:9443/stream?streams=ethusdt@ticker");

	ws.on("open", () => {
		console.log(`Opened`);
	});

	ws.on("message", async (message: string) => {
		if (+new Date() < timeset + 5000) return;
		if (!client.user || !message) return;
		const json = JSON.parse(message) as BinanceWSStream;
		await client.user.setPresence({
			status: "online",
			activity: {
				name: `$${Number(json.data.c).toFixed(2)}`,
				type: "WATCHING",
				url: "https://www.twitch.tv/somecooltwitchstreamer",
			},
		});

		timeset = +new Date();
	});
});

client.login(process.env.BOT_ETHPRICE_TOKEN);
