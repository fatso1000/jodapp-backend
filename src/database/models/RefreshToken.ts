import { Types, Document, model, Schema } from "mongoose";
import IUser from "./User";

export const DOCUMENT_NAME = "RefreshToken";
export const COLLECTION_NAME = "refreshtoken";

export default interface IRefreshToken extends Document {
  user: IUser[];
  token: string;
  expiresAt: Date | number;
  createdAt: Date | number;
  createdByIp: string;
  revokedAt: Date | number;
  revokedByIp: string | undefined;
  replacedByToken: string | undefined;
  isActive?: Date | number;
  isExpired?: Date | number
}

const schema = new Schema({
  user: { type: [{ type: Schema.Types.ObjectId, ref: "User" }] },
  token: Schema.Types.String,
  expiresAt: Schema.Types.Date,
  createdAt: { type: Schema.Types.Date, default: Date.now },
  createdByIp: Schema.Types.String,
  revokedAt: Schema.Types.Date,
  revokedByIp: Schema.Types.String,
  replacedByToken: Schema.Types.String,
});

schema.virtual("isExpired").get(function (this: any) {
  return Date.now() >= this.expiresAt;
});

schema.virtual("isActive").get(function (this: any) {
  return !this.revoked && !this.isExpired;
});

export const RefreshToken = model<IRefreshToken>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
