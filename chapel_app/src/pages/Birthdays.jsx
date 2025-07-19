import React, { useState, useEffect } from 'react';
import { Gift, Calendar, Cake, Search, Filter, Heart, Users } from 'lucide-react';
import Card from '../components/Card';
import { useUserStore } from '../contexts/birthdayContext';
import BirthdaySkeleton from '../skeleton/BirthdaySkeleton';

const Birthdays = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  
  const { birthdays = [], loading, error, fetchBirthdays } = useUserStore();

  
  const filterPeriods = [
    { value: 'all', label: 'All Birthdays' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'upcoming', label: 'Upcoming' }
  ];

  useEffect(() => {
    fetchBirthdays();
  }, [fetchBirthdays]);

  // console.log(fetchBirthdays());

  // Safely filter birthdays with null checks
  const filteredBirthdays = birthdays.filter(birthday => {
    const firstName = birthday?.firstName || '';
    const lastName = birthday?.lastName || '';
    const department = birthday?.department || '';
    const position = birthday?.position || '';
    const searchTermLower = searchTerm.toLowerCase();
    
    const fullName = `${firstName} ${lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTermLower) ||
                         department.toLowerCase().includes(searchTermLower) ||
                         position.toLowerCase().includes(searchTermLower);
    
    let matchesPeriod = true;
    switch (filterPeriod) {
      case 'today':
        matchesPeriod = birthday?.isToday || false;
        break;
      case 'week':
        matchesPeriod = birthday?.isThisWeek || false;
        break;
      case 'month':
        matchesPeriod = birthday?.isThisMonth || false;
        break;
      case 'upcoming':
        matchesPeriod = birthday?.dateOfBirth ? new Date(birthday.dateOfBirth) > new Date() : false;
        break;
    }
    
    return matchesSearch && matchesPeriod;
  });

  // Safely filter special categories
  const todaysBirthdays = birthdays.filter(b => b?.isToday);
  const thisWeeksBirthdays = birthdays.filter(b => b?.isThisWeek && !b?.isToday);
  const upcomingBirthdays = birthdays.filter(b => b?.dateOfBirth && new Date(b.dateOfBirth) > new Date() && !b?.isThisWeek);

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getDaysUntilBirthday = (dateString) => {
    if (!dateString) return 'Date not specified';
    
    try {
      const today = new Date();
      const birthday = new Date(dateString);
      birthday.setFullYear(today.getFullYear());
      
      const diffTime = birthday.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Tomorrow';
      if (diffDays > 0) return `In ${diffDays} days`;
      return 'Past';
    } catch {
      return 'Invalid date';
    }
  };

  console.log(getDaysUntilBirthday())

  if (error) return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="alert alert-error">{error}</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Chapel Birthdays</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Celebrate and remember the special days of our chapel family members
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search birthdays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            {filterPeriods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <BirthdaySkeleton />
      ) : (
        <>
          {/* Today's Birthdays */}
          {todaysBirthdays.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Cake className="h-5 w-5 mr-2 text-pink-600 dark:text-pink-400" />
                Today's Birthdays
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {todaysBirthdays.map(birthday => (
                  <Card key={birthday._id} className="border-2 border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
                    <div className="p-6 text-center">
                      <div className="relative mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                          {birthday.initials}
                        </div>
                        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                          <Gift className="h-4 w-4 text-yellow-800" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {birthday.firstName} {birthday.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {birthday.position} • {birthday.department}
                      </p>
                      {/* {birthday.age && (
                        <p className="text-sm font-medium text-pink-600 dark:text-pink-400 mb-4">
                          Turning {birthday.age} today!
                        </p>
                      )} */}
                      <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 mx-auto">
                        <Heart className="h-4 w-4" />
                        <span>Send Wishes</span>
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* This Week's Birthdays */}
          {thisWeeksBirthdays.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                This Week's Birthdays
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {thisWeeksBirthdays.map(birthday => (
                  <Card key={birthday._id} hover className="border-l-4 border-l-blue-500">
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {birthday.initials}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {birthday.firstName} {birthday.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {birthday.department}
                          </p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                            {formatDate(birthday.dateOfBirth)} • {getDaysUntilBirthday(birthday.dateOfBirth)} 
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* All Birthdays */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
              {filterPeriod === 'all' ? 'All Birthdays' : `${filterPeriods.find(p => p.value === filterPeriod)?.label}`}
            </h2>
            {filteredBirthdays.length === 0 ? (
              <Card className="p-12 text-center">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No birthdays found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm || filterPeriod !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No birthdays to display.'
                  }
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBirthdays.map(birthday => (
                  <Card key={birthday._id} hover>
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {birthday.initials}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {birthday.firstName} {birthday.lastName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {birthday.position}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Department:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{birthday.department}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Birthday:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formatDate(birthday.dateOfBirth)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <span className={`font-medium ${
                            birthday.isToday ? 'text-pink-600 dark:text-pink-400' :
                            birthday.isThisWeek ? 'text-blue-600 dark:text-blue-400' :
                            'text-gray-600 dark:text-gray-400'
                          }`}>
                            {getDaysUntilBirthday(birthday.dateOfBirth)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Birthdays;