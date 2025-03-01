require('dotenv').config()

// 修正 ReadableStream 不存在的問題
try {
  if (typeof ReadableStream === 'undefined' && typeof window === 'undefined') {
    const { Readable } = require('stream');
    global.ReadableStream = Readable;
    console.log("已設定全局 ReadableStream");
  }
} catch (error) {
  console.error("設定 ReadableStream 時出錯:", error);
}

const DiscordMusicBot = require("./lib/DiscordMusicBot");
const { exec } = require("child_process");

if (process.env.REPL_ID) {
	console.log("Replit system detected, initiating special `unhandledRejection` event listener.")
	process.on('unhandledRejection', (reason, promise) => {
		promise.catch((err) => {
			if (err.status === 429) {
				console.log("something went wrong whilst trying to connect to discord gateway, resetting...");
				exec("kill 1");
			}
		});
	});
}

const client = new DiscordMusicBot();

console.log("Make sure to fill in the config.js before starting the bot.");

const getClient = () => client;

module.exports = {
	getClient,
};
