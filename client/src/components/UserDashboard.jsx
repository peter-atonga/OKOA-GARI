import React, { useState } from 'react';

const UserDashboard = () => {
  const [vehicleDetails, setVehicleDetails] = useState({
    make: '',
    model: '',
    year: '',
    registration: '',
  });
  const [location, setLocation] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [requestStatus, setRequestStatus] = useState('');
  const [review, setReview] = useState('');
  const [complaint, setComplaint] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('requestService');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [requestHistory, setRequestHistory] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const services = [
    { id: 1, type: 'towing', name: 'Car Towing' },
    { id: 2, type: 'mechanical', name: 'Flat Tire Fix' },
    { id: 3, type: 'towing', name: 'Heavy Duty Towing' },
    { id: 4, type: 'mechanical', name: 'Engine Diagnostics' },
    { id: 5, type: 'mechanical', name: 'Battery Jumpstart' },
  ];

  const handleVehicleDetailsChange = (e) => {
    const { name, value } = e.target;
    setVehicleDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleServiceRequest = () => {
    if (!serviceType) {
      alert('Please select a service first!');
      return;
    }

    setRequestStatus('Request sent!');
    setPaymentStatus('Pending');

    const newRequest = {
      id: Date.now(),
      service: serviceType,
      status: 'Requested',
      paymentStatus: 'Pending',
      review: review || 'No review provided',
      complaint: '',
      date: new Date().toLocaleString(),
    };

    setRequestHistory((prevHistory) => [...prevHistory, newRequest]);
  };

  const handlePayment = (requestId) => {
    setPaymentStatus('Completed');
    setRequestHistory((prevHistory) =>
      prevHistory.map((request) =>
        request.id === requestId ? { ...request, paymentStatus: 'Completed' } : request
      )
    );
    alert('Payment successful!');
  };

  const handleSubmitReview = (requestId) => {
    setRequestHistory((prevHistory) =>
      prevHistory.map((request) =>
        request.id === requestId ? { ...request, review } : request
      )
    );
    alert('Review submitted!');
  };

  const handleSubmitComplaint = (requestId) => {
    setRequestHistory((prevHistory) =>
      prevHistory.map((request) =>
        request.id === requestId ? { ...request, complaint } : request
      )
    );
    alert('Complaint submitted!');
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'requestService':
        return (
          <div>
            <h3 className="text-lg">Request Service</h3>
            {/* Vehicle Details */}
            <div className="mt-4">
              <h4 className="text-md">Vehicle Details</h4>
              {['make', 'model', 'year', 'registration'].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="p-2 border mt-2 w-full"
                  value={vehicleDetails[field]}
                  onChange={handleVehicleDetailsChange}
                />
              ))}
            </div>
            {/* Search and Dropdown */}
            <div className="relative mt-4">
              <input
                type="text"
                placeholder="Search for Towing or Mechanical services"
                className="p-2 border w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowDropdown(true)}
              />
              {showDropdown && (
                <div className="absolute z-10 w-full bg-white border rounded mt-1">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <div key={service.id} className="border-b py-2">
                        <button
                          onClick={() => {
                            setServiceType(service.name);
                            setShowDropdown(false);
                          }}
                          className="w-full text-left p-2 hover:bg-gray-200"
                        >
                          {service.name}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="p-2 text-gray-500">No services found.</p>
                  )}
                </div>
              )}
            </div>
            {serviceType && (
              <div className="mt-4">
                <h4 className="text-lg">Selected Service: {serviceType}</h4>
                <button
                  onClick={handleServiceRequest}
                  className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
                >
                  Request Service
                </button>
              </div>
            )}
          </div>
        );
      case 'review':
        return (
          <div>
            <h3 className="text-lg">Submit Review</h3>
            <input
              type="text"
              placeholder="Write your review here"
              className="p-2 border w-full mt-2"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            />
            <button
              onClick={() => handleSubmitReview(requestHistory[0]?.id)}
              className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
            >
              Submit Review
            </button>
          </div>
        );
      case 'complaint':
        return (
          <div>
            <h3 className="text-lg">Submit Complaint</h3>
            <input
              type="text"
              placeholder="Describe your complaint"
              className="p-2 border w-full mt-2"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
            />
            <button
              onClick={() => handleSubmitComplaint(requestHistory[0]?.id)}
              className="bg-red-500 text-white py-2 px-4 rounded mt-4"
            >
              Submit Complaint
            </button>
          </div>
        );
      case 'payment':
        return (
          <div>
            <h3 className="text-lg">Make Payment</h3>
            <button
              onClick={() => handlePayment(requestHistory[0]?.id)}
              className="bg-green-500 text-white py-2 px-4 rounded mt-4"
            >
              Pay Now
            </button>
          </div>
        );
      case 'requestHistory':
        return (
          <div>
            <h3 className="text-lg">Request History</h3>
            <ul>
              {requestHistory.map((request) => (
                <li key={request.id} className="mt-2 p-2 border">
                  <p>Service: {request.service}</p>
                  <p>Status: {request.status}</p>
                  <p>Payment Status: {request.paymentStatus}</p>
                  <p>Date: {request.date}</p>
                  <p>Review: {request.review}</p>
                  <p>Complaint: {request.complaint}</p>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-1/4 bg-gray-800 text-white p-4 min-h-screen">
        <h3 className="text-lg font-bold">Dashboard Menu</h3>
        <ul className="mt-6 space-y-4">
          {['requestService', 'review', 'complaint', 'payment', 'requestHistory'].map((section) => (
            <li key={section}>
              <button
                onClick={() => setActiveSection(section)}
                className={`w-full text-left p-2 hover:bg-gray-700 rounded ${
                  activeSection === section ? 'bg-gray-700' : ''
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 p-4">
        {renderSection()}
      </div>
    </div>
  );
};

export default UserDashboard;
