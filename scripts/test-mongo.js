require('dotenv').config();
const mongoose = require('mongoose');

const dburl = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/findplace_dev';

(async function test() {
  console.log('Testing MongoDB connection to:', dburl);
  try {
    // const useSrv = dburl.startsWith('mongodb+srv');
    // const opts = {
    //   serverSelectionTimeoutMS: 10000,
    //   tls: useSrv,
    //   tlsAllowInvalidCertificates: useSrv && process.env.SKIP_TLS_VERIFY === 'true',
    // };
    await mongoose.connect(dburl);
    console.log('✅ Connected to MongoDB successfully');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB connection failed:');
    console.error(err);
    // Print some helpful hints
    if (err.message && err.message.includes('ECONNREFUSED')) {
      console.error('Hint: Connection refused — likely MongoDB is not running on localhost:27017.');
    }
  }
})();
