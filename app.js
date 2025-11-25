const API_KEY = 'AIzaSyBzZuifPo_zzW7mE4ssKf0tnP-P64jwBFE'; // ← ta clé
const CHANNEL_ID = 'UCyjcLfOYvI5sbv0j3vokNyg';           // ← ta chaîne
const MAX = 10; // Nombre de vidéos par page
let pageToken = '';
let currentPage = 1;
const box = document.getElementById('video-list');
const loader = document.querySelector('.loader');

async function loadVideos(page) {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX}&pageToken=${pageToken}`;
  const r = await fetch(url);
  const d = await r.json();

  if (!d.items) {
    box.innerHTML = 'Erreur API : ' + (d.error?.message || 'Vérifie la clé / quota / restrictions');
    console.error(d);
    loader.style.display = 'none';
    return;
  }

  box.innerHTML = ''; // Efface les vidéos précédentes
  d.items.forEach(v => {
    if (v.id.kind !== 'youtube#video') return;
    box.insertAdjacentHTML('beforeend', `
      <div class="card">
        <img src="${v.snippet.thumbnails.medium.url}" alt="">
        <h3>${v.snippet.title}</h3>
        <button onclick="openVideo('${v.id.videoId}', '${v.snippet.title.replace(/'/g, "\\'")}')">▶ Lire</button>
      </div>
    `);
  });

  if (d.nextPageToken) {
    pageToken = d.nextPageToken;
    const btnNext = document.createElement('button');
    btnNext.textContent = 'Page suivante';
    btnNext.onclick = () => { loadVideos(currentPage + 1); };
    box.appendChild(btnNext);
  }

  if (currentPage > 1) {
    const btnPrev = document.createElement('button');
    btnPrev.textContent = 'Page précédente';
    btnPrev.onclick = () => { loadVideos(currentPage - 1); };
    box.appendChild(btnPrev);
  }

  loader.style.display = 'none';
}

loadVideos(1).catch(e => box.innerHTML = 'Erreur : ' + e);

