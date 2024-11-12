import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [servicesVisible, setServicesVisible] = useState(false);

  const toggleServices = () => setServicesVisible(!servicesVisible);

  return (
    <div className="p-6">
      <header className="text-center py-4">
        <h1 className="text-3xl font-bold">Welcome to Towing Services</h1>
        <p className="text-lg mt-2">Your one-stop solution for towing and mechanic services.</p>
      </header>
      <button
        onClick={toggleServices}
        className="bg-blue-500 text-white py-2 px-4 rounded mt-6"
      >
        {servicesVisible ? 'Hide Services' : 'Show All Services'}
      </button>

      {servicesVisible && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Our Services</h2>
          <ul className="mt-4">
            <li className="mt-2">Towing Service</li>
            <li className="mt-2">Mechanical Service</li>
            <li className="mt-2">Emergency Assistance</li>
            <li className="mt-2">Battery Replacement</li>
            <li className="mt-2">Car Inspection</li>
          </ul>
        </div>
      )}

      <div className="mt-6 flex justify-center space-x-4">
        <Link
          to="/user-dashboard"
          className="bg-green-500 text-white py-2 px-6 rounded"
        >
          User Dashboard
        </Link>
        <Link
          to="/admin-dashboard"
          className="bg-red-500 text-white py-2 px-6 rounded"
        >
          Admin Dashboard
        </Link>
        <Link
          to="/mechanic-dashboard"
          className="bg-yellow-500 text-white py-2 px-6 rounded"
        >
          Mechanic Dashboard
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
