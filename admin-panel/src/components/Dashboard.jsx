

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSync } from 'react-icons/fa';
const BaseURL = import.meta.env.VITE_API_URL;

function Dashboard() {
  const [bags, setBags] = useState([]);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchBags = (page = 1) => {
    axios.get(`${BaseURL}/bagging?page=${page}&limit=10`).then((res) => {
      setBags(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
      setLastUpdated(new Date().toLocaleTimeString()); // Update timestamp
    });
  };

  useEffect(() => {
    fetchBags();
  }, []);

  const getStatus = (bag) => {
    if (!bag.IsScanned && !bag.IsUploaded) return 'Not Started';
    if (bag.IsScanned && !bag.IsUploaded) return 'Scanned';
    if (bag.IsScanned && bag.IsUploaded) return 'Uploaded';
    return 'Unknown';
  };

  const filteredBags = bags.filter((bag) => {
    const status = getStatus(bag);
    return filter === 'all' || status === filter;
  });

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
        {lastUpdated && (
          <span className="text-sm text-gray-600">
            Last Refreshed: {lastUpdated}
          </span>
        )}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">Bag Status</h3>
          <div className="flex items-center space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="Not Started">Not Started</option>
              <option value="Scanned">Scanned</option>
              <option value="Uploaded">Uploaded</option>
            </select>
            <button
              onClick={() => fetchBags(currentPage)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaSync className="mr-2" /> Refresh
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-4 font-semibold">Bag ID</th>
                <th className="p-4 font-semibold">Packing ID</th>
                <th className="p-4 font-semibold">Copies Count</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBags.map((bag) => (
                <tr key={bag.BagID} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800">{bag.BagID}</td>
                  <td className="p-4 text-gray-800">{bag.PackingID}</td>
                  <td className="p-4 text-gray-800">{bag.CopiesCount}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getStatus(bag) === 'Uploaded'
                          ? 'bg-green-100 text-green-800'
                          : getStatus(bag) === 'Scanned'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {getStatus(bag)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => fetchBags(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => fetchBags(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;