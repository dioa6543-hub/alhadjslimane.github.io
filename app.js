const API_KEY = 'AIzaSyBzZuifPo_zzW7mE4ssKf0tnP-P64jwBFE'; // Remplace par ta clé API
const CHANNEL_ID = 'UC_x5XG1OV2P6uZZ5FSM9Ttw'; // ID de la chaîne YouTube
const MAX = 50;
let pageToken = '';
const box = document.getElementById('video-list');
const loader = document.querySelector('.loader'); // Définis loader ici

async function load() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX}&pageToken=${pageToken}`;
  const r = await fetch(url);
  const d = await r.json();

  if (!d.items) {
    box.innerHTML = 'Erreur API : ' + (d.error?.message || 'Vérifie la clé / quota / restrictions');
    console.error(d);
    loader.style.display = 'none'; // Utilise loader ici
    return;
  }

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
    btn.className = 'load-more';
    btn.textContent = 'Charger plus';
    btn.onclick = () => { btn.remove(); load(); };
    box.appendChild(btn);
  }

  loader.style.display = 'none'; // Utilise loader ici
}

load().catch(e => box.innerHTML = 'Erreur : ' + e);
