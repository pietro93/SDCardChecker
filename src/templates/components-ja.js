/**
 * Japanese (日本語) Reusable HTML components for consistent headers, footers, sidebars
 * Language version: Japanese (ja)
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
<a href="/ja/" class="flex items-center gap-3 group flex-shrink-0">
<img src="/img/brand/logo.webp" alt="SD Card Checker Logo" class="w-10 h-10 rounded-lg shadow-md group-hover:shadow-lg transition-shadow" width="40" height="40">
<span class="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">SD Card Checker</span>
</a>
    <nav class="header-nav hidden md:flex gap-8 items-center">
    <a href="/ja/" class="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">ホーム</a>
    
    <div class="relative group flex items-center">
    <a href="/ja/categories/" class="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1 text-sm">
      デバイス
      <i class="fas fa-chevron-down text-xs"></i>
      </a>
      <div class="absolute left-0 top-full pt-2 w-48 hidden group-hover:block z-50">
      <div class="bg-white rounded-lg shadow-lg border border-slate-200">
       <a href="/ja/categories/" class="block px-4 py-3 text-blue-600 bg-blue-50 first:rounded-t-lg text-xs font-bold border-b border-blue-200 flex items-center gap-2"><i class="fas fa-grid-2"></i> すべて</a>
       <a href="/ja/categories/cameras/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">カメラ</a>
       <a href="/ja/categories/action-cameras/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">アクションカメラ</a>
       <a href="/ja/categories/drones/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">ドローン</a>
       <a href="/ja/categories/gaming-handhelds/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">携帯ゲーム機</a>
       <a href="/ja/categories/dash-cams/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">ドライブレコーダー</a>
       <a href="/ja/categories/computing-and-tablets/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 last:rounded-b-lg text-sm font-medium">コンピュータ・タブレット</a>
        </div>
       </div>
      </div>





       <div class="relative group flex items-center">
       <a href="/ja/guides/" class="text-slate-600 hover:text-blue-600 font-medium transition-colors flex items-center gap-1 text-sm">
       ガイド
       <i class="fas fa-chevron-down text-xs"></i>
       </a>
       <div class="absolute left-0 top-full pt-2 w-56 hidden group-hover:block z-50">
       <div class="bg-white rounded-lg shadow-lg border border-slate-200">
        <a href="/ja/guides/" class="block px-4 py-3 text-blue-600 bg-blue-50 first:rounded-t-lg text-xs font-bold border-b border-blue-200 flex items-center gap-2"><i class="fas fa-book"></i> すべてのガイド</a>
        <a href="/ja/guides/sd-card-speed-classes/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">速度クラス</a>
        <a href="/ja/guides/is-my-sd-card-fake/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 text-sm font-medium">偽造SDカード見分け方</a>
        <a href="/ja/guides/nintendo-switch-sd-card-guide/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 last:rounded-b-lg text-sm font-medium">ニンテンドースイッチガイド</a>
        </div>
        </div>
       </div>

       <a href="/ja/about.html" class="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm">について</a>
    </nav>
    
    <!-- Language Switcher (Desktop) -->
    <div class="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200">
      <div class="relative group">
        <button class="text-slate-600 hover:text-blue-600 font-medium transition-colors text-sm flex items-center gap-1">
          <i class="fas fa-globe"></i>
          <span>日本語</span>
          <i class="fas fa-chevron-down text-xs"></i>
        </button>
        <div class="absolute right-0 top-full pt-2 w-40 hidden group-hover:block">
          <div class="bg-white rounded-lg shadow-lg border border-slate-200">
            <a href="/" class="block px-4 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50 first:rounded-t-lg text-sm font-medium">English</a>
            <a href="/ja/" class="block px-4 py-3 text-blue-600 bg-blue-50 last:rounded-b-lg text-sm font-medium flex items-center justify-between">
              日本語
              <i class="fas fa-check text-blue-600"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu Button -->
    <button class="md:hidden text-slate-600 hover:text-blue-600 mobile-menu-toggle flex items-center justify-center" aria-label="Toggle menu" id="mobileMenuBtn" style="width: 44px; height: 44px; padding: 0;">
      <i class="fas fa-bars text-xl" style="display: block;"></i>
    </button>
  </div>
  
  <!-- Mobile Navigation Menu -->
  <nav class="mobile-menu hidden md:hidden bg-slate-50 border-t border-slate-200 max-h-[calc(100vh-80px)] overflow-y-auto" id="mobileMenu">
    <div class="px-4 py-3 space-y-1">
      <!-- Language Switcher (Mobile) -->
      <div class="border-b border-slate-200 pb-3 mb-3">
        <p class="px-3 py-2 text-sm font-semibold text-slate-700 text-slate-600">言語を選択</p>
        <a href="/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">English</a>
        <a href="/ja/" class="block px-3 py-2 text-blue-600 bg-blue-50 rounded-lg transition-colors text-sm font-medium flex items-center justify-between">
          日本語
          <i class="fas fa-check text-blue-600"></i>
        </a>
      </div>
      
      <!-- Direct Links -->
      <a href="/ja/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">ホーム</a>
      
      <!-- Devices Section -->
      <a href="/ja/categories/" class="block px-3 py-2 text-blue-600 bg-blue-50 rounded-lg transition-colors text-sm font-medium mb-3">すべてのカテゴリ</a>
      <button class="mobile-section-toggle w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium" data-section="devices">
        <span>デバイス</span>
        <i class="fas fa-chevron-right transition-transform duration-300"></i>
      </button>
      <div class="mobile-section hidden pl-4 space-y-1" data-content="devices">
        <a href="/ja/categories/cameras/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">カメラ</a>
        <a href="/ja/categories/action-cameras/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">アクションカメラ</a>
        <a href="/ja/categories/drones/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">ドローン</a>
        <a href="/ja/categories/gaming-handhelds/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">携帯ゲーム機</a>
        <a href="/ja/categories/dash-cams/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">ドライブレコーダー</a>
        <a href="/ja/categories/computing-and-tablets/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">コンピュータ・タブレット</a>
      </div>
      


      <!-- Resources Section -->
      <a href="/ja/guides/" class="block px-3 py-2 text-blue-600 bg-blue-50 rounded-lg transition-colors text-sm font-medium mb-3">すべてのガイド</a>
      <button class="mobile-section-toggle w-full flex items-center justify-between px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium" data-section="resources">
        <span>ガイド</span>
        <i class="fas fa-chevron-right transition-transform duration-300"></i>
      </button>
      <div class="mobile-section hidden pl-4 space-y-1" data-content="resources">
        <a href="/ja/guides/sd-card-speed-classes/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">速度クラス</a>
        <a href="/ja/guides/is-my-sd-card-fake/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">偽造SDカード見分け方</a>
        <a href="/ja/guides/nintendo-switch-sd-card-guide/" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm">ニンテンドースイッチガイド</a>
      </div>
      
      <!-- Direct Links -->
      <a href="/ja/about.html" class="block px-3 py-2 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium">について</a>
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
        const content = mobileMenu.querySelector('[data-content="' + section + '"]');
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
<h4 class="font-bold text-white mb-4">会社</h4>
<ul class="space-y-2 text-sm">
    <li><a href="/ja/about.html" class="hover:text-white transition-colors">当社について</a></li>
</ul>
</div>

<div>
<h4 class="font-bold text-white mb-4">法律</h4>
<ul class="space-y-2 text-sm">
<li><a href="/ja/privacy.html" class="hover:text-white transition-colors">プライバシーポリシー</a></li>
<li><a href="/ja/terms.html" class="hover:text-white transition-colors">利用規約</a></li>
</ul>
</div>

<div>
<h4 class="font-bold text-white mb-4">サイト</h4>
<ul class="space-y-2 text-sm">
<li><a href="/ja/sitemap.xml" class="hover:text-white transition-colors">サイトマップ</a></li>
</ul>
</div>

<div>
<h4 class="font-bold text-white mb-4">その他</h4>
<ul class="space-y-2 text-sm">
<li><a href="/" class="hover:text-white transition-colors">English Version</a></li>
<li><span class="text-slate-400 text-xs">リーダー未提供</span></li>
</ul>
</div>
</div>

<div class="border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
  <p>&copy; 2025 SD Card Checker. All rights reserved.</p>
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
     <strong>開示:</strong> SD Card Checkerはアフィリエイトリンクを含んでいます。当サイトのリンクから購入した場合、追加費用なしで少額の手数料を獲得します。
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
         placeholder="デバイスを検索..."
         class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
         data-hj-allow
       >
    </div>
    <div class="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-300 rounded-lg shadow-lg z-50" :class="{ hidden: !open || filtered.length === 0 }">
      <template x-for="(group, category) in groupedDevices()" :key="category">
        <div>
          <div class="px-4 py-2 text-xs font-bold text-slate-500 uppercase bg-slate-50" x-text="category"></div>
          <template x-for="device in groupedDevices()[category]" :key="device.id">
            <a :href="\`/ja/devices/\${device.slug}/\`" class="block px-4 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600" x-text="device.name"></a>
          </template>
        </div>
      </template>
    </div>
  </div>

  <!-- Category Links -->
  <div class="mb-6 border-t border-slate-200 pt-6">
  <h3 class="text-sm font-semibold text-slate-900 mb-3">カテゴリ</h3>
  <ul class="space-y-2">
  <li><a href="/ja/categories/action-cameras/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">アクションカメラ</a></li>
  <li><a href="/ja/categories/cameras/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">カメラ</a></li>
  <li><a href="/ja/categories/computing-and-tablets/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">コンピュータ・タブレット</a></li>
  <li><a href="/ja/categories/drones/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">ドローン</a></li>
  <li><a href="/ja/categories/gaming-handhelds/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">携帯ゲーム機</a></li>
  <li><a href="/ja/categories/dash-cams/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">ドライブレコーダー</a></li>
  <li x-data="{ open: false }">
    <button @click="open = !open" class="w-full text-left text-sm text-slate-600 hover:text-blue-600 transition-colors flex items-center justify-between">
      もっと見る
      <i :class="open ? 'fas fa-chevron-up' : 'fas fa-chevron-down'" class="text-xs"></i>
    </button>
    <ul x-show="open" class="mt-2 ml-3 space-y-2 border-l border-slate-200 pl-3">
      <li><a href="/ja/categories/security-cameras/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">セキュリティカメラ</a></li>
    </ul>
  </li>
     </ul>
  </div>



  <!-- Guide Links -->
  <div class="mb-6 border-t border-slate-200 pt-6">
    <h3 class="text-sm font-semibold text-slate-900 mb-3">ガイド</h3>
    <ul class="space-y-2">
      <li><a href="/ja/guides/sd-card-speed-classes/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">速度クラス</a></li>
      <li><a href="/ja/guides/is-my-sd-card-fake/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">偽造SDカード見分け方</a></li>
      <li><a href="/ja/guides/nintendo-switch-sd-card-guide/" class="text-sm text-slate-600 hover:text-blue-600 transition-colors">ニンテンドースイッチガイド</a></li>
    </ul>
  </div>

  <!-- About Section -->
  <div class="mb-6 border-t border-slate-200 pt-6">
    <h3 class="text-sm font-semibold text-slate-900 mb-3">について</h3>
    <p class="text-sm italic text-slate-600 opacity-80">SD Card Checkerは、あらゆるデバイスに最適なSDカードを見つけるのに役立ちます。専門家による推奨事項と詳細な仕様があります。</p>
  </div>

  <!-- Disclaimer Section -->
   <div class="border-t border-slate-200 pt-6">
     <h3 class="text-sm font-semibold text-slate-900 mb-3">免責事項</h3>
     <p class="text-sm italic text-slate-600 opacity-80">本サイトのコンテンツは情報提供のみを目的としています。SD Card Checkerは、データの完全性または正確性について保証せず、「現状のまま」提供します。</p>
     <p class="text-sm italic text-slate-600 opacity-80 mt-3">このウェブサイトはアフィリエイトリンクを含んでいます。当社のリンクから購入した場合、追加費用なしで少額の手数料を獲得する場合があります。</p>
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
