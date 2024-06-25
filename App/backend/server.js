const express = require('express');
// const session = require('express-session');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
// const crypto = require('crypto');
const app = express();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

const SECRET_KEY = 'your_secret_key';

app.listen(8082, () => {
    console.log('backend is running');
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
});


let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'syedfaizalhady@gmail.com',
    pass: 'axlb ybna ygqz inwf'
  }
});



//   ############################# Authentication ###################################


function generateVerificationToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Route to handle user signup
app.post('/Signup', (req, res) => {
  const { Username, Email, Password } = req.body;
  
  // if (!Email.endsWith('@putra.unisza.edu.my')) {
  //   return res.status(400).json({ Error: 'Only @putra.unisza.edu.my email addresses are allowed.' });
  // }

  const token = generateVerificationToken();
  const sql = `INSERT INTO login (Username, Email, Password, VerificationToken, Verified) VALUES (?, ?, ?, ?, ?)`;

  db.query(sql, [Username, Email, Password, token, false], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ Error: 'Database error', Message: err.message });
    }
    
    const mailOptions = {
      from: 'syedfaizalhady@gmail.com',
      to: Email,
      subject: 'Please verify your email address',
      html: `<h4>Thank you for registering at our site</h4>
             <p>Please verify your email by clicking on the link below:</p>
             <a href="http://yourdomain.com/verify-email?token=${token}">Verify Email</a>`
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({Status: 'Success', message: 'Verification email sent', id: result.insertId });
      }
    });
  });
});
// ###########################################################################################
// Route to verify the user email
app.get('/verify-email', (req, res) => {
  const { token } = req.query;
  const sql = `SELECT * FROM login WHERE VerificationToken = ?`;

  db.query(sql, [token], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ Error: 'Database error', Message: err.message });
    }

    if (results.length > 0) {
      const sqlUpdate = `UPDATE login SET Verified = 1 WHERE VerificationToken = ?`;
      db.query(sqlUpdate, [token], (err, updateResults) => {
        if (err) {
          console.error('Error updating user:', err);
          return res.status(500).json({ Error: 'Database error', Message: err.message });
        }
        res.json({ message: 'Email verified successfully' });
      });
    } else {
      res.status(404).json({ message: 'Invalid or expired verification token' });
    }
  });
});

// // ** Signup
// app.post('/Signup', (req, res) => {
//     const sql = "INSERT INTO login (Username, Email, Password) VALUES (?)";

//     const values = [
//       req.body.Username,
//         req.body.Email,
//         req.body.Password, // Assuming password is received as plaintext
        
//       ];
      
//       db.query(sql, [values], (err, result) => {
//         if (err) {
//           console.error('Error inserting data:', err);
//           return res.json({ Error: 'Fail' });
//         }
//         return res.json({ Status: 'Success' });
//       });
//     });

// ###########################################################################################

// ** Login
app.post('/login', (req, res) => {
  const { Username, Password } = req.body;
  const sql = 'SELECT * FROM login WHERE Username = ? AND Password = ?';
  
  db.query(sql, [Username, Password], (err, data) => {
    if (err) {
      console.error("Database query error:", err);
      return res.json({ Status: 'Error', Message: 'An error occurred' });
    }

    if (data.length > 0) {
      const user = data[0];
      const token = jwt.sign({ id: user.id, username: user.Username }, SECRET_KEY, { expiresIn: '1h' });
      return res.json({
        Status: 'Success',
        Message: 'Login successful',
        token
      });
    } else {
      return res.json({ Status: 'Failure', Message: 'Invalid username or password' });
    }
  });
});

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// ###########################################################################################
app.get('/user', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const sql = 'SELECT id, Username FROM login WHERE id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});

// ###########################################################################################  
    


app.put('/user/username', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { newUsername } = req.body;

  if (!newUsername) {
    console.error('New username is required');
    return res.status(400).json({ error: 'New username is required' });
  }

  const sql = 'UPDATE login SET Username = ? WHERE id = ?';

  db.query(sql, [newUsername, userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.affectedRows > 0) {
      res.json({ message: 'Username updated successfully' });
    } else {
      console.error('User not found');
      res.status(404).json({ error: 'User not found' });
    }
  });
});
// #########################################################################
app.post('/user/check-password', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { oldPassword } = req.body;

  if (!oldPassword) {
    console.error('Old password is required');
    return res.status(400).json({ error: 'Old password is required' });
  }

  const checkPasswordSql = 'SELECT Password FROM login WHERE id = ?';
  db.query(checkPasswordSql, [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length === 0 || results[0].Password !== oldPassword) {
      console.error('Old password is incorrect');
      return res.status(403).json({ valid: false });
    }

    res.json({ valid: true });
  });
});




//   ################################################################

app.put('/user/password', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    console.error('Old password and new password are required');
    return res.status(400).json({ error: 'Old password and new password are required' });
  }

  const checkPasswordSql = 'SELECT Password FROM login WHERE id = ?';
  db.query(checkPasswordSql, [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }

    if (results.length === 0 || results[0].Password !== oldPassword) {
      console.error('Old password is incorrect');
      return res.status(403).json({ error: 'Old password is incorrect' });
    }

    const updatePasswordSql = 'UPDATE login SET Password = ? WHERE id = ?';
    db.query(updatePasswordSql, [newPassword, userId], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Database query error' });
      }

      res.json({ message: 'Password updated successfully' });
    });
  });
});

//   ################################################################
app.put('/user/upload-profile-picture', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const profilePictureUri = req.body.profilePicture;

  if (!profilePictureUri) {
    console.log('No image URI provided');
    return res.status(400).json({ error: 'No image URI provided' });
  }

  console.log('Received profile picture URI:', profilePictureUri);

  const sql = 'UPDATE login SET profile_picture = ? WHERE id = ?';
  db.query(sql, [profilePictureUri, userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Failed to update profile picture' });
    }

    console.log('Profile picture updated successfully', results);
    res.json({ message: 'Profile picture updated successfully' });
  });
});




//   ################################################################

// server.js or wherever you handle your backend routes
app.get('/user/profile-picture', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const sql = 'SELECT profile_picture FROM login WHERE id = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Database query error' });
    }
    if (results.length > 0) {
      res.json({ profile_picture: results[0].profile_picture });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  });
});




//   ################################################################

app.post('/like', authenticateJWT, async (req, res) => {
  const { itemId } = req.body;
  const username = req.user.username; // Ensure your JWT payload includes the username

  try {
    const query = 'INSERT INTO likes (Username, item_id) VALUES (?, ?)';
    await db.query(query, [username, itemId]);
    res.status(200).send({ message: 'Item liked successfully' });
  } catch (error) {
    console.error('Error liking item:', error);
    res.status(500).send({ message: 'Failed to like item' });
  }
});

app.get('/likes', authenticateJWT, (req, res) => {
  const username = req.user.username;

  const query = 'SELECT item_id FROM likes WHERE Username = ?';

  db.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error fetching liked items:', error);
      return res.status(500).send({ message: 'Failed to fetch liked items' });
    }

    // console.log('Database query results:', results);

    // Extract item IDs from the results
    const likedItemIds = results.map(row => row.item_id);

    // console.log('Liked item IDs:', likedItemIds);

    res.status(200).json(likedItemIds);
  });
});


// Endpoint to delete a liked item
app.delete('/like-delete/:itemId', authenticateJWT, async (req, res) => {
  console.log('Received request to delete item:', req.params.itemId);
  const { itemId } = req.params;
  const username = req.user.username;

  try {
    const query = 'DELETE FROM likes WHERE Username = ? AND item_id = ?';
    await db.query(query, [username, itemId]);
    res.status(200).send({ message: 'Liked item deleted successfully' });
  } catch (error) {
    console.error('Error deleting liked item:', error);
    res.status(500).send({ message: 'Failed to delete liked item' });
  }
});

// ###########################################################################

app.post('/cart/add', authenticateJWT, async (req, res) => {
  const { itemId, quantity } = req.body;
  const username = req.user.username; // Ensure your JWT payload includes the username

  try {
    const query = 'INSERT INTO cart (Username, item_id, Qty) VALUES (?, ?, ?)';
    await db.query(query, [username, itemId, quantity]);
    res.status(200).send({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).send({ message: 'Failed to add item to cart' });
  }
});



app.delete('/cart/remove/:itemId', authenticateJWT, async (req, res) => {
  const { itemId } = req.params;
  const username = req.user.username;

  try {
    const query = 'DELETE FROM cart WHERE Username = ? AND item_id = ?';
    await db.query(query, [username, itemId]);
    res.status(200).send({ message: 'Item removed from cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).send({ message: 'Failed to remove item from cart' });
  }
});

app.get('/cart', authenticateJWT, (req, res) => {
  const username = req.user.username;

  const query = 'SELECT item_id, Qty FROM cart WHERE Username = ?';

  db.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error fetching cart items:', error);
      return res.status(500).send({ message: 'Failed to fetch cart items' });
    }

    res.status(200).json(results);
  });
});

// ###################################################################################

app.post('/complete-purchase', authenticateJWT, (req, res) => {
  const username = req.user.username;
  const { items } = req.body;

  console.log('Transferring items to purchase table with prices:', items);

  // Get the current maximum ID in the purchase table
  const maxIdQuery = 'SELECT MAX(id) AS maxId FROM purchase';
  db.query(maxIdQuery, (maxIdError, results) => {
    if (maxIdError) {
      console.error('Error fetching maximum ID from purchase table:', maxIdError);
      return res.status(500).send({ message: 'Failed to complete purchase' });
    }

    // Calculate the new batch ID
    const newBatchId = (results[0].maxId || 0) + 1;

    // Get the current date and time
    const purchaseDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Prepare the values for insertion
    const purchaseValues = items.map(item => [newBatchId, username, item.item_id, item.Qty, item.price, purchaseDate]);

    const insertQuery = 'INSERT INTO purchase (id, Username, item_id, Qty, price, purchase_date) VALUES ?';
    db.query(insertQuery, [purchaseValues], (insertError) => {
      if (insertError) {
        console.error('Error transferring items to purchase table:', insertError);
        return res.status(500).send({ message: 'Failed to complete purchase' });
      }

      console.log('Items successfully transferred to purchase table with batch ID:', newBatchId);

      const deleteQuery = 'DELETE FROM cart WHERE Username = ?';
      db.query(deleteQuery, [username], (deleteError) => {
        if (deleteError) {
          console.error('Error deleting items from cart:', deleteError);
          return res.status(500).send({ message: 'Failed to delete items from cart' });
        }

        console.log('Items successfully deleted from cart');
        res.status(200).send({ message: 'Purchase completed successfully' });
      });
    });
  });
});

app.get('/purchases', authenticateJWT, (req, res) => {
  const username = req.user.username;

  const query = 'SELECT DISTINCT id, purchase_date FROM purchase WHERE Username = ?';
  db.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error fetching purchase IDs:', error);
      return res.status(500).send({ message: 'Failed to fetch purchase IDs' });
    }

    res.status(200).json(results);
  });
});

app.get('/purchase-details/:purchaseId', authenticateJWT, (req, res) => {
  const { purchaseId } = req.params;
  const username = req.user.username;

  const query = 'SELECT item_id, Qty, price, purchase_date FROM purchase WHERE Username = ? AND id = ?';
  db.query(query, [username, purchaseId], (error, results) => {
    if (error) {
      console.error('Error fetching purchase details:', error);
      return res.status(500).send({ message: 'Failed to fetch purchase details' });
    }

    res.status(200).json(results);
  });
});

app.get('/purchases/:purchaseId', authenticateJWT, (req, res) => {
  const username = req.user.username;
  const purchaseId = req.params.purchaseId;

  const query = 'SELECT item_id, Qty FROM purchase WHERE Username = ? AND id = ?';
  db.query(query, [username, purchaseId], (error, results) => {
    if (error) {
      console.error('Error fetching purchase details:', error);
      return res.status(500).send({ message: 'Failed to fetch purchase details' });
    }

    res.status(200).json(results);
  });
});

// #########################################################

app.post('/update-recommend', (req, res) => {
  const { category, count } = req.body;

  if (!category || count == null) {
    return res.status(400).send('Category and count are required');
  }

  // Update the recommend table
  const query = `
    INSERT INTO recommend (id, ${category})
    VALUES (1, ${count})
    ON DUPLICATE KEY UPDATE ${category} = ${count};
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error updating recommend table:', err);
      return res.status(500).send('Server error');
    }
    res.send('Recommendation updated successfully');
  });
});