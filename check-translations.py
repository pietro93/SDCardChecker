import json

with open('data/devices-ja.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check the new devices we translated
new_devices = [
    'canon-eos-r7', 'canon-eos-r8', 'canon-eos-r10',
    'sony-a6400', 'sony-a7-iv', 'sony-zv-e10',
    'nikon-d7500', 'nikon-d750', 'nikon-z50-ii', 'nikon-z6-ii',
    'fujifilm-xt5'
]

print("New Camera Devices Translated:")
print("-" * 50)

for dev_id in new_devices:
    device = next((d for d in data['devices'] if d['id'] == dev_id), None)
    if device:
        faq_count = len(device.get('faq', []))
        print(f"✓ {device['name']:25} - {faq_count} FAQs")
    else:
        print(f"✗ {dev_id:25} - NOT FOUND")

print("\n" + "=" * 50)
total = len(data['devices'])
with_faq = len([d for d in data['devices'] if d.get('faq') and len(d['faq']) > 0])
print(f"Total: {total} devices | {with_faq} have FAQs ({int(100*with_faq/total)}%)")
