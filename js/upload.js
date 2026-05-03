// File upload & drag-drop handler
(function() {
  let selectedFile = null;

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const browseLink = document.getElementById('browseLink');
  const preview = document.getElementById('uploadPreview');
  const previewThumb = document.getElementById('previewThumb');
  const previewName = document.getElementById('previewName');
  const previewSize = document.getElementById('previewSize');
  const removeBtn = document.getElementById('removeFile');
  const analyzeBtn = document.getElementById('analyzeBtn');

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  function handleFile(file) {
    if (!file) return;
    const validTypes = ['video/mp4','video/quicktime','video/webm','image/jpeg','image/png','image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid video (MP4, MOV, WEBM) or image (JPG, PNG, WEBP).');
      return;
    }
    const maxSize = file.type.startsWith('video') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File too large. Max: 50MB for video, 10MB for image.');
      return;
    }
    selectedFile = file;
    previewName.textContent = file.name;
    previewSize.textContent = formatSize(file.size) + ' • ' + file.type.split('/')[0];
    
    if (file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = (e) => { previewThumb.src = e.target.result; };
      reader.readAsDataURL(file);
    } else {
      previewThumb.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect fill="%231C1C1F" width="80" height="80" rx="8"/><text x="40" y="45" text-anchor="middle" fill="%23F5A623" font-size="28">🎬</text></svg>');
    }
    
    preview.classList.add('active');
    dropzone.style.display = 'none';
    analyzeBtn.disabled = false;
  }

  function removeFile() {
    selectedFile = null;
    fileInput.value = '';
    preview.classList.remove('active');
    dropzone.style.display = '';
    analyzeBtn.disabled = !document.getElementById('captionInput').value.trim();
  }

  // Event listeners
  browseLink.addEventListener('click', (e) => { e.stopPropagation(); fileInput.click(); });
  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));
  removeBtn.addEventListener('click', removeFile);

  // Drag & drop
  ['dragenter','dragover'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
  });
  ['dragleave','drop'].forEach(evt => {
    dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove('dragover'); });
  });
  dropzone.addEventListener('drop', (e) => { handleFile(e.dataTransfer.files[0]); });

  // Caption input enables analyze if no file
  const captionEl = document.getElementById('captionInput');
  function checkCaptionState() {
    if (!selectedFile) analyzeBtn.disabled = !captionEl.value.trim();
  }
  ['input', 'keyup', 'change', 'paste'].forEach(evt => {
    captionEl.addEventListener(evt, checkCaptionState);
  });
  // Periodic check as fallback for programmatic value changes
  setInterval(checkCaptionState, 500);

  // Platform selector
  document.getElementById('platformSelector').addEventListener('click', (e) => {
    const btn = e.target.closest('.platform-btn');
    if (!btn) return;
    document.querySelectorAll('.platform-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });

  // Expose
  window.getSelectedFile = () => selectedFile;
  window.getSelectedPlatform = () => document.querySelector('.platform-btn.active')?.dataset.platform || 'tiktok';
  window.getCaptionText = () => document.getElementById('captionInput').value.trim();
  window.removeSelectedFile = removeFile;
})();
