module.exports = {
    helpCmdPerPage: 10, //- /help指令每頁指令數
    lyricsMaxResults: 5, //- 不要碰
    adminId: "759651999036997672", //- 設定管理員，填入你的Discord ID
    token: process.env.token || "MTMzNTYwMjkzNTcwNjU1NDM3OA.G4NV5H.2FtC1jomplUoNzSMJYnqwDHA2vHKCgNTkV8MDc", //- 機器人的token
    clientId: process.env.clientId || "1335602935706554378", //- 機器人的ID
    clientSecret: process.env.clientSecret || "FWZybY6WWTg0vvodssFl2z2OJZp_0054", //- 機器人的Client secret
    port: 4200, //- API和網頁控制台的port，依需求更改，否則保留不變
    scopes: ["identify", "guilds", "applications.commands"], //- 不要碰
    inviteScopes: ["bot", "applications.commands"], // 這也不要碰
    serverDeafen: true, //- 機器人是否設為拒聽
    defaultVolume: 100, //- 音樂播放時的聲音大小，建議50
    supportServer: "https://discord.gg/sbySMS7m3v", //- 支援伺服器，預設為官方的就行
    Issues: "https://github.com/SudhanPlayz/Discord-MusicBot/issues", //- 機器人的錯誤回報
    permissions: 277083450689, //- 機器人權限，不用改
    disconnectTime: 30000, //- 設定語音裡持續幾秒都沒有人便自動斷線(單位為毫秒)，設定"1"則會立即斷線
    twentyFourSeven: false, //- 設定為true，則機器人會永遠待在語音頻道，直到你手動將其斷線
    autoQueue: false, //- 設為true，則機器人會在你指定的音樂撥放完畢後自動加入相關的歌曲(類似自動撥放)
    autoPause: true, //- 設為true，當所有人離開語音頻道後，機器人會自動暫停撥放音樂
    autoLeave: false, //- 設為true，機器人會在所有人離開語音頻道後自動斷線
    debug: false, //- 除錯模式，只有在你知道你在幹嘛的時候才能開啟這個選項
    cookieSecret: "CodingWithSudhan is epic", //- 不要碰
    website: "http://localhost:4200", //- 如果是在電腦上執行則不需要更改，如果是在雲端主機上執行則依需求更改
    // Lavalink server; 連線到公共Lavalink -> https://lavalink-list.darrennathanael.com/; 自己創建一個 -> https://darrennathanael.com/post/how-to-lavalink
	nodes: [
        {
            identifier: "Main Node", //- Used for indentifier in stats commands.
            host: "lava-v3.ajieblogs.eu.org", //- The host name or IP of the lavalink server.
            port: 443, // The port that lavalink is listening to. This must be a number!
            password: "https://dsc.gg/ajidevserver", //- The password of the lavalink server.
            retryAmount: 200, //- The amount of times to retry connecting to the node if connection got dropped.
            retryDelay: 40, //- Delay between reconnect attempts if connection is lost.
            secure: true, //- Can be either true or false. Only use true if ssl is enabled!
        },
    ],
    embedColor: "#2f3136", //- Discord embed顏色 支援hex color
    // 狀態顯示 
    presence: {
        // PresenceData object | https://discord.js.org/#/docs/main/stable/typedef/PresenceData
        status: "online", //- 選項:online, idle, dnd invisible (注意: invisible 會讓其他人以為機器人未開啟)
        activities: [
            {
                name: "Music", //- 狀態文字
                type: "LISTENING", //- 選項:PLAYING, WATCHING, LISTENING, STREAMING
            },
        ],
    },
    iconURL: "https://cdn.darrennathanael.com/icons/spinning_disk.gif", //- 每個embed中會顯示的圖標
};