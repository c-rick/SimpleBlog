'use strict'
const bodyParser = require('body-parser');
const { blogs, users, comments } = require('../collection.js');

const routes = (app) => {
    // 添加 body-parser 中间件就可以异步获取了
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json());



  // 设置跨域访问
  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  })

  app.options('*', function (req, res) {
    res.end()
  })

  app.get('/', (req, res, next) => {
    res.send('博客后台');
  })
  // login
  app.post('/login', (req, res, next) => {
    let sess = req.session;
    users.find({ 'name': req.body.name }, (findErr, findResult, findRes) => {
      if (findErr) {
        res.json({ 'status': 500, 'error': findErr })
        console.log(findErr)
      } else {
        if (findResult.length === 0 || (findResult[0].pawssword !== req.body.pawssword)) {
          res.json({ 'status': 400, 'message': '用户名或密码错误！' })
        } else {
          sess.userid = findResult[0]._id.toString() || null;
          res.json({ 'status': 200, 'message': '登录成功', 'result': findResult })
        }
        console.log(req.session)
      }
    })
  })

  // register
  app.post('/register', (req, res, next) => {
    users.create({ 'name': req.body.name, 'pawssword': req.body.pawssword }, (findErr, findResult, findRes) => {
      if (findErr) {
        res.json({ 'status': 500, 'error': findErr })
        console.log(findErr)
      } else {
        res.json({ 'status': 200, 'message': '注册成功' })
      }
    })
  })

  // checkuser
  app.post('/checkuser', (req, res, next) => {
    users.find({ 'name': req.body.name }, (findErr, findResult, findRes) => {
      if (findErr) {
        res.json({ 'status': 500, 'error': findErr })
        console.log(findErr)
      } else {
        findResult.length > 0 ? res.json({ 'status': 200 }) : res.json({ 'status': 400 });
      }
    })
  })

    // selectAll
  app.get('/blogLists', (req, res, next) => {
    blogs.find({ 'userid': req.query.id }, (findErr, findResult, findRes) => {
      if (findErr) {
        res.json({ 'status': 500, 'message': findErr });
        console.log(findErr)
      } else {
        res.json({ result: findResult, status: 200 });
      }
    })
  })

  // selectDetail
  app.get('/blogDetail', (req, res, next) => {
    blogs.find({ '_id': req.query._id }, (findErr, findResult, findRes) => {
      if (findErr) {
        res.json({ 'status': 500, 'message': findErr });
        console.log(findErr)
      } else {
        res.json({ result: findResult, status: 200 });
      }
    })
  })

  // add
  app.post('/addBlog', (req, res, next) => {
    let newBlog = {
      userid: req.body.userid,
      title: req.body.title,
      content: req.body.content,
      time: req.body.time
    };
    blogs.create(newBlog, (err) => {
      if (err) {
        res.json({ 'status': 500, 'error': err });
        console.log(err)
      } else {
        res.json({ message: '添加成功', 'status': 201 });
      }
    })
  })

  // update
  app.post('/updateBlog', (req, res, next) => {
    let query = { $set: {
      title: req.body.title,
      content: req.body.content,
      time: req.body.time
    } }
    blogs.update({ '_id': req.body._id }, query, (err) => {
      if (err) {
        res.json({ 'status': 500, 'error': err });
        console.log(err)
      } else {
        res.json({ message: '更新成功', 'status': 201 });
      }
    })})

  // delet
  app.post('/deletBlog', (req, res, next) => {
    blogs.remove({ '_id': req.body._id }, (err, result) => {
      if (err) {
        res.json({ 'status': 500, 'error': err });
      } else {
        res.json({ message: '删除成功', 'status': 204 });
      }
    })
  })

  // selectcomments
  app.get('/comments', (req, res, next) => {
    comments.find({ 'blogid': req.query.blogid }, (findErr, findResult, findRes) => {
      console.log(findResult)
      if (findErr) {
        res.json({ 'status': 500, 'error': findErr });
      } else {
        res.json({ result: findResult, 'status': 200 });
      }
    })
  })

  // addcomment
  app.post('/addComment', (req, res, next) => {
    let newComment = {
      blogid: req.body.blogid,
      user: req.body.user,
      comment: req.body.comment,
      time: req.body.time
    };
    comments.create(newComment, (err) => {
      if (err) {
        res.json({ 'status': 500, 'error': err });
        console.log(err)
      } else {
        res.json({ message: '评论成功', 'status': 201 });
      }
    })
  })
}
module.exports = routes;
