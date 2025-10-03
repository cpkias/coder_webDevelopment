import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/services/firebase';
import { useEffect, useState } from 'react';

export default function AdminAnnouncements() {
  const [items, setItems] = useState<any[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const q = query(collection(firestore, 'announcements'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))));
    return () => unsub();
  }, []);

  const add = async () => {
    if (!text.trim()) return;
    await addDoc(collection(firestore, 'announcements'), { text, createdAt: serverTimestamp() });
    setText('');
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} className="border rounded p-2 flex-1" placeholder="Announcement" />
        <button onClick={add} className="px-3 py-2 bg-brand text-white rounded">Post</button>
      </div>
      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.id} className="border rounded p-3 bg-white">{i.text}</li>
        ))}
      </ul>
    </div>
  );
}
