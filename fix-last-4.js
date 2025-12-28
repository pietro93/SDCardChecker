const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/devices-ja.json', 'utf8'));

// Minor fixes for 4 devices with brand names still showing as English
const fixes = {
  51: { // hp-chromebook-14
    whySpecs: "HP Chromebook 14モデルにはmicroSDカードリーダーが含まれており、ストレージを拡張できます。ChromeOSはAPKまたは標準的なAndroidアプリをSDカードに直接インストールすることを許可していませんが、メディアファイル（写真、動画、音楽）のストレージにカードを使用できます。Class 10カードで十分です。",
    faq: [
      {
        q: "ChromebookのSDカードにアプリをインストールできますか？",
        a: "<b>ChromeOSはAndroidアプリをSDカードに直接インストールすることを許可していません。</b> ただし、Chromebookはメディアストレージ用のカードをサポートしており、写真、動画、音楽ファイルを保存できます。アプリはChrome Web Storeからのみインストール可能です。"
      },
      {
        q: "HP Chromebook 14に最適なmicroSDカード容量は何ですか？",
        a: "<b>ほとんどのユーザーには64GBまたは128GBで十分です。</b> これは、メディア、ダウンロード、オフラインファイル用に十分なスペースを提供します。重いメディアストレージが必要な場合は256GBを検討してください。"
      }
    ]
  },
  52: { // dji-osmo-action-4
    faq: [
      {
        q: "Action 4対GoPro Hero 12 - 同じカードですか？",
        a: "<b>はい、DJI Osmo Action 4とGoPro Hero 12の両方がV30 microSDカードを必須としています。</b> どちらもアクションカメラの需要が厳しく、同じV30スピードクラスの要件を共有しています。"
      },
      {
        q: "Action 4には本当にV30が必要ですか？",
        a: "<b>はい、DJI Osmo Action 4の4K 120fps記録にはV30が必須です。</b> 低速カードを使用すると、フレームドロップ、ジッター、またはファイル破損が発生する可能性があります。"
      }
    ]
  },
  63: { // dji-mini-4k
    faq: [
      {
        q: "DJI Mini 4KはMini 4 Proとどう違いますか？",
        a: "<b>Mini 4Kはより予算志向版で、インテリジェント飛行モードが少なくなります。</b> しかし、両方が4K動画をサポートし、V30カード要件を共有しています。基本的なドローン経験向けに設計されています。"
      },
      {
        q: "Mini 4KでV30が本当に必須ですか？",
        a: "<b>はい、DJI公式はドローン操作の信頼性とフレームドロップを防ぐためにV30を推奨しています。</b> より低速なカードはフレームドロップやファイル破損のリスクを提示します。"
      }
    ]
  },
  64: { // dji-mini-3
    faq: [
      {
        q: "Mini 3とMini 3 Proのカード要件は同じですか？",
        a: "<b>はい、DJI Mini 3とDJI Mini 3 ProはどちらもV30 microSDカードを要件としています。</b> キャメラ仕様が似ているため、同じカード推奨事項が適用されます。"
      },
      {
        q: "Mini 3でV20カードを使用できますか？",
        a: "<b>技術的には可能ですが、非常に推奨されません。</b> V20カードはフレームドロップやファイル破損のリスクを提示します。ドローン安全のためにV30を使用してください。"
      }
    ]
  }
};

Object.entries(fixes).forEach(([indexStr, fix]) => {
  const idx = parseInt(indexStr);
  const device = data.devices[idx];
  if (fix.whySpecs) device.whySpecs = fix.whySpecs;
  if (fix.faq) device.faq = fix.faq;
  console.log(`✓ Fixed [${idx + 1}] ${device.id}`);
});

fs.writeFileSync('data/devices-ja.json', JSON.stringify(data, null, 4) + '\n');
console.log('\n✅ All 4 remaining devices fixed!');
