const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 4000;

// In-memory user database
const users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
];

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Route for user login (Client Credentials Grant)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if user exists and credentials are correct
  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate and send access token
  const accessToken = jwt.sign({ username }, 'secret_key');
  res.json({ access_token: accessToken });
});

// Route to access protected resource
app.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected resource!' });
});

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  jwt.verify(token, 'secret_key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

app.listen(port, () => {
  console.log(`OAuth2 server running on port ${port}`);
});
