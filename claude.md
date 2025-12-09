# AIGymBro Project Restructure Plan

This document outlines how to reorganize your **AIGymBro** project into a cleaner, more scalable structure and add essential features such as authentication using Supabase and AI-powered workout/meal insights using the Groq API.

---

## 1. Goals

- Clean and modern project structure
- Add **Supabase Auth** (Signup, Login, Session persistence)
- Store user-specific workout and meal plans
- Allow users to input results/progress
- Add AI Coach (Groq API) to generate insights/plans
- Create a `claude.md` file for Quergenerate/Claude usage

---

## 2. Recommended Project Structure

```
/aigymbro
├── src
│   ├── app
│   │   ├── layout.tsx
│   │   ├── page.tsx (homepage)
│   │   ├── dashboard
│   │   │   ├── page.tsx
│   │   │   ├── workouts/
│   │   │   ├── meals/
│   │   │   ├── progress/
│   │   └── auth
│   │       ├── login.tsx
│   │       ├── signup.tsx
│   ├── components
│   │   ├── Navbar.tsx
│   │   ├── WorkoutCard.tsx
│   │   ├── MealCard.tsx
│   │   └── ProgressForm.tsx
│   ├── lib
│   │   ├── supabase.ts
│   │   ├── groq.ts
│   └── utils
│       ├── validations.ts
│       └── helpers.ts
├── public
├── .env.local
├── package.json
└── claude.md
```

---

## 3. .env.local Configuration

> **Do NOT commit this file.**

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
GROQ_API_KEY=your_groq_key_here
```

---

## 4. Supabase Setup

### **lib/supabase.ts**

Use the official Supabase JS Client:

```ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

### **Auth Pages**

- `/auth/signup`
- `/auth/login`
- Use Supabase email+password auth
- Store user session in local storage (Supabase auto-handles this)

---

## 5. AI Integration (Groq API)

### **lib/groq.ts**

```ts
export async function aiCoach(prompt: string) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
}
```

---

## 6. User Data Structure in Supabase

### Tables Needed

#### **1. profiles**

```
- id (uuid, PK)
- email
- created_at
```

#### **2. workouts**

```
- id
- user_id (FK)
- name
- description
- created_at
```

#### **3. meals**

```
- id
- user_id
- title
- calories
- created_at
```

#### **4. progress_logs**

```
- id
- user_id
- date
- weight
- notes
```

---

## 7. claude.md (Full Version)

```
# Claude Context File — AIGymBro

You are an AI assistant helping to develop **AIGymBro**, a fitness application that provides:
- Personalized workout planning
- Personalized meal planning
- Progress tracking
- AI‑generated coaching insights using Groq LLaMA models
- Fully user‑specific data using Supabase Auth + Supabase Database

Your job is to help write, refactor, or generate code for this project following the rules and architecture below.

---

## 🚀 Project Description
AIGymBro is a Next.js-based app where users can:
1. Sign up / Log in using Supabase Authentication
2. Create and view workout plans
3. Create and view meal plans
4. Input their progress logs (weight, notes, etc.)
5. Ask the AI Coach for personalized fitness/meal advice
6. Store all data in Supabase, scoped per authenticated user

---

## 📁 Project Architecture (Important)
```

/src
/app
/auth
login.tsx
signup.tsx
/dashboard
page.tsx
/workouts
/meals
/progress
layout.tsx
page.tsx
/components
/lib
supabase.ts
groq.ts
/utils
claude.md
.env.local

```
You must always follow this structure when generating files.

---

## 🔑 Environment Variables
Never hardcode keys. Always reference:
```

process.env.NEXT_PUBLIC_SUPABASE_URL
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
process.env.GROQ_API_KEY

```

---

## 🔌 Supabase Usage Rules
- Use **Supabase Auth** for login/signup
- Use **Row Level Security (RLS)** to restrict data by user
- Use **supabase.from("table").insert()** etc for queries
- Every record must contain a `user_id` = authenticated user's ID

### Database Tables
You may generate code assuming these tables exist:

#### profiles
- id (uuid)
- email
- created_at

#### workouts
- id
- user_id
- name
- description
- created_at

#### meals
- id
- user_id
- title
- calories
- created_at

#### progress_logs
- id
- user_id
- date
- weight
- notes

If asked, you may generate SQL migrations for these.

---

## 🤖 Groq API Rules (AI Coach)
When generating backend or client calls:
- Use model: `llama3-70b-8192`
- Use POST endpoint: `https://api.groq.com/openai/v1/chat/completions`
- Return only `data.choices[0].message.content`

---

## 📘 When Generating Code
- Use TypeScript
- Use React Server Components when possible
- Avoid unnecessary external dependencies
- Keep files modular and match the folder structure
- Write clear, readable code

---

## 🧠 Agent Capabilities
You (Claude Agent) MAY:
- Generate SQL schemas
- Generate Supabase Migration scripts
- Generate API routes
- Add/modify tables
- Enforce policies
- Create forms, components, and business logic
- Create seeding scripts

You MAY NOT:
- Embed real API keys
- Break environment variable rules
- Output code outside the project structure above

---

## 📝 Styling Rules
- Minimal, clean UI
- Use Tailwind CSS
- Components should remain reusable and stateless when possible

---

## 🧩 Additional Context

### New Rule: Supabase Queries Export
The agent **must place ALL SQL queries, schema definitions, migrations, policies, and table creation commands** into a file named:
```

supabase.md

```
Located in the project root.

This includes:
- CREATE TABLE statements
- ALTER TABLE statements
- Row Level Security (RLS) policies
- Seed data
- Example queries for developers
- Any SQL needed to set up or modify Supabase

The agent must NEVER run these queries automatically. Instead, it must output them clearly inside `supabase.md` so the developer can paste them into Supabase SQL Editor or run migrations.

If the user asks:
> "make a new table" or "update schema" or "add RLS policy"

The agent must:
1. Generate the SQL
2. Append it to **supabase.md**
3. Never embed real keys

---

## 🧾 Final Notes
If asked to extend functionality (e.g., AI workout scoring, weekly summaries, macro calculators), follow existing patterns and ensure data flows through Supabase.

---

## 🧾 Final Notes
Your goal is to make AIGymBro scalable, maintainable, and consistent. Always follow best practices.
```
