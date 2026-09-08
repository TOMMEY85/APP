// ============================================
// CARPZONE - Gestion des Modales
// Formulaires interactifs
// ============================================

// Notifications
function showNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #b7cc85;
    color: #fff;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 600;
    z-index: 2000;
    animation: slideIn 0.3s ease;
    box-shadow: 0 4px 12px rgba(130, 157, 100, 0.4);
  `;
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Modales génériques
function openModal(title, content, onSave, onCancel) {
  const backdrop = document.createElement('div');
  backdrop.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const modal = document.createElement('div');
  modal.style.cssText = `
    background: #1a3028;
    border: 2px solid #b7cc85;
    border-radius: 12px;
    padding: 24px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
    animation: pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;

  const titleEl = document.createElement('h2');
  titleEl.style.cssText = 'color: #fff; margin-bottom: 20px; font-size: 18px;';
  titleEl.textContent = title;
  modal.appendChild(titleEl);

  // Contenu du formulaire
  const formContainer = document.createElement('div');
  formContainer.id = 'form-container';
  formContainer.innerHTML = content;
  modal.appendChild(formContainer);

  // Boutons
  const buttonContainer = document.createElement('div');
  buttonContainer.style.cssText = 'display: flex; gap: 12px; margin-top: 20px;';

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Enregistrer';
  saveBtn.style.cssText = `
    flex: 1;
    background: linear-gradient(135deg, #b7cc85 0%, #8ca963 100%);
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  `;
  saveBtn.onclick = async () => {
    const form = formContainer.querySelector('form');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validation
    const errors = validateForm(data);
    if (errors.length > 0) {
      alert('Erreurs:\n' + errors.join('\n'));
      return;
    }
    
    const saved = await onSave(data, form);
    if (saved) {
      closeModal();
    }
  };

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Annuler';
  cancelBtn.style.cssText = `
    flex: 1;
    background: #365046;
    color: #ccd4c8;
    border: 1px solid #52695d;
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  `;
  cancelBtn.onclick = () => {
    if (onCancel) onCancel();
    closeModal();
  };

  buttonContainer.appendChild(saveBtn);
  buttonContainer.appendChild(cancelBtn);
  modal.appendChild(buttonContainer);

  backdrop.appendChild(modal);
  backdrop.onclick = (e) => {
    if (e.target === backdrop) closeModal();
  };

  document.body.appendChild(backdrop);
  backdrop.id = 'modal-backdrop';
}

function closeModal() {
  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) {
    backdrop.style.animation = 'fadeOut 0.2s ease';
    setTimeout(() => {
      backdrop.remove();
      // Recharger l'écran actuel
      if (window.App && window.App.reloadAllScreens) {
        App.reloadAllScreens();
      }
    }, 200);
  }
}

function validateForm(data) {
  const errors = [];
  
  // Validation globale
  if (data.name && !data.name.trim()) errors.push('Le nom est obligatoire');
  if (data.location && !data.location.trim()) errors.push('Le lieu est obligatoire');
  if (data.weight && isNaN(parseFloat(data.weight))) errors.push('Le poids doit être un nombre');
  if (data.species && !data.species.trim()) errors.push('L\'espèce est obligatoire');
  
  return errors;
}

function compressImageFile(file, maxSize = 1280, quality = 0.78) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      resolve('');
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Impossible de lire la photo'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Photo invalide'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const scale = Math.min(1, maxSize / Math.max(width, height));
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ============================================
// FORMULAIRES SPÉCIFIQUES
// ============================================

// FORMULAIRE : Ajouter / modifier une session
function getSessionFormContent(session = {}) {
  const esc = value => String(value ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `
    <form style="display: grid; gap: 12px;">
      <div>
        <label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Nom de la session *</label>
        <input type="text" name="name" value="${esc(session.name)}" required style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;">
      </div>
      <div>
        <label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Lieu *</label>
        <input type="text" name="location" value="${esc(session.location)}" required style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;">
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Date début</label><input type="date" name="startDate" value="${esc(session.startDate)}" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
        <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Date fin</label><input type="date" name="endDate" value="${esc(session.endDate)}" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
      </div>
      <div>
        <label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">État</label>
        <select name="status" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;">
          <option value="active" ${session.status !== 'completed' ? 'selected' : ''}>En cours</option>
          <option value="completed" ${session.status === 'completed' ? 'selected' : ''}>Terminée</option>
        </select>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Air (°C)</label><input type="number" name="airTemp" value="${esc(session.airTemp)}" step="0.1" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
        <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Eau (°C)</label><input type="number" name="waterTemp" value="${esc(session.waterTemp)}" step="0.1" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Pression (hPa)</label><input type="number" name="pressure" value="${esc(session.pressure)}" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
        <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Vent (km/h)</label><input type="number" name="windSpeed" value="${esc(session.windSpeed)}" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Profondeur (m)</label><input type="number" name="depth" value="${esc(session.depth)}" step="0.1" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
        <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Distance (m)</label><input type="number" name="distance" value="${esc(session.distance)}" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
      </div>
      <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Type de fond</label><input type="text" name="substrate" value="${esc(session.substrate)}" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
      <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Commentaire</label><textarea name="notes" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;min-height:80px;">${esc(session.notes)}</textarea></div>
    </form>
  `;
}

function sessionFormData(data) {
  return {
    name: data.name,
    location: data.location,
    startDate: data.startDate,
    endDate: data.endDate,
    status: data.status || 'active',
    airTemp: data.airTemp,
    waterTemp: data.waterTemp,
    pressure: data.pressure,
    windSpeed: data.windSpeed,
    depth: data.depth,
    distance: data.distance,
    substrate: data.substrate,
    notes: data.notes
  };
}

function openAddSessionForm() {
  openModal('+ Nouvelle Session', getSessionFormContent(), (data) => {
    addSession(sessionFormData(data));
    return true;
  });
}

function openEditSessionForm(sessionId) {
  const session = AppData.sessions.find(s => s.id === sessionId);
  if (!session) return showNotification('Session introuvable');

  openModal('✏️ Modifier la session', getSessionFormContent(session), (data) => {
    updateSession(sessionId, sessionFormData(data));
    recalculateSessionStats(sessionId);
    saveAppData();
    return true;
  });
}

// FORMULAIRE : Ajouter une prise
function openAddCatchForm(preselectedSessionId = '') {
  const sessions = AppData.sessions;
  const activeSessions = sessions.filter(s => s.status === 'active');
  const sessionOptions = sessions.map(s => `
    <option value="${s.id}" ${s.id === preselectedSessionId ? 'selected' : ''}>${s.status === 'active' ? '🟢 ' : ''}${s.name} — ${s.location}</option>
  `).join('');

  const content = `
    <form style="display:grid;gap:12px;">
      <div>
        <label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Photo de la prise</label>
        <input type="file" name="photoFile" accept="image/*" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;">
        <small style="color:#94a69b;">Choisir une photo dans la photothèque ou utiliser l’appareil photo.</small>
      </div>
      <div>
        <label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Session liée</label>
        <select name="sessionId" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;">
          <option value="">Aucune session</option>${sessionOptions}
        </select>
        <small style="color:#94a69b;">${activeSessions.length ? '🟢 = session en cours' : 'Aucune session en cours.'}</small>
      </div>
      <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Espèce *</label><input type="text" name="species" value="Carpe" required style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
      <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Poids (kg) *</label><input type="number" name="weight" step="0.01" required style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
      <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Longueur (cm)</label><input type="number" name="length" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Date *</label><input type="date" name="date" value="${new Date().toISOString().split('T')[0]}" required style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
        <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Heure</label><input type="time" name="time" value="${new Date().toTimeString().slice(0,5)}" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
      </div>
      <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Lieu</label><input type="text" name="location" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
      <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Appât</label><input type="text" name="bait" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
      <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Montage</label><input type="text" name="rig" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Profondeur (m)</label><input type="number" name="depth" step="0.1" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
        <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Distance (m)</label><input type="number" name="distance" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;"></div>
      </div>
      <div><label style="color:#a6b5a9;font-size:12px;display:block;margin-bottom:4px;">Commentaire</label><textarea name="comment" style="width:100%;padding:10px;background:#14271f;border:1px solid #365046;border-radius:6px;color:#fff;min-height:80px;"></textarea></div>
    </form>
  `;

  openModal('🐟 Nouvelle Prise', content, async (data, form) => {
    const fileInput = form.querySelector('input[name="photoFile"]');
    const file = fileInput?.files?.[0];
    let photo = '';
    if (file) {
      try { photo = await compressImageFile(file); }
      catch (e) { console.error(e); showNotification('Photo non enregistrée'); }
    }

    const session = data.sessionId ? AppData.sessions.find(s => s.id === data.sessionId) : null;
    addCatch({
      sessionId: data.sessionId || '',
      photo,
      species: data.species,
      weight: parseFloat(data.weight),
      length: data.length ? parseFloat(data.length) : '',
      date: data.date,
      time: data.time,
      location: data.location || session?.location || '',
      bait: data.bait,
      rig: data.rig,
      depth: data.depth ? parseFloat(data.depth) : '',
      distance: data.distance ? parseFloat(data.distance) : '',
      comment: data.comment
    });
    return true;
  });
}

// FORMULAIRE : Ajouter un spot
function openAddSpotForm() {
  const content = `
    <form style="display: grid; gap: 12px;">
      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Nom du spot *</label>
        <input type="text" name="name" placeholder="Nouveau spot" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Lac/Plan d'eau *</label>
        <input type="text" name="lake" placeholder="Lac de Créteil" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <button type="button" onclick="App.useGPSForSpot()" style="width: 100%; padding: 10px; background: #b7cc85; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">📍 Utiliser ma position</button>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Latitude</label>
        <input type="number" name="latitude" placeholder="48.777" step="0.001" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Longitude</label>
        <input type="number" name="longitude" placeholder="2.434" step="0.001" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Profondeur (m)</label>
        <input type="number" name="depth" placeholder="4.2" step="0.1" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Type de fond</label>
        <input type="text" name="substrate" placeholder="Vase et graviers" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Distance (m)</label>
        <input type="number" name="distance" placeholder="35" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Commentaire</label>
        <textarea name="notes" placeholder="Vos observations..." style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff; min-height: 80px; resize: none;"></textarea>
      </div>
    </form>
  `;

  openModal('📍 Nouveau Spot', content, (data) => {
    addSpot({
      name: data.name,
      lake: data.lake,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      depth: parseFloat(data.depth),
      substrate: data.substrate,
      distance: parseFloat(data.distance),
      notes: data.notes
    });
    return true;
  });
}

// FORMULAIRE : Ajouter un appât
function openAddBaitForm() {
  const content = `
    <form style="display: grid; gap: 12px;">
      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Nom *</label>
        <input type="text" name="name" placeholder="Bouillette Cranberry" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Marque</label>
        <input type="text" name="brand" placeholder="Dynamite Baits" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Type</label>
        <select name="type" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
          <option value="">Sélectionner...</option>
          <option value="Bouillette">Bouillette</option>
          <option value="Pop-up">Pop-up</option>
          <option value="Wafter">Wafter</option>
          <option value="Pellet">Pellet</option>
          <option value="Graines">Graines</option>
          <option value="Pâte">Pâte</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Parfum/Saveur</label>
        <input type="text" name="flavor" placeholder="Cranberry" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Diamètre (mm)</label>
        <input type="number" name="diameter" placeholder="20" step="0.5" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Couleur</label>
        <input type="text" name="color" placeholder="Jaune/Orange" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Commentaire</label>
        <textarea name="notes" placeholder="Vos observations..." style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff; min-height: 80px; resize: none;"></textarea>
      </div>
    </form>
  `;

  openModal('🍞 Nouvel Appât', content, (data) => {
    addBait({
      name: data.name,
      brand: data.brand,
      type: data.type,
      flavor: data.flavor,
      diameter: parseFloat(data.diameter),
      color: data.color,
      notes: data.notes
    });
    return true;
  });
}

// FORMULAIRE : Ajouter une note
function openAddNoteForm() {
  const content = `
    <form style="display: grid; gap: 12px;">
      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Titre *</label>
        <input type="text" name="title" placeholder="Titre de la note" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Texte *</label>
        <textarea name="content" placeholder="Votre note..." style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff; min-height: 150px; resize: none;"></textarea>
      </div>
    </form>
  `;

  openModal('📝 Nouvelle Note', content, (data) => {
    addNote({
      title: data.title,
      content: data.content
    });
    return true;
  });
}

// Confirmation de suppression
function confirmDelete(itemType, itemName, onConfirm) {
  if (confirm(`⚠️ Êtes-vous sûr de vouloir supprimer "${itemName}" ?\n\nCette action est irréversible.`)) {
    onConfirm();
  }
}
