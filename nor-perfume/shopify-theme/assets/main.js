/* ============================================================
   NOR PERFUME — SHOPIFY MAIN JS
   Custom cursor | Scroll reveal | Navbar | Parallax |
   Marquee pause | Counter animation | Newsletter |
   Glass glow | Float card tilt | Section entrance counter |
   Shopify AJAX Cart | Mobile menu | Product gallery |
   Variant selector | Cart page AJAX
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {


    /* ─────────────────────────────────────────
       2. SCROLL REVEAL — intersection with stagger
    ───────────────────────────────────────── */
    const fadeEls = document.querySelectorAll(".fade-up");
    const revealObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el    = entry.target;
                const delay = parseInt(el.dataset.delay || "0");
                setTimeout(() => el.classList.add("visible"), delay);
                obs.unobserve(el);
            }
        });
    }, { rootMargin: "0px 0px -50px 0px", threshold: 0.08 });

    fadeEls.forEach(el => revealObs.observe(el));

    /* ─────────────────────────────────────────
       3. NAVBAR SCROLL STATE
    ───────────────────────────────────────── */
    const navbar = document.getElementById("navbar");
    const handleNav = () => {
        if (!navbar) return;
        navbar.classList.toggle("scrolled", window.scrollY > 60);
    };
    window.addEventListener("scroll", handleNav, { passive: true });
    handleNav();

    /* ─────────────────────────────────────────
       4. HERO PARALLAX — smooth depth layers
    ───────────────────────────────────────── */
    const heroBg    = document.querySelector(".hero-bg-gradient");
    const heroBody  = document.querySelector(".hero-body");
    const scrollCue = document.querySelector(".scroll-cue");

    const handleParallax = () => {
        const sy = window.scrollY;
        const vh = window.innerHeight;
        if (sy >= vh) return;
        const p = sy / vh;

        if (heroBg) {
            heroBg.style.transform = `translateY(${sy * 0.3}px) scale(${1 + p * 0.04})`;
        }
        if (heroBody) {
            heroBody.style.transform = `translateY(${sy * 0.22}px)`;
            heroBody.style.opacity   = Math.max(0, 1 - p * 1.6).toString();
        }
        if (scrollCue) {
            scrollCue.style.opacity = Math.max(0, 1 - p * 4).toString();
        }
    };
    window.addEventListener("scroll", handleParallax, { passive: true });

    /* ─────────────────────────────────────────
       5. SMOOTH ANCHOR SCROLL
    ───────────────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener("click", function(e) {
            const id = this.getAttribute("href");
            if (!id || id === "#") return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const navH = navbar ? navbar.offsetHeight : 0;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - navH - 16,
                behavior: "smooth"
            });
        });
    });

    /* ─────────────────────────────────────────
       6. MARQUEE: Pause on hover
    ───────────────────────────────────────── */
    const track = document.querySelector(".marquee-track");
    if (track) {
        const strip = track.closest(".marquee-strip");
        strip?.addEventListener("mouseenter", () => track.style.animationPlayState = "paused");
        strip?.addEventListener("mouseleave", () => track.style.animationPlayState = "running");
    }

    /* ─────────────────────────────────────────
       7. STATS COUNTER — ease-out quartic
    ───────────────────────────────────────── */
    const countUp = (el, target) => {
        const dur   = 2000;
        const start = performance.now();
        const update = (now) => {
            const p     = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 4); // quartic ease-out
            el.textContent = Math.round(eased * target).toLocaleString();
            if (p < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };

    const statNums = document.querySelectorAll(".stat-num[data-target]");
    const statsObs = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el  = entry.target;
            const val = parseInt(el.dataset.target, 10);
            if (!isNaN(val)) countUp(el, val);
            obs.unobserve(el);
        });
    }, { threshold: 0.4 });
    statNums.forEach(el => statsObs.observe(el));

    /* ─────────────────────────────────────────
       8. NEWSLETTER — Shopify-compatible form handling
    ───────────────────────────────────────── */
    const nlForm = document.getElementById("nl-form");
    if (nlForm) {
        // Only intercept if not a native Shopify contact form (those have action="/contact")
        const isShopifyForm = nlForm.getAttribute("action") === "/contact";
        if (!isShopifyForm) {
            nlForm.addEventListener("submit", (e) => {
                e.preventDefault();
                const input = nlForm.querySelector("input[type='email']");
                const btn   = nlForm.querySelector("button[type='submit']");
                if (!input || !btn) return;
                btn.textContent = "Subscribed \u2713";
                btn.style.background = "linear-gradient(135deg, #4CAF50, #388E3C)";
                btn.style.color = "#fff";
                input.value = "";
                input.placeholder = "Thank you for subscribing!";
                setTimeout(() => {
                    btn.textContent = "Subscribe";
                    btn.style.background = "";
                    btn.style.color = "";
                    input.placeholder = "Your e-mail address";
                }, 3500);
            });
        } else {
            // Shopify contact form — show visual feedback after redirect
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get("customer_posted") === "true") {
                const btn = nlForm.querySelector("button[type='submit']");
                if (btn) {
                    btn.textContent = "Subscribed \u2713";
                    btn.style.background = "linear-gradient(135deg, #4CAF50, #388E3C)";
                    btn.style.color = "#fff";
                }
            }
        }
    }

    /* ─────────────────────────────────────────
       9. GLASS CARD MOUSE GLOW — radial follow
    ───────────────────────────────────────── */
    const glassCards = document.querySelectorAll(
        ".product-card, .review-card, .trust-card, .nl-box, .ed-badge, .float-card, .cart-summary, .cart-summary-box"
    );

    glassCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x    = ((e.clientX - rect.left)  / rect.width)  * 100;
            const y    = ((e.clientY - rect.top)    / rect.height) * 100;
            card.style.setProperty("--gx", x + "%");
            card.style.setProperty("--gy", y + "%");
            card.style.background = `
                radial-gradient(
                    circle at ${x}% ${y}%,
                    rgba(255,255,255,0.075) 0%,
                    rgba(255,255,255,0.02) 55%,
                    transparent 100%
                )
            `;
        });
        card.addEventListener("mouseleave", () => {
            card.style.transition = "background .6s ease";
            card.style.background = "";
            setTimeout(() => card.style.transition = "", 600);
        });
    });

    /* ─────────────────────────────────────────
       10. FLOAT CARDS — 3-D mouse parallax tilt
    ───────────────────────────────────────── */
    const floatCards = document.querySelectorAll(".float-card");
    let lastMouseX = window.innerWidth / 2;
    let lastMouseY = window.innerHeight / 2;

    document.addEventListener("mousemove", (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    });

    const animFloatCards = () => {
        const cx = (lastMouseX - window.innerWidth  / 2) / window.innerWidth;
        const cy = (lastMouseY - window.innerHeight / 2) / window.innerHeight;
        const now = Date.now() / 1200;

        floatCards.forEach((fc, i) => {
            const dir   = i % 2 === 0 ? 1 : -1;
            const bob   = Math.sin(now + i * 1.8) * 10;
            const rotY  = cx * 10 * dir;
            const rotX  = cy * -7;
            fc.style.transform = `
                translateY(${bob}px)
                rotateY(${rotY}deg)
                rotateX(${rotX}deg)
            `;
        });
        requestAnimationFrame(animFloatCards);
    };
    if (floatCards.length) animFloatCards();

    /* ─────────────────────────────────────────
       11. SECTION ENTRANCE COUNTER — active nav link
    ───────────────────────────────────────── */
    const sections = document.querySelectorAll("section[id], footer[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    const sectionObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    const href = link.getAttribute("href");
                    if (href && (href.includes(id) || (id === "home" && href === "/"))) {
                        link.style.color = "var(--c-cream)";
                    } else {
                        link.style.color = "";
                    }
                });
            }
        });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObs.observe(s));

    /* ─────────────────────────────────────────
       12. MOBILE MENU TOGGLE
    ───────────────────────────────────────── */
    const mobileMenu   = document.querySelector(".mobile-menu");
    const menuOpenBtn  = document.querySelector("[data-mobile-menu-open]");
    const menuCloseBtn = document.querySelector("[data-mobile-menu-close], .mobile-menu__close");

    const openMobileMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.add("is-open");
        document.body.style.overflow = "hidden";
    };
    const closeMobileMenu = () => {
        if (!mobileMenu) return;
        mobileMenu.classList.remove("is-open");
        document.body.style.overflow = "";
    };

    menuOpenBtn?.addEventListener("click", openMobileMenu);
    menuCloseBtn?.addEventListener("click", closeMobileMenu);

    // Also trigger open with the nav-menu-label button
    document.querySelector(".nav-menu-label")?.addEventListener("click", openMobileMenu);

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && mobileMenu?.classList.contains("is-open")) {
            closeMobileMenu();
        }
    });

    // Close when clicking a link inside the mobile menu
    mobileMenu?.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeMobileMenu);
    });

    /* ─────────────────────────────────────────
       13. SHOPIFY AJAX CART
    ───────────────────────────────────────── */
    const ShopifyCart = {
        async add(variantId, quantity = 1) {
            const res = await fetch("/cart/add.js", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: variantId, quantity })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.description || "Could not add item to cart.");
            }
            const data = await res.json();
            await this.updateCount();
            return data;
        },

        async updateCount() {
            const res  = await fetch("/cart.js");
            const cart = await res.json();
            const el   = document.getElementById("cart-count");
            if (el) {
                el.textContent = cart.item_count;
                // Pop animation
                el.style.transform  = "scale(1.8)";
                el.style.transition = "transform .08s ease-out";
                setTimeout(() => {
                    el.style.transform  = "scale(1)";
                    el.style.transition = "transform .25s cubic-bezier(.34,1.56,.64,1)";
                }, 100);
            }
            return cart;
        },

        async updateQuantity(line, quantity) {
            const res = await fetch("/cart/change.js", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ line, quantity })
            });
            return res.json();
        },

        async removeItem(line) {
            return this.updateQuantity(line, 0);
        },

        async getCart() {
            const res = await fetch("/cart.js");
            return res.json();
        }
    };

    // Expose globally so Liquid templates can also call it
    window.ShopifyCart = ShopifyCart;

    /* ─────────────────────────────────────────
       14. ADD-TO-CART BUTTON HANDLERS
       Looks for .btn-add-cart with data-variant-id.
       Falls back to the active variant selector if no attribute set.
    ───────────────────────────────────────── */
    document.querySelectorAll(".btn-large-add, .product-form .btn-add-cart").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();

            // Resolve variant ID: from button attr, or active variant selector, or <select>
            let variantId = btn.dataset.variantId
                || document.querySelector(".variant-btn.is-active")?.dataset.variantId
                || document.querySelector("select[name='id']")?.value;

            if (!variantId) {
                // No variant found — let Shopify native form handle it.
                return;
            }

            const qty = parseInt(
                document.querySelector(".quantity-selector__input, .qty-num")?.value || "1"
            );

            const origText = btn.textContent.trim();
            btn.classList.add("is-loading");
            btn.textContent = "Adding\u2026";

            try {
                await ShopifyCart.add(parseInt(variantId), qty);
                btn.textContent = "\u2713 Added";
                btn.style.background = "rgba(100,200,120,.2)";
                btn.style.borderColor = "rgba(100,200,120,.4)";
            } catch (err) {
                btn.textContent = "Sold Out";
                btn.style.background = "";
            } finally {
                btn.classList.remove("is-loading");
                setTimeout(() => {
                    btn.textContent = origText;
                    btn.style.background = "";
                    btn.style.borderColor = "";
                }, 1800);
            }
        });
    });

    /* ─────────────────────────────────────────
       15. PRODUCT PAGE — Image gallery switching
    ───────────────────────────────────────── */
    const galleryMain = document.querySelector(".product-gallery__main img");
    const thumbs      = document.querySelectorAll(".product-gallery__thumb");

    thumbs.forEach((thumb) => {
        thumb.addEventListener("click", () => {
            const thumbImg = thumb.querySelector("img");
            if (!galleryMain || !thumbImg) return;

            // Fade-switch effect
            galleryMain.classList.add("is-switching");
            setTimeout(() => {
                galleryMain.src = thumbImg.src;
                if (thumbImg.srcset) galleryMain.srcset = thumbImg.srcset;
                galleryMain.alt = thumbImg.alt;
                galleryMain.classList.remove("is-switching");
            }, 250);

            thumbs.forEach(t => t.classList.remove("is-active"));
            thumb.classList.add("is-active");
        });
    });

    /* ─────────────────────────────────────────
       16. PRODUCT PAGE — Variant selector
       Reads data-variant-id, data-price, data-compare-price, data-image from each .variant-btn
    ───────────────────────────────────────── */
    const variantBtns     = document.querySelectorAll(".variant-btn");
    const priceEl         = document.querySelector(".product-info__price .price, .pdp-price");
    const comparePriceEl  = document.querySelector(".product-info__price .price--compare");
    const addToCartBtn    = document.querySelector(".btn-add-cart, .btn-large-add");

    variantBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.classList.contains("is-unavailable")) return;

            variantBtns.forEach(b => b.classList.remove("is-active"));
            btn.classList.add("is-active");

            // Update selected label if present
            const labelSelected = btn.closest(".variant-selector")
                ?.querySelector(".variant-selector__label span:last-child");
            if (labelSelected) labelSelected.textContent = btn.textContent.trim();

            // Update price display
            if (priceEl && btn.dataset.price) {
                priceEl.textContent = btn.dataset.price;
                priceEl.classList.toggle("price--sale", !!btn.dataset.comparePrice);
            }
            if (comparePriceEl) {
                if (btn.dataset.comparePrice) {
                    comparePriceEl.textContent = btn.dataset.comparePrice;
                    comparePriceEl.style.display = "";
                } else {
                    comparePriceEl.style.display = "none";
                }
            }

            // Update main gallery image if variant has one
            if (galleryMain && btn.dataset.image) {
                galleryMain.classList.add("is-switching");
                setTimeout(() => {
                    galleryMain.src = btn.dataset.image;
                    galleryMain.classList.remove("is-switching");
                }, 250);
            }

            // Update add-to-cart button availability
            if (addToCartBtn) {
                const unavailable = btn.classList.contains("is-unavailable");
                addToCartBtn.disabled = unavailable;
                addToCartBtn.textContent = unavailable
                    ? "Sold Out"
                    : (addToCartBtn.dataset.addText || "Add to Cart");
            }
        });
    });

    // Also handle <select> variant selectors (Shopify default)
    const variantSelect = document.querySelector("select[name='id']");
    if (variantSelect) {
        variantSelect.addEventListener("change", () => {
            const selectedOption = variantSelect.options[variantSelect.selectedIndex];
            if (priceEl && selectedOption.dataset.price) {
                priceEl.textContent = selectedOption.dataset.price;
            }
        });
    }

    /* ─────────────────────────────────────────
       17. QUANTITY +/- BUTTONS
    ───────────────────────────────────────── */
    document.querySelectorAll(".quantity-selector").forEach(qs => {
        const minusBtn = qs.querySelector('[data-qty="minus"], .quantity-selector__btn:first-child');
        const plusBtn  = qs.querySelector('[data-qty="plus"], .quantity-selector__btn:last-child');
        const input    = qs.querySelector(".quantity-selector__input, input[type='number']");

        if (!input) return;

        minusBtn?.addEventListener("click", () => {
            const val = parseInt(input.value || "1");
            if (val > 1) input.value = val - 1;
            input.dispatchEvent(new Event("change", { bubbles: true }));
        });
        plusBtn?.addEventListener("click", () => {
            const val = parseInt(input.value || "1");
            input.value = val + 1;
            input.dispatchEvent(new Event("change", { bubbles: true }));
        });
    });

    /* ─────────────────────────────────────────
       18. PRODUCT ACCORDION
    ───────────────────────────────────────── */
    document.querySelectorAll(".product-accordion__header, .pdp-accordion-header").forEach(header => {
        header.addEventListener("click", () => {
            const item   = header.closest(".product-accordion__item, .pdp-accordion-item");
            const isOpen = item.classList.contains("is-open");

            // Close all
            document.querySelectorAll(".product-accordion__item, .pdp-accordion-item").forEach(i => {
                i.classList.remove("is-open");
                const body = i.querySelector(".product-accordion__body");
                if (body) body.style.maxHeight = "";
            });

            // Open clicked (toggle)
            if (!isOpen) {
                item.classList.add("is-open");
                const body = item.querySelector(".product-accordion__body");
                if (body) body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });

    /* ─────────────────────────────────────────
       19. CART PAGE — AJAX quantity update, remove, totals
    ───────────────────────────────────────── */
    const cartItemsContainer = document.querySelector(".cart-page__items, .cart-table tbody");

    if (cartItemsContainer) {

        // Helper: format money (Shopify returns cents as integer)
        const formatMoney = (cents) => {
            const amount = (cents / 100).toFixed(2);
            return "$" + amount;
        };

        // Helper: refresh cart display after an update
        const refreshCartDisplay = async () => {
            const cart = await ShopifyCart.getCart();

            // Update count badge
            const countBadge = document.getElementById("cart-count");
            if (countBadge) countBadge.textContent = cart.item_count;

            // Update cart count text
            const cartCountText = document.querySelector(".cart-page__count");
            if (cartCountText) {
                cartCountText.textContent = cart.item_count + " " + (cart.item_count === 1 ? "item" : "items");
            }

            // Update subtotal elements
            document.querySelectorAll("[data-cart-subtotal], .cart-summary__amount, [data-cart-total]").forEach(el => {
                el.textContent = formatMoney(cart.total_price);
            });

            // Show empty state if no items
            const emptyState  = document.querySelector(".empty-cart");
            const cartContent = document.querySelector(".cart-page__layout, .cart-layout");
            if (cart.item_count === 0) {
                if (emptyState)  emptyState.style.display  = "";
                if (cartContent) cartContent.style.display = "none";
            }

            return cart;
        };

        // Delegated: quantity +/- buttons inside cart
        cartItemsContainer.addEventListener("click", async (e) => {
            const btn = e.target.closest("[data-qty-btn], .qty-btn, .quantity-selector__btn");
            if (!btn) return;
            e.preventDefault();

            const item  = btn.closest("[data-cart-item], .cart-item, tr[data-line]");
            const line  = parseInt(item?.dataset.line || item?.dataset.cartItem);
            const qtyEl = item?.querySelector(".quantity-selector__input, .qty-num, input[type='number']");
            if (!line || !qtyEl) return;

            const isPlus  = btn.dataset.qty === "plus"  || btn.classList.contains("plus")  || btn.textContent.trim() === "+";
            const isMinus = btn.dataset.qty === "minus" || btn.classList.contains("minus") || btn.textContent.trim() === "\u2212";
            let newQty = parseInt(qtyEl.textContent || qtyEl.value || "1");
            if (isPlus)  newQty += 1;
            if (isMinus) newQty  = Math.max(0, newQty - 1);

            // Optimistic UI
            if (qtyEl.tagName === "INPUT") qtyEl.value = newQty;
            else qtyEl.textContent = newQty;

            const priceCell = item?.querySelector(".cart-item__price, .cart-price");
            if (priceCell) priceCell.style.opacity = ".4";

            try {
                await ShopifyCart.updateQuantity(line, newQty);
                await refreshCartDisplay();
            } catch (err) {
                console.error("Cart update failed:", err);
            } finally {
                if (priceCell) priceCell.style.opacity = "";
            }
        });

        // Delegated: remove item button
        cartItemsContainer.addEventListener("click", async (e) => {
            const btn = e.target.closest("[data-remove], .cart-item__remove, .btn-remove");
            if (!btn) return;
            e.preventDefault();

            const item = btn.closest("[data-cart-item], .cart-item, tr[data-line]");
            const line = parseInt(item?.dataset.line || item?.dataset.cartItem);
            if (!line) return;

            // Animate row out
            if (item) {
                item.style.transition = "opacity .3s ease, transform .3s ease";
                item.style.opacity    = "0";
                item.style.transform  = "translateX(-16px)";
            }

            try {
                await ShopifyCart.removeItem(line);
                setTimeout(() => item?.remove(), 320);
                await refreshCartDisplay();
            } catch (err) {
                // Restore on failure
                if (item) {
                    item.style.opacity   = "";
                    item.style.transform = "";
                }
                console.error("Remove failed:", err);
            }
        });

        // Input-based quantity change (native Shopify pattern)
        cartItemsContainer.addEventListener("change", async (e) => {
            const input = e.target.closest("input[type='number'][data-line], input[name='updates[]']");
            if (!input) return;
            e.preventDefault();

            const line   = parseInt(input.dataset.line || input.dataset.cartItem);
            const newQty = parseInt(input.value);
            if (isNaN(line) || isNaN(newQty)) return;

            try {
                await ShopifyCart.updateQuantity(line, newQty);
                await refreshCartDisplay();
            } catch (err) {
                console.error("Cart quantity update failed:", err);
            }
        });

        // Initial cart count sync on page load
        ShopifyCart.updateCount().catch(() => {});
    }

    /* ─────────────────────────────────────────
       20. COLLECTION PAGE — quick-add from grid
    ───────────────────────────────────────── */
    document.querySelectorAll(".btn-circle-add[data-variant-id], .btn-quick[data-variant-id]").forEach(btn => {
        btn.addEventListener("click", async (e) => {
            e.preventDefault();
            const variantId = btn.dataset.variantId;
            if (!variantId) return;

            const origText = btn.textContent.trim();
            btn.disabled   = true;
            btn.textContent = "\u2026";

            try {
                await ShopifyCart.add(parseInt(variantId), 1);
                btn.textContent = "\u2713";
                btn.style.borderColor = "rgba(100,220,120,.5)";
                btn.style.color       = "rgba(100,220,120,.8)";
            } catch (err) {
                btn.textContent = "!";
            } finally {
                setTimeout(() => {
                    btn.textContent       = origText;
                    btn.style.borderColor = "";
                    btn.style.color       = "";
                    btn.disabled          = false;
                }, 1600);
            }
        });
    });

});
