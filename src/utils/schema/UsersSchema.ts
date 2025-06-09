import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  username: String,
  email: String,
  boxes: [],
})


const Users = mongoose.models.users || mongoose.model('users', UsersSchema)

export default Users