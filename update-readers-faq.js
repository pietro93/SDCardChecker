/**
 * Add FAQ and device recommendations to readers
 */

const fs = require('fs');
const path = require('path');

const faqData = {
  "muddy-crv43-viewer": {
    faq: [
      {"q": "Can I use this to view photos from professional cameras?", "a": "Yes, but it's limited to SD/SDHC cards (max 64GB). Modern SDXC cards over 64GB are not supported."},
      {"q": "How long do the batteries last?", "a": "With 4x AAA alkaline batteries, you can review thousands of photos before needing a battery replacement."},
      {"q": "Is the screen bright enough for outdoor use?", "a": "The 4.3-inch LCD has decent brightness, but direct sunlight can make viewing difficult. It's best used in shade."},
      {"q": "Can I delete photos on this device?", "a": "Yes, the Muddy viewer includes file management features to delete unwanted photos and organize your cards."}
    ],
    relatedDevices: ["gopro-hero-13", "dji-mini-4-pro", "sony-a6700"]
  },
  "stealth-cam-sd-card-viewer": {
    faq: [
      {"q": "Is the touchscreen responsive in cold weather?", "a": "Touchscreen responsiveness decreases in cold weather. The zoom and navigation functions may be slower or require multiple taps."},
      {"q": "What sizes of SD cards does it support?", "a": "It supports SD and SDHC cards up to 64GB. SDXC cards (128GB+) are not compatible."},
      {"q": "Can I zoom and crop photos?", "a": "Yes, the zoom function allows you to examine details. However, cropping requires transfer to a computer."},
      {"q": "Is it waterproof?", "a": "It has a rugged rubber grip and can handle some moisture, but it's not fully waterproof. Avoid immersion in water."}
    ],
    relatedDevices: ["gopro-hero-13", "dji-mini-4-pro", "wyze-cam-v3"]
  },
  "lexar-lightning-microsd": {
    faq: [
      {"q": "Will this work with iPhone 15?", "a": "No, iPhone 15 uses USB-C. This reader is for Lightning ports (iPhone 14 and earlier, iPad Air 2-4)."},
      {"q": "How fast is the data transfer?", "a": "UHS-I supports up to 104 MB/s theoretical speed, but real-world speeds are around 60-80 MB/s depending on the card."},
      {"q": "Can I use this with iPad Pro?", "a": "Yes, if your iPad Pro has a Lightning port. iPad Pro 12.9\" (1st-5th gen) and iPad Pro 10.5\" (1st-2nd gen) are compatible."},
      {"q": "Is it MFi certified?", "a": "Yes, it's Apple MFi certified, which means guaranteed compatibility and safety certification from Apple."}
    ],
    relatedDevices: ["iphone-13", "iphone-14", "samsung-galaxy-tab-s9"]
  },
  "prograde-digital-cfexpress-sd-workflow": {
    faq: [
      {"q": "What's the transfer speed for CFexpress?", "a": "This reader achieves near-maximum CFexpress speeds (up to 1250 MB/s) when using a USB 3.2 Gen 2 port."},
      {"q": "Can I transfer two cards simultaneously?", "a": "Yes, this reader has dual slots and supports simultaneous reading from both CFexpress and SD cards at full speeds."},
      {"q": "Is it hot-swap compatible?", "a": "Yes, you can safely insert and remove cards while the reader is powered on and connected."},
      {"q": "What cameras does this work with?", "a": "It works with any camera using CFexpress Type B or SD UHS-II cards, including Canon EOS R5, Nikon Z9, and professional DSLRs."}
    ],
    relatedDevices: ["canon-eos-r5", "nikon-z9", "sony-a6700"]
  },
  "sony-mrw-g1": {
    faq: [
      {"q": "Can this read standard SD cards?", "a": "No, this reader only supports CFexpress Type B and XQD cards. It does not read standard SD cards."},
      {"q": "Why would I need XQD support?", "a": "XQD is an older professional card format used in older Nikon D5, D4, and Sony A99 cameras. This reader ensures backward compatibility with legacy gear."},
      {"q": "What's the transfer speed?", "a": "With a USB 3.2 Gen 2 port, this reader achieves 10Gbps speeds, ideal for transferring 4K RAW footage quickly."},
      {"q": "Is the cable included?", "a": "Yes, the MRW-G1 includes both USB-A and USB-C cables for maximum compatibility."}
    ],
    relatedDevices: ["sony-a1", "nikon-z9", "nikon-d850"]
  },
  "sandisk-extreme-pro-uhs2-usbc": {
    faq: [
      {"q": "What's the maximum transfer speed?", "a": "This reader supports full UHS-II speeds up to 312 MB/s when using a high-speed SD card and a USB 3.0+ port."},
      {"q": "Will this block my USB-C hub ports?", "a": "The flexible cable design allows the reader to sit at an angle, minimizing port blockage compared to other dongles."},
      {"q": "Is it compatible with iPad Pro?", "a": "Yes, it works with all USB-C iPad Pro models (3rd gen and newer) for direct photo/video import."},
      {"q": "What's the warranty?", "a": "SanDisk includes a 5-year warranty on this reader, covering manufacturing defects."}
    ],
    relatedDevices: ["macbook-pro", "ipad-air", "samsung-galaxy-tab-s9"]
  },
  "apple-usbc-sd-reader": {
    faq: [
      {"q": "Is this reader faster than third-party alternatives?", "a": "Performance is comparable to other UHS-II readers, but the build quality and guaranteed compatibility justify the premium price for Apple users."},
      {"q": "Will it work with non-Apple USB-C devices?", "a": "Yes, it works with any device with a USB-C port, including Windows PCs and Android tablets, though it's optimized for Apple."},
      {"q": "Does it require drivers?", "a": "No, it's plug-and-play with macOS, iPadOS, and newer Windows systems. No driver installation needed."},
      {"q": "Can I use this with an iPhone?", "a": "Yes, with an iPhone 15 or newer that has USB-C. iPhone 14 and earlier have Lightning ports and need a different reader."}
    ],
    relatedDevices: ["macbook-pro", "iphone-15", "ipad-air"]
  },
  "satechi-aluminum-type-c-stand": {
    faq: [
      {"q": "Is this a standalone reader or a hub?", "a": "It's a combination stand and multi-port hub. The SD/microSD reading is one of several features, along with USB ports and audio jack."},
      {"q": "Does it add Thunderbolt support to Mac Mini?", "a": "No, it adds USB 3.0 and USB-C ports, not Thunderbolt. Good for general peripherals, but not high-speed professional workflows."},
      {"q": "Can I use the stand with other devices?", "a": "The stand is designed specifically for Mac Mini's port layout. It may work with other USB-C devices but won't fit as elegantly."},
      {"q": "What's the build quality?", "a": "It's made from aluminum alloy and matches Apple's aesthetic. Build quality is excellent with good cable management."}
    ],
    relatedDevices: ["mac-mini", "mac-studio", "macbook-pro"]
  },
  "anker-powerexpand-2in1": {
    faq: [
      {"q": "How durable is the braided cable?", "a": "The braided cable is designed for durability and can withstand frequent use. We recommend coiling it loosely to avoid kinks."},
      {"q": "What's the cable length?", "a": "The cable is approximately 12 inches (30 cm), which is shorter than some alternatives. Consider a USB-C extension if you need more reach."},
      {"q": "Can I use this while charging my MacBook?", "a": "Yes, but only if your MacBook has multiple USB-C ports. Using this reader won't interfere with simultaneous charging."},
      {"q": "Is it compatible with USB 2.0?", "a": "Yes, it's backward compatible with USB 2.0, but you'll only get USB 2.0 speeds (~40 MB/s) instead of USB 3.0 speeds."}
    ],
    relatedDevices: ["macbook-air", "ipad-air", "hp-chromebook-14"]
  },
  "unitek-usbc-3slot-reader": {
    faq: [
      {"q": "Can I read all three card types at once?", "a": "Yes, this reader has three separate slots and can read SD, microSD, and CompactFlash simultaneously at full speeds."},
      {"q": "Is CompactFlash still useful?", "a": "CompactFlash is legacy technology, but this reader is one of the few modern options supporting it for photographers with older Canon 5D/7D cameras."},
      {"q": "How do I transfer files from multiple cards at once?", "a": "Most operating systems handle multiple card readers as separate drives. You can drag files from multiple cards simultaneously."},
      {"q": "Is the aluminum housing durable?", "a": "Yes, the aluminum housing provides good durability and heat dissipation. The permanently attached cable is a trade-off for durability."}
    ],
    relatedDevices: ["canon-eos-r5", "sony-a6700", "nikon-d7500"]
  },
  "transcend-rdf9-uhs2": {
    faq: [
      {"q": "Why does this use Micro-B instead of USB-C?", "a": "The Micro-B connector on the reader side is for compactness. The reader comes with both USB-A and USB-C cables for your device."},
      {"q": "How fast is UHS-II performance on this reader?", "a": "This reader achieves up to 260 MB/s with UHS-II cards, which is excellent for the price point."},
      {"q": "Does the LED indicator show transfer speed?", "a": "The LED indicates read/write activity but not speed. It's useful for knowing when to safely remove cards."},
      {"q": "Can I use this for travel?", "a": "Yes, it's portable and compact. The included dual cables (USB-A and USB-C) make it versatile for travel with both laptops and phones."}
    ],
    relatedDevices: ["macbook-pro", "canon-eos-r5", "nikon-z9"]
  },
  "kingston-workflow-station": {
    faq: [
      {"q": "Can I really transfer 4 cards at once?", "a": "Yes, the Kingston Workflow Station includes four modular reader mini-hubs that can simultaneously transfer from four cards at full UHS-II speeds."},
      {"q": "Does this require external power?", "a": "The hub functionality requires USB-C connection, but offloading can be done with or without external power. Wall power is recommended for sustained multi-card transfers."},
      {"q": "Are the mini-hubs removable?", "a": "Yes, each mini-hub is modular and can be used independently in the field or kept with the main station in the studio."},
      {"q": "Is this worth the premium price?", "a": "For professional photographers and videographers doing multi-camera shoots, the ability to offload 4 cards simultaneously saves hours of time."}
    ],
    relatedDevices: ["canon-eos-r5", "nikon-z9", "blackmagic-pocket-cinema-camera-6k-pro"]
  },
  "sony-mrw-g2": {
    faq: [
      {"q": "What's unique about CFexpress Type A?", "a": "Type A is smaller than Type B and exclusive to Sony cameras. Type A achieves faster speeds (up to 1700 MB/s) on compatible cameras."},
      {"q": "Can I use this reader with Canon or Nikon cameras?", "a": "No, Type A cards are only compatible with Sony cameras (A7S III, FX3, A1, etc.). Canon and Nikon use Type B or standard SD cards."},
      {"q": "How much faster is Type A compared to SD?", "a": "Type A can reach 800 MB/s vs SD UHS-II at 312 MB/s. For 4K 120fps RAW recording, this speed difference is critical."},
      {"q": "Is this the official Sony reader?", "a": "Yes, this is the officially recommended reader for Type A cards. It's sold by Sony and other authorized retailers."}
    ],
    relatedDevices: ["sony-a1", "sony-fx3", "sony-a7s-iii"]
  }
};

// Load the readers file
const readersPath = './data/sdCardReaders.json';
const data = JSON.parse(fs.readFileSync(readersPath, 'utf8'));

// Update each reader
data.sdCardReaders = data.sdCardReaders.map(reader => {
  if (faqData[reader.id]) {
    reader.faq = faqData[reader.id].faq;
    reader.relatedDevices = faqData[reader.id].relatedDevices;
  }
  return reader;
});

// Write back
fs.writeFileSync(readersPath, JSON.stringify(data, null, 2));
console.log('✅ Updated readers with FAQ and device recommendations');
