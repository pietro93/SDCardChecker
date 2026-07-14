/**
 * SD Card Checker - Alpine.js Search Component
 * Lightweight, reactive device search with dropdown
 */

document.addEventListener('alpine:init', () => {
  Alpine.data('deviceSearch', () => ({
    query: '',
    allDevices: [],
    filtered: [],
    open: false,

    init() {
      this.loadDevices();
    },

    loadDevices() {
      fetch('/data/devices.json')
        .then(res => res.json())
        .then(data => {
          this.allDevices = data.devices;
          this.filtered = this.allDevices.slice(0, 30);
        })
        .catch(err => console.error('Failed to load devices:', err));
    },

    filterDevices() {
      const q = this.query.toLowerCase();
      if (!q) {
        this.filtered = this.allDevices.slice(0, 30);
        return;
      }

      this.filtered = this.allDevices.filter(device =>
        device.name.toLowerCase().includes(q) ||
        device.category.toLowerCase().includes(q) ||
        (device.searchTerms && device.searchTerms.some(term =>
          term.toLowerCase().includes(q)
        ))
      );
    },

    groupedDevices() {
      const grouped = {};
      this.filtered.forEach(device => {
        if (!grouped[device.category]) {
          grouped[device.category] = [];
        }
        grouped[device.category].push(device);
      });
      return Object.keys(grouped).sort().reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
      }, {});
    },

    handleKeydown(e) {
      if (e.key === 'Escape') {
        this.open = false;
      }
    }
  }));

  // FAQ Accordion Component
  Alpine.data('faqAccordion', () => ({
    items: [],

    initFAQ() {
      // Get all FAQ items and initialize them
      const faqElements = document.querySelectorAll('.faq-item');
      this.items = Array.from(faqElements).map((el, idx) => ({
        index: idx,
        open: false
      }));
    },

    toggleItem(index) {
      this.items.forEach((item, i) => {
        if (i !== index) {
          item.open = false;
        }
      });
      this.items[index].open = !this.items[index].open;
    }
  }));
});
