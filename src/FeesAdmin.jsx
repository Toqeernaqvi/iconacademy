import { useMemo, useRef, useState } from 'react';
import { CheckCircle2, Download, IndianRupee, Pencil, RotateCcw, Search, Trash2, UserPlus, WalletCards, X } from 'lucide-react';
import AdminShell from './AdminShell';
import { feeClassOptions, readFeeStudents, writeFeeStudents } from './feesStore';

const blankStudent = { name: '', classId: '9', monthlyFee: '', dueDay: '10', phone: '', note: '' };
const today = new Date();
const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

function saveJson(filename, data) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function classLabel(classId) {
  return feeClassOptions.find(item => item.id === classId)?.label || classId;
}

function monthLabel(month) {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(year, monthNumber - 1).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' });
}

function getPayment(student, month) {
  return student.payments?.[month] || { status: 'unpaid', amountPaid: '', paidOn: '', notes: '' };
}

function isLate(student, month, payment) {
  if (payment.status === 'paid') return false;
  const [year, monthNumber] = month.split('-').map(Number);
  const due = new Date(year, monthNumber - 1, Number(student.dueDay || 10) + 1);
  return today >= due;
}

export default function FeesAdmin({ onLogout }) {
  const [students, setStudents] = useState(readFeeStudents);
  const [form, setForm] = useState(blankStudent);
  const [editing, setEditing] = useState(null);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const importRef = useRef(null);

  const commit = next => {
    try {
      writeFeeStudents(next);
      setStudents(next);
      return true;
    } catch {
      setMessage('Browser storage is full. Export a backup and remove old records, or add a backend later.');
      return false;
    }
  };

  const visibleStudents = useMemo(() => students.filter(student => {
    const matchesClass = selectedClass === 'all' || student.classId === selectedClass;
    const text = `${student.name} ${student.phone || ''}`.toLowerCase();
    return matchesClass && text.includes(query.trim().toLowerCase());
  }), [students, selectedClass, query]);

  const summary = useMemo(() => students.reduce((total, student) => {
    const payment = getPayment(student, selectedMonth);
    const fee = Number(student.monthlyFee || 0);
    const paid = Number(payment.amountPaid || 0);
    const received = payment.status === 'paid' ? fee : Math.min(paid, fee);
    total.expected += Math.max(0, fee - received);
    total.received += received;
    if (payment.status === 'paid') total.paid += 1;
    else if (isLate(student, selectedMonth, payment)) total.late += 1;
    else total.pending += 1;
    return total;
  }, { expected: 0, received: 0, paid: 0, pending: 0, late: 0 }), [students, selectedMonth]);

  const reset = () => { setForm(blankStudent); setEditing(null); };
  const submitStudent = event => {
    event.preventDefault();
    const name = form.name.trim();
    const monthlyFee = Number(form.monthlyFee);
    const dueDay = Math.min(28, Math.max(1, Number(form.dueDay || 10)));
    if (!name) return setMessage('Please enter the student name.');
    if (!monthlyFee || monthlyFee < 1) return setMessage('Please enter a valid monthly fee.');
    const student = { id: editing?.id || `student-${Date.now()}`, name, classId: form.classId, monthlyFee, dueDay, phone: form.phone.trim(), note: form.note.trim(), payments: editing?.payments || {} };
    const next = editing ? students.map(item => item.id === editing.id ? student : item) : [...students, student];
    if (commit(next)) setMessage(editing ? 'Student updated.' : 'Student added to fee register.');
    reset();
  };

  const startEdit = student => {
    setEditing(student);
    setForm({ name: student.name, classId: student.classId, monthlyFee: String(student.monthlyFee || ''), dueDay: String(student.dueDay || 10), phone: student.phone || '', note: student.note || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeStudent = student => {
    if (!window.confirm(`Delete ${student.name} from fee register?`)) return;
    if (commit(students.filter(item => item.id !== student.id))) {
      if (editing?.id === student.id) reset();
      setMessage('Student deleted from this browser.');
    }
  };

  const updatePayment = (student, patch) => {
    const payment = { ...getPayment(student, selectedMonth), ...patch };
    const payments = { ...(student.payments || {}), [selectedMonth]: payment };
    const next = students.map(item => item.id === student.id ? { ...student, payments } : item);
    commit(next);
  };

  const markPaid = student => updatePayment(student, { status: 'paid', amountPaid: String(student.monthlyFee || ''), paidOn: new Date().toISOString().slice(0, 10) });
  const importBackup = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed) || parsed.some(item => !item.id || !item.name || !item.classId)) throw new Error();
        if (commit(parsed)) setMessage(`Restored ${parsed.length} students from backup.`);
      } catch {
        setMessage('That fee backup file could not be read.');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  return <AdminShell active="fees" title="Student Fees" onLogout={onLogout}><main className="notes-admin-page fees-admin-page"><div className="notes-admin-wrap">
    <header className="notes-admin-heading"><div><p className="course-eyebrow">ICON ACADEMY / FEE MANAGEMENT</p><h1>Fee register</h1><p>Add students class-wise, select a month, and track paid, pending and late fees.</p></div><div className="notes-admin-count"><strong>{students.length}</strong><span>{students.length === 1 ? 'student' : 'students'} in this browser</span></div></header>
    <div className="notes-admin-notice"><strong>Manual file storage</strong><span>Changes are saved in this browser only. Use export/import to keep a JSON backup file for your academy records.</span></div>

    <section className="fee-summary-grid" aria-label="Fee summary for selected month">
      <article><span><IndianRupee size={18} /></span><small>REMAINING</small><strong>Rs {summary.expected.toLocaleString('en-PK')}</strong></article>
      <article><span><WalletCards size={18} /></span><small>RECEIVED</small><strong>Rs {summary.received.toLocaleString('en-PK')}</strong></article>
      <article><span><CheckCircle2 size={18} /></span><small>PAID</small><strong>{summary.paid}</strong></article>
      <article className={summary.late ? 'is-alert' : ''}><span><WalletCards size={18} /></span><small>LATE</small><strong>{summary.late}</strong></article>
    </section>

    <div className="notes-admin-grid">
      <section className="notes-admin-panel"><p className="course-eyebrow">{editing ? 'UPDATE STUDENT' : 'ADD STUDENT'}</p><h2>{editing ? 'Edit student' : 'Add student'}</h2>
        <form className="notes-admin-form" onSubmit={submitStudent}>
          <label>Student name<input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="e.g. Ali Raza" required /></label>
          <label>Class<select value={form.classId} onChange={event => setForm({ ...form, classId: event.target.value })}>{feeClassOptions.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label>
          <label>Monthly fee<input type="number" min="1" value={form.monthlyFee} onChange={event => setForm({ ...form, monthlyFee: event.target.value })} placeholder="e.g. 5000" required /></label>
          <label>Due day<input type="number" min="1" max="28" value={form.dueDay} onChange={event => setForm({ ...form, dueDay: event.target.value })} /></label>
          <label>Phone optional<input value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} placeholder="Parent/student phone" /></label>
          <label>Note optional<textarea rows="3" value={form.note} onChange={event => setForm({ ...form, note: event.target.value })} placeholder="Discount, sibling, or timing note" /></label>
          {message && <p className="notes-admin-message" role="status">{message}</p>}
          <div className="notes-admin-actions"><button className="notes-admin-primary" type="submit">{editing ? <Pencil size={16} /> : <UserPlus size={17} />}{editing ? 'Save student' : 'Add student'}</button>{editing && <button className="notes-admin-secondary" type="button" onClick={reset}><X size={16} />Cancel</button>}</div>
        </form>
      </section>

      <section className="notes-admin-panel notes-admin-library fee-register-panel"><div className="notes-admin-list-heading fee-register-heading"><div><p className="course-eyebrow">MONTHLY REGISTER</p><h2>{monthLabel(selectedMonth)}</h2></div><label>Month<input type="month" value={selectedMonth} onChange={event => setSelectedMonth(event.target.value || currentMonth)} /></label></div>
        <div className="fee-filters"><label>Class<select value={selectedClass} onChange={event => setSelectedClass(event.target.value)}><option value="all">All classes</option>{feeClassOptions.map(item => <option value={item.id} key={item.id}>{item.label}</option>)}</select></label><label><Search size={15} />Search<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Student or phone" /></label></div>
        {visibleStudents.length ? <div className="fee-table-wrap"><table className="fee-table"><thead><tr><th>Student</th><th>Class</th><th>Fee</th><th>Status</th><th>Paid</th><th>Paid on</th><th></th></tr></thead><tbody>{visibleStudents.map(student => {
          const payment = getPayment(student, selectedMonth);
          const late = isLate(student, selectedMonth, payment);
          return <tr className={late ? 'is-late' : ''} key={student.id}><td><strong>{student.name}</strong>{student.phone && <small>{student.phone}</small>}{student.note && <small>{student.note}</small>}</td><td>{classLabel(student.classId)}</td><td>Rs {Number(student.monthlyFee || 0).toLocaleString('en-PK')}<small>Due {student.dueDay || 10}</small></td><td><select value={payment.status} onChange={event => updatePayment(student, { status: event.target.value, amountPaid: event.target.value === 'paid' ? String(student.monthlyFee || '') : payment.amountPaid })}><option value="unpaid">Unpaid</option><option value="partial">Partial</option><option value="paid">Paid</option></select>{late && <span className="fee-late-pill">Late</span>}</td><td><input type="number" min="0" value={payment.amountPaid || ''} onChange={event => updatePayment(student, { amountPaid: event.target.value, status: Number(event.target.value) >= Number(student.monthlyFee || 0) ? 'paid' : event.target.value ? 'partial' : 'unpaid' })} placeholder="0" /></td><td><input type="date" value={payment.paidOn || ''} onChange={event => updatePayment(student, { paidOn: event.target.value })} /></td><td><div className="notes-admin-note-actions"><button type="button" title="Mark paid" aria-label={`Mark ${student.name} paid`} onClick={() => markPaid(student)}><CheckCircle2 size={16} /></button><button type="button" title="Edit student" aria-label={`Edit ${student.name}`} onClick={() => startEdit(student)}><Pencil size={16} /></button><button type="button" title="Delete student" aria-label={`Delete ${student.name}`} onClick={() => removeStudent(student)}><Trash2 size={16} /></button></div></td></tr>;
        })}</tbody></table></div> : <div className="notes-admin-empty"><WalletCards size={21} /><p>No students match this class or search. Add a student to start the register.</p></div>}
      </section>
    </div>
    <section className="notes-admin-tools"><div><h2>Fee backups</h2><p>Export the student fee register as a manual JSON file, or restore a previous backup.</p></div><div className="notes-admin-tool-buttons"><button type="button" onClick={() => saveJson(`icon-academy-fees-${selectedMonth}.json`, students)}><Download size={16} />Export backup</button><button type="button" onClick={() => importRef.current?.click()}><RotateCcw size={16} />Restore backup</button><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importBackup} /></div></section>
  </div></main></AdminShell>;
}
