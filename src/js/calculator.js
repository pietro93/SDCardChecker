/**
 * Storage Calculator Core Engine
 * Reusable math module for all calculator scenarios
 * Version 2.0 - Phase 0 & 1 Support
 */

class StorageCalculator {
  /**
   * Speed Class mapping: bitrate (Mbps) → speed class + write speed
   */
  static SPEED_CLASS_MAP = {
    6: { class: 'V6', writeSpeed: 6, use: 'Full HD, time-lapse' },
    30: { class: 'V30', writeSpeed: 30, use: '4K, high-bitrate video' },
    60: { class: 'V60', writeSpeed: 60, use: '4K 60fps, professional' },
    90: { class: 'V90', writeSpeed: 90, use: '8K, RAW video, streaming' }
  };

  /**
   * Calculate video storage requirement
   * @param {number} bitrateMbps - Bitrate in Mbps
   * @param {number} durationHours - Recording duration in hours
   * @param {number} overheadPercent - Overhead percentage (default 10)
   * @returns {Object} { rawGB, totalGB, speedClass, minWriteSpeed }
   */
  static calculateVideoStorage(bitrateMbps, durationHours, overheadPercent = 10) {
    const durationSeconds = durationHours * 3600;
    const megabitsTotal = bitrateMbps * durationSeconds;
    const bytesTotal = megabitsTotal * 125000; // 1 Mbps = 125,000 bytes/sec
    const rawGB = bytesTotal / (1024 ** 3);

    const overheadMultiplier = 1 + overheadPercent / 100;
    const totalGB = rawGB * overheadMultiplier;

    return {
      rawGB: this._round(rawGB, 2),
      overheadGB: this._round(totalGB - rawGB, 2),
      totalGB: this._round(totalGB, 2),
      speedClass: this._getSpeedClass(bitrateMbps),
      minWriteSpeed: this._getMinWriteSpeed(bitrateMbps)
    };
  }

  /**
   * Calculate photo storage requirement
   * @param {number} photoCount - Total number of photos
   * @param {number} fileSizeMB - File size per photo in MB
   * @param {number} overheadPercent - Overhead percentage (default 10)
   * @returns {Object} { rawGB, totalGB }
   */
  static calculatePhotoStorage(photoCount, fileSizeMB, overheadPercent = 10) {
    const totalMB = photoCount * fileSizeMB;
    const rawGB = totalMB / 1024;

    const overheadMultiplier = 1 + overheadPercent / 100;
    const totalGB = rawGB * overheadMultiplier;

    // Determine speed class based on burst shooting scenario
    const isHighBurst = photoCount > 500 && fileSizeMB > 20;
    const speedClass = isHighBurst ? 'V60' : 'V30';

    return {
      totalPhotos: photoCount,
      fileSizePerPhotoMB: fileSizeMB,
      rawGB: this._round(rawGB, 2),
      overheadGB: this._round(totalGB - rawGB, 2),
      totalGB: this._round(totalGB, 2),
      speedClass: speedClass,
      minWriteSpeed: speedClass === 'V60' ? 60 : 30
    };
  }

  /**
   * Calculate continuous recording storage (24/7, surveillance, dashcam)
   * @param {number} bitrateMbps - Bitrate in Mbps
   * @param {number} hoursPerDay - Hours of recording per day
   * @param {number} daysNeeded - Number of days needed
   * @param {number} overheadPercent - Overhead percentage (default 10)
   * @returns {Object} { rawGB, totalGB, speedClass, minWriteSpeed }
   */
  static calculateContinuousStorage(bitrateMbps, hoursPerDay, daysNeeded, overheadPercent = 10) {
    const totalHours = hoursPerDay * daysNeeded;
    return this.calculateVideoStorage(bitrateMbps, totalHours, overheadPercent);
  }

  /**
   * Reverse calculation: given card capacity, how long can you record?
   * @param {number} cardCapacityGB - Card capacity in GB
   * @param {number} bitrateMbps - Bitrate in Mbps
   * @param {number} overheadPercent - Overhead percentage (default 10)
   * @returns {Object} { recordingHours, recordingMinutes, recordingTimeString, daysFor24h }
   */
  static calculateRecordingDuration(cardCapacityGB, bitrateMbps, overheadPercent = 10) {
    // Account for overhead: available space = capacity × (1 - overhead%)
    const usableGB = cardCapacityGB * (1 - overheadPercent / 100);

    // Convert GB to Mbps-seconds
    // 1 GB = 1024^3 bytes = 1024^3 * 8 bits
    const totalBits = usableGB * 1024 * 1024 * 1024 * 8;
    const totalSeconds = totalBits / (bitrateMbps * 1_000_000);
    const totalHours = totalSeconds / 3600;
    const totalMinutes = totalSeconds / 60;

    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);

    const daysFor24h = this._round(totalHours / 24, 2);

    return {
      recordingSeconds: Math.floor(totalSeconds),
      recordingMinutes: Math.floor(totalMinutes),
      recordingHours: this._round(totalHours, 2),
      recordingTimeString: `${hours}h ${minutes}m`,
      daysFor24h: daysFor24h,
      speedClass: this._getSpeedClass(bitrateMbps),
      minWriteSpeed: this._getMinWriteSpeed(bitrateMbps)
    };
  }

  /**
   * Reverse calculation for photos: given capacity, how many photos can you shoot?
   * @param {number} cardCapacityGB - Card capacity in GB
   * @param {number} fileSizeMB - File size per photo in MB
   * @param {number} overheadPercent - Overhead percentage (default 10)
   * @returns {Object} { photoCount, usableGB, speedClass, minWriteSpeed }
   */
  static calculatePhotoCount(cardCapacityGB, fileSizeMB, overheadPercent = 10) {
    const usableGB = cardCapacityGB * (1 - overheadPercent / 100);
    const usableMB = usableGB * 1024;
    const photoCount = Math.floor(usableMB / fileSizeMB);

    // Determine speed class based on file size (larger files need faster cards)
    const isHighBurst = fileSizeMB > 20;
    const speedClass = isHighBurst ? 'V60' : 'V30';

    return {
      photoCount: photoCount,
      usableGB: this._round(usableGB, 2),
      fileSizePerPhotoMB: fileSizeMB,
      speedClass: speedClass,
      minWriteSpeed: speedClass === 'V60' ? 60 : 30
    };
  }

  /**
   * Get recommended card capacity (round up to standard sizes)
   * @param {number} requiredGB - Calculated storage needed in GB
   * @returns {number} Recommended capacity from standard sizes
   */
  static getRecommendedCapacity(requiredGB) {
    const standardCapacities = [32, 64, 128, 256, 512, 1024];
    return standardCapacities.find(cap => cap >= requiredGB) || 1024;
  }

  /**
   * Determine if card is sufficient
   * @param {number} cardCapacityGB - Card capacity in GB
   * @param {number} requiredGB - Required storage in GB
   * @returns {boolean}
   */
  static isCardSufficient(cardCapacityGB, requiredGB) {
    return cardCapacityGB >= requiredGB;
  }

  /**
   * Get speed class based on bitrate
   * @private
   * @param {number} bitrateMbps
   * @returns {string} Speed class (V6, V30, V60, V90)
   */
  static _getSpeedClass(bitrateMbps) {
    if (bitrateMbps <= 6) return 'V6';
    if (bitrateMbps <= 90) return 'V30';
    if (bitrateMbps <= 200) return 'V60';
    return 'V90';
  }

  /**
   * Get minimum write speed in MB/s
   * @private
   * @param {number} bitrateMbps
   * @returns {number} Write speed in MB/s
   */
  static _getMinWriteSpeed(bitrateMbps) {
    const speedClass = this._getSpeedClass(bitrateMbps);
    const mapping = {
      'V6': 6,
      'V30': 30,
      'V60': 60,
      'V90': 90
    };
    return mapping[speedClass];
  }

  /**
   * Helper: round to N decimal places
   * @private
   */
  static _round(num, decimals = 2) {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  /**
   * Build complete result for forward calculation
   * @param {Object} input
   * @returns {Object} Complete calculation result
   */
  static calculateForward(input) {
    const { scenario, bitrateMbps, durationHours, photoCount, fileSizeMB, hoursPerDay, daysNeeded, overheadPercent = 10 } = input;

    let calc;

    switch (scenario) {
      case 'video':
        calc = this.calculateVideoStorage(bitrateMbps, durationHours, overheadPercent);
        break;
      case 'photo':
        calc = this.calculatePhotoStorage(photoCount, fileSizeMB, overheadPercent);
        break;
      case 'continuous':
        calc = this.calculateContinuousStorage(bitrateMbps, hoursPerDay, daysNeeded, overheadPercent);
        break;
      default:
        throw new Error(`Unknown scenario: ${scenario}`);
    }

    const recommendedCapacity = this.getRecommendedCapacity(calc.totalGB);

    return {
      scenario,
      ...calc,
      recommendedCapacity,
      speedClassTable: this._buildSpeedClassTable()
    };
  }

  /**
   * Build complete result for reverse calculation
   * @param {Object} input
   * @returns {Object} Complete calculation result
   */
  static calculateReverse(input) {
    const { scenario, cardCapacityGB, bitrateMbps, fileSizeMB, overheadPercent = 10 } = input;

    let calc;

    switch (scenario) {
      case 'video':
      case 'continuous':
        calc = this.calculateRecordingDuration(cardCapacityGB, bitrateMbps, overheadPercent);
        break;
      case 'photo':
        calc = this.calculatePhotoCount(cardCapacityGB, fileSizeMB, overheadPercent);
        break;
      default:
        throw new Error(`Unknown scenario: ${scenario}`);
    }

    return {
      scenario,
      cardCapacityGB,
      ...calc,
      speedClassTable: this._buildSpeedClassTable()
    };
  }

  /**
   * Build speed class reference table
   * @private
   * @returns {Array}
   */
  static _buildSpeedClassTable() {
    return [
      { bitrateMbps: '≤ 6', speedClass: 'V6', writeSpeed: '6MB/s', useCase: 'Full HD, time-lapse' },
      { bitrateMbps: '6–90', speedClass: 'V30', writeSpeed: '30MB/s', useCase: '4K, high-bitrate video' },
      { bitrateMbps: '90–200', speedClass: 'V60', writeSpeed: '60MB/s', useCase: '4K 60fps, professional' },
      { bitrateMbps: '200+', speedClass: 'V90', writeSpeed: '90MB/s', useCase: '8K, RAW video, streaming' }
    ];
  }

  /**
   * Get all preset scenarios with defaults
   * @returns {Object}
   */
  static getPresets() {
    return {
      video: {
        name: 'Video Recording',
        defaults: {
          resolution: '4K',
          fps: 60,
          codec: 'H.264',
          bitrateMbps: 150,
          durationHours: 2
        }
      },
      photo: {
        name: 'Photo Burst/Timelapse',
        defaults: {
          fileSizeMB: 2.5, // 5MP JPEG
          photoCount: 1000,
          burstFps: 10
        }
      },
      continuous: {
        name: 'Continuous Recording',
        defaults: {
          bitrateMbps: 5, // 1080p
          hoursPerDay: 24,
          daysNeeded: 7
        }
      }
    };
  }
}

// Export for Node.js/module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageCalculator;
}
