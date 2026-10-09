import { useEffect, useRef, useState } from 'react';
import { CalendarDays, Download, FilePlus2, Image, Pencil, RotateCcw, Trash2, Upload, X } from 'lucide-react';
import AdminShell from './AdminShell';
import { readEvents, subscribeEvents, writeEvents } from './eventsStore';
import { deleteFirebaseFile, uploadDataUrl, uploadEventImage } from './firebaseFiles';

const blank = { title: '', category: 'Celebration', date: '', location: 'Rizwan Garden, Lahore', description: '', videoUrl: '' };
function saveJson(filename, data) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}
function resizeImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read this image.'));
    reader.onload = () => {
      const image = new window.Image();
      image.onerror = () => reject(new Error('Please choose a valid image.'));
      image.onload = () => {
        const scale = Math.min(1, 1600 / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas'); canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Could not prepare this image.')), 'image/jpeg', .78);
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function EventsAdmin({ onLogout }) {
  const [events, setEvents] = useState(readEvents);
  const [form, setForm] = useState(blank);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const imageRef = useRef(null); const importRef = useRef(null);
  useEffect(() => subscribeEvents(setEvents), []);
  const commit = async next => {
    const previous = events;
    setEvents(next);
    try { await writeEvents(next); return true; }
    catch { setEvents(previous); setMessage('Event Firebase par save nahi ho saka. Internet aur Firebase rules check karein.'); return false; }
  };
  const chooseImage = event => {
    const file = event.target.files?.[0] || null;
    setImage(file);
    if (!file) { setImagePreview(editing?.image || ''); return; }
    if (!file.type.startsWith('image/')) { setMessage('Please select an image file.'); setImage(null); return; }
    if (file.size > 12 * 1024 * 1024) { setMessage('Choose an image under 12 MB. It will be resized before saving.'); setImage(null); return; }
    setImagePreview(URL.createObjectURL(file)); setMessage('');
  };
  const reset = () => { setForm(blank); setImage(null); setImagePreview(''); setEditing(null); if (imageRef.current) imageRef.current.value = ''; };
  const submit = async event => {
    event.preventDefault();
    if (!form.title.trim()) return setMessage('Please add an event title.');
    if (!editing && !image) return setMessage('Please choose an event photo.');
    if (form.videoUrl.trim()) { try { new URL(form.videoUrl); } catch { return setMessage('Enter a complete video URL, including https://.'); } }
    try {
      const id = editing?.id || `event-${Date.now()}`;
      const oldImage = editing?.image;
      const uploadedImage = image ? await uploadEventImage(await resizeImage(image), id) : oldImage;
      const eventItem = { ...form, id, title: form.title.trim(), category: form.category.trim() || 'Event', location: form.location.trim(), description: form.description.trim(), image: uploadedImage };
      const next = editing ? events.map(item => item.id === editing.id ? eventItem : item) : [eventItem, ...events];
      if (await commit(next)) {
        if (image && oldImage && oldImage !== uploadedImage) void deleteFirebaseFile(oldImage);
        setMessage(editing ? 'Event updated in Firebase.' : 'Event published through Firebase.');
        reset();
      } else if (image) {
        void deleteFirebaseFile(uploadedImage);
      }
    } catch (error) { setMessage(error.message || 'Could not process this image.'); }
  };
  const startEdit = item => { setEditing(item); setForm({ title: item.title || '', category: item.category || 'Event', date: item.date || '', location: item.location || '', description: item.description || '', videoUrl: item.videoUrl || '' }); setImagePreview(item.image || ''); setImage(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const remove = async item => {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    if (await commit(events.filter(event => event.id !== item.id))) { if (editing?.id === item.id) reset(); void deleteFirebaseFile(item.image); setMessage('Event deleted from Firebase.'); }
  };
  const importBackup = event => {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try { const parsed = JSON.parse(reader.result); if (!Array.isArray(parsed) || parsed.some(item => !item.id || !item.title || !item.image)) throw new Error(); const prepared = await Promise.all(parsed.map(async item => item.image.startsWith('data:') ? { ...item, image: await uploadDataUrl(item.image, `events/${item.id}-restored-${Date.now()}.jpg`, 'image/jpeg') } : item)); if (await commit(prepared)) setMessage(`Restored ${prepared.length} events to Firebase.`); }
      catch { setMessage('This backup could not be read.'); }
      event.target.value = '';
    };
    reader.readAsText(file);
  };
  return <AdminShell active="events" title="Events" onLogout={onLogout}><main className="notes-admin-page events-admin-page"><div className="notes-admin-wrap">
    <header className="notes-admin-heading"><div><p className="course-eyebrow">ICON ACADEMY / CONTENT MANAGEMENT</p><h1>Events manager</h1><p>Add campus celebrations, photos and video links.</p></div><div className="notes-admin-count"><strong>{events.length}</strong><span>{events.length === 1 ? 'event' : 'events'} in Firebase</span></div></header>
    <div className="notes-admin-notice"><strong>Live Firebase publishing</strong><span>Event details save in Realtime Database and photos upload to Firebase Storage. Public event pages update automatically.</span></div>
    <div className="notes-admin-grid"><section className="notes-admin-panel"><p className="course-eyebrow">{editing ? 'UPDATE EVENT' : 'ADD EVENT'}</p><h2>{editing ? 'Edit event' : 'Create an event'}</h2>
      <form className="notes-admin-form" onSubmit={submit}>
        <label>Event title<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Teachers’ Day Celebration" required /></label>
        <label>Category<input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="e.g. Celebration" /></label>
        <label>Date (optional)<input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></label>
        <label>Location<input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Campus or city" /></label>
        <label>Event description<textarea rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Share a few details about the event" /></label>
        <label>Video link (optional)<input type="url" value={form.videoUrl} onChange={e => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://www.tiktok.com/..." /></label>
        <label className="notes-upload-label">Event photo<input ref={imageRef} type="file" accept="image/*" onChange={chooseImage} />{imagePreview ? <span className="event-admin-image-preview"><img src={imagePreview} alt="Selected event preview" /><span><Image size={15} />{image?.name || 'Current event photo'}</span></span> : <span className="notes-upload-hint"><Upload size={17} /> Select a photo (max 12 MB)</span>}</label>
        {message && <p className="notes-admin-message" role="status">{message}</p>}
        <div className="notes-admin-actions"><button className="notes-admin-primary" type="submit">{editing ? <Pencil size={16} /> : <FilePlus2 size={17} />}{editing ? 'Save event' : 'Add event'}</button>{editing && <button className="notes-admin-secondary" type="button" onClick={reset}><X size={16} />Cancel</button>}</div>
      </form>
    </section>
    <section className="notes-admin-panel notes-admin-library"><div className="notes-admin-list-heading"><div><p className="course-eyebrow">EVENTS</p><h2>Published through Firebase</h2></div></div>
      {events.length ? <div className="notes-admin-list">{events.map(item => <article className="event-admin-row" key={item.id}><img src={item.image} alt="" /><div className="notes-admin-note-info"><strong>{item.title}</strong><small>{item.category}{item.date ? ` · ${item.date}` : ''}</small></div><div className="notes-admin-note-actions"><button type="button" title="Edit event" aria-label={`Edit ${item.title}`} onClick={() => startEdit(item)}><Pencil size={16} /></button><button type="button" title="Delete event" aria-label={`Delete ${item.title}`} onClick={() => remove(item)}><Trash2 size={16} /></button></div></article>)}</div> : <div className="notes-admin-empty"><CalendarDays size={21} /><p>No events yet. Add your first event.</p></div>}
    </section></div>
    <section className="notes-admin-tools"><div><h2>Event backups</h2><p>Export event records and Firebase image URLs, or restore a previous JSON backup.</p></div><div className="notes-admin-tool-buttons"><button type="button" onClick={() => saveJson('icon-academy-events-backup.json', events)}><Download size={16} />Export backup</button><button type="button" onClick={() => importRef.current?.click()}><RotateCcw size={16} />Restore backup</button><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importBackup} /></div></section>
  </div></main></AdminShell>;
}
