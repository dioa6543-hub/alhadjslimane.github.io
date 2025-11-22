const videoList = document.getElementById('video-list');

// Liste de TES vidéos locales
const videos = [
  { id: 'video1', title: 'Intro', file: 'video1.mp4' },
  { id: 'video2', title: 'Tutoriel', file: 'video2.mp4' },
  { id: 'video3', title: 'Conclusion', file: 'video3.mp4' }
];

videos.forEach(v => {
  videoList.insertAdjacentHTML('beforeend', `
    <div class="card">
      <h3>${v.title}</h3>
      <button onclick="openVideo('${v.id}', '${v.file}', '${v.title}')">▶ Lire</button>
    </div>
  `);
});

function openVideo(id, file, title) {
  window.location.href = `videos.html?id=${id}&file=${file}&title=${encodeURIComponent(title)}`;
}
