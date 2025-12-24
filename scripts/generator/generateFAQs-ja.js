/**
 * FAQ Generator (Japanese) - プログラムでデバイス固有のFAQ回答を生成
 * Programmatically generate device-specific FAQ answers in Japanese
 */

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
  const isNoSpeedRequired = speedClass === "最低要件なし" || speedClass === "No minimum required";

  // 1. スピードクラスに関する質問 (Speed Class Question)
  if (!isNoSpeedRequired) {
    const speedClassName = speedClass.match(/V\d+/)?.[0] || speedClass;
    faqs.push({
      q: `${speedClassName}は${device.name}に必要ですか？`,
      a: `はい、${speedClassName}は${device.name}に推奨されます。${writeSpeed}の最小持続書き込み速度を保証し、${isDemandingDevice ? "プロフェッショナルな" : ""}安定した${isDemandingDevice ? "録画" : "記録"}中にフレーム落ちやエラーなく${isDemandingDevice ? "プロフェッショナルな記録" : "安定した動作"}が可能になります。`,
    });
  }

  // 2. ストレージ容量に関する質問 (Storage Capacity Question)
  let capacityAnswer = `${capacity.join("または")}のカードをお勧めします。通常の使用には${capacity[0]}で十分ですが、最大${maxCapacity}まで対応しています`;
  if (testedMaxCapacity) {
    capacityAnswer += `（${testedMaxCapacity}の動作を検証済み）`;
  }
  capacityAnswer += `。頻繁に撮影し、カード交換を最小限に抑えたい場合は、より大きな容量が便利です。`;
  
  faqs.push({
    q: `${device.name}にはどのくらいのストレージ容量が必要ですか？`,
    a: capacityAnswer,
  });

  // 3. 古い/低速カードの互換性 (Older/Budget Card Compatibility)
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `${device.name}で古いまたは低速のカードを使用できますか？`,
      a: `推奨されません。${speedClass}より遅いカードを使用すると、フレーム落ち、ファイル破損、録画失敗の原因となります。信頼性を確保するため、常に${speedClass}以上のカードを使用してください。`,
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
      a: `${device.name}で最高のパフォーマンスを得るためにはUHSカードが推奨されます。非UHSカードも動作しますが、転送速度が遅くなる可能性があります。このデバイスにはUHS-${cardType.match(/UHS-\d/)?.[0] || "II"}が最適です。`,
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
        a: `プロフェッショナルな用途や長時間の撮影セッションでは、デュアルカード（2枚のカード）を使用することで冗長性が確保され、バックアップの役割も果たします。複数のカードを使用することで、万が一1枚のカードが故障しても映像を失うリスクを減らせます。これは特に貴重な記録を行う際に重要です。`,
      });
    }
  }

  // 6. ブランドの信頼性に関する質問 (Brand Reliability Question)
  faqs.push({
    q: `${device.name}で使用するカードのブランドは重要ですか？`,
    a: `はい。SanDisk、Lexar、Kingston、またはKIOXIA（旧東芝メモリ）やSamsungなどの信頼できるブランドが推奨されます。高品質なブランドは信頼性が高く、保証サポートも充実しています。特に要求の厳しいデバイスでは、無名ブランドは避けるべきです。`,
  });

  // 7. 間違ったカードを使用した際のリスク (Data Loss/Corruption Risk)
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `${device.name}で間違ったカードを使用するとどうなりますか？`,
      a: `${speedClass}より遅いカードを使用すると、録画中のフレーム落ち、ファイルの破損、または録画の完全な失敗を引き起こす可能性があります。データ損失を避けるため、${speedClass}以上のカードを必ず使用してください。`,
    });
  }

  // 8. カードの寿命に関する質問 (Card Lifespan Question)
  faqs.push({
    q: `SDカードは${device.name}でどのくらい持ちますか？`,
    a: `高品質なSDカードは、通常の使用で3～5年程度持ちます。読み書きエラーやファイルの破損が頻繁に発生する場合、またはカードを落としたり極端な環境にさらしたりした場合は、交換することをお勧めします。`,
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
