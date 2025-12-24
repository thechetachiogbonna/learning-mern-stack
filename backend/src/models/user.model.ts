import mongoose from "mongoose"
import { compareValue, hashValue } from "../utils/bcrypt.js"

interface UserDocument extends mongoose.Document {
  email: string,
  password: string,
  emailVerified: boolean,
  createdAt: Date,
  updatedAt: Date,
  comparePassword: (value: string) => Promise<boolean>,
  omitPassword: () => Pick<UserDocument, "_id" | "email" | "emailVerified" | "createdAt" | "updatedAt">
}

const userSchema = new mongoose.Schema<UserDocument>({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false
  }
}, { timestamps: true })

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await hashValue(this.password);
})

userSchema.methods.comparePassword = async function (value: string) {
  return await compareValue(value, this.password)
}

userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
}

const userModel = mongoose.model<UserDocument>("User", userSchema)

export default userModel