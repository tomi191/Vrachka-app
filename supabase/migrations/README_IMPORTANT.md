# ⚠️ IMPORTANT: Which Migration File to Use

## ✅ USE THIS FILE:

**`014_fix_database_issues_v2.sql`** - Corrected version with proper error handling

## ❌ DO NOT USE:

**`014_fix_database_issues.sql`** - Original version (has duplicate policy errors)

---

## What Happened?

The original `014_fix_database_issues.sql` tried to create policies that already existed from previous migrations (003, 005, 012), which would cause errors like:

```
ERROR: 42710: policy "Users can insert own referral code" for table "referral_codes" already exists
```

## What Was Fixed in V2?

- ✅ Uses `DROP POLICY IF EXISTS` before creating policies
- ✅ Uses exception handling for constraints
- ✅ Won't fail on duplicates
- ✅ Safe to re-run if needed
- ✅ Shows informative progress messages

---

## Quick Start

### Option 1: Supabase Dashboard (Recommended)

1. Open Supabase Dashboard → SQL Editor
2. Open file: `014_fix_database_issues_v2.sql`
3. Copy entire content
4. Paste and click **Run**
5. Wait for success message

### Option 2: Supabase CLI

```bash
cd Vrachka-app
supabase db push
```

---

## Files Overview

| File | Status | Description |
|------|--------|-------------|
| `014_fix_database_issues_v2.sql` | ✅ **USE THIS** | Fixed version with error handling |
| `014_fix_database_issues.sql` | ❌ DEPRECATED | Original (has errors) |
| `test_migration_014.sql` | ✅ Use for testing | Test suite (works with V2) |
| `README_014_MIGRATION.md` | 📖 For V1 | Original detailed docs |
| `DATABASE_FIXES_SUMMARY_V2.md` | 📖 **READ THIS** | V2 quick guide |
| `README_IMPORTANT.md` | 📖 This file | Which file to use |

---

## What to Do Now

1. **Delete** or **rename** `014_fix_database_issues.sql` to avoid confusion
2. **Use** `014_fix_database_issues_v2.sql` for migration
3. **Read** `DATABASE_FIXES_SUMMARY_V2.md` for full instructions
4. **Run** `test_migration_014.sql` after migration to verify

---

## Expected Result

After running V2, you should see:

```
═══════════════════════════════════════════════════════════════
✅ MIGRATION 014 V2 COMPLETED SUCCESSFULLY!
═══════════════════════════════════════════════════════════════

Fixed Issues: 7/7 ✅
Performance Improvements: 14 indexes ✅
Data Management: 8 functions ✅

Database Score: 7.7/10 → 9.2/10 🎉
═══════════════════════════════════════════════════════════════
```

Plus informative notices like:
- `✅ Fixed ai_usage_logs FK to reference profiles`
- `✅ Added unique constraint on referral_redemptions`
- `ℹ️ Constraint already exists` (means it's already good)

---

## Need Help?

- Check `DATABASE_FIXES_SUMMARY_V2.md` for detailed guide
- Check `test_migration_014.sql` to verify success
- Check Supabase Dashboard → Logs for any errors

---

**TL;DR:** Use `014_fix_database_issues_v2.sql`, not the original!
