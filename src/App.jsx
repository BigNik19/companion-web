import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Home, ListChecks, Sparkles, CalendarDays, Trophy, Plus, X, Check,
  Flame, Droplet, BookOpen, Dumbbell, Brain, Footprints, Moon, Apple,
  PenLine, Sun, Coffee, Ban, Wind, Heart, Trash2, Snowflake, LogOut,
  Shield, Crown, ChevronLeft, ChevronRight, Pencil, Users, Medal,
  Search, Gift, Lock, Shirt, Wand2, UserPlus, UserCheck, Clock, Globe, Bell, RefreshCw
} from "lucide-react";
import { supabase } from "./supabase";

/* ============================ CONFIG ============================ */
const ICONS = { Droplet, BookOpen, Dumbbell, Brain, Footprints, Moon, Apple, PenLine, Sun, Coffee, Ban, Wind, Heart, Sparkles, Flame };
const HABIT_COLORS = ["#1DB954", "#F5C36B", "#F98A8A", "#A9B4FF", "#79D0E8", "#C9A7F0", "#F0B27A", "#8FE0A6"];
const ACCENTS = ["#1DB954", "#F5C36B", "#F98A8A", "#A9B4FF", "#79D0E8", "#C9A7F0"];
const DURATIONS = [null, 5, 10, 15, 20, 30, 45, 60];
const PRESETS = [
  { name: "Drink water", icon: "Droplet", color: "#79D0E8", duration: null },
  { name: "Read", icon: "BookOpen", color: "#F5C36B", duration: 10 },
  { name: "Move your body", icon: "Dumbbell", color: "#F98A8A", duration: 30 },
  { name: "Meditate", icon: "Brain", color: "#C9A7F0", duration: 10 },
  { name: "Take a walk", icon: "Footprints", color: "#1DB954", duration: 20 },
  { name: "Sleep by 11", icon: "Moon", color: "#A9B4FF", duration: null },
  { name: "Eat something green", icon: "Apple", color: "#8FE0A6", duration: null },
  { name: "Journal", icon: "PenLine", color: "#F0B27A", duration: 15 },
  { name: "Morning sunlight", icon: "Sun", color: "#F5C36B", duration: 15 },
  { name: "No phone in bed", icon: "Ban", color: "#9AA3AF", duration: null },
];
const SPECIES = {
  florn:  { name: "Florn",  feature: "leaf",    pal: { main: "#4FBE6E", light: "#8FE0A2", dark: "#26663A", belly: "#DCF3E2", bellyL: "#EFFBF2", accent: "#F5C36B", line: "#173F24", iris: "#1E7A3C" } },
  nimbo:  { name: "Nimbo",  feature: "cloud",   pal: { main: "#7E97F5", light: "#B7C6FF", dark: "#3C4DB0", belly: "#E4EAFF", bellyL: "#F3F6FF", accent: "#FFFFFF", line: "#242F82", iris: "#3C4DB0" } },
  cinder: { name: "Cinder", feature: "flame",   pal: { main: "#FF8A44", light: "#FFB585", dark: "#B83C0F", belly: "#FFDCC6", bellyL: "#FFF1E7", accent: "#FFD23F", line: "#7A2A0A", iris: "#B83C0F" } },
  mica:   { name: "Mica",   feature: "crystal", pal: { main: "#9098BE", light: "#C0C6E0", dark: "#454C78", belly: "#DFE3F2", bellyL: "#F0F1FA", accent: "#7EE8E8", line: "#2A3054", iris: "#454C78" } },
  bonsai: { name: "Bonsai", feature: "plant", plant: true, pal: { main: "#5BB86A", light: "#8FDD98", dark: "#2E7A3C", belly: "#DCF3E2", bellyL: "#EFFBF2", accent: "#F7A8C0", line: "#1B4A24", iris: "#2E7A3C", trunk: "#7A4B27", trunkD: "#553318" } },
  vesper: { name: "Vesper", feature: "star",    pal: { main: "#A487FF", light: "#CDB9FF", dark: "#5A38B0", belly: "#EADFFF", bellyL: "#F6F1FF", accent: "#FFE07A", line: "#391E78", iris: "#5A38B0" }, rare: true },
};
const SKIN_PAL = {
  gold:   { main: "#E0BC5A", light: "#F5E29C", dark: "#9A7620", belly: "#FBF2D4", bellyL: "#FFFCEE", accent: "#FFFFFF", line: "#5E4611", iris: "#9A7620" },
  shadow: { main: "#474C60", light: "#727892", dark: "#222634", belly: "#33384A", bellyL: "#424858", accent: "#7E97F5", line: "#12141C", iris: "#7E97F5" },
  aqua:   { main: "#3FC6C2", light: "#8CE6E2", dark: "#1B7C78", belly: "#D7F5F3", bellyL: "#ECFCFB", accent: "#FFD23F", line: "#0C4E4B", iris: "#1B7C78" },
};
const SKIN_IDS = ["gold", "shadow", "aqua"];
const SKIN_NAME = { gold: "Gilded", shadow: "Umbral", aqua: "Tidal" };
// Prestige-only skins — unlocked by reaching a prestige level on that pet.
const PRESTIGE_SKINS = [
  { id: "molten", name: "Molten", prestige: 1 },
  { id: "frost", name: "Frostbound", prestige: 2 },
  { id: "void", name: "Voidtouched", prestige: 3 },
  { id: "prism", name: "Prismatic", prestige: 5 },
];
const PRESTIGE_SKIN_PAL = {
  molten: { main: "#E8632B", light: "#FFB067", dark: "#7A1E06", belly: "#FFD1A8", bellyL: "#FFEAD6", accent: "#FFE066", line: "#4A1300", iris: "#7A1E06", trunk: "#6E2A12", trunkD: "#3E1608" },
  frost:  { main: "#7FD8F0", light: "#C4F0FF", dark: "#2E7CA0", belly: "#E2F7FF", bellyL: "#F3FCFF", accent: "#FFFFFF", line: "#123A50", iris: "#2E7CA0", trunk: "#5E7A88", trunkD: "#37474F" },
  void:   { main: "#6E4BC0", light: "#A98BEA", dark: "#331A66", belly: "#D8C8F5", bellyL: "#EDE4FF", accent: "#FF7AD0", line: "#1C0E3A", iris: "#331A66", trunk: "#3A2A5A", trunkD: "#221636" },
  prism:  { main: "#4FD0B0", light: "#B7E9FF", dark: "#5A38B0", belly: "#EAF7FF", bellyL: "#F6FBFF", accent: "#FF9ED8", line: "#243A6E", iris: "#5A38B0", trunk: "#6A5A8A", trunkD: "#3E3358" },
};
const ALL_SKIN_PAL = { ...SKIN_PAL, ...PRESTIGE_SKIN_PAL };
const skinName = (id) => SKIN_NAME[id] || (PRESTIGE_SKINS.find((s) => s.id === id) || {}).name || id;
// Accessories: xp = unlock by that pet's total XP; streak = unlock by best streak; wheel = won from spin.
const ACCESSORIES = [
  { id: "specs", name: "Specs", xp: 40 }, { id: "cap", name: "Cap", xp: 120 }, { id: "scarf", name: "Scarf", xp: 240 },
  { id: "phones", name: "Headphones", wheel: true }, { id: "crown", name: "Crown", wheel: true }, { id: "halo", name: "Halo", wheel: true },
  { id: "wreath", name: "Ember Wreath", streak: 7 }, { id: "sash", name: "Champion Sash", streak: 30 },
];
const POSES = [{ id: "idle", name: "Idle", xp: 0 }, { id: "wave", name: "Wave", xp: 80 }, { id: "sit", name: "Sit", xp: 180 }, { id: "fire", name: "On Fire", streak: 7 }];
const TIERS = ["Hatchling", "Youngling", "Adult", "Elder", "Mythic"];
const XP_PER_TIER = 60, GOAL = 0.6, FREEZE_CAP = 2, MAX_STAGE = 4;
const MILESTONES = [3, 7, 14, 30, 50, 100, 365];
const DEV = { email: "dev@companion.app", pass: "dev" };
const OWNER_EMAIL = "nikolaithomas100@gmail.com";
const prestigeMult = (p) => 1 + 0.5 * (p || 0); // xp gain multiplier per prestige level
const hasPrestige = (a) => (a.pets || []).some((p) => (p.prestige || 0) > 0);
const maxPrestige = (a) => (a.pets || []).reduce((m, p) => Math.max(m, p.prestige || 0), 0);
const speciesMastered = (a, sp) => (a.pets || []).some((p) => p.species === sp && ((p.stage || 0) >= MAX_STAGE || (p.prestige || 0) > 0));
// Titles: owned when check() is true. Locked titles show `how` (a few words on obtaining).
const TITLES = [
  { id: "newcomer", name: "Newcomer", how: "Default", check: () => true },
  { id: "keeper", name: "Streak Keeper", how: "Reach a 7-day streak", check: (a) => (a.best || 0) >= 7 },
  { id: "unbreakable", name: "Unbreakable", how: "Reach a 30-day streak", check: (a) => (a.best || 0) >= 30 },
  { id: "collector", name: "Collector", how: "Own 3 companions", check: (a) => (a.pets || []).length >= 3 },
  { id: "prestiged", name: "Prestiged", how: "Prestige a pet once", check: (a) => hasPrestige(a) },
  { id: "ascended", name: "Ascended", how: "Reach prestige 3 on a pet", check: (a) => maxPrestige(a) >= 3 },
  { id: "eternal", name: "Eternal", how: "Prestige every pet you own", check: (a) => (a.pets || []).length > 0 && (a.pets || []).every((p) => (p.prestige || 0) > 0) },
  { id: "m_florn", name: "Florn Master", how: "Reach Mythic with a Florn", check: (a) => speciesMastered(a, "florn") },
  { id: "m_nimbo", name: "Nimbo Master", how: "Reach Mythic with a Nimbo", check: (a) => speciesMastered(a, "nimbo") },
  { id: "m_cinder", name: "Cinder Master", how: "Reach Mythic with a Cinder", check: (a) => speciesMastered(a, "cinder") },
  { id: "m_mica", name: "Mica Master", how: "Reach Mythic with a Mica", check: (a) => speciesMastered(a, "mica") },
  { id: "m_bonsai", name: "Bonsai Master", how: "Reach Mythic with a Bonsai", check: (a) => speciesMastered(a, "bonsai") },
  { id: "creator", name: "The Creator", how: "Exclusive to the maker", check: (a) => (a.email || "").toLowerCase() === OWNER_EMAIL },
];
const ownedTitles = (a) => TITLES.filter((t) => t.check(a));

/* ============================ DATES ============================ */
const pad = (n) => String(n).padStart(2, "0");
const keyOf = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayKey = () => keyOf(new Date());
const parseKey = (k) => { const [y, m, dd] = k.split("-").map(Number); return new Date(y, m - 1, dd); };
const diffDays = (a, b) => Math.round((parseKey(b) - parseKey(a)) / 86400000);
const relTime = (ts) => { const s = Math.floor((Date.now() - ts) / 1000); if (s < 60) return "just now"; if (s < 3600) return `${Math.floor(s / 60)}m ago`; if (s < 86400) return `${Math.floor(s / 3600)}h ago`; return `${Math.floor(s / 86400)}d ago`; };
const sinceDate = (ts) => new Date(ts).toLocaleDateString("default", { month: "short", year: "numeric" });

/* ============================ SUPABASE DATA LAYER ============================ */
/* One row per user in the `accounts` table. The whole account (pets, habits,
   streak, friends...) lives in the `data` jsonb column; username/total_xp/streak
   are mirrored to real columns for lookups + leaderboard. RLS lets a user READ
   everyone but only WRITE their own row. */
async function loadAllAccounts() {
  const { data, error } = await supabase.from("accounts").select("*");
  if (error || !data) return {};
  const map = {};
  data.forEach((r) => { map[r.username] = { ...r.data, id: r.id, username: r.username }; });
  return map;
}
function saveAccountRow(a) {
  if (!a || !a.id) return;
  const { id, username, ...rest } = a;
  const tp = topPet(a);
  return supabase.from("accounts").update({
    data: rest,
    total_xp: tp ? tp.totalXp : 0,
    streak: a.streak || 0,
    best: a.best || 0,
    last_active: new Date().toISOString(),
  }).eq("id", id);
}

/* ============================ HELPERS ============================ */
const emailValid = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
const allPetNames = (users) => { const s = new Set(); Object.values(users).forEach((u) => (u.pets || []).forEach((p) => s.add(p.name.toLowerCase()))); return s; };
const uniquePetName = (base, taken) => { let n = base, i = 2; while (taken.has(n.toLowerCase())) n = `${base} ${i++}`; return n; };
function newPet(species, name) { return { id: "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8), species, name, stage: 0, xp: 0, totalXp: 0, prestige: 0, vitality: 50, skin: null, accessories: [], pose: "idle" }; }
function newAccountData(email, species, petName) {
  const pet = newPet(species, petName);
  return {
    email,
    habits: PRESETS.slice(0, 4).map((p, i) => ({ id: i + 1, ...p, done: false })),
    streak: 0, best: 0, freezes: 0, history: {}, lastCompletedDate: null,
    spinTokens: 0, ownedAcc: [], ownedSkins: {}, pets: [pet], activePet: pet.id,
    follows: [], hidden: [], profile: { bio: "", accent: "#1DB954" },
    outbox: [], seen: {},
    createdAt: Date.now(),
  };
}
const paletteFor = (species, skin) => { const base = SPECIES[species].pal; return skin && ALL_SKIN_PAL[skin] ? { ...base, ...ALL_SKIN_PAL[skin] } : base; };
const topPet = (u) => u.pets.reduce((a, b) => (b.totalXp > a.totalXp ? b : a), u.pets[0]);

// Chat cleanup: drop messages 24h after the recipient has seen them, and a 7-day hard cap.
function pruneOutbox(acc, map) {
  if (!acc.outbox || !acc.outbox.length) return false;
  const now = Date.now(), before = acc.outbox.length;
  acc.outbox = acc.outbox.filter((m) => {
    if (now - m.sentAt > 7 * 86400000) return false;
    const recip = map[m.to];
    const seenAt = recip && recip.seen && recip.seen[m.id];
    if (seenAt && now - seenAt > 24 * 3600000) return false;
    return true;
  });
  return acc.outbox.length !== before;
}

/* ====================== CREATURE (cell-shaded, Digimon-styled) ====================== */
function accessoryDraw(id, P) {
  switch (id) {
    case "specs": return <g key="specs"><rect x="-32" y="-13" width="22" height="17" rx="7" fill="#141414" opacity=".2" stroke={P.line} strokeWidth="3" /><rect x="10" y="-13" width="22" height="17" rx="7" fill="#141414" opacity=".2" stroke={P.line} strokeWidth="3" /><path d="M-10,-5 h20" stroke={P.line} strokeWidth="3" /></g>;
    case "cap": return <g key="cap"><path d="M-44,-56 a44 36 0 0 1 88 0 z" fill={P.dark} /><path d="M-2,-56 a44 36 0 0 1 46 0 z" fill={P.main} /><path d="M-44,-56 a44 36 0 0 1 88 0" fill="none" stroke={P.line} strokeWidth="2.5" /><circle cx="0" cy="-90" r="7" fill={P.accent} stroke={P.line} strokeWidth="2" /><path d="M30,-56 q36,3 32,20 q-6,-11 -32,-9 z" fill={P.dark} stroke={P.line} strokeWidth="2" /></g>;
    case "scarf": return <g key="scarf"><path d="M-46,44 q46,26 92,0 l0,15 q-46,24 -92,0 z" fill={P.accent} stroke={P.line} strokeWidth="2.5" /><path d="M22,53 l15,42 l14,-6 l-13,-40 z" fill={P.accent} stroke={P.line} strokeWidth="2.5" /></g>;
    case "phones": return <g key="phones"><path d="M-58,-6 a58 58 0 0 1 116 0" fill="none" stroke={P.line} strokeWidth="7" /><rect x="-70" y="-8" width="22" height="34" rx="9" fill={P.dark} stroke={P.line} strokeWidth="2.5" /><rect x="48" y="-8" width="22" height="34" rx="9" fill={P.dark} stroke={P.line} strokeWidth="2.5" /><circle cx="-59" cy="9" r="5" fill="#1DB954" /><circle cx="59" cy="9" r="5" fill="#1DB954" /></g>;
    case "crown": return <g key="crown"><path d="M-34,-56 l8,-32 l14,22 l12,-32 l12,32 l14,-22 l8,32 z" fill={P.accent} stroke={P.line} strokeWidth="2.5" strokeLinejoin="round" /><circle cx="-14" cy="-72" r="4" fill="#F98A8A" /><circle cx="14" cy="-72" r="4" fill="#79D0E8" /><circle cx="0" cy="-84" r="4.5" fill="#F98A8A" /></g>;
    case "halo": return <g key="halo"><ellipse cx="0" cy="-80" rx="30" ry="9" fill="none" stroke="#FFE07A" strokeWidth="6" /><ellipse cx="0" cy="-80" rx="30" ry="9" fill="none" stroke="#fff" strokeWidth="2" opacity=".6" /></g>;
    default: return null;
  }
}
function features(f, st, P, layer) {
  const mid = st >= 1, big = st >= 3;
  if (f === "leaf") {
    if (layer === "front") return <g><path d="M-3,-56 q-16,-20 3,-38 q19,18 3,38 z" fill={P.main} stroke={P.line} strokeWidth="2.5" />{mid && <path d="M-24,-50 q-22,-12 -20,-34 q24,10 20,34 z" fill={P.dark} stroke={P.line} strokeWidth="2.5" />}{big && <path d="M20,-50 q22,-12 20,-34 q-24,10 -20,34 z" fill={P.dark} stroke={P.line} strokeWidth="2.5" />}</g>;
    if (layer === "back" && st >= 2) return <path d="M58,42 q40,4 46,-24 q-34,-2 -46,24 z" fill={P.dark} stroke={P.line} strokeWidth="2.5" />;
  }
  if (f === "cloud") {
    if (layer === "front") return <g><path d="M-30,-52 l-8,-30 l20,18 z" fill={P.light} stroke={P.line} strokeWidth="2.5" strokeLinejoin="round" /><path d="M30,-52 l8,-30 l-20,18 z" fill={P.light} stroke={P.line} strokeWidth="2.5" strokeLinejoin="round" />{big && <circle cx="0" cy="-70" r="10" fill={P.light} stroke={P.line} strokeWidth="2.5" />}</g>;
    if (layer === "back" && st >= 3) return <g><path d="M-58,2 C-104,-30 -110,22 -66,34 C-84,10 -74,-2 -58,2 Z" fill={P.light} stroke={P.line} strokeWidth="2.5" /><path d="M58,2 C104,-30 110,22 66,34 C84,10 74,-2 58,2 Z" fill={P.light} stroke={P.line} strokeWidth="2.5" /></g>;
  }
  if (f === "flame") {
    if (layer === "front") return <g><path d="M-28,-50 l-8,-34 l20,20 z" fill={P.dark} stroke={P.line} strokeWidth="2.5" strokeLinejoin="round" /><path d="M28,-50 l8,-34 l-20,20 z" fill={P.dark} stroke={P.line} strokeWidth="2.5" strokeLinejoin="round" />{big && <path d="M0,-56 C-10,-84 10,-84 0,-108 C12,-84 10,-68 0,-56 Z" fill={P.accent} stroke={P.line} strokeWidth="1.5" />}</g>;
    if (layer === "back" && st >= 2) return <path d="M52,46 C94,36 88,-8 112,-4 C98,32 100,56 60,62 Z" fill={P.accent} stroke={P.line} strokeWidth="2.5" />;
  }
  if (f === "crystal") {
    if (layer === "front") return <g><path d="M0,-56 l16,-40 l16,36 z" fill={P.accent} stroke={P.line} strokeWidth="2.5" strokeLinejoin="round" />{mid && <path d="M-30,-50 l-8,-32 l20,26 z" fill={P.light} stroke={P.line} strokeWidth="2.5" strokeLinejoin="round" />}{big && <path d="M26,-50 l8,-32 l-20,26 z" fill={P.light} stroke={P.line} strokeWidth="2.5" strokeLinejoin="round" />}</g>;
    if (layer === "back" && st >= 3) return <g><path d="M-62,18 l-26,-16 l8,30 z" fill={P.light} stroke={P.line} strokeWidth="2.5" /><path d="M62,18 l26,-16 l-8,30 z" fill={P.light} stroke={P.line} strokeWidth="2.5" /></g>;
  }
  if (f === "star") {
    const star = (x, y, r, i) => <path key={i} d={`M${x},${y - r} l${r * 0.29},${r * 0.6} l${r * 0.66},${r * 0.09} l${-r * 0.48},${r * 0.46} l${r * 0.19},${r * 0.66} l${-r * 0.66},${-r * 0.35} l${-r * 0.66},${r * 0.35} l${r * 0.19},${-r * 0.66} l${-r * 0.48},${-r * 0.46} l${r * 0.66},${-r * 0.09} z`} fill={P.accent} stroke={P.line} strokeWidth="1.5" />;
    if (layer === "front") { const pts = [[0, -74, 12], [-30, -58, 8], [30, -58, 8]].slice(0, big ? 3 : mid ? 2 : 1); return <g>{pts.map((p, i) => star(p[0], p[1], p[2], i))}</g>; }
    if (layer === "back" && st >= 2) return <circle r="94" fill="none" stroke={P.accent} strokeWidth="1.5" strokeDasharray="2 13" opacity=".55" />;
  }
  return null;
}
/* Bonsai — grows from a seedling to a full tree across the 5 tiers */
function PlantCreature({ P, st, mood, size = 220, pose = "idle", accessories = [] }) {
  const filter = mood === "sick" ? "saturate(.35) brightness(.85) sepia(.3)" : mood === "tired" ? "saturate(.7)" : "none";
  const trunk = P.trunk || "#7A4B27", trunkD = P.trunkD || "#553318";
  const leaf = P.main, leafD = P.dark, leafL = P.light, line = P.line;
  const eyeY = st <= 1 ? 34 : 20;
  const face = () => (
    <g>
      {mood === "sick"
        ? <g stroke="#20321f" strokeWidth="3" strokeLinecap="round"><path d={`M-16,${eyeY - 3} l8,7 M-8,${eyeY - 3} l-8,7`} /><path d={`M8,${eyeY - 3} l8,7 M16,${eyeY - 3} l-8,7`} /></g>
        : <g><circle cx="-11" cy={eyeY} r="3.4" fill="#20321f" /><circle cx="11" cy={eyeY} r="3.4" fill="#20321f" /></g>}
      {mood === "radiant" ? <path d={`M-8,${eyeY + 9} q8,8 16,0`} fill="none" stroke="#20321f" strokeWidth="3" strokeLinecap="round" />
        : mood === "sick" ? <path d={`M-7,${eyeY + 11} q7,-6 14,0`} fill="none" stroke="#20321f" strokeWidth="3" strokeLinecap="round" />
        : <path d={`M-6,${eyeY + 9} q6,5 12,0`} fill="none" stroke="#20321f" strokeWidth="3" strokeLinecap="round" />}
    </g>
  );
  const pot = (w) => (
    <g>
      <path d={`M${-w},96 L${w},96 L${w - 8},128 L${-w + 8},128 Z`} fill="#B5654D" stroke={line} strokeWidth="3" strokeLinejoin="round" />
      <rect x={-w - 4} y="88" width={(w + 4) * 2} height="12" rx="4" fill="#C9765C" stroke={line} strokeWidth="3" />
      <ellipse cx="0" cy="92" rx={w - 4} ry="5" fill="#3A2A1E" />
    </g>
  );
  const canopy = (cx, cy, r) => (
    <g><circle cx={cx} cy={cy} r={r} fill={leaf} stroke={line} strokeWidth="3" /><circle cx={cx - r * 0.35} cy={cy - r * 0.35} r={r * 0.5} fill={leafL} opacity=".8" /><circle cx={cx + r * 0.4} cy={cy + r * 0.2} r={r * 0.4} fill={leafD} opacity=".6" /></g>
  );
  const body = () => {
    if (st === 0) return <g>{pot(26)}<path d="M0,92 C-2,78 -3,66 0,58" fill="none" stroke={trunk} strokeWidth="7" strokeLinecap="round" /><path d="M0,64 q-20,-6 -26,-22 q22,-2 26,16 z" fill={leaf} stroke={line} strokeWidth="2.5" /><path d="M0,60 q20,-8 26,-24 q-22,0 -26,18 z" fill={leafD} stroke={line} strokeWidth="2.5" /></g>;
    if (st === 1) return <g>{pot(30)}<path d="M0,92 C-3,72 -4,56 -2,40" fill="none" stroke={trunk} strokeWidth="9" strokeLinecap="round" />{canopy(-2, 30, 28)}</g>;
    if (st === 2) return <g>{pot(34)}<path d="M2,92 C-6,70 -8,52 -6,36" fill="none" stroke={trunk} strokeWidth="12" strokeLinecap="round" />{canopy(-18, 30, 24)}{canopy(14, 22, 30)}</g>;
    if (st === 3) return <g>{pot(38)}<path d="M4,92 C-14,72 6,58 -8,40 C-16,30 -6,22 -2,16" fill="none" stroke={trunk} strokeWidth="14" strokeLinecap="round" /><path d="M-6,50 C-26,46 -34,38 -40,30" fill="none" stroke={trunk} strokeWidth="8" strokeLinecap="round" />{canopy(-42, 26, 24)}{canopy(-6, 8, 32)}{canopy(30, 20, 26)}</g>;
    return <g>{pot(44)}<path d="M6,94 C-20,74 12,60 -6,42 C-18,30 -4,18 0,8" fill="none" stroke={trunk} strokeWidth="18" strokeLinecap="round" /><path d="M-4,54 C-30,50 -42,42 -52,32" fill="none" stroke={trunk} strokeWidth="10" strokeLinecap="round" /><path d="M2,40 C26,36 40,30 50,20" fill="none" stroke={trunk} strokeWidth="9" strokeLinecap="round" />{canopy(-54, 26, 28)}{canopy(52, 14, 26)}{canopy(-8, -6, 40)}{[[-30, -14], [24, -18], [-2, -34], [14, -2], [-20, 6]].map(([bx, by], i) => <circle key={i} cx={bx} cy={by} r="4" fill={P.accent} />)}</g>;
  };
  return (
    <svg viewBox="0 0 240 268" width={size} height={size * (268 / 240)} style={{ overflow: "visible", filter }}>
      <ellipse cx="120" cy="240" rx={40 + st * 6} ry="9" fill="#000" opacity=".22" />
      <g transform="translate(120 110)">
        <g className="c-breathe">
          {body()}
          {face()}
          {pose === "fire" && <g className="c-flick">{[[-40, 100], [0, 106], [40, 100]].map(([fx, fy], i) => <path key={i} d={`M${fx},${fy} C${fx - 10},${fy - 20} ${fx + 7},${fy - 26} ${fx},${fy - 46} C${fx + 12},${fy - 26} ${fx + 12},${fy - 12} ${fx},${fy} Z`} fill={i % 2 ? "#FFD23F" : "#FF7A1A"} />)}</g>}
          {accessories.includes("crown") && accessoryDraw("crown", P)}
          {accessories.includes("halo") && accessoryDraw("halo", P)}
        </g>
      </g>
    </svg>
  );
}

function Creature({ species = "florn", stage = 1, vitality = 70, size = 220, skin = null, accessories = [], pose = "idle" }) {
  const uid = useMemo(() => "g" + Math.random().toString(36).slice(2), []);
  const P = paletteFor(species, skin);
  const st = Math.max(0, Math.min(4, stage));
  const mood = vitality >= 78 ? "radiant" : vitality >= 45 ? "content" : vitality >= 25 ? "tired" : "sick";
  if (SPECIES[species] && SPECIES[species].plant) return <PlantCreature P={P} st={st} mood={mood} size={size} pose={pose} accessories={accessories} />;
  const sx = [0.6, 0.74, 0.88, 0.98, 1.06][st], sy = sx * [0.92, 0.97, 1, 1.07, 1.13][st];
  const floats = st === 4, feet = st >= 1 && st <= 3, arms = st >= 2, fierce = st >= 2;
  const body = "M0,-58 C40,-58 66,-32 66,2 C66,44 40,80 0,80 C-40,80 -66,44 -66,2 C-66,-32 -40,-58 0,-58 Z";
  const line = mood === "sick" ? "#3f463c" : P.line;
  const iris = mood === "sick" ? "#4a4f45" : P.iris;
  const yOff = pose === "sit" && arms ? 10 : 0;
  const wave = pose === "wave" && arms;

  const eye = (cx, flip) => {
    if (mood === "radiant") return <path d={`M${cx - 9},-6 q9,-13 18,0`} fill="none" stroke="#161616" strokeWidth="5.5" strokeLinecap="round" />;
    if (mood === "sick") return <g stroke="#161616" strokeWidth="4" strokeLinecap="round"><path d={`M${cx - 8},-11 l16,12`} /><path d={`M${cx - 8},1 l16,-12`} /></g>;
    return <g>
      <path d={`M${cx - 10},${-9} q10,${flip ? -4 : -4} 20,0 q-2,14 -10,14 q-8,0 -10,-14 z`} fill="#fff" stroke={line} strokeWidth="2" />
      <circle cx={cx + 1} cy="-1" r="6" fill={iris} /><circle cx={cx + 1} cy="0" r="3" fill="#141414" />
      <circle cx={cx - 2} cy="-4" r="2" fill="#fff" />
      {mood === "tired" && <path d={`M${cx - 11},-8 h22`} stroke={P.dark} strokeWidth="6" strokeLinecap="round" />}
    </g>;
  };
  const mouth = () => {
    if (mood === "radiant") return <path d="M-13,16 q13,17 26,0 q-13,6 -26,0 z" fill="#161616" />;
    if (mood === "content") return <path d="M-9,17 q9,9 18,0" fill="none" stroke="#161616" strokeWidth="4.5" strokeLinecap="round" />;
    if (mood === "tired") return <path d="M-9,20 h18" stroke="#161616" strokeWidth="4.5" strokeLinecap="round" />;
    return <path d="M-12,21 q6,-8 12,0 q6,8 12,0" fill="none" stroke="#161616" strokeWidth="4" strokeLinecap="round" />;
  };

  return (
    <svg viewBox="0 0 240 268" width={size} height={size * (268 / 240)} style={{ overflow: "visible", filter: mood === "sick" ? "saturate(.4) brightness(.9)" : mood === "tired" ? "saturate(.72)" : "none" }}>
      <defs><clipPath id={uid + "c"}><path d={body} /></clipPath></defs>
      <ellipse cx="120" cy={floats ? 240 : 236} rx={62 * sx} ry={11 * sx} fill="#000" opacity={floats ? 0.14 : 0.24} />
      <g transform={`translate(120 ${140 + yOff})`}>
        <g className={floats ? "c-float" : "c-breathe"}>
          <g transform={`scale(${sx} ${sy})`}>
            {features(SPECIES[species].feature, st, P, "back")}
            {st === 4 && <circle r="112" fill="none" stroke={P.accent} strokeWidth="2" strokeDasharray="5 16" opacity=".4" className="c-spin" />}
            {st === 4 && <g><path d="M-60,-4 C-114,-44 -118,16 -70,40 C-90,8 -74,-6 -60,-4 Z" fill={P.light} stroke={P.line} strokeWidth="2.5" /><path d="M60,-4 C114,-44 118,16 70,40 C90,8 74,-6 60,-4 Z" fill={P.light} stroke={P.line} strokeWidth="2.5" /></g>}
            {features(SPECIES[species].feature, st, P, "front")}
            {/* cell-shaded body */}
            <g clipPath={`url(#${uid}c)`}>
              <rect x="-80" y="-80" width="160" height="180" fill={P.main} />
              <path d="M20,-30 C70,-10 70,60 20,90 L90,90 L90,-60 Z" fill={P.dark} />
              <ellipse cx="-28" cy="-32" rx="40" ry="34" fill={P.light} opacity=".85" />
              <ellipse cx="0" cy="36" rx="40" ry="34" fill={P.belly} />
              <ellipse cx="-6" cy="30" rx="30" ry="24" fill={P.bellyL} opacity=".7" />
            </g>
            <path d={body} fill="none" stroke={line} strokeWidth="3.5" />
            {/* brows for fierce look */}
            {fierce && mood !== "sick" && mood !== "radiant" && <g stroke={line} strokeWidth="4" strokeLinecap="round"><path d="M-32,-16 l18,5" /><path d="M32,-16 l-18,5" /></g>}
            {st <= 1 && mood !== "sick" && <g opacity=".45"><circle cx="-40" cy="8" r="7" fill="#F98A8A" /><circle cx="40" cy="8" r="7" fill="#F98A8A" /></g>}
            {arms && <path d="M-60,20 q-16,6 -12,24 q10,2 18,-10 z" fill={P.dark} stroke={line} strokeWidth="2.5" strokeLinejoin="round" />}
            {arms && (wave
              ? <path d="M56,-28 q14,-14 8,-32 q-14,6 -20,26 z" fill={P.dark} stroke={line} strokeWidth="2.5" strokeLinejoin="round" className="c-wave" />
              : <path d="M60,20 q16,6 12,24 q-10,2 -18,-10 z" fill={P.dark} stroke={line} strokeWidth="2.5" strokeLinejoin="round" />)}
            {eye(-21, false)}{eye(21, true)}{mouth()}
            {st >= 3 && mood !== "sick" && <g fill="#fff" stroke={line} strokeWidth="1"><path d="M-8,20 l3,7 l3,-7 z" /><path d="M2,20 l3,7 l3,-7 z" /></g>}
            {feet && <g fill={P.dark} stroke={line} strokeWidth="2.5"><path d="M-34,74 q12,14 24,2 q-4,10 -14,10 q-12,0 -10,-12 z" /><path d="M34,74 q-12,14 -24,2 q4,10 14,10 q12,0 10,-12 z" /></g>}
            {floats && <ellipse cx="0" cy="88" rx="24" ry="7" fill={P.accent} opacity=".3" />}
            {(mood === "sick" || mood === "tired") && <path d="M52,-10 q7,12 0,17 q-7,-5 0,-17 z" fill="#79D0E8" opacity={mood === "sick" ? 1 : 0.7} />}
            {pose === "fire" && <g className="c-flick">
              {[[-52, 60], [0, 74], [52, 60], [-30, 70], [30, 70]].map(([fx, fy], i) => (
                <g key={i}><path d={`M${fx},${fy} C${fx - 12},${fy - 22} ${fx + 8},${fy - 30} ${fx},${fy - 52} C${fx + 14},${fy - 30} ${fx + 14},${fy - 14} ${fx},${fy} Z`} fill="#FF7A1A" /><path d={`M${fx},${fy - 6} C${fx - 6},${fy - 20} ${fx + 5},${fy - 24} ${fx},${fy - 40} C${fx + 8},${fy - 24} ${fx + 7},${fy - 14} ${fx},${fy - 6} Z`} fill="#FFD23F" /></g>
              ))}
            </g>}
            {accessories.map((a) => accessoryDraw(a, P))}
          </g>
        </g>
      </g>
    </svg>
  );
}

/* ============================ SMALL UI ============================ */
function Ring({ value, total, color, size = 128 }) {
  const r = size / 2 - 9, c = 2 * Math.PI * r, pct = total ? Math.min(1, value / total) : 0;
  return <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#2a2a2a" strokeWidth="9" /><circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="9" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} strokeLinecap="round" style={{ transition: "stroke-dashoffset .6s cubic-bezier(.2,.8,.2,1)" }} /></svg>;
}
const Meter = ({ label, value, pct, color }) => <><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span className="muted" style={{ fontSize: 13 }}>{label}</span><span className="disp" style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{value}</span></div><div style={{ height: 8, background: "#2a2a2a", borderRadius: 999, overflow: "hidden" }}><div style={{ height: "100%", width: `${Math.min(100, pct)}%`, borderRadius: 999, background: color, transition: "width .5s" }} /></div></>;
const Stat = ({ icon, label, value }) => <div className="card" style={{ padding: 14 }}><div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>{icon}<span className="muted" style={{ fontSize: 11 }}>{label}</span></div><div className="disp" style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>{value}</div></div>;

/* ============================ APP ============================ */
export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [users, setUsers] = useState({});
  const [me, setMe] = useState(null);
  const [isDev, setIsDev] = useState(false);
  const [tab, setTab] = useState("today");
  const [flash, setFlash] = useState(null);
  const [burst, setBurst] = useState(false);
  const [wheelOpen, setWheelOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatWith, setChatWith] = useState(null);
  const [chatConfirm, setChatConfirm] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [pendingProfile, setPendingProfile] = useState(null);
  const saveT = useRef(null);
  const acctRef = useRef(null);

  const afterAuth = async (session) => {
    const uid = session.user.id, email = session.user.email;
    const map = await loadAllAccounts();
    if (email === DEV.email) { setUsers(map); setIsDev(true); setMe(null); setPendingProfile(null); setLoaded(true); return; }
    const uname = Object.keys(map).find((k) => map[k].id === uid);
    if (uname) {
      const acc = map[uname];
      let changed = false;
      // ensure each pet is an independent record with a unique id + sane fields
      const seenIds = new Set();
      (acc.pets || []).forEach((p) => {
        if (!p.id || seenIds.has(p.id)) { p.id = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); changed = true; }
        seenIds.add(p.id);
        if (p.prestige == null) p.prestige = 0;
        if (p.vitality == null) p.vitality = 50;
        if (p.xp == null) p.xp = 0;
        if (p.totalXp == null) p.totalXp = 0;
      });
      if (!(acc.pets || []).some((p) => p.id === acc.activePet)) { acc.activePet = acc.pets[0].id; changed = true; }
      if (acc.lastCompletedDate !== todayKey() && (acc.habits || []).some((h) => h.done)) {
        acc.habits = acc.habits.map((h) => ({ ...h, done: false })); changed = true;
      }
      if (pruneOutbox(acc, map)) changed = true;
      if (changed) { map[uname] = acc; saveAccountRow(acc); }
      setMe(uname); setPendingProfile(null);
    } else {
      // authenticated but no profile row (e.g. account was deleted) — send them to set one up
      setMe(null); setPendingProfile({ uid, email });
    }
    setUsers(map);
    setLoaded(true);
  };
  const onAuthed = async () => { const { data: { session } } = await supabase.auth.getSession(); if (session) await afterAuth(session); };
  const refresh = async () => { const map = await loadAllAccounts(); setUsers(map); };
  const deleteUser = async (uname) => { const target = users[uname]; if (!target) return; try { await supabase.from("accounts").delete().eq("id", target.id); } catch (e) {} const map = await loadAllAccounts(); setUsers(map); };

  useEffect(() => {
    if (!chatOpen) return;
    const t = setInterval(() => { refresh(); }, 4000);
    return () => clearInterval(t);
  }, [chatOpen]);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) await afterAuth(session); else setLoaded(true);
    })();
    const l = document.createElement("link"); l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(l);
    const flush = () => { if (acctRef.current && acctRef.current.id) { try { saveAccountRow(acctRef.current); } catch (e) {} } };
    const onHide = () => { if (document.visibilityState === "hidden") flush(); };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);
    return () => { document.removeEventListener("visibilitychange", onHide); window.removeEventListener("pagehide", flush); };
  }, []);

  const acct = me ? users[me] : null;
  const persist = async (a) => {
    setSaveState("saving");
    try {
      const res = await saveAccountRow(a);
      if (res && res.error) { console.error("Companion save error:", res.error); setSaveState("error"); }
      else setSaveState("saved");
    } catch (e) { console.error("Companion save exception:", e); setSaveState("error"); }
  };
  const commit = (a) => { setUsers((u) => ({ ...u, [me]: a })); acctRef.current = a; persist(a); };
  const clone = () => JSON.parse(JSON.stringify(acct));
  const active = () => (acct.pets.find((p) => p.id === acct.activePet) || acct.pets[0]);
  const logout = async () => { await supabase.auth.signOut(); setMe(null); setIsDev(false); setUsers({}); setTab("today"); };

  // friend model: mutual follow = friends. Each user only edits their own row.
  const follow = (t) => { const a = clone(); a.follows = a.follows || []; if (!a.follows.includes(t)) a.follows.push(t); a.hidden = (a.hidden || []).filter((x) => x !== t); commit(a); };
  const unfollow = (t) => { const a = clone(); a.follows = (a.follows || []).filter((x) => x !== t); commit(a); };
  const hideReq = (t) => { const a = clone(); a.hidden = [...new Set([...(a.hidden || []), t])]; commit(a); };
  const saveProfile = (patch) => { const a = clone(); a.profile = { ...(a.profile || {}), ...patch }; commit(a); };

  if (!loaded) return <Splash />;
  if (isDev) return <DevDashboard users={users} onLogout={logout} onDelete={deleteUser} />;
  if (pendingProfile) return <ProfileSetup uid={pendingProfile.uid} email={pendingProfile.email} users={users} onDone={onAuthed} onLogout={logout} />;
  if (!me || !acct) return <Auth onAuthed={onAuthed} />;

  const pet = active();
  const habits = acct.habits;
  const doneCount = habits.filter((h) => h.done).length;
  const todayPct = habits.length ? doneCount / habits.length : 0;
  const completedToday = acct.lastCompletedDate === todayKey();
  const previewVit = Math.max(0, Math.min(100, Math.round(pet.vitality + (todayPct - 0.5) * 34)));
  const displayVit = completedToday ? pet.vitality : previewVit;
  const moodWord = displayVit >= 78 ? "radiant" : displayVit >= 45 ? "content" : displayVit >= 25 ? "sleepy" : "unwell";
  const ambient = displayVit >= 78 ? "rgba(29,185,84,.16)" : displayVit >= 45 ? "rgba(29,185,84,.1)" : displayVit >= 25 ? "rgba(150,160,175,.1)" : "rgba(120,140,120,.1)";
  const ringColor = displayVit >= 45 ? "#1DB954" : displayVit >= 25 ? "#F5C36B" : "#F98A8A";
  const plannedMin = habits.reduce((s, h) => s + (h.duration || 0), 0);

  const toggle = (id) => { if (completedToday) return; const a = clone(); a.habits = a.habits.map((h) => h.id === id ? { ...h, done: !h.done } : h); commit(a); };
  const addHabit = (name, icon, color, duration) => {
    if (name.trim().toLowerCase() === "chat") { setChatConfirm(true); return; }
    const a = clone(); a.habits = [...a.habits, { id: Date.now(), name: name.trim(), icon, color, duration, done: false }]; commit(a);
  };
  const sendMessage = (to, text) => { const t = text.trim(); if (!t) return; const a = clone(); a.outbox = a.outbox || []; a.outbox.push({ id: "m" + Date.now() + Math.random().toString(36).slice(2, 6), to, text: t, sentAt: Date.now() }); commit(a); };
  const markSeen = (from) => { const a = clone(); a.seen = a.seen || {}; let changed = false; (users[from] && users[from].outbox || []).forEach((m) => { if (m.to === me && !a.seen[m.id]) { a.seen[m.id] = Date.now(); changed = true; } }); if (changed) commit(a); };
  const openChat = () => { setChatConfirm(false); setChatWith(null); setChatOpen(true); };
  const removeHabit = (id) => { const a = clone(); a.habits = a.habits.filter((h) => h.id !== id); commit(a); };

  const completeDay = () => {
    if (completedToday || !habits.length) return;
    const a = clone(); const p = a.pets.find((x) => x.id === (a.activePet || a.pets[0].id)) || a.pets[0];
    const today = todayKey(), pct = todayPct;
    if (a.lastCompletedDate) { const gap = diffDays(a.lastCompletedDate, today); if (gap > 1) { const miss = gap - 1; if (a.freezes >= miss) a.freezes -= miss; else { a.freezes = 0; a.streak = 0; } } }
    const met = pct >= GOAL;
    a.streak = met ? a.streak + 1 : 0; a.best = Math.max(a.best, a.streak);
    const mult = prestigeMult(p.prestige);
    if (pct >= 0.8) { p.vitality = Math.min(100, p.vitality + 15); const g = Math.round(22 * mult); p.xp += g; p.totalXp += g; }
    else if (met) { p.vitality = Math.min(100, p.vitality + 5); const g = Math.round(10 * mult); p.xp += g; p.totalXp += g; }
    else p.vitality = Math.max(0, p.vitality - 26);
    let lvl = false, sank = false;
    while (p.xp >= XP_PER_TIER && p.vitality >= 40 && p.stage < 4) { p.stage++; p.xp -= XP_PER_TIER; lvl = true; }
    if (!met && p.vitality <= 26 && p.stage > 0) { p.stage--; sank = true; }
    const ms = met && MILESTONES.includes(a.streak);
    if (ms && a.freezes < FREEZE_CAP) a.freezes = Math.min(FREEZE_CAP, a.freezes + 1);
    a.lastCompletedDate = today; a.history[today] = +pct.toFixed(2);
    a.spinTokens = (a.spinTokens || 0) + 1;
    commit(a);
    const msg = ms ? `🔥 ${a.streak}-day streak! +1 freeze` : lvl ? `${p.name} evolved into a ${TIERS[p.stage]}!` : sank ? `${p.name} got sick and reverted…` : pct >= 0.8 ? `Great day — ${p.name} is thriving.` : met ? "Day counted. Streak alive." : "Under goal — streak reset.";
    setFlash(msg + "  ·  🎁 spin ready"); if (ms || lvl || pct >= 0.8) { setBurst(true); setTimeout(() => setBurst(false), 1400); }
    setTab("today"); setTimeout(() => setFlash(null), 3000);
  };

  const switchPet = (id) => { const a = clone(); a.activePet = id; commit(a); };
  const renamePet = (name) => { const n = name.trim(); if (!n) return "Enter a name."; if (n.toLowerCase() !== pet.name.toLowerCase() && allPetNames(users).has(n.toLowerCase())) return "That pet name is taken."; const a = clone(); a.pets.find((x) => x.id === pet.id).name = n; commit(a); return null; };
  const setSpecies = (sp) => { const a = clone(); const p = a.pets.find((x) => x.id === pet.id); p.species = sp; p.skin = null; commit(a); };
  const toggleAcc = (id) => { const a = clone(); const p = a.pets.find((x) => x.id === pet.id); p.accessories = p.accessories.includes(id) ? p.accessories.filter((x) => x !== id) : [...p.accessories, id]; commit(a); };
  const setPose = (id) => { const a = clone(); a.pets.find((x) => x.id === pet.id).pose = id; commit(a); };
  const setSkin = (id) => { const a = clone(); a.pets.find((x) => x.id === pet.id).skin = id; commit(a); };
  const prestigePet = () => { const a = clone(); const p = a.pets.find((x) => x.id === pet.id); if (p.stage < MAX_STAGE) return; p.prestige = (p.prestige || 0) + 1; p.stage = 0; p.xp = 0; if (p.skin && PRESTIGE_SKINS.some((s) => s.id === p.skin && s.prestige > p.prestige)) p.skin = null; commit(a); setFlash(`${p.name} prestiged to ★${p.prestige}! XP now flows faster.`); setBurst(true); setTimeout(() => setBurst(false), 1400); setTimeout(() => setFlash(null), 3000); };

  const rollReward = () => {
    const owned = new Set(acct.ownedAcc);
    const wheelAcc = ACCESSORIES.filter((x) => x.wheel && !owned.has(x.id));
    const freeSkins = SKIN_IDS.filter((s) => !(acct.ownedSkins[pet.species] || []).includes(s));
    const bag = ["freeze", "xp", "acc", "freeze", "skin", "xp", "acc", "pet"], weights = [16, 22, 16, 16, 12, 16, 12, 6];
    let r = Math.random() * weights.reduce((s, x) => s + x, 0), idx = 0;
    for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r <= 0) { idx = i; break; } }
    let type = bag[idx];
    if (type === "acc" && !wheelAcc.length) type = "xp";
    if (type === "skin" && !freeSkins.length) type = "xp";
    if (type === "freeze" && acct.freezes >= FREEZE_CAP) type = "xp";
    let reward, label;
    if (type === "freeze") { reward = { type }; label = "Streak Freeze"; }
    else if (type === "xp") { reward = { type, amount: 15 }; label = "+15 XP"; }
    else if (type === "acc") { const x = wheelAcc[Math.floor(Math.random() * wheelAcc.length)]; reward = { type, id: x.id }; label = x.name; }
    else if (type === "skin") { const s = freeSkins[Math.floor(Math.random() * freeSkins.length)]; reward = { type, id: s, species: pet.species }; label = `${SKIN_NAME[s]} skin`; }
    else { const sp = Math.random() < 0.6 ? "vesper" : ["florn", "nimbo", "cinder", "mica"][Math.floor(Math.random() * 4)]; reward = { type, species: sp }; label = `New pet: ${SPECIES[sp].name}!`; }
    return { slice: idx, reward, label };
  };
  const grant = (reward) => {
    const a = clone(); a.spinTokens = Math.max(0, (a.spinTokens || 0) - 1);
    if (reward.type === "freeze") a.freezes = Math.min(FREEZE_CAP, a.freezes + 1);
    else if (reward.type === "xp") { const p = a.pets.find((x) => x.id === pet.id); p.xp += reward.amount; p.totalXp += reward.amount; while (p.xp >= XP_PER_TIER && p.stage < 4) { p.stage++; p.xp -= XP_PER_TIER; } }
    else if (reward.type === "acc") { if (!a.ownedAcc.includes(reward.id)) a.ownedAcc.push(reward.id); }
    else if (reward.type === "skin") { a.ownedSkins[reward.species] = [...new Set([...(a.ownedSkins[reward.species] || []), reward.id])]; }
    else if (reward.type === "pet") { a.pets.push(newPet(reward.species, uniquePetName(SPECIES[reward.species].name, allPetNames(users)))); }
    commit(a);
  };

  const leaderboard = [];
  Object.values(users).filter((u) => u.email !== DEV.email).forEach((u) => (u.pets || []).forEach((p) => leaderboard.push({ ...p, owner: u.username, vit: p.vitality })));
  leaderboard.sort((x, y) => y.totalXp - x.totalXp);
  const myRank = leaderboard.findIndex((x) => x.owner === me && x.id === pet.id) + 1;

  const rel = (uname) => {
    if (uname === me) return "self";
    const iFollow = (acct.follows || []).includes(uname);
    const theyFollow = (users[uname] && users[uname].follows || []).includes(me);
    if (iFollow && theyFollow) return "friend";
    if (iFollow) return "out";
    if (theyFollow && !(acct.hidden || []).includes(uname)) return "in";
    return "none";
  };
  const friends = (acct.follows || []).filter((f) => users[f] && (users[f].follows || []).includes(me)).map((f) => users[f]);
  const incoming = Object.keys(users).filter((u) => u !== me && (users[u].follows || []).includes(me) && !(acct.follows || []).includes(u) && !(acct.hidden || []).includes(u));
  const sent = (acct.follows || []).filter((f) => users[f] && !(users[f].follows || []).includes(me));

  return (
    <Shell tab={tab} setTab={setTab} flash={flash} onLogout={logout} reqCount={incoming.length} saveState={saveState}>
      {tab === "today" && (
        <div className="screen">
          <Header left={<><div className="eyebrow">Hi @{me}</div><div className="h1" style={{ marginTop: 4 }}>Today</div></>} right={<StreakChip streak={acct.streak} atRisk={!completedToday} freezes={acct.freezes} />} />
          {completedToday && acct.spinTokens > 0 && <button className="spinpill" onClick={() => setWheelOpen(true)}><Gift size={15} color="#1DB954" /> Daily spin ready<span style={{ marginLeft: "auto", color: "#1DB954", fontWeight: 700 }}>{acct.spinTokens}</span></button>}
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", margin: "6px 0" }}>
            <div style={{ position: "absolute", width: 300, height: 300, top: -6, borderRadius: "50%", background: `radial-gradient(circle,${ambient} 0%,transparent 68%)` }} />
            {burst && [...Array(16)].map((_, i) => { const an = (i / 16) * 6.28; return <div key={i} className="sp" style={{ width: 7, height: 7, top: 130, left: "50%", background: i % 2 ? "#F5C36B" : "#1DB954", "--tx": `${Math.cos(an) * 130}px`, "--ty": `${Math.sin(an) * 130}px` }} />; })}
            <Creature species={pet.species} stage={pet.stage} vitality={displayVit} size={222} skin={pet.skin} accessories={pet.accessories} pose={pet.pose} />
            <div className="disp muted" style={{ fontSize: 13, marginTop: -6 }}>{pet.name} · {TIERS[pet.stage]} · feeling {moodWord}</div>
          </div>
          <div className="card" style={{ padding: 18, display: "flex", alignItems: "center", gap: 18, margin: "10px 0 20px" }}>
            <div style={{ position: "relative", width: 128, height: 128, flexShrink: 0 }}>
              <Ring value={doneCount} total={habits.length} color={ringColor} />
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><span className="disp" style={{ fontSize: 29, fontWeight: 700, color: "#fff" }}>{doneCount}<span style={{ color: "#6a6a6a", fontSize: 17 }}>/{habits.length}</span></span><span className="muted" style={{ fontSize: 11 }}>done today</span></div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="disp" style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{completedToday ? "Locked in for today" : todayPct >= GOAL ? "Goal reached" : "Reach your goal"}</div>
              <div className="muted" style={{ fontSize: 13, lineHeight: 1.5 }}>{completedToday ? "Come back tomorrow." : `${Math.max(0, Math.ceil(habits.length * GOAL) - doneCount)} more to count today.`}{plannedMin > 0 && <><br />≈ {plannedMin} min planned</>}</div>
            </div>
          </div>
          <div className="eyebrow" style={{ marginBottom: 12 }}>Today's habits</div>
          {habits.map((h) => { const Ic = ICONS[h.icon] || Sparkles; return (
            <div key={h.id} className="habit" onClick={() => toggle(h.id)} style={{ opacity: completedToday ? 0.55 : 1, cursor: completedToday ? "default" : "pointer" }}>
              <div className="hicon" style={{ background: h.color + "22" }}><Ic size={20} color={h.color} /></div>
              <div style={{ flex: 1 }}><span style={{ color: h.done ? "#6a6a6a" : "#e9ebef", fontWeight: 500, fontSize: 15, textDecoration: h.done ? "line-through" : "none" }}>{h.name}</span>{h.duration && <span className="durpill"><Clock size={11} />{h.duration}m</span>}</div>
              <div className="check" style={{ background: h.done ? "#1DB954" : "transparent", borderColor: h.done ? "#1DB954" : "#3a3a3a" }}>{h.done && <Check size={16} color="#0a0a0a" strokeWidth={3} />}</div>
            </div>); })}
          <button className="btn" disabled={completedToday} style={{ marginTop: 14, background: completedToday ? "#1c1c1c" : "#1DB954", color: completedToday ? "#6a6a6a" : "#08130d", cursor: completedToday ? "default" : "pointer" }} onClick={completeDay}>{completedToday ? "Already completed today ✓" : "Complete day"}</button>
        </div>
      )}
      {tab === "habits" && <HabitsScreen habits={habits} addHabit={addHabit} removeHabit={removeHabit} locked={completedToday} />}
      {tab === "pet" && <PetScreen key={pet.id} acct={acct} pet={pet} switchPet={switchPet} renamePet={renamePet} setSpecies={setSpecies} toggleAcc={toggleAcc} setPose={setPose} setSkin={setSkin} prestigePet={prestigePet} />}
      {tab === "calendar" && <CalendarScreen acct={acct} />}
      {tab === "ranks" && <Ranks users={users} me={me} acct={acct} list={leaderboard} activeId={pet.id} myRank={myRank} friends={friends} incoming={incoming} sent={sent} onOpen={(u) => setViewUser(u)} onRefresh={refresh} onAccept={follow} onDecline={hideReq} onCancel={unfollow} />}
      {wheelOpen && <WheelModal onClose={() => setWheelOpen(false)} roll={rollReward} grant={grant} />}
      {viewUser && users[viewUser] && <ProfileModal user={users[viewUser]} rel={rel(viewUser)} onClose={() => setViewUser(null)} onSend={() => follow(viewUser)} onAccept={() => follow(viewUser)} onDecline={() => hideReq(viewUser)} onCancel={() => unfollow(viewUser)} onRemove={() => unfollow(viewUser)} onSave={saveProfile} />}
      {chatConfirm && (
        <div className="sheetwrap" onClick={() => setChatConfirm(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()} style={{ paddingBottom: 30 }}>
            <div className="grab" />
            <div className="disp" style={{ color: "#fff", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Open the chat room?</div>
            <div className="muted" style={{ fontSize: 13.5, lineHeight: 1.5, marginBottom: 18 }}>This will take you to the chat section. You can come back to your habits any time — your messages stay saved.</div>
            <button className="btn" style={{ background: "#1DB954", color: "#08130d" }} onClick={openChat}>Enter chat</button>
            <button className="btn" style={{ background: "#242424", color: "#c8c8c8", marginTop: 10 }} onClick={() => setChatConfirm(false)}>Not now</button>
          </div>
        </div>
      )}
      {chatOpen && <ChatOverlay users={users} me={me} friends={friends} chatWith={chatWith} setChatWith={(u) => { setChatWith(u); if (u) markSeen(u); }} onClose={() => setChatOpen(false)} onSend={sendMessage} />}
    </Shell>
  );
}

/* ============================ SHELL ============================ */
function Shell({ tab, setTab, flash, onLogout, reqCount, saveState, children }) {
  const dot = saveState === "error" ? "#F98A8A" : saveState === "saving" ? "#F5C36B" : "#1DB954";
  return <div className="wrap"><Style /><div className="phone">
    {flash && <div className="flash">{flash}</div>}
    <div style={{ position: "absolute", top: 18, right: 18, zIndex: 20, display: "flex", alignItems: "center", gap: 8 }}>
      {saveState !== "idle" && <span title={"save: " + saveState} style={{ width: 8, height: 8, borderRadius: "50%", background: dot, boxShadow: `0 0 8px ${dot}` }} />}
      <button className="ghost" onClick={onLogout}><LogOut size={16} color="#8a8a8a" /></button>
    </div>
    {children}
    <div className="tabbar">{[["today", Home, "Today"], ["habits", ListChecks, "Habits"], ["pet", Sparkles, "Companion"], ["calendar", CalendarDays, "Calendar"], ["ranks", Trophy, "Ranks"]].map(([id, Ic, l]) => (
      <button key={id} className={`tab ${tab === id ? "on" : ""}`} onClick={() => setTab(id)} style={{ position: "relative" }}><Ic size={21} strokeWidth={tab === id ? 2.4 : 2} />{l}{id === "ranks" && reqCount > 0 && <span className="badge">{reqCount}</span>}</button>))}</div>
  </div></div>;
}
const Header = ({ left, right }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, paddingRight: 40 }}><div>{left}</div>{right}</div>;
function StreakChip({ streak, atRisk, freezes }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#181818", padding: "8px 12px", borderRadius: 14, border: "1px solid rgba(255,255,255,.06)" }}><Flame size={16} color={atRisk ? "#6a6a6a" : "#F5C36B"} fill={atRisk ? "none" : "#F5C36B"} /><span className="disp" style={{ color: atRisk ? "#8a8a8a" : "#fff", fontWeight: 700, fontSize: 15 }}>{streak}</span>{freezes > 0 && <span style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 2 }}><Snowflake size={13} color="#79D0E8" /><span className="disp" style={{ color: "#79D0E8", fontSize: 12, fontWeight: 600 }}>{freezes}</span></span>}</div>;
}
const Splash = () => <div className="wrap"><Style /><div className="phone" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={40} color="#1DB954" className="c-spin" /></div></div>;

/* ============================ AUTH (Supabase) ============================ */
function Auth({ onAuthed }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState(""), [pass, setPass] = useState(""), [username, setUsername] = useState(""), [pet, setPet] = useState(""), [species, setSpecies] = useState("florn"), [err, setErr] = useState(""), [busy, setBusy] = useState(false);

  const submit = async () => {
    setErr(""); setBusy(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pass });
        if (error) { setErr(error.message); setBusy(false); return; }
        await onAuthed(); setBusy(false); return;
      }
      const un = username.trim().toLowerCase(), pn = pet.trim(), em = email.trim();
      if (!em || !pass || !un || !pn) { setErr("Fill in every field."); setBusy(false); return; }
      if (!emailValid(em)) { setErr("That doesn't look like a valid email."); setBusy(false); return; }
      if (un === "dev") { setErr("That username is reserved."); setBusy(false); return; }
      if (pass.length < 6) { setErr("Password must be at least 6 characters."); setBusy(false); return; }
      const { data: sd, error } = await supabase.auth.signUp({ email: em, password: pass });
      if (error) { setErr(error.message); setBusy(false); return; }
      if (!sd.session) { setErr("Almost there — check your email to confirm, then log in."); setMode("login"); setBusy(false); return; }
      const map = await loadAllAccounts();
      if (map[un]) { setErr("That username is taken."); await supabase.auth.signOut(); setBusy(false); return; }
      let petName = pn, i = 2; const taken = allPetNames(map);
      while (taken.has(petName.toLowerCase())) petName = `${pn} ${i++}`;
      const dataBlob = newAccountData(em, species, petName);
      const { error: e2 } = await supabase.from("accounts").insert({ id: sd.user.id, username: un, data: dataBlob, total_xp: 0, streak: 0, best: 0 });
      if (e2) { setErr(/duplicate|unique/i.test(e2.message) ? "That username is taken." : e2.message); await supabase.auth.signOut(); setBusy(false); return; }
      await onAuthed(); setBusy(false); return;
    } catch (ex) { setErr(String((ex && ex.message) || ex)); setBusy(false); }
  };

  return <div className="wrap"><Style /><div className="phone" style={{ overflowY: "auto", padding: "44px 26px" }}>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}><Creature species={species} stage={2} vitality={82} size={150} /></div>
    <div className="disp" style={{ textAlign: "center", fontSize: 30, fontWeight: 700, color: "#fff", letterSpacing: "-.02em" }}>Companion</div>
    <div className="muted" style={{ textAlign: "center", fontSize: 14, marginBottom: 24 }}>{mode === "login" ? "Welcome back" : "Raise a creature by keeping your habits"}</div>
    {mode === "signup" && <><label className="lbl">Username</label><input className="txt" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="unique handle" /></>}
    <label className="lbl">Email</label><input className="txt" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" />
    <label className="lbl">Password</label><input className="txt" type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="••••••" onKeyDown={(e) => e.key === "Enter" && submit()} />
    {mode === "signup" && <>
      <label className="lbl">Name your companion</label><input className="txt" value={pet} onChange={(e) => setPet(e.target.value)} placeholder="unique pet name" />
      <label className="lbl">Choose a species</label>
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>{["florn", "nimbo", "cinder", "mica", "bonsai"].map((k) => (
        <button key={k} onClick={() => setSpecies(k)} style={{ flex: 1, padding: "8px 2px 4px", borderRadius: 14, cursor: "pointer", background: species === k ? "#16241c" : "#181818", border: species === k ? "1px solid #1DB954" : "1px solid rgba(255,255,255,.06)", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Creature species={k} stage={2} vitality={80} size={52} /><span className="disp" style={{ color: "#e9ebef", fontSize: 11, fontWeight: 600 }}>{SPECIES[k].name}</span></button>))}</div>
    </>}
    {err && <div className="err">{err}</div>}
    <button className="btn" disabled={busy} style={{ marginTop: 20, background: busy ? "#1c1c1c" : "#1DB954", color: busy ? "#6a6a6a" : "#08130d" }} onClick={submit}>{busy ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}</button>
    <div style={{ textAlign: "center", marginTop: 16 }}><button className="link" onClick={() => { setErr(""); setMode(mode === "login" ? "signup" : "login"); }}>{mode === "login" ? "New here? Create an account" : "Have an account? Log in"}</button></div>
    <div className="muted" style={{ textAlign: "center", fontSize: 11.5, marginTop: 20, lineHeight: 1.5 }}>Admin console: sign up / log in with {DEV.email}<br />Real accounts, saved to the cloud.</div>
  </div></div>;
}

/* ============================ DURATION WHEEL ============================ */
function DurationWheel({ value, onChange }) {
  const opts = [0, 5, 10, 15, 20, 25, 30, 45, 60, 90, 120];
  const ITEM = 62;
  const ref = useRef(null);
  const snapT = useRef(null);
  const [idx, setIdx] = useState(Math.max(0, opts.indexOf(value || 0)));
  useEffect(() => { if (ref.current) ref.current.scrollLeft = idx * ITEM; }, []);
  const settle = (i) => { const j = Math.max(0, Math.min(opts.length - 1, i)); if (ref.current) ref.current.scrollTo({ left: j * ITEM, behavior: "smooth" }); setIdx(j); onChange(opts[j] || null); };
  const onScroll = () => {
    if (!ref.current) return;
    const i = Math.max(0, Math.min(opts.length - 1, Math.round(ref.current.scrollLeft / ITEM)));
    if (i !== idx) setIdx(i);                    // move highlight live, but don't commit yet
    clearTimeout(snapT.current);
    snapT.current = setTimeout(() => settle(Math.round(ref.current.scrollLeft / ITEM)), 180); // snap + commit only after turning stops
  };
  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", left: "50%", top: 8, bottom: 24, width: 44, transform: "translateX(-50%)", border: "1.5px solid rgba(29,185,84,.65)", borderRadius: 12, pointerEvents: "none", background: "rgba(29,185,84,.1)" }} />
      <div ref={ref} onScroll={onScroll} className="wheelscroll" style={{ display: "flex", overflowX: "auto", padding: `10px calc(50% - ${ITEM / 2}px)`, WebkitOverflowScrolling: "touch" }}>
        {opts.map((o, i) => (
          <div key={o} onClick={() => settle(i)} style={{ minWidth: ITEM, textAlign: "center", padding: "14px 0", cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif", fontSize: i === idx ? 22 : 15, fontWeight: i === idx ? 700 : 500, color: i === idx ? "#fff" : "#5a5a5a", transition: "font-size .15s,color .15s" }}>
            {o === 0 ? "—" : o}
          </div>
        ))}
      </div>
      <div className="muted" style={{ textAlign: "center", fontSize: 12.5, marginTop: 2 }}>{opts[idx] === 0 ? "No time limit — slide to set minutes" : `${opts[idx]} minutes`}</div>
    </div>
  );
}

/* ============================ CHAT (secret) ============================ */
function ChatOverlay({ users, me, friends, chatWith, setChatWith, onClose, onSend }) {
  const [draft, setDraft] = useState("");
  const endRef = useRef(null);
  useEffect(() => { if (endRef.current) endRef.current.scrollIntoView(); }, [chatWith, users]);

  const convo = (() => {
    if (!chatWith) return [];
    const msgs = [];
    ((users[me] && users[me].outbox) || []).forEach((m) => { if (m.to === chatWith) msgs.push({ ...m, from: me }); });
    ((users[chatWith] && users[chatWith].outbox) || []).forEach((m) => { if (m.to === me) msgs.push({ ...m, from: chatWith }); });
    return msgs.sort((a, b) => a.sentAt - b.sentAt);
  })();
  const lastMsg = (u) => {
    const all = [];
    ((users[me] && users[me].outbox) || []).forEach((m) => { if (m.to === u) all.push(m); });
    ((users[u] && users[u].outbox) || []).forEach((m) => { if (m.to === me) all.push(m); });
    all.sort((a, b) => b.sentAt - a.sentAt);
    return all[0];
  };
  const time = (ts) => new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const send = () => { if (draft.trim()) { onSend(chatWith, draft); setDraft(""); } };

  return (
    <div className="chatwrap">
      {!chatWith ? (
        <>
          <div className="chathead">
            <div><div className="disp" style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>Chats</div><div className="muted" style={{ fontSize: 12 }}>Messages vanish 24h after they're read</div></div>
            <button className="ghost" onClick={onClose}><X size={18} color="#c8c8c8" /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 14px" }}>
            {!friends.length && <div className="card" style={{ padding: 26, textAlign: "center", marginTop: 10 }}><div className="muted" style={{ fontSize: 13.5 }}>Add friends in Ranks first — then you can message them here.</div></div>}
            {friends.map((f) => { const lm = lastMsg(f.username); return (
              <button key={f.username} className="chatrow" onClick={() => setChatWith(f.username)}>
                <div className="petframe" style={{ width: 44, height: 44 }}><Creature species={topPet(f).species} stage={topPet(f).stage} vitality={70} size={38} skin={topPet(f).skin} /></div>
                <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                  <div className="disp" style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>@{f.username}</div>
                  <div className="muted" style={{ fontSize: 12.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lm ? (lm.to === f.username ? "You: " : "") + lm.text : "Say hi"}</div>
                </div>
                {lm && <span className="muted" style={{ fontSize: 10 }}>{time(lm.sentAt)}</span>}
              </button>); })}
          </div>
        </>
      ) : (
        <>
          <div className="chathead">
            <button className="ghost" onClick={() => setChatWith(null)}><ChevronLeft size={20} color="#c8c8c8" /></button>
            <div style={{ flex: 1 }}><div className="disp" style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>@{chatWith}</div></div>
            <button className="ghost" onClick={onClose}><X size={18} color="#c8c8c8" /></button>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
            {!convo.length && <div className="muted" style={{ textAlign: "center", fontSize: 13, marginTop: 20 }}>No messages yet. Messages disappear 24h after they're read.</div>}
            {convo.map((m) => { const mine = m.from === me; return (
              <div key={m.id} className={`bubble ${mine ? "mine" : "theirs"}`}>{m.text}<span className="btime">{time(m.sentAt)}</span></div>); })}
            <div ref={endRef} />
          </div>
          <div className="chatinput">
            <input className="txt" style={{ flex: 1, marginBottom: 0 }} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Message" />
            <button className="sendbtn" onClick={send}><Sparkles size={18} color="#08130d" /></button>
          </div>
        </>
      )}
    </div>
  );
}

/* ============================ PROFILE SETUP (rebuild after deletion) ============================ */
function ProfileSetup({ uid, email, users, onDone, onLogout }) {
  const [username, setUsername] = useState(""), [pet, setPet] = useState(""), [species, setSpecies] = useState("florn"), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const submit = async () => {
    setErr(""); setBusy(true);
    const un = username.trim().toLowerCase(), pn = pet.trim();
    if (!un || !pn) { setErr("Fill in every field."); setBusy(false); return; }
    if (un === "dev") { setErr("That username is reserved."); setBusy(false); return; }
    if (Object.values(users).some((x) => x.username.toLowerCase() === un)) { setErr("That username is taken."); setBusy(false); return; }
    let petName = pn, i = 2; const taken = allPetNames(users);
    while (taken.has(petName.toLowerCase())) petName = `${pn} ${i++}`;
    const dataBlob = newAccountData(email, species, petName);
    const { error } = await supabase.from("accounts").insert({ id: uid, username: un, data: dataBlob, total_xp: 0, streak: 0, best: 0 });
    if (error) { setErr(/duplicate|unique/i.test(error.message) ? "That username is taken." : error.message); setBusy(false); return; }
    await onDone(); setBusy(false);
  };
  return <div className="wrap"><Style /><div className="phone" style={{ overflowY: "auto", padding: "44px 26px" }}>
    <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}><Creature species={species} stage={2} vitality={82} size={140} /></div>
    <div className="disp" style={{ textAlign: "center", fontSize: 26, fontWeight: 700, color: "#fff" }}>Start fresh</div>
    <div className="muted" style={{ textAlign: "center", fontSize: 13.5, marginBottom: 22, lineHeight: 1.5 }}>Signed in as {email}.<br />Set up a new companion to begin.</div>
    <label className="lbl">Username</label><input className="txt" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="unique handle" />
    <label className="lbl">Name your companion</label><input className="txt" value={pet} onChange={(e) => setPet(e.target.value)} placeholder="unique pet name" />
    <label className="lbl">Choose a species</label>
    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>{["florn", "nimbo", "cinder", "mica", "bonsai"].map((k) => (
      <button key={k} onClick={() => setSpecies(k)} style={{ flex: 1, padding: "8px 2px 4px", borderRadius: 14, cursor: "pointer", background: species === k ? "#16241c" : "#181818", border: species === k ? "1px solid #1DB954" : "1px solid rgba(255,255,255,.06)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Creature species={k} stage={2} vitality={80} size={48} /><span className="disp" style={{ color: "#e9ebef", fontSize: 10.5, fontWeight: 600 }}>{SPECIES[k].name}</span></button>))}</div>
    {err && <div className="err">{err}</div>}
    <button className="btn" disabled={busy} style={{ marginTop: 20, background: busy ? "#1c1c1c" : "#1DB954", color: busy ? "#6a6a6a" : "#08130d" }} onClick={submit}>{busy ? "Please wait…" : "Create companion"}</button>
    <div style={{ textAlign: "center", marginTop: 16 }}><button className="link" onClick={onLogout}>Log out</button></div>
  </div></div>;
}

/* ============================ HABITS (with duration) ============================ */
function HabitsScreen({ habits, addHabit, removeHabit, locked }) {
  const [adding, setAdding] = useState(false), [name, setName] = useState(""), [icon, setIcon] = useState("Heart"), [color, setColor] = useState(HABIT_COLORS[0]), [dur, setDur] = useState(null);
  const iconKeys = ["Heart", "Droplet", "BookOpen", "Dumbbell", "Brain", "Footprints", "Moon", "Apple", "PenLine", "Sun", "Coffee", "Wind"];
  const active = habits.map((h) => h.name.toLowerCase());
  const submit = () => { if (name.trim()) { addHabit(name, icon, color, dur); setName(""); setDur(null); setAdding(false); } };
  return <div className="screen">
    <Header left={<><div className="eyebrow">Manage</div><div className="h1" style={{ marginTop: 4 }}>Your habits</div></>} right={<button onClick={() => setAdding((a) => !a)} className="hicon" style={{ background: adding ? "#F98A8A22" : "#1DB95422", width: 44, height: 44, border: "none", cursor: "pointer" }}>{adding ? <X size={20} color="#F98A8A" /> : <Plus size={20} color="#1DB954" />}</button>} />
    {locked && <div className="note">Today's already logged — edits apply from tomorrow.</div>}
    {adding && <div className="card" style={{ padding: 18, margin: "16px 0" }}>
      <input className="txt" placeholder="Name your habit" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} autoFocus />
      <div className="eyebrow" style={{ margin: "16px 0 10px" }}>Icon</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{iconKeys.map((k) => { const Ic = ICONS[k]; return <button key={k} onClick={() => setIcon(k)} style={{ width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: icon === k ? color + "22" : "#101010", border: icon === k ? `1px solid ${color}` : "1px solid rgba(255,255,255,.07)" }}><Ic size={19} color={icon === k ? color : "#8a8a8a"} /></button>; })}</div>
      <div className="eyebrow" style={{ margin: "16px 0 10px" }}>Colour</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>{HABIT_COLORS.map((c) => <button key={c} onClick={() => setColor(c)} style={{ width: 30, height: 30, borderRadius: "50%", background: c, cursor: "pointer", border: color === c ? "2px solid #fff" : "2px solid transparent" }} />)}</div>
      <div className="eyebrow" style={{ margin: "16px 0 10px" }}>Duration</div>
      <DurationWheel value={dur} onChange={setDur} />
      <button className="btn" style={{ background: "#1DB954", color: "#08130d", marginTop: 18 }} onClick={submit}>Add habit</button>
    </div>}
    {!adding && <div style={{ height: 16 }} />}
    {habits.map((h) => { const Ic = ICONS[h.icon] || Sparkles; return <div key={h.id} className="habit" style={{ cursor: "default" }}>
      <div className="hicon" style={{ background: h.color + "22" }}><Ic size={20} color={h.color} /></div>
      <div style={{ flex: 1 }}><span style={{ color: "#e9ebef", fontWeight: 500, fontSize: 15 }}>{h.name}</span>{h.duration && <span className="durpill"><Clock size={11} />{h.duration}m</span>}</div>
      <button onClick={() => removeHabit(h.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6 }}><Trash2 size={17} color="#6a6a6a" /></button></div>; })}
    <div className="eyebrow" style={{ margin: "22px 0 12px" }}>Add from library</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{PRESETS.filter((p) => !active.includes(p.name.toLowerCase())).map((p) => { const Ic = ICONS[p.icon] || Sparkles; return <button key={p.name} className="chip" onClick={() => addHabit(p.name, p.icon, p.color, p.duration)}><Ic size={15} color={p.color} />{p.name}{p.duration ? <span className="muted" style={{ fontSize: 11 }}>{p.duration}m</span> : ""}<Plus size={13} color="#6a6a6a" /></button>; })}</div>
  </div>;
}

/* ============================ COMPANION ============================ */
function PetScreen({ acct, pet, switchPet, renamePet, setSpecies, toggleAcc, setPose, setSkin, prestigePet }) {
  const [editing, setEditing] = useState(false), [name, setName] = useState(pet.name), [err, setErr] = useState("");
  const save = () => { const e = renamePet(name); if (e) setErr(e); else { setErr(""); setEditing(false); } };
  const ownedSkins = acct.ownedSkins[pet.species] || [];
  const best = acct.best || 0;
  const accAvail = (a) => a.wheel ? acct.ownedAcc.includes(a.id) : a.streak ? best >= a.streak : pet.totalXp >= a.xp;
  const poseAvail = (p) => p.streak ? best >= p.streak : pet.totalXp >= (p.xp || 0);
  const pBadge = (p) => (p.prestige || 0) > 0 ? <span className="prestige">★{p.prestige}</span> : null;
  return <div className="screen">
    <div className="eyebrow">Your companion</div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4, marginBottom: 6, paddingRight: 40 }}>
      {editing ? <><input className="txt" style={{ flex: 1 }} value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && save()} autoFocus /><button className="chip" onClick={save}>Save</button></> : <><div className="h1">{pet.name}</div>{pBadge(pet)}<button className="ghost" onClick={() => { setName(pet.name); setEditing(true); }}><Pencil size={16} color="#8a8a8a" /></button></>}
    </div>
    {err && <div className="err" style={{ marginTop: 0 }}>{err}</div>}
    <div style={{ display: "flex", justifyContent: "center" }}><Creature species={pet.species} stage={pet.stage} vitality={pet.vitality} size={196} skin={pet.skin} accessories={pet.accessories} pose={pet.pose} /></div>
    <div className="card" style={{ padding: 18, marginBottom: 14 }}>
      <Meter label="Vitality" value={`${pet.vitality}%`} pct={pet.vitality} color={pet.vitality >= 45 ? "#1DB954" : pet.vitality >= 25 ? "#F5C36B" : "#F98A8A"} />
      <div style={{ height: 14 }} />
      <Meter label={`Growth to ${TIERS[Math.min(4, pet.stage + 1)]}`} value={`${pet.xp}/${XP_PER_TIER} xp`} pct={(pet.xp / XP_PER_TIER) * 100} color="#A9B4FF" />
      <div className="muted" style={{ fontSize: 12, marginTop: 12 }}>Total XP by {pet.name}: <b style={{ color: "#F5C36B" }}>{pet.totalXp}</b>{(pet.prestige || 0) > 0 && <> · Prestige <b style={{ color: "#F7A8C0" }}>★{pet.prestige}</b> · +{Math.round((prestigeMult(pet.prestige) - 1) * 100)}% XP</>}</div>
    </div>
    {pet.stage >= MAX_STAGE && (
      <div className="card" style={{ padding: 16, marginBottom: 16, border: "1px solid rgba(247,168,192,.4)", background: "linear-gradient(135deg,rgba(247,168,192,.12),rgba(29,185,84,.05))" }}>
        <div className="disp" style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{pet.name} has reached Mythic! ✨</div>
        <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.5, marginBottom: 12 }}>Prestige to restart its journey at a higher rank — faster XP, a new prestige star, and rare prestige skins.</div>
        <button className="btn" style={{ background: "linear-gradient(135deg,#F7A8C0,#E8632B)", color: "#2a0f14" }} onClick={prestigePet}>Prestige {pet.name} → ★{(pet.prestige || 0) + 1}</button>
      </div>
    )}
    <div className="eyebrow" style={{ marginBottom: 10 }}>Your pets ({acct.pets.length})</div>
    <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 8 }}>{acct.pets.map((p) => (
      <button key={p.id} onClick={() => switchPet(p.id)} className="card" style={{ minWidth: 92, padding: "10px 6px 8px", cursor: "pointer", border: p.id === pet.id ? "1px solid #1DB954" : "1px solid rgba(255,255,255,.06)", background: p.id === pet.id ? "#16241c" : "#181818", display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <Creature species={p.species} stage={p.stage} vitality={p.vitality} size={56} skin={p.skin} /><span className="disp" style={{ color: "#fff", fontSize: 12, fontWeight: 600, marginTop: 2 }}>{p.name} {pBadge(p)}</span><span className="muted" style={{ fontSize: 10 }}>{TIERS[p.stage]} · {p.totalXp}xp</span></button>))}</div>
    <div className="muted" style={{ fontSize: 11.5, marginBottom: 18 }}>Win rare pets from the daily spin. Each keeps its own XP, tier and style.</div>
    <div className="eyebrow" style={{ marginBottom: 10 }}>Evolution journey</div>
    <div className="card" style={{ padding: "16px 6px", marginBottom: 16 }}><div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>{TIERS.map((t, i) => (
      <div key={t} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: i <= pet.stage ? 1 : 0.3 }}><Creature species={pet.species} stage={i} vitality={80} size={52} skin={pet.skin} /><span className="disp" style={{ fontSize: 9, fontWeight: 600, color: i === pet.stage ? "#1DB954" : "#8a8a8a" }}>{t}</span></div>))}</div></div>
    <div className="eyebrow" style={{ marginBottom: 10 }}>Accessories</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>{ACCESSORIES.map((a) => { const ok = accAvail(a), on = pet.accessories.includes(a.id); return <button key={a.id} disabled={!ok} onClick={() => toggleAcc(a.id)} className="chip" style={{ opacity: ok ? 1 : 0.5, background: on ? "#16241c" : "#181818", border: on ? "1px solid #1DB954" : "1px solid rgba(255,255,255,.08)", cursor: ok ? "pointer" : "default" }}>{ok ? <Wand2 size={14} color={on ? "#1DB954" : "#c8c8c8"} /> : <Lock size={13} color="#6a6a6a" />}{a.name}{!ok && <span className="muted" style={{ fontSize: 11 }}>{a.wheel ? "spin" : a.streak ? `${a.streak}d streak` : `${a.xp}xp`}</span>}</button>; })}</div>
    <div className="eyebrow" style={{ marginBottom: 10 }}>Poses</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>{POSES.map((p) => { const ok = poseAvail(p), on = pet.pose === p.id; return <button key={p.id} disabled={!ok} onClick={() => setPose(p.id)} className="chip" style={{ opacity: ok ? 1 : 0.5, background: on ? "#16241c" : "#181818", border: on ? "1px solid #1DB954" : "1px solid rgba(255,255,255,.08)", cursor: ok ? "pointer" : "default" }}>{!ok && <Lock size={13} color="#6a6a6a" />}{p.name}{!ok && <span className="muted" style={{ fontSize: 11 }}>{p.streak ? `${p.streak}d streak` : `${p.xp}xp`}</span>}</button>; })}</div>
    {PRESTIGE_SKINS.some((s) => (pet.prestige || 0) >= 1 || true) && <>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Prestige skins</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>{PRESTIGE_SKINS.map((s) => { const ok = (pet.prestige || 0) >= s.prestige, on = pet.skin === s.id; return <button key={s.id} disabled={!ok} onClick={() => setSkin(s.id)} className="chip" style={{ opacity: ok ? 1 : 0.5, background: on ? "#241620" : "#181818", border: on ? "1px solid #F7A8C0" : "1px solid rgba(255,255,255,.08)", cursor: ok ? "pointer" : "default" }}>{ok ? <Sparkles size={13} color={on ? "#F7A8C0" : "#c8c8c8"} /> : <Lock size={13} color="#6a6a6a" />}{s.name}{!ok && <span className="muted" style={{ fontSize: 11 }}>{`★${s.prestige}`}</span>}</button>; })}</div>
    </>}
    <div className="eyebrow" style={{ marginBottom: 10 }}>Skins</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
      <button onClick={() => setSkin(null)} className="chip" style={{ background: !pet.skin ? "#16241c" : "#181818", border: !pet.skin ? "1px solid #1DB954" : "1px solid rgba(255,255,255,.08)" }}><Shirt size={14} color="#c8c8c8" />Default</button>
      {SKIN_IDS.map((s) => { const ok = ownedSkins.includes(s), on = pet.skin === s; return <button key={s} disabled={!ok} onClick={() => setSkin(s)} className="chip" style={{ opacity: ok ? 1 : 0.5, background: on ? "#16241c" : "#181818", border: on ? "1px solid #1DB954" : "1px solid rgba(255,255,255,.08)", cursor: ok ? "pointer" : "default" }}>{!ok && <Lock size={13} color="#6a6a6a" />}{SKIN_NAME[s]}{!ok && <span className="muted" style={{ fontSize: 11 }}>spin</span>}</button>; })}</div>
    <div className="eyebrow" style={{ marginBottom: 10 }}>Species of this pet</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>{["florn", "nimbo", "cinder", "mica", "bonsai"].map((k) => (
      <button key={k} onClick={() => setSpecies(k)} className="card" style={{ padding: "14px 10px 10px", cursor: "pointer", border: pet.species === k ? "1px solid #1DB954" : "1px solid rgba(255,255,255,.05)", background: pet.species === k ? "#16241c" : "#181818", display: "flex", flexDirection: "column", alignItems: "center" }}><Creature species={k} stage={pet.stage} vitality={80} size={80} /><span className="disp" style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginTop: 2 }}>{SPECIES[k].name}</span></button>))}</div>
  </div>;
}

/* ============================ CALENDAR ============================ */
function CalendarScreen({ acct }) {
  const [view, setView] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const first = new Date(view.y, view.m, 1), startDow = first.getDay(), days = new Date(view.y, view.m + 1, 0).getDate();
  const monthName = first.toLocaleString("default", { month: "long" }), tk = todayKey();
  const cells = []; for (let i = 0; i < startDow; i++) cells.push(null); for (let d = 1; d <= days; d++) cells.push(d);
  return <div className="screen">
    <div className="eyebrow">Progress</div><div className="h1" style={{ marginTop: 4, marginBottom: 16 }}>Calendar</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}><Stat icon={<Flame size={15} color="#F5C36B" />} label="Streak" value={acct.streak} /><Stat icon={<Crown size={15} color="#A9B4FF" />} label="Best" value={acct.best} /><Stat icon={<Snowflake size={15} color="#79D0E8" />} label="Freezes" value={acct.freezes} /></div>
    <div className="card" style={{ padding: 16, marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}><button className="ghost" onClick={() => setView((v) => v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 })}><ChevronLeft size={20} color="#c8c8c8" /></button><span className="disp" style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>{monthName} {view.y}</span><button className="ghost" onClick={() => setView((v) => v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 })}><ChevronRight size={20} color="#c8c8c8" /></button></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i} className="muted" style={{ textAlign: "center", fontSize: 10, fontWeight: 600, paddingBottom: 4 }}>{d}</div>)}
        {cells.map((d, i) => { if (!d) return <div key={i} />; const k = `${view.y}-${pad(view.m + 1)}-${pad(d)}`, pct = acct.history[k], isToday = k === tk, met = pct >= GOAL; const bg = pct === undefined ? "transparent" : met ? "rgba(29,185,84,.16)" : "rgba(249,138,138,.14)"; const bd = pct === undefined ? "1px solid rgba(255,255,255,.05)" : met ? "1px solid rgba(29,185,84,.45)" : "1px solid rgba(249,138,138,.35)"; return <div key={i} style={{ aspectRatio: "1", borderRadius: 11, background: bg, border: isToday ? "1.5px solid #1DB954" : bd, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}><span style={{ fontSize: 12, fontWeight: 600, color: pct === undefined ? "#6a6a6a" : "#e9ebef" }}>{d}</span>{met && <Flame size={9} color="#F5C36B" fill="#F5C36B" style={{ position: "absolute", bottom: 3 }} />}</div>; })}
      </div>
    </div>
    <div style={{ display: "flex", gap: 16, justifyContent: "center" }}><Legend c="#1DB954" t="Goal met" /><Legend c="#F98A8A" t="Under goal" /><span className="muted" style={{ fontSize: 12 }}>{Object.keys(acct.history).length} days logged</span></div>
  </div>;
}
const Legend = ({ c, t }) => <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: 3, background: c }} /><span className="muted" style={{ fontSize: 12 }}>{t}</span></span>;

/* ============================ RANKS (global / friends / requests) ============================ */
function Ranks({ users, me, acct, list, activeId, myRank, friends, incoming, sent, onOpen, onRefresh, onAccept, onDecline, onCancel }) {
  const [sub, setSub] = useState("global");
  const [gmode, setGmode] = useState("total");
  const [gsp, setGsp] = useState("florn");
  useEffect(() => { if (onRefresh) onRefresh(); }, [sub]);
  // total XP per user (sum of their pets)
  const totals = Object.values(users).filter((u) => u.email !== DEV.email).map((u) => ({ owner: u.username, total: (u.pets || []).reduce((s, p) => s + (p.totalXp || 0), 0), top: topPet(u) })).sort((a, b) => b.total - a.total);
  const bySpecies = list.filter((u) => u.species === gsp);
  const speciesIds = ["florn", "nimbo", "cinder", "mica", "bonsai", "vesper"];
  return <div className="screen">
    <Header left={<><div className="eyebrow">Community</div><div className="h1" style={{ marginTop: 4 }}>Ranks</div></>} right={<div style={{ display: "flex", gap: 8 }}><button className="ghost" onClick={() => onRefresh && onRefresh()}><RefreshCw size={16} color="#8a8a8a" /></button><button className="avatarbtn" onClick={() => onOpen(me)}><Creature species={topPet(acct).species} stage={topPet(acct).stage} vitality={topPet(acct).vitality} size={30} skin={topPet(acct).skin} /></button></div>} />
    <div className="segwrap">
      {[["global", "Global", Globe], ["friends", "Friends", Users], ["requests", "Requests", Bell]].map(([id, l, Ic]) => (
        <button key={id} className={`seg ${sub === id ? "on" : ""}`} onClick={() => setSub(id)}><Ic size={14} />{l}{id === "requests" && incoming.length > 0 && <span className="segbadge">{incoming.length}</span>}</button>))}
    </div>

    {sub === "global" && <>
      <div className="segwrap" style={{ marginTop: 4 }}>
        <button className={`seg ${gmode === "total" ? "on" : ""}`} onClick={() => setGmode("total")}>Total XP</button>
        <button className={`seg ${gmode === "species" ? "on" : ""}`} onClick={() => setGmode("species")}>By species</button>
      </div>

      {gmode === "total" && <>
        <div className="muted" style={{ fontSize: 12.5, margin: "4px 0 12px" }}>Trainers ranked by every pet's XP combined.</div>
        {totals.map((u, i) => { const mine = u.owner === me, m = i === 0 ? "#F5C36B" : i === 1 ? "#C9CDD6" : i === 2 ? "#D8956B" : null;
          return <button key={u.owner} onClick={() => onOpen(u.owner)} className="card rowbtn" style={{ border: mine ? "1px solid #1DB954" : "1px solid rgba(255,255,255,.05)", background: mine ? "#141d1a" : "#181818" }}>
            <div style={{ width: 26, textAlign: "center" }}>{m ? <Medal size={20} color={m} /> : <span className="disp" style={{ color: "#8a8a8a", fontWeight: 700, fontSize: 15 }}>{i + 1}</span>}</div>
            <div className="petframe"><Creature species={u.top.species} stage={u.top.stage} vitality={u.top.vitality} size={40} skin={u.top.skin} /></div>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}><div className="disp" style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>@{u.owner}{mine && <span style={{ color: "#1DB954", fontSize: 12 }}> · you</span>}</div><div className="muted" style={{ fontSize: 12 }}>{(users[u.owner].pets || []).length} pet{(users[u.owner].pets || []).length > 1 ? "s" : ""}</div></div>
            <div style={{ textAlign: "right" }}><div className="disp" style={{ color: "#F5C36B", fontWeight: 700, fontSize: 15 }}>{u.total}</div><div className="muted" style={{ fontSize: 10 }}>total XP</div></div>
          </button>; })}
      </>}

      {gmode === "species" && <>
        <div style={{ display: "flex", gap: 7, overflowX: "auto", padding: "6px 0 12px" }}>{speciesIds.map((sp) => (
          <button key={sp} onClick={() => setGsp(sp)} className="chip" style={{ flexShrink: 0, background: gsp === sp ? "#16241c" : "#181818", border: gsp === sp ? "1px solid #1DB954" : "1px solid rgba(255,255,255,.08)" }}>{SPECIES[sp].name}</button>))}</div>
        <div className="muted" style={{ fontSize: 12.5, marginBottom: 10 }}>Top {SPECIES[gsp].name} companions by XP.</div>
        {!bySpecies.length && <div className="muted" style={{ fontSize: 13, textAlign: "center", padding: 20 }}>No {SPECIES[gsp].name} yet.</div>}
        {bySpecies.map((u, i) => { const mine = u.owner === me && u.id === activeId, m = i === 0 ? "#F5C36B" : i === 1 ? "#C9CDD6" : i === 2 ? "#D8956B" : null;
          return <button key={u.owner + u.id} onClick={() => onOpen(u.owner)} className="card rowbtn" style={{ border: mine ? "1px solid #1DB954" : "1px solid rgba(255,255,255,.05)", background: mine ? "#141d1a" : "#181818" }}>
            <div style={{ width: 26, textAlign: "center" }}>{m ? <Medal size={20} color={m} /> : <span className="disp" style={{ color: "#8a8a8a", fontWeight: 700, fontSize: 15 }}>{i + 1}</span>}</div>
            <div className="petframe"><Creature species={u.species} stage={u.stage} vitality={u.vit} size={40} skin={u.skin} /></div>
            <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}><div className="disp" style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{u.name}{(u.prestige || 0) > 0 && <span className="prestige">★{u.prestige}</span>}</div><div className="muted" style={{ fontSize: 12 }}>@{u.owner} · {TIERS[u.stage]}</div></div>
            <div style={{ textAlign: "right" }}><div className="disp" style={{ color: "#F5C36B", fontWeight: 700, fontSize: 15 }}>{u.totalXp}</div><div className="muted" style={{ fontSize: 10 }}>XP</div></div>
          </button>; })}
      </>}
    </>}

    {sub === "friends" && <>
      {!friends.length && <div className="card" style={{ padding: 26, textAlign: "center", marginTop: 6 }}><Users size={26} color="#6a6a6a" style={{ marginBottom: 8 }} /><div className="muted" style={{ fontSize: 13.5 }}>No friends yet. Open someone from the Global tab and send a request.</div></div>}
      {friends.map((f) => { const tp = topPet(f); return <button key={f.username} onClick={() => onOpen(f.username)} className="card rowbtn">
        <div className="petframe"><Creature species={tp.species} stage={tp.stage} vitality={tp.vitality} size={40} skin={tp.skin} /></div>
        <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}><div className="disp" style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>@{f.username}</div><div className="muted" style={{ fontSize: 12 }}>🔥 {f.streak} · best {f.best} · top {tp.totalXp}xp</div></div>
        <ChevronRight size={18} color="#6a6a6a" />
      </button>; })}
    </>}

    {sub === "requests" && <>
      <div className="eyebrow" style={{ margin: "8px 0 10px" }}>Incoming</div>
      {!incoming.length && <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>No incoming requests.</div>}
      {incoming.map((r) => users[r] && <div key={r} className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <button onClick={() => onOpen(r)} className="petframe" style={{ border: "none", cursor: "pointer" }}><Creature species={topPet(users[r]).species} stage={topPet(users[r]).stage} vitality={70} size={38} /></button>
        <div style={{ flex: 1 }}><div className="disp" style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>@{r}</div><div className="muted" style={{ fontSize: 11 }}>wants to be friends</div></div>
        <button className="minibtn" style={{ background: "#1DB954", color: "#08130d" }} onClick={() => onAccept(r)}><Check size={16} /></button>
        <button className="minibtn" style={{ background: "#242424", color: "#c8c8c8" }} onClick={() => onDecline(r)}><X size={16} /></button>
      </div>)}
      <div className="eyebrow" style={{ margin: "16px 0 10px" }}>Sent</div>
      {!sent.length && <div className="muted" style={{ fontSize: 13 }}>No pending sent requests.</div>}
      {sent.map((r) => users[r] && <div key={r} className="card" style={{ padding: 12, display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <div className="petframe"><Creature species={topPet(users[r]).species} stage={topPet(users[r]).stage} vitality={70} size={38} /></div>
        <div style={{ flex: 1 }}><div className="disp" style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>@{r}</div><div className="muted" style={{ fontSize: 11 }}>request pending</div></div>
        <button className="chip" onClick={() => onCancel(r)}>Cancel</button>
      </div>)}
    </>}
  </div>;
}

/* ============================ PROFILE MODAL ============================ */
function ProfileModal({ user, rel, onClose, onSend, onAccept, onDecline, onCancel, onRemove, onSave }) {
  const [edit, setEdit] = useState(false), [bio, setBio] = useState(user.profile?.bio || ""), [accent, setAccent] = useState(user.profile?.accent || "#1DB954");
  const [title, setTitle] = useState(user.profile?.title || "newcomer");
  const tp = topPet(user);
  const acc = user.profile?.accent || "#1DB954";
  const owned = ownedTitles(user);
  const equippedTitle = TITLES.find((t) => t.id === (user.profile?.title || "newcomer")) || TITLES[0];
  const isOwnerTitle = equippedTitle.id === "creator";
  return <div className="sheetwrap" onClick={onClose}><div className="sheet" onClick={(e) => e.stopPropagation()} style={{ paddingBottom: 30 }}>
    <div className="grab" />
    <div style={{ height: 66, borderRadius: 18, background: `linear-gradient(135deg,${acc}44,${acc}11)`, position: "relative", marginBottom: 40 }}>
      <div style={{ position: "absolute", left: 20, bottom: -32, width: 72, height: 72, borderRadius: 20, background: "#101010", border: `2px solid ${acc}`, display: "flex", alignItems: "center", justifyContent: "center" }}><Creature species={tp.species} stage={tp.stage} vitality={tp.vitality} size={58} skin={tp.skin} /></div>
    </div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div><div className="disp" style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>@{user.username}</div>
        <div style={{ marginTop: 2 }}><span className="titlebadge" style={isOwnerTitle ? { background: "linear-gradient(90deg,#F7A8C0,#FFD23F)", color: "#2a0f14" } : {}}>{equippedTitle.name}</span></div>
        <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>Since {sinceDate(user.createdAt)} · {user.pets.length} pet{user.pets.length > 1 ? "s" : ""}</div></div>
      {rel === "self" && !edit && <button className="chip" onClick={() => setEdit(true)}><Pencil size={13} />Edit</button>}
    </div>

    {edit ? <div style={{ marginTop: 14 }}>
      <label className="lbl">Bio</label><input className="txt" value={bio} maxLength={80} onChange={(e) => setBio(e.target.value)} placeholder="Say something…" />
      <label className="lbl">Accent</label><div style={{ display: "flex", gap: 10, marginTop: 4 }}>{ACCENTS.map((c) => <button key={c} onClick={() => setAccent(c)} style={{ width: 30, height: 30, borderRadius: "50%", background: c, cursor: "pointer", border: accent === c ? "2px solid #fff" : "2px solid transparent" }} />)}</div>
      <label className="lbl">Title</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{TITLES.map((t) => { const has = owned.some((o) => o.id === t.id); return <button key={t.id} disabled={!has} onClick={() => setTitle(t.id)} className="chip" style={{ opacity: has ? 1 : 0.5, background: title === t.id ? "#16241c" : "#181818", border: title === t.id ? "1px solid #1DB954" : "1px solid rgba(255,255,255,.08)", cursor: has ? "pointer" : "default" }}>{!has && <Lock size={12} color="#6a6a6a" />}{t.name}{!has && <span className="muted" style={{ fontSize: 10.5 }}>{t.how}</span>}</button>; })}</div>
      <button className="btn" style={{ marginTop: 18, background: "#1DB954", color: "#08130d" }} onClick={() => { onSave({ bio: bio.trim(), accent, title }); setEdit(false); }}>Save profile</button>
    </div> : <>
      {user.profile?.bio && <div style={{ color: "#d0d0d0", fontSize: 13.5, marginTop: 12, lineHeight: 1.5 }}>{user.profile.bio}</div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, margin: "16px 0" }}>
        <Stat icon={<Flame size={15} color="#F5C36B" />} label="Current streak" value={user.streak} />
        <Stat icon={<Crown size={15} color="#A9B4FF" />} label="Longest streak" value={user.best} />
      </div>
      <div className="eyebrow" style={{ marginBottom: 10 }}>Top companion</div>
      <div className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
        <div className="petframe" style={{ width: 52, height: 52 }}><Creature species={tp.species} stage={tp.stage} vitality={tp.vitality} size={46} skin={tp.skin} accessories={tp.accessories} /></div>
        <div style={{ flex: 1 }}><div className="disp" style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{tp.name}{(tp.prestige || 0) > 0 && <span className="prestige">★{tp.prestige}</span>}</div><div className="muted" style={{ fontSize: 12 }}>{SPECIES[tp.species].name} · {TIERS[tp.stage]}</div></div>
        <div style={{ textAlign: "right" }}><div className="disp" style={{ color: "#F5C36B", fontWeight: 700, fontSize: 16 }}>{tp.totalXp}</div><div className="muted" style={{ fontSize: 10 }}>XP</div></div>
      </div>
      {rel === "none" && <button className="btn" style={{ background: "#1DB954", color: "#08130d" }} onClick={onSend}><span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><UserPlus size={17} />Send friend request</span></button>}
      {rel === "out" && <button className="btn" style={{ background: "#242424", color: "#c8c8c8" }} onClick={onCancel}>Requested · tap to cancel</button>}
      {rel === "in" && <div style={{ display: "flex", gap: 10 }}><button className="btn" style={{ background: "#1DB954", color: "#08130d" }} onClick={onAccept}>Accept</button><button className="btn" style={{ background: "#242424", color: "#c8c8c8" }} onClick={onDecline}>Decline</button></div>}
      {rel === "friend" && <button className="btn" style={{ background: "#16241c", color: "#1DB954", border: "1px solid #1DB954" }} onClick={onRemove}><span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><UserCheck size={17} />Friends · tap to remove</span></button>}
    </>}
  </div></div>;
}

/* ============================ DEV ============================ */
function DevDashboard({ users, onLogout, onDelete }) {
  const [q, setQ] = useState("");
  const list = Object.values(users).sort((a, b) => b.lastActive - a.lastActive).filter((u) => { const s = q.trim().toLowerCase(); if (!s) return true; return u.username.toLowerCase().includes(s) || u.email.toLowerCase().includes(s) || u.pets.some((p) => p.name.toLowerCase().includes(s)); });
  const totalPets = Object.values(users).reduce((s, u) => s + u.pets.length, 0);
  return <div className="wrap"><Style /><div className="phone" style={{ overflowY: "auto", padding: "24px 20px 30px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Shield size={18} color="#F98A8A" /><div className="eyebrow" style={{ color: "#F98A8A" }}>Dev console</div></div><button className="ghost" onClick={onLogout}><LogOut size={16} color="#8a8a8a" /></button></div>
    <div className="h1" style={{ marginBottom: 14 }}>All users</div>
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#181818", border: "1px solid rgba(255,255,255,.08)", borderRadius: 14, padding: "11px 14px", marginBottom: 16 }}><Search size={17} color="#8a8a8a" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search username, email or pet…" style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 14, fontFamily: "Inter,sans-serif" }} />{q && <button onClick={() => setQ("")} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={15} color="#8a8a8a" /></button>}</div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}><Stat icon={<Users size={15} color="#1DB954" />} label="Users" value={Object.keys(users).length} /><Stat icon={<Sparkles size={15} color="#A9B4FF" />} label="Pets" value={totalPets} /><Stat icon={<Flame size={15} color="#F5C36B" />} label="Top streak" value={Object.values(users).reduce((m, u) => Math.max(m, u.best), 0)} /></div>
    {!Object.keys(users).length && <div className="card" style={{ padding: 24, textAlign: "center" }}><div className="muted" style={{ fontSize: 14 }}>No users have signed up yet.</div></div>}
    {list.map((u) => { const p = u.pets.find((x) => x.id === u.activePet) || u.pets[0]; return <div key={u.username} className="card" style={{ padding: 14, marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div className="petframe" style={{ width: 48, height: 48 }}><Creature species={p.species} stage={p.stage} vitality={p.vitality} size={42} skin={p.skin} /></div><div style={{ flex: 1, minWidth: 0 }}><div className="disp" style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>@{u.username} <span className="muted" style={{ fontWeight: 400, fontSize: 12 }}>· {u.pets.length} pet{u.pets.length > 1 ? "s" : ""} · {(u.follows || []).length} connections</span></div><div className="muted" style={{ fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div></div><div style={{ display: "flex", alignItems: "center", gap: 5 }}><span className="dot" style={{ background: Date.now() - u.lastActive < 86400000 ? "#1DB954" : "#5a5a5a" }} /><span className="muted" style={{ fontSize: 11 }}>{relTime(u.lastActive)}</span></div></div>
      <div style={{ display: "flex", gap: 12, marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,.06)", flexWrap: "wrap", alignItems: "center" }}><Kv k="Active pet" v={p.name} /><Kv k="Tier" v={TIERS[p.stage]} /><Kv k="XP" v={p.totalXp} /><Kv k="Streak" v={u.streak} /><Kv k="Best" v={u.best} /><Kv k="Vit" v={`${p.vitality}%`} />
        <button className="delbtn" onClick={() => { if (window.confirm(`Delete @${u.username}'s account and all their pets? This can't be undone.`)) onDelete(u.username); }}><Trash2 size={14} />Delete</button></div>
    </div>; })}
  </div></div>;
}
const Kv = ({ k, v }) => <div style={{ minWidth: 54 }}><div className="muted" style={{ fontSize: 10, marginBottom: 2 }}>{k}</div><div className="disp" style={{ color: "#e9ebef", fontSize: 14, fontWeight: 600 }}>{v}</div></div>;

/* ============================ WHEEL ============================ */
function WheelModal({ onClose, roll, grant }) {
  const [spinning, setSpinning] = useState(false), [rot, setRot] = useState(0), [result, setResult] = useState(null);
  const segs = [{ icon: Snowflake, c: "#79D0E8" }, { icon: Sparkles, c: "#A9B4FF" }, { icon: Wand2, c: "#F5C36B" }, { icon: Snowflake, c: "#79D0E8" }, { icon: Shirt, c: "#C9A7F0" }, { icon: Sparkles, c: "#A9B4FF" }, { icon: Wand2, c: "#F5C36B" }, { icon: Gift, c: "#1DB954" }];
  const spin = () => { if (spinning || result) return; const { slice, reward, label } = roll(); setSpinning(true); setRot(360 * 5 + (360 - slice * 45 - 22.5)); setTimeout(() => { grant(reward); setResult(label); setSpinning(false); }, 3400); };
  return <div className="sheetwrap" onClick={onClose}><div className="sheet" onClick={(e) => e.stopPropagation()}>
    <div className="grab" />
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}><Gift size={18} color="#1DB954" /><span className="disp" style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>Daily spin</span></div>
    <div className="muted" style={{ fontSize: 13, marginBottom: 18 }}>One reward for completing today. Freezes, accessories, skins — or, rarely, a new pet.</div>
    <div style={{ position: "relative", width: 220, height: 220, margin: "0 auto 18px" }}>
      <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", zIndex: 3, width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderTop: "14px solid #1DB954" }} />
      <div style={{ width: "100%", height: "100%", borderRadius: "50%", transform: `rotate(${rot}deg)`, transition: spinning ? "transform 3.3s cubic-bezier(.15,.9,.2,1)" : "none", position: "relative", border: "3px solid #232323", background: "#111" }}>
        {segs.map((s, i) => { const Ic = s.icon; const a = i * 45 + 22.5; return <div key={i} style={{ position: "absolute", top: "50%", left: "50%", transform: `rotate(${a}deg) translateY(-78px) rotate(${-a}deg)`, marginLeft: -12, marginTop: -12 }}><Ic size={20} color={s.c} /></div>; })}
        {segs.map((_, i) => <div key={"l" + i} style={{ position: "absolute", top: "50%", left: "50%", width: "50%", height: 1, background: "rgba(255,255,255,.05)", transformOrigin: "left center", transform: `rotate(${i * 45}deg)` }} />)}
        <div style={{ position: "absolute", inset: 0, margin: "auto", width: 40, height: 40, borderRadius: "50%", background: "#1DB954", display: "flex", alignItems: "center", justifyContent: "center" }}><Sparkles size={18} color="#08130d" /></div>
      </div>
    </div>
    {result ? <><div className="reward"><span className="muted" style={{ fontSize: 12 }}>You won</span><div className="disp" style={{ color: "#1DB954", fontSize: 20, fontWeight: 700 }}>{result}</div></div><button className="btn" style={{ background: "#1DB954", color: "#08130d", marginTop: 14 }} onClick={onClose}>Collect</button></> : <button className="btn" disabled={spinning} style={{ background: spinning ? "#1c1c1c" : "#1DB954", color: spinning ? "#6a6a6a" : "#08130d" }} onClick={spin}>{spinning ? "Spinning…" : "Spin"}</button>}
  </div></div>;
}

/* ============================ STYLE ============================ */
function Style() {
  return <style>{`
    *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
    .wrap{min-height:100vh;width:100%;display:flex;align-items:center;justify-content:center;background:#000;font-family:'Inter',system-ui,sans-serif;padding:16px}
    .phone{position:relative;width:100%;max-width:412px;height:min(880px,94vh);background:#0a0a0a;border-radius:40px;overflow:hidden;box-shadow:0 40px 120px rgba(0,0,0,.7),inset 0 0 0 1px rgba(255,255,255,.05)}
    .screen{position:absolute;inset:0;bottom:76px;overflow-y:auto;padding:22px 20px 30px}
    .screen::-webkit-scrollbar,.phone::-webkit-scrollbar{display:none}
    .disp{font-family:'Space Grotesk',sans-serif}
    .eyebrow{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#7a7a7a;font-weight:700}
    .h1{font-family:'Space Grotesk',sans-serif;color:#fff;font-size:26px;font-weight:700;letter-spacing:-.01em}
    .muted{color:#9a9a9a}
    .card{background:#181818;border-radius:20px;border:1px solid rgba(255,255,255,.05)}
    .rowbtn{width:100%;padding:12px 14px;display:flex;align-items:center;gap:12px;margin-bottom:10px;cursor:pointer;font-family:inherit;transition:filter .15s}
    .rowbtn:hover{filter:brightness(1.15)}
    .petframe{width:46px;height:46px;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:#101010;border-radius:12px}
    .habit{display:flex;align-items:center;gap:14px;padding:15px 16px;background:#181818;border-radius:16px;border:1px solid rgba(255,255,255,.05);margin-bottom:10px;transition:transform .18s}
    .habit:active{transform:scale(.985)}
    .hicon{width:42px;height:42px;border-radius:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
    .check{width:26px;height:26px;border-radius:9px;border:2px solid #3a3a3a;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .2s}
    .durpill{display:inline-flex;align-items:center;gap:3px;margin-left:8px;padding:2px 7px;border-radius:999px;background:#242424;color:#9a9a9a;font-size:11px;font-weight:600;vertical-align:middle}
    .btn{flex:1;width:100%;border:none;border-radius:999px;padding:15px;font-family:'Space Grotesk',sans-serif;font-weight:700;font-size:15px;cursor:pointer;transition:transform .15s,filter .15s}
    .btn:active{transform:scale(.98)}
    .btn:hover:not(:disabled){filter:brightness(1.07)}
    .tabbar{position:absolute;left:0;right:0;bottom:0;height:76px;background:rgba(10,10,10,.92);backdrop-filter:blur(20px);border-top:1px solid rgba(255,255,255,.07);display:flex;padding:8px 6px 20px}
    .tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;border:none;background:none;color:#6a6a6a;font-size:10px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:color .2s}
    .tab.on{color:#1DB954}
    .badge{position:absolute;top:-2px;right:calc(50% - 22px);background:#F98A8A;color:#0a0a0a;font-size:9px;font-weight:800;min-width:15px;height:15px;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0 3px}
    .flash{position:absolute;left:16px;right:16px;top:16px;z-index:40;background:#232323;border:1px solid rgba(29,185,84,.35);border-radius:14px;padding:13px 16px;color:#fff;font-size:13px;font-weight:500;text-align:center;box-shadow:0 20px 50px rgba(0,0,0,.6);animation:drop .35s cubic-bezier(.2,.8,.2,1)}
    @keyframes drop{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}
    .spinpill{width:100%;display:flex;align-items:center;gap:10px;background:linear-gradient(90deg,rgba(29,185,84,.14),rgba(29,185,84,.04));border:1px solid rgba(29,185,84,.3);color:#e9ebef;border-radius:14px;padding:12px 16px;font-size:13.5px;font-weight:600;cursor:pointer;margin-bottom:10px;font-family:'Inter',sans-serif;transition:filter .15s}
    .spinpill:hover{filter:brightness(1.15)}
    .segwrap{display:flex;gap:6px;background:#141414;border-radius:14px;padding:5px;margin-bottom:8px}
    .seg{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;border:none;background:none;color:#8a8a8a;font-size:12.5px;font-weight:600;padding:9px 4px;border-radius:10px;cursor:pointer;font-family:'Inter',sans-serif;position:relative;transition:all .18s}
    .seg.on{background:#242424;color:#fff}
    .segbadge{background:#F98A8A;color:#0a0a0a;font-size:9px;font-weight:800;min-width:15px;height:15px;border-radius:8px;display:flex;align-items:center;justify-content:center}
    .avatarbtn{width:44px;height:44px;border-radius:14px;background:#181818;border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;cursor:pointer}
    .minibtn{width:38px;height:38px;border-radius:11px;border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}
    .c-breathe{animation:breathe 3.6s ease-in-out infinite;transform-origin:center}
    @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.02)}}
    .c-float{animation:floaty 4s ease-in-out infinite;transform-origin:center}
    @keyframes floaty{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
    .c-spin{animation:spin 16s linear infinite;transform-origin:center}
    @keyframes spin{to{transform:rotate(360deg)}}
    .c-wave{animation:wave 1s ease-in-out infinite;transform-origin:56px -28px}
    @keyframes wave{0%,100%{transform:rotate(6deg)}50%{transform:rotate(-14deg)}}
    .sp{position:absolute;border-radius:50%;pointer-events:none;animation:fly 1.2s ease-out forwards}
    @keyframes fly{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0)}}
    input.txt{width:100%;background:#101010;border:1px solid rgba(255,255,255,.1);border-radius:12px;padding:14px;color:#fff;font-size:15px;font-family:'Inter',sans-serif;outline:none;margin-bottom:2px}
    input.txt:focus{border-color:rgba(29,185,84,.6)}
    .lbl{display:block;font-size:12px;color:#9a9a9a;font-weight:500;margin:14px 0 6px}
    .chip{padding:9px 13px;border-radius:999px;border:1px solid rgba(255,255,255,.09);background:#181818;color:#d0d0d0;font-size:13px;font-weight:500;cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:all .18s}
    .link{background:none;border:none;color:#1DB954;font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif}
    .ghost{background:#181818;border:1px solid rgba(255,255,255,.07);border-radius:12px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .note{background:#1c1c1c;border:1px solid rgba(245,195,107,.25);border-radius:12px;padding:11px 14px;color:#d6c39a;font-size:12.5px;margin:14px 0}
    .err{color:#F98A8A;font-size:13px;margin-top:14px;text-align:center}
    .dot{width:8px;height:8px;border-radius:50%;display:inline-block}
    .sheetwrap{position:absolute;inset:0;z-index:60;background:rgba(0,0,0,.6);display:flex;align-items:flex-end;animation:fade .2s}
    @keyframes fade{from{opacity:0}to{opacity:1}}
    .sheet{width:100%;background:#121212;border-radius:26px 26px 40px 40px;padding:14px 22px 26px;border-top:1px solid rgba(255,255,255,.08);animation:up .3s cubic-bezier(.2,.8,.2,1);max-height:88%;overflow-y:auto}
    .sheet::-webkit-scrollbar{display:none}
    @keyframes up{from{transform:translateY(100%)}to{transform:translateY(0)}}
    .grab{width:38px;height:4px;border-radius:2px;background:#3a3a3a;margin:0 auto 16px}
    .reward{text-align:center;background:#101c14;border:1px solid rgba(29,185,84,.3);border-radius:14px;padding:14px;margin-top:6px;animation:drop .3s}
    .wheelscroll{scrollbar-width:none;-ms-overflow-style:none}
    .wheelscroll::-webkit-scrollbar{display:none}
    .chatwrap{position:absolute;inset:0;z-index:70;background:#0a0a0a;display:flex;flex-direction:column;animation:up .3s cubic-bezier(.2,.8,.2,1)}
    .chathead{display:flex;align-items:center;gap:12px;padding:20px 16px 14px;border-bottom:1px solid rgba(255,255,255,.06);background:#121212}
    .chatrow{width:100%;display:flex;align-items:center;gap:12px;padding:12px 10px;background:none;border:none;border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer;font-family:inherit}
    .chatrow:active{background:#151515}
    .bubble{max-width:76%;padding:9px 13px;border-radius:16px;font-size:14px;line-height:1.35;position:relative;color:#fff;word-wrap:break-word}
    .bubble.mine{align-self:flex-end;background:#1DB954;color:#08130d;border-bottom-right-radius:5px}
    .bubble.theirs{align-self:flex-start;background:#232323;border-bottom-left-radius:5px}
    .btime{display:block;font-size:9px;opacity:.6;text-align:right;margin-top:2px}
    .chatinput{display:flex;align-items:center;gap:8px;padding:12px 14px 20px;border-top:1px solid rgba(255,255,255,.06);background:#121212}
    .sendbtn{width:44px;height:44px;flex-shrink:0;border-radius:50%;border:none;background:#1DB954;display:flex;align-items:center;justify-content:center;cursor:pointer}
    .prestige{display:inline-block;margin-left:6px;padding:1px 7px;border-radius:999px;background:linear-gradient(90deg,#F7A8C0,#E8632B);color:#2a0f14;font-size:11px;font-weight:800;font-family:'Space Grotesk',sans-serif;vertical-align:middle}
    .titlebadge{display:inline-block;padding:2px 10px;border-radius:999px;background:#242424;color:#c8c8c8;font-size:11.5px;font-weight:700;font-family:'Space Grotesk',sans-serif;border:1px solid rgba(255,255,255,.08)}
    .delbtn{margin-left:auto;display:inline-flex;align-items:center;gap:5px;background:rgba(249,138,138,.12);border:1px solid rgba(249,138,138,.35);color:#F98A8A;font-size:12px;font-weight:600;padding:6px 11px;border-radius:10px;cursor:pointer;font-family:'Inter',sans-serif}
    .delbtn:hover{background:rgba(249,138,138,.22)}
    .c-flick{animation:flick .5s ease-in-out infinite alternate;transform-origin:center bottom}
    @keyframes flick{0%{transform:scaleY(1) scaleX(1)}100%{transform:scaleY(1.12) scaleX(.94)}}
  `}</style>;
}
