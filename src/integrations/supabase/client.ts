// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://apztxlbkyvfevneldisf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwenR4bGJreXZmZXZuZWxkaXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTEwMTksImV4cCI6MjA2MzU2NzAxOX0.4CPnUsDkpoJ8tvkD_6DVcYDUgRAaeISDm-LiGJ5hZR0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);