/**
 * FAQ Generator (German) - Generate device-specific FAQ answers in German
 */

function generateFAQsDe(device, sdcardsMap) {
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
    speedClass === "Keine Mindestanforderung" ||
    speedClass === "No minimum required";

  // 1. Speed Class
  if (!isNoSpeedRequired) {
    const speedClassName = speedClass.match(/V\d+/)?.[0] || speedClass;
    faqs.push({
      q: `Ist ${speedClassName} für ${device.name} erforderlich?`,
      a: `Ja, ${speedClassName} wird für ${device.name} empfohlen. Damit ist eine minimale anhaltende Schreibgeschwindigkeit von ${writeSpeed} garantiert, die für eine stabile ${isDemandingDevice ? "professionelle " : ""}Aufnahme ohne Frame-Drops oder Fehler notwendig ist.`,
    });
  }

  // 2. Storage Capacity
  let capacityAnswer = `Wir empfehlen Karten mit ${capacity.join(" oder ")}. Eine ${capacity[0]}-Karte reicht für den typischen Gebrauch, ${maxCapacity} ist die maximal unterstützte Kapazität`;
  if (testedMaxCapacity) {
    capacityAnswer += ` (${testedMaxCapacity} getestet und als funktionierend bestätigt)`;
  }
  capacityAnswer += `. Größere Kapazitäten sind sinnvoll, wenn Sie häufig aufnehmen und Kartenwechsel minimieren möchten.`;

  faqs.push({
    q: `Welche Speicherkapazität sollte ich für ${device.name} wählen?`,
    a: capacityAnswer,
  });

  // 3. Older/Budget Card Compatibility
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `Kann ich ältere oder langsamere Karten mit ${device.name} verwenden?`,
      a: `Nicht empfohlen. Karten, die langsamer als ${speedClass} sind, können Frame-Drops, beschädigte Dateien oder Aufnahmefehler verursachen. Verwenden Sie für Zuverlässigkeit immer mindestens ${speedClass}.`,
    });
  } else {
    faqs.push({
      q: `Kann ich günstige langsamere Karten mit ${device.name} verwenden?`,
      a: `Ja, jede microSD-Karte funktioniert mit ${device.name}. Es sind keine High-Speed-Karten erforderlich. Günstigere, langsamere Karten funktionieren einwandfrei, auch wenn ${device.sdCard.minSpeed || "Standardgeschwindigkeit"}-Karten eine höhere Zuverlässigkeit bieten.`,
    });
  }

  // 4. Card Type Compatibility
  const hasMultipleTypes = cardType.includes(",");
  if (hasMultipleTypes) {
    const types = cardType.split(",").map((t) => t.trim());
    faqs.push({
      q: `Spielt der Kartentyp bei ${device.name} eine Rolle?`,
      a: `${device.name} unterstützt ${types.join(", ")}. Alle Typen funktionieren gleich, wählen Sie also nach Preis und Verfügbarkeit. Geschwindigkeits- und Kapazitätsgrenzen sind identisch.`,
    });
  } else if (cardType.includes("UHS")) {
    faqs.push({
      q: `Brauche ich eine UHS-Karte für ${device.name}?`,
      a: `UHS-Karten werden für die beste Leistung mit ${device.name} empfohlen. Nicht-UHS-Karten funktionieren ebenfalls, können aber langsamere Übertragungsgeschwindigkeiten haben. Für dieses Gerät ist UHS-${cardType.match(/UHS-\d/)?.[0] || "II"} optimal.`,
    });
  }

  // 5. Professional/Dual Cards
  if (device.recommendedBrands && device.recommendedBrands.length > 0) {
    const highEndCards = device.recommendedBrands
      .map((ref) => sdcardsMap[ref.id])
      .filter((card) => card && card.tier === "professional");

    if (highEndCards.length > 0 || isDemandingDevice) {
      faqs.push({
        q: `Sollte ich mehr als eine Karte mit ${device.name} verwenden?`,
        a: `Für den professionellen Einsatz oder längere Aufnahmesitzungen bieten zwei Karten Redundanz und ein Backup. Mit mehreren Karten verlieren Sie kein Material, falls eine Karte ausfällt. Das ist besonders bei wertvollen Aufnahmen wichtig.`,
      });
    }
  }

  // 6. Brand Reliability
  faqs.push({
    q: `Spielt die Marke bei ${device.name} eine Rolle?`,
    a: `Ja, vertrauenswürdige Marken wie SanDisk, Lexar und Kingston werden empfohlen. Markenqualität bedeutet höhere Zuverlässigkeit und besseren Garantie-Support. Vermeiden Sie unbekannte Marken, besonders bei anspruchsvollen Geräten.`,
  });

  // 7. Data Loss/Corruption Risk
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `Was passiert, wenn ich die falsche Karte mit ${device.name} verwende?`,
      a: `Karten, die langsamer als ${speedClass} sind, können Folgendes verursachen: Frame-Drops während der Aufnahme, beschädigte Dateien oder komplette Aufnahmefehler. Verwenden Sie mindestens ${speedClass}, um Datenverlust zu vermeiden.`,
    });
  }

  // 8. Card Lifespan
  faqs.push({
    q: `Wie lange hält eine SD-Karte bei ${device.name}?`,
    a: `Qualitäts-SD-Karten halten bei normalem Gebrauch typischerweise 3-5 Jahre. Ersetzen Sie Ihre Karte, wenn Sie Lese-/Schreibfehler oder beschädigte Dateien feststellen oder wenn sie heruntergefallen ist oder extremen Bedingungen ausgesetzt war.`,
  });

  return faqs;
}

function mergeFAQsDe(customFAQs, generatedFAQs) {
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

module.exports = { generateFAQsDe, mergeFAQsDe };
