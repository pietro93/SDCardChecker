/**
 * FAQ Generator (Japanese) - プログラムでデバイス固有のFAQ回答を生成
 * Programmatically generate device-specific FAQ answers in Japanese
 */

const { jaMaxCapacityPhrase } = require("./helpers");

/**
 * Generate FAQs programmatically based on device specs (Japanese version)
 * Answers are specific to each device using its actual data
 * 
 * デバイス仕様に基づき、FAQをプログラムで生成
 * 各デバイスの実際のデータを使用して、回答をカスタマイズします
 * @param {object} device - The device object
 * @param {object} sdcardsMap - A map of all SD cards
 * @returns {Array<object>} - An array of FAQ objects {q, a}
 */
function generateFAQsJa(device, sdcardsMap) {
  const faqs = [];

  const speedClass = device.sdCard.minSpeed;
  const writeSpeed = device.sdCard.minWriteSpeed;
  const cardType = device.sdCard.type;
  const capacity = device.sdCard.recommendedCapacity;
  const maxCapacity = device.sdCard.maxCapacity;
  const testedMaxCapacity = device.sdCard.testedMaxCapacity;

  // Determine if this device has demanding speed requirements
  const isDemandingDevice = ["V60", "V90", "U3"].some((v) =>
    speedClass.includes(v)
  );
  const isNoSpeedRequired = ["最低要件なし", "指定なし", "No minimum required"].includes(speedClass) || speedClass.startsWith("N/A");
  const maxCapacityText = jaMaxCapacityPhrase(maxCapacity);

  // 1. スピードクラスに関する質問 (Speed Class Question)
  if (!isNoSpeedRequired) {
    const speedClassName = speedClass.match(/V\d+/)?.[0] || speedClass;
    faqs.push({
      q: `${speedClassName}は${device.name}に必要ですか？`,
      a: `はい、${device.name}には${speedClassName}以上のカードをおすすめします。${speedClassName}は書き込み速度${writeSpeed}以上を保証する規格で、${isDemandingDevice ? "高画質の録画でもコマ落ちや録画の停止を防げます" : "記録中のエラーを防げます"}。`,
    });
  }

  // 2. ストレージ容量に関する質問 (Storage Capacity Question)
  let capacityAnswer = `${capacity.join("または")}のカードがおすすめです。普段使いなら${capacity[0]}で十分で、${maxCapacityText}`;
  if (testedMaxCapacity) {
    capacityAnswer += `（${testedMaxCapacity}で動作報告あり）`;
  }
  capacityAnswer += `。撮影量が多く、カードの交換を減らしたい場合は大きめの容量が便利です。`;
  
  faqs.push({
    q: `${device.name}にはどのくらいのストレージ容量が必要ですか？`,
    a: capacityAnswer,
  });

  // 3. 古い/低速カードの互換性 (Older/Budget Card Compatibility)
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `${device.name}で古いまたは低速のカードを使用できますか？`,
      a: `おすすめしません。${speedClass}より遅いカードでは、コマ落ちやファイルの破損、録画の停止が起きることがあります。${speedClass}以上のカードを使ってください。`,
    });
  } else {
    faqs.push({
      q: `${device.name}で安価な低速カードを使用できますか？`,
      a: `はい、${device.name}ではほとんどのmicroSDカードが動作します。高速カードは必須ではありません。安価で速度の遅いカードでも問題なく動作しますが、${device.sdCard.minSpeed || "標準速度"}のカードの方が信頼性は高まります。`,
    });
  }

  // 4. カードタイプの互換性 (Card Type Compatibility)
  const hasMultipleTypes = cardType.includes(",");
  if (hasMultipleTypes) {
    const types = cardType.split(",").map((t) => t.trim());
    faqs.push({
      q: `${device.name}ではカードのタイプは重要ですか？`,
      a: `${device.name}は${types.join("、")}に対応しています。どのタイプも同じように動作するため、価格と入手しやすさで選んで問題ありません。速度や容量の制限も同じです。`,
    });
  } else if (cardType.includes("UHS")) {
    faqs.push({
      q: `${device.name}にはUHSカードが必要ですか？`,
      a: `${device.name}の性能を引き出すにはUHSカードがおすすめです。UHS非対応のカードも使えますが、転送速度が遅くなることがあります。この機種には${cardType.match(/UHS-I+/)?.[0] || "UHS-I"}のカードが適しています。`,
    });
  }

  // 5. プロ向け/デュアルカードに関する質問 (Professional/Dual Cards Question)
  if (device.recommendedBrands && device.recommendedBrands.length > 0) {
    const highEndCards = device.recommendedBrands
      .map((ref) => sdcardsMap[ref.id])
      .filter((card) => card && card.tier === "professional");

    if (highEndCards.length > 0 || isDemandingDevice) {
      faqs.push({
        q: `${device.name}で複数のカードを使用すべきですか？`,
        a: `仕事の撮影や長時間の撮影では、カードを複数枚に分けると、1枚が故障したときに失うデータを減らせます。デュアルスロットの機種なら、2枚に同時記録してバックアップにする設定もあります。撮り直しのきかない撮影では特に有効です。`,
      });
    }
  }

  // 6. ブランドの信頼性に関する質問 (Brand Reliability Question)
  faqs.push({
    q: `${device.name}で使用するカードのブランドは重要ですか？`,
    a: `はい。SanDisk、Lexar、Kingston、KIOXIA（旧東芝メモリ）、Samsungなど信頼できるメーカーを選んでください。保証がしっかりしており、表示どおりの速度が出ます。無名ブランドや極端に安いカードは、容量や速度を偽った偽造品のことがあります。`,
  });

  // 7. 間違ったカードを使用した際のリスク (Data Loss/Corruption Risk)
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `${device.name}で間違ったカードを使用するとどうなりますか？`,
      a: `${speedClass}より遅いカードでは、録画中のコマ落ちやファイルの破損が起きたり、録画が途中で止まったりすることがあります。データを失わないよう、${speedClass}以上のカードを使ってください。`,
    });
  }

  // 8. カードの寿命に関する質問 (Card Lifespan Question)
  faqs.push({
    q: `SDカードは${device.name}でどのくらい持ちますか？`,
    a: `品質の良いSDカードなら、通常の使い方で3〜5年ほど使えます。読み書きのエラーやファイルの破損が増えてきたら交換してください。`,
  });

  return faqs;
}

/**
 * Merge generated FAQs with custom FAQs from device data
 * Custom FAQs override generated ones (by matching question)
 * 
 * 生成されたFAQとデバイスデータ内のカスタムFAQをマージします
 * カスタムFAQは（質問が一致する場合）生成されたものを上書きします
 * @param {Array<object>} customFAQs - Custom FAQs from device data
 * @param {Array<object>} generatedFAQs - Programmatically generated FAQs
 * @returns {Array<object>} - The final merged array of FAQs
 */
function mergeFAQsJa(customFAQs, generatedFAQs) {
  if (!customFAQs || customFAQs.length === 0) {
    return generatedFAQs;
  }

  // Custom FAQs take priority - filter out generated ones with matching questions
  const customQuestions = new Set(customFAQs.map((f) => f.q.toLowerCase()));
  const merged = customFAQs.slice();

  generatedFAQs.forEach((generated) => {
    if (!customQuestions.has(generated.q.toLowerCase())) {
      merged.push(generated);
    }
  });

  return merged;
}

module.exports = { generateFAQsJa, mergeFAQsJa };
