import bcrypt from 'bcrypt';
import User from '../metadata/User.js';

export const sessionStore = {};

export const createUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ success: true, data: newUser });

  } catch (error) {
    console.error("Error in Creating User: ", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
  
    try {

      const user = await User.findOne({ email });
  
      if (!user) {
        console.log("Login failed: User not found");
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      if (!user.password) {
        console.log("Login failed: User has no password stored");
        return res.status(500).json({ success: false, message: 'Server error' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log("Login failed: Incorrect password");
        return res.status(400).json({ success: false, message: 'Invalid credentials' });
      }
  
      const sessionId = generateSessionId();
      sessionStore[sessionId] = { userId: user._id, email: user.email };
      console.log(`User ${user.email} logged in successfully! Session ID: ${sessionId}`);
      res.status(200).json({ success: true, message: 'Login successful', sessionId });

    } catch (error) {
      console.error("Error in Logging In: ", error.message);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  

// Generate Session ID
function generateSessionId() {
  return Math.random().toString(36).substring(2, 15);
}


