import "dotenv-safe/config";

import Discord from "discord.js";
import WebSocket from "ws";

const client = new Discord.Client();
let timeset = +new Date();

client.once("ready", async () => {
	console.log("[EthPrice] Ready");
	if (!process.env.CHANNEL_LOGS) throw new Error("No CHANNEL_LOGS env");

	const logChannel = await client.channels.fetch(process.env.CHANNEL_LOGS as string);
	if (!logChannel.isText()) throw new Error("Not a text channel");

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

	ws.on("ping", () => {
		ws.pong();
	});

	ws.on("error", async (e) => {
		await logChannel.send(JSON.stringify(e.message));
	});

	ws.on("close", async () => {
		await logChannel.send(`Disconnected.. awaiting new connection..`);
	});
});

client.login(process.env.BOT_ETHPRICE_TOKEN);
