"use client";

import { useState, useEffect, useMemo } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type ContactStatus = "Registered" | "Workshop" | "Trial" | "Converted" | "Dropped";

interface Student {
  id: number;
  name: string;
  klass: string;
  school: string;
  phone: string;
  status: ContactStatus;
  questionsAsked: number;
  sessions: number;
  dateAdded: string;          // ISO string
  retention: [boolean, boolean, boolean, boolean]; // U1, U2, U3, Week
  notes: string;
}

const STORAGE_KEY = "bos_founder_students";
const STATUS_ORDER: ContactStatus[] = ["Registered", "Workshop", "Trial", "Converted", "Dropped"];
const CLASS_OPTIONS = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "College / Other"];

const STATUS_STYLE: Record<ContactStatus, { bg: string; text: string; dot: string }> = {
  Registered: { bg: "bg-slate-800",         text: "text-slate-400",  dot: "bg-slate-500"  },
  Workshop:   { bg: "bg-amber-950/40",       text: "text-amber-400",  dot: "bg-amber-400"  },
  Trial:      { bg: "bg-blue-950/40",        text: "text-blue-400",   dot: "bg-blue-400"   },
  Converted:  { bg: "bg-emerald-950/40",     text: "text-emerald-400",dot: "bg-emerald-400"},
  Dropped:    { bg: "bg-rose-950/30",        text: "text-rose-400",   dot: "bg-rose-500"   },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function FounderPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<ContactStatus | "All">("All");
  const [filterSchool, setFilterSchool] = useState("All");
  const [addOpen, setAddOpen] = useState(false);

  // form state
  const [fName,    setFName]    = useState("");
  const [fKlass,   setFKlass]   = useState("");
  const [fSchool,  setFSchool]  = useState("");
  const [fPhone,   setFPhone]   = useState("");
  const [fStatus,  setFStatus]  = useState<ContactStatus>("Registered");
  const [fNotes,   setFNotes]   = useState("");
  const [formErr,  setFormErr]  = useState("");

  // ── Persistence ────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setStudents(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  function persist(list: Student[]) {
    setStudents(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total      = students.length;
    const workshop   = students.filter(s => s.status === "Workshop"  || s.status === "Trial" || s.status === "Converted").length;
    const trial      = students.filter(s => s.status === "Trial"     || s.status === "Converted").length;
    const converted  = students.filter(s => s.status === "Converted").length;
    const dropped    = students.filter(s => s.status === "Dropped").length;
    const schools    = new Set(students.map(s => s.school).filter(Boolean)).size;
    const convRate   = trial ? Math.round((converted / trial) * 100) : 0;
    const avgQ       = total ? Math.round(students.reduce((a, s) => a + s.questionsAsked, 0) / total) : 0;
    const retWeek    = total ? Math.round((students.filter(s => s.retention[3]).length / total) * 100) : 0;
    return { total, workshop, trial, converted, dropped, schools, convRate, avgQ, retWeek };
  }, [students]);

  // school breakdown
  const schoolBreakdown = useMemo(() => {
    const map: Record<string, { total: number; converted: number }> = {};
    students.forEach(s => {
      const sc = s.school || "Unknown";
      if (!map[sc]) map[sc] = { total: 0, converted: 0 };
      map[sc].total++;
      if (s.status === "Converted") map[sc].converted++;
    });
    return Object.entries(map).sort((a, b) => b[1].total - a[1].total);
  }, [students]);

  // all unique schools for filter
  const allSchools = useMemo(() => ["All", ...Array.from(new Set(students.map(s => s.school).filter(Boolean)))], [students]);

  // filtered list
  const filtered = useMemo(() => {
    return students.filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.school.toLowerCase().includes(q) || s.phone.includes(q);
      const matchStatus = filterStatus === "All" || s.status === filterStatus;
      const matchSchool = filterSchool === "All" || s.school === filterSchool;
      return matchSearch && matchStatus && matchSchool;
    }).sort((a, b) => b.id - a.id);
  }, [students, search, filterStatus, filterSchool]);

  // ── Actions ────────────────────────────────────────────────────────────────
  function addStudent() {
    if (!fName.trim()) { setFormErr("Name required"); return; }
    if (!fKlass)       { setFormErr("Class required"); return; }
    if (!fSchool.trim()){ setFormErr("School required"); return; }
    if (!fPhone.trim() || fPhone.length < 10) { setFormErr("Valid 10-digit phone required"); return; }
    setFormErr("");
    const s: Student = {
      id: Date.now(),
      name: fName.trim(), klass: fKlass, school: fSchool.trim(), phone: fPhone.trim(),
      status: fStatus, questionsAsked: 0, sessions: 0,
      dateAdded: new Date().toISOString(),
      retention: [false, false, false, false],
      notes: fNotes.trim(),
    };
    persist([...students, s]);
    setFName(""); setFKlass(""); setFSchool(""); setFPhone(""); setFStatus("Registered"); setFNotes("");
    setAddOpen(false);
  }

  function updateStatus(id: number, status: ContactStatus) {
    persist(students.map(s => s.id === id ? { ...s, status } : s));
  }

  function updateField(id: number, field: keyof Student, val: string | number) {
    persist(students.map(s => s.id === id ? { ...s, [field]: val } : s));
  }

  function toggleRetention(id: number, idx: number) {
    persist(students.map(s => {
      if (s.id !== id) return s;
      const ret = [...s.retention] as [boolean, boolean, boolean, boolean];
      ret[idx] = !ret[idx];
      return { ...s, retention: ret };
    }));
  }

  function deleteStudent(id: number) {
    if (!confirm("Delete this student?")) return;
    persist(students.filter(s => s.id !== id));
  }

  function exportCSV() {
    const header = "Name,Class,School,Phone,Status,Questions,Sessions,Date,U1,U2,U3,Week,Notes";
    const rows = students.map(s =>
      `"${s.name}","${s.klass}","${s.school}","${s.phone}","${s.status}",${s.questionsAsked},${s.sessions},"${formatDate(s.dateAdded)}",${s.retention.map(r => r ? 1 : 0).join(",")},"${s.notes}"`
    );
    const csv = [header, ...rows].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = `bharatos_students_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6 max-w-7xl mx-auto space-y-6">

      {/* ── HEADER ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] mb-1">🔐 Founder Command Center</div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide">BharatOS Academy</h1>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">First 100 Students Validation Dashboard</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={exportCSV} className="px-4 py-2 rounded-xl text-xs font-black border border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600 hover:text-white transition-all">⬇ Export CSV</button>
          <button onClick={() => setAddOpen(true)} className="px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-[#ff8008] to-[#ffc837] text-slate-950 hover:opacity-90 transition-opacity">➕ Add Student</button>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {[
          { label: "Total",      val: students.length, max: 100, color: "text-white",        sub: "/ 100 target" },
          { label: "Schools",    val: stats.schools,   max: null, color: "text-cyan-400",    sub: "unique" },
          { label: "Workshop",   val: stats.workshop,  max: null, color: "text-amber-400",   sub: "attended" },
          { label: "Trial",      val: stats.trial,     max: null, color: "text-blue-400",    sub: "started" },
          { label: "Converted",  val: stats.converted, max: null, color: "text-emerald-400", sub: "paid" },
          { label: "Dropped",    val: stats.dropped,   max: null, color: "text-rose-400",    sub: "churned" },
          { label: "Conv. Rate", val: `${stats.convRate}%`, max: null, color: "text-purple-400", sub: "trial→paid" },
          { label: "7-Day Ret.", val: `${stats.retWeek}%`,  max: null, color: "text-orange-400", sub: "return rate" },
        ].map(c => (
          <div key={c.label} className="rounded-2xl bg-slate-900/60 border border-slate-800 p-4 text-center">
            <div className={`text-2xl font-black ${c.color}`}>{c.val}</div>
            {c.max && (
              <div className="h-1 rounded-full bg-slate-800 mt-1.5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style={{ width: `${Math.min(100, (Number(c.val) / c.max) * 100)}%` }} />
              </div>
            )}
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-wider mt-1">{c.label}</div>
            <div className="text-[9px] text-slate-600 font-semibold">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* ── SCHOOL BREAKDOWN ── */}
      {schoolBreakdown.length > 0 && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5">
          <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4">🏫 School-wise Breakdown</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {schoolBreakdown.map(([school, data]) => (
              <div key={school} className="flex items-center justify-between gap-3 bg-slate-800/50 rounded-xl px-4 py-3">
                <div>
                  <div className="text-sm font-black text-white">{school}</div>
                  <div className="text-[10px] text-slate-500 font-semibold">{data.converted} converted / {data.total} total</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-white">{data.total}</div>
                  <div className="text-[9px] text-emerald-400 font-black">{data.total ? Math.round((data.converted / data.total) * 100) : 0}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── FILTERS ── */}
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="🔍 Search name, school, phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-600 transition-all"
        />
        <div className="flex gap-1.5 flex-wrap">
          {(["All", ...STATUS_ORDER] as (ContactStatus | "All")[]).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black border transition-all ${
                filterStatus === s
                  ? "bg-cyan-950/50 border-cyan-700 text-cyan-300"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {allSchools.length > 2 && (
          <select
            value={filterSchool}
            onChange={e => setFilterSchool(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none"
          >
            {allSchools.map(s => <option key={s}>{s}</option>)}
          </select>
        )}
        <span className="text-xs text-slate-600 font-semibold">{filtered.length} results</span>
      </div>

      {/* ── STUDENT TABLE ── */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-600 font-semibold text-sm">
            {students.length === 0
              ? "कोई Student नहीं। ➕ Add Student बटन दबाएँ।"
              : "No results match your filters."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60">
                  {["#", "Student", "Class", "Phone", "Status", "Q.Asked", "Sessions", "Retention", "Added", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, idx) => {
                  const st = STATUS_STYLE[s.status];
                  return (
                    <tr key={s.id} className="border-b border-slate-800/60 hover:bg-slate-800/20 transition-colors">
                      {/* # */}
                      <td className="px-4 py-3 text-slate-600 text-xs font-bold">{students.findIndex(x => x.id === s.id) + 1}</td>

                      {/* Name / School */}
                      <td className="px-4 py-3">
                        <div className="font-black text-white text-sm">{s.name}</div>
                        <div className="text-[10px] text-slate-500 font-semibold">{s.school}</div>
                        {s.notes && <div className="text-[9px] text-slate-600 mt-0.5 italic">{s.notes.slice(0, 40)}</div>}
                      </td>

                      {/* Class */}
                      <td className="px-4 py-3 text-xs text-slate-400 font-semibold whitespace-nowrap">{s.klass}</td>

                      {/* Phone */}
                      <td className="px-4 py-3">
                        <a href={`https://wa.me/91${s.phone}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs font-black text-emerald-400 hover:text-emerald-300 transition-colors">
                          📱 {s.phone}
                        </a>
                      </td>

                      {/* Status Dropdown */}
                      <td className="px-4 py-3">
                        <select
                          value={s.status}
                          onChange={e => updateStatus(s.id, e.target.value as ContactStatus)}
                          className={`text-[10px] font-black px-2 py-1.5 rounded-lg border-0 cursor-pointer ${st.bg} ${st.text}`}
                          style={{ outline: "none" }}
                        >
                          {STATUS_ORDER.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </td>

                      {/* Questions */}
                      <td className="px-4 py-3">
                        <input
                          type="number" min={0} value={s.questionsAsked}
                          onChange={e => updateField(s.id, "questionsAsked", parseInt(e.target.value) || 0)}
                          className="w-14 bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-1 text-xs font-black text-white text-center focus:outline-none focus:border-cyan-600"
                        />
                      </td>

                      {/* Sessions */}
                      <td className="px-4 py-3">
                        <input
                          type="number" min={0} value={s.sessions}
                          onChange={e => updateField(s.id, "sessions", parseInt(e.target.value) || 0)}
                          className="w-14 bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-1 text-xs font-black text-white text-center focus:outline-none focus:border-cyan-600"
                        />
                      </td>

                      {/* Retention dots */}
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 items-center">
                          {(["U1", "U2", "U3", "W"] as const).map((label, ri) => (
                            <button
                              key={label}
                              title={["1st Use", "2nd Use", "3rd Use", "Weekly Return"][ri]}
                              onClick={() => toggleRetention(s.id, ri)}
                              className={`w-7 h-7 rounded-lg text-[9px] font-black border transition-all ${
                                s.retention[ri]
                                  ? "bg-emerald-900/60 border-emerald-600 text-emerald-300"
                                  : "bg-slate-800 border-slate-700 text-slate-600 hover:border-slate-600"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-[10px] text-slate-600 font-semibold whitespace-nowrap">{formatDate(s.dateAdded)}</td>

                      {/* Delete */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteStudent(s.id)}
                          className="text-slate-700 hover:text-rose-400 transition-colors text-sm px-2 py-1 rounded-lg hover:bg-rose-950/30"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── ADD STUDENT MODAL ── */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center px-4" onClick={() => setAddOpen(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Manual Entry</div>
                <h2 className="text-lg font-black text-white mt-0.5">Add New Student</h2>
              </div>
              <button onClick={() => setAddOpen(false)} className="text-slate-500 hover:text-white text-xl transition-colors">✕</button>
            </div>

            {formErr && <div className="text-xs text-rose-400 font-bold bg-rose-950/20 border border-rose-900/40 rounded-xl px-4 py-2">⚠️ {formErr}</div>}

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Student Name *</label>
                <input type="text" value={fName} onChange={e => { setFName(e.target.value); setFormErr(""); }}
                  placeholder="जैसे: Rahul Kumar"
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-sm font-semibold placeholder-slate-600 focus:outline-none focus:border-cyan-600 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Class *</label>
                <select value={fKlass} onChange={e => { setFKlass(e.target.value); setFormErr(""); }}
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-600">
                  <option value="">Select...</option>
                  {CLASS_OPTIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Status</label>
                <select value={fStatus} onChange={e => setFStatus(e.target.value as ContactStatus)}
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-600">
                  {STATUS_ORDER.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">School Name *</label>
                <input type="text" value={fSchool} onChange={e => { setFSchool(e.target.value); setFormErr(""); }}
                  placeholder="जैसे: Saraswati Vidya Mandir"
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-sm font-semibold placeholder-slate-600 focus:outline-none focus:border-cyan-600 transition-all" />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Parent Mobile *</label>
                <input type="tel" value={fPhone} onChange={e => { setFPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setFormErr(""); }}
                  placeholder="10-digit number"
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-sm font-semibold placeholder-slate-600 focus:outline-none focus:border-cyan-600 transition-all tracking-widest" />
              </div>
              <div className="col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5 block">Notes (optional)</label>
                <input type="text" value={fNotes} onChange={e => setFNotes(e.target.value)}
                  placeholder="Source, remarks, etc."
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-white text-sm font-semibold placeholder-slate-600 focus:outline-none focus:border-cyan-600 transition-all" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setAddOpen(false)}
                className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-black hover:border-slate-600 transition-all">
                Cancel
              </button>
              <button onClick={addStudent}
                className="flex-1 py-3 rounded-xl font-black text-sm text-slate-950 bg-gradient-to-r from-[#ff8008] to-[#ffc837] hover:opacity-90 transition-opacity">
                Add Student →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-[10px] text-slate-700 font-semibold pb-4">
        BharatOS Academy · Founder Use Only · Data stored in browser localStorage
      </div>
    </div>
  );
}
