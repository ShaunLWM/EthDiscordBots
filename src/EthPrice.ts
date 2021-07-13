import "dotenv-safe/config";

import Discord from "discord.js";
import fetch from "node-fetch";

import { ICoinGeckoApi } from "./@types";

const client = new Discord.Client();
let timeset = +new Date();

client.once("ready", async () => {
	console.log("[EthPrice] Ready");
	try {
		setInterval(async () => {
			if (+new Date() < timeset + 5000) return;
			const results = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
			const json = (await results.json()) as ICoinGeckoApi;
			if (!client.user || !json.ethereum) return;
			await client.user.setPresence({
				status: "online",
				activity: {
					name: `$${json.ethereum.usd}`,
					type: "WATCHING",
					url: "https://www.twitch.tv/somecooltwitchstreamer",
				},
			});

			timeset = +new Date();
		}, 2500);
	} catch (error) {
		console.error(error);
	}
});

client.login(process.env.BOT_ETHPRICE_TOKEN);
