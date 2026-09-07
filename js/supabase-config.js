/*
  ONE-TIME SETUP
  1. Create a free project at https://supabase.com/dashboard.
  2. Open Project Settings > API.
  3. Paste the Project URL and anon/public key below. Never use the service-role key here.
  4. Run supabase/schema.sql in the Supabase SQL Editor.
  5. In Authentication > Users, create Valerie's user with achuval@yahoo.com.
*/
const SUPABASE_URL = "https://xhgtfxwgiapaousfpzqz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoZ3RmeHdnaWFwYW91c2ZwenF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg3NTk1MDIsImV4cCI6MjEwNDMzNTUwMn0.aKuRoJk9VnVRn2-aYrj3GEgQPp0XhaNSGPvLEWJzdP4";
const supabaseReady = !SUPABASE_URL.startsWith("PASTE_") && !SUPABASE_ANON_KEY.startsWith("PASTE_");
const storeDB = supabaseReady ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const DEMO_PRODUCTS = [
  {id:"demo-1",name:"Merlot Evening Dress",category:"Dresses",price:78,description:"A sculpted midi silhouette with an elegant side drape.",sizes:"S, M, L",material:"Stretch crepe",featured:true,image_url:"images/chic-by-val-hero.png",stripe_link:""},
  {id:"demo-2",name:"Sunday Brunch Set",category:"Sets",price:64,description:"An easy matching set with a polished, relaxed fit.",sizes:"S, M, L, XL",material:"Soft woven blend",featured:true,image_url:"images/chic-by-val-hero.png",stripe_link:""},
  {id:"demo-3",name:"Signature Satin Top",category:"Tops",price:42,description:"A softly draped top designed for day-to-night styling.",sizes:"S, M, L",material:"Satin finish",featured:true,image_url:"images/chic-by-val-hero.png",stripe_link:""}
];
