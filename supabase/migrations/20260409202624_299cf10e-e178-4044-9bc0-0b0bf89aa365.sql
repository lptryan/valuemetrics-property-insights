
CREATE TABLE vm_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address_input TEXT,
  formatted_address TEXT,
  lat NUMERIC,
  lng NUMERIC,
  attom_property_id TEXT,
  estimated_value INTEGER,
  confidence_low INTEGER,
  confidence_high INTEGER,
  confidence_score NUMERIC,
  comps_json JSONB,
  neighborhood_json JSONB,
  session_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE vm_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  estimate_id UUID REFERENCES vm_estimates(id),
  full_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  situation TEXT,
  ip_address INET,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  source_domain TEXT DEFAULT 'valuemetrics.io',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE avm_cache (
  address_hash TEXT PRIMARY KEY,
  attom_response JSONB,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_vm_leads_email ON vm_leads(email);
CREATE INDEX idx_vm_leads_created ON vm_leads(created_at);
CREATE INDEX idx_vm_estimates_created ON vm_estimates(created_at);
CREATE INDEX idx_avm_cache_expires ON avm_cache(expires_at);

ALTER TABLE vm_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE vm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE avm_cache ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts for estimates (public-facing tool)
CREATE POLICY "Anyone can insert estimates" ON vm_estimates FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read estimates" ON vm_estimates FOR SELECT USING (true);

-- Allow anonymous inserts for leads
CREATE POLICY "Anyone can insert leads" ON vm_leads FOR INSERT WITH CHECK (true);

-- Cache is managed by edge functions (service role), no public access needed
CREATE POLICY "Service role manages cache" ON avm_cache FOR ALL USING (false);
