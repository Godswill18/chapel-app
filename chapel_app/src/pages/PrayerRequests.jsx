import React, { useEffect, useState } from 'react';
import { Heart, Plus, Clock, User, X, Send } from 'lucide-react';
import Card from '../components/Card';
import { usePrayerStore } from '../contexts/prayerStore';
import { toast, Bounce, ToastContainer } from 'react-toastify';
import RequestSkeleton from '../skeleton/RequestSkeleton';
import { useAuthStore } from '../contexts/AuthContext';
// import { useAuthContext } from '../contexts/Auth.jsx';

const categories = [
  { value: 'healing',   label: 'Healing',   color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  { value: 'guidance',  label: 'Guidance',  color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { value: 'gratitude', label: 'Gratitude', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  { value: 'family',    label: 'Family',    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  { value: 'other',     label: 'Other',     color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300' },
];

export default function PrayerRequests() {
  const { user } = useAuthStore();
  const {
    prayerRequests,
    loading,
    error,
    fetchPrayerRequests,
    sendPrayerRequest,
    togglePrayForRequest,
  } = usePrayerStore();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    prayerRequest: '',
    category: 'other',
    anonymous: false,
  });

  useEffect(() => {
    fetchPrayerRequests();
  }, [fetchPrayerRequests]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, message } = await sendPrayerRequest(formData);
    if (success) {
      toast.success("Prayer request submitted successfully.", {
        position: 'top-center',
        transition: Bounce,
      });
      setFormData({ title: '', prayerRequest: '', category: 'other', anonymous: false });
      setShowForm(false);
    } else {
      toast.error(message, { position: 'top-center', transition: Bounce });
    }
  };

  const handlePray = async (prayerId) => {
    if (!user) {
      toast.info("Please login to pray for this request", {
        position: 'top-center',
        transition: Bounce,
      });
      return;
    }

    const { success, message } = await togglePrayForRequest(prayerId);
    if (!success) {
      toast.error(message, { position: 'top-center', transition: Bounce });
    }
  };

  const getCategoryInfo = (cat) => categories.find((c) => c.value === cat) || categories[4];
  const formatDate = (str) => new Date(str).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

    // console.log(prayerRequests);
  /* ---------- JSX ---------- */
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer/>
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Prayer Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your prayer requests and pray for others in our community
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          <span>Submit Request</span>
        </button>
      </div>

      {/* ---------- FORM MODAL ---------- */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Submit Prayer Request
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* TITLE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, title: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief title for your prayer request"
                  />
                </div>

                {/* CATEGORY */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, category: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PRAYERREQUEST */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prayer Request
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.prayerRequest}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, prayerRequest: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Share your prayer request with our community..."
                  />
                </div>

                {/* ANONYMOUS TOGGLE */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.anonymous}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, anonymous: e.target.checked }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="anonymous"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    Submit anonymously
                  </label>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Submit</span>
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {/* ---------- LIST ---------- */}
     <div className="space-y-6">
  {loading ? (
    [...Array(3)].map((_, i) => <RequestSkeleton key={i} />)
  ) : error ? (
    <Card className="p-12 text-center text-red-600">{error}</Card>
  ) : prayerRequests?.length === 0 ? (
    <Card className="p-12 text-center">
      <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        No prayer requests yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        Be the first to share a prayer request with our community.
      </p>
    </Card>
  ) : (
    prayerRequests
      .filter(req => req.isDisplay === true) // ✅ Only display those marked as true
      .map(req => (
        <Card key={req._id} hover>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {req.title}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryInfo(req.category).color}`}
              >
                {getCategoryInfo(req.category).label}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {req.prayerRequest}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>
                    {req.submittedBy ? 'Anonymous' : req.submittedBy || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(req.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={() => handlePray(req._id)}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors duration-200 ${
                  req.isPraying?.includes(user?._id)
                    ? 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200'
                    : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200'
                }`}
              >
                <Heart
                  className="h-4 w-4"
                  fill={req.isPraying?.includes(user?._id) ? 'currentColor' : 'none'}
                />
                <span>{req.isPraying?.length || 0}</span>
                <span>Praying</span>
              </button>
            </div>
          </div>
        </Card>
      ))
  )}
</div>

    </div>
  );
}
