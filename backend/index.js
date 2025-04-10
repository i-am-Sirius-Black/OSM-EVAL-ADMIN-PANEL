const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const app = express();

app.use(cors(
    {origin: '*'}
));
app.use(express.json());

// Sequelize MS SQL Connection
const sequelize = new Sequelize('TTSPL_EVAL', 'ttspl', 'admin', {
  host: 'localhost',
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: console.log,
});

// Define Models
const Bagging = sequelize.define('tbl_bagging', {
  BagID: { type: DataTypes.STRING, primaryKey: true },
  PackingID: { type: DataTypes.STRING },
  CopiesCount: { type: DataTypes.INTEGER },
  IsScanned: { type: DataTypes.BOOLEAN },
  IsUploaded: { type: DataTypes.BOOLEAN },
}, { tableName: 'tbl_bagging', timestamps: false });

const CopyGunning = sequelize.define('tbl_gunning', {
  CopyBarcode: { type: DataTypes.STRING, primaryKey: true },
  BagID: { type: DataTypes.STRING },
  PackingID: { type: DataTypes.STRING },
  GID: { type: DataTypes.STRING },
  GunTS: { type: DataTypes.DATE },
  IsScanned: { type: DataTypes.BOOLEAN },
}, { tableName: 'tbl_gunning', timestamps: false });


const Scanning = sequelize.define('tbl_scanning', {
    sno: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ScanId: { type: DataTypes.STRING },
    scannedAt: { type: DataTypes.DATE },
    copy_barcode: { type: DataTypes.STRING },
    copypdf: { type: DataTypes.BLOB },
    page_count: { type: DataTypes.INTEGER },
  }, { tableName: 'tbl_scanning', timestamps: false });

const UserLogin = sequelize.define('userlogin', {
  sno: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  uid: { type: DataTypes.STRING },
  pass: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  ctime: { type: DataTypes.DATE, defaultValue: sequelize.literal('GETDATE()') },
  usertype: { type: DataTypes.STRING },
  usr_role: { type: DataTypes.STRING },
  active: { type: DataTypes.BOOLEAN },
  del: { type: DataTypes.BOOLEAN },
}, { tableName: 'userlogin', timestamps: false });

// Test Connection
sequelize.authenticate()
  .then(() => console.log('Connected to MS SQL'))
  .catch((err) => console.error('Connection error:', err));

// API Endpoints

app.post('/api/login', async (req, res) => {
    const { uid, pass } = req.body;
    try {
      const user = await UserLogin.findOne({
        where: { uid, pass, usr_role: 'admin', active: true, del: false },
      });
      if (user) {
        res.json({ success: true, user: { sno: user.sno, uid: user.uid, name: user.name } });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials or not an admin' });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });



// // Bagging (Dashboard)
// app.get('/api/bagging', async (req, res) => {
//   try {
//     const bags = await Bagging.findAll();
//     res.json(bags);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Scanning (Copy Management)
// app.get('/api/scanning', async (req, res) => {
//   try {
//     const copies = await Scanning.findAll();
//     res.json(copies);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });



//!
// API Endpoints with Pagination


// app.get('/api/bagging', async (req, res) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 10;
//       const offset = (page - 1) * limit;
  
//       const { count, rows } = await Bagging.findAndCountAll({
//         offset,
//         limit,
//       });
  
//       res.json({
//         data: rows,
//         totalPages: Math.ceil(count / limit),
//         currentPage: page,
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });
  
//   app.get('/api/gunning', async (req, res) => {
//     try {
//       const page = parseInt(req.query.page) || 1;
//       const limit = parseInt(req.query.limit) || 20;
//       const offset = (page - 1) * limit;
//       const bagId = req.query.bagId || '';
  
//       const where = bagId ? { BagID: bagId } : {};
  
//       const { count, rows } = await CopyGunning.findAndCountAll({
//         where,
//         offset,
//         limit,
//       });
  
//       res.json({
//         data: rows,
//         totalPages: Math.ceil(count / limit),
//         currentPage: page,
//       });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   });

//!

const { Op } = require('sequelize');


app.get('/api/bagging', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      const { search, isScanned, isUploaded } = req.query;
  
      const where = {};
  
      // Search condition
      if (search) {
        where[Op.or] = [
          { BagID: { [Op.like]: `%${search}%` } },
          { PackingID: { [Op.like]: `%${search}%` } }
        ];
      }
  
      // Filter conditions
      if (isScanned !== undefined) {
        where.IsScanned = isScanned === 'true';
      }
      if (isUploaded !== undefined) {
        where.IsUploaded = isUploaded === 'true';
      }
  
      const { count, rows } = await Bagging.findAndCountAll({
        where,
        offset,
        limit,
      });
  
      res.json({
        data: rows,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  


  app.get('/api/gunning', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const offset = (page - 1) * limit;
      const { search, isScanned } = req.query;
  
      const where = {};
  
      // Search condition
      if (search) {
        where[Op.or] = [
          { CopyBarcode: { [Op.like]: `%${search}%` } },
          { BagID: { [Op.like]: `%${search}%` } },
          { PackingID: { [Op.like]: `%${search}%` } }
        ];
      }
  
      // Filter condition
      if (isScanned !== undefined) {
        where.IsScanned = isScanned === 'true';
      }
  
      const { count, rows } = await CopyGunning.findAndCountAll({
        where,
        offset,
        limit,
      });
  
      res.json({
        data: rows,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// // UserLogin (Users)
// app.get('/api/users', async (req, res) => {
//   try {
//     const users = await UserLogin.findAll();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


// API Endpoints with Pagination
app.get('/api/users', async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
  
      const { count, rows } = await UserLogin.findAndCountAll({
        offset,
        limit,
      });
  
      res.json({
        data: rows,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });



// app.post('/api/users', async (req, res) => {
//   try {
//     const user = await UserLogin.create({
//       ...req.body,
//       ctime: new Date(),
//       active: true,
//       del: false,
//     });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


app.post('/api/users', async (req, res) => {
    try {
      const user = await UserLogin.create({
        uid: req.body.uid,
        pass: req.body.pass,
        name: req.body.name,
        usertype: req.body.usertype,
        usr_role: req.body.usr_role,
        ctime: sequelize.literal('GETDATE()'), // Let SQL Server handle the datetime
        active: true,
        del: false
      });
      
      res.json(user);
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ 
        error: 'Failed to create user',
        details: err.errors?.map(e => e.message) || err.message 
      });
    }
  });

app.put('/api/users/:sno', async (req, res) => {
  try {
    const user = await UserLogin.findByPk(req.params.sno);
    if (user) {
      await user.update(req.body);
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.delete('/api/users/:sno', async (req, res) => {
  try {
    const user = await UserLogin.findByPk(req.params.sno);
    if (user) {
      await user.update({ del: true }); // Soft delete
      res.json({ message: 'User marked as deleted' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// New endpoint to stream PDF
app.get('/api/scanning/pdf/:sno', async (req, res) => {
    try {
      const scan = await Scanning.findByPk(req.params.sno);
      if (!scan || !scan.copypdf) {
        return res.status(404).json({ error: 'PDF not found' });
      }
      res.setHeader('Content-Type', 'application/pdf');
      res.send(scan.copypdf); // Stream the BLOB directly
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


//   app.get('/api/scanning', async (req, res) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 20;
//     const offset = (page - 1) * limit;
//     const bagId = req.query.bagId || '';
//     const where = bagId ? { BagID: bagId } : {};
//     const { count, rows } = await Scanning.findAndCountAll({ where, offset, limit });
//     res.json({ data: rows, totalPages: Math.ceil(count / limit), currentPage: page });
//   });


//* with search functionality 

app.get('/api/scanning', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const bagId = req.query.bagId || '';
    const copyBarcode = req.query.copyBarcode || '';
    
    // Build where clause based on provided search parameters
    let where = {};
    if (bagId) where.BagID = bagId;
    if (copyBarcode) {
      where.copy_barcode = {
        [Op.like]: `%${copyBarcode}%` // Using Sequelize's LIKE operator for partial matches
      };
    }
    
    try {
      const { count, rows } = await Scanning.findAndCountAll({ 
        where, 
        offset, 
        limit,
        order: [['scannedAt', 'DESC']] // Add default sorting
      });
      
      res.json({ 
        data: rows, 
        totalPages: Math.ceil(count / limit), 
        currentPage: page,
        totalRecords: count 
      });
    } catch (error) {
      console.error('Error fetching scan data:', error);
      res.status(500).json({ error: 'Failed to fetch scan data' });
    }
  });



// Start Server
app.listen(5000, () => console.log('Server running on http://localhost:5000'));