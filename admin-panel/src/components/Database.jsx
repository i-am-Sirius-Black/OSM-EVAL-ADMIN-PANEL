// // Database.jsx

// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaSync } from 'react-icons/fa';
// import { EditIconButton, DeleteIconButton } from './Button';

// function Database() {
//   const [data, setData] = useState([]);
//   const [selectedTable, setSelectedTable] = useState('tbl_bagging');
//   const [editItem, setEditItem] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [lastUpdated, setLastUpdated] = useState(null);

//   const fetchData = (page = 1) => {
//     const limit = selectedTable === 'tbl_gunning' ? 20 : 10; // 20 for scanning, 10 for others
//     axios
//       .get(`http://localhost:5000/api/${selectedTable.replace('tbl_', '')}?page=${page}&limit=${limit}`)
//       .then((res) => {
//         setData(res.data.data || []); // Ensure data is an array

//      console.log(selectedTable," data:",res.data.data);

//         setTotalPages(res.data.totalPages || 1);
//         setCurrentPage(res.data.currentPage || 1);
//         setLastUpdated(new Date().toLocaleTimeString()); // Update timestamp
//       })
//       .catch((err) => {
//         console.error(err);
//         setData([]); // Fallback to empty array on error
//       });
//   };

//   useEffect(() => {
//     fetchData();
//   }, [selectedTable]);

//   const handleEdit = (item) => {
//     setEditItem(item);
//     setFormData(item);
//   };

//   const handleSave = () => {
//     // Placeholder for save logic (to be implemented later with real API)
//     setData(data.map((d) => (d.BagID === editItem.BagID || d.CopyBarcode === editItem.CopyBarcode || d.sno === editItem.sno ? formData : d)));
//     setEditItem(null);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) {
//       // Placeholder for delete logic (to be implemented later)
//       setData(data.filter((item) => item.BagID !== id && item.CopyBarcode !== id && item.sno !== id));
//     }
//   };


//   const TableUtils = {

//     getRowKey(item, tableName) {
//         switch (tableName) {
//           case 'tbl_bagging':
//             if (!item.BagID) {
//               console.warn('Missing BagID in item:', item);
//               return `bagging-undefined`;
//             }
//             return `bagging-${item.BagID}`;
//           case 'tbl_gunning':
//             if (!item.CopyBarcode) {
//               console.warn('Missing CopyBarcode in item:', item);
//               return `gunning-undefined`;
//             }
//             return `gunning-${item.CopyBarcode}`;
//           default:
//             const fallbackKey = `fallback-${item.sno || Math.random().toString(36).slice(2, 9)}`;
//             console.warn('Unknown table or invalid item:', item, `-> fallback key: ${fallbackKey}`);
//             return fallbackKey;
//         }
//       }
      
//   };
  
//   return (
//     <div className="min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">Database Management</h2>
//         {lastUpdated && (
//           <span className="text-sm text-gray-600">
//             Last Refreshed: {lastUpdated}
//           </span>
//         )}
//       </div>
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center space-x-4">
//             <label className="text-gray-700 font-semibold">Select Table:</label>
//             <select
//               value={selectedTable}
//               onChange={(e) => setSelectedTable(e.target.value)}
//               className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="tbl_bagging">Bagging</option>
//               <option value="tbl_gunning">Gunning</option>
//             </select>
//           </div>
//           <button
//             onClick={() => fetchData(currentPage)}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             <FaSync className="mr-2" /> Refresh
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-100 text-gray-600">
//                 {/* <th className="p-4 font-semibold">ID</th> */}
//                 <th className="p-4 font-semibold">Details</th>
//                 <th className="p-4 font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {console.log('Rendered keys:', data.map(item => TableUtils.getRowKey(item)))}
//               {data.map((item) => (
//                <tr key={TableUtils.getRowKey(item, selectedTable)} className="border-b hover:bg-gray-50 transition-colors">
//                   {/* <td className="p-4 text-gray-800">{item.BagID || item.CopyBarcode || item.sno}</td> */}
//                   <td className="p-4 text-gray-800">{JSON.stringify(item)}</td>
//                   <td className="p-4">
//                   <div className="flex space-x-1">
//                     <EditIconButton
//                       onClick={() => handleEdit(item)}
//                     />
//                     <DeleteIconButton onClick={() => handleDelete(TableUtils.getDeleteId(item, selectedTable))} />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => fetchData(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="text-gray-700">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => fetchData(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editItem && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//             <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit Record</h3>
//             <form className="space-y-4">
//               {Object.keys(editItem).map((key) => (
//                 <div key={key}>
//                   <label className="block text-gray-600 font-medium">{key}</label>
//                   <input
//                     type="text"
//                     value={formData[key] || ''}
//                     onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
//                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               ))}
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setEditItem(null)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSave}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Database;










// // Database.jsx
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaSync } from 'react-icons/fa';
// import { EditIconButton, DeleteIconButton } from './Button';

// function Database() {
//   // Separate states for each table
//   const [baggingData, setBaggingData] = useState([]);
//   const [gunningData, setGunningData] = useState([]);
  
//   const [selectedTable, setSelectedTable] = useState('tbl_bagging');
//   const [editItem, setEditItem] = useState(null);
//   const [formData, setFormData] = useState({});
  
//   // Separate pagination states
//   const [baggingPagination, setBaggingPagination] = useState({
//     currentPage: 1,
//     totalPages: 1
//   });
  
//   const [gunningPagination, setGunningPagination] = useState({
//     currentPage: 1,
//     totalPages: 1
//   });
  
//   const [lastUpdated, setLastUpdated] = useState(null);

//   // Helper to get current data based on selected table
//   const getCurrentData = () => {
//     return selectedTable === 'tbl_bagging' ? baggingData : gunningData;
//   };

//   // Helper to get current pagination based on selected table
//   const getCurrentPagination = () => {
//     return selectedTable === 'tbl_bagging' ? baggingPagination : gunningPagination;
//   };

//   // Separate fetch functions for each table
//   const fetchBaggingData = (page = 1) => {
//     const limit = 10;
//     axios
//       .get(`http://localhost:5000/api/bagging?page=${page}&limit=${limit}`)
//       .then((res) => {
//         setBaggingData(res.data.data || []);
//         setBaggingPagination({
//           currentPage: res.data.currentPage || 1,
//           totalPages: res.data.totalPages || 1
//         });
//         setLastUpdated(new Date().toLocaleTimeString());
//       })
//       .catch((err) => {
//         console.error(err);
//         setBaggingData([]);
//       });
//   };

//   const fetchGunningData = (page = 1) => {
//     const limit = 20;
//     axios
//       .get(`http://localhost:5000/api/gunning?page=${page}&limit=${limit}`)
//       .then((res) => {
//         setGunningData(res.data.data || []);
//         setGunningPagination({
//           currentPage: res.data.currentPage || 1,
//           totalPages: res.data.totalPages || 1
//         });
//         setLastUpdated(new Date().toLocaleTimeString());
//       })
//       .catch((err) => {
//         console.error(err);
//         setGunningData([]);
//       });
//   };

//   // Fetch data based on selected table
//   const fetchData = (page = 1) => {
//     if (selectedTable === 'tbl_bagging') {
//       fetchBaggingData(page);
//     } else {
//       fetchGunningData(page);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [selectedTable]);

//   const handleEdit = (item) => {
//     setEditItem(item);
//     setFormData(item);
//   };

//   const handleSave = () => {
//     if (selectedTable === 'tbl_bagging') {
//       setBaggingData(baggingData.map(d => 
//         d.BagID === editItem.BagID ? formData : d
//       ));
//     } else {
//       setGunningData(gunningData.map(d => 
//         d.CopyBarcode === editItem.CopyBarcode ? formData : d
//       ));
//     }
//     setEditItem(null);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this record?')) {
//       if (selectedTable === 'tbl_bagging') {
//         setBaggingData(baggingData.filter(item => item.BagID !== id));
//       } else {
//         setGunningData(gunningData.filter(item => item.CopyBarcode !== id));
//       }
//     }
//   };

//   const getRowKey = (item) => {
//     return selectedTable === 'tbl_bagging' 
//       ? `bagging-${item.BagID}` 
//       : `gunning-${item.CopyBarcode}`;
//   };

//   const getDeleteId = (item) => {
//     return selectedTable === 'tbl_bagging' 
//       ? item.BagID 
//       : item.CopyBarcode;
//   };

//   // Get current data and pagination for rendering
//   const currentData = getCurrentData();
//   const { currentPage, totalPages } = getCurrentPagination();

//   return (
//     <div className="min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">Database Management</h2>
//         {lastUpdated && (
//           <span className="text-sm text-gray-600">
//             Last Refreshed: {lastUpdated}
//           </span>
//         )}
//       </div>
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex items-center space-x-4">
//             <label className="text-gray-700 font-semibold">Select Table:</label>
//             <select
//               value={selectedTable}
//               onChange={(e) => setSelectedTable(e.target.value)}
//               className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="tbl_bagging">Bagging</option>
//               <option value="tbl_gunning">Gunning</option>
//             </select>
//           </div>
//           <button
//             onClick={() => fetchData(currentPage)}
//             className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             <FaSync className="mr-2" /> Refresh
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-100 text-gray-600">
//                 <th className="p-4 font-semibold">Details</th>
//                 <th className="p-4 font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentData.map((item) => (
//                 <tr key={getRowKey(item)} className="border-b hover:bg-gray-50 transition-colors">
//                   <td className="p-4 text-gray-800">{JSON.stringify(item)}</td>
//                   <td className="p-4">
//                     <div className="flex space-x-1">
//                       <EditIconButton onClick={() => handleEdit(item)} />
//                       <DeleteIconButton onClick={() => handleDelete(getDeleteId(item))} />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => fetchData(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="text-gray-700">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => fetchData(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editItem && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//             <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit Record</h3>
//             <form className="space-y-4">
//               {Object.keys(editItem).map((key) => (
//                 <div key={key}>
//                   <label className="block text-gray-600 font-medium">{key}</label>
//                   <input
//                     type="text"
//                     value={formData[key] || ''}
//                     onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
//                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               ))}
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setEditItem(null)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSave}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Database;





// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { FaSync, FaSearch } from 'react-icons/fa';
// import { EditIconButton, DeleteIconButton } from './Button';

// function Database() {
//   // Separate states for each table
//   const [baggingData, setBaggingData] = useState([]);
//   const [gunningData, setGunningData] = useState([]);
  
//   const [selectedTable, setSelectedTable] = useState('tbl_bagging');
//   const [editItem, setEditItem] = useState(null);
//   const [formData, setFormData] = useState({});
  
//   // Search and filter states
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState('all');
  
//   // Separate pagination states
//   const [baggingPagination, setBaggingPagination] = useState({
//     currentPage: 1,
//     totalPages: 1
//   });
  
//   const [gunningPagination, setGunningPagination] = useState({
//     currentPage: 1,
//     totalPages: 1
//   });
  
//   const [lastUpdated, setLastUpdated] = useState(null);

//   // Helper to get current data based on selected table
//   const getCurrentData = () => {
//     return selectedTable === 'tbl_bagging' ? baggingData : gunningData;
//   };

//   // Helper to get current pagination based on selected table
//   const getCurrentPagination = () => {
//     return selectedTable === 'tbl_bagging' ? baggingPagination : gunningPagination;
//   };

//   // Separate fetch functions for each table
//   const fetchBaggingData = (page = 1, search = '') => {
//     const limit = 10;
//     let url = `http://localhost:5000/api/bagging?page=${page}&limit=${limit}`;
    
//     if (search) {
//       url += `&search=${search}`;
//     }
    
//     axios.get(url)
//       .then((res) => {
//         setBaggingData(res.data.data || []);
//         setBaggingPagination({
//           currentPage: res.data.currentPage || 1,
//           totalPages: res.data.totalPages || 1
//         });
//         setLastUpdated(new Date().toLocaleTimeString());
//       })
//       .catch((err) => {
//         console.error(err);
//         setBaggingData([]);
//       });
//   };

//   const fetchGunningData = (page = 1, search = '', filter = 'all') => {
//     const limit = 20;
//     let url = `http://localhost:5000/api/gunning?page=${page}&limit=${limit}`;
    
//     if (search) {
//       url += `&search=${search}`;
//     }
    
//     if (filter !== 'all') {
//       url += `&scanned=${filter === 'Scanned'}`;
//     }
    
//     axios.get(url)
//       .then((res) => {
//         setGunningData(res.data.data || []);
//         setGunningPagination({
//           currentPage: res.data.currentPage || 1,
//           totalPages: res.data.totalPages || 1
//         });
//         setLastUpdated(new Date().toLocaleTimeString());
//       })
//       .catch((err) => {
//         console.error(err);
//         setGunningData([]);
//       });
//   };

//   // Fetch data based on selected table
//   const fetchData = (page = 1) => {
//     if (selectedTable === 'tbl_bagging') {
//       fetchBaggingData(page, searchTerm);
//     } else {
//       fetchGunningData(page, searchTerm, filter);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [selectedTable]);

//   const handleEdit = (item) => {
//     setEditItem(item);
//     setFormData(item);
//   };

//   const handleSave = () => {
//     if (selectedTable === 'tbl_bagging') {
//       setBaggingData(baggingData.map(d => 
//         d.BagID === editItem.BagID ? formData : d
//       ));
//     } else {
//       setGunningData(gunningData.map(d => 
//         d.CopyBarcode === editItem.CopyBarcode ? formData : d
//       ));
//     }
//     setEditItem(null);
//   };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this record?')) {
//       if (selectedTable === 'tbl_bagging') {
//         setBaggingData(baggingData.filter(item => item.BagID !== id));
//       } else {
//         setGunningData(gunningData.filter(item => item.CopyBarcode !== id));
//       }
//     }
//   };

//   const handleSearch = () => {
//     // Reset to first page when searching
//     if (selectedTable === 'tbl_bagging') {
//       setBaggingPagination(prev => ({ ...prev, currentPage: 1 }));
//       fetchBaggingData(1, searchTerm);
//     } else {
//       setGunningPagination(prev => ({ ...prev, currentPage: 1 }));
//       fetchGunningData(1, searchTerm, filter);
//     }
//   };

//   const handleFilterChange = (newFilter) => {
//     setFilter(newFilter);
//     setGunningPagination(prev => ({ ...prev, currentPage: 1 }));
//     fetchGunningData(1, searchTerm, newFilter);
//   };

//   const getRowKey = (item) => {
//     return selectedTable === 'tbl_bagging' 
//       ? `bagging-${item.BagID}` 
//       : `gunning-${item.CopyBarcode}`;
//   };

//   const getDeleteId = (item) => {
//     return selectedTable === 'tbl_bagging' 
//       ? item.BagID 
//       : item.CopyBarcode;
//   };

//   // Get current data and pagination for rendering
//   const currentData = getCurrentData();
//   const { currentPage, totalPages } = getCurrentPagination();

//   return (
//     <div className="min-h-screen">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-3xl font-bold text-gray-800">Database Management</h2>
//         {lastUpdated && (
//           <span className="text-sm text-gray-600">
//             Last Refreshed: {lastUpdated}
//           </span>
//         )}
//       </div>
//       <div className="bg-white p-6 rounded-xl shadow-lg">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//           <div className="flex items-center space-x-4">
//             <label className="text-gray-700 font-semibold">Select Table:</label>
//             <select
//               value={selectedTable}
//               onChange={(e) => setSelectedTable(e.target.value)}
//               className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="tbl_bagging">Bagging</option>
//               <option value="tbl_gunning">Gunning</option>
//             </select>
//           </div>
          
//           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//             <div className="relative flex-grow">
//               <input
//                 type="text"
//                 placeholder={
//                   selectedTable === 'tbl_bagging' 
//                     ? 'Search by BagID...' 
//                     : 'Search by Barcode or BagID...'
//                 }
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full p-2 pl-10 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//               />
//               <FaSearch className="absolute left-3 top-3 text-gray-400" />
//             </div>
            
//             {selectedTable === 'tbl_gunning' && (
//               <select
//                 value={filter}
//                 onChange={(e) => handleFilterChange(e.target.value)}
//                 className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="all">All</option>
//                 <option value="Scanned">Scanned</option>
//                 <option value="Not Scanned">Not Scanned</option>
//               </select>
//             )}
            
//             <div className="flex space-x-2">
//               <button
//                 onClick={handleSearch}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
//               >
//                 <FaSearch className="mr-2" /> Search
//               </button>
//               <button
//                 onClick={() => fetchData(currentPage)}
//                 className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 <FaSync className="mr-2" /> Refresh
//               </button>
//             </div>
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="bg-gray-100 text-gray-600">
//                 <th className="p-4 font-semibold">Details</th>
//                 <th className="p-4 font-semibold">Status</th>
//                 <th className="p-4 font-semibold">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentData.map((item) => (
//                 <tr key={getRowKey(item)} className="border-b hover:bg-gray-50 transition-colors">
//                   <td className="p-4 text-gray-800">
//                     <pre className="text-sm">{JSON.stringify(item, null, 2)}</pre>
//                   </td>
//                   <td className="p-4">
//                     {item.IsScanned !== undefined && (
//                       <span
//                         className={`px-3 py-1 rounded-full text-sm font-medium ${
//                           item.IsScanned ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                         }`}
//                       >
//                         {item.IsScanned ? 'Scanned' : 'Not Scanned'}
//                       </span>
//                     )}
//                   </td>
//                   <td className="p-4">
//                     <div className="flex space-x-1">
//                       <EditIconButton onClick={() => handleEdit(item)} />
//                       <DeleteIconButton onClick={() => handleDelete(getDeleteId(item))} />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => {
//               const newPage = currentPage - 1;
//               if (selectedTable === 'tbl_bagging') {
//                 setBaggingPagination(prev => ({ ...prev, currentPage: newPage }));
//               } else {
//                 setGunningPagination(prev => ({ ...prev, currentPage: newPage }));
//               }
//               fetchData(newPage);
//             }}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="text-gray-700">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => {
//               const newPage = currentPage + 1;
//               if (selectedTable === 'tbl_bagging') {
//                 setBaggingPagination(prev => ({ ...prev, currentPage: newPage }));
//               } else {
//                 setGunningPagination(prev => ({ ...prev, currentPage: newPage }));
//               }
//               fetchData(newPage);
//             }}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Edit Modal */}
//       {editItem && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
//             <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit Record</h3>
//             <form className="space-y-4">
//               {Object.keys(editItem).map((key) => (
//                 <div key={key}>
//                   <label className="block text-gray-600 font-medium">{key}</label>
//                   <input
//                     type="text"
//                     value={formData[key] || ''}
//                     onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
//                     className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               ))}
//               <div className="flex justify-end space-x-2">
//                 <button
//                   type="button"
//                   onClick={() => setEditItem(null)}
//                   className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleSave}
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Database;







import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSync, FaSearch } from 'react-icons/fa';
import { EditIconButton, DeleteIconButton } from './Button';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const BaseURL = import.meta.env.VITE_API_URL;


function Database() {
  // Separate states for each table
  const [baggingData, setBaggingData] = useState([]);
  const [gunningData, setGunningData] = useState([]);
  
  const [selectedTable, setSelectedTable] = useState('tbl_bagging');
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [baggingFilter, setBaggingFilter] = useState('all');
  const [gunningFilter, setGunningFilter] = useState('all');
  
  // Separate pagination states
  const [baggingPagination, setBaggingPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });
  
  const [gunningPagination, setGunningPagination] = useState({
    currentPage: 1,
    totalPages: 1
  });
  
  const [lastUpdated, setLastUpdated] = useState(null);


  // Helper to get current data based on selected table
  const getCurrentData = () => {
    return selectedTable === 'tbl_bagging' ? baggingData : gunningData;
  };

  // Helper to get current pagination based on selected table
  const getCurrentPagination = () => {
    return selectedTable === 'tbl_bagging' ? baggingPagination : gunningPagination;
  };

  // Get bagging status text and style
  const getBaggingStatus = (item) => {
    if (item.IsScanned && item.IsUploaded) {
      return { text: 'Processed', style: 'bg-green-100 text-green-800' };
    } else if (item.IsScanned && !item.IsUploaded) {
      return { text: 'Processing', style: 'bg-blue-100 text-blue-800' };
    } else {
      return { text: 'Not Scanned', style: 'bg-red-100 text-red-800' };
    }
  };

  // Get gunning status text and style
  const getGunningStatus = (item) => {
    return item.IsScanned 
      ? { text: 'Scanned', style: 'bg-green-100 text-green-800' }
      : { text: 'Not Scanned', style: 'bg-red-100 text-red-800' };
  };

  // Separate fetch functions for each table
  const fetchBaggingData = (page = 1, search = '', filter = 'all') => {
    const limit = 10;
    let url = `${BaseURL}/bagging?page=${page}&limit=${limit}`;
    
    if (search) {
      url += `&search=${search}`;
    }
    
    if (filter !== 'all') {
      if (filter === 'Processed') {
        url += '&isScanned=true&isUploaded=true';
      } else if (filter === 'Processing') {
        url += '&isScanned=true&isUploaded=false';
      } else if (filter === 'Not Scanned') {
        url += '&isScanned=false';
      }
    }
    
    axios.get(url)
      .then((res) => {
        setBaggingData(res.data.data || []);
        setBaggingPagination({
          currentPage: res.data.currentPage || 1,
          totalPages: res.data.totalPages || 1
        });
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch((err) => {
        console.error(err);
        setBaggingData([]);
      });
  };

  const fetchGunningData = (page = 1, search = '', filter = 'all') => {
    const limit = 20;
    let url = `${BaseURL}/gunning?page=${page}&limit=${limit}`;
    
    if (search) {
      url += `&search=${search}`;
    }
    
    if (filter !== 'all') {
      url += `&isScanned=${filter === 'Scanned'}`;
    }
    
    axios.get(url)
      .then((res) => {
        setGunningData(res.data.data || []);
        setGunningPagination({
          currentPage: res.data.currentPage || 1,
          totalPages: res.data.totalPages || 1
        });
        setLastUpdated(new Date().toLocaleTimeString());
      })
      .catch((err) => {
        console.error(err);
        setGunningData([]);
      });
  };

  // Fetch data based on selected table
  const fetchData = (page = 1) => {
    if (selectedTable === 'tbl_bagging') {
      fetchBaggingData(page, searchTerm, baggingFilter);
    } else {
      fetchGunningData(page, searchTerm, gunningFilter);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedTable]);

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData(item);
  };

  const handleSave = () => {
    if (selectedTable === 'tbl_bagging') {
      setBaggingData(baggingData.map(d => 
        d.BagID === editItem.BagID ? formData : d
      ));
    } else {
      setGunningData(gunningData.map(d => 
        d.CopyBarcode === editItem.CopyBarcode ? formData : d
      ));
    }
    setEditItem(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      if (selectedTable === 'tbl_bagging') {
        setBaggingData(baggingData.filter(item => item.BagID !== id));
      } else {
        setGunningData(gunningData.filter(item => item.CopyBarcode !== id));
      }
    }
  };

  const handleSearch = () => {
    // Reset to first page when searching
    if (selectedTable === 'tbl_bagging') {
      setBaggingPagination(prev => ({ ...prev, currentPage: 1 }));
      fetchBaggingData(1, searchTerm, baggingFilter);
    } else {
      setGunningPagination(prev => ({ ...prev, currentPage: 1 }));
      fetchGunningData(1, searchTerm, gunningFilter);
    }
  };

  const handleBaggingFilterChange = (newFilter) => {
    setBaggingFilter(newFilter);
    setBaggingPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchBaggingData(1, searchTerm, newFilter);
  };

  const handleGunningFilterChange = (newFilter) => {
    setGunningFilter(newFilter);
    setGunningPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchGunningData(1, searchTerm, newFilter);
  };

  const getRowKey = (item) => {
    return selectedTable === 'tbl_bagging' 
      ? `bagging-${item.BagID}` 
      : `gunning-${item.CopyBarcode}`;
  };

  const getDeleteId = (item) => {
    return selectedTable === 'tbl_bagging' 
      ? item.BagID 
      : item.CopyBarcode;
  };

  // Get current data and pagination for rendering
  const currentData = getCurrentData();
  const { currentPage, totalPages } = getCurrentPagination();

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Database Management</h2>
        {lastUpdated && (
          <span className="text-sm text-gray-600">
            Last Refreshed: {lastUpdated}
          </span>
        )}
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <div className="flex items-center space-x-4">
            <label className="text-gray-700 font-semibold">Select Table:</label>
            <select
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tbl_bagging">Bagging</option>
              <option value="tbl_gunning">Gunning</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder={
                  selectedTable === 'tbl_bagging' 
                    ? 'Search by BagID...' 
                    : 'Search by Barcode or BagID...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            
            {selectedTable === 'tbl_bagging' ? (
              <select
                value={baggingFilter}
                onChange={(e) => handleBaggingFilterChange(e.target.value)}
                className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="Processed">Processed</option>
                <option value="Processing">Processing</option>
                <option value="Not Scanned">Not Scanned</option>
              </select>
            ) : (
              <select
                value={gunningFilter}
                onChange={(e) => handleGunningFilterChange(e.target.value)}
                className="p-2 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="Scanned">Scanned</option>
                <option value="Not Scanned">Not Scanned</option>
              </select>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
              >
                <FaSearch className="mr-2" /> Search
              </button>
              <button
                onClick={() => fetchData(currentPage)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <FaSync className="mr-2" /> Refresh
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th className="p-4 font-semibold">Details</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((item) => {
                const itemStatus = selectedTable === 'tbl_bagging' 
                  ? getBaggingStatus(item) 
                  : getGunningStatus(item);
                
                return (
                  <tr key={getRowKey(item)} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-800">
                      <pre className="text-sm">{JSON.stringify(item, null, 2)}</pre>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${itemStatus.style}`}>
                        {itemStatus.text}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex space-x-1">
                        <EditIconButton onClick={() => handleEdit(item)} />
                        <DeleteIconButton onClick={() => handleDelete(getDeleteId(item))} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => {
              const newPage = currentPage - 1;
              if (selectedTable === 'tbl_bagging') {
                setBaggingPagination(prev => ({ ...prev, currentPage: newPage }));
              } else {
                setGunningPagination(prev => ({ ...prev, currentPage: newPage }));
              }
              fetchData(newPage);
            }}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => {
              const newPage = currentPage + 1;
              if (selectedTable === 'tbl_bagging') {
                setBaggingPagination(prev => ({ ...prev, currentPage: newPage }));
              } else {
                setGunningPagination(prev => ({ ...prev, currentPage: newPage }));
              }
              fetchData(newPage);
            }}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Edit Record</h3>
            <form className="space-y-4">
              {Object.keys(editItem).map((key) => (
                <div key={key}>
                  <label className="block text-gray-600 font-medium">{key}</label>
                  <input
                    type="text"
                    value={formData[key] || ''}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Database;