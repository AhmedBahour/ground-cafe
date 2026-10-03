/**
 * GROUND CAFE | جراوند كافيه
 * "SENS YOUR ROOTS" • "كلّ رشفة ترجّعك لجذورك"
 * Ultra-Premium 10/10 Interactive Experience Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. GLOBAL STATE
  const state = {
    activeBranch: 'park-avenue',
    activeCategory: 'all',
    searchQuery: '',
    audioPlaying: false,
    audioContext: null,
    audioGain: null,
    cart: JSON.parse(localStorage.getItem('ground_cart') || '[]'),
    activeTimelineStep: 1
  };

  const menuData = window.GROUND_MENU_DATA;
  if (!menuData) {
    console.error('GROUND CAFE: Menu data not loaded');
    return;
  }

  // 2. DOM ELEMENTS
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const branchTabBtns = document.querySelectorAll('.branch-tab-btn');
  const categoryPillsContainer = document.getElementById('categoryPills');
  const menuSearchInput = document.getElementById('menuSearchInput');
  const menuProductsGrid = document.getElementById('menuProductsGrid');
  const branchInfoBanner = document.getElementById('branchInfoBanner');
  const itemModal = document.getElementById('itemModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const audioToggle = document.getElementById('audioToggle');
  const toastMsg = document.getElementById('toastMsg');
  const mapPins = document.querySelectorAll('.map-pin');
  
  // Cart DOM elements
  const cartBadgeCount = document.querySelectorAll('.cart-badge-count');
  const cartFloatingBadge = document.getElementById('cartFloatingBadge');
  const cartFloatingCount = document.getElementById('cartFloatingCount');
  const cartFloatingTotal = document.getElementById('cartFloatingTotal');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const cartDrawerClose = document.getElementById('cartDrawerClose');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartTotalAmount = document.getElementById('cartTotalAmount');
  const cartBranchSelect = document.getElementById('cartBranchSelect');
  const cartOrderTypeSelect = document.getElementById('cartOrderTypeSelect');
  const sendWhatsAppOrderBtn = document.getElementById('sendWhatsAppOrderBtn');
  const cartToggleBtns = document.querySelectorAll('.cart-toggle-btn');

  // 3. BRAND INTRO PRELOADER
  const preloader = document.getElementById('brandPreloader');
  const preloaderBar = document.getElementById('preloaderBar');

  if (preloader) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 15;
      if (progress > 100) progress = 100;
      if (preloaderBar) preloaderBar.style.width = `${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add('is-hidden');
          document.body.style.overflow = '';
        }, 300);
      }
    }, 60);
  }

  // 4. TOAST NOTIFICATION UTILITY
  const showToast = (message) => {
    if (!toastMsg) return;
    toastMsg.textContent = message;
    toastMsg.classList.add('is-active');
    setTimeout(() => {
      toastMsg.classList.remove('is-active');
    }, 3200);
  };
  window.showGroundToast = showToast;

  // 5. COPY ADDRESS HELPER
  window.copyAddress = (text, branchName) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(`تم نسخ عنوان ${branchName} بنجاح! 📍`);
      });
    } else {
      showToast(`العنوان: ${text}`);
    }
  };

  // 6. LIVE RIYADH CLOCK & OPERATIONAL RADAR
  const updateRiyadhTime = () => {
    const liveClockEl = document.getElementById('liveRiyadhClock');
    const liveStatusTextEl = document.getElementById('liveStatusText');
    if (!liveClockEl) return;

    try {
      const now = new Date();
      // Riyadh timezone UTC+3
      const options = { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: true };
      const formatter = new Intl.DateTimeFormat('ar-SA', options);
      const timeString = formatter.format(now);
      liveClockEl.textContent = `الرياض: ${timeString}`;

      // 24h hour check
      const riyadhHour = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Riyadh', hour: 'numeric', hour12: false }).format(now), 10);
      // Open 6:00 AM (6) to 1:00 AM next day (0 or 24)
      const isOpen = riyadhHour >= 6 || riyadhHour < 1;

      if (liveStatusTextEl) {
        if (isOpen) {
          liveStatusTextEl.textContent = 'مفتوح الآن • يغلق 1:00 ص';
          liveStatusTextEl.style.color = '#2ECC71';
        } else {
          liveStatusTextEl.textContent = 'يفتح في تمام 6:00 ص';
          liveStatusTextEl.style.color = '#F39C12';
        }
      }
    } catch (e) {
      console.log('Clock sync error:', e);
    }
  };

  setInterval(updateRiyadhTime, 30000);
  updateRiyadhTime();

  // 7. AMBIENT STEAM PARTICLE CANVAS (60FPS Silky Physics)
  const initSteamCanvas = () => {
    const canvas = document.getElementById('steamCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    const particles = [];
    const particleCount = 28;

    class SteamParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = width * 0.5 + (Math.random() - 0.5) * (width * 0.4);
        this.y = height + Math.random() * 40;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = -(Math.random() * 0.8 + 0.5);
        this.radius = Math.random() * 25 + 15;
        this.maxRadius = this.radius * (Math.random() * 2 + 1.8);
        this.alpha = Math.random() * 0.12 + 0.04;
        this.maxAlpha = this.alpha;
        this.growth = Math.random() * 0.12 + 0.08;
      }

      update() {
        this.x += this.vx + Math.sin(this.y * 0.015) * 0.3;
        this.y += this.vy;
        this.radius += this.growth;
        this.alpha -= 0.0007;

        if (this.alpha <= 0 || this.y < height * 0.2) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        gradient.addColorStop(0, `rgba(216, 180, 133, ${this.alpha})`);
        gradient.addColorStop(1, 'rgba(216, 180, 133, 0)');
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      const p = new SteamParticle();
      p.y = Math.random() * height; // initial distribution
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(animate);
    };

    animate();
  };

  initSteamCanvas();

  // 8. TASTE & MOOD MATCHER WIDGET
  const moodPillBtns = document.querySelectorAll('.mood-pill-btn');
  const matcherResultContainer = document.getElementById('matcherResult');

  const moodRecommendations = {
    focus: {
      id: "v60-hot",
      title: "V60 مقطرة (محصول إثيوبي)",
      tag: "التركيز وصفاء الذهن",
      desc: "نقاء عطري ونوتات زهور وفاكهة مجففة بقوام متزن يمنحك أعلى درجات التركيز والإلهام.",
      price: "21 ر.س",
      image: "assets/images/prod-v60.webp"
    },
    energy: {
      id: "cortado",
      title: "كورتادو جراوند المركز",
      tag: "طاقة وانطلاقة يوم قوية",
      desc: "دبل شوت اسبريسو مكثف مع رشفة حليب حريري تمنحك شحنة طاقة استثنائية دون إثقال.",
      price: "14 ر.س",
      image: "assets/images/prod-cortado.webp"
    },
    refresh: {
      id: "mojito-ground",
      title: "موهيتو جراوند المنعش",
      tag: "انتعاش يروي الصيف",
      desc: "توقيع جراوند المميز بحمضيات منعشة ونعناع بارد يغير مزاجك ويجدد حيويتك فوراً.",
      price: "26 ر.س",
      image: "assets/images/prod-mojito.webp"
    },
    sweet: {
      id: "mango-truffle",
      title: "ترافل مانجو مع فلات وايت",
      tag: "حلى وتدليل الحواس",
      desc: "طبقات موس المانجو الاستوائي الطازج مع ترافل الشوكولاتة، يتناغم بروعة مع أي مشروب ساخن.",
      price: "40 ر.س",
      image: "assets/images/prod-cake.webp"
    }
  };

  moodPillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mood = btn.dataset.mood;
      moodPillBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const rec = moodRecommendations[mood];
      if (rec && matcherResultContainer) {
        matcherResultContainer.style.opacity = '0';
        matcherResultContainer.style.transform = 'translateY(10px)';

        setTimeout(() => {
          matcherResultContainer.innerHTML = `
            <img src="${rec.image}" alt="${rec.title}" class="matcher-result-img" loading="lazy">
            <div class="matcher-result-info">
              <div class="matcher-result-tag">${rec.tag}</div>
              <h4 class="matcher-result-title">${rec.title}</h4>
              <p class="matcher-result-desc">${rec.desc}</p>
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 14px;">
                <div style="font-size: 1.3rem; font-weight: 700; color: var(--color-espresso);">${rec.price}</div>
                <button class="btn btn-primary" style="padding: 8px 20px; font-size: 0.88rem;" onclick="window.addToCart('${rec.id}')">
                  <span>+ أضف للطلب السريع</span>
                </button>
              </div>
            </div>
          `;
          matcherResultContainer.style.opacity = '1';
          matcherResultContainer.style.transform = 'translateY(0)';
        }, 180);
      }
    });
  });

  // 9. ROOTS JOURNEY TIMELINE CONTROLLER
  const timelineTabs = document.querySelectorAll('.timeline-tab-btn');
  const timelineData = {
    1: {
      title: "المزرعة ومسار الحبة النقي",
      desc: "نختار محاصيلنا المختصة من مزارع جبلية شاهقة ترتفع أكثر من 2000 متر فوق سطح البحر، حيث التربة البركانية والظلال الطبيعية التي تمنح حبوب البن تركيزاً استثنائياً للسكريات المعقدة والأحماض العطرية.",
      specs: [
        { label: "الارتفاع", val: "2,000+ متر" },
        { label: "المعالجة", val: "مجففة ومغسولة نقية" },
        { label: "السلالة", val: "أرابيكا 100% مختصة" },
        { label: "الجودة", val: "درجة 87+ SCA" }
      ],
      image: "assets/images/ground-story.webp"
    },
    2: {
      title: "التحميص الحرفي وبروفايل النكهة",
      desc: "التحميص في جراوند فن يعتمد على منحنيات حرارية دقيقة تُطبخ بحساب الثواني. لا نبالغ في الحرق لنحافظ على شخصية الحبة الأصلية وإيحاءات الزهور والكراميل والفواكه الناضجة.",
      specs: [
        { label: "درجة التحميص", val: "متوسط خفيف (Omni)" },
        { label: "التحكم الحراري", val: "مجسات رقمية دقيقة" },
        { label: "الراحة بعد الحمص", val: "14 يوماً للنضوج" },
        { label: "النتيجة", val: "وضوح عطري تام" }
      ],
      image: "assets/images/ground-roots.webp"
    },
    3: {
      title: "هندسة الاستخلاص والموازين",
      desc: "فنجان القهوة معادلة كيميائية تتكامل فيها حرارة الماء (93°C)، ودرجة طحن ميكرومترية، وضغط استخلاص مدروس يضمن تدفق الزيوت العطرية النقية دون أدنى مرارة مزعجة.",
      specs: [
        { label: "حرارة الماء", val: "92°C - 94°C" },
        { label: "نسبة الاستخلاص", val: "1:16 بمعيار ذهبي" },
        { label: "الضغط", val: "9 بار مستقر" },
        { label: "الزمن", val: "28 - 32 ثانية" }
      ],
      image: "assets/images/prod-v60.webp"
    },
    4: {
      title: "الفنجان والمذاق: ارجع لأصلك",
      desc: "اللحظة التي يلتقي فيها الشغف بحواسك. فنجان قهوة متزن يحمل روح الرياض الدافئة وأصالة الجذور، صُنع ليمنحك وقفة استرخاء وصفاء في كل رشفة.",
      specs: [
        { label: "القوام", val: "مخملي متوازن" },
        { label: "النوتات", val: "فاكهية، زهرية، شوكولاتية" },
        { label: "الأجواء", val: "هدوء وتفاصيل ملهمة" },
        { label: "التجربة", val: "SENS YOUR ROOTS" }
      ],
      image: "assets/images/ground-experience.webp"
    }
  };

  timelineTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const step = parseInt(tab.dataset.step, 10);
      state.activeTimelineStep = step;

      timelineTabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');

      const data = timelineData[step];
      const card = document.getElementById('timelineCard');
      if (data && card) {
        card.style.opacity = '0';
        setTimeout(() => {
          card.innerHTML = `
            <div class="timeline-info-part">
              <h3>${data.title}</h3>
              <p>${data.desc}</p>
              <div class="timeline-specs-grid">
                ${data.specs.map(s => `
                  <div class="timeline-spec-item">
                    <span class="spec-label">${s.label}</span>
                    <span class="spec-val">${s.val}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            <div class="timeline-media-part">
              <img src="${data.image}" alt="${data.title}" loading="lazy">
            </div>
          `;
          card.style.opacity = '1';
        }, 150);
      }
    });
  });

  // 10. WHATSAPP CART ENGINE
  const updateCartUI = () => {
    const totalCount = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Save
    localStorage.setItem('ground_cart', JSON.stringify(state.cart));

    // Update Badges
    cartBadgeCount.forEach(el => {
      el.textContent = totalCount;
      el.style.display = totalCount > 0 ? 'flex' : 'none';
    });

    if (cartFloatingBadge) {
      if (totalCount > 0) {
        cartFloatingBadge.style.display = 'flex';
        if (cartFloatingCount) cartFloatingCount.textContent = `${totalCount} عناصر`;
        if (cartFloatingTotal) cartFloatingTotal.textContent = `${totalPrice} ر.س`;
      } else {
        cartFloatingBadge.style.display = 'none';
      }
    }

    if (cartTotalAmount) cartTotalAmount.textContent = `${totalPrice} ر.س`;

    // Render Drawer items
    if (cartItemsList) {
      if (state.cart.length === 0) {
        cartItemsList.innerHTML = `
          <div style="text-align: center; padding: 40px 10px; color: var(--color-text-muted);">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 12px; color: var(--color-accent-sand);">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <p style="font-weight: 600; color: var(--color-espresso); margin-bottom: 4px;">سلتك فارغة حالياً</p>
            <p style="font-size: 0.85rem;">تصفح المنيو وأضف مشروباتك المفضلة للطلب السريع.</p>
          </div>
        `;
      } else {
        cartItemsList.innerHTML = state.cart.map(item => `
          <div class="cart-item-row">
            <div>
              <div class="cart-item-title">${item.name_ar}</div>
              <div class="cart-item-price">${item.price} ر.س × ${item.qty} = ${item.price * item.qty} ر.س</div>
            </div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="window.changeCartQty('${item.id}', -1)">-</button>
              <span style="font-weight: 700; min-width: 18px; text-align: center;">${item.qty}</span>
              <button class="qty-btn" onclick="window.changeCartQty('${item.id}', 1)">+</button>
            </div>
          </div>
        `).join('');
      }
    }
  };

  window.addToCart = (productId) => {
    const product = menuData.products.find(p => p.id === productId);
    if (!product) return;

    const existing = state.cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({
        id: product.id,
        name_ar: product.name_ar,
        name_en: product.name_en,
        price: product.price,
        qty: 1
      });
    }

    updateCartUI();
    showToast(`تمت إضافة "${product.name_ar}" إلى الطلب ☕`);
  };

  window.changeCartQty = (productId, delta) => {
    const item = state.cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      state.cart = state.cart.filter(i => i.id !== productId);
    }

    updateCartUI();
  };

  const openCartDrawer = () => {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeCartDrawer = () => {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  cartToggleBtns.forEach(btn => btn.addEventListener('click', openCartDrawer));
  if (cartFloatingBadge) cartFloatingBadge.addEventListener('click', openCartDrawer);
  if (cartDrawerClose) cartDrawerClose.addEventListener('click', closeCartDrawer);
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', (e) => {
      if (e.target === cartDrawerOverlay) closeCartDrawer();
    });
  }

  // Send Order via WhatsApp
  if (sendWhatsAppOrderBtn) {
    sendWhatsAppOrderBtn.addEventListener('click', () => {
      if (state.cart.length === 0) {
        showToast('الرجاء إضافة عناصر إلى السلة أولاً.');
        return;
      }

      const branchName = cartBranchSelect?.value || 'فرع بارك أفينيو';
      const orderType = cartOrderTypeSelect?.value || 'استلام من الفرع';
      const totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

      let msg = `*مرحباً جراوند كافيه | طلب جديد*%0A`;
      msg += `📍 *الفرع:* ${branchName}%0A`;
      msg += `🚗 *نوع الطلب:* ${orderType}%0A`;
      msg += `─────────────────%0A`;
      state.cart.forEach(item => {
        msg += `• ${item.qty}x ${item.name_ar} (${item.price * item.qty} ر.س)%0A`;
      });
      msg += `─────────────────%0A`;
      msg += `💰 *المجموع:* ${totalPrice} ر.س%0A`;
      msg += `%0Aيرجى تأكيد استلام الطلب وتجهيزه. شكراً لكم! ✨`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=966551029033&text=${msg}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  updateCartUI();

  // 11. NAVBAR SCROLL EFFECT
  const handleScroll = () => {
    if (window.scrollY > 40) {
      header?.classList.add('is-scrolled');
    } else {
      header?.classList.remove('is-scrolled');
    }

    // Scrollspy
    const sections = document.querySelectorAll('section[id]');
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 12. MOBILE DRAWER TOGGLE
  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        menuToggle.classList.remove('is-active');
        document.body.style.overflow = '';
      });
    });
  }

  // 13. MENU RENDERING & FILTERING
  const updateBranchBanner = () => {
    const branch = menuData.branches[state.activeBranch];
    if (!branch || !branchInfoBanner) return;

    branchInfoBanner.innerHTML = `
      <div class="branch-info-text">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span><strong>${branch.name_ar}</strong> — ${branch.address_ar}</span>
      </div>
      <a href="${branch.menu_url}" target="_blank" rel="noopener noreferrer" class="branch-ext-link">
        عرض المنيو الرقمي الرسمي للفرع ↗
      </a>
    `;
  };

  const renderCategoryPills = () => {
    if (!categoryPillsContainer) return;
    categoryPillsContainer.innerHTML = '';

    const branch = menuData.branches[state.activeBranch];
    const allowedCategories = branch.categories || ['all'];

    menuData.categories.forEach(cat => {
      if (!allowedCategories.includes(cat.id) && cat.id !== 'all') {
        return;
      }

      const pill = document.createElement('button');
      pill.className = `category-pill ${state.activeCategory === cat.id ? 'is-active' : ''}`;
      pill.type = 'button';
      pill.textContent = cat.name_ar;
      pill.dataset.category = cat.id;

      pill.addEventListener('click', () => {
        state.activeCategory = cat.id;
        document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
        renderProducts();
      });

      categoryPillsContainer.appendChild(pill);
    });
  };

  const renderProducts = () => {
    if (!menuProductsGrid) return;
    menuProductsGrid.innerHTML = '';

    const query = state.searchQuery.trim().toLowerCase();
    const branchId = state.activeBranch;
    const catId = state.activeCategory;

    const filtered = menuData.products.filter(item => {
      const matchBranch = item.branches.includes(branchId);
      const matchCategory = catId === 'all' || item.category === catId;
      const matchSearch = !query || 
        item.name_ar.toLowerCase().includes(query) ||
        item.name_en.toLowerCase().includes(query) ||
        (item.desc_ar && item.desc_ar.toLowerCase().includes(query));

      return matchBranch && matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      menuProductsGrid.innerHTML = `
        <div class="menu-empty-state" style="grid-column: 1/-1; text-align: center; padding: 50px;">
          <p style="font-size: 1.1rem; font-weight: 600; color: var(--color-espresso); margin-bottom: 6px;">لا توجد عناصر مطابقة للبحث</p>
          <p style="font-size: 0.9rem; color: var(--color-text-muted);">جرّب البحث باسم مشروب آخر أو تغيير تصنيف القائمة.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'menu-item-card';
      card.innerHTML = `
        <div class="menu-item-thumb" onclick="window.openItemModalById('${item.id}')">
          <img src="${item.image}" alt="${item.name_ar}" loading="lazy">
        </div>
        <div class="menu-item-details">
          <div class="menu-item-top">
            <h4 class="menu-item-title" onclick="window.openItemModalById('${item.id}')">${item.name_ar}</h4>
            <div class="menu-item-price">${item.price} <small>${item.currency}</small></div>
          </div>
          <div class="menu-item-en">${item.name_en}</div>
          <p class="menu-item-snippet">${item.desc_ar || item.notes_ar || ''}</p>
          <div class="menu-item-actions-row">
            ${item.signature ? '<span style="font-size: 0.72rem; color: var(--color-accent-earth); font-weight: 600;">★ بصمة جراوند</span>' : '<span></span>'}
            <button class="item-cart-quick-btn" onclick="window.addToCart('${item.id}')">
              <span>+ أضف للطلب</span>
            </button>
          </div>
        </div>
      `;

      menuProductsGrid.appendChild(card);
    });
  };

  // 14. ITEM MODAL
  window.openItemModalById = (id) => {
    const item = menuData.products.find(p => p.id === id);
    if (!item) return;

    const modalMedia = document.getElementById('modalMedia');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalEn = document.getElementById('modalEn');
    const modalDesc = document.getElementById('modalDesc');
    const modalNotes = document.getElementById('modalNotes');
    const modalAddBtn = document.getElementById('modalAddCartBtn');

    if (modalMedia) modalMedia.src = item.image;
    if (modalTitle) modalTitle.textContent = item.name_ar;
    if (modalPrice) modalPrice.innerHTML = `${item.price} <span>${item.currency}</span>`;
    if (modalEn) modalEn.textContent = item.name_en;
    if (modalDesc) modalDesc.textContent = item.desc_ar || 'تم إعداد هذا المشروب بمعايير قهوة مختصة دقيقة باستخدام أفضل حبوب البن المحمصة بعناية.';
    if (modalNotes) {
      modalNotes.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
        <span>${item.notes_ar || 'محصول مختص مُنتقى بعناية • يُحضر طازجاً عند الطلب'}</span>
      `;
    }

    if (modalAddBtn) {
      modalAddBtn.onclick = () => {
        window.addToCart(item.id);
        closeItemModal();
      };
    }

    if (itemModal) itemModal.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
  };

  const closeItemModal = () => {
    if (!itemModal) return;
    itemModal.classList.remove('is-visible');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeItemModal);
  if (itemModal) {
    itemModal.addEventListener('click', (e) => {
      if (e.target === itemModal) closeItemModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeItemModal();
      closeCartDrawer();
    }
  });

  // 15. BRANCH TABS SWITCHING
  branchTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const branchId = btn.dataset.branch;
      if (!branchId || branchId === state.activeBranch) return;

      state.activeBranch = branchId;
      state.activeCategory = 'all';

      branchTabBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      updateBranchBanner();
      renderCategoryPills();
      renderProducts();
    });
  });

  // 16. MENU SEARCH
  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  // 17. MAP PIN INTERACTION
  mapPins.forEach(pin => {
    pin.addEventListener('click', () => {
      const branchKey = pin.dataset.branch;
      const targetCard = document.getElementById(`branchCard-${branchKey}`);
      if (targetCard) {
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.style.outline = '3px solid var(--color-accent-sand)';
        setTimeout(() => {
          targetCard.style.outline = 'none';
        }, 2200);
      }
    });
  });

  // 18. AMBIENT SOUND SIMULATOR
  if (audioToggle) {
    audioToggle.addEventListener('click', () => {
      if (!state.audioPlaying) {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!state.audioContext) {
            state.audioContext = new AudioContext();
            
            const bufferSize = state.audioContext.sampleRate * 2;
            const noiseBuffer = state.audioContext.createBuffer(1, bufferSize, state.audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0;
            for (let i = 0; i < bufferSize; i++) {
              const white = Math.random() * 2 - 1;
              b0 = 0.99886 * b0 + white * 0.0555179;
              b1 = 0.99332 * b1 + white * 0.0750759;
              b2 = 0.96900 * b2 + white * 0.1538520;
              output[i] = (b0 + b1 + b2) * 0.04;
            }

            const whiteNoise = state.audioContext.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            const filter = state.audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 450;

            state.audioGain = state.audioContext.createGain();
            state.audioGain.gain.setValueAtTime(0.08, state.audioContext.currentTime);

            whiteNoise.connect(filter);
            filter.connect(state.audioGain);
            state.audioGain.connect(state.audioContext.destination);

            whiteNoise.start(0);
          }

          if (state.audioContext.state === 'suspended') {
            state.audioContext.resume();
          }

          state.audioGain.gain.setTargetAtTime(0.09, state.audioContext.currentTime, 0.5);
          state.audioPlaying = true;
          audioToggle.classList.add('is-playing');
          showToast('تم تشغيل الأجواء الصوتية الهادئة لجراوند كافيه ☕');
        } catch (err) {
          console.log('Audio init notice:', err);
        }
      } else {
        if (state.audioGain && state.audioContext) {
          state.audioGain.gain.setTargetAtTime(0.0001, state.audioContext.currentTime, 0.3);
        }
        state.audioPlaying = false;
        audioToggle.classList.remove('is-playing');
        showToast('تم إيقاف الصوت.');
      }
    });
  }

  // 19. SCROLL REVEAL (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // Initial renders
  updateBranchBanner();
  renderCategoryPills();
  renderProducts();

  console.log('GROUND CAFE • Agency 10/10 Engine running flawlessly.');
});
