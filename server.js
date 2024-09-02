const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/scheduling', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
});

const scheduleSchema = new mongoose.Schema({
  employeeName: String,
  date: String,
  time: String,
  comment: String,
});

const User = mongoose.model('User', userSchema);
const Schedule = mongoose.model('Schedule', scheduleSchema);

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ message: 'Invalid username' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid password' });

  const token = jwt.sign({ id: user._id, role: user.role }, 'your-secret-key', { expiresIn: '1h' });
  res.json({ token });
});

app.post('/schedules', async (req, res) => {
  const { employees, date, time, comment } = req.body;
  for (const employee of employees) {
    const schedule = new Schedule({ employeeName: employee, date, time, comment });
    await schedule.save();
  }
  res.json({ message: 'Schedules saved successfully' });
});

app.listen(4000, () => {
  console.log('Server is running on port 4000');
});
