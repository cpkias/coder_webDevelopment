/**
 * AnnouncementForm Component
 * Send announcements to all users or specific roles
 */

import { useState } from 'react';
import { sendAnnouncement } from '@/services/adminService';
import { UserRoles } from '@/services/authService';
import toast from 'react-hot-toast';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { Bell } from 'lucide-react';

const AnnouncementForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    targetRole: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const result = await sendAnnouncement(
        formData.title,
        formData.message,
        formData.targetRole || null
      );

      toast.success(`Announcement sent to ${result.sentTo} users`);
      
      setFormData({
        title: '',
        message: '',
        targetRole: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center mb-6">
        <div className="p-3 bg-primary-100 rounded-lg mr-4">
          <Bell className="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Send Announcement</h2>
          <p className="text-gray-600">Notify users about important updates</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Announcement title"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your announcement message..."
            rows={6}
            required
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Audience
          </label>
          <select
            name="targetRole"
            value={formData.targetRole}
            onChange={handleChange}
            className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Users</option>
            <option value={UserRoles.STUDENT}>Students Only</option>
            <option value={UserRoles.ORGANIZER}>Organizers Only</option>
            <option value={UserRoles.ADMIN}>Admins Only</option>
          </select>
        </div>

        <Button type="submit" variant="primary" fullWidth loading={loading}>
          Send Announcement
        </Button>
      </form>
    </div>
  );
};

export default AnnouncementForm;
