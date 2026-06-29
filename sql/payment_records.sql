-- Create Payment Records Table
-- This table stores information about VIP membership payments

-- Enable the pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS payment_records (
    -- Primary key with UUID type
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User ID (Foreign key reference to users table - UUID type)
    user_id UUID NOT NULL,
    trader_uuid UUID NOT NULL,
    
    -- Payment amount in USDT
    amount DECIMAL(10, 2) NOT NULL,
    
    -- VIP level name (e.g., "黄金会员", "钻石会员", "至尊黑卡")
    vip_level_name VARCHAR(50) NOT NULL,
    
    -- Payment screenshot file path or URL
    payment_screenshot VARCHAR(255) NOT NULL,
    
    -- Payment time
    payment_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Payment status: 待审核 (Pending), 审核失败 (Failed), 通过 (Approved)
    status VARCHAR(20) NOT NULL DEFAULT '待审核',
    
    -- Review time (nullable, set when status changes from pending)
    review_time TIMESTAMP WITH TIME ZONE,
    
    -- Create time (automatically set when record is created)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Update time (automatically updated when record is modified)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Add foreign key constraint to users table (assuming users table exists with UUID id)
    CONSTRAINT fk_payment_records_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on user_id for faster queries by user
CREATE INDEX idx_payment_records_user_id ON payment_records(user_id);

-- Create index on status for faster filtering by payment status
CREATE INDEX idx_payment_records_status ON payment_records(status);

-- Create index on payment_time for chronological queries
CREATE INDEX idx_payment_records_payment_time ON payment_records(payment_time);

-- Create index on vip_level_name for filtering by VIP level
CREATE INDEX idx_payment_records_vip_level_name ON payment_records(vip_level_name);

-- Comments for each column
COMMENT ON TABLE payment_records IS 'VIP Membership Payment Records';
COMMENT ON COLUMN payment_records.id IS 'Primary key (UUID)';
COMMENT ON COLUMN payment_records.user_id IS 'User ID (UUID)';
COMMENT ON COLUMN payment_records.amount IS 'Payment amount in USDT';
COMMENT ON COLUMN payment_records.vip_level_name IS 'VIP level name';
COMMENT ON COLUMN payment_records.payment_screenshot IS 'Payment screenshot file path or URL';
COMMENT ON COLUMN payment_records.payment_time IS 'Payment time';
COMMENT ON COLUMN payment_records.status IS 'Payment status: 待审核 (Pending), 审核失败 (Failed), 通过 (Approved)';
COMMENT ON COLUMN payment_records.review_time IS 'Review time';
COMMENT ON COLUMN payment_records.created_at IS 'Record creation time';
COMMENT ON COLUMN payment_records.updated_at IS 'Record update time';

-- Sample insert statement for testing
/*
INSERT INTO payment_records (user_id, amount, vip_level_name, payment_screenshot, status) VALUES
('123e4567-e89b-12d3-a456-426614174000', 88.00, '黄金会员', 'https://example.com/screenshots/payment_123.jpg', '待审核'),
('123e4567-e89b-12d3-a456-426614174001', 188.00, '钻石会员', 'https://example.com/screenshots/payment_456.jpg', '通过'),
('123e4567-e89b-12d3-a456-426614174002', 288.00, '至尊黑卡', 'https://example.com/screenshots/payment_789.jpg', '审核失败');
*/
