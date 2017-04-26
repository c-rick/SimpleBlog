
const mongoose = require('mongoose');

// 连接mongodb
mongoose.connect('mongodb://localhost/test')

// 实例连接对象
const db = mongoose.connection;
db.on('error', console.error.bind(console, '连接错误:'))
db.once('open', (callback) => {
  console.log('MongoDB连接成功!!')
})

// 创建schema
const blogSchema = new mongoose.Schema({
  userid: String,
  title: String,
  content: String,
  time: String
})

const userSchema = new mongoose.Schema({
  name: String,
  pawssword: String
})

const commentSchema = new mongoose.Schema({
  blogid: String,
  user: String,
  comment: String,
  time: String
})

// 创建model
const blogModel = mongoose.model('blogs', blogSchema);
const userModel = mongoose.model('users', userSchema);
const commentModel = mongoose.model('comments', commentSchema);

module.exports = { blogs: blogModel, users: userModel, comments: commentModel };
