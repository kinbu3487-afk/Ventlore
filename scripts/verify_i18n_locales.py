#!/usr/bin/env python3
"""
Verify i18n catalogs and ensure no raw translation keys leak in built pages.
"""

import os
import re
import sys
import glob

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LOCALES_DIR = os.path.join(REPO_ROOT, "apps/web/src/lib/i18n/locales")
TYPES_FILE = os.path.join(REPO_ROOT, "apps/web/src/lib/i18n/types.ts")
BUILT_DIR = os.path.join(REPO_ROOT, "apps/web/.next/server/app")

print("=== 1. VERIFYING I18N CATALOG KEYS ACROSS 6 LOCALES ===")

# Read types.ts to find all required keys
with open(TYPES_FILE, "r", encoding="utf-8") as f:
    types_content = f.read()

# Extract interface TranslationCatalog
match = re.search(r"export interface TranslationCatalog\s*\{([\s\S]*?)\n\}", types_content)
if not match:
    print("[FAIL] Cannot find TranslationCatalog interface in types.ts")
    sys.exit(1)

catalog_body = match.group(1)
sections = re.findall(r"(\w+):\s*\{([\s\S]*?)\};", catalog_body)

expected_keys = {}
for sec_name, sec_body in sections:
    keys = re.findall(r"(\w+):\s*string;", sec_body)
    expected_keys[sec_name] = keys

total_expected = sum(len(k) for k in expected_keys.values())
print(f"Total expected keys: {total_expected} across {len(expected_keys)} namespaces: {list(expected_keys.keys())}")

locales = ["vi", "en", "ja", "zh-Hans", "ko", "fr"]
all_valid = True

for loc in locales:
    loc_file = os.path.join(LOCALES_DIR, f"{loc}.ts")
    if not os.path.exists(loc_file):
        print(f"[FAIL] Missing locale catalog file: {loc_file}")
        all_valid = False
        continue

    with open(loc_file, "r", encoding="utf-8") as f:
        content = f.read()

    missing_in_loc = []
    empty_in_loc = []

    for sec_name, keys in expected_keys.items():
        # Find section in file
        sec_match = re.search(rf"{sec_name}:\s*\{{([\s\S]*?)\n\s*\}},", content)
        if not sec_match:
            print(f"[FAIL] Locale {loc} is missing namespace: {sec_name}")
            missing_in_loc.append(sec_name)
            continue
        
        sec_content = sec_match.group(1)
        for key in keys:
            # Check key exists
            key_pattern = rf"\b{key}:\s*(?:'|\"|`)([\s\S]*?)(?:'|\"|`),?"
            val_match = re.search(key_pattern, sec_content)
            if not val_match:
                missing_in_loc.append(f"{sec_name}.{key}")
            else:
                val = val_match.group(1).strip()
                if len(val) == 0:
                    empty_in_loc.append(f"{sec_name}.{key}")

    if missing_in_loc:
        print(f"[FAIL] Locale '{loc}' has missing keys ({len(missing_in_loc)}): {missing_in_loc}")
        all_valid = False
    elif empty_in_loc:
        print(f"[FAIL] Locale '{loc}' has empty keys ({len(empty_in_loc)}): {empty_in_loc}")
        all_valid = False
    else:
        print(f"[PASS] Locale '{loc}': 100% of {total_expected} keys present and non-empty.")

if not all_valid:
    print("[ERROR] Translation catalog check failed!")
    sys.exit(1)

print("\n=== 2. VERIFYING PRERENDERED HTML FOR RAW TRANSLATION KEY LEAKS ===")

# Known error keys from review
leaked_patterns = [
    r"common\.demoNotice",
    r"common\.role",
    r"explore\.searchPlaceholder",
    r"explore\.allRegions",
    r"explore\.viewPlace",
    r"post\.verifiedTitle",
    r"vip\.mainTitle",
    r"explore\.heroTitle",
    r"explore\.allActivities",
]

found_leaks = []
html_files = glob.glob(f"{BUILT_DIR}/**/*.html", recursive=True)
print(f"Checking {len(html_files)} prerendered HTML files...")

for hf in html_files:
    with open(hf, "r", encoding="utf-8") as f:
        html = f.read()
    
    for pat in leaked_patterns:
        if re.search(pat, html):
            found_leaks.append((hf, pat))

if found_leaks:
    print(f"[FAIL] Found {len(found_leaks)} raw key leaks in built HTML:")
    for hf, pat in found_leaks:
        print(f"  - {os.path.basename(hf)}: matched {pat}")
    sys.exit(1)
else:
    print(f"[PASS] 0 raw translation key leaks found in any of the {len(html_files)} built HTML pages!")

print("\n=== ALL I18N VERIFICATIONS PASSED 100% ===")
