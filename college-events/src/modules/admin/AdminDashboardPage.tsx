import { useEffect, useState } from 'react';
import { collection, doc, getDocs, limit, orderBy, query, updateDoc } from 'firebase/firestore';
import { firestore } from '@/services/firebase';
import AdminAnnouncements from '@/modules/events/AdminAnnouncements';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const q = query(collection(firestore, 'users'), orderBy('createdAt', 'desc'), limit(50));
      const snap = await getDocs(q);
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchUsers();
  }, []);

  const approveOrganizer = async (id: string) => {
    await updateDoc(doc(firestore, 'users', id), { approvedOrganizer: true, role: 'organizer' });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <section className="mt-6">
        <h2 className="text-xl font-medium mb-2">Announcements</h2>
        <AdminAnnouncements />
      </section>
      <section className="mt-6">
        <h2 className="text-xl font-medium">Users</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Approved</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4">{u.role}</td>
                  <td className="py-2 pr-4">{String(u.approvedOrganizer)}</td>
                  <td className="py-2 pr-4">
                    {!u.approvedOrganizer && (
                      <button onClick={() => approveOrganizer(u.id)} className="px-3 py-1 rounded-md bg-brand text-white">Approve organizer</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
