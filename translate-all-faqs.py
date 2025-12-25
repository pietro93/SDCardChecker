#!/usr/bin/env python3
import json
import re

# Comprehensive translation dictionary
translations = {
    # GoPro Hero 11 Black FAQs
    "Can I use an adapter to fit a full-size SD card in the Hero 11?": "Hero 11でアダプターを使って標準サイズのSDカードを使用できますか？",
    "No, the GoPro Hero 11 Black requires microSD cards exclusively. Full-size SD cards cannot function even with an adapter. This device explicitly requires microSD format cards for compatibility.": "いいえ、GoPro Hero 11 BlackはmicroSDカードのみ対応しています。フルサイズのSDカードはアダプターを使用しても機能しません。このデバイスは互換性のためにmicroSDフォーマットのカードを明確に要求します。",
    
    "What is the fastest card I should buy?": "購入すべき最速のカードは何ですか？",
    "V30 speed class is plenty for standard GoPro Hero 11 recording. V60 and faster cards are only useful for multi-camera professional workflows, simultaneous backups, or planning for future higher-performance cameras.": "標準的なGoPro Hero 11の記録にはV30スピードクラスで十分です。V60以上のカードは、プロ仕様のマルチカメラワークフローや同時バックアップ、あるいは将来のより高性能なカメラへの流用を考える場合にのみ有用です。",
    
    "How often should I replace my SD card?": "SDカードはどのくらいの頻度で交換すべきですか？",
    "A high-quality V30 microSD card typically lasts 3-5 years with normal usage. To prevent critical footage loss, replace your card immediately if you encounter error messages, file corruption, or write failures.": "高品質なV30 microSDカードは、通常の使用で3〜5年持ちます。重要な映像の消失を防ぐため、エラーメッセージ、ファイルの破損、または書き込み拒否が発生した場合は、直ちにカードを交換してください。",
    
    # DJI Mini 3 Pro
    "Can I use a V20 card in the DJI Mini 3 Pro?": "DJI Mini 3 ProでV20カードを使用できますか？",
    "Using a V20 card in the DJI Mini 3 Pro is not recommended. V30 speed class is the minimum requirement for stable 4K video recording, particularly at high frame rates, to prevent dropped frames and file corruption.": "DJI Mini 3 ProでのV20カードの使用は推奨されません。安定した4Kビデオ録画にはV30スピードクラスが最低要件です。特に高フレームレートにおいて、コマ落ちやファイル破損を防ぐためです。",
    
    "Is brand reliability important for drones?": "ドローンにとってブランドは重要ですか？",
    "Yes, brand reliability is absolutely critical for drone operation. To avoid mid-flight card failure that could result in footage loss or an emergency landing, stick with trusted brands like SanDisk, Lexar, and Kingston.": "はい、ドローンの運用においてブランドの信頼性は極めて重要です。映像の消失や、最悪の場合は緊急着陸につながる飛行中のカード障害を避けるため、SanDisk、Lexar、Kingstonなどの信頼できるブランドを使用してください。",
    
    "What about used or worn cards?": "古い中古カードについてはどうですか？",
    "Avoid used or degraded microSD cards in drone operations. Card failure during flight can result in expensive losses or danger, so reliability is paramount. Always use new or professionally tested, highly reliable cards.": "ドローン運用では、中古や劣化したmicroSDカードの使用は避けてください。飛行中のカード障害は高価な損失や危険を招くため、信頼性が第一です。常に新品または専門的にテストされた、信頼性の高いカードを使用してください。",
    
    # Generic patterns for other devices
    "Do I strictly need a V60 card for the X1 Pro Max?": "X1 Pro MaxにおいてはっきりとV60カードが必須ですか？",
    "If you plan to shoot in 8K, yes. For 4K recording, a high-quality V30 card will suffice, but to unlock the full potential of the drone's 8K sensor, invest in a V60 microSD card.": "8K撮影を予定する場合、はい。4K録画には高品質なV30カードで十分ですが、ドローンの8Kセンサーの全能力を活かすには、V60 microSDカードへの投資をお勧めします。",
    
    "What happens if I use a slow card in the X1 Pro Max?": "X1 Pro Maxで遅いカードを使うとどうなりますか？",
    "The drone may refuse to record in 8K, or automatically downgrade the resolution to 4K to prevent data corruption.": "ドローンはビデオ録画を拒否するか、データ破損を防ぐため解像度を自動的に4Kに落とす可能性があります。",
    
    # Additional device FAQs
    "Do I strictly need a V60 card": "V60カードが本当に必須ですか",
    "For 4K recording, a high-quality V30 card will suffice": "4K録画には高品質なV30カードで十分です"
}

def is_english(text):
    """Check if text is primarily English"""
    if not text:
        return False
    # Count English word characters vs Japanese characters
    english_match = re.findall(r'[a-zA-Z]+', text)
    japanese_match = re.findall(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]', text)
    return len(english_match) > len(japanese_match) and len(english_match) > 2

def translate_text(text):
    """Translate text using dictionary"""
    for eng, jpn in translations.items():
        if eng.lower() in text.lower():
            return jpn
    return None

# Load JSON
with open('data/devices-ja.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

translated_count = 0
skipped_count = 0
devices_updated = []

# Process each device
for device in data.get('devices', []):
    if 'faq' in device and isinstance(device['faq'], list):
        for faq_item in device['faq']:
            # Translate question
            if 'q' in faq_item and is_english(faq_item['q']):
                original_q = faq_item['q']
                trans_q = translate_text(original_q)
                if trans_q:
                    faq_item['q'] = trans_q
                    translated_count += 1
                else:
                    skipped_count += 1
                    print(f"[SKIPPED] {device['name']}: {original_q[:50]}...")
            
            # Translate answer
            if 'a' in faq_item and is_english(faq_item['a']):
                original_a = faq_item['a']
                trans_a = translate_text(original_a)
                if trans_a:
                    faq_item['a'] = trans_a
                    translated_count += 1
                else:
                    skipped_count += 1
                    print(f"[SKIPPED] {device['name']}: {original_a[:50]}...")
        
        if any(is_english(faq.get('q', '')) or is_english(faq.get('a', '')) for faq in device['faq']):
            devices_updated.append(device['name'])

# Save updated file
with open('data/devices-ja.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"\n=== TRANSLATION COMPLETE ===")
print(f"Translated items: {translated_count}")
print(f"Items requiring manual translation: {skipped_count}")
print(f"Devices updated: {len(devices_updated)}")
for dev in devices_updated:
    print(f"  - {dev}")
