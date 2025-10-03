import { collection, onSnapshot, orderBy, query, where, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '@/services/firebase';
import { useAuth } from '@/modules/auth/AuthContext';
import { useEffect, useState } from 'react';

export function NotificationsBell() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(firestore, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => setNotes(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, [user?.uid]);

  const markAllRead = async () => {
    await Promise.all(notes.filter(n => !n.read).map(n => updateDoc(doc(firestore, 'notifications', n.id), { read: true })));
  };

  if (!user) return null;
  return (
    <button onClick={markAllRead} className="relative px-3 py-2 rounded-md text-sm bg-gray-100">
      Notifications
      {notes.some(n => !n.read) && <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />}
    </button>
  );
}
