// import { useState } from 'react';
// import { Routes, Route, useNavigate } from 'react-router-dom';
// import Sidebar from './components/Sidebar';
// import Dashboard from './components/Dashboard';
// import Database from './components/Database';
// import Copies from './components/Copies';
// import Users from './components/Users';

// function App() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const navigate = useNavigate();

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} navigate={navigate} />

//       {/* Main Content */}
//       <div className="flex-1 p-6 overflow-y-auto">
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/database" element={<Database />} />
//           <Route path="/copies" element={<Copies />} />
//           <Route path="/users" element={<Users />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;




import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Database from './components/Database';
import Copies from './components/Copies';
import Users from './components/Users';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import OsmEval from './components/OsmEval';
import ScannerStats from './components/ScannerStats';
import BagProgress from './components/BagProgress';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex h-screen bg-gray-100">
              <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
              <div className="flex-1 p-6 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<BagProgress />} />
                  <Route path="/bag-status" element={<Dashboard />} />
                  <Route path="/database" element={<Database />} />
                  <Route path="/copies" element={<Copies />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/osm-eval" element={<OsmEval />} />
                  <Route path="/scanner-stats" element={<ScannerStats />} />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;