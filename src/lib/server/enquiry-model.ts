import "server-only";
import mongoose, { Schema } from "mongoose";
import { ENQUIRY_SOURCES, ENQUIRY_STATUSES } from "@/lib/cms/enquiries";

const enquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, trim: true },
    city: { type: String, trim: true },
    stage: { type: String, trim: true },
    programInterest: { type: String, trim: true },
    message: { type: String, trim: true },
    source: { type: String, enum: ENQUIRY_SOURCES, default: "other", index: true },
    pageUrl: { type: String, trim: true },
    status: { type: String, enum: ENQUIRY_STATUSES, default: "new", index: true },
    notes: { type: String, trim: true },
    // Salted hash of the submitter's IP, for rate limiting without storing the raw address.
    ipHash: { type: String, index: true, select: false },
    // Set once the notification email has gone out; also counts toward the daily cap.
    notifiedAt: { type: Date },
  },
  { timestamps: true },
);

export const Enquiry = mongoose.models.Enquiry || mongoose.model("Enquiry", enquirySchema);
