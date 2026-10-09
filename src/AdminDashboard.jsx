import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Banknote, BookOpen, CalendarDays, Clock3, FileText, Plus, ReceiptText, Sparkles, UsersRound, WalletCards } from 'lucide-react';
import AdminShell from './AdminShell';
import { readNotes, subscribeNotes } from './notesStore';
import { readEvents, subscribeEvents } from './eventsStore';
import { readFeeStudents, subscribeFeeStudents } from './feesStore';
import { readTeachers, subscribeTeachers } from './teachersStore';
import { readExpenses, subscribeExpenses } from './expensesStore';

const currentMonth = new Date().toISOString().slice(0, 7);

function monthLabel(month) {
  const [year, monthNumber] = month.split('-').map(Number);
  return new Date(year, monthNumber - 1).toLocaleDateString('en-PK', { month: 'long', year: 'numeric' });
}

function monthFromDate(date) {
  return date ? date.slice(0, 7) : '';
}

function money(value) {
  return `Rs ${Number(value || 0).toLocaleString('en-PK')}`;
}

export default function AdminDashboard({ onLogout }) {
  const [notes, setNotes] = useState(readNotes);
  const [events, setEvents] = useState(readEvents);
  const [feeStudents, setFeeStudents] = useState(readFeeStudents);
  const [teachers, setTeachers] = useState(readTeachers);
  const [expenses, setExpenses] = useState(readExpenses);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  useEffect(() => {
    const subscriptions = [subscribeNotes(setNotes), subscribeEvents(setEvents), subscribeFeeStudents(setFeeStudents), subscribeTeachers(setTeachers), subscribeExpenses(setExpenses)];
    return () => subscriptions.forEach(unsubscribe => unsubscribe());
  }, []);
  const finance = useMemo(() => {
    const fees = feeStudents.reduce((total, student) => {
      const fee = Number(student.monthlyFee || 0);
      const payment = student.payments?.[selectedMonth] || {};
      const entered = Math.max(0, Number(payment.amountPaid || 0));
      const collected = payment.status === 'paid' ? fee : Math.min(entered, fee);
      total.expected += fee;
      total.collected += collected;
      return total;
    }, { expected: 0, collected: 0 });

    const salaries = teachers.reduce((total, teacher) => {
      const salary = Number(teacher.monthlySalary || 0);
      const payment = teacher.salaries?.[selectedMonth] || {};
      const entered = Math.max(0, Number(payment.amountPaid || 0));
      const paid = payment.status === 'paid' ? salary : Math.min(entered, salary);
      total.total += salary;
      total.paid += paid;
      return total;
    }, { total: 0, paid: 0 });

    const monthlyExpenses = expenses.filter(expense => monthFromDate(expense.dueDate || expense.paidDate) === selectedMonth);
    const expenseTotal = monthlyExpenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);
    const expensePaid = monthlyExpenses.reduce((total, expense) => total + (expense.status === 'paid' ? Number(expense.amount || 0) : 0), 0);

    return {
      ...fees,
      remaining: Math.max(0, fees.expected - fees.collected),
      salaryTotal: salaries.total,
      salaryPaid: salaries.paid,
      salaryRemaining: Math.max(0, salaries.total - salaries.paid),
      expenseTotal,
      expensePaid,
    };
  }, [expenses, feeStudents, selectedMonth, teachers]);
  const recentEvents = events.slice(0, 3);
  const recentNotes = notes.slice(-3).reverse();
  return <AdminShell active="overview" title="Overview" onLogout={onLogout}><main className="admin-dashboard">
    <section className="admin-dashboard-welcome"><div><p className="course-eyebrow"><Sparkles size={14} /> ADMINISTRATION / OVERVIEW</p><h1>Welcome back.<br /><em>What needs attention?</em></h1><p>Manage academy events, study resources, student fees, salaries and expenses from one place.</p></div><label className="admin-dashboard-month"><CalendarDays size={17} /><span>FINANCIAL MONTH</span><input type="month" value={selectedMonth} onChange={event => setSelectedMonth(event.target.value || currentMonth)} /></label></section>
    <section className="admin-finance-section" aria-labelledby="finance-overview-title">
      <div className="admin-finance-heading"><div><p className="course-eyebrow">FINANCIAL OVERVIEW</p><h2 id="finance-overview-title">{monthLabel(selectedMonth)}</h2></div><span>Live totals from fees, salaries and expenses</span></div>
      <div className="admin-finance-grid">
        <a href="/admin/fees" className="is-expected"><span><Banknote size={19} /></span><small>EXPECTED FEES</small><strong>{money(finance.expected)}</strong><em>{feeStudents.length} students</em></a>
        <a href="/admin/fees" className="is-collected"><span><WalletCards size={19} /></span><small>FEES COLLECTED</small><strong>{money(finance.collected)}</strong><em>Received this month</em></a>
        <a href="/admin/fees" className={finance.remaining ? 'is-remaining has-balance' : 'is-remaining'}><span><Clock3 size={19} /></span><small>FEES REMAINING</small><strong>{money(finance.remaining)}</strong><em>{finance.remaining ? 'Still to collect' : 'All fees collected'}</em></a>
        <a href="/admin/teachers" className="is-salary"><span><UsersRound size={19} /></span><small>TEACHER SALARIES</small><strong>{money(finance.salaryTotal)}</strong><em>{money(finance.salaryPaid)} paid | {money(finance.salaryRemaining)} remaining</em></a>
        <a href="/admin/expenses" className="is-expense"><span><ReceiptText size={19} /></span><small>TOTAL EXPENSES</small><strong>{money(finance.expenseTotal)}</strong><em>{money(finance.expensePaid)} paid</em></a>
      </div>
    </section>
    <section className="admin-dashboard-stats" aria-label="Admin overview"><article><span className="admin-stat-icon event"><CalendarDays size={18} /></span><div><small>ACADEMY EVENTS</small><strong>{events.length}</strong><span>{events.length === 1 ? 'event in your library' : 'events in your library'}</span></div><a href="/admin/events" aria-label="Manage events"><ArrowRight size={17} /></a></article><article><span className="admin-stat-icon note"><BookOpen size={18} /></span><div><small>STUDY RESOURCES</small><strong>{notes.length}</strong><span>{notes.length === 1 ? 'note in your library' : 'notes in your library'}</span></div><a href="/admin/notes" aria-label="Manage notes"><ArrowRight size={17} /></a></article><article><span className="admin-stat-icon fees"><WalletCards size={18} /></span><div><small>FEE STUDENTS</small><strong>{feeStudents.length}</strong><span>{feeStudents.length === 1 ? 'student in fee register' : 'students in fee register'}</span></div><a href="/admin/fees" aria-label="Manage fees"><ArrowRight size={17} /></a></article><article><span className="admin-stat-icon teachers"><UsersRound size={18} /></span><div><small>TEACHERS</small><strong>{teachers.length}</strong><span>{teachers.length === 1 ? 'teacher in salary register' : 'teachers in salary register'}</span></div><a href="/admin/teachers" aria-label="Manage teachers"><ArrowRight size={17} /></a></article><article><span className="admin-stat-icon expenses"><ReceiptText size={18} /></span><div><small>EXPENSES</small><strong>{expenses.length}</strong><span>{expenses.length === 1 ? 'expense in register' : 'expenses in register'}</span></div><a href="/admin/expenses" aria-label="Manage expenses"><ArrowRight size={17} /></a></article></section>
    <section className="admin-dashboard-main"><div className="admin-dashboard-section-head"><div><p className="course-eyebrow">QUICK ACTIONS</p><h2>Make an update.</h2></div><span>Choose a manager to add or update records.</span></div><div className="admin-quick-grid"><a href="/admin/events" className="admin-quick-card"><span className="admin-quick-icon event"><CalendarDays size={22} /></span><span className="admin-quick-copy"><small>EVENTS LIBRARY</small><strong>Manage academy events</strong><span>Add celebrations, photos and video links.</span></span><span className="admin-quick-action"><Plus size={17} /></span></a><a href="/admin/notes" className="admin-quick-card"><span className="admin-quick-icon note"><BookOpen size={22} /></span><span className="admin-quick-copy"><small>STUDY LIBRARY</small><strong>Manage study notes</strong><span>Upload class-wise PDFs and guess papers.</span></span><span className="admin-quick-action"><Plus size={17} /></span></a><a href="/admin/fees" className="admin-quick-card"><span className="admin-quick-icon fees"><WalletCards size={22} /></span><span className="admin-quick-copy"><small>FEE REGISTER</small><strong>Manage student fees</strong><span>Add class-wise students and monthly fee status.</span></span><span className="admin-quick-action"><Plus size={17} /></span></a><a href="/admin/teachers" className="admin-quick-card"><span className="admin-quick-icon teachers"><UsersRound size={22} /></span><span className="admin-quick-copy"><small>SALARY REGISTER</small><strong>Manage teacher salaries</strong><span>Add teachers and monthly salary status.</span></span><span className="admin-quick-action"><Plus size={17} /></span></a><a href="/admin/expenses" className="admin-quick-card"><span className="admin-quick-icon expenses"><ReceiptText size={22} /></span><span className="admin-quick-copy"><small>EXPENSE REGISTER</small><strong>Manage academy expenses</strong><span>Track rent, salaries, petrol and misc costs.</span></span><span className="admin-quick-action"><Plus size={17} /></span></a></div>
      <div className="admin-dashboard-recent"><section className="admin-recent-panel"><div className="admin-recent-heading"><div><p className="course-eyebrow">LATEST</p><h3>Recent events</h3></div><a href="/admin/events">View all <ArrowRight size={14} /></a></div>{recentEvents.length ? recentEvents.map(item => <a className="admin-recent-row" href="/admin/events" key={item.id}><img src={item.image} alt="" /><span><strong>{item.title}</strong><small>{item.category || 'Academy event'}</small></span><ArrowRight size={15} /></a>) : <p className="admin-empty-hint">Events you add will show here.</p>}</section>
      <section className="admin-recent-panel"><div className="admin-recent-heading"><div><p className="course-eyebrow">LATEST</p><h3>Recent study notes</h3></div><a href="/admin/notes">View all <ArrowRight size={14} /></a></div>{recentNotes.length ? recentNotes.map(item => <a className="admin-recent-row admin-note-row" href="/admin/notes" key={item.id}><span className="admin-recent-note-icon"><FileText size={18} /></span><span><strong>{item.title}</strong><small>{item.subject} - Class {item.classId}</small></span><ArrowRight size={15} /></a>) : <p className="admin-empty-hint">Study resources you add will show here.</p>}</section></div>
    </section>
    <aside className="admin-dashboard-storage"><span><Sparkles size={16} /></span><p><strong>Firebase cloud database</strong><br />Updates synchronize across devices. Export tools remain available for an additional manual backup.</p></aside>
    </main></AdminShell>;
}
