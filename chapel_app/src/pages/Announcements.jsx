import React, { useEffect, useState } from 'react';
import { Megaphone, Calendar, User, Pin, Search, Filter, X, Image as ImageIcon, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../components/Card';
import { useAnnouncementStore } from '../contexts/useAnnouncementStore';
import { AnnouncementSkeleton } from '../skeleton/AnnouncementSkeleton';

const Announcements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [expandedAnnouncements, setExpandedAnnouncements] = useState({});
  
  const {
    announcements,
    pinnedAnnouncements,
    regularAnnouncements,
    loading,
    error,
    fetchAnnouncements,
    filterAnnouncements
  } = useAnnouncementStore();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'event', label: 'Events' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'community', label: 'Community' }
  ];

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  useEffect(() => {
    filterAnnouncements(searchTerm, selectedCategory);
  }, [searchTerm, selectedCategory, filterAnnouncements]);

  const toggleExpand = (id) => {
    setExpandedAnnouncements(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'event': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'community': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (error) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="alert alert-error">{error}</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Announcements</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay informed about chapel events, updates, and community news
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pinned Announcements - Only show if there are pinned announcements */}
      {(pinnedAnnouncements.length > 0 || loading) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Pin className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Pinned Announcements
          </h2>
          <div className="space-y-6">
            {loading ? (
              [1, 2].map((i) => (
                <AnnouncementSkeleton key={`pinned-skeleton-${i}`} isPinned />
              ))
            ) : (
              pinnedAnnouncements.map((announcement) => (
                <Card 
                  key={`announcement-${announcement._id}`} 
                  className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => setSelectedAnnouncement(announcement)}
                >

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Pin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {announcement.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(announcement.category)}`}>
                          {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                        </span>
                        <Eye className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    {announcement.image && (
                      <div className="mb-4">
                        <img
                          src={announcement.image.startsWith('http') ? 
                               announcement.image : 
                               `${import.meta.env.VITE_BACKEND_API_URL || ''}/${announcement.image.replace(/^\/+/, '')}`}
                          alt={announcement.title}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {expandedAnnouncements[announcement._id] 
                        ? announcement.content 
                        : `${announcement.content.substring(0, 150)}...`}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{announcement.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(announcement.date)}</span>
                        </div>
                        {announcement.image && (
                          <div className="flex items-center space-x-1">
                            <ImageIcon className="h-4 w-4" />
                            <span>Image attached</span>
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // <- ADD THIS
                          toggleExpand(announcement._id);
                        }}
                        className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center"
                      >
                        {expandedAnnouncements[announcement._id] ? (
                          <>
                            Show less <ChevronUp className="ml-1 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Read more <ChevronDown className="ml-1 h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Regular Announcements */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Megaphone className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
          Recent Announcements
        </h2>
        <div className="space-y-6">
          {loading ? (
            [1, 2, 3].map((i) => (
              <AnnouncementSkeleton key={`regular-skeleton-${i}`} />
            ))
          ) : regularAnnouncements.length > 0 ? (
            regularAnnouncements.map((announcement) => (
              <Card 
                key={announcement.id} 
                hover 
                className="cursor-pointer"
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {announcement.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(announcement.category)}`}>
                        {announcement.category.charAt(0).toUpperCase() + announcement.category.slice(1)}
                      </span>
                      <Eye className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  {announcement.image && (
                    <div className="mb-4">
                      <img
                        src={announcement.image.startsWith('http') ? 
                             announcement.image : 
                              // `${import.meta.env.VITE_BACKEND_API_URL || ''}/${announcement.image.replace(/^\/+/, '')}`}
                              `${import.meta.env.VITE_BACKEND_IMAGE_URL}${announcement.profileImg}`}

                        alt={announcement.title}
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                    {expandedAnnouncements[announcement._id] 
                      ? (announcement.content && announcement.fullContent)
                      : `${announcement.content.substring(0, 150)}...`}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{announcement.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(announcement.date)}</span>
                      </div>
                      {announcement.image && (
                        <div className="flex items-center space-x-1">
                          <ImageIcon className="h-4 w-4" />
                          <span>Image attached</span>
                        </div>
                      )}
                    </div>
                    <button 
                         onClick={(e) => {
                          e.stopPropagation(); 
                          toggleExpand(announcement._id);
                        }}
                      className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center"
                    >
                      {expandedAnnouncements[announcement._id] ? (
                        <>
                          Show less <ChevronUp className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Read more <ChevronDown className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            !loading && (
              <Card className="p-12 text-center">
                <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No announcements found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Check back later for new announcements.'
                  }
                </p>
              </Card>
            )
          )}
        </div>
      </div>

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  {selectedAnnouncement.pinned && (
                    <Pin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  )}
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedAnnouncement.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedAnnouncement.category)}`}>
                  {selectedAnnouncement.category.charAt(0).toUpperCase() + selectedAnnouncement.category.slice(1)}
                </span>
                <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{selectedAnnouncement.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(selectedAnnouncement.date)}</span>
                  </div>
                </div>
              </div>

              {selectedAnnouncement.image && (
                <div className="mb-6">
                  <img
                    src={selectedAnnouncement.image.startsWith('http') ? 
                         selectedAnnouncement.image : 
                        //  `${import.meta.env.VITE_BACKEND_IMAGE_URL || ''}/${selectedAnnouncement.image.replace(/^\/+/, '')}`}
                        `${import.meta.env.VITE_BACKEND_IMAGE_URL}${selectedAnnouncement.profileImg}`}

                    alt={selectedAnnouncement.title}
                    className="w-full h-64 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="prose prose-gray dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedAnnouncement.fullContent || selectedAnnouncement.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;