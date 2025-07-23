import React, { useEffect, useState } from 'react';
import { Users, Heart, Calendar, Trophy, Bell, TrendingUp, Gift, Cake, Send, X } from 'lucide-react';
import Card from '../components/Card';
// import CalendarCard from '../components/Calendar';
import Carousel from '../components/Carousel';
import { useAuthStore, useUserContext } from '../contexts/AuthContext';
import HomeSkeleton from '../skeleton/HomeSkeleton';
import { Link, useNavigate } from 'react-router-dom';
import { Bounce, toast, ToastContainer } from 'react-toastify';
import { usePrayerStore } from '../contexts/prayerStore';
import { useUserStore } from '../contexts/birthdayContext';
import { useCalendarStore } from '../contexts/calendarContext';
import HomeCalendar from '../components/HomeCalendar';
// import { useAuth } from '../contexts/AuthContext.jsx';

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://wsu-chapel.onrender.com/'

const Home = () => {
  const { user, login: loginToAuthStore } = useAuthStore();
  const { getUser } = useUserContext();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
   const { events: calendarEvents, fetchEvents } = useCalendarStore();
  const navigate = useNavigate();
  const { sendPrayerRequest } = usePrayerStore();
  const { birthdays = [], error, fetchBirthdays } = useUserStore();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    prayerRequest: '',
    category: 'other',
    anonymous: false,
  });




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

  useEffect(() => {
  const controller = new AbortController();

  const loadData = async () => {
    try {
      setLoading(true);
      
      // First verify authentication
      try {
        const userData = await getUser();
        if (!userData?._id) {
          navigate('/login');
          return;
        }
        loginToAuthStore(userData, localStorage.getItem('token'));
      } catch (err) {
        navigate('/login');
        return;
      }

      // Then load other data
      await Promise.all([
        fetchStats(controller.signal),
        fetchBirthdays(),
        fetchEvents()
      ]);
        // fetchStats(controller.signal),
        // fetchBirthdays(),
        // fetchEvents()

    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error loading home data:', error);
        if (error.message.includes('401')) {
          navigate('/login');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  loadData();

  return () => controller.abort();
}, []);

  // useEffect(() => {
  //   const loadStats = async () => {
  //     try {
  //       setLoading(true);
  //       const res = await fetch(`${API_URL}api/dashboard/stats`, {
  //         credentials: 'include',
  //       });
  //       const data = await res.json();
  //       if (data.success) {
  //         const statData = [
  //           { label: 'Active Members', value: data.data.activeMembers, icon: Users, color: 'bg-blue-500' },
  //           { label: 'Prayer Requests', value: data.data.prayerRequests, icon: Heart, color: 'bg-red-500' },
  //           { label: 'Upcoming Events', value: data.data.upcomingEvents, icon: Calendar, color: 'bg-green-500' },
  //           { label: "This Week's Votes", value: data.data.weeklyVotes, icon: Trophy, color: 'bg-yellow-500' },
  //         ];
  //         setStats(statData);
  //       } else {
  //         console.error('Failed to load stats');
  //       }
  //     } catch (error) {
  //       console.error('Error fetching stats:', error);
  //     }
  //   };

    // const fetchCalendarEvents = async () => {
    //   try {
    //     const response = await fetch('http://localhost:5000/api/calendar/chapel-events', {
    //       credentials: 'include',
    //     });
    //     const data = await response.json();
    //     if (data.success) {
    //       const formattedEvents = data.data.map(event => ({
    //         id: event._id,
    //         title: event.title,
    //         date: event.date,
    //         time: event.time || 'All Day',
    //         location: event.location || '',
    //         type: event.type || 'event'
    //       }));
    //       setCalendarEvents(formattedEvents);
    //     }
    //   } catch (error) {
    //     console.error('Error fetching calendar events:', error);
    //   }
    // };

  //   const loadData = async () => {
  //     try {
  //       setLoading(true);
  //       await Promise.all([
  //         loadStats(),
  //         // fetchCalendarEvents(),
  //         fetchEvents(), 
  //         fetchBirthdays()
  //       ]);
  //     } catch (error) {
  //       console.error('Error loading data:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadData();
  // }, [fetchBirthdays]);

  const fetchStats = async (signal) => {
  const response = await fetch(`${API_URL}api/dashboard/stats`, {
    credentials: 'include',
    signal,
  });
  const data = await response.json();
  if (data.success) {
    const statData = [
      { label: 'Active Members', value: data.data.activeMembers, icon: Users, color: 'bg-blue-500' },
      { label: 'Prayer Requests', value: data.data.prayerRequests, icon: Heart, color: 'bg-red-500' },
      { label: 'Upcoming Events', value: data.data.upcomingEvents, icon: Calendar, color: 'bg-green-500' },
      { label: "This Week's Votes", value: data.data.weeklyVotes, icon: Trophy, color: 'bg-yellow-500' },
    ];
    setStats(statData);
  } else {
    console.error('Failed to load stats');
  }
};



  const categories = [
  { value: 'healing',   label: 'Healing'},
  { value: 'guidance',  label: 'Guidance' },
  { value: 'gratitude', label: 'Gratitude' },
  { value: 'family',    label: 'Family' },
  { value: 'other',     label: 'Other'},
];


  const recentActivities = [
    { id: 1, type: 'prayer', message: 'New prayer request from Sarah M.', time: '2 hours ago' },
    { id: 2, type: 'announcement', message: 'Sunday service time changed', time: '4 hours ago' },
    { id: 3, type: 'vote', message: 'Weekly worker voting has started', time: '6 hours ago' },
    { id: 4, type: 'notification', message: 'Youth group meeting reminder', time: '1 day ago' },
  ];


  const carouselImages = [
    {
      id: '1',
      url: 'https://images.pexels.com/photos/8468/guitar-music-musician-musical-instrument.jpg?auto=compress&cs=tinysrgb&w=800',
      title: 'Sunday Worship Service',
      description: 'Join us every Sunday for inspiring worship, meaningful fellowship, and spiritual growth in our beautiful chapel.',
      category: 'Worship'
    },
    {
      id: '2',
      url: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Youth Ministry Activities',
      description: 'Our vibrant youth ministry engages young people through fun activities, Bible study, and community service projects.',
      category: 'Youth'
    },
    {
      id: '3',
      url: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      title: 'Community Outreach',
      description: 'Making a difference in our community through food drives, volunteer work, and supporting those in need.',
      category: 'Outreach'
    },
    {
      id: '4',
      url: 'https://images.pexels.com/photos/8923/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=800',
      title: 'Bible Study Groups',
      description: 'Deepen your faith through our weekly Bible study sessions with fellow believers in small group settings.',
      category: 'Education'
    },
    {
      id: '5',
      url: 'https://images.pexels.com/photos/8815/person-human-joy-happy.jpg?auto=compress&cs=tinysrgb&w=800',
      title: 'Fellowship Events',
      description: 'Building lasting friendships and strengthening our community bonds through regular fellowship gatherings.',
      category: 'Fellowship'
    }
  ];


  const formatBirthdayDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilBirthday = (dateString) => {
  const today = new Date();
  const birthDate = new Date(dateString);

  // Set birthday to this year
  let nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());

  // If birthday this year has passed, set to next year
  if (nextBirthday < today) {
    nextBirthday.setFullYear(today.getFullYear() + 1);
  }

  // Calculate difference in days
  const diffTime = nextBirthday - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};


  if (loading){
    return <HomeSkeleton/>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <ToastContainer/>

      {/* prayer request popup */}
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


            {/* end of prayer request popup */}

      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
              <p className="text-blue-100 text-lg">
                Ready to serve and connect with our chapel community today?
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="text-2xl font-bold">{new Date().getDate()}</div>
                <div className="text-sm opacity-90">
                  {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapel Activities Carousel */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Chapel Activities</h2>
        <Carousel images={carouselImages} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* {console.log(stats)} */}
        {stats.map((stat, index) => (
          <Card key={index} hover className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color} text-white mr-4`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activities</h2>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
                    <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Calendar Widget */}
          <HomeCalendar events={calendarEvents} compact />
          {/* {console.log(calendarEvents)} */}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <button onClick={() => setShowForm(true)} className="w-full text-left p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/50 dark:hover:to-purple-900/50 transition-all duration-200 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3">
                  <Heart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Submit Prayer Request</span>
                </div>
              </button>
              
              <button className="w-full text-left p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50 transition-all duration-200 border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3">
                  <Link to="/votes" className="flex items-center space-x-3">
                  <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium text-gray-900 dark:text-white">Cast Your Vote</span>
                  </Link>
                </div>
              </button>
              
              <button className="w-full text-left p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 hover:from-yellow-100 hover:to-orange-100 dark:hover:from-yellow-900/50 dark:hover:to-orange-900/50 transition-all duration-200 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-3">
                  <Link to="/calendar" className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <span className="font-medium text-gray-900 dark:text-white">View Schedule</span>
                  </Link>
                </div>
              </button>
            </div>
          </Card>

          {/* Upcoming Birthdays */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Gift className="h-5 w-5 mr-2 text-pink-600 dark:text-pink-400" />
                Upcoming Birthdays
              </h2>
            </div>
            <div className="space-y-4">
              {birthdays.map((birthday) => (
                <div key={birthday._id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      birthday.isToday 
                        ? 'bg-gradient-to-br from-pink-500 to-purple-600' 
                        : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                       <img 
                                  // src={`${import.meta.env.VITE_BACKEND_IMAGE_URL || ''}/${birthday.profileImg.replace(/^\/+/, '')}`}
                                  src={`${import.meta.env.VITE_BACKEND_IMAGE_URL}${birthday.profileImg}`}

                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                  />
                    </div>
                    {birthday.isToday && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                        <Cake className="h-3 w-3 text-yellow-800" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {birthday.firstName} {birthday.lastName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {birthday.department}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-medium ${
                      birthday.isToday 
                        ? 'text-pink-600 dark:text-pink-400' 
                        : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {formatBirthdayDate(birthday.dateOfBirth)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {getDaysUntilBirthday(birthday.dateOfBirth)} days
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;