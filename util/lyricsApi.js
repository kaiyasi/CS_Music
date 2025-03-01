const fetch = require("node-fetch");

async function search(query) {
  try {
    const response = await fetch(`https://api.musixmatch.com/ws/1.1/track.search?q=${encodeURIComponent(query)}&apikey=YOUR_API_KEY`);
    const data = await response.json();
    
    if(data.message.header.status_code !== 200) {
      throw new Error("搜尋歌詞時發生錯誤");
    }
    
    return data.message.body.track_list.map(track => ({
      name: track.track.track_name,
      artist: track.track.artist_name,
      url: track.track.track_share_url
    }));
  } catch (error) {
    throw new Error(`搜尋歌詞失敗: ${error.message}`);
  }
}

async function find(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    // 解析歌詞 HTML...
    
    return {
      name: "歌曲名稱",
      lyrics: "歌詞內容",
      icon: "歌曲圖示URL"
    };
  } catch (error) {
    throw new Error(`取得歌詞失敗: ${error.message}`);
  }
}

module.exports = {
  search,
  find
};