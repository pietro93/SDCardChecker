/**
 * SD Card Checker - Alpine.js Application
 * Modern, lightweight interactivity for static sites
 */

// Device Search Component
function deviceSearch() {
  return {
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

    handleKeydown(e) {
      if (e.key === 'Escape') {
        this.open = false;
      }
    }
  };
}

// FAQ Component
function faqAccordion() {
  return {
    items: [],

    init() {
      // Initialize with open state
      this.items.forEach(item => {
        item.open = false;
      });
    },

    toggleItem(index) {
      this.items[index].open = !this.items[index].open;
    },

    closeOthers(index) {
      this.items.forEach((item, i) => {
        if (i !== index) {
          item.open = false;
        }
      });
    }
  };
}
