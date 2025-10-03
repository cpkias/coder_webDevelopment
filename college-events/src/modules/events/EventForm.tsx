import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addDoc, collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '@/services/firebase';
import { getAuth } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(1),
  campus: z.string().optional().default(''),
  venue: z.string().min(2),
  capacity: z.coerce.number().min(1),
  startAt: z.string(),
  endAt: z.string(),
  registrationDeadline: z.string(),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  images: z.any().optional(),
});

export type EventFormValues = z.infer<typeof schema>;

export function EventForm({ eventId, initialValues }: { eventId?: string; initialValues?: Partial<EventFormValues> }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EventFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues as any,
  });

  const onSubmit = handleSubmit(async (values) => {
    const uid = getAuth().currentUser?.uid;
    if (!uid) throw new Error('Not signed in');

    const images: FileList | undefined = (values as any).images;
    const imageUrls: string[] = [];
    if (images && images.length) {
      for (const file of Array.from(images)) {
        const key = `images/events/${eventId ?? 'new'}/${Date.now()}-${file.name}`;
        const r = ref(storage, key);
        await uploadBytes(r, file);
        const url = await getDownloadURL(r);
        imageUrls.push(url);
      }
    }

    const payload = {
      title: values.title,
      description: values.description,
      category: values.category,
      campus: values.campus ?? '',
      venue: values.venue,
      capacity: values.capacity,
      startAt: values.startAt,
      endAt: values.endAt,
      registrationDeadline: values.registrationDeadline,
      tags: values.tags ? values.tags.split(',').map(t => t.trim()) : [],
      status: values.status,
      images: imageUrls,
      organizerId: uid,
      attendeeCount: initialValues ? (initialValues as any).attendeeCount ?? 0 : 0,
      updatedAt: serverTimestamp(),
      createdAt: initialValues ? (initialValues as any).createdAt : serverTimestamp(),
    };

    if (eventId) {
      await updateDoc(doc(firestore, 'events', eventId), payload as any);
      alert('Event updated');
    } else {
      const refDoc = await addDoc(collection(firestore, 'events'), payload as any);
      await setDoc(doc(firestore, 'events', refDoc.id), { id: refDoc.id }, { merge: true });
      alert('Event created');
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">Title</label>
          <input className="mt-1 w-full rounded-md border p-2" {...register('title')} />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>
        <div>
          <label className="block text-sm">Category</label>
          <input className="mt-1 w-full rounded-md border p-2" {...register('category')} />
        </div>
      </div>
      <div>
        <label className="block text-sm">Description</label>
        <textarea className="mt-1 w-full rounded-md border p-2" rows={4} {...register('description')} />
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm">Campus</label>
          <input className="mt-1 w-full rounded-md border p-2" {...register('campus')} />
        </div>
        <div>
          <label className="block text-sm">Venue</label>
          <input className="mt-1 w-full rounded-md border p-2" {...register('venue')} />
        </div>
        <div>
          <label className="block text-sm">Capacity</label>
          <input type="number" className="mt-1 w-full rounded-md border p-2" {...register('capacity', { valueAsNumber: true })} />
        </div>
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm">Start</label>
          <input type="datetime-local" className="mt-1 w-full rounded-md border p-2" {...register('startAt')} />
        </div>
        <div>
          <label className="block text-sm">End</label>
          <input type="datetime-local" className="mt-1 w-full rounded-md border p-2" {...register('endAt')} />
        </div>
        <div>
          <label className="block text-sm">Registration deadline</label>
          <input type="datetime-local" className="mt-1 w-full rounded-md border p-2" {...register('registrationDeadline')} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm">Tags (comma separated)</label>
          <input className="mt-1 w-full rounded-md border p-2" {...register('tags')} />
        </div>
        <div>
          <label className="block text-sm">Status</label>
          <select className="mt-1 w-full rounded-md border p-2" {...register('status')}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm">Images</label>
        <input type="file" multiple className="mt-1 w-full rounded-md border p-2" {...register('images')} />
      </div>
      <div className="pt-2">
        <button disabled={isSubmitting} className="px-4 py-2 bg-brand text-white rounded-md">{eventId ? 'Update' : 'Create'} event</button>
      </div>
    </form>
  );
}
