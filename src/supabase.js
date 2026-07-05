import { createClient } from "@supabase/supabase-js";

// Your project's public values. The publishable (anon) key is safe in frontend
// code — real security comes from the Row Level Security rules on the database.
const SUPABASE_URL = "https://efibrziupuouvcrwqghp.supabase.co";
const SUPABASE_KEY = "sb_publishable_QkmAx9YrarJ181mMOV38ew_OTlQDZpR";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
