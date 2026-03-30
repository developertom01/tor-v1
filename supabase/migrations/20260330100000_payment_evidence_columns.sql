-- Add payment evidence and receipt URL columns to orders table
-- payment_proof_url: admin-uploaded proof of manual payment (stored in products bucket under orders/{id}/manual-payment-proof.*)
-- receipt_url: generated PDF receipt uploaded to products bucket under orders/{id}/receipt.pdf
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
  ADD COLUMN IF NOT EXISTS receipt_url TEXT;
