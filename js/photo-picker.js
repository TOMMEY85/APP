// Shared catch photo picker. Camera capture is requested only by its own input.
const CatchPhotoPicker = {
  markup() {
    return `<fieldset class="catch-photo-picker"><legend>Photo de la prise <small>facultative</small></legend>
      <div class="photo-actions"><button type="button" data-photo-source="gallery">▧ Galerie</button><button type="button" data-photo-source="camera">◎ Prendre une photo</button></div>
      <input type="file" data-photo-input="gallery" accept="image/*" hidden>
      <input type="file" data-photo-input="camera" accept="image/*" capture="environment" hidden>
      <input type="file" data-photo-input="files" accept=".jpg,.jpeg,.png,.webp,.heic,.heif" hidden>
      <p class="photo-hint">Choisissez une image existante ou prenez une nouvelle photo.</p>
      <button type="button" class="photo-file-link" data-photo-source="files">Parcourir les fichiers</button>
      <figure class="photo-preview" hidden><img alt="Aperçu de la photo de votre prise"><figcaption></figcaption></figure>
      <button type="button" class="photo-remove" hidden>Retirer la photo</button>
      <p class="photo-status" role="status" aria-live="polite"></p>
    </fieldset>`;
  },
  init(form) {
    const picker = form?.querySelector('.catch-photo-picker');
    if (!picker) return;
    const state = { photo: '', pending: false, error: '', revision: 0 };
    form.catchPhotoState = state;
    const preview = picker.querySelector('.photo-preview');
    const status = picker.querySelector('.photo-status');
    const remove = picker.querySelector('.photo-remove');
    const draw = () => {
      preview.hidden = !state.photo;
      remove.hidden = !state.photo && !state.error && !state.pending;
      picker.setAttribute('aria-busy', String(state.pending));
      status.textContent = state.pending ? 'Préparation de la photo…' : state.error || (state.photo ? 'Photo prête à être enregistrée. Vous pouvez la remplacer.' : '');
      status.classList.toggle('photo-error', Boolean(state.error));
      if (state.photo) preview.querySelector('img').src = state.photo;
      else preview.querySelector('img').removeAttribute('src');
    };
    picker.querySelectorAll('[data-photo-source]').forEach(button => {
      button.addEventListener('click', () => picker.querySelector(`[data-photo-input="${button.dataset.photoSource}"]`).click());
    });
    picker.querySelectorAll('[data-photo-input]').forEach(input => {
      input.addEventListener('change', async () => {
        const file = input.files?.[0];
        if (!file) return; // Cancelling the native chooser keeps the previous photo.
        input.value = ''; // Allow choosing the same image again after removing it.
        const revision = ++state.revision;
        state.pending = true;
        state.error = '';
        draw();
        try {
          const photo = await this.prepare(file);
          if (revision !== state.revision || !form.isConnected) return;
          state.photo = photo;
          preview.querySelector('figcaption').textContent = file.name;
        } catch (error) {
          if (revision !== state.revision || !form.isConnected) return;
          state.error = error.message + (state.photo ? ' La photo précédente est conservée ; choisissez une autre image ou retirez-la.' : ' Choisissez une autre image ou retirez la sélection.');
        } finally {
          if (revision === state.revision && form.isConnected) {
            state.pending = false;
            draw();
          }
        }
      });
    });
    remove.addEventListener('click', () => {
      ++state.revision;
      Object.assign(state, { photo: '', pending: false, error: '' });
      picker.querySelectorAll('input').forEach(input => { input.value = ''; });
      draw();
      picker.querySelector('[data-photo-source="gallery"]').focus();
    });
  },
  ready(form) {
    const state = form.catchPhotoState;
    if (!state) return true;
    if (state.pending || state.error) {
      showNotification(state.pending ? 'Patientez pendant la préparation de la photo.' : 'Vérifiez la photo avant d’enregistrer.');
      form.querySelector('.catch-photo-picker').scrollIntoView({ block: 'nearest' });
      return false;
    }
    return true;
  },
  async prepare(file) {
    if (file.size > 25 * 1024 * 1024) throw new Error('Cette photo dépasse 25 Mo.');
    if (!(file.type.startsWith('image/') || (!file.type && /\.(jpe?g|png|webp|heic|heif)$/i.test(file.name)))) throw new Error('Sélectionnez un fichier image.');
    const url = URL.createObjectURL(file);
    try {
      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Ce format ne peut pas être lu sur cet appareil. Essayez une photo JPEG, PNG ou WebP.'));
        img.src = url;
      });
      const scale = Math.min(1, 1280 / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Impossible de préparer cette photo.');
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.78);
    } finally { URL.revokeObjectURL(url); }
  }
};
