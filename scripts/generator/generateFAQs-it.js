/**
 * FAQ Generator (Italian) - Generate device-specific FAQ answers in Italian
 */

function generateFAQsIt(device, sdcardsMap) {
  const faqs = [];

  const speedClass = device.sdCard.minSpeed;
  const writeSpeed = device.sdCard.minWriteSpeed;
  const cardType = device.sdCard.type;
  const capacity = device.sdCard.recommendedCapacity;
  const maxCapacity = device.sdCard.maxCapacity;
  const testedMaxCapacity = device.sdCard.testedMaxCapacity;

  const isDemandingDevice = ["V60", "V90", "U3"].some((v) =>
    speedClass.includes(v)
  );
  const isNoSpeedRequired =
    speedClass === "Nessun requisito minimo" ||
    speedClass === "No minimum required";

  // 1. Speed Class
  if (!isNoSpeedRequired) {
    const speedClassName = speedClass.match(/V\d+/)?.[0] || speedClass;
    faqs.push({
      q: `La classe ${speedClassName} è necessaria per ${device.name}?`,
      a: `Sì, ${speedClassName} è consigliata per ${device.name}. Garantisce una velocità di scrittura sostenuta minima di ${writeSpeed}, necessaria per una registrazione ${isDemandingDevice ? "professionale " : ""}stabile, senza perdita di fotogrammi o errori.`,
    });
  }

  // 2. Storage Capacity
  let capacityAnswer = `Consigliamo schede da ${capacity.join(" o ")}. Una scheda da ${capacity[0]} è adatta all'uso tipico, con ${maxCapacity} come capacità massima supportata`;
  if (testedMaxCapacity) {
    capacityAnswer += ` (${testedMaxCapacity} testata e verificata funzionante)`;
  }
  capacityAnswer += `. Capacità maggiori sono utili se si registra frequentemente e si vuole ridurre al minimo i cambi di scheda.`;

  faqs.push({
    q: `Quale capacità di archiviazione scegliere per ${device.name}?`,
    a: capacityAnswer,
  });

  // 3. Older/Budget Card Compatibility
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `Posso usare schede più vecchie o più lente con ${device.name}?`,
      a: `Non è consigliato. Schede più lente di ${speedClass} possono causare perdita di fotogrammi, file corrotti o errori di registrazione. Usa sempre almeno ${speedClass} per garantire l'affidabilità.`,
    });
  } else {
    faqs.push({
      q: `Posso usare schede economiche più lente con ${device.name}?`,
      a: `Sì, qualsiasi scheda microSD funziona con ${device.name}. Non sono necessarie schede ad alta velocità. Schede più economiche e più lente funzioneranno bene, anche se le schede ${device.sdCard.minSpeed || "a velocità standard"} offrono maggiore affidabilità.`,
    });
  }

  // 4. Card Type Compatibility
  const hasMultipleTypes = cardType.includes(",");
  if (hasMultipleTypes) {
    const types = cardType.split(",").map((t) => t.trim());
    faqs.push({
      q: `Il tipo di scheda è importante per ${device.name}?`,
      a: `${device.name} supporta ${types.join(", ")}. Tutti i tipi funzionano allo stesso modo, quindi scegli in base a prezzo e disponibilità. I limiti di velocità e capacità sono gli stessi.`,
    });
  } else if (cardType.includes("UHS")) {
    faqs.push({
      q: `Serve una scheda UHS per ${device.name}?`,
      a: `Le schede UHS sono consigliate per le migliori prestazioni con ${device.name}. Le schede non UHS funzioneranno comunque, ma con velocità di trasferimento inferiori. Per questo dispositivo, UHS-${cardType.match(/UHS-\d/)?.[0] || "II"} è l'opzione ottimale.`,
    });
  }

  // 5. Professional/Dual Cards
  if (device.recommendedBrands && device.recommendedBrands.length > 0) {
    const highEndCards = device.recommendedBrands
      .map((ref) => sdcardsMap[ref.id])
      .filter((card) => card && card.tier === "professional");

    if (highEndCards.length > 0 || isDemandingDevice) {
      faqs.push({
        q: `Dovrei usare più di una scheda con ${device.name}?`,
        a: `Per uso professionale o sessioni di ripresa prolungate, usare due schede offre ridondanza e backup. Con più schede non perderai i filmati se una si guasta. Questo è particolarmente importante per registrazioni di valore.`,
      });
    }
  }

  // 6. Brand Reliability
  faqs.push({
    q: `La marca è importante per ${device.name}?`,
    a: `Sì, sono consigliate marche affidabili come SanDisk, Lexar e Kingston. I marchi di qualità offrono maggiore affidabilità e migliore supporto in garanzia. Evita marche sconosciute, soprattutto per dispositivi esigenti.`,
  });

  // 7. Data Loss/Corruption Risk
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `Cosa succede se uso la scheda sbagliata con ${device.name}?`,
      a: `Usare una scheda più lenta di ${speedClass} può causare: perdita di fotogrammi durante la registrazione, file corrotti o errore completo di registrazione. Usa almeno ${speedClass} per evitare la perdita di dati.`,
    });
  }

  // 8. Card Lifespan
  faqs.push({
    q: `Quanto dura una scheda SD con ${device.name}?`,
    a: `Le schede SD di qualità durano in genere 3-5 anni con un uso normale. Sostituisci la scheda se noti errori di lettura/scrittura, file corrotti o se è caduta o è stata esposta a condizioni estreme.`,
  });

  return faqs;
}

function mergeFAQsIt(customFAQs, generatedFAQs) {
  if (!customFAQs || customFAQs.length === 0) {
    return generatedFAQs;
  }

  const customQuestions = new Set(customFAQs.map((f) => f.q.toLowerCase()));
  const merged = customFAQs.slice();

  generatedFAQs.forEach((generated) => {
    if (!customQuestions.has(generated.q.toLowerCase())) {
      merged.push(generated);
    }
  });

  return merged;
}

module.exports = { generateFAQsIt, mergeFAQsIt };
