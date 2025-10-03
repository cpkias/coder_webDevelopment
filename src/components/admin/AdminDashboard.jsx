/**
 * AdminDashboard Component
 * Main admin dashboard with statistics and quick actions
 */

import { useState, useEffect } from 'react';
import { getDashboardStats } from '@/services/adminService';
import LoadingSpinner from '@components/common/LoadingSpinner';
import { Users, Calendar, UserCheck, Clock, TrendingUp, Bell } from 'lucide-react';
import { clsx } from 'clsx';

const StatCard = ({ title, value, icon: Icon, color = 'primary', trend }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    secondary: 'bg-secondary-100 text-secondary-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-amber-100 text-amber-600',
    danger: 'bg-red-100 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={clsx('p-3 rounded-lg', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className="flex items-center text-green-600 text-sm font-medium">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your platform's performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Total Events"
          value={stats?.totalEvents || 0}
          icon={Calendar}
          color="secondary"
        />
        <StatCard
          title="Upcoming Events"
          value={stats?.upcomingEvents || 0}
          icon={Clock}
          color="success"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals || 0}
          icon={Bell}
          color="warning"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Students</span>
              <span className="font-semibold text-gray-900">{stats?.totalStudents || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Organizers</span>
              <span className="font-semibold text-gray-900">{stats?.totalOrganizers || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Registrations</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold text-gray-900">{stats?.totalRegistrations || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Per Event Avg</span>
              <span className="font-semibold text-gray-900">
                {stats?.totalEvents > 0
                  ? Math.round((stats?.totalRegistrations || 0) / stats.totalEvents)
                  : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a
              href="/admin/users"
              className="block text-primary-600 hover:text-primary-700 font-medium"
            >
              Manage Users →
            </a>
            <a
              href="/admin/events"
              className="block text-primary-600 hover:text-primary-700 font-medium"
            >
              Manage Events →
            </a>
            <a
              href="/admin/approvals"
              className="block text-primary-600 hover:text-primary-700 font-medium"
            >
              Pending Approvals →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
