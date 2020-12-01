import { Schema, model, Document } from "mongoose";

export const DOCUMENT_NAME = "User";
export const COLLETION_NAME = "users";

export default interface IUser extends Document {
  email: string;
  password: string;
  title: string;
  firstName?: string;
  lastName?: string;
  role: string;
  verificationToken?: string | Date;
  isVerified: boolean;
  verified?: number;
  resetToken?: {
    token: string;
    expiresAt: Date;
  };
  passwordResetAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema({
  email: {
    type: Schema.Types.String,
    unique: true,
    trim: true,
    select: false,
    required: true,
  },
  password: { type: Schema.Types.String, select: false },
  title: { type: Schema.Types.String, required: true },
  firstName: Schema.Types.String,
  lastName: Schema.Types.String,
  role: { type: Schema.Types.String, required: true },
  verificationToken: Schema.Types.String,
  verified: Schema.Types.Date,
  resetToken: {
    token: Schema.Types.String,
    expires: Schema.Types.Date,
  },
  passwordResetAt: Schema.Types.Date,
  createdAt: { type: Schema.Types.Date, default: Date.now },
  updatedAt: Schema.Types.Date,
});

schema.virtual("isVerified").get(function () {
  // @ts-ignore
  return !!(this.verified || this.passwordResetAt);
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.password;
  },
});

export const UserModel = model<IUser>(DOCUMENT_NAME, schema, COLLETION_NAME);
