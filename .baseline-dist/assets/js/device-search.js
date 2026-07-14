/**
 * Device Search Component for Alpine.js
 * Registers the deviceSearch component globally
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
                .catch(err => {
                    console.error('[DeviceSearch] Failed to load devices:', err);
                    this.allDevices = [];
                    this.filtered = [];
                });
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
            if (!this.filtered || this.filtered.length === 0) {
                return {};
            }

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
        },

        getCategorySlug(category) {
            return category.toLowerCase().replace(/&/g, "and").replace(/\s+/g, "-");
        }
    }));
});
