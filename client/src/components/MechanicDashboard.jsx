import React, { useState, useEffect } from 'react';

const MechanicDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [serviceDetails, setServiceDetails] = useState({
    serviceType: '',
    price: '',
    description: '',
    photo: '',
  });
  const [services, setServices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [serviceRequests, setServiceRequests] = useState([]);
  const [requestHistory, setRequestHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);

  useEffect(() => {
    fetchServices();
    fetchPayments();
    fetchNotifications();
    fetchReviews();
    fetchComplaints();
    fetchServiceRequests();
    fetchRequestHistory();
    fetchPaymentHistory();
  }, []);

  const fetchServices = async () => {
    setServices([
      { id: 1, serviceType: 'Towing', price: 100, description: 'Flat tire assistance' },
      { id: 2, serviceType: 'Mechanical', price: 150, description: 'Engine repair' },
    ]);
  };

  const fetchPayments = async () => {
    setPayments([
      { id: 1, serviceId: 1, amount: 100, status: 'Paid' },
      { id: 2, serviceId: 2, amount: 150, status: 'Pending' },
    ]);
  };

  const fetchNotifications = async () => {
    setNotifications([
      { id: 1, message: 'New service request for Towing', type: 'request' },
      { id: 2, message: 'Service is now Ongoing', type: 'update' },
    ]);
  };

  const fetchReviews = async () => {
    setReviews([
      { id: 1, customer: 'John Doe', review: 'Great service!', rating: 5 },
      { id: 2, customer: 'Jane Smith', review: 'Very professional!', rating: 4 },
    ]);
  };

  const fetchComplaints = async () => {
    setComplaints([
      { id: 1, customer: 'John Doe', complaint: 'Delayed service', status: 'Resolved' },
    ]);
  };

  const fetchServiceRequests = async () => {
    setServiceRequests([
      { id: 1, serviceType: 'Towing', customerName: 'John Doe', status: 'Requested' },
      { id: 2, serviceType: 'Mechanical', customerName: 'Jane Smith', status: 'Ongoing' },
    ]);
  };

  const fetchRequestHistory = async () => {
    setRequestHistory([
      { id: 1, serviceType: 'Towing', customerName: 'John Doe', status: 'Completed', date: '2024-10-15' },
      { id: 2, serviceType: 'Mechanical', customerName: 'Jane Smith', status: 'Ongoing', date: '2024-10-18' },
    ]);
  };

  const fetchPaymentHistory = async () => {
    setPaymentHistory([
      { id: 1, customerName: 'John Doe', serviceId: 1, amount: 100, status: 'Paid', date: '2024-10-15' },
      { id: 2, customerName: 'Jane Smith', serviceId: 2, amount: 150, status: 'Pending', date: '2024-10-18' },
    ]);
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleServiceSubmit = () => {
    alert('Service added successfully');
  };

  const handleNotificationClick = (notification) => {
    alert(`Notification: ${notification.message}`);
  };

  const handleServiceStatusUpdate = (requestId, status) => {
    alert(`Service status updated to ${status} for request ID: ${requestId}`);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-800 text-white p-6 fixed md:relative md:h-full">
        <h2 className="text-2xl font-bold">Mechanic Dashboard</h2>
        <ul className="mt-6 space-y-4">
          <li>
            <button
              onClick={() => setActiveSection('dashboard')}
              className={`w-full py-2 text-left hover:bg-gray-700 px-4 ${activeSection === 'dashboard' ? 'bg-gray-700' : ''}`}
            >
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('addService')}
              className={`w-full py-2 text-left hover:bg-gray-700 px-4 ${activeSection === 'addService' ? 'bg-gray-700' : ''}`}
            >
              Add Service
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('services')}
              className={`w-full py-2 text-left hover:bg-gray-700 px-4 ${activeSection === 'services' ? 'bg-gray-700' : ''}`}
            >
              Services
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('payments')}
              className={`w-full py-2 text-left hover:bg-gray-700 px-4 ${activeSection === 'payments' ? 'bg-gray-700' : ''}`}
            >
              Payments
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('serviceRequests')}
              className={`w-full py-2 text-left hover:bg-gray-700 px-4 ${activeSection === 'serviceRequests' ? 'bg-gray-700' : ''}`}
            >
              Service Requests
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('requestHistory')}
              className={`w-full py-2 text-left hover:bg-gray-700 px-4 ${activeSection === 'requestHistory' ? 'bg-gray-700' : ''}`}
            >
              Request History
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('paymentHistory')}
              className={`w-full py-2 text-left hover:bg-gray-700 px-4 ${activeSection === 'paymentHistory' ? 'bg-gray-700' : ''}`}
            >
              Payment History
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('notifications')}
              className={`w-full py-2 text-left hover:bg-gray-700 px-4 ${activeSection === 'notifications' ? 'bg-gray-700' : ''}`}
            >
              Notifications
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('reviews')}
              className={`w-full py-2 text-left hover:bg-gray-700 px-4 ${activeSection === 'reviews' ? 'bg-gray-700' : ''}`}
            >
              Reviews
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('complaints')}
              className={`w-full py-2 text-left hover:bg-gray-700 px-4 ${activeSection === 'complaints' ? 'bg-gray-700' : ''}`}
            >
              Complaints
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4 md:ml-1/4 p-6 overflow-auto md:pl-24">
        {activeSection === 'dashboard' && <h3>Welcome to the Mechanic Dashboard</h3>}

        {activeSection === 'addService' && (
          <div>
            <h3 className="text-lg">Add Service</h3>
            <input
              type="text"
              name="serviceType"
              placeholder="Service Type"
              className="p-2 border mt-2 w-full"
              value={serviceDetails.serviceType}
              onChange={handleServiceChange}
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              className="p-2 border mt-2 w-full"
              value={serviceDetails.price}
              onChange={handleServiceChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              className="p-2 border mt-2 w-full"
              value={serviceDetails.description}
              onChange={handleServiceChange}
            />
            <input
              type="file"
              name="photo"
              className="p-2 border mt-2 w-full"
              onChange={(e) => setServiceDetails({ ...serviceDetails, photo: e.target.files[0] })}
            />
            <button
              onClick={handleServiceSubmit}
              className="mt-4 px-4 py-2 bg-blue-500 text-white"
            >
              Add Service
            </button>
          </div>
        )}

        {activeSection === 'services' && (
          <div>
            <h3 className="text-lg">Services</h3>
            <ul>
              {services.map((service) => (
                <li key={service.id} className="p-2 border-b">
                  {service.serviceType} - ${service.price}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === 'payments' && (
          <div>
            <h3 className="text-lg">Payments</h3>
            <ul>
              {payments.map((payment) => (
                <li key={payment.id} className="p-2 border-b">
                  Service ID: {payment.serviceId} - Amount: ${payment.amount} - Status: {payment.status}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === 'serviceRequests' && (
          <div>
            <h3 className="text-lg">Service Requests</h3>
            <ul>
              {serviceRequests.map((request) => (
                <li key={request.id} className="p-2 border-b">
                  {request.serviceType} - {request.customerName} - Status: {request.status}
                  <button
                    className="ml-4 text-blue-500"
                    onClick={() => handleServiceStatusUpdate(request.id, 'Completed')}
                  >
                    Mark as Completed
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === 'requestHistory' && (
          <div>
            <h3 className="text-lg">Request History</h3>
            <ul>
              {requestHistory.map((request) => (
                <li key={request.id} className="p-2 border-b">
                  {request.serviceType} - {request.customerName} - Status: {request.status} - Date: {request.date}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === 'paymentHistory' && (
          <div>
            <h3 className="text-lg">Payment History</h3>
            <ul>
              {paymentHistory.map((payment) => (
                <li key={payment.id} className="p-2 border-b">
                  {payment.customerName} - Amount: ${payment.amount} - Status: {payment.status} - Date: {payment.date}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === 'notifications' && (
          <div>
            <h3 className="text-lg">Notifications</h3>
            <ul>
              {notifications.map((notification) => (
                <li key={notification.id} className="p-2 border-b">
                  <button
                    onClick={() => handleNotificationClick(notification)}
                    className="text-blue-500"
                  >
                    {notification.message}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === 'reviews' && (
          <div>
            <h3 className="text-lg">Reviews</h3>
            <ul>
              {reviews.map((review) => (
                <li key={review.id} className="p-2 border-b">
                  {review.customer} - Rating: {review.rating} - Review: {review.review}
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeSection === 'complaints' && (
          <div>
            <h3 className="text-lg">Complaints</h3>
            <ul>
              {complaints.map((complaint) => (
                <li key={complaint.id} className="p-2 border-b">
                  {complaint.customer} - Status: {complaint.status} - Complaint: {complaint.complaint}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MechanicDashboard;
