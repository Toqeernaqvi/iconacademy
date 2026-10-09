import { useMemo, useRef, useState } from 'react';
import { CheckCircle2, Download, IndianRupee, Pencil, RotateCcw, Search, Trash2, UserPlus, UsersRound, WalletCards, X } from 'lucide-react';
import AdminShell from './AdminShell';
import { readTeachers, writeTeachers } from './teachersStore';

const today = new Date();
const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
const blankTeacher = { name: '', subject: '', monthlySalary: '', dueDay: '5', phone: '', note: '' };

function saveJson(filename, data) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function monthLabel(month) {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(year, monthNumber - 1).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' });
}

function getSalary(teacher, month) {
  return teacher.salaries?.[month] || { status: 'unpaid', amountPaid: '', paidOn: '', notes: '' };
}

function isLate(teacher, month, salary) {
  if (salary.status === 'paid') return false;
  const [year, monthNumber] = month.split('-').map(Number);
  const due = new Date(year, monthNumber - 1, Number(teacher.dueDay || 5) + 1);
  return today >= due;
}

export default function TeachersAdmin({ onLogout }) {
  const [teachers, setTeachers] = useState(readTeachers);
  const [form, setForm] = useState(blankTeacher);
  const [editing, setEditing] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const importRef = useRef(null);

  const commit = next => {
    try {
      writeTeachers(next);
      setTeachers(next);
      return true;
    } catch {
      setMessage('Browser storage is full. Export a backup and remove old records, or add a backend later.');
      return false;
    }
  };

  const visibleTeachers = useMemo(() => teachers.filter(teacher => {
    const text = `${teacher.name} ${teacher.subject || ''} ${teacher.phone || ''}`.toLowerCase();
    return text.includes(query.trim().toLowerCase());
  }), [teachers, query]);

  const summary = useMemo(() => teachers.reduce((total, teacher) => {
    const salary = getSalary(teacher, selectedMonth);
    const monthlySalary = Number(teacher.monthlySalary || 0);
    const paid = Number(salary.amountPaid || 0);
    const paidAmount = salary.status === 'paid' ? monthlySalary : Math.min(paid, monthlySalary);
    total.remaining += Math.max(0, monthlySalary - paidAmount);
    total.paidAmount += paidAmount;
    if (salary.status === 'paid') total.paid += 1;
    else if (isLate(teacher, selectedMonth, salary)) total.late += 1;
    else total.pending += 1;
    return total;
  }, { remaining: 0, paidAmount: 0, paid: 0, pending: 0, late: 0 }), [teachers, selectedMonth]);

  const reset = () => { setForm(blankTeacher); setEditing(null); };
  const submitTeacher = event => {
    event.preventDefault();
    const name = form.name.trim();
    const monthlySalary = Number(form.monthlySalary);
    const dueDay = Math.min(28, Math.max(1, Number(form.dueDay || 5)));
    if (!name) return setMessage('Please enter the teacher name.');
    if (!monthlySalary || monthlySalary < 1) return setMessage('Please enter a valid monthly salary.');
    const teacher = { id: editing?.id || `teacher-${Date.now()}`, name, subject: form.subject.trim(), monthlySalary, dueDay, phone: form.phone.trim(), note: form.note.trim(), salaries: editing?.salaries || {} };
    const next = editing ? teachers.map(item => item.id === editing.id ? teacher : item) : [...teachers, teacher];
    if (commit(next)) setMessage(editing ? 'Teacher updated.' : 'Teacher added to salary register.');
    reset();
  };

  const startEdit = teacher => {
    setEditing(teacher);
    setForm({ name: teacher.name, subject: teacher.subject || '', monthlySalary: String(teacher.monthlySalary || ''), dueDay: String(teacher.dueDay || 5), phone: teacher.phone || '', note: teacher.note || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeTeacher = teacher => {
    if (!window.confirm(`Delete ${teacher.name} from salary register?`)) return;
    if (commit(teachers.filter(item => item.id !== teacher.id))) {
      if (editing?.id === teacher.id) reset();
      setMessage('Teacher deleted from this browser.');
    }
  };

  const updateSalary = (teacher, patch) => {
    const salary = { ...getSalary(teacher, selectedMonth), ...patch };
    const salaries = { ...(teacher.salaries || {}), [selectedMonth]: salary };
    const next = teachers.map(item => item.id === teacher.id ? { ...teacher, salaries } : item);
    commit(next);
  };

  const markPaid = teacher => updateSalary(teacher, { status: 'paid', amountPaid: String(teacher.monthlySalary || ''), paidOn: new Date().toISOString().slice(0, 10) });
  const importBackup = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed) || parsed.some(item => !item.id || !item.name)) throw new Error();
        if (commit(parsed)) setMessage(`Restored ${parsed.length} teachers from backup.`);
      } catch {
        setMessage('That teacher backup file could not be read.');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  return <AdminShell active="teachers" title="Teachers & Salary" onLogout={onLogout}><main className="notes-admin-page fees-admin-page"><div className="notes-admin-wrap">
    <header className="notes-admin-heading"><div><p className="course-eyebrow">ICON ACADEMY / SALARY MANAGEMENT</p><h1>Teacher salaries</h1><p>Add teachers, select a month, and track paid, pending and late salary records.</p></div><div className="notes-admin-count"><strong>{teachers.length}</strong><span>{teachers.length === 1 ? 'teacher' : 'teachers'} in this browser</span></div></header>
    <div className="notes-admin-notice"><strong>Manual file storage</strong><span>Teacher records are saved in this browser only. Export/import JSON backups to keep a manual salary file.</span></div>

    <section className="fee-summary-grid" aria-label="Salary summary for selected month">
      <article><span><IndianRupee size={18} /></span><small>REMAINING</small><strong>Rs {summary.remaining.toLocaleString('en-PK')}</strong></article>
      <article><span><WalletCards size={18} /></span><small>PAID OUT</small><strong>Rs {summary.paidAmount.toLocaleString('en-PK')}</strong></article>
      <article><span><CheckCircle2 size={18} /></span><small>PAID</small><strong>{summary.paid}</strong></article>
      <article className={summary.late ? 'is-alert' : ''}><span><UsersRound size={18} /></span><small>LATE</small><strong>{summary.late}</strong></article>
    </section>

    <div className="notes-admin-grid">
      <section className="notes-admin-panel"><p className="course-eyebrow">{editing ? 'UPDATE TEACHER' : 'ADD TEACHER'}</p><h2>{editing ? 'Edit teacher' : 'Add teacher'}</h2>
        <form className="notes-admin-form" onSubmit={submitTeacher}>
          <label>Teacher name<input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="e.g. Sir Ahmed" required /></label>
          <label>Subject optional<input value={form.subject} onChange={event => setForm({ ...form, subject: event.target.value })} placeholder="e.g. Mathematics" /></label>
          <label>Monthly salary<input type="number" min="1" value={form.monthlySalary} onChange={event => setForm({ ...form, monthlySalary: event.target.value })} placeholder="e.g. 40000" required /></label>
          <label>Salary due day<input type="number" min="1" max="28" value={form.dueDay} onChange={event => setForm({ ...form, dueDay: event.target.value })} /></label>
          <label>Phone optional<input value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} placeholder="Teacher phone" /></label>
          <label>Note optional<textarea rows="3" value={form.note} onChange={event => setForm({ ...form, note: event.target.value })} placeholder="Timing, class, or payment note" /></label>
          {message && <p className="notes-admin-message" role="status">{message}</p>}
          <div className="notes-admin-actions"><button className="notes-admin-primary" type="submit">{editing ? <Pencil size={16} /> : <UserPlus size={17} />}{editing ? 'Save teacher' : 'Add teacher'}</button>{editing && <button className="notes-admin-secondary" type="button" onClick={reset}><X size={16} />Cancel</button>}</div>
        </form>
      </section>

      <section className="notes-admin-panel notes-admin-library fee-register-panel"><div className="notes-admin-list-heading fee-register-heading"><div><p className="course-eyebrow">MONTHLY SALARIES</p><h2>{monthLabel(selectedMonth)}</h2></div><label>Month<input type="month" value={selectedMonth} onChange={event => setSelectedMonth(event.target.value || currentMonth)} /></label></div>
        <div className="fee-filters teacher-filters"><label><Search size={15} />Search<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Teacher, subject or phone" /></label></div>
        {visibleTeachers.length ? <div className="fee-table-wrap"><table className="fee-table teacher-table"><thead><tr><th>Teacher</th><th>Subject</th><th>Salary</th><th>Status</th><th>Paid</th><th>Paid on</th><th></th></tr></thead><tbody>{visibleTeachers.map(teacher => {
          const salary = getSalary(teacher, selectedMonth);
          const late = isLate(teacher, selectedMonth, salary);
          return <tr className={late ? 'is-late' : ''} key={teacher.id}><td><strong>{teacher.name}</strong>{teacher.phone && <small>{teacher.phone}</small>}{teacher.note && <small>{teacher.note}</small>}</td><td>{teacher.subject || 'General'}</td><td>Rs {Number(teacher.monthlySalary || 0).toLocaleString('en-PK')}<small>Due {teacher.dueDay || 5}</small></td><td><select value={salary.status} onChange={event => updateSalary(teacher, { status: event.target.value, amountPaid: event.target.value === 'paid' ? String(teacher.monthlySalary || '') : salary.amountPaid })}><option value="unpaid">Unpaid</option><option value="partial">Partial</option><option value="paid">Paid</option></select>{late && <span className="fee-late-pill">Late</span>}</td><td><input type="number" min="0" value={salary.amountPaid || ''} onChange={event => updateSalary(teacher, { amountPaid: event.target.value, status: Number(event.target.value) >= Number(teacher.monthlySalary || 0) ? 'paid' : event.target.value ? 'partial' : 'unpaid' })} placeholder="0" /></td><td><input type="date" value={salary.paidOn || ''} onChange={event => updateSalary(teacher, { paidOn: event.target.value })} /></td><td><div className="notes-admin-note-actions"><button type="button" title="Mark paid" aria-label={`Mark ${teacher.name} paid`} onClick={() => markPaid(teacher)}><CheckCircle2 size={16} /></button><button type="button" title="Edit teacher" aria-label={`Edit ${teacher.name}`} onClick={() => startEdit(teacher)}><Pencil size={16} /></button><button type="button" title="Delete teacher" aria-label={`Delete ${teacher.name}`} onClick={() => removeTeacher(teacher)}><Trash2 size={16} /></button></div></td></tr>;
        })}</tbody></table></div> : <div className="notes-admin-empty"><UsersRound size={21} /><p>No teachers match this search. Add a teacher to start the salary register.</p></div>}
      </section>
    </div>
    <section className="notes-admin-tools"><div><h2>Salary backups</h2><p>Export the teacher salary register as a manual JSON file, or restore a previous backup.</p></div><div className="notes-admin-tool-buttons"><button type="button" onClick={() => saveJson(`icon-academy-teachers-${selectedMonth}.json`, teachers)}><Download size={16} />Export backup</button><button type="button" onClick={() => importRef.current?.click()}><RotateCcw size={16} />Restore backup</button><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importBackup} /></div></section>
  </div></main></AdminShell>;
}
