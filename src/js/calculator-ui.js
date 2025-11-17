/**
 * Storage Calculator UI State Manager
 * Alpine.js integration for form handling, layer transitions, result display
 * Version 2.0 - Phase 0 & 1 Support
 */

class CalculatorUI {
    /**
     * Initialize calculator state object for Alpine.js
     * @param {Object} options - Configuration options
     * @returns {Object} Alpine.js data object
     */
    static init(options = {}) {
        return {
            // UI State
            mode: 'forward', // 'forward' or 'reverse'
            currentLayer: 'usecase', // 'usecase', 'details', 'results'
            activeScenario: options.defaultScenario || 'video', // 'video', 'photo', 'continuous'

            // Use Case Presets
            scenarios: {
                video: { name: 'Video Recording', icon: '🎥' },
                photo: { name: 'Photo Burst/Timelapse', icon: '📸' },
                continuous: { name: 'Continuous Recording', icon: '🔴' }
            },

            // Forward Calculation Form
            forward: {
                scenario: options.defaultScenario || 'video',

                // Video inputs
                video: {
                    resolution: '4K',
                    fps: 60,
                    codec: 'H.264',
                    bitrateMbps: 150,
                    durationHours: 2,
                    durationMinutes: 0
                },

                // Photo inputs
                photo: {
                    photoCount: 1000,
                    fileSizeMB: 2.5, // 5MP JPEG default
                    isRaw: false,
                    rawToggleOptions: {
                        jpeg5mp: 2.5,
                        jpeg20mp: 8,
                        raw20mp: 30,
                        raw45mp: 65
                    }
                },

                // Continuous inputs
                continuous: {
                    bitrateMbps: 5, // 1080p default
                    hoursPerDay: 24,
                    daysNeeded: 7
                },

                // Advanced options
                overheadPercent: 10,
                overheadMin: 5,
                overheadMax: 25,
                compareFormats: false
            },

            // Reverse Calculation Form
            reverse: {
                scenario: options.defaultScenario || 'video',
                cardCapacityGB: 128,
                cardCapacityOptions: [32, 64, 128, 256, 512],

                // Video/continuous reverse
                video: {
                    bitrateMbps: 150
                },

                // Photo reverse
                photo: {
                    fileSizeMB: 2.5
                },

                overheadPercent: 10
            },

            // Device Selector (Phase 1)
            deviceSelector: {
                enabled: options.deviceSelectorEnabled || false,
                selectedDeviceId: null,
                devices: options.devices || [],
                selectedDeviceData: null
            },

            // Card Selector (for reverse mode)
            cardSelectorSearch: '',
            cardSelectorOpen: false,
            allCards: [],
            filteredCards: [],
            selectedCard: null,

            // Calculation Results
            result: null,
            hasCalculated: false,
            showDefaultResult: true, // Show pre-calculated result on page load

            // UI State
            advancedExpanded: false,
            speedClassExpanded: false,

            // UI Helpers
            readonly: {
                resolutions: ['1080p', '2K', '4K', '6K'],
                fpsOptions: [24, 30, 60, 120],
                codecOptions: ['H.264', 'H.265', 'ProRes'],
                cardCapacities: [32, 64, 128, 256, 512]
            },

            /**
             * Validate numeric input with range checking
             * @private
             */
            validateNumericInput(event, min, max) {
                const input = event.target;
                const value = parseFloat(input.value);

                if (isNaN(value)) {
                    input.classList.add('border-red-500');
                    return false;
                }

                if (min !== undefined && value < min) {
                    input.value = min;
                }

                if (max !== undefined && value > max) {
                    input.value = max;
                }

                input.classList.remove('border-red-500');
                return true;
            },

            /**
             * Select use case and move to details layer
             */
            selectUseCase(scenario) {
                this.activeScenario = scenario;
                this.forward.scenario = scenario;
                this.reverse.scenario = scenario;
                this.currentLayer = 'details';
            },

            /**
             * Toggle between forward and reverse modes
             */
            toggleMode() {
                this.mode = this.mode === 'forward' ? 'reverse' : 'forward';
                this.currentLayer = 'details';
                this.result = null;
                this.hasCalculated = false;
            },

            /**
             * Select device and auto-fill bitrates (Phase 1)
             */
            selectDevice(deviceId) {
                if (!this.deviceSelector.devices) return;

                const device = this.deviceSelector.devices.find(d => d.id === deviceId);
                if (!device) return;

                this.deviceSelector.selectedDeviceId = deviceId;
                this.deviceSelector.selectedDeviceData = device;

                // Auto-fill form based on device presets
                if (device.recordingModes && device.recordingModes.length > 0) {
                    const defaultMode = device.recordingModes.find(m => m.isDefault) || device.recordingModes[0];

                    if (this.mode === 'forward') {
                        this.forward.video.bitrateMbps = defaultMode.bitrateMbps;
                        this.forward.video.fps = defaultMode.fps;
                        this.forward.video.resolution = defaultMode.resolution;
                        this.forward.video.codec = defaultMode.codec;
                    } else {
                        this.reverse.video.bitrateMbps = defaultMode.bitrateMbps;
                    }
                }
            },

            /**
             * Toggle RAW for photo mode
             */
            toggleRaw() {
                this.forward.photo.isRaw = !this.forward.photo.isRaw;

                // Update file size based on RAW toggle
                if (this.forward.photo.isRaw) {
                    this.forward.photo.fileSizeMB = 30; // RAW 20MP default
                } else {
                    this.forward.photo.fileSizeMB = 2.5; // JPEG 5MP default
                }
            },

            /**
             * Update photo file size from preset
             */
            updatePhotoFileSize(preset) {
                this.forward.photo.fileSizeMB = this.forward.photo.rawToggleOptions[preset];
            },

            /**
             * Perform forward calculation
             */
            calculate() {
                try {
                    const input = this._buildForwardInput();

                    // Validate numeric fields to prevent NaN errors
                    const numericFields = Object.entries(input).filter(([key]) => key !== 'scenario');
                    if (numericFields.some(([, val]) => isNaN(val) || val === '')) {
                        alert('Invalid input. Please enter valid numbers.');
                        return;
                    }

                    this.result = StorageCalculator.calculateForward(input);
                    this.currentLayer = 'results';
                    this.hasCalculated = true;

                    // Load and display card recommendations
                    this._loadAndDisplayCardRecommendations();

                    // Trigger GA4 event
                    this._trackEvent('calculator_calculate', {
                        scenario: this.activeScenario,
                        mode: 'forward'
                    });
                } catch (error) {
                    console.error('Calculation error:', error);
                    alert('Calculation error. Please check your inputs.');
                }
            },

            /**
             * Perform reverse calculation
             */
            calculateReverse() {
                try {
                    const input = this._buildReverseInput();
                    console.log('Reverse input:', input);

                    // Validate numeric fields to prevent NaN errors
                    const numericFields = Object.entries(input).filter(([key]) => key !== 'scenario');
                    if (numericFields.some(([, val]) => isNaN(val) || val === '')) {
                        console.warn('Invalid numeric fields:', numericFields.filter(([, val]) => isNaN(val) || val === ''));
                        alert('Invalid input. Please enter valid numbers.');
                        return;
                    }

                    this.result = StorageCalculator.calculateReverse(input);
                    console.log('Reverse result:', this.result);
                    this.currentLayer = 'results';
                    this.hasCalculated = true;

                    // Load and display card recommendations
                    this._loadAndDisplayCardRecommendations();

                    this._trackEvent('calculator_calculate', {
                        scenario: this.activeScenario,
                        mode: 'reverse'
                    });
                } catch (error) {
                    console.error('Calculation error:', error);
                    alert('Calculation error. Please check your inputs.');
                }
            },

            /**
             * Build input object for forward calculation
             * @private
             */
            _buildForwardInput() {
                const base = {
                    scenario: this.activeScenario,
                    overheadPercent: this.forward.overheadPercent
                };

                switch (this.activeScenario) {
                    case 'video':
                        return {
                            ...base,
                            bitrateMbps: parseFloat(this.forward.video.bitrateMbps),
                            durationHours: parseFloat(this.forward.video.durationHours) + parseFloat(this.forward.video.durationMinutes) / 60
                        };

                    case 'photo':
                        return {
                            ...base,
                            photoCount: parseInt(this.forward.photo.photoCount),
                            fileSizeMB: parseFloat(this.forward.photo.fileSizeMB),
                            shootingStyle: this.forward.photo.shootingStyle
                        };

                    case 'continuous':
                        return {
                            ...base,
                            bitrateMbps: parseFloat(this.forward.continuous.bitrateMbps),
                            hoursPerDay: parseFloat(this.forward.continuous.hoursPerDay),
                            daysNeeded: parseFloat(this.forward.continuous.daysNeeded)
                        };

                    default:
                        throw new Error(`Unknown scenario: ${this.activeScenario}`);
                }
            },

            /**
             * Build input object for reverse calculation
             * @private
             */
            _buildReverseInput() {
                const base = {
                    scenario: this.activeScenario,
                    cardCapacityGB: parseFloat(this.reverse.cardCapacityGB),
                    overheadPercent: this.reverse.overheadPercent
                };

                switch (this.activeScenario) {
                    case 'video':
                    case 'continuous':
                        return {
                            ...base,
                            bitrateMbps: parseFloat(this.reverse.video.bitrateMbps)
                        };

                    case 'photo':
                        return {
                            ...base,
                            fileSizeMB: parseFloat(this.reverse.photo.fileSizeMB)
                        };

                    default:
                        throw new Error(`Unknown scenario: ${this.activeScenario}`);
                }
            },

            /**
             * Track GA4 events
             * @private
             */
            _trackEvent(eventName, eventData) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', eventName, eventData);
                }
            },

            /**
             * Format storage result for display
             */
            getResultDisplay() {
                if (!this.result) return null;

                if (this.mode === 'forward') {
                    return {
                        title: 'You Need:',
                        capacity: `${this.result.recommendedCapacity}GB Minimum`,
                        storageRequired: `${this.result.totalGB}GB`,
                        rawFootage: `${this.result.rawGB}GB`,
                        overhead: `${this.result.overheadGB}GB`,
                        speedClass: this.result.speedClass,
                        minWriteSpeed: this.result.minWriteSpeed,
                        isSufficient: StorageCalculator.isCardSufficient(this.result.recommendedCapacity, this.result.totalGB)
                    };
                } else {
                    // Reverse
                    if (this.activeScenario === 'photo') {
                        return {
                            title: 'Photo Capacity:',
                            photoCount: this.result?.photoCount || 0,
                            recordingTimeString: null,
                            speedClass: this.result?.speedClass || 'V30',
                            minWriteSpeed: this.result?.minWriteSpeed || 30
                        };
                    } else {
                        return {
                            title: 'Your Card Duration:',
                            recordingTimeString: this.result?.recordingTimeString || '0 hours',
                            recordingHours: this.result?.recordingHours || 0,
                            daysFor24h: this.result?.daysFor24h || 0,
                            speedClass: this.result?.speedClass || 'V30',
                            minWriteSpeed: this.result?.minWriteSpeed || 30
                        };
                    }
                }
            },

            /**
             * Reset form to initial state
             */
            reset() {
                this.currentLayer = 'usecase';
                this.result = null;
                this.hasCalculated = false;
                this.mode = 'forward';
                this.advancedExpanded = false;
                this.speedClassExpanded = false;
            },

            /**
             * Calculate and display default result on page load
             * Shows immediate value before user interaction
             */
            loadDefaultResult() {
                if (!this.showDefaultResult) return;

                try {
                    const input = {
                        scenario: this.activeScenario,
                        bitrateMbps: this.forward.video.bitrateMbps,
                        durationHours: this.forward.video.durationHours,
                        overheadPercent: this.forward.overheadPercent
                    };

                    this.result = StorageCalculator.calculateForward(input);
                } catch (error) {
                    console.warn('Failed to load default result:', error);
                }
            },

            /**
             * Check if current input is valid
             */
            isInputValid() {
                switch (this.activeScenario) {
                    case 'video':
                        return this.forward.video.durationHours > 0 && this.forward.video.bitrateMbps > 0;
                    case 'photo':
                        return this.forward.photo.photoCount > 0 && this.forward.photo.fileSizeMB > 0;
                    case 'continuous':
                        return this.forward.continuous.hoursPerDay > 0 && this.forward.continuous.daysNeeded > 0 && this.forward.continuous.bitrateMbps > 0;
                    default:
                        return false;
                }
            },

            /**
             * Check if reverse input is valid
             */
            isReverseInputValid() {
                switch (this.activeScenario) {
                    case 'video':
                    case 'continuous':
                        return this.reverse.cardCapacityGB > 0 && this.reverse.video.bitrateMbps > 0;
                    case 'photo':
                        return this.reverse.cardCapacityGB > 0 && this.reverse.photo.fileSizeMB > 0;
                    default:
                        return false;
                }
            },

            /**
              * Load and display card recommendations after calculation
              * Uses CalculatorCardRecommendations for inline display
              * @private
              */
             async _loadAndDisplayCardRecommendations() {
               if (typeof CalculatorCardRecommendations === 'undefined') {
                 console.warn('[CalculatorUI] CalculatorCardRecommendations module not loaded');
                 return;
               }

               try {
                 const speedClass = this.result.speedClass;
                 
                 // Wait for DOM to be ready (recommendations div should be rendered)
                 // Use a small delay to ensure Alpine has finished rendering
                 await new Promise(resolve => setTimeout(resolve, 100));
                 
                 // Display recommendations in the results section
                 await CalculatorCardRecommendations.displayRecommendations(
                   speedClass,
                   'calculator-recommendations'
                 );

                 // Track event
                 this._trackEvent('calculator_recommendations_shown', {
                   speedClass: speedClass,
                   scenario: this.activeScenario
                 });
               } catch (error) {
                 console.error('[CalculatorUI] Failed to load card recommendations:', error);
               }
             },

            /**
             * Load all cards for selector (on component init or reverse layer load)
             */
            async initCardSelector() {
                // Skip if already loaded
                if (this.allCards && this.allCards.length > 0) {
                    console.log('[CalculatorUI] Cards already loaded, skipping reload');
                    return;
                }

                if (typeof CardSelector === 'undefined') {
                    console.error('[CalculatorUI] CardSelector module not loaded - ensure card-selector.js is included');
                    return;
                }

                try {
                    console.log('[CalculatorUI] Starting card load...');
                    const cards = await CardSelector.loadCards();

                    if (!cards || cards.length === 0) {
                        console.warn('[CalculatorUI] ⚠️ No cards returned from CardSelector.loadCards()');
                        this.allCards = [];
                        this.filteredCards = [];
                        return;
                    }

                    this.allCards = cards;
                    this.filteredCards = cards;
                    console.log(`[CalculatorUI] ✓ Successfully loaded ${this.allCards.length} cards`);
                } catch (error) {
                    console.error('[CalculatorUI] Failed to load cards for selector:', error);
                    this.allCards = [];
                    this.filteredCards = [];
                }
            },

            /**
             * Filter cards based on search input
             */
            filterCardsList() {
                if (typeof CardSelector === 'undefined') {
                    console.warn('CardSelector module not loaded');
                    return;
                }

                if (this.allCards.length === 0) {
                    console.warn('No cards loaded yet');
                    return;
                }

                this.filteredCards = CardSelector.searchCards(this.allCards, this.cardSelectorSearch);
                console.log(`Filtered to ${this.filteredCards.length} cards for search: "${this.cardSelectorSearch}"`);
            },

            /**
              * Select a card and auto-fill calculator fields
              */
            selectCard(card) {
                if (typeof CardSelector === 'undefined') {
                    console.warn('CardSelector module not loaded');
                    return;
                }

                const specs = CardSelector.getCardSpecs(card);
                this.selectedCard = specs;

                // Auto-fill card capacity (always available)
                if (specs.capacity) {
                    // Parse capacity (might be "128GB" or just "128")
                    const capacityGB = parseInt(specs.capacity.toString().replace(/[^\d]/g, ''));
                    if (!isNaN(capacityGB) && capacityGB > 0) {
                        this.reverse.cardCapacityGB = capacityGB;
                    }
                }

                // Auto-fill reverse calculator fields
                if (this.activeScenario === 'photo') {
                    // For photo, capacity is already set above
                } else {
                    // For video/continuous, set bitrate to estimated value
                    this.reverse.video.bitrateMbps = specs.estimatedBitrateMbps;
                }

                // Update search display to show selected card name
                this.cardSelectorSearch = specs.name;

                // Close dropdown after selection
                this.cardSelectorOpen = false;

                // Track event
                this._trackEvent('calculator_card_selected', {
                    cardId: specs.id,
                    speedClass: specs.speedClass,
                    scenario: this.activeScenario
                });

                console.log('✓ Card selected:', specs);
            }
        };
    }

    /**
    * Get preset data for a scenario
    * @static
    */
    static getPresets() {
        return StorageCalculator.getPresets();
    }
}

// Export for module environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CalculatorUI;
}
