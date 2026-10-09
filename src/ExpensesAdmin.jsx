import { useMemo, useRef, useState } from 'react';
import { CheckCircle2, Download, IndianRupee, Pencil, ReceiptText, RotateCcw, Search, Trash2, WalletCards, X } from 'lucide-react';
import AdminShell from './AdminShell';
import { expenseCategories, readExpenses, writeExpenses } from './expensesStore';

const today = new Date();
const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
const blankExpense = { title: '', category: 'Building rent', amount: '', dueDate: new Date().toISOString().slice(0, 10), paidDate: '', status: 'unpaid', vendor: '', note: '' };

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

function monthFromDate(date) {
  return date ? date.slice(0, 7) : currentMonth;
}

function isLate(expense) {
  if (expense.status === 'paid') return false;
  if (!expense.dueDate) return false;
  return new Date(expense.dueDate) < new Date(today.toISOString().slice(0, 10));
}

export default function ExpensesAdmin({ onLogout }) {
  const [expenses, setExpenses] = useState(readExpenses);
  const [form, setForm] = useState(blankExpense);
  const [editing, setEditing] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const importRef = useRef(null);

  const commit = next => {
    try {
      writeExpenses(next);
      setExpenses(next);
      return true;
    } catch {
      setMessage('Browser storage is full. Export a backup and remove old records, or add a backend later.');
      return false;
    }
  };

  const monthlyExpenses = useMemo(() => expenses.filter(expense => monthFromDate(expense.dueDate || expense.paidDate) === selectedMonth), [expenses, selectedMonth]);
  const visibleExpenses = useMemo(() => monthlyExpenses.filter(expense => {
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    const text = `${expense.title} ${expense.category} ${expense.vendor || ''} ${expense.note || ''}`.toLowerCase();
    return matchesCategory && text.includes(query.trim().toLowerCase());
  }), [monthlyExpenses, selectedCategory, query]);

  const summary = useMemo(() => monthlyExpenses.reduce((total, expense) => {
    const amount = Number(expense.amount || 0);
    total.total += amount;
    if (expense.status === 'paid') {
      total.paid += amount;
      total.paidCount += 1;
    } else {
      total.remaining += amount;
      if (isLate(expense)) total.late += 1;
      else total.pending += 1;
    }
    return total;
  }, { total: 0, paid: 0, remaining: 0, paidCount: 0, pending: 0, late: 0 }), [monthlyExpenses]);

  const reset = () => { setForm(blankExpense); setEditing(null); };
  const submitExpense = event => {
    event.preventDefault();
    const title = form.title.trim();
    const amount = Number(form.amount);
    if (!title) return setMessage('Please enter the expense title.');
    if (!amount || amount < 1) return setMessage('Please enter a valid expense amount.');
    const expense = { id: editing?.id || `expense-${Date.now()}`, title, category: form.category, amount, dueDate: form.dueDate, paidDate: form.paidDate, status: form.status, vendor: form.vendor.trim(), note: form.note.trim() };
    const next = editing ? expenses.map(item => item.id === editing.id ? expense : item) : [expense, ...expenses];
    if (commit(next)) setMessage(editing ? 'Expense updated.' : 'Expense added.');
    reset();
  };

  const startEdit = expense => {
    setEditing(expense);
    setForm({ title: expense.title || '', category: expense.category || 'Miscellaneous', amount: String(expense.amount || ''), dueDate: expense.dueDate || new Date().toISOString().slice(0, 10), paidDate: expense.paidDate || '', status: expense.status || 'unpaid', vendor: expense.vendor || '', note: expense.note || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeExpense = expense => {
    if (!window.confirm(`Delete ${expense.title}?`)) return;
    if (commit(expenses.filter(item => item.id !== expense.id))) {
      if (editing?.id === expense.id) reset();
      setMessage('Expense deleted from this browser.');
    }
  };

  const updateExpense = (expense, patch) => {
    const nextItem = { ...expense, ...patch };
    const next = expenses.map(item => item.id === expense.id ? nextItem : item);
    commit(next);
  };

  const markPaid = expense => updateExpense(expense, { status: 'paid', paidDate: new Date().toISOString().slice(0, 10) });
  const importBackup = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed) || parsed.some(item => !item.id || !item.title || !item.category)) throw new Error();
        if (commit(parsed)) setMessage(`Restored ${parsed.length} expenses from backup.`);
      } catch {
        setMessage('That expense backup file could not be read.');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  return <AdminShell active="expenses" title="Expenses" onLogout={onLogout}><main className="notes-admin-page fees-admin-page expenses-admin-page"><div className="notes-admin-wrap">
    <header className="notes-admin-heading"><div><p className="course-eyebrow">ICON ACADEMY / EXPENSE MANAGEMENT</p><h1>Expenses</h1><p>Track monthly academy expenses like rent, staff salaries, petrol, bills and miscellaneous costs.</p></div><div className="notes-admin-count"><strong>{monthlyExpenses.length}</strong><span>{monthlyExpenses.length === 1 ? 'expense' : 'expenses'} this month</span></div></header>
    <div className="notes-admin-notice"><strong>Manual file storage</strong><span>Expenses are saved in this browser only. Export/import JSON backups to keep a manual accounts file.</span></div>

    <section className="fee-summary-grid" aria-label="Expense summary for selected month">
      <article><span><IndianRupee size={18} /></span><small>TOTAL</small><strong>Rs {summary.total.toLocaleString('en-PK')}</strong></article>
      <article><span><WalletCards size={18} /></span><small>PAID</small><strong>Rs {summary.paid.toLocaleString('en-PK')}</strong></article>
      <article><span><ReceiptText size={18} /></span><small>REMAINING</small><strong>Rs {summary.remaining.toLocaleString('en-PK')}</strong></article>
      <article className={summary.late ? 'is-alert' : ''}><span><ReceiptText size={18} /></span><small>LATE</small><strong>{summary.late}</strong></article>
    </section>

    <div className="notes-admin-grid">
      <section className="notes-admin-panel"><p className="course-eyebrow">{editing ? 'UPDATE EXPENSE' : 'ADD EXPENSE'}</p><h2>{editing ? 'Edit expense' : 'Add expense'}</h2>
        <form className="notes-admin-form" onSubmit={submitExpense}>
          <label>Expense title<input value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="e.g. October building rent" required /></label>
          <label>Category<select value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>{expenseCategories.map(category => <option value={category} key={category}>{category}</option>)}</select></label>
          <label>Amount<input type="number" min="1" value={form.amount} onChange={event => setForm({ ...form, amount: event.target.value })} placeholder="e.g. 80000" required /></label>
          <label>Status<select value={form.status} onChange={event => setForm({ ...form, status: event.target.value, paidDate: event.target.value === 'paid' && !form.paidDate ? new Date().toISOString().slice(0, 10) : form.paidDate })}><option value="unpaid">Unpaid</option><option value="partial">Partial</option><option value="paid">Paid</option></select></label>
          <label>Due date<input type="date" value={form.dueDate} onChange={event => setForm({ ...form, dueDate: event.target.value })} /></label>
          <label>Paid date optional<input type="date" value={form.paidDate} onChange={event => setForm({ ...form, paidDate: event.target.value })} /></label>
          <label>Person/vendor optional<input value={form.vendor} onChange={event => setForm({ ...form, vendor: event.target.value })} placeholder="e.g. landlord, guard name, petrol pump" /></label>
          <label>Note optional<textarea rows="3" value={form.note} onChange={event => setForm({ ...form, note: event.target.value })} placeholder="Receipt, month, meter, or other detail" /></label>
          {message && <p className="notes-admin-message" role="status">{message}</p>}
          <div className="notes-admin-actions"><button className="notes-admin-primary" type="submit">{editing ? <Pencil size={16} /> : <ReceiptText size={17} />}{editing ? 'Save expense' : 'Add expense'}</button>{editing && <button className="notes-admin-secondary" type="button" onClick={reset}><X size={16} />Cancel</button>}</div>
        </form>
      </section>

      <section className="notes-admin-panel notes-admin-library fee-register-panel"><div className="notes-admin-list-heading fee-register-heading"><div><p className="course-eyebrow">MONTHLY EXPENSES</p><h2>{monthLabel(selectedMonth)}</h2></div><label>Month<input type="month" value={selectedMonth} onChange={event => setSelectedMonth(event.target.value || currentMonth)} /></label></div>
        <div className="fee-filters expense-filters"><label>Category<select value={selectedCategory} onChange={event => setSelectedCategory(event.target.value)}><option value="all">All categories</option>{expenseCategories.map(category => <option value={category} key={category}>{category}</option>)}</select></label><label><Search size={15} />Search<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Expense, person or note" /></label></div>
        {visibleExpenses.length ? <div className="fee-table-wrap"><table className="fee-table expense-table"><thead><tr><th>Expense</th><th>Category</th><th>Amount</th><th>Status</th><th>Due</th><th>Paid</th><th></th></tr></thead><tbody>{visibleExpenses.map(expense => {
          const late = isLate(expense);
          return <tr className={late ? 'is-late' : ''} key={expense.id}><td><strong>{expense.title}</strong>{expense.vendor && <small>{expense.vendor}</small>}{expense.note && <small>{expense.note}</small>}</td><td>{expense.category}</td><td>Rs {Number(expense.amount || 0).toLocaleString('en-PK')}</td><td><select value={expense.status || 'unpaid'} onChange={event => updateExpense(expense, { status: event.target.value, paidDate: event.target.value === 'paid' && !expense.paidDate ? new Date().toISOString().slice(0, 10) : expense.paidDate })}><option value="unpaid">Unpaid</option><option value="partial">Partial</option><option value="paid">Paid</option></select>{late && <span className="fee-late-pill">Late</span>}</td><td><input type="date" value={expense.dueDate || ''} onChange={event => updateExpense(expense, { dueDate: event.target.value })} /></td><td><input type="date" value={expense.paidDate || ''} onChange={event => updateExpense(expense, { paidDate: event.target.value })} /></td><td><div className="notes-admin-note-actions"><button type="button" title="Mark paid" aria-label={`Mark ${expense.title} paid`} onClick={() => markPaid(expense)}><CheckCircle2 size={16} /></button><button type="button" title="Edit expense" aria-label={`Edit ${expense.title}`} onClick={() => startEdit(expense)}><Pencil size={16} /></button><button type="button" title="Delete expense" aria-label={`Delete ${expense.title}`} onClick={() => removeExpense(expense)}><Trash2 size={16} /></button></div></td></tr>;
        })}</tbody></table></div> : <div className="notes-admin-empty"><ReceiptText size={21} /><p>No expenses match this month, category or search. Add an expense to start tracking costs.</p></div>}
      </section>
    </div>
    <section className="notes-admin-tools"><div><h2>Expense backups</h2><p>Export the expense register as a manual JSON file, or restore a previous backup.</p></div><div className="notes-admin-tool-buttons"><button type="button" onClick={() => saveJson(`icon-academy-expenses-${selectedMonth}.json`, expenses)}><Download size={16} />Export backup</button><button type="button" onClick={() => importRef.current?.click()}><RotateCcw size={16} />Restore backup</button><input ref={importRef} type="file" accept="application/json,.json" hidden onChange={importBackup} /></div></section>
  </div></main></AdminShell>;
}
