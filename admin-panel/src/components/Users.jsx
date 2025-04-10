// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { EditIconButton, DeleteIconButton } from './Button';
// import { FaAngleDoubleDown } from "react-icons/fa";
// import { FaAngleDoubleUp } from "react-icons/fa";
// import { LiaToggleOnSolid } from "react-icons/lia";
// import { LiaToggleOffSolid } from "react-icons/lia";

// function Users() {
//   const [users, setUsers] = useState([]);
//   const [form, setForm] = useState({ uid: '', pass: '', name: '', usertype: 'scanner', usr_role: 'user' });
//   const [editUser, setEditUser] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isFormOpen, setIsFormOpen] = useState(false);

//   const fetchUsers = (page = 1) => {
//     axios.get(`http://localhost:5000/api/users?page=${page}&limit=10`).then((res) => {
//       setUsers(res.data.data);
//       setTotalPages(res.data.totalPages);
//       setCurrentPage(res.data.currentPage);
//     });
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (editUser) {
//       axios.put(`http://localhost:5000/api/users/${editUser.sno}`, form).then((res) => {
//         setUsers(users.map((u) => (u.sno === editUser.sno ? res.data : u)));
//         setEditUser(null);
//         setForm({ uid: '', pass: '', name: '', usertype: 'scanner', usr_role: 'user' });
//       });
//     } else {
//       axios.post('http://localhost:5000/api/users', form).then((res) => {
//         fetchUsers(currentPage); // Refresh after adding
//         setForm({ uid: '', pass: '', name: '', usertype: 'scanner', usr_role: 'user' });
//         setIsFormOpen(false); // Close the form after successful submission
//       });
//     }
//   };

//   const handleEdit = (user) => {
//     setEditUser(user);
//     setForm({ uid: user.uid, pass: user.pass, name: user.name, usertype: user.usertype, usr_role: user.usr_role });
//     setIsFormOpen(true); // Open the form when editing
//   };

//   const handleDelete = (sno) => {
//     if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
//       axios.delete(`http://localhost:5000/api/users/${sno}`).then(() => {
//         fetchUsers(currentPage); // Refresh after deletion
//       });
//     }
//   };

//   const toggleForm = () => {
//     setIsFormOpen(!isFormOpen);
//     // If we're closing the form and not in edit mode, reset the form
//     if (isFormOpen && !editUser) {
//       setForm({ uid: '', pass: '', name: '', usertype: 'scanner', usr_role: 'user' });
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">User Management</h2>

//       <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
//         <div
//           className="flex justify-between items-center p-4 bg-gray-50 border-b cursor-pointer"
//           onClick={toggleForm}
//         >
//           <h3 className="text-lg font-semibold">
//             {editUser ? 'Edit User' : 'Register New User'}
//           </h3>
//           <div className="text-gray-600 flex items-center">

//           <span className="mr-2">{isFormOpen ? <FaAngleDoubleUp/> : <FaAngleDoubleDown/>}</span>
//             {/* <span className="mr-2">{isFormOpen ? 'Close' : 'Open'}</span> */}
//             {/* <svg
//               className={`w-5 h-5 transition-transform duration-200 ${isFormOpen ? 'transform rotate-180' : ''}`}
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//             </svg> */}
//           </div>
//         </div>

//         {isFormOpen && (
//           <div className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input type="text" placeholder="User ID" value={form.uid} onChange={(e) => setForm({ ...form, uid: e.target.value })} className="w-full p-2 border rounded" />
//               <input type="password" placeholder="Password" value={form.pass} onChange={(e) => setForm({ ...form, pass: e.target.value })} className="w-full p-2 border rounded" />
//               <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 border rounded" />
//               <select value={form.usertype} onChange={(e) => setForm({ ...form, usertype: e.target.value })} className="w-full p-2 border rounded">
//                 <option value="scanner">Scanner</option>
//                 <option value="gunner">Gunner</option>
//                 <option value="bagger">Bagger</option>
//               </select>
//               <select value={form.usr_role} onChange={(e) => setForm({ ...form, usr_role: e.target.value })} className="w-full p-2 border rounded">
//                 <option value="admin">Admin</option>
//                 <option value="user">User</option>
//               </select>
//               <div className="flex space-x-2">
//                 <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
//                   {editUser ? 'Update' : 'Register'}
//                 </button>
//                 {editUser && (
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setEditUser(null);
//                       setForm({ uid: '', pass: '', name: '', usertype: 'scanner', usr_role: 'user' });
//                     }}
//                     className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>
//         )}
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold mb-2">Users List</h3>
//         <table className="w-full text-left">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-2">SNo</th>
//               <th className="p-2">User ID</th>
//               <th className="p-2">Name</th>
//               <th className="p-2">User Type</th>
//               <th className="p-2">Role</th>
//               <th className="p-2">Active</th>
//               <th className="p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.sno} className="border-b">
//                 <td className="p-2">{user.sno}</td>
//                 <td className="p-2">{user.uid}</td>
//                 <td className="p-2">{user.name}</td>
//                 <td className="p-2">{user.usertype}</td>
//                 <td className="p-2">{user.usr_role}</td>
//                 <td className="p-2">{user.active ? 'Yes' : 'No'}</td>
//                 <td className="p-2">
//                   <EditIconButton onClick={() => handleEdit(user)}/>
//                   <DeleteIconButton onClick={() => handleDelete(user.sno)}/>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => fetchUsers(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="text-gray-700">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => fetchUsers(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Users;

import { useEffect, useState } from "react";
import axios from "axios";
import { EditIconButton, DeleteIconButton } from "./Button";
import { FaAngleDoubleDown } from "react-icons/fa";
import { FaAngleDoubleUp } from "react-icons/fa";
import { LiaToggleOnSolid } from "react-icons/lia";
import { LiaToggleOffSolid } from "react-icons/lia";
import Spinner from "./Spinner";

const BaseURL = import.meta.env.VITE_API_URL;

function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    uid: "",
    pass: "",
    name: "",
    usertype: "scanner",
    usr_role: "user",
  });
  const [editUser, setEditUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const fetchUsers = (page = 1) => {
    axios.get(`${BaseURL}/users?page=${page}&limit=10`).then((res) => {
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     if (editUser) {
  //       axios.put(`http://localhost:5000/api/users/${editUser.sno}`, form).then((res) => {
  //         setUsers(users.map((u) => (u.sno === editUser.sno ? res.data : u)));
  //         setEditUser(null);
  //         setForm({ uid: '', pass: '', name: '', usertype: 'scanner', usr_role: 'user' });
  //       });
  //     } else {
  //       axios.post('http://localhost:5000/api/users', form).then((res) => {
  //         fetchUsers(currentPage); // Refresh after adding
  //         setForm({ uid: '', pass: '', name: '', usertype: 'scanner', usr_role: 'user' });
  //         setIsFormOpen(false); // Close the form after successful submission
  //       });
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        const res = await axios.put(`${BaseURL}/users/${editUser.sno}`, form);
        setUsers(users.map((u) => (u.sno === editUser.sno ? res.data : u)));
        setEditUser(null);
        setForm({
          uid: "",
          pass: "",
          name: "",
          usertype: "scanner",
          usr_role: "user",
        });
      } else {
        await axios.post("${BaseURL}/users", form);
        fetchUsers(currentPage);
        setForm({
          uid: "",
          pass: "",
          name: "",
          usertype: "scanner",
          usr_role: "user",
        });
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.error || "Failed to save user"}`);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setForm({
      uid: user.uid,
      pass: user.pass,
      name: user.name,
      usertype: user.usertype,
      usr_role: user.usr_role,
    });
    setIsFormOpen(true); // Open the form when editing
  };

  const handleDelete = (sno) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      axios.delete(`${BaseURL}/users/${sno}`).then(() => {
        fetchUsers(currentPage); // Refresh after deletion
      });
    }
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
    // If we're closing the form and not in edit mode, reset the form
    if (isFormOpen && !editUser) {
      setForm({
        uid: "",
        pass: "",
        name: "",
        usertype: "scanner",
        usr_role: "user",
      });
    }
  };

  const handleToggleActive = async (user) => {
    // Show confirmation dialog
    const confirmMessage = user.active
      ? "Are you sure you want to deactivate this user?"
      : "Are you sure you want to activate this user?";

    if (!window.confirm(confirmMessage)) {
      return; // Exit if user cancels
    }

    setTogglingId(user.sno);
    const updatedUser = { ...user, active: !user.active };

    // Optimistic update
    setUsers(users.map((u) => (u.sno === user.sno ? updatedUser : u)));

    try {
      await axios.put(`${BaseURL}/users/${user.sno}`, updatedUser);
    } catch (error) {
      console.error("Error toggling user status:", error);
      // Revert if API call fails
      setUsers(users.map((u) => (u.sno === user.sno ? user : u)));
      alert("Failed to update user status");
    } finally {
      setTogglingId(null);
    }
  };



//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">User Management</h2>

        
//         <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
//         <div
//           className="flex justify-between items-center p-4 bg-gray-50 border-b cursor-pointer"
//           onClick={toggleForm}
//         >
//           <h3 className="text-lg font-semibold text-blue-500">
//             {editUser ? "Edit User" : "Register New User"}
//           </h3>
//           <div className="text-gray-600 flex items-center">
//             <span className="mr-2">
//               {isFormOpen ? <FaAngleDoubleUp /> : <FaAngleDoubleDown />}
//             </span>
//           </div>
//         </div>

//         {isFormOpen && (
//           <div className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="User ID"
//                 value={form.uid}
//                 onChange={(e) => setForm({ ...form, uid: e.target.value })}
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 value={form.pass}
//                 onChange={(e) => setForm({ ...form, pass: e.target.value })}
//                 className="w-full p-2 border rounded"
//               />
//               <input
//                 type="text"
//                 placeholder="Name"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 className="w-full p-2 border rounded"
//               />
//               <select
//                 value={form.usertype}
//                 onChange={(e) => setForm({ ...form, usertype: e.target.value })}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="scanner">Scanner</option>
//                 <option value="gunner">Gunner</option>
//                 <option value="bagger">Bagger</option>
//               </select>
//               <select
//                 value={form.usr_role}
//                 onChange={(e) => setForm({ ...form, usr_role: e.target.value })}
//                 className="w-full p-2 border rounded"
//               >
//                 <option value="admin">Admin</option>
//                 <option value="user">User</option>
//               </select>
//               <div className="flex space-x-2">
//                 <button
//                   type="submit"
//                   className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//                 >
//                   {editUser ? "Update" : "Register"}
//                 </button>
//                 {editUser && (
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setEditUser(null);
//                       setForm({
//                         uid: "",
//                         pass: "",
//                         name: "",
//                         usertype: "scanner",
//                         usr_role: "user",
//                       });
//                     }}
//                     className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
//                   >
//                     Cancel
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>
//         )}
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold mb-2">Registered Users</h3>
//         <table className="w-full text-left">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-2">SNo</th>
//               <th className="p-2">User ID</th>
//               <th className="p-2">Name</th>
//               <th className="p-2">User Type</th>
//               <th className="p-2">Role</th>
//               <th className="p-2">Active</th>
//               <th className="p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.sno} className="border-b">
//                 <td className="p-2">{user.sno}</td>
//                 <td className="p-2">{user.uid}</td>
//                 <td className="p-2">{user.name}</td>
//                 <td className="p-2">{user.usertype}</td>
//                 <td className="p-2">{user.usr_role}</td>
//                 <td className="p-2">
//                   <button
//                     disabled={togglingId === user.sno}
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       handleToggleActive(user);
//                     }}
//                     className="text-2xl focus:outline-none"
//                   >
//                     {togglingId === user.sno ? (
//                       <Spinner /> // Add your loading spinner component here
//                     ) : user.active ? (
//                       <LiaToggleOnSolid className="text-green-500" />
//                     ) : (
//                       <LiaToggleOffSolid className="text-red-500" />
//                     )}
//                   </button>
//                 </td>
//                 <td className="p-2">
//                   <EditIconButton onClick={() => handleEdit(user)} />
//                   <DeleteIconButton onClick={() => handleDelete(user.sno)} />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//         <div className="flex justify-between items-center mt-4">
//           <button
//             onClick={() => fetchUsers(currentPage - 1)}
//             disabled={currentPage === 1}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Previous
//           </button>
//           <span className="text-gray-700">
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             onClick={() => fetchUsers(currentPage + 1)}
//             disabled={currentPage === totalPages}
//             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//     </div>
//   );

return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>

      {/* Registration Form Card */}
      <div className="bg-white rounded-lg shadow-md mb-8 overflow-hidden">
        <div
          className="flex justify-between items-center p-4  border-b border-cyan-50 cursor-pointer hover:bg-cyan-50 transition-colors"
          onClick={toggleForm}
        >
          <h3 className="text-lg font-semibold text-cyan-600">
            {editUser ? "Edit User" : "Register New User"}
          </h3>
          <div className="text-cyan-600">
            {isFormOpen ? <FaAngleDoubleUp size={20} /> : <FaAngleDoubleDown size={20} />}
          </div>
        </div>

        {isFormOpen && (
          <div className="p-6 border-t border-blue-100 bg-white">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                  <input
                    type="text"
                    placeholder="Enter user ID"
                    value={form.uid}
                    onChange={(e) => setForm({ ...form, uid: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={form.pass}
                    onChange={(e) => setForm({ ...form, pass: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                  <select
                    value={form.usertype}
                    onChange={(e) => setForm({ ...form, usertype: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="scanner">Scanner</option>
                    <option value="gunner">Gunner</option>
                    <option value="bagger">Bagger</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Role</label>
                  <select
                    value={form.usr_role}
                    onChange={(e) => setForm({ ...form, usr_role: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 pt-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {editUser ? "Update User" : "Register User"}
                </button>
                {editUser && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditUser(null);
                      setForm({
                        uid: "",
                        pass: "",
                        name: "",
                        usertype: "scanner",
                        usr_role: "user",
                      });
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Users Table Card */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Registered Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 font-medium text-gray-700 border-b">SNo</th>
                <th className="p-3 font-medium text-gray-700 border-b">User ID</th>
                <th className="p-3 font-medium text-gray-700 border-b">Name</th>
                <th className="p-3 font-medium text-gray-700 border-b">User Type</th>
                <th className="p-3 font-medium text-gray-700 border-b">Role</th>
                <th className="p-3 font-medium text-gray-700 border-b">Active</th>
                <th className="p-3 font-medium text-gray-700 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.sno} className="hover:bg-gray-50 border-b">
                  <td className="p-3">{user.sno}</td>
                  <td className="p-3">{user.uid}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3 capitalize">{user.usertype}</td>
                  <td className="p-3 capitalize">{user.usr_role}</td>
                  <td className="p-3">
                    <button
                      disabled={togglingId === user.sno}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleActive(user);
                      }}
                      className="text-2xl focus:outline-none"
                    >
                      {togglingId === user.sno ? (
                        <Spinner />
                      ) : user.active ? (
                        <LiaToggleOnSolid className="text-green-500" size={24} />
                      ) : (
                        <LiaToggleOffSolid className="text-red-500" size={24} />
                      )}
                    </button>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      <EditIconButton onClick={() => handleEdit(user)} />
                      <DeleteIconButton onClick={() => handleDelete(user.sno)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => fetchUsers(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          <div className="text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </div>
          <button
            onClick={() => fetchUsers(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

}

export default Users;
