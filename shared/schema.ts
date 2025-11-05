import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, date, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pettyCashEnvelopes = pgTable("petty_cash_envelopes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  upm: text("upm"),
  dept: text("dept"),
  name: text("name"),
  date: text("date"),
  audit: text("audit"),
  transNumber: text("trans_number"),
  position: text("position"),
  checkNo: text("check_no"),
  checkCashReceived: decimal("check_cash_received", { precision: 10, scale: 2 }),
  vendorNumber: text("vendor_number"),
  departmentTrackingNumber: text("department_tracking_number"),
  receivedBy: text("received_by"),
  voucherNumber: text("voucher_number"),
  appliedAgainstAdvance: decimal("applied_against_advance", { precision: 10, scale: 2 }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const lineItems = pgTable("line_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  envelopeId: varchar("envelope_id").notNull(),
  rowNumber: integer("row_number").notNull(),
  date: text("date"),
  toWhomPaid: text("to_whom_paid"),
  purposeDescription: text("purpose_description"),
  co: text("co"),
  loc: text("loc"),
  epi: text("epi"),
  detl: text("detl"),
  set: text("set"),
  ff1: text("ff1"),
  ff4: text("ff4"),
  netAmount: decimal("net_amount", { precision: 10, scale: 2 }),
  pstAmount: decimal("pst_amount", { precision: 10, scale: 2 }),
  gstAmount: decimal("gst_amount", { precision: 10, scale: 2 }),
  totalReceipt: decimal("total_receipt", { precision: 10, scale: 2 }),
});

export const insertEnvelopeSchema = createInsertSchema(pettyCashEnvelopes).omit({
  id: true,
  createdAt: true,
});

export const insertLineItemSchema = createInsertSchema(lineItems).omit({
  id: true,
});

export type InsertEnvelope = z.infer<typeof insertEnvelopeSchema>;
export type Envelope = typeof pettyCashEnvelopes.$inferSelect;
export type InsertLineItem = z.infer<typeof insertLineItemSchema>;
export type LineItem = typeof lineItems.$inferSelect;

export interface EnvelopeWithLineItems extends Envelope {
  lineItems: LineItem[];
}
