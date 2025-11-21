const url = `https://www.googleapis.com/youtube/v3/search?
key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&maxResults=${MAX}&pageToken=${pageToken}&type=video`;
async function load() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX}&pageToken=${pageToken}`;
  const r   = await fetch(url);
  const d   = await r.json();
  d.items.forEach(v => {
    if (v.id.kind !== 'youtube#video') return;
    box.insertAdjacentHTML('beforeend', `
      <div class="card">
        <a href="https://www.youtube.com/watch?v=${v.id.videoId}" target="_blank">
          <img src="${v.snippet.thumbnails.medium.url}" alt="">
          <h3>${v.snippet.title}</h3>
        </a>
      </div>
    `);
  });
  if (d.nextPageToken) {
    pageToken = d.nextPageToken;
    const btn = document.createElement('button');
    btn.textContent = 'Charger plus';
    btn.onclick = () => { btn.remove(); load(); };
    box.appendChild(btn);
  }
}

load().catch(e => box.innerHTML = 'Erreur : ' + e);



