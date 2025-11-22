const API_KEY = 'AIzaSyBzZuifPo_zzW7mE4ssKf0tnP-P64jwBFE';
const CHANNEL_ID = 'UCyjcLfOYvI5sbv0j3vokNyg';
const MAX = 50;
let pageToken = '';
const box = document.getElementById('video-list');
const loader = document.querySelector('.loader');

async function load() {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&maxResults=${MAX}&pageToken=${pageToken}&type=video`;
  const r = await fetch(url);
  const d = await r.json();

  if (!d.items) {
    box.innerHTML = 'Erreur API : ' + (d.error?.message || 'Vérifie la clé / quota / restrictions');
    console.error(d);
    loader.style.display = 'none';
    return;
  }

  d.items.forEach(v => {
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

  loader.style.display = 'none';
}

// Temps maximal de chargement
setTimeout(() => {
  if (loader.style.display !== 'none') {
    box.innerHTML = 'Le chargement a pris trop de temps. Veuillez réessayer.';
    loader.style.display = 'none';
  }
}, 10000); // 10 secondes

function copyText() {
  const text = document.getElementById('video-list').innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert('Texte copié dans le presse-papier');
  }).catch(err => {
    console.error('Impossible de copier :', err);
  });
}

function downloadText() {
  const text = document.getElementById('video-list').innerText;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'videos.txt';
  a.click();
}

function showOptions() {
  const options = document.getElementById('options');
  if (options.style.display === 'none') {
    options.style.display = 'block';
  } else {
    options.style.display = 'none';
  }
}

load().catch(e => {
  box.innerHTML = 'Erreur : ' + e;
  loader.style.display = 'none';
});
