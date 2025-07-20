import React, { useEffect, useMemo, useState } from 'react';
import { Users, Crown, Mail, Phone, MapPin, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import Card from '../components/Card';
import useDepartmentStore  from '../contexts/departmentStore';
import { useAuthStore } from '../contexts/AuthContext';
import DepartmentSkeleton from '../skeleton/DepartmentSkeleton';
import { toast, ToastContainer } from 'react-toastify';

// interface Member {
//   id: string;
//   name: string;
//   role: string;
//   email: string;
//   phone?: string;
//   joinDate: string;
//   avatar: string;
//   isLead: boolean;
// }

// interface Department {
//   id: string;
//   name: string;
//   description: string;
//   lead: Member;
//   members: Member[];
//   color: string;
//   icon: string;
// }

const Departments = () => {
const {user} = useAuthStore();
 const {
    departments,
    userDepartments,
    loading,
    fetchDepartments,
    fetchUserDepartments,
    joinDepartment,
    leaveDepartment
  } = useDepartmentStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchDepartments();
    if (user?._id) {
      fetchUserDepartments(user._id);
    }
  }, [user]);

  const isUserInDepartment = (departmentId) => {
    return Array.isArray(userDepartments) &&
      userDepartments.some(dept => String(dept._id) === String(departmentId));
  };

  const handleJoin = async (deptId) => {
    setActionLoading(prev => ({ ...prev, [deptId]: true }));
    try {
      await joinDepartment(deptId, user._id);
      toast.success('Successfully joined department!');
      await Promise.all([
        fetchDepartments(),
        fetchUserDepartments(user._id)
      ]);
    } catch (err) {
      toast.error(err.message || 'Failed to join department');
    } finally {
      setActionLoading(prev => ({ ...prev, [deptId]: false }));
    }
  };

  const handleLeave = async (deptId) => {
    setActionLoading(prev => ({ ...prev, [deptId]: true }));
    try {
      await leaveDepartment(deptId, user._id);
      toast.success('You left the department!');
      await Promise.all([
        fetchDepartments(),
        fetchUserDepartments(user._id)
      ]);
    } catch (err) {
      toast.error(err.message || 'Failed to leave department');
    } finally {
      setActionLoading(prev => ({ ...prev, [deptId]: false }));
    }
  };





  const departmentOptions = useMemo(() => [
    { value: 'all', label: 'All Departments' },
    ...departments.map(dept => ({ value: dept._id, label: dept.name }))
  ], [departments]);

  const filteredDepartments = useMemo(() => {
    return departments.filter(department => {
      // Filter by selected department
      const matchesDepartment = selectedDepartment === 'all' || department._id === selectedDepartment;
      
      // If no search term, just return departments matching the filter
      if (!searchTerm.trim()) return matchesDepartment;
      
      const searchTermLower = searchTerm.toLowerCase();
      
      // Check department properties
      const departmentMatches = 
        (department.name?.toLowerCase().includes(searchTermLower)) ||
        (department.description?.toLowerCase().includes(searchTermLower));
      
      // Check department leads
      const leadMatches = department.leads?.some(lead => 
        (lead.firstName?.toLowerCase().includes(searchTermLower)) ||
        (lead.lastName?.toLowerCase().includes(searchTermLower)) ||
        (lead.position?.toLowerCase().includes(searchTermLower))
      );
      
      // Check department members
      const memberMatches = department.members?.some(member => 
        (member.firstName?.toLowerCase().includes(searchTermLower)) ||
        (member.lastName?.toLowerCase().includes(searchTermLower)) ||
        (member.position?.toLowerCase().includes(searchTermLower))
      );
      
      return matchesDepartment && (departmentMatches || leadMatches || memberMatches);
    });
  }, [departments, selectedDepartment, searchTerm]);



  const toggleDepartmentExpansion = (departmentId) => {
    setExpandedDepartments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(departmentId)) {
        newSet.delete(departmentId);
      } else {
        newSet.add(departmentId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getTotalMembers = (department) => {
    return department.members.length  + (department.leads.length ? 1 : 0);
  };

  const getTotalLeads = (department) => {
    return department.leads.length;
  };


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Chapel Departments</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore our ministry departments and connect with team members
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search departments or members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            {departmentOptions.map(option => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500 text-white mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {departments.length}
                {/* {console.log(departments, "kdnfdgndgndn")} */}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Departments</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500 text-white mr-4">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {departments.reduce((total, dept) => total + getTotalLeads(dept), 0)}
                {/* {console.log(departments.reduce((total, dept)))} */}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Department Leads</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500 text-white mr-4">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {departments.reduce((total, dept) => total + getTotalMembers(dept), 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Departments List */}

      <div className="space-y-6">
        {loading ? ( 
          <DepartmentSkeleton /> ) :
        filteredDepartments.length === 0 ? (
          <Card key={'1'} className="p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No departments found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || selectedDepartment !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No departments to display.'
              }
            </p>
          </Card>
        ) : (
          filteredDepartments.map(department => (
            <Card key={department._id} className="overflow-hidden">
              <div className="p-6">
                {/* Department Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    {/* {console.log(department, "FFRRRRRRRRRRR")} */}

                    {user && (
                      isUserInDepartment(department._id) ? (
                        <button
                          onClick={() => handleLeave(department._id)}
                          className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg"
                          disabled={loading} // Add loading state if needed
                        >
                          {loading ? 'Leaving...' : 'Leave'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleJoin(department._id)}
                          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                          disabled={loading} // Add loading state if needed
                        >
                          {loading ? 'Joining...' : 'Join'}
                        </button>
                      )
                    )}

                    <div className={`w-12 h-12 ${department.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {department.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {department.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {department.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {getTotalMembers(department)}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Members
                      </div>
                    </div>
                    <button
                      onClick={() => toggleDepartmentExpansion(department._id)}
                      className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      {/* {console.log(department)} */}
                      {/* {console.log(department._id)} */}
                      {expandedDepartments.has(department._id) ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Department Lead */}
                {department.leads.length === 0 ? (
                     <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                        No department lead assigned
                      </p>
                ) : (

                
                <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-l-yellow-500">
                  <div className="flex items-center space-x-4">
                     {department.leads.map((lead, index) => (
                      <React.Fragment key={index || lead._id}>
                        <div className="relative" key={ index || lead._id}>
                          {lead.profileImg === '' ? ( 
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                          
                          </div>
                          ) : (
                              <img 
                                  src={`${import.meta.env.VITE_BACKEND_IMAGE_URL || ''}/${lead.profileImg.replace(/^\/+/, '')}`}
                                    alt="Profile" 
                                    className="w-10 object-cover"
                                  />
                          )}
                          <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                            <Crown className="h-3 w-3 text-yellow-800" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {lead.firstName} {lead.lastName}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {lead.position} • Department Lead
                          </p>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{lead.email}</span>
                            </div>
                            {lead.phoneNumber && (
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3" />
                                <span>{lead.phoneNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                          Joined {formatDate(lead.createdAt)}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                )}

                {/* Department Members (Expandable) */}
                {expandedDepartments.has(department._id) && (
                  <div className="space-y-3">

                    {/* {console.log(department.members)} */}
                    {/* {console.log(department, "BRRREEEAAAAKKKKK")} */}
                    <h4 className="font-medium text-gray-900 dark:text-white">Team Members</h4>
                    {department.members.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-sm italic">
                        No additional team members
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {department.members.map((member, index) => (
                          <div
                            key={index}
                            className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600"
                          >
                                  {/* {console.log(member)} */}

                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {member.profileImg ? (
                                  <img 
                                  src={`${import.meta.env.VITE_BACKEND_IMAGE_URL || ''}/${member.profileImg.replace(/^\/+/, '')}`}
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-2xl font-bold text-gray-600 dark:text-gray-300">
                                    {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                                  </span>
                                )}
                              </div>

                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900 dark:text-white">
                                  {member.firstName} {member.lastName}
                                </h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {member.position} {member.isLead ? '(Lead)' : ''}
                                </p>
                                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <Mail className="h-3 w-3" />
                                    <span>{member.email}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(member.createdAt)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Departments;