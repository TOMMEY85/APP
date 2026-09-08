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
    if (saveBtn.disabled) return;
    const form = formContainer.querySelector('form');
    if (!form || !form.reportValidity() || !CatchPhotoPicker.ready(form)) return;
    const data = Object.fromEntries(new FormData(form));
    const errors = validateForm(data);
    if (errors.length) { alert('Erreurs:\n' + errors.join('\n')); return; }
    saveBtn.disabled = true;
    saveBtn.textContent = 'Enregistrement…';
    try {
      if (await onSave(data, form)) closeModal();
    } catch (error) {
      console.error(error);
      showNotification('Enregistrement impossible. Votre formulaire est conservé.');
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Enregistrer';
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
  CatchPhotoPicker.init(formContainer.querySelector('form'));
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

// ============================================
// FORMULAIRES SPÉCIFIQUES
// ============================================

// FORMULAIRE : Ajouter une session
function openAddSessionForm() {
  const content = `
    <form style="display: grid; gap: 12px;">
      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Nom de la session *</label>
        <input type="text" name="name" placeholder="Ex: Session Créteil" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>
      
      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Lieu *</label>
        <input type="text" name="location" placeholder="Ex: Lac de Créteil" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>
      
      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Date de début</label>
        <input type="date" name="startDate" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>
      
      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Date de fin</label>
        <input type="date" name="endDate" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Température de l'air (°C)</label>
        <input type="number" name="airTemp" placeholder="24" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Température de l'eau (°C)</label>
        <input type="number" name="waterTemp" placeholder="19" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Pression (mb)</label>
        <input type="number" name="pressure" placeholder="1015" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Vent (km/h)</label>
        <input type="number" name="windSpeed" placeholder="8" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Profondeur (m)</label>
        <input type="number" name="depth" placeholder="2.5" step="0.1" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Distance de pêche (m)</label>
        <input type="number" name="distance" placeholder="35" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Type de fond</label>
        <input type="text" name="substrate" placeholder="Vase et graviers" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Commentaire</label>
        <textarea name="notes" placeholder="Vos observations..." style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff; min-height: 80px; resize: none;"></textarea>
      </div>
    </form>
  `;

  openModal('+ Nouvelle Session', content, (data) => {
    addSession({
      name: data.name,
      location: data.location,
      startDate: data.startDate,
      endDate: data.endDate,
      airTemp: data.airTemp,
      waterTemp: data.waterTemp,
      pressure: data.pressure,
      windSpeed: data.windSpeed,
      depth: data.depth,
      distance: data.distance,
      substrate: data.substrate,
      notes: data.notes
    });
    return true;
  });
}

// FORMULAIRE : Ajouter une prise
function openAddCatchForm() {
  const content = `
    <form style="display: grid; gap: 12px;">
      ${CatchPhotoPicker.markup()}
      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Espèce *</label>
        <input type="text" name="species" placeholder="Ex: Carpe commune" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Poids (kg) *</label>
        <input type="number" name="weight" placeholder="18.5" step="0.1" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Longueur (cm)</label>
        <input type="number" name="length" placeholder="68" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Date *</label>
        <input type="date" name="date" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Heure</label>
        <input type="time" name="time" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Lieu</label>
        <input type="text" name="location" placeholder="Lac de Créteil" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Appât</label>
        <input type="text" name="bait" placeholder="Bouillette" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Diamètre appât (mm)</label>
        <input type="number" name="boilieSize" placeholder="20" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Couleur</label>
        <input type="text" name="boilieColor" placeholder="Jaune/Orange" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Montage</label>
        <input type="text" name="rig" placeholder="D-Rig" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Profondeur (m)</label>
        <input type="number" name="depth" placeholder="2.5" step="0.1" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Distance (m)</label>
        <input type="number" name="distance" placeholder="35" style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff;">
      </div>

      <div>
        <label style="color: #a6b5a9; font-size: 12px; display: block; margin-bottom: 4px;">Commentaire</label>
        <textarea name="comment" placeholder="Vos observations..." style="width: 100%; padding: 10px; background: #14271f; border: 1px solid #365046; border-radius: 6px; color: #fff; min-height: 80px; resize: none;"></textarea>
      </div>
    </form>
  `;

  openModal('🐟 Nouvelle Prise', content, (data, form) => {
    addCatch({
      photo: form.catchPhotoState?.photo || '',
      species: data.species,
      weight: parseFloat(data.weight),
      length: data.length,
      date: data.date,
      time: data.time,
      location: data.location,
      bait: data.bait,
      boilieSize: data.boilieSize,
      boilieColor: data.boilieColor,
      rig: data.rig,
      depth: parseFloat(data.depth),
      distance: parseFloat(data.distance),
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
