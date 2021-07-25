import "dotenv-safe/config";
import Discord from "discord.js";
import fetch from "node-fetch";

const client = new Discord.Client();
let timeset = +new Date();

client.once("ready", async () => {
	console.log("[GasTracker] Ready");
	try {
		setInterval(async () => {
			if (+new Date() < timeset + 5000) return;
			const results = await fetch("https://api.etherscan.io/api?module=gastracker&action=gasoracle");
			const json = (await results.json()) as IGasTrackerApi;
			if (json.status === "0" || !client.user) return;
			await client.user.setPresence({
				status: "online",
				activity: {
					name: `⚡${json.result.FastGasPrice}|🏃‍♂️${json.result.ProposeGasPrice}|🐢${json.result.SafeGasPrice}`,
					type: "PLAYING",
					url: "https://www.twitch.tv/somecooltwitchstreamer",
				},
			});

			timeset = +new Date();
		}, 2500);
	} catch (error) {
		console.error(error);
	}
});

client.login(process.env.BOT_GASTRACKER_TOKEN);
