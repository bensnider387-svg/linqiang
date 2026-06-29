-- Create Payment Records View
-- This view provides payment records with user information for admin interface

CREATE OR REPLACE VIEW view_payment_records AS
SELECT 
    pr.id,
    pr.user_id,
    pr.amount,
    pr.vip_level_name,
    pr.payment_screenshot,
    pr.payment_time,
    pr.status,
    pr.review_time,
    pr.created_at,
    pr.updated_at,
    -- User information
    u.username,
    u.email,
    u.realname,
    u.phonenumber,
    u.avatar_url,
    u.membership_level as current_vip_level,
    u.trader_uuid
FROM payment_records pr
LEFT JOIN users u ON pr.user_id = u.id
WHERE u.isdel = false;

-- Add comments to the view
COMMENT ON VIEW view_payment_records IS 'Payment records with user information view';
COMMENT ON COLUMN view_payment_records.id IS 'Payment record ID (UUID)';
COMMENT ON COLUMN view_payment_records.user_id IS 'User ID (UUID)';
COMMENT ON COLUMN view_payment_records.amount IS 'Payment amount in USDT';
COMMENT ON COLUMN view_payment_records.vip_level_name IS 'VIP level name';
COMMENT ON COLUMN view_payment_records.payment_screenshot IS 'Payment screenshot file path or URL';
COMMENT ON COLUMN view_payment_records.payment_time IS 'Payment time';
COMMENT ON COLUMN view_payment_records.status IS 'Payment status: 待审核 (Pending), 审核失败 (Failed), 通过 (Approved)';
COMMENT ON COLUMN view_payment_records.review_time IS 'Review time';
COMMENT ON COLUMN view_payment_records.created_at IS 'Record creation time';
COMMENT ON COLUMN view_payment_records.updated_at IS 'Record update time';
COMMENT ON COLUMN view_payment_records.username IS 'User username';
COMMENT ON COLUMN view_payment_records.email IS 'User email';
COMMENT ON COLUMN view_payment_records.realname IS 'User real name';
COMMENT ON COLUMN view_payment_records.phonenumber IS 'User phone number';
COMMENT ON COLUMN view_payment_records.avatar_url IS 'User avatar URL';
COMMENT ON COLUMN view_payment_records.current_vip_level IS 'User current VIP level';
COMMENT ON COLUMN view_payment_records.trader_uuid IS 'Trader UUID';