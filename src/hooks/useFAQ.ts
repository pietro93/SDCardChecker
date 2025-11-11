import { useMemo } from 'react';
import { Device } from '../types/devices';
import { mergeFAQs, GeneratedFAQ } from '../utils/faqGenerator';

/**
 * Hook to get complete FAQs for a device
 * Merges device-specific FAQs from the dataset with computationally generated FAQs
 */
export function useFAQ(device: Device | null): GeneratedFAQ[] {
  return useMemo(() => {
    if (!device) return [];
    
    // Device-specific FAQs from the dataset
    const deviceSpecificFAQs = device.faq || [];
    
    // Merge with generated FAQs
    return mergeFAQs(device, deviceSpecificFAQs);
  }, [device]);
}
