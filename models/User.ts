import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dni: { type: String },
  phone: { type: String },
  role: { type: String, default: 'USER' },
  address: {
    street: String,
    number: String,
    city: String,
    state: String,
    zip: String,
  },
  image: String,
  favorites: [{ type: String }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
