// import { FaHome, FaDatabase, FaFileAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';
// import { LuPanelLeftOpen } from "react-icons/lu";
// import { LuPanelRightOpen } from "react-icons/lu";
// import { useNavigate } from 'react-router-dom';

// function Sidebar({ sidebarOpen, setSidebarOpen }) {
//     const navigate = useNavigate();
//   const menuItems = [
//     { name: 'Dashboard', icon: <FaHome />, path: '/' },
//     { name: 'Database', icon: <FaDatabase />, path: '/database' },
//     { name: 'Copies', icon: <FaFileAlt />, path: '/copies' },
//     { name: 'Users', icon: <FaUsers />, path: '/users' },
//   ];


//   const handleLogout = () => {
//     localStorage.removeItem('adminUser');
//     navigate('/login');
//   };



//   return (
//     <div
//       className={`${
//         sidebarOpen ? 'w-64' : 'w-20'
//       } bg-zinc-700 text-white h-full transition-all duration-300`}
//     >
//       <div className="p-4 flex justify-between items-center">
//         <h1 className={`${sidebarOpen ? 'block' : 'hidden'} text-xl font-bold`}>Admin Panel</h1>
//         <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
//           {sidebarOpen ? <LuPanelRightOpen/> : <LuPanelLeftOpen/>}
//         </button>
//       </div>
//       <ul>
//         {menuItems.map((item) => (
//           <li
//             key={item.name}
//             className="p-4 hover:bg-blue-700 cursor-pointer flex items-center"
//             onClick={() => navigate(item.path)}
//           >
//             <span className="mr-3">{item.icon}</span>
//             <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>{item.name}</span>
//           </li>
//         ))}
//         <li
//           className="p-4 hover:bg-red-500 cursor-pointer flex items-center mt-auto"
//           onClick={handleLogout}
//         >
//           <span className="mr-3"><FaSignOutAlt /></span>
//           <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Logout</span>
//         </li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;



// import { useState } from 'react';
// import { FaHome, FaDatabase, FaFileAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';
// import { LuPanelLeftOpen, LuPanelRightOpen } from "react-icons/lu";
// import { useNavigate } from 'react-router-dom';

// function Sidebar({ sidebarOpen, setSidebarOpen }) {
//   const navigate = useNavigate();
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
//   const menuItems = [
//     { name: 'Dashboard', icon: <FaHome />, path: '/' },
//     { name: 'Database', icon: <FaDatabase />, path: '/database' },
//     { name: 'Copies', icon: <FaFileAlt />, path: '/copies' },
//     { name: 'Users', icon: <FaUsers />, path: '/users' },
//   ];

//   const confirmLogout = () => {
//     setShowLogoutConfirm(true);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('adminUser');
//     setShowLogoutConfirm(false);
//     navigate('/login');
//   };

//   const cancelLogout = () => {
//     setShowLogoutConfirm(false);
//   };

//   return (
//     <>
//       <div
//         className={`${
//           sidebarOpen ? 'w-64' : 'w-20'
//         } bg-zinc-700 text-white h-full transition-all duration-300`}
//       >
//         <div className="p-4 flex justify-between items-center">
//           <h1 className={`${sidebarOpen ? 'block' : 'hidden'} text-xl font-bold`}>Admin Panel</h1>
//           <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
//             {sidebarOpen ? <LuPanelRightOpen/> : <LuPanelLeftOpen/>}
//           </button>
//         </div>
//         <ul>
//           {menuItems.map((item) => (
//             <li
//               key={item.name}
//               className="p-4 hover:bg-blue-700 cursor-pointer flex items-center"
//               onClick={() => navigate(item.path)}
//             >
//               <span className="mr-3">{item.icon}</span>
//               <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>{item.name}</span>
//             </li>
//           ))}
//           <li
//             className="p-4 hover:bg-red-500 cursor-pointer flex items-center mt-auto"
//             onClick={confirmLogout}
//           >
//             <span className="mr-3"><FaSignOutAlt /></span>
//             <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Logout</span>
//           </li>
//         </ul>
//       </div>

//       {/* Logout Confirmation Modal */}
//       {showLogoutConfirm && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
//             <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Logout</h3>
//             <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
//             <div className="flex justify-end space-x-3">
//               <button
//                 onClick={cancelLogout}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Sidebar;








import { useState } from 'react';
import { FaHome, FaDatabase, FaFileAlt, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import { LuPanelLeftOpen, LuPanelRightOpen } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { FaFilePdf } from "react-icons/fa";


function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  const menuItems = [
    { name: 'Dashboard', icon: <FaHome />, path: '/' },
    { name: 'Database', icon: <FaDatabase />, path: '/database' },
    { name: 'Copies', icon: <FaFileAlt />, path: '/copies' },
    { name: 'Users', icon: <FaUsers />, path: '/users' },
    { name: 'Osm-Evaluation', icon: <FaFilePdf />, path: '/osm-eval' },
  ];

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    setShowLogoutConfirm(false);
    navigate('/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-zinc-700 text-white h-full transition-all duration-300`}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className={`${sidebarOpen ? 'block' : 'hidden'} text-xl font-bold`}>Admin Panel</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white">
            {sidebarOpen ? <LuPanelRightOpen/> : <LuPanelLeftOpen/>}
          </button>
        </div>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.name}
              className="p-4 hover:bg-blue-700 cursor-pointer flex items-center transition-colors duration-200"
              onClick={() => navigate(item.path)}
            >
              <span className="mr-3">{item.icon}</span>
              <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>{item.name}</span>
            </li>
          ))}
          <li
            className="p-4 hover:bg-red-500 cursor-pointer flex items-center mt-auto transition-colors duration-200"
            onClick={confirmLogout}
          >
            <span className="mr-3"><FaSignOutAlt /></span>
            <span className={`${sidebarOpen ? 'block' : 'hidden'}`}>Logout</span>
          </li>
        </ul>
      </div>

      {/* Simplified Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black
        
        bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Confirm Logout</h3>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-gray-600">Are you sure you want to sign out of your account?</p>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;