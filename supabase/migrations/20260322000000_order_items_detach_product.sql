-- Allow products to be deleted/updated without breaking order history.
-- Order items already snapshot product details (name, image, price),
-- so the FK just gets set to NULL on delete.

ALTER TABLE order_items
  DROP CONSTRAINT order_items_product_id_fkey,
  ADD CONSTRAINT order_items_product_id_fkey
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE SET NULL ON UPDATE CASCADE;

-- Also detach variant FK if it exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'order_items_variant_id_fkey'
  ) THEN
    ALTER TABLE order_items
      DROP CONSTRAINT order_items_variant_id_fkey,
      ADD CONSTRAINT order_items_variant_id_fkey
        FOREIGN KEY (variant_id) REFERENCES product_variants(id)
        ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
