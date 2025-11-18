/**
 * Reusable HTML components for consistent headers, footers, sidebars
 */

function generateGrowScript() {
    return `<!-- Hotjar -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:6576904,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>

<!-- Grow Script -->
<script data-grow-initializer="">!(function(){window.growMe||((window.growMe=function(e){window.growMe._.push(e);}),(window.growMe._=[]));var e=document.createElement("script");(e.type="text/javascript"),(e.src="https://faves.grow.me/main.js"),(e.defer=!0),e.setAttribute("data-grow-faves-site-id","U2l0ZTo3YzE2YTcwYi1mNzdjLTQ0MWQtYjJmNi05MmEzZTMzNDc2Yjk=");var t=document.getElementsByTagName("script")[0];t.parentNode.insertBefore(e,t);})();</script>`;
}

function generateHeader() {
return `<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="/img/favicon.ico">

<!-- Header -->
<header class="sticky top-0 z-50 bg-white shadow-sm header-nav-container">
<div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
<a href="/" class="flex items-center gap-3 group flex-shrink-0">
<img src="/img/brand/logo.webp" alt="SD Card Checker Logo" class="w-10 h-10 rounded-lg shadow-md group-hover:shadow-lg transition-shadow" width="40" height="40">
<span class="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">SD Card Checker</span>
</a>
    <nav class="header-nav hidden md:flex gap-8 items-center">
    <a href="/" class="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">Home</a>
    
    <div class="relative group flex items-center">
    <a href="#" class="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1 text-sm">
      Devices
      <i class="fas fa-chevron-down text-xs"></i>
      </a>
      <div class="absolute left-0 top-full pt-2 w-48 hidden group-hover:block">
      <div class="bg-white rounded-lg shadow-lg border border-slate-200">
       <a href="/categories/action-cameras/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 first:rounded-t-lg text-sm font-medium">Action Cameras</a>
       <a href="/categories/cameras/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Cameras</a>
       <a href="/categories/computing-and-tablets/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Computing & Tablets</a>
       <a href="/categories/drones/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Drones</a>
       <a href="/categories/gaming-handhelds/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Gaming Handhelds</a>
       <a href="/categories/security-cameras/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 last:rounded-b-lg text-sm font-medium">Security Cameras</a>
        </div>
       </div>
      </div>

      <div class="relative group flex items-center">
      <a href="#" class="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1 text-sm">
      Calculators
      <i class="fas fa-chevron-down text-xs"></i>
      </a>
      <div class="absolute left-0 top-full pt-2 w-56 hidden group-hover:block">
      <div class="bg-white rounded-lg shadow-lg border border-slate-200">
       <a href="/tools/calculators/video-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 first:rounded-t-lg text-sm font-medium">Video Storage & Recording Time</a>
       <a href="/tools/calculators/photo-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Photo Storage & Capacity</a>
       <a href="/tools/calculators/drone-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Drone Recording Time & Storage</a>
       <a href="/tools/calculators/security-camera-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Security Camera Recording Time</a>
       <a href="/tools/calculators/dashcam-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Dashcam Storage & Loop Time</a>
       <a href="/tools/calculators/action-camera-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Action Camera Storage & Capacity</a>
       <a href="/tools/calculators/gopro-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">GoPro Recording Time & Storage</a>
       <a href="/tools/calculators/timelapse-storage/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 last:rounded-b-lg text-sm font-medium">Timelapse Storage & Photo Count</a>
       </div>
       </div>
      </div>

      <div class="relative group flex items-center">
      <a href="#" class="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1 text-sm">
      Resources
      <i class="fas fa-chevron-down text-xs"></i>
      </a>
      <div class="absolute left-0 top-full pt-2 w-48 hidden group-hover:block">
      <div class="bg-white rounded-lg shadow-lg border border-slate-200">
       <a href="/sd-card-guide.html" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 first:rounded-t-lg text-sm font-medium">SD Card Guide</a>
       <a href="/speed-classes.html" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">Speed Classes</a>
       <a href="/faq.html" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 last:rounded-b-lg text-sm font-medium">FAQ</a>
       </div>
       </div>
      </div>

      <a href="/about.html" class="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">About</a>
    </nav>
    
    <!-- Mobile Menu Button -->
    <button class="md:hidden text-slate-600 hover:text-blue-600 mobile-menu-toggle" aria-label="Toggle menu" id="mobileMenuBtn">
      <i class="fas fa-bars text-xl"></i>
    </button>
  </div>
  
  <!-- Mobile Navigation Menu -->
  <nav class="mobile-menu hidden md:hidden bg-slate-50 border-t border-slate-200 max-h-[calc(100vh-80px)] overflow-y-auto" id="mobileMenu">
    <div class="px-4 py-3 space-y-1">
      <!-- Direct Links -->
      <a href="/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">Home</a>
      
      <!-- Devices Section -->
      <button class="mobile-section-toggle w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium" data-section="devices">
        <span>Devices</span>
        <i class="fas fa-chevron-right transition-transform duration-300"></i>
      </button>
      <div class="mobile-section hidden pl-4 space-y-1" data-content="devices">
        <a href="/categories/action-cameras/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Action Cameras</a>
        <a href="/categories/cameras/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Cameras</a>
        <a href="/categories/computing-and-tablets/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Computing & Tablets</a>
        <a href="/categories/drones/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Drones</a>
        <a href="/categories/gaming-handhelds/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Gaming Handhelds</a>
        <a href="/categories/security-cameras/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Security Cameras</a>
      </div>
      
      <!-- Calculators Section -->
      <button class="mobile-section-toggle w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium" data-section="calculators">
        <span>Calculators</span>
        <i class="fas fa-chevron-right transition-transform duration-300"></i>
      </button>
      <div class="mobile-section hidden pl-4 space-y-1" data-content="calculators">
        <a href="/tools/calculators/video-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Video Storage & Recording Time</a>
        <a href="/tools/calculators/photo-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Photo Storage & Capacity</a>
        <a href="/tools/calculators/drone-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Drone Recording Time & Storage</a>
        <a href="/tools/calculators/security-camera-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Security Camera Recording Time</a>
        <a href="/tools/calculators/dashcam-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Dashcam Storage & Loop Time</a>
        <a href="/tools/calculators/action-camera-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Action Camera Storage & Capacity</a>
        <a href="/tools/calculators/gopro-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">GoPro Recording Time & Storage</a>
        <a href="/tools/calculators/timelapse-storage/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Timelapse Storage & Photo Count</a>
      </div>
      
      <!-- Resources Section -->
      <button class="mobile-section-toggle w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium" data-section="resources">
        <span>Resources</span>
        <i class="fas fa-chevron-right transition-transform duration-300"></i>
      </button>
      <div class="mobile-section hidden pl-4 space-y-1" data-content="resources">
        <a href="/sd-card-guide.html" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">SD Card Guide</a>
        <a href="/speed-classes.html" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">Speed Classes</a>
        <a href="/faq.html" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">FAQ</a>
      </div>
      
      <!-- Direct Links -->
      <a href="/about.html" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">About</a>
    </div>
  </nav>
</header>

<script>
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
    
    // Handle section toggles
    const sectionToggles = mobileMenu.querySelectorAll('.mobile-section-toggle');
    sectionToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        const section = this.getAttribute('data-section');
        const content = mobileMenu.querySelector(`[data-content="${section}"]`);
        const icon = this.querySelector('i');
        
        if (content) {
          content.classList.toggle('hidden');
          icon.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(90deg)';
        }
      });
    });
    
    // Close menu when a link is clicked
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
      });
    });
  }
});
</script>`;
}

function generateFooter() {
    return `<!-- Footer -->
<footer class="bg-slate-900 text-slate-200 py-12 mt-20">
<div class="max-w-7xl mx-auto px-4">
<div class="grid md:grid-cols-5 gap-8 mb-8">
<div>
<h4 class="font-bold text-white mb-4">Company</h4>
<ul class="space-y-2 text-sm">
    <li><a href="/about.html" class="hover:text-white transition-colors">About Us</a></li>
    <li><a href="/contact.html" class="hover:text-white transition-colors">Contact</a></li>
</ul>
</div>

<div>
<h4 class="font-bold text-white mb-4">Legal</h4>
<ul class="space-y-2 text-sm">
<li><a href="/privacy.html" class="hover:text-white transition-colors">Privacy Policy</a></li>
<li><a href="/terms.html" class="hover:text-white transition-colors">Terms of Use</a></li>
</ul>
</div>

<div>
<h4 class="font-bold text-white mb-4">Site</h4>
<ul class="space-y-2 text-sm">
<li><a href="/sitemap.xml" class="hover:text-white transition-colors">Sitemap</a></li>
</ul>
</div>
</div>

<div class="border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
  <p>&copy; 2025 SD Card Checker. All rights reserved.</p>
</div>
</div>
</footer>`;
}

function generateAffiliateDisclosure(compact = false) {
    const baseClasses = "border-l-4 border-amber-400 rounded-r-lg";
    const sizeClasses = compact ? "p-2 mb-4 mx-0" : "p-4 mb-8 mx-4";
    const bgClass = compact ? "" : "";
    const opacity = compact ? "opacity-80" : "";
    const textSize = compact ? "text-xs" : "text-sm";

    return `<!-- Affiliate Disclosure -->
<section class="${baseClasses} ${sizeClasses} ${bgClass} ${opacity}">
   <center><p class="${textSize} text-grey-900">
     <i class="fas fa-circle-info mr-2"></i>
     <strong>Disclosure:</strong> SD Card Checker contains affiliate links. When you purchase through our links, we earn a small commission at no extra cost to you.
   </p></center>
 </section>`;
}

function generateSidebar() {
     return `<!-- Right Sidebar Navigation -->
<aside style="width: 100%; max-width: 380px; flex-shrink: 0; margin-top: 3rem; position: sticky; top: 80px; background: white; border-radius: 6px; border: 1px solid #e5e5e5; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
   <!-- Search Bar at Top -->
   <div x-data="deviceSearch()" x-init="init()" @click.outside="open = false" class="relative mb-6">
    <div class="relative">
      <i class="fas fa-search absolute left-3 top-3 text-slate-400"></i>
      <input
        type="text"
        x-model="query"
        @input="filterDevices()"
        @focus="open = true; filterDevices()"
        @keydown="handleKeydown($event)"
        placeholder="Search devices..."
        class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
    </div>
    <div class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-50" :class="{ hidden: !open || filtered.length === 0 }">
      <template x-for="(group, category) in groupedDevices()" :key="category">
        <div>
          <div class="px-4 py-2 text-xs font-bold text-slate-500 uppercase bg-slate-50" x-text="category"></div>
          <template x-for="device in groupedDevices()[category]" :key="device.id">
            <a :href="\`/devices/\${device.slug}/\`" class="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600" x-text="device.name"></a>
          </template>
        </div>
      </template>
    </div>
  </div>

  <!-- Category Links -->
  <div class="mb-6 border-t border-slate-200 pt-6">
  <h3 class="text-sm font-semibold text-slate-900 mb-3">Categories</h3>
  <ul class="space-y-2">
  <li><a href="/categories/action-cameras/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Action Cameras</a></li>
  <li><a href="/categories/cameras/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Cameras</a></li>
  <li><a href="/categories/computing-and-tablets/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Computing & Tablets</a></li>
  <li><a href="/categories/drones/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Drones</a></li>
  <li><a href="/categories/gaming-handhelds/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Gaming Handhelds</a></li>
  <li><a href="/categories/security-cameras/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Security Cameras</a></li>
     </ul>
  </div>

  <!-- Tools Links -->
  <div class="mb-6 border-t border-slate-200 pt-6">
    <h3 class="text-sm font-semibold text-slate-900 mb-3">Calculators</h3>
    <ul class="space-y-2">
      <li><a href="/tools/calculators/video-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Video Storage & Recording Time</a></li>
      <li><a href="/tools/calculators/photo-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Photo Storage & Capacity</a></li>
      <li><a href="/tools/calculators/drone-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Drone Recording Time & Storage</a></li>
      <li><a href="/tools/calculators/security-camera-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Security Camera Recording Time</a></li>
      <li><a href="/tools/calculators/dashcam-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Dashcam Storage & Loop Time</a></li>
      <li><a href="/tools/calculators/action-camera-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Action Camera Storage & Capacity</a></li>
      <li><a href="/tools/calculators/gopro-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">GoPro Recording Time & Storage</a></li>
      <li><a href="/tools/calculators/timelapse-storage/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Timelapse Storage & Photo Count</a></li>
    </ul>
  </div>

  <!-- Resource Links -->
  <div class="mb-6 border-t border-slate-200 pt-6">
    <h3 class="text-sm font-semibold text-slate-900 mb-3">Resources</h3>
    <ul class="space-y-2">
      <li><a href="/sd-card-guide.html" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">SD Card Guide</a></li>
      <li><a href="/speed-classes.html" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">Speed Classes</a></li>
      <li><a href="/faq.html" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">FAQ</a></li>
    </ul>
  </div>

  <!-- About Section -->
  <div class="mb-6 border-t border-slate-200 pt-6">
    <h3 class="text-sm font-semibold text-slate-900 mb-3">About</h3>
    <p class="text-sm italic text-slate-600 opacity-80">SD Card Checker helps you find the perfect SD card for any device with expert recommendations and detailed specs.</p>
  </div>

  <!-- Disclaimer Section -->
   <div class="border-t border-slate-200 pt-6">
     <h3 class="text-sm font-semibold text-slate-900 mb-3">Disclaimer</h3>
     <p class="text-sm italic text-slate-600 opacity-80">The content on this site is presented for informational purposes only. SD Card Checker makes no guarantees regarding the completeness or accuracy of the data and provides it on an "as-is" basis.</p>
     <p class="text-sm italic text-slate-600 opacity-80 mt-3">This website contains affiliate links. We may earn a small commission when you purchase through our links at no extra cost to you.</p>
   </div>
</aside>`;
}

module.exports = {
    generateHeader,
    generateFooter,
    generateAffiliateDisclosure,
    generateSidebar,
    generateGrowScript,
};
