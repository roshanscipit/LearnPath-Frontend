import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, Building2, IndianRupee,
  MessageSquare, LogOut, Plus, Trash2, Edit, CheckCircle,
  Clock, AlertCircle, Shield, Loader2, X, ChevronDown, Menu
} from 'lucide-react';
import { adminApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

// ── Helpers ─────────────────────────────────────────────────────

const statCard = (label, value, icon, color) => (
  <div key={label} className="bg-white rounded-xl shadow-sm border p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const statusBadge = (status) => {
  const map = {
    OPEN:        'bg-red-100 text-red-700',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
    RESOLVED:    'bg-green-100 text-green-700',
    CONFIRMED:   'bg-green-100 text-green-700',
    CANCELLED:   'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

// ── Sidebar nav items ────────────────────────────────────────────

const NAV = [
  { id: 'dashboard',      label: 'Dashboard',      icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'users',          label: 'Users',           icon: <Users className="w-5 h-5" /> },
  { id: 'revenue',        label: 'Revenue',         icon: <IndianRupee className="w-5 h-5" /> },
  { id: 'courses',        label: 'Courses',         icon: <BookOpen className="w-5 h-5" /> },
  { id: 'mock-companies', label: 'Mock Companies',  icon: <Building2 className="w-5 h-5" /> },
  { id: 'complaints',     label: 'Complaints',      icon: <MessageSquare className="w-5 h-5" /> },
];

// ── Modal ────────────────────────────────────────────────────────

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

// ── Main Component ───────────────────────────────────────────────

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [section, setSection]         = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  // data
  const [stats, setStats]         = useState(null);
  const [users, setUsers]         = useState([]);
  const [bookings, setBookings]   = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [courses, setCourses]     = useState([]);
  const [mockCos, setMockCos]     = useState([]);

  // modals
  const [showCourseModal,    setShowCourseModal]    = useState(false);
  const [showMockCoModal,    setShowMockCoModal]    = useState(false);
  const [editingCourse,      setEditingCourse]      = useState(null);
  const [courseForm,         setCourseForm]         = useState({ title:'', description:'', category:'', price:0, active:true });
  const [mockCoForm,         setMockCoForm]         = useState({ name:'', category:'product', difficulty:'Medium', logoUrl:'' });
  const [saving,             setSaving]             = useState(false);

  // ── Guard: only admins ────────────────────────────────────────
  useEffect(() => {
    if (!user) { navigate('/admin/login'); return; }
    const isAdmin = user.id === 1 || (user.email && user.email.endsWith('@doliuw.admin'));
    if (!isAdmin) { navigate('/'); }
  }, [user, navigate]);

  // ── Fetch helpers ─────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [s, u, b, c, co, mc] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getBookings(),
        adminApi.getComplaints(),
        adminApi.getCourses(),
        adminApi.getMockCompanies(),
      ]);
      setStats(s); setUsers(u); setBookings(b);
      setComplaints(c); setCourses(co); setMockCos(mc);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Complaint status ──────────────────────────────────────────
  const changeComplaintStatus = async (id, status) => {
    try {
      const updated = await adminApi.updateComplaintStatus(id, status);
      setComplaints(prev => prev.map(c => c.id === id ? updated : c));
    } catch (e) { alert(e.message); }
  };

  // ── Course CRUD ───────────────────────────────────────────────
  const openAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({ title:'', description:'', category:'', price:0, active:true });
    setShowCourseModal(true);
  };
  const openEditCourse = (c) => {
    setEditingCourse(c);
    setCourseForm({ title:c.title, description:c.description, category:c.category, price:c.price, active:c.active });
    setShowCourseModal(true);
  };
  const saveCourse = async () => {
    setSaving(true);
    try {
      if (editingCourse) {
        const updated = await adminApi.updateCourse(editingCourse.id, courseForm);
        setCourses(prev => prev.map(c => c.id === editingCourse.id ? updated : c));
      } else {
        const created = await adminApi.createCourse(courseForm);
        setCourses(prev => [...prev, created]);
        if (stats) setStats(s => ({ ...s, totalCourses: s.totalCourses + 1 }));
      }
      setShowCourseModal(false);
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };
  const deleteCourse = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await adminApi.deleteCourse(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      if (stats) setStats(s => ({ ...s, totalCourses: s.totalCourses - 1 }));
    } catch (e) { alert(e.message); }
  };

  // ── Mock Company CRUD ─────────────────────────────────────────
  const saveMockCo = async () => {
    setSaving(true);
    try {
      const created = await adminApi.createMockCompany(mockCoForm);
      setMockCos(prev => [...prev, created]);
      if (stats) setStats(s => ({ ...s, totalMockCompanies: s.totalMockCompanies + 1 }));
      setShowMockCoModal(false);
      setMockCoForm({ name:'', category:'product', difficulty:'Medium', logoUrl:'' });
    } catch (e) { alert(e.message); }
    finally { setSaving(false); }
  };
  const deleteMockCo = async (id) => {
    if (!window.confirm('Delete this mock company?')) return;
    try {
      await adminApi.deleteMockCompany(id);
      setMockCos(prev => prev.filter(m => m.id !== id));
      if (stats) setStats(s => ({ ...s, totalMockCompanies: s.totalMockCompanies - 1 }));
    } catch (e) { alert(e.message); }
  };

  const handleLogout = async () => { await logout(); navigate('/admin/login'); };

  // ── Revenue helpers ───────────────────────────────────────────
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.price, 0);

  // ── Render ────────────────────────────────────────────────────
  const Sidebar = ({ mobile }) => (
    <aside className={`flex flex-col h-full bg-gray-900 text-white ${mobile ? 'w-full' : 'w-64'}`}>
      <div className="px-6 py-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-white" />
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <p className="text-gray-400 text-xs mt-1 truncate">{user?.email}</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => { setSection(n.id); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              section === n.id ? 'bg-white text-gray-900' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {n.icon} {n.label}
            {n.id === 'complaints' && stats?.openComplaints > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {stats.openComplaints}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-gray-600" />
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col flex-shrink-0 w-64">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-72 h-full">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {NAV.find(n => n.id === section)?.label || 'Admin'}
          </h2>
        </header>

        <div className="flex-1 overflow-auto p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
              <button onClick={load} className="ml-auto underline font-medium">Retry</button>
            </div>
          )}

          {/* ─── DASHBOARD ─────────────────────────────────────── */}
          {section === 'dashboard' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {statCard('Total Users',    stats.totalUsers,         <Users className="w-6 h-6 text-blue-600" />,    'bg-blue-50')}
                {statCard('Total Bookings', stats.totalBookings,      <BookOpen className="w-6 h-6 text-purple-600" />, 'bg-purple-50')}
                {statCard('Revenue (₹)',    `₹${stats.totalRevenue?.toLocaleString()}`, <IndianRupee className="w-6 h-6 text-green-600" />, 'bg-green-50')}
                {statCard('Open Complaints', stats.openComplaints,    <MessageSquare className="w-6 h-6 text-red-600" />,  'bg-red-50')}
                {statCard('Courses',        stats.totalCourses,       <BookOpen className="w-6 h-6 text-orange-600" />, 'bg-orange-50')}
                {statCard('Mock Companies', stats.totalMockCompanies, <Building2 className="w-6 h-6 text-gray-600" />,  'bg-gray-100')}
              </div>

              <div className="bg-white rounded-xl border shadow-sm p-6">
                <h3 className="font-semibold text-gray-800 mb-4">Recent Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-500 border-b">
                      <th className="pb-2 font-medium">User</th>
                      <th className="pb-2 font-medium">Service</th>
                      <th className="pb-2 font-medium">Amount</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.slice(0, 5).map(b => (
                        <tr key={b.id} className="py-2">
                          <td className="py-2 text-gray-800">{b.userName}</td>
                          <td className="py-2 text-gray-600">{b.serviceName}</td>
                          <td className="py-2 text-gray-800 font-medium">₹{b.price}</td>
                          <td className="py-2">{statusBadge(b.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bookings.length === 0 && <p className="text-gray-500 text-center py-4">No bookings yet</p>}
                </div>
              </div>
            </div>
          )}

          {/* ─── USERS ─────────────────────────────────────────── */}
          {section === 'users' && (
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">All Users ({users.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500 border-b bg-gray-50">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email / Mobile</th>
                    <th className="px-6 py-3 font-medium">Provider</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium">Joined</th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-900">{u.name}</td>
                        <td className="px-6 py-3 text-gray-600">{u.email || u.mobile}</td>
                        <td className="px-6 py-3"><span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{u.provider}</span></td>
                        <td className="px-6 py-3">{u.enabled
                          ? <span className="flex items-center gap-1 text-green-600 text-xs"><CheckCircle className="w-3 h-3"/>Active</span>
                          : <span className="text-gray-400 text-xs">Inactive</span>}
                        </td>
                        <td className="px-6 py-3 text-gray-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {users.length === 0 && <p className="text-gray-500 text-center py-8">No users yet</p>}
              </div>
            </div>
          )}

          {/* ─── REVENUE ───────────────────────────────────────── */}
          {section === 'revenue' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statCard('Total Revenue', `₹${totalRevenue.toLocaleString()}`, <IndianRupee className="w-6 h-6 text-green-600" />, 'bg-green-50')}
                {statCard('Confirmed Bookings', confirmedBookings.length, <CheckCircle className="w-6 h-6 text-blue-600" />, 'bg-blue-50')}
                {statCard('Avg Booking Value', confirmedBookings.length ? `₹${Math.round(totalRevenue / confirmedBookings.length)}` : '₹0', <IndianRupee className="w-6 h-6 text-purple-600" />, 'bg-purple-50')}
              </div>

              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b">
                  <h3 className="font-semibold text-gray-800">All Bookings ({bookings.length})</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr className="text-left text-gray-500 border-b bg-gray-50">
                      <th className="px-6 py-3 font-medium">User</th>
                      <th className="px-6 py-3 font-medium">Service</th>
                      <th className="px-6 py-3 font-medium">Date / Slot</th>
                      <th className="px-6 py-3 font-medium">Amount</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-100">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-gray-50">
                          <td className="px-6 py-3">
                            <p className="font-medium text-gray-900">{b.userName}</p>
                            <p className="text-gray-500 text-xs">{b.userEmail}</p>
                          </td>
                          <td className="px-6 py-3 text-gray-700">{b.serviceName}</td>
                          <td className="px-6 py-3 text-gray-600">{b.bookingDate} · {b.timeSlot}</td>
                          <td className="px-6 py-3 font-semibold text-gray-900">₹{b.price}</td>
                          <td className="px-6 py-3">{statusBadge(b.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bookings.length === 0 && <p className="text-gray-500 text-center py-8">No bookings yet</p>}
                </div>
              </div>
            </div>
          )}

          {/* ─── COURSES ───────────────────────────────────────── */}
          {section === 'courses' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Courses ({courses.length})</h3>
                <button
                  onClick={openAddCourse}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4" /> Add Course
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(c => (
                  <div key={c.id} className="bg-white rounded-xl border shadow-sm p-5">
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-sm font-bold text-gray-900">₹{c.price}</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-1">{c.title}</h4>
                    <p className="text-gray-500 text-sm mb-1 line-clamp-2">{c.description}</p>
                    <p className="text-xs text-gray-400 mb-4">{c.category}</p>
                    <div className="flex gap-2">
                      <button onClick={() => openEditCourse(c)} className="flex-1 flex items-center justify-center gap-1 border border-gray-300 rounded-lg py-1.5 text-xs font-medium hover:bg-gray-50">
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => deleteCourse(c.id)} className="flex-1 flex items-center justify-center gap-1 border border-red-200 text-red-600 rounded-lg py-1.5 text-xs font-medium hover:bg-red-50">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
                {courses.length === 0 && (
                  <div className="col-span-3 bg-white rounded-xl border shadow-sm p-12 text-center">
                    <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No courses yet. Add your first course!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── MOCK COMPANIES ────────────────────────────────── */}
          {section === 'mock-companies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Mock Companies ({mockCos.length})</h3>
                <button
                  onClick={() => setShowMockCoModal(true)}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                >
                  <Plus className="w-4 h-4" /> Add Company
                </button>
              </div>
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="text-left text-gray-500 border-b bg-gray-50">
                    <th className="px-6 py-3 font-medium">Company</th>
                    <th className="px-6 py-3 font-medium">Category</th>
                    <th className="px-6 py-3 font-medium">Difficulty</th>
                    <th className="px-6 py-3 font-medium">Added</th>
                    <th className="px-6 py-3 font-medium"></th>
                  </tr></thead>
                  <tbody className="divide-y divide-gray-100">
                    {mockCos.map(m => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="px-6 py-3 flex items-center gap-3">
                          {m.logoUrl && <img src={m.logoUrl} alt="" className="w-6 h-6 object-contain" />}
                          <span className="font-medium text-gray-900">{m.name}</span>
                        </td>
                        <td className="px-6 py-3 text-gray-600 capitalize">{m.category}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            m.difficulty === 'Hard' ? 'bg-red-100 text-red-700' :
                            m.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>{m.difficulty}</span>
                        </td>
                        <td className="px-6 py-3 text-gray-500">{m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—'}</td>
                        <td className="px-6 py-3">
                          <button onClick={() => deleteMockCo(m.id)} className="text-red-500 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {mockCos.length === 0 && <p className="text-gray-500 text-center py-8">No mock companies yet</p>}
              </div>
            </div>
          )}

          {/* ─── COMPLAINTS ────────────────────────────────────── */}
          {section === 'complaints' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">User Complaints / Help Requests ({complaints.length})</h3>
              {complaints.length === 0 && (
                <div className="bg-white rounded-xl border shadow-sm p-12 text-center">
                  <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No complaints yet — all clear!</p>
                </div>
              )}
              <div className="space-y-3">
                {complaints.map(c => (
                  <div key={c.id} className="bg-white rounded-xl border shadow-sm p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{c.subject}</p>
                        <p className="text-sm text-gray-500">{c.userName} · {c.userEmail}</p>
                      </div>
                      {statusBadge(c.status)}
                    </div>
                    <p className="text-gray-700 text-sm mb-4 bg-gray-50 rounded-lg p-3">{c.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {c.createdAt ? new Date(c.createdAt).toLocaleString() : '—'}
                      </span>
                      <div className="flex gap-2">
                        {c.status !== 'IN_PROGRESS' && (
                          <button
                            onClick={() => changeComplaintStatus(c.id, 'IN_PROGRESS')}
                            className="text-xs px-3 py-1.5 border border-yellow-300 text-yellow-700 rounded-lg hover:bg-yellow-50"
                          >
                            In Progress
                          </button>
                        )}
                        {c.status !== 'RESOLVED' && (
                          <button
                            onClick={() => changeComplaintStatus(c.id, 'RESOLVED')}
                            className="text-xs px-3 py-1.5 border border-green-300 text-green-700 rounded-lg hover:bg-green-50"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ─── Course Modal ──────────────────────────────────────── */}
      {showCourseModal && (
        <Modal title={editingCourse ? 'Edit Course' : 'Add New Course'} onClose={() => setShowCourseModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                value={courseForm.title}
                onChange={e => setCourseForm(f => ({ ...f, title: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Java Full Stack Course"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                value={courseForm.description}
                onChange={e => setCourseForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Course description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  value={courseForm.category}
                  onChange={e => setCourseForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="e.g. Java, DevOps"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                <input
                  type="number"
                  value={courseForm.price}
                  onChange={e => setCourseForm(f => ({ ...f, price: parseInt(e.target.value) || 0 }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  min={0}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={courseForm.active}
                onChange={e => setCourseForm(f => ({ ...f, active: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="active" className="text-sm text-gray-700">Active (visible to users)</label>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowCourseModal(false)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveCourse}
                disabled={saving || !courseForm.title || !courseForm.category}
                className="flex-1 bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingCourse ? 'Save Changes' : 'Add Course'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ─── Mock Company Modal ────────────────────────────────── */}
      {showMockCoModal && (
        <Modal title="Add Mock Company" onClose={() => setShowMockCoModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
              <input
                value={mockCoForm.name}
                onChange={e => setMockCoForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g. Flipkart"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  value={mockCoForm.category}
                  onChange={e => setMockCoForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="product">Product</option>
                  <option value="service">Service</option>
                  <option value="startup">Startup</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty *</label>
                <select
                  value={mockCoForm.difficulty}
                  onChange={e => setMockCoForm(f => ({ ...f, difficulty: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL (optional)</label>
              <input
                value={mockCoForm.logoUrl}
                onChange={e => setMockCoForm(f => ({ ...f, logoUrl: e.target.value }))}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="https://example.com/favicon.ico"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowMockCoModal(false)}
                className="flex-1 border border-gray-300 rounded-lg py-2 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveMockCo}
                disabled={saving || !mockCoForm.name}
                className="flex-1 bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Add Company
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
