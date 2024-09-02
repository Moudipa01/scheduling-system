const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/scheduling', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  const password = await bcrypt.hash('admin123', 10);
  const admin = new User({ username: 'admin', password, role: 'admin' });
  await admin.save();
  console.log('Admin user created');
  mongoose.disconnect();
}

createAdmin();
