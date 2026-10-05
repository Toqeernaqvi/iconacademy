import { useRef, useState } from 'react';
import { ArrowDownToLine, ArrowLeft, Download, FilePlus2, FileText, LogOut, Pencil, RotateCcw, Trash2, Upload, X } from 'lucide-react';
import { readNotes, writeNotes } from './notesStore';
import { boardSubjectsByClass } from './content/boardSubjects';

const classOptions = [
  { id: '9', label: 'Class 9', year: 'Matric · Part I' },
  { id: '10', label: 'Class 10', year: 'Matric · Part II' },
  { id: '11', label: 'Class 11', year: 'Intermediate · Part I' },
  { id: '12', label: 'Class 12', year: 'Intermediate · Part II' },
];
const newForm = { classId: '9', subject: 'Mathematics', customSubject: '', title: '' };
const defaultSubjectByClass = { '9': 'Mathematics', '10': 'Mathematics', '11': 'English', '12': 'English' };
function getSubjectGroups(classId) {
  const seen = new Set();
  return (boardSubjectsByClass[classId] || []).map(group => ({ ...group, options: group.options.filter(subject => {
    if (seen.has(subject)) return false;
    seen.add(subject);
    return true;
  }) })).filter(group => group.options.length);
}

function saveJson(filename, data) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function NotesAdmin({ onLogout }) {
  const [notes, setNotes] = useState(readNotes);
  const [form, setForm] = useState(newForm);
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const importRef = useRef(null);
  const fileRef = useRef(null);

  const commit = next => {
    try { writeNotes(next); setNotes(next); return true; }
    catch { setMessage('Browser storage is full. Export a backup, remove large files, or use a backend for larger libraries.'); return false; }
  };
  const onFile = event => setFile(event.target.files?.[0] || null);
  const subjectGroups = getSubjectGroups(form.classId);
  const subjectOptions = subjectGroups.flatMap(group => group.options);
  const selectedSubject = subjectOptions.includes(form.subject) ? form.subject : 'Other';
  const changeClass = classId => setForm({ ...form, classId, subject: defaultSubjectByClass[classId], customSubject: '' });
  const changeSubject = subject => setForm({ ...form, subject, customSubject: subject === 'Other' ? form.customSubject : '' });
  const submit = event => {
    event.preventDefault();
    const title = form.title.trim();
    if (!title) return setMessage('Please add a title.');
    const subject = form.subject === 'Other' ? form.customSubject.trim() : form.subject;
    if (!subject) return setMessage('Please choose or enter a subject.');
    if (!editing && !file) return setMessage('Please choose a PDF to upload.');
    if (file && file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return setMessage('Please choose a PDF file.');
    const url = file ? URL.createObjectURL(file) : editing?.url;
    const note = { id: editing?.id || `note-${Date.now()}`, classId: form.classId, subject, title, fileName: file?.name || editing?.fileName || `${title}.pdf`, url, existingAsset: false, fileData: file ? undefined : editing?.fileData };
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        note.fileData = reader.result;
        note.url = reader.result;
        const saved = commit(editing ? notes.map(item => item.id === editing.id ? note : item) : [...notes, note]);
        if (saved) setMessage(editing ? 'Note updated.' : 'PDF added to this browser. Export a backup to keep it.');
      };
      reader.onerror = () => setMessage('Could not read this PDF. Please try again.');
      reader.readAsDataURL(file);
    } else {
      if (commit(notes.map(item => item.id === editing.id ? note : item))) setMessage('Note details updated.');
    }
    resetForm();
  };
  const resetForm = () => { setForm(newForm); setFile(null); setEditing(null); if (fileRef.current) fileRef.current.value = ''; };
  const startEdit = note => {
    setEditing(note);
    const available = getSubjectGroups(note.classId).flatMap(group => group.options);
    setForm({ classId: note.classId, subject: available.includes(note.subject) ? note.subject : 'Other', customSubject: available.includes(note.subject) ? '' : note.subject, title: note.title });
    setFile(null); window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const deleteNote = note => {
    if (!window.confirm(`Delete “${note.title}”?`)) return;
    if (!commit(notes.filter(item => item.id !== note.id))) return;
    if (editing?.id === note.id) resetForm();
    setMessage('Note deleted from this browser.');
  };
  const exportBackup = () => saveJson('icon-academy-notes-backup.json', notes);
  const importBackup = event => {
    const backup = event.target.files?.[0];
    if (!backup) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed) || parsed.some(note => !note.id || !note.classId || !note.title)) throw new Error('Invalid backup');
        if (commit(parsed)) setMessage(`Restored ${parsed.length} notes from backup.`);
      } catch { setMessage('That backup file could not be read.'); }
      event.target.value = '';
    };
    reader.readAsText(backup);
  };
  const downloadNote = note => {
    const link = document.createElement('a'); link.href = note.fileData || note.url; link.download = note.fileName; link.target = '_blank'; link.rel = 'noreferrer'; link.click();
  };
  const exportWebsiteFiles = async () => {
    const manifest = notes.map(({ id, classId, subject, title, fileName, existingAsset }) => ({ id, classId, subject, title, fileName, url: existingAsset ? `/notes/${encodeURIComponent(fileName)}` : `/notes/${encodeURIComponent(fileName)}` }));
    saveJson('notes-manifest.json', manifest);
    for (const note of notes.filter(item => item.fileData)) {
      const link = document.createElement('a'); link.href = note.fileData; link.download = note.fileName; link.click();
      await new Promise(resolve => setTimeout(resolve, 180));
    }
    setMessage('Downloaded manifest and note files. Put PDFs in public/notes and replace src/content/notes.json, then redeploy to publish.');
  };

  return <main className="notes-admin-page">
    <div className="section-wrap notes-admin-wrap">
      <a className="notes-admin-back" href="/special-notes"><ArrowLeft size={16} /> View public notes page</a><a className="admin-manager-dashboard-link" href="/admin">Admin dashboard</a><button className="admin-manager-logout" type="button" onClick={onLogout}><LogOut size={14} /> Sign out</button>
      <header className="notes-admin-heading"><div><p className="course-eyebrow">ICON ACADEMY / CONTENT MANAGEMENT</p><h1>Notes manager</h1><p>Organize study resources by class, subject and title.</p></div><div className="notes-admin-count"><strong>{notes.length}</strong><span>{notes.length === 1 ? 'note' : 'notes'} in this browser</span></div></header>
      <div className="notes-admin-notice"><strong>Browser-only storage</strong><span>Changes stay in this browser. Export backups regularly. To publish updates, export website files, add the PDFs under <code>public/notes</code> and redeploy.</span></div>
      <div className="notes-admin-grid">
        <section className="notes-admin-panel">
          <p className="course-eyebrow">{editing ? 'UPDATE RESOURCE' : 'ADD RESOURCE'}</p><h2>{editing ? 'Edit this note' : 'Upload a PDF'}</h2>
          <form className="notes-admin-form" onSubmit={submit}>
            <label>Class<select value={form.classId} onChange={event => changeClass(event.target.value)}>{classOptions.map(item => <option value={item.id} key={item.id}>{item.label} — {item.year}</option>)}</select></label>
            <label>Subject<select value={selectedSubject} onChange={event => changeSubject(event.target.value)}><option value="" disabled>Select a subject</option>{subjectGroups.map(group => <optgroup label={group.label} key={group.label}>{group.options.map(subject => <option value={subject} key={subject}>{subject}</option>)}</optgroup>)}<option value="Other">Other subject…</option></select></label>
            {selectedSubject === 'Other' && <label>Enter subject name<input value={form.customSubject} onChange={event => setForm({ ...form, customSubject: event.target.value })} placeholder="Type the subject name" required /></label>}
            <label>Note title<input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="e.g. 1st Year Math Guess Paper 2026" required /></label>
            <label className="notes-upload-label">PDF file<input ref={fileRef} type="file" accept="application/pdf,.pdf" onChange={onFile} />{file ? <span className="notes-file-picked"><FileText size={16} />{file.name}</span> : editing ? <span className="notes-upload-hint">Choose a replacement PDF, or leave empty to keep the current file.</span> : <span className="notes-upload-hint"><Upload size={17} /> Select a PDF from your device</span>}</label>
            {message && <p className="notes-admin-message" role="status">{message}</p>}
            <div className="notes-admin-actions"><button className="notes-admin-primary" type="submit">{editing ? <Pencil size={16} /> : <FilePlus2 size={17} />}{editing ? 'Save changes' : 'Add note'}</button>{editing && <button className="notes-admin-secondary" type="button" onClick={resetForm}><X size={16} />Cancel</button>}</div>
          </form>
        </section>
        <section className="notes-admin-panel notes-admin-library"><div className="notes-admin-list-heading"><div><p className="course-eyebrow">LIBRARY</p><h2>Uploaded notes</h2></div></div>
          {notes.length ? <div className="notes-admin-list">{classOptions.map(classItem => {
            const classNotes = notes.filter(note => note.classId === classItem.id);
            if (!classNotes.length) return null;
            return <section className="notes-admin-class" key={classItem.id}><h3>{classItem.label} <span>{classItem.year}</span></h3>{classNotes.map(note => <article className="notes-admin-note" key={note.id}><span className="notes-admin-pdf"><FileText size={18} /></span><div className="notes-admin-note-info"><strong>{note.title}</strong><small>{note.subject} · {note.fileName}</small></div><div className="notes-admin-note-actions"><button type="button" title="Download PDF" aria-label={`Download ${note.title}`} onClick={() => downloadNote(note)}><Download size={16} /></button><button type="button" title="Edit note" aria-label={`Edit ${note.title}`} onClick={() => startEdit(note)}><Pencil size={16} /></button><button type="button" title="Delete note" aria-label={`Delete ${note.title}`} onClick={() => deleteNote(note)}><Trash2 size={16} /></button></div></article>)}</section>;
          })}</div> : <div className="notes-admin-empty"><FileText size={21} /><p>No notes uploaded yet. Add a PDF to get started.</p></div>}
        </section>
      </div>
      <section className="notes-admin-tools"><div><h2>Backup & publish</h2><p>Keep a copy of your browser library or export files for the website.</p></div><div className="notes-admin-tool-buttons"><button type="button" onClick={exportBackup}><Download size={16} />Export backup</button><button type="button" onClick={() => importRef.current?.click()}><RotateCcw size={16} />Restore backup</button><button type="button" onClick={exportWebsiteFiles}><ArrowDownToLine size={16} />Export for website</button><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importBackup} /></div></section>
    </div>
  </main>;
}
