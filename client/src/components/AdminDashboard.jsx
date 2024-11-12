import React, { useState } from 'react';
import AllUsers from '../pages/AllUsers';

const AdminDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [selectedSection, setSelectedSection] = useState('notifications');
  
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', type: 'User' },
    { id: 2, name: 'Jane Smith', type: 'User' },
  ]);
  
  const [mechanics, setMechanics] = useState([
    { id: 1, name: 'Mike Johnson', type: 'Mechanic' },
    { id: 2, name: 'Sara Lee', type: 'Mechanic' },
  ]);
  
  const [servicesStatus, setServicesStatus] = useState([
    { id: 1, serviceName: 'Towing Service', status: 'Ongoing' },
    { id: 2, serviceName: 'Mechanical Service', status: 'Completed' },
  ]);
  
  const [reviews, setReviews] = useState([
    { id: 1, user: 'John Doe', review: 'Great service!' },
    { id: 2, user: 'Jane Smith', review: 'Fast response time.' },
  ]);
  
  const [complaints, setComplaints] = useState([
    { id: 1, user: 'John Doe', complaint: 'Service delayed.' },
    { id: 2, user: 'Jane Smith', complaint: 'Not satisfied with the mechanic.' },
  ]);
  
  const [payments, setPayments] = useState([
    { id: 1, user: 'John Doe', amount: 50, status: 'Completed' },
    { id: 2, user: 'Jane Smith', amount: 75, status: 'Pending' },
  ]);
  
  const [userRequests, setUserRequests] = useState([
    { id: 1, user: 'John Doe', service: 'Towing Service', status: 'Completed', date: '2024-10-01' },
    { id: 2, user: 'Jane Smith', service: 'Mechanical Service', status: 'Pending', date: '2024-10-05' },
  ]);

  const handleSendNotification = () => {
    if ((!selectedUser && !selectedMechanic) || !issueDescription) {
      alert('Please select a user/mechanic and provide an issue description.');
      return;
    }

    const target = selectedUser || selectedMechanic;
    setNotifications((prevState) => [
      ...prevState,
      `Notified ${target} about: ${issueDescription}`,
    ]);
    setIssueDescription('');
    setSelectedUser('');
    setSelectedMechanic('');
  };

  const handleServiceStatusUpdate = (id, newStatus) => {
    setServicesStatus((prevState) =>
      prevState.map((service) =>
        service.id === id ? { ...service, status: newStatus } : service
      )
    );
  };

  const handleRemoveUser = (id) => {
    setUsers((prevState) => prevState.filter((user) => user.id !== id));
    setMechanics((prevState) => prevState.filter((mechanic) => mechanic.id !== id));
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col justify-between">
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-6">Admin Dashboard</h2>
          <button
            className="w-full py-2 px-4 bg-blue-500 rounded"
            onClick={() => setSelectedSection('notifications')}
          >
            Notifications
          </button>
          <button
            className="w-full py-2 px-4 bg-red-500 rounded"
            onClick={() => setSelectedSection('reportIssue')}
          >
            Report an Issue
          </button>
          <button
            className="w-full py-2 px-4 bg-yellow-500 rounded"
            onClick={() => setSelectedSection('serviceStatus')}
          >
            Service Status
          </button>
          <button
            className="w-full py-2 px-4 bg-green-500 rounded"
            onClick={() => setSelectedSection('reviews')}
          >
            Reviews
          </button>
          <button
            className="w-full py-2 px-4 bg-purple-500 rounded"
            onClick={() => setSelectedSection('complaints')}
          >
            Complaints
          </button>
          <button
            className="w-full py-2 px-4 bg-teal-500 rounded"
            onClick={() => setSelectedSection('payments')}
          >
            Payments
          </button>
          <button
            className="w-full py-2 px-4 bg-gray-600 rounded"
            onClick={() => setSelectedSection('manageUsers')}
          >
            Manage Users/Mechanics
          </button>
          <button
            className="w-full py-2 px-4 bg-blue-700 rounded"
            onClick={() => setSelectedSection('userRequests')}
          >
            User Requests
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="w-3/4 p-6 overflow-y-auto">
        {selectedSection === 'notifications' && (
          <div>
            <h3 className="text-xl font-semibold">Notifications</h3>
            <ul>
              {notifications.map((notif, index) => (
                <li key={index} className="mt-2">{notif}</li>
              ))}
            </ul>
          </div>
        )}

        {selectedSection === 'reportIssue' && (
          <div>
            <h3 className="text-xl font-semibold">Report an Issue</h3>
            <div className="mt-4">
              <label className="block">Select User:</label>
              <select
                className="mt-2 p-2 border rounded"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.name}>
                    {user.name} ({user.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="block">Select Mechanic:</label>
              <select
                className="mt-2 p-2 border rounded"
                value={selectedMechanic}
                onChange={(e) => setSelectedMechanic(e.target.value)}
              >
                <option value="">Select Mechanic</option>
                {mechanics.map((mechanic) => (
                  <option key={mechanic.id} value={mechanic.name}>
                    {mechanic.name} ({mechanic.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="block">Issue Description:</label>
              <textarea
                className="mt-2 p-2 border rounded w-full"
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="Describe the issue"
              />
            </div>

            <div className="mt-4">
              <button
                onClick={handleSendNotification}
                className="bg-red-500 text-white py-2 px-6 rounded"
              >
                Send Notification
              </button>
            </div>
          </div>
        )}

        {selectedSection === 'serviceStatus' && (
          <div>
            <h3 className="text-xl font-semibold">Service Status</h3>
            <ul>
              {servicesStatus.map((service) => (
                <li key={service.id} className="p-2 border-b">
                  {service.serviceName} - Status: {service.status}
                  <button
                    className="ml-4 text-blue-500"
                    onClick={() => handleServiceStatusUpdate(service.id, 'Completed')}
                  >
                    Mark as Completed
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedSection === 'reviews' && (
          <div>
            <h3 className="text-xl font-semibold">Reviews</h3>
            <ul>
              {reviews.map((review) => (
                <li key={review.id} className="p-2 border-b">
                  {review.user}: {review.review}
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedSection === 'complaints' && (
          <div>
            <h3 className="text-xl font-semibold">Complaints</h3>
            <ul>
              {complaints.map((complaint) => (
                <li key={complaint.id} className="p-2 border-b">
                  {complaint.user}: {complaint.complaint}
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedSection === 'payments' && (
          <div>
            <h3 className="text-xl font-semibold">Payments</h3>
            <table className="min-w-full mt-4">
              <thead>
                <tr>
                  <th className="border px-4 py-2">User</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="border px-4 py-2">{payment.user}</td>
                    <td className="border px-4 py-2">${payment.amount}</td>
                    <td className="border px-4 py-2">{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedSection === 'manageUsers' && <AllUsers />}

        {selectedSection === 'userRequests' && (
          <div>
            <h3 className="text-xl font-semibold">User Requests</h3>
            <table className="min-w-full mt-4">
              <thead>
                <tr>
                  <th className="border px-4 py-2">User</th>
                  <th className="border px-4 py-2">Service</th>
                  <th className="border px-4 py-2">Status</th>
                  <th className="border px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {userRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="border px-4 py-2">{request.user}</td>
                    <td className="border px-4 py-2">{request.service}</td>
                    <td className="border px-4 py-2">{request.status}</td>
                    <td className="border px-4 py-2">{request.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
