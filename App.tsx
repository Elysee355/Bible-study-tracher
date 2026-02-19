
import React, { useState, useEffect } from 'react';
import { FamilyMember, Reflection, VerseOfTheDay, DayOfWeek } from './types';
import { DAYS_OF_WEEK, INITIAL_PROGRESS } from './constants';
import { fetchVerseOfTheDay } from './services/geminiService';
import TrackerTable from './components/TrackerTable';
import ReflectionFeed from './components/ReflectionFeed';
import VerseCard from './components/VerseCard';

const App: React.FC = () => {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [verse, setVerse] = useState<VerseOfTheDay | null>(null);
  const [loadingVerse, setLoadingVerse] = useState(true);
  const [newMemberName, setNewMemberName] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    const savedMembers = localStorage.getItem('lightFamily_members');
    const savedReflections = localStorage.getItem('lightFamily_reflections');
    
    if (savedMembers) {
      const parsed = JSON.parse(savedMembers);
      const migrated = parsed.map((m: any) => {
        const newProgress = { ...INITIAL_PROGRESS };
        DAYS_OF_WEEK.forEach(day => {
          if (m.progress && typeof m.progress[day] === 'boolean') {
            newProgress[day] = { completed: m.progress[day], note: '' };
          } else if (m.progress && m.progress[day]) {
            newProgress[day] = m.progress[day];
          }
        });
        return { ...m, progress: newProgress };
      });
      setMembers(migrated);
    }
    if (savedReflections) setReflections(JSON.parse(savedReflections));

    const loadVerse = async () => {
      const data = await fetchVerseOfTheDay();
      setVerse(data);
      setLoadingVerse(false);
    };
    loadVerse();
  }, []);

  useEffect(() => {
    localStorage.setItem('lightFamily_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('lightFamily_reflections', JSON.stringify(reflections));
  }, [reflections]);

  const addMember = () => {
    if (!newMemberName.trim()) return;
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      progress: JSON.parse(JSON.stringify(INITIAL_PROGRESS))
    };
    setMembers(prev => [...prev, newMember]);
    setNewMemberName('');
    setShowAddMember(false);
  };

  const toggleDay = (memberId: string, day: DayOfWeek) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          progress: {
            ...m.progress,
            [day]: { ...m.progress[day], completed: !m.progress[day].completed }
          }
        };
      }
      return m;
    }));
  };

  const updateNote = (memberId: string, day: DayOfWeek, note: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        return {
          ...m,
          progress: {
            ...m.progress,
            [day]: { ...m.progress[day], note }
          }
        };
      }
      return m;
    }));
  };

  const toggleAllDays = (memberId: string) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const allChecked = DAYS_OF_WEEK.every(day => m.progress[day].completed);
        const newProgress = { ...m.progress };
        DAYS_OF_WEEK.forEach(day => {
          newProgress[day] = { ...newProgress[day], completed: !allChecked };
        });
        return { ...m, progress: newProgress };
      }
      return m;
    }));
  };

  const resetWeek = () => {
    if (window.confirm("Are you sure you want to start a new week? All checkmarks and notes will be cleared.")) {
      setMembers(prev => prev.map(m => ({
        ...m,
        progress: JSON.parse(JSON.stringify(INITIAL_PROGRESS))
      })));
    }
  };

  const addReflection = (author: string, content: string) => {
    const newRef: Reflection = {
      id: Date.now().toString(),
      author,
      content,
      timestamp: Date.now()
    };
    setReflections(prev => [newRef, ...prev]);
  };

  const exportSummary = () => {
    const header = "--- Light Family Study Summary ---\n\n";
    const status = members.map(m => {
      const details = DAYS_OF_WEEK
        .filter(d => m.progress[d].completed)
        .map(d => `${d}${m.progress[d].note ? ` (${m.progress[d].note})` : ''}`)
        .join(", ");
      const allDays = DAYS_OF_WEEK.every(d => m.progress[d].completed) ? " (Complete! ✨)" : "";
      return `${m.name}: ${details || 'No days logged'} ${allDays}`;
    }).join("\n");
    navigator.clipboard.writeText(header + status);
    alert("Summary copied to clipboard!");
  };

  return (
    <div className="min-h-screen pb-20 px-4 md:px-8 max-w-6xl mx-auto">
      <header className="text-center py-12">
        <h1 className="text-6xl md:text-7xl font-cursive text-[#D4AF37] mb-2 drop-shadow-sm">
          Light Family
        </h1>
        <p className="text-xl md:text-2xl font-serif italic text-gray-600">
          "Walking in the Word together"
        </p>
      </header>

      <section className="mb-12">
        <VerseCard verse={verse} loading={loadingVerse} />
      </section>

      <main className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-yellow-100">
        <div className="bg-[#D4AF37] p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
            Study Tracker
          </h2>
          <div className="flex gap-2">
            <button onClick={() => setShowAddMember(true)} className="bg-white text-[#D4AF37] px-4 py-2 rounded-full font-bold hover:bg-yellow-50 shadow-sm transition-colors">+ Add Member</button>
            <button onClick={exportSummary} className="bg-yellow-100 text-[#D4AF37] px-4 py-2 rounded-full font-bold hover:bg-yellow-200 shadow-sm transition-colors">Export</button>
            <button onClick={resetWeek} className="bg-yellow-800 text-white px-4 py-2 rounded-full font-bold hover:bg-yellow-900 shadow-sm transition-colors">New Week</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <TrackerTable members={members} onToggle={toggleDay} onUpdateNote={updateNote} onToggleAll={toggleAllDays} />
        </div>
        {members.length === 0 && <div className="p-12 text-center text-gray-400">No family members added yet.</div>}
      </main>

      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Add New Member</h3>
            <input type="text" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} placeholder="Name" className="w-full border-2 border-yellow-200 rounded-lg p-2 mb-4 outline-none focus:border-[#D4AF37]" onKeyDown={(e) => e.key === 'Enter' && addMember()} autoFocus />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddMember(false)} className="px-4 py-2 text-gray-500 rounded">Cancel</button>
              <button onClick={addMember} className="px-4 py-2 bg-[#D4AF37] text-white rounded font-bold">Add</button>
            </div>
          </div>
        </div>
      )}

      <ReflectionFeed reflections={reflections} onAdd={addReflection} />
      <footer className="mt-20 text-center text-gray-400 text-sm pb-10"><p>© {new Date().getFullYear()} Light Family Bible Study Tracker</p></footer>
    </div>
  );
};

export default App;
