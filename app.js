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
    const videoId = v.id.videoId;
    box.insertAdjacentHTML('beforeend', `
      <div class="card">
        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
          <img src="${v.snippet.thumbnails.medium.url}" alt="">
          <h3>${v.snippet.title}</h3>
        </a>
        <div class="video-options">
          <button onclick="copyVideoLink('${videoId}')">Copier</button>
          <button onclick="shareVideo('${videoId}')">Partager</button>
          <button onclick="downloadVideo('${videoId}')">Télécharger</button>
          <button onclick="alert('Enregistrer la vidéo ${videoId}')">Enregistrer</button>
          <button onclick="alert('Effacer la vidéo ${videoId}')">Effacer</button>
        </div>
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

function copyVideoLink(videoId) {
  const link = `https://www.youtube.com/watch?v=${videoId}`;
  navigator.clipboard.writeText(link).then(() => {
    alert('Lien copié dans le presse-papier');
  }).catch(err => {
    console.error('Impossible de copier :', err);
  });
}

function shareVideo(videoId) {
  const link = `https://www.youtube.com/watch?v=${videoId}`;
  if (navigator.share) {
    navigator.share({
      title: 'Partager la vidéo',
      url: link
    }).then(() => {
      console.log('Partagé avec succès');
    }).catch(err => {
      console.error('Erreur lors du partage :', err);
    });
  } else {
    alert('Votre navigateur ne supporte pas la fonctionnalité de partage. Copiez ce lien : ' + link);
  }
}

function downloadVideo(videoId) {
  const link = `https://www.youtube.com/watch?v=${videoId}`;
  const blob = new Blob([link], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `video_${videoId}.txt`;
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
