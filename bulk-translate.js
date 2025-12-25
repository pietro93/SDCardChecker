const fs = require('fs');
const path = require('path');

// Comprehensive translation pairs
const translations = [
  // Fujifilm X-M5
  {
    q: "Is the Fujifilm X-M5 Fujifilm's cheapest X-mount camera?",
    a: "<b>Yes, the X-M5 is positioned as Fujifilm's most affordable interchangeable lens camera.</b> It is specifically designed to appeal to vloggers and first-time mirrorless camera buyers due to its compact form factor and advanced video capabilities. Despite its lower price point, it still requires V30 cards for stable video recording performance.",
    q_ja: "Fujifilm X-M5はFujifilmの最も安いXマウントカメラですか？",
    a_ja: "<b>はい、X-M5はFujifilmの最も手頃なインターチェンジレンズカメラとして位置付けられています。</b>このカメラは、コンパクトなフォームファクタと高度なビデオ機能により、動画制作者と初めてのミラーレスカメラユーザーを対象に設計されています。より低い価格帯にもかかわらず、安定したビデオ録画のためにはV30カードが必要です。"
  },
  // Fujifilm X-T30 II
  {
    q: "X-T30 II vs X-T5 - do I need faster cards?",
    a: "<b>No, the X-T30 II uses a UHS-I card slot and requires V30 cards, which are sufficient for its capabilities.</b> In contrast, the X-T5 features faster UHS-II slots and can benefit from V60 or even V90 cards due to its higher resolution and more demanding video modes. If you're on a budget, the X-T30 II saves money on both the camera body and compatible SD cards.",
    q_ja: "X-T30 II対X-T5 - より高速なカードが必要ですか？",
    a_ja: "<b>いいえ、X-T30 IIはUHS-Iカードスロットを使用し、V30カードが必要です。これはその機能に十分です。</b>一方、X-T5はより高速なUHS-IIスロットを備えており、より高い解像度と、より要求の厳しいビデオモードのために、V60またはV90カードの恩恵を受けることができます。予算が限られている場合、X-T30 IIはカメラボディと互換性のあるSDカード両方で金銭を節約できます。"
  },
  // Fujifilm X-T50
  {
    q: "Is the Fujifilm X-T50 essentially the X-T5 in a smaller body?",
    a: "<b>Essentially, yes.</b> The X-T50 utilizes the same 40MP sensor and image processing engine as the flagship X-T5 but integrates them into a more compact and lightweight body. Consequently, their SD card requirements are similar, with a V60 minimum recommended for reliable 6.2K video recording and high-resolution photography.",
    q_ja: "Fujifilm X-T50は本質的にX-T5を小さなボディに詰め込んだものですか？",
    a_ja: "<b>本質的には、そうです。</b>X-T50はフラッグシップX-T5と同じ40MPセンサーと画像処理エンジンを使用していますが、それらをより小型で軽量なボディに統合しています。その結果、SDカード要件は類似しており、信頼性の高い6.2Kビデオ録画と高解像度写真にはV60の最小推奨が必要です。"
  },
  // Sony FX30
  {
    q: "Should I use CFexpress Type A or SD cards in the FX30?",
    a: "<b>For most common shooting scenarios and high-quality recording, V90 SD cards are perfectly sufficient and significantly more affordable.</b> CFexpress Type A is primarily necessary for the absolute highest bitrate ALL-I recording codecs, or when you require the fastest possible offload speeds to your computer. You can start with V90 SD and only upgrade to CFexpress if you encounter specific performance limitations.",
    q_ja: "FX30ではCFexpress Type AカードまたはSDカードを使うべきですか？",
    a_ja: "<b>ほとんどの一般的な撮影シナリオと高品質なレコーディングには、V90 SDカードで十分です。しかも大幅に手頃な価格です。</b>CFexpress Type Aは、最も高いビットレートのALL-Iレコーディングコーデックや、コンピュータへの最高速転送速度が必要な場合に主に必要です。V90 SDから始めて、特定のパフォーマンスの制限に直面した場合のみCFexpressにアップグレードできます。"
  },
  {
    q: "Can I mix CFexpress Type A and SD cards in the FX30?",
    a: "<b>Yes, you can use one CFexpress Type A card and one SD UHS-II card simultaneously.</b> This offers a flexible and cost-effective approach: you can record your primary footage to the faster CFexpress card and use the SD card for overflow or backup. Both slots are identical in their physical interface and interchangeable for either card type.",
    q_ja: "FX30でCFexpress Type AカードとSDカードを混ぜて使えますか？",
    a_ja: "<b>はい、CFexpress Type AカードとSD UHS-IIカードを同時に1枚ずつ使用できます。</b>これは柔軟で費用対効果の高いアプローチを提供します。より高速なCFexpressカードにメイン映像を記録し、SDカードをオーバーフロー用またはバックアップに使用できます。両方のスロットは物理的なインターフェースで同一であり、どちらのカードタイプでも交換可能です。"
  },
  // Sony FX3
  {
    q: "Are the SD card recommendations for the FX3 and FX30 the same?",
    a: "<b>Yes, both the Sony FX3 and FX30 utilize the same dual CFexpress Type A / SD UHS-II slot configuration.</b> Therefore, the card recommendations and considerations for speed (V90 for demanding codecs) and type (CFexpress for ultimate performance, SD for versatility) are identical across both camera bodies.",
    q_ja: "FX3とFX30のSDカード推奨は同じですか？",
    a_ja: "<b>はい、Sony FX3とFX30両方とも同じデュアルCFexpress Type A / SD UHS-IIスロット構成を利用します。</b>したがって、カード推奨事項と速度（要求の厳しいコーデック用のV90）とタイプ（最高性能用CFexpress、汎用性用SD）の考慮は両方のカメラボディで同一です。"
  },
  {
    q: "Is a V90 SD card truly required for the FX3, or can I use a V60 card?",
    a: "<b>V60 cards will work for standard 4K recording and many professional codecs, but a V90 speed class card is explicitly required for 4K 120fps and the highest bitrate recording modes.</b> If you've invested in an FX3 for its high frame rate capabilities, it's crucial not to compromise on card speed to ensure stable, uninterrupted recording of your most demanding footage.",
    q_ja: "FX3に本当にV90 SDカードが必須ですか、それともV60カードを使用できますか？",
    a_ja: "<b>V60カードは標準4K録画と多くのプロフェッショナルコーデックで動作しますが、4K 120fpsと最高ビットレート録画モードにはV90スピードクラスカードが明示的に必要です。</b>高フレームレート機能のためにFX3に投資した場合、最も要求の厳しいフッテージの安定した、継続的な記録を確保するためにカード速度について妥協しないことが重要です。"
  },
  // Fujifilm X-E5
  {
    q: "What is the key difference between the X-E5 and the X-M5?",
    a: "<b>The X-E5 is designed with a traditional rangefinder-style body, featuring a centered electronic viewfinder. In contrast, the X-M5 is more vlog-focused and typically features a vari-angle or flip screen.</b> Both cameras share identical SD card requirements, needing a V30 UHS-I minimum. Your choice between them should be based on your preferred shooting style and ergonomic preferences, rather than card specifications.",
    q_ja: "X-E5とX-M5の主な違いは何ですか？",
    a_ja: "<b>X-E5は従来のレンジファインダースタイルのボディで設計され、中央電子ビューファインダーを備えています。一方、X-M5はより動画製作者向けであり、通常はバリアングル画面またはチルト液晶を備えています。</b>両方のカメラは同じSDカード要件を共有し、V30 UHS-I最小が必要です。その選択は、カード仕様ではなく、好みの撮影スタイルと人間工学的な好みに基づいるべきです。"
  },
  // Fujifilm X100V
  {
    q: "Are the SD card requirements the same for the X100V and the X100VI?",
    a: "<b>No, the X100VI requires V60 UHS-II cards for its higher-resolution 6.2K video recording capabilities.</b> The X100V, in contrast, maxes out at 4K 30fps and only requires V30 UHS-I cards. This difference in card speed requirements means the older X100V can be a more budget-friendly option for both the camera and its accessories.",
    q_ja: "X100VとX100VIのSDカード要件は同じですか？",
    a_ja: "<b>いいえ、X100VIはより高い解像度の6.2Kビデオ録画機能のためにV60 UHS-IIカードが必要です。</b>対照的に、X100Vの最大は4K 30fpsであり、V30 UHS-Iカードのみが必要です。カード速度要件のこの違いは、古いX100Vがカメラとそのアクセサリーの両方で、より予算に優しいオプションになることを意味します。"
  },
  {
    q: "Why is the Fujifilm X100V still so expensive on the used market?",
    a: "<b>The X100 series experienced a viral surge in popularity on social media platforms, creating immense demand for these cameras.</b> Coupled with the X100VI being perennially sold out, used X100V prices have remained remarkably high. It's still an excellent camera that offers a premium experience with more modest card requirements than its successor.",
    q_ja: "Fujifilm X100Vは中古市場でまだそんなに高いのはなぜですか？",
    a_ja: "<b>X100シリーズはソーシャルメディアプラットフォームでバイラル人気の急騰を経験し、これらのカメラに対する莫大な需要を生成しました。</b>X100VIが常に在庫切れであることに加えて、中古X100V価格は著しく高いままです。それは後継モデルよりも、より控えめなカード要件を備えたプレミアム体験を提供する優れたカメラです。"
  },
  // Fujifilm X-T3
  {
    q: "Is the Fujifilm X-T3 still worth buying used in 2024?",
    a: "<b>Yes, for budget-conscious enthusiasts and professionals, the X-T3 is still an excellent camera.</b> It delivers superb image quality and robust 4K 60fps video capabilities at a significantly lower price point than current models. V60 cards are sufficient for most workflows, making it a very cost-effective option overall.",
    q_ja: "Fujifilm X-T3は2024年の中古で買う価値があります？",
    a_ja: "<b>はい、予算意識の高い愛好家とプロフェッショナルにとって、X-T3はまだ優れたカメラです。</b>現在のモデルよりも著しく低い価格で、優れた画質と堅牢な4K 60fps動画機能を提供します。V60カードはほとんどのワークフローに十分であり、全体的に非常に費用対効果の高いオプションにします。"
  },
  {
    q: "Do I really need V90 cards for the X-T3?",
    a: "<b>You only need V90 cards if you specifically plan to use the 400Mbps ALL-Intra codec for maximum video quality.</b> For all other standard 4K recording modes and photography, V60 cards are perfectly adequate and provide excellent performance. Most users will find V90 cards unnecessary and can save money by opting for V60.",
    q_ja: "X-T3に本当にV90カードが必要ですか？",
    a_ja: "<b>V90カードは、最大ビデオ品質のために400Mbps ALL-Intraコーデックを使用することを具体的に計画する場合のみ必要です。</b>他のすべての標準4K録画モードと写真撮影では、V60カードで十分であり、優れたパフォーマンスを提供します。ほとんどのユーザーはV90カードが不要と思い、V60を選択することで金銭を節約できます。"
  }
];

const filePath = path.join(__dirname, 'data', 'devices-ja.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

let updated = 0;

// Process each device
data.devices.forEach(device => {
  if (device.faq && Array.isArray(device.faq)) {
    device.faq.forEach(faq => {
      // Try to find matching translation
      translations.forEach(trans => {
        if (faq.q === trans.q) {
          faq.q = trans.q_ja;
          updated++;
        }
        if (faq.a === trans.a) {
          faq.a = trans.a_ja;
          updated++;
        }
      });
    });
  }
});

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
console.log(`✅ Updated ${updated} FAQ items`);
