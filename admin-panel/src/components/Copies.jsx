

import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSync } from 'react-icons/fa';

const BaseURL = import.meta.env.VITE_API_URL;

function Copies() {
  const [copies, setCopies] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchBagId, setSearchBagId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lastUpdated, setLastUpdated] = useState(null);


  const fetchCopies = (page = 1) => {
    const url = `${BaseURL}/gunning?page=${page}&limit=20${searchBagId ? `&bagId=${searchBagId}` : ''}`;
    axios.get(url).then((res) => {
      setCopies(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
      setLastUpdated(new Date().toLocaleTimeString()); // Update timestamp
    });
  };

  useEffect(() => {
    fetchCopies();
  }, []);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    fetchCopies(1);
  };

  const filteredCopies = copies.filter((copy) => {
    return filter === 'all' || (filter === 'Scanned' ? copy.IsScanned : !copy.IsScanned);
  });

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Copy Management</h2>
        {lastUpdated && (
          <span className="text-sm text-gray-600">
            Last Refreshed: {lastUpdated}
          </span>
        )}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h3 className="text-xl font-semibold text-gray-700">Scanned Copies</h3>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search by BagID (e.g., CSE406-BAG-001)"
              value={searchBagId}
              onChange={(e) => setSearchBagId(e.target.value)}
              className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-74"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="Scanned">Scanned</option>
              <option value="Not Scanned">Not Scanned</option>
            </select>
            <button
              onClick={() => fetchCopies(currentPage)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaSync className="mr-2" /> Refresh
            </button>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-4 font-semibold">Copy Barcode</th>
                <th className="p-4 font-semibold">Bag ID</th>
                <th className="p-4 font-semibold">Packing ID</th>
                <th className="p-4 font-semibold">Gunner ID</th>
                <th className="p-4 font-semibold">Gun Timestamp</th>
                <th className="p-4 font-semibold">Scanned</th>
              </tr>
            </thead>
            <tbody>
              {filteredCopies.map((copy) => (
                <tr key={copy.CopyBarcode} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800">{copy.CopyBarcode}</td>
                  <td className="p-4 text-gray-800">{copy.BagID}</td>
                  <td className="p-4 text-gray-800">{copy.PackingID}</td>
                  <td className="p-4 text-gray-800">{copy.GID}</td>
                  <td className="p-4 text-gray-800">{new Date(copy.GunTS).toLocaleString()}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        copy.IsScanned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {copy.IsScanned ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => fetchCopies(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => fetchCopies(currentPage + 1)}
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

export default Copies;