import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: [true, 'name is required'],
  },
  Email: {
    type: String,
    required: [true, 'email is required'],
  },
  Password: {
    type: String,
    required: [true, 'password is required'],
  },
  Roles: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['User', 'Admin', 'Seller'],
    },
  },
});

export const userModel = mongoose.model('user', userSchema);
