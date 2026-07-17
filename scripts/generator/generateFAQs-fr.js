/**
 * FAQ Generator (French) - Generate device-specific FAQ answers in French
 */

function generateFAQsFr(device, sdcardsMap) {
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
    speedClass === "Aucune exigence minimale" ||
    speedClass === "No minimum required";

  // 1. Speed Class
  if (!isNoSpeedRequired) {
    const speedClassName = speedClass.match(/V\d+/)?.[0] || speedClass;
    faqs.push({
      q: `La classe ${speedClassName} est-elle nécessaire pour ${device.name} ?`,
      a: `Oui, ${speedClassName} est recommandée pour ${device.name}. Elle garantit une vitesse d'écriture soutenue minimale de ${writeSpeed}, nécessaire pour un enregistrement ${isDemandingDevice ? "professionnel " : ""}stable, sans perte d'images ni erreurs.`,
    });
  }

  // 2. Storage Capacity
  let capacityAnswer = `Nous recommandons des cartes de ${capacity.join(" ou ")}. Une carte de ${capacity[0]} convient pour un usage courant, avec ${maxCapacity} comme capacité maximale prise en charge`;
  if (testedMaxCapacity) {
    capacityAnswer += ` (${testedMaxCapacity} testée et validée)`;
  }
  capacityAnswer += `. Les capacités plus élevées sont utiles si vous filmez fréquemment et souhaitez limiter les changements de carte.`;

  faqs.push({
    q: `Quelle capacité de stockage choisir pour ${device.name} ?`,
    a: capacityAnswer,
  });

  // 3. Older/Budget Card Compatibility
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `Puis-je utiliser une carte plus ancienne ou plus lente avec ${device.name} ?`,
      a: `Ce n'est pas recommandé. Des cartes plus lentes que ${speedClass} peuvent provoquer des pertes d'images, des fichiers corrompus ou des échecs d'enregistrement. Utilisez toujours au minimum ${speedClass} pour garantir la fiabilité.`,
    });
  } else {
    faqs.push({
      q: `Puis-je utiliser une carte d'entrée de gamme plus lente avec ${device.name} ?`,
      a: `Oui, n'importe quelle carte microSD fonctionne avec ${device.name}. Les cartes haute vitesse ne sont pas requises. Des cartes moins chères et plus lentes fonctionneront bien, même si les cartes ${device.sdCard.minSpeed || "de vitesse standard"} offrent une meilleure fiabilité.`,
    });
  }

  // 4. Card Type Compatibility
  const hasMultipleTypes = cardType.includes(",");
  if (hasMultipleTypes) {
    const types = cardType.split(",").map((t) => t.trim());
    faqs.push({
      q: `Le type de carte compte-t-il pour ${device.name} ?`,
      a: `${device.name} accepte ${types.join(", ")}. Tous les types fonctionnent de la même manière, choisissez donc selon le prix et la disponibilité. Les limites de vitesse et de capacité sont identiques.`,
    });
  } else if (cardType.includes("UHS")) {
    faqs.push({
      q: `Ai-je besoin d'une carte UHS pour ${device.name} ?`,
      a: `Les cartes UHS sont recommandées pour de meilleures performances avec ${device.name}. Les cartes non-UHS fonctionneront également, mais avec des vitesses de transfert plus lentes. Pour cet appareil, UHS-${cardType.match(/UHS-\d/)?.[0] || "II"} est optimal.`,
    });
  }

  // 5. Professional/Dual Cards
  if (device.recommendedBrands && device.recommendedBrands.length > 0) {
    const highEndCards = device.recommendedBrands
      .map((ref) => sdcardsMap[ref.id])
      .filter((card) => card && card.tier === "professional");

    if (highEndCards.length > 0 || isDemandingDevice) {
      faqs.push({
        q: `Dois-je utiliser plusieurs cartes avec ${device.name} ?`,
        a: `Pour un usage professionnel ou des sessions de prise de vue prolongées, l'utilisation de deux cartes apporte redondance et sauvegarde. Ainsi, vous ne perdrez pas vos images si une carte tombe en panne. C'est particulièrement important pour des enregistrements précieux.`,
      });
    }
  }

  // 6. Brand Reliability
  faqs.push({
    q: `La marque compte-t-elle pour ${device.name} ?`,
    a: `Oui, des marques fiables comme SanDisk, Lexar et Kingston sont recommandées. Les marques de qualité offrent une meilleure fiabilité et un meilleur support de garantie. Évitez les marques inconnues, surtout pour les appareils exigeants.`,
  });

  // 7. Data Loss/Corruption Risk
  if (!isNoSpeedRequired) {
    faqs.push({
      q: `Que se passe-t-il si j'utilise la mauvaise carte avec ${device.name} ?`,
      a: `Utiliser une carte plus lente que ${speedClass} peut provoquer : des pertes d'images pendant l'enregistrement, des fichiers corrompus ou un échec complet de l'enregistrement. Restez au minimum à ${speedClass} pour éviter toute perte de données.`,
    });
  }

  // 8. Card Lifespan
  faqs.push({
    q: `Combien de temps dure une carte SD avec ${device.name} ?`,
    a: `Les cartes SD de qualité durent généralement 3 à 5 ans en usage normal. Remplacez votre carte si vous constatez des erreurs de lecture/écriture, des fichiers corrompus, ou si elle a été chutée ou exposée à des conditions extrêmes.`,
  });

  return faqs;
}

function mergeFAQsFr(customFAQs, generatedFAQs) {
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

module.exports = { generateFAQsFr, mergeFAQsFr };
