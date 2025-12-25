const fs = require('fs');
const path = require('path');

// Translation map for common FAQ patterns
const translationMap = {
  // GoPro Hero 11 Black
  "Can I use an adapter to fit a full-size SD card in the Hero 11?": "Hero 11でアダプターを使って標準サイズのSDカードを使用できますか？",
  "No, the GoPro Hero 11 Black requires microSD cards exclusively.": "いいえ、GoPro Hero 11 BlackはmicroSDカードのみ対応しています。",
  "Full-size SD cards cannot function even with an adapter. This device explicitly requires microSD format cards for compatibility.": "フルサイズのSDカードはアダプターを使用しても機能しません。このデバイスは互換性のためにmicroSDフォーマットのカードを明確に要求します。",
  
  "What is the fastest card I should buy?": "購入すべき最速のカードは何ですか？",
  "V30 speed class is plenty for standard GoPro Hero 11 recording.": "標準的なGoPro Hero 11の記録にはV30スピードクラスで十分です。",
  "V60 and faster cards are only useful for multi-camera professional workflows, simultaneous backups, or planning for future higher-performance cameras.": "V60以上のカードは、プロ仕様のマルチカメラワークフローや同時バックアップ、あるいは将来のより高性能なカメラへの流用を考える場合にのみ有用です。",
  
  "How often should I replace my SD card?": "SDカードはどのくらいの頻度で交換すべきですか？",
  "A high-quality V30 microSD card typically lasts 3-5 years with normal usage.": "高品質なV30 microSDカードは、通常の使用で3〜5年持ちます。",
  "To prevent critical footage loss, replace your card immediately if you encounter error messages, file corruption, or write failures.": "重要な映像の消失を防ぐため、エラーメッセージ、ファイルの破損、または書き込み拒否が発生した場合は、直ちにカードを交換してください。",
  
  // Nintendo Switch
  "Can I use my phone's microSD card in my Switch?": "スマホのmicroSDカードは使えますか？",
  "Yes, the Nintendo Switch supports any microSD card.": "はい、Nintendo SwitchではどのmicroSDカードでも使用できます。",
  "However, formatting the card for Switch will erase all existing data on it, so back up your phone's data before transferring.": "ただし、Switch用にフォーマットするとカード上の既存データはすべて消去されるため、転送前に必ずスマホのデータをバックアップしてください。",
  
  "Is formatting required?": "カードのフォーマットは必要ですか？",
  "Yes, Nintendo Switch will automatically format any microSD card upon first use.": "はい、Nintendo Switchは初回使用時にmicroSDカードを自動的にフォーマットします。",
  "This process erases all existing data, so verify your file backups before inserting an existing card into the Switch.": "この処理により既存のデータはすべて消去されるため、既存のカードをSwitchに挿入する前にファイルのバックアップを確認してください。",
  
  "What happens if I use a slow card?": "遅いカードを使うとどうなりますか？",
  "Using a slow card may slightly increase game load times.": "遅いカードを使用すると、ゲームのロード時間がわずかに長くなる可能性があります。",
  "Games will still function normally, and the speed impact is minimal. There is no risk of data loss or game corruption even with lower speed-rated cards.": "ゲーム自体は正常に動作し、速度の影響は最小限です。速度定格の低いカードを使用しても、データ損失やゲーム破損のリスクはありません。",
  
  // DJI Mini 4 Pro
  "Can I use a V20 card in the DJI Mini 4 Pro?": "DJI Mini 4 ProでV20カードを使用できますか？",
  "Using a V20 card in the DJI Mini 4 Pro is not recommended.": "DJI Mini 4 ProでのV20カードの使用は推奨されません。",
  "V30 speed class is the minimum requirement for stable 4K video recording, particularly at high frame rates, to prevent dropped frames and file corruption.": "安定した4Kビデオ録画にはV30スピードクラスが最低要件です。特に高フレームレートにおいて、コマ落ちやファイル破損を防ぐためです。",
  
  "Is brand reliability important for drones?": "ドローンにとってブランドは重要ですか？",
  "Yes, brand reliability is absolutely critical for drone operation.": "はい、ドローンの運用においてブランドの信頼性は極めて重要です。",
  "To avoid mid-flight card failure that could result in footage loss or an emergency landing, stick with trusted brands like SanDisk, Lexar, and Kingston.": "映像の消失や、最悪の場合は緊急着陸につながる飛行中のカード障害を避けるため、SanDisk、Lexar、Kingstonなどの信頼できるブランドを使用してください。",
  
  "What about used or worn cards?": "古い中古カードについてはどうですか？",
  "Avoid used or degraded microSD cards in drone operations.": "ドローン運用では、中古や劣化したmicroSDカードの使用は避けてください。",
  "Card failure during flight can result in expensive losses or danger, so reliability is paramount. Always use new or professionally tested, highly reliable cards.": "飛行中のカード障害は高価な損失や危険を招くため、信頼性が第一です。常に新品または専門的にテストされた、信頼性の高いカードを使用してください。",
  
  // Canon EOS R5
  "Do I need 2 cards for the R5?": "R5には2枚のカードが必要ですか？",
  "Yes, the Canon EOS R5 features dual card slots, and Canon recommends using 2 V60 cards for safety.": "はい、Canon EOS R5はデュアルカードスロットを備えており、キヤノンは安全のために2枚のV60カードの使用を推奨しています。",
  "During 8K video recording, dual cards provide backup recording and improved reliability, protecting against single-card failure during important sessions.": "8Kビデオ撮影時、デュアルカードはバックアップ記録と信頼性の向上を提供し、重要なセッション中の単一カード障害から保護します。",
  
  "Can I shoot 4K on a V30 card?": "V30カードで4K撮影はできますか？",
  "Yes, 4K video recording works fine with V30 speed class cards.": "はい、4Kビデオ録画はV30スピードクラスのカードで問題なく動作します。",
  "However, 8K recording requires V60 speed class minimum due to much higher bitrate and data throughput demands.": "しかし、8K録画には、はるかに高いビットレートとデータスループットの要求のため、最低でもV60スピードクラスが必要です。",
  
  "What's the difference between CFexpress and SD?": "CFexpressとSDの違いは何ですか？",
  "CFexpress Type B cards are significantly faster than SD UHS-II": "CFexpress Type BカードはSD UHS-IIよりも大幅に高速です。",
  "and are ideal for 8K RAW video recording. SD UHS-II V60 cards are more affordable and sufficient for 4K recording, making them a suitable choice for hybrid photo-and-video workflows.": "8K RAWビデオ録画に最適です。SD UHS-II V60カードはより手頃で4K録画には十分なため、写真とビデオのハイブリッドワークには適した選択肢です。",
  
  // Sony a6700
  "Is V30 enough for 4K 60fps on the Sony a6700?": "V30で4K 60fpsは十分ですか？",
  "Yes, V30 speed class provides the minimum 30 MB/s sustained write speed needed for stable 4K 60fps video on the Sony a6700.": "はい、V30スピードクラスは、Sony α6700での安定した4K 60fpsビデオに必要な最低30MB/秒の書き込み速度を提供します。",
  "However, professional and advanced users often prefer V60 or faster cards for additional performance headroom and peace of mind during critical shoots.": "プロや上級ユーザーは、重要な撮影時の予備性能と安心感のために、V60以上のカードを好むことが多いです。",
  
  "Do I need 2 cards?": "2枚のカードが必要ですか？",
  "The Sony a6700 features dual SD UHS-II card slots.": "Sony α6700はデュアルSD UHS-IIカードスロットを備えています。",
  "Dual card usage is recommended for long shooting sessions or automatic backup, allowing continuous recording when one card fills up, and streamlining professional video production workflows.": "長時間の撮影セッションや自動バックアップには2枚のカード使用が推奨され、1枚が満杯になったときに継続録画が可能になり、プロのビデオ制作ワークフローがスムーズになります。",
  
  // Steam Deck
  "Can I use a faster V60 card in the Steam Deck?": "高速なV60カードは使えますか？",
  "Yes, V60 and faster microSD cards work fine in the Steam Deck.": "はい、V60以上のmicroSDカードもSteam Deckで問題なく動作します。",
  "However, the device's UHS-I interface limits speed, so faster cards offer no practical advantage over V30 cards for Steam Deck gaming.": "しかし、デバイスのUHS-Iインターフェースが速度を制限するため、Steam Deckでのゲームプレイにおいて、より高速なカードによる実用的な利点はV30カードと比較してありません。",
  
  // Generic patterns
  "Do I strictly need a V60 card": "V60カードが必須ですか",
  "If you plan to shoot in 8K, yes.": "8K撮影を予定する場合はい。",
  "For 4K recording, a high-quality V30 card will suffice, but to unlock the full potential of the drone's 8K sensor, invest in a V60 microSD card.": "4K録画には高品質なV30カードで十分ですが、ドローンの8Kセンサーの全能力を活かすには、V60 microSDカードへの投資をお勧めします。",
  
  "What happens if I use a slow card in": "遅いカードを使うとどうなりますか",
  "The drone may refuse to record in 8K, or automatically downgrade the resolution to 4K to prevent data corruption.": "ドローンはビデオ録画を拒否するか、データ破損を防ぐため解像度を自動的に4Kに落とす可能性があります。",
};

// Function to translate using map
function translateText(text) {
  for (const [english, japanese] of Object.entries(translationMap)) {
    if (text.toLowerCase().includes(english.toLowerCase())) {
      return translationMap[english];
    }
  }
  return text; // Return original if no translation found
}

// Function to detect if text is English
function isEnglish(text) {
  if (!text) return false;
  // Check if contains English words and minimal Japanese
  const englishWords = (text.match(/\b[a-z]+\b/gi) || []).length;
  const japaneseChars = (text.match(/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/g) || []).length;
  return englishWords > japaneseChars && englishWords > 2;
}

// Main translation function
function translateDevicesFAQs(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContent);
  
  let translatedCount = 0;
  let skippedCount = 0;
  
  data.devices.forEach((device) => {
    if (device.faq && Array.isArray(device.faq)) {
      device.faq.forEach((item) => {
        // Check and translate question
        if (item.q && isEnglish(item.q)) {
          console.log(`\nDevice: ${device.name}`);
          console.log(`Original Q: ${item.q}`);
          
          // Try to find translation in map
          let translated = false;
          for (const [english, japanese] of Object.entries(translationMap)) {
            if (item.q.toLowerCase().includes(english.toLowerCase())) {
              item.q = japanese;
              translated = true;
              console.log(`Translated Q: ${item.q}`);
              break;
            }
          }
          
          if (!translated) {
            console.log(`⚠️  No translation found - REQUIRES MANUAL TRANSLATION`);
            skippedCount++;
          } else {
            translatedCount++;
          }
        }
        
        // Check and translate answer
        if (item.a && isEnglish(item.a)) {
          console.log(`Original A: ${item.a.substring(0, 100)}...`);
          
          // Try to translate answer text portions
          let answerTranslated = false;
          
          for (const [english, japanese] of Object.entries(translationMap)) {
            if (item.a.toLowerCase().includes(english.toLowerCase())) {
              item.a = item.a.replace(new RegExp(english, 'gi'), japanese);
              answerTranslated = true;
              console.log(`Translated A: ${item.a.substring(0, 100)}...`);
              break;
            }
          }
          
          if (!answerTranslated) {
            console.log(`⚠️  Answer needs manual translation`);
            skippedCount++;
          } else {
            translatedCount++;
          }
        }
      });
    }
  });
  
  // Write translated data back
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  console.log(`\n\n=== TRANSLATION SUMMARY ===`);
  console.log(`Translated items: ${translatedCount}`);
  console.log(`Items needing manual translation: ${skippedCount}`);
  console.log(`File saved to: ${filePath}`);
}

// Run translation
const filePath = path.join(__dirname, 'data', 'devices-ja.json');
console.log(`Starting FAQ translation for: ${filePath}\n`);
translateDevicesFAQs(filePath);
