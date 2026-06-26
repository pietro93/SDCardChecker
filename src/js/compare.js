/**
 * SD Card Checker - Compare Widget
 * Drives card-swapping for .compare-grid instances (standalone /compare/
 * page and the embedded device-page widget). Mirrors the server-side
 * rendering in scripts/generator/generate-compare.js field-for-field so a
 * swapped-in card matches what build-time rendering would have produced.
 */
(function () {
  "use strict";

  let cardMapPromise = null;

  function loadCards() {
    if (!cardMapPromise) {
      cardMapPromise = fetch("/data/sdcards.json")
        .then((res) => res.json())
        .then((data) => {
          const allCards = (data.sdcards || []).filter((c) => !c.navCardProduct);
          return Object.fromEntries(allCards.map((c) => [c.id, c]));
        })
        .catch((err) => {
          console.error("[Compare] Failed to load sdcards.json:", err);
          return {};
        });
    }
    return cardMapPromise;
  }

  function priceBadgeHTML(card) {
    if (!card.priceSymbol) return "";
    return `<span class="compare-price-badge">${card.priceSymbol} &middot; ${card.priceTier || ""}</span>`;
  }

  function specsListHTML(card) {
    const specs = card.specs || {};
    const rows = [
      ["UHS Rating", specs.uhs],
      ["Speed Class", specs.speedClass],
      ["App Performance", specs.appPerformance],
      ["Read Speed", specs.readSpeed],
      ["Write Speed", specs.writeSpeed],
      ["Endurance", specs.endurance],
    ].filter(([, value]) => value);

    return `<ul class="compare-specs-list">${rows
      .map(
        ([label, value]) =>
          `<li><span class="compare-spec-label">${label}</span><span class="compare-spec-value">${value}</span></li>`
      )
      .join("")}</ul>`;
  }

  function prosConsHTML(card) {
    const pros = (card.pros || "").split(",").map((s) => s.trim()).filter(Boolean);
    const cons = (card.cons || "").split(",").map((s) => s.trim()).filter(Boolean);
    return `
      ${pros.length ? `<div class="compare-pros"><h4>Pros</h4><ul>${pros.map((p) => `<li>${p}</li>`).join("")}</ul></div>` : ""}
      ${cons.length ? `<div class="compare-cons"><h4>Cons</h4><ul>${cons.map((c) => `<li>${c}</li>`).join("")}</ul></div>` : ""}
    `;
  }

  function capacitiesHTML(card) {
    if (!card.availableCapacities || !card.availableCapacities.length) return "";
    return `<div class="compare-capacities"><span class="compare-spec-label">Available Capacities</span><span class="compare-spec-value">${card.availableCapacities
      .map((c) => `${c}GB`)
      .join(", ")}</span></div>`;
  }

  function amazonButtonHTML(card, utmCampaign) {
    const baseUrl = card.amazonSearchUrl || card.affiliateUrl;
    if (!baseUrl) return "";
    const utmParams = `utm_source=sdcardchecker&utm_medium=compare&utm_campaign=${utmCampaign}`;
    const url = baseUrl.includes("?") ? `${baseUrl}&${utmParams}` : `${baseUrl}?${utmParams}`;
    return `<a href="${url}" target="_blank" rel="nofollow noopener" class="compare-amazon-btn"><i class="fas fa-shopping-cart"></i> View on Amazon</a>`;
  }

  function renderCardPanel(card, utmCampaign) {
    const image = card.imageUrl || "/img/cards/placeholder.webp";
    const tierBadge = card.tier
      ? `<span class="compare-tier-badge compare-tier-${card.tier}">${card.tier}</span>`
      : "";

    return `
      <button type="button" class="compare-remove-btn" aria-label="Remove ${card.name} from comparison" title="Remove"><i class="fas fa-xmark"></i></button>
      ${tierBadge}
      <div class="compare-card-image"><img src="${image}" alt="${card.name}" width="120" height="120" loading="lazy" onerror="this.src='/img/cards/placeholder.webp'"></div>
      <h3 class="compare-card-name">${card.name}</h3>
      ${priceBadgeHTML(card)}
      ${specsListHTML(card)}
      ${capacitiesHTML(card)}
      ${prosConsHTML(card)}
      ${amazonButtonHTML(card, utmCampaign)}
    `;
  }

  function renderEmptyPanelHTML() {
    return `
      <div class="compare-empty-state">
        <i class="fas fa-circle-plus"></i>
        <p>Add a card to compare</p>
      </div>
    `;
  }

  function setSlotEmpty(slot) {
    const select = slot.querySelector(".compare-select");
    const panel = slot.querySelector(".compare-card-panel");
    if (select) select.value = "";
    if (panel) {
      panel.dataset.cardId = "";
      panel.classList.add("compare-card-panel-empty");
      panel.innerHTML = renderEmptyPanelHTML();
    }
  }

  function setSlotCard(slot, card, utmCampaign) {
    const select = slot.querySelector(".compare-select");
    const panel = slot.querySelector(".compare-card-panel");
    if (select) select.value = card.id;
    if (panel) {
      panel.dataset.cardId = card.id;
      panel.classList.remove("compare-card-panel-empty");
      panel.innerHTML = renderCardPanel(card, utmCampaign);
    }
  }

  function updateUrlParam(grid) {
    if (grid.dataset.mode !== "standalone") return;
    const ids = Array.from(grid.querySelectorAll(".compare-select"))
      .map((sel) => sel.value)
      .filter(Boolean);
    const url = new URL(window.location.href);
    if (ids.length) {
      url.searchParams.set("cards", ids.join(","));
    } else {
      url.searchParams.delete("cards");
    }
    history.replaceState(null, "", url);
  }

  function trackSwap(card, slotIndex) {
    if (typeof gtag !== "undefined") {
      gtag("event", "compare_card_swap", {
        card_id: card.id,
        card_name: card.name,
        slot: slotIndex,
      });
    }
  }

  function wireGrid(grid) {
    const utmCampaign = grid.dataset.utmCampaign || "compare";

    grid.querySelectorAll(".compare-select").forEach((select) => {
      select.addEventListener("change", async () => {
        const slot = select.closest(".compare-slot");

        if (!select.value) {
          setSlotEmpty(slot);
          updateUrlParam(grid);
          return;
        }

        const cardMap = await loadCards();
        const card = cardMap[select.value];
        if (!card) return;

        setSlotCard(slot, card, utmCampaign);
        updateUrlParam(grid);
        trackSwap(card, select.dataset.slot);
      });
    });

    grid.addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".compare-remove-btn");
      if (!removeBtn) return;
      const slot = removeBtn.closest(".compare-slot");
      if (!slot) return;
      setSlotEmpty(slot);
      updateUrlParam(grid);
    });
  }

  // Standalone page only: a shared /compare/?cards=a,b,c URL may reference a
  // card that's since been removed/renamed in sdcards.json - skip it rather
  // than rendering a broken slot.
  function applyUrlOverride(grid) {
    if (grid.dataset.mode !== "standalone") return;
    const params = new URLSearchParams(window.location.search);
    const ids = (params.get("cards") || "").split(",").map((s) => s.trim()).filter(Boolean);
    if (!ids.length) return;

    loadCards().then((cardMap) => {
      const slots = grid.querySelectorAll(".compare-slot");
      const utmCampaign = grid.dataset.utmCampaign || "compare";
      ids.slice(0, slots.length).forEach((id, i) => {
        const card = cardMap[id];
        if (!card) return;
        setSlotCard(slots[i], card, utmCampaign);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".compare-grid").forEach((grid) => {
      wireGrid(grid);
      applyUrlOverride(grid);
    });
  });
})();
