import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';

export function useJournalStatus(): { todayCompleted: boolean; loading: boolean } {
  const { user } = useAuth();
  const [todayCompleted, setTodayCompleted] = useState(true); // default true = no badge
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const key = new Date(today.getTime() - offset * 60000).toISOString().split('T')[0];

    (async () => {
      try {
        const snap = await getDoc(doc(db, 'users', user.uid, 'journal', key));
        if (!snap.exists()) { setTodayCompleted(false); setLoading(false); return; }
        const data = snap.data() as any;
        const meals = data.meals || {};
        const stacks = data.stacks || {};
        const vCount = Object.values(meals).filter((m: any) => m?.validated).length;
        const stacksDone = Object.entries(stacks).filter(([k, v]) => v && k !== 'workout').length;
        const stacksTotal = Object.keys(stacks).filter(k => k !== 'workout').length || 1;
        const water = data.water || 0;
        const pct = Math.round(((vCount / 3) * 0.5 + (stacksDone / stacksTotal) * 0.25 + (stacks.workout ? 0.15 : 0) + (water >= 2500 ? 0.10 : (water / 2500) * 0.10)) * 100);
        setTodayCompleted(pct >= 70);
      } catch { setTodayCompleted(false); }
      setLoading(false);
    })();
  }, [user]);

  return { todayCompleted, loading };
}
