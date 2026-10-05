import { useRef, useState } from 'react';
import { ArrowLeft, CalendarDays, Download, FilePlus2, Image, LogOut, Pencil, RotateCcw, Trash2, Upload, X } from 'lucide-react';
import { readEvents, writeEvents } from './eventsStore';

const blank = { title: '', category: 'Celebration', date: '', location: 'Rizwan Garden, Lahore', description: '', videoUrl: '' };
function saveJson(filename, data) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}
function readImage(file) {
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
        resolve(canvas.toDataURL('image/jpeg', .78));
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
  const commit = next => {
    try { writeEvents(next); setEvents(next); return true; }
    catch { setMessage('Browser storage is full. Use a smaller photo or delete an event image.'); return false; }
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
      const eventItem = { ...form, id: editing?.id || `event-${Date.now()}`, title: form.title.trim(), category: form.category.trim() || 'Event', location: form.location.trim(), description: form.description.trim(), image: image ? await readImage(image) : editing.image };
      const next = editing ? events.map(item => item.id === editing.id ? eventItem : item) : [eventItem, ...events];
      if (commit(next)) setMessage(editing ? 'Event updated in this browser.' : 'Event added in this browser. Export a backup to keep it.');
      reset();
    } catch (error) { setMessage(error.message || 'Could not process this image.'); }
  };
  const startEdit = item => { setEditing(item); setForm({ title: item.title || '', category: item.category || 'Event', date: item.date || '', location: item.location || '', description: item.description || '', videoUrl: item.videoUrl || '' }); setImagePreview(item.image || ''); setImage(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const remove = item => {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    if (commit(events.filter(event => event.id !== item.id))) { if (editing?.id === item.id) reset(); setMessage('Event deleted from this browser.'); }
  };
  const importBackup = event => {
    const file = event.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { const parsed = JSON.parse(reader.result); if (!Array.isArray(parsed) || parsed.some(item => !item.id || !item.title || !item.image)) throw new Error(); if (commit(parsed)) setMessage(`Restored ${parsed.length} events.`); }
      catch { setMessage('This backup could not be read.'); }
      event.target.value = '';
    };
    reader.readAsText(file);
  };
  return <main className="notes-admin-page events-admin-page"><div className="section-wrap notes-admin-wrap">
    <a className="notes-admin-back" href="/events"><ArrowLeft size={16} /> View events page</a><a className="admin-manager-dashboard-link" href="/admin">Admin dashboard</a><a className="events-admin-notes-link" href="/admin/notes">Open notes manager</a><button className="admin-manager-logout" type="button" onClick={onLogout}><LogOut size={14} /> Sign out</button>
    <header className="notes-admin-heading"><div><p className="course-eyebrow">ICON ACADEMY / CONTENT MANAGEMENT</p><h1>Events manager</h1><p>Add campus celebrations, photos and video links.</p></div><div className="notes-admin-count"><strong>{events.length}</strong><span>{events.length === 1 ? 'event' : 'events'} in this browser</span></div></header>
    <div className="notes-admin-notice"><strong>Browser-only storage</strong><span>Updates appear on this device. Export a backup regularly. To publish on the live website, update <code>src/content/events.json</code> and add photos under <code>public/images/events</code>, then redeploy.</span></div>
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
    <section className="notes-admin-panel notes-admin-library"><div className="notes-admin-list-heading"><div><p className="course-eyebrow">EVENTS</p><h2>Published on this device</h2></div></div>
      {events.length ? <div className="notes-admin-list">{events.map(item => <article className="event-admin-row" key={item.id}><img src={item.image} alt="" /><div className="notes-admin-note-info"><strong>{item.title}</strong><small>{item.category}{item.date ? ` · ${item.date}` : ''}</small></div><div className="notes-admin-note-actions"><button type="button" title="Edit event" aria-label={`Edit ${item.title}`} onClick={() => startEdit(item)}><Pencil size={16} /></button><button type="button" title="Delete event" aria-label={`Delete ${item.title}`} onClick={() => remove(item)}><Trash2 size={16} /></button></div></article>)}</div> : <div className="notes-admin-empty"><CalendarDays size={21} /><p>No events yet. Add your first event.</p></div>}
    </section></div>
    <section className="notes-admin-tools"><div><h2>Event backups</h2><p>Export the event list, including uploaded photos, or restore a previous backup.</p></div><div className="notes-admin-tool-buttons"><button type="button" onClick={() => saveJson('icon-academy-events-backup.json', events)}><Download size={16} />Export backup</button><button type="button" onClick={() => importRef.current?.click()}><RotateCcw size={16} />Restore backup</button><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importBackup} /></div></section>
  </div></main>;
}
