import { Types } from "mongoose";

export default function isValidId(id: Types.ObjectId) {
    return Types.ObjectId.isValid(id);
}

