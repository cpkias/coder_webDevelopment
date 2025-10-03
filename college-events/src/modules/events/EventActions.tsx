import { deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '@/services/firebase';
import { Link } from 'react-router-dom';

export function EventActions({ id }: { id: string }) {
  const remove = async () => {
    if (!confirm('Delete this event?')) return;
    await deleteDoc(doc(firestore, 'events', id));
  };
  return (
    <div className="flex gap-2">
      <Link to={`/events/${id}/edit`} className="px-3 py-1 rounded bg-gray-100">Edit</Link>
      <button onClick={remove} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
    </div>
  );
}
