#!/usr/bin/env python
import json

with open('data/devices-ja.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

total = len(data['devices'])
with_faq = len([d for d in data['devices'] if d.get('faq') and len(d['faq']) > 0])
without_faq = total - with_faq

print(f"Total devices: {total}")
print(f"Devices WITH FAQs: {with_faq}")
print(f"Devices WITHOUT FAQs: {without_faq}")
print(f"\nDevices without FAQs:")

for d in data['devices']:
    if not d.get('faq') or len(d['faq']) == 0:
        print(f"  - {d['id']}: {d['name']}")
