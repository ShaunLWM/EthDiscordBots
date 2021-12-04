import "dotenv-safe/config";

import Discord from "discord.js";
import fetch from "node-fetch";

const client = new Discord.Client();

interface CgResult {
	ethereum: {
		usd: number;
	};
}

client.login(process.env.BOT_ETHPRICE_TOKEN).then(async () => {
	setInterval(async () => {
		if (!client.user) return;
		try {
			const result = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
			const json = (await result.json()) as CgResult;
			await client.user.setPresence({
				status: "online",
				activity: {
					name: `$${Number(json.ethereum.usd).toFixed(2)}`,
					type: "WATCHING",
					url: "https://www.twitch.tv/somecooltwitchstreamer",
				},
			});
		} catch (error) {
			console.log(error);
		}
	}, 5000);
});
