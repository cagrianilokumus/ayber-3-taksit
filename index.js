<script>
(function(){
"use strict";
if(document.getElementById('teklifWidgetRoot')) return;

// ===== CSS ENJEKTE =====
var css = `
.teklif-widget, .teklif-fab { font-family: inherit; }
.teklif-widget {
    position: fixed; z-index: 99999; bottom: 24px; left: 24px;
    width: 370px; max-width: 92vw; background: #fff; border-radius: 16px;
    overflow: hidden; border: 1px solid #e5e5e5;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    opacity: 0; visibility: hidden;
    transform: translateY(16px) scale(0.96);
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.teklif-widget.active { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
.teklif-header {
    padding: 14px 16px 0; display: flex; flex-direction: column; gap: 10px;
    border-bottom: 1px solid #f0f0f0;
}
.teklif-header-top {
    display: flex; align-items: center; justify-content: space-between;
}
.teklif-header-left { display: flex; flex-direction: column; gap: 4px; }
.teklif-tag {
    display: inline-flex; align-items: center; gap: 6px;
    background: #111; color: #FFC200; padding: 4px 10px;
    border-radius: 100px; font-size: 10px; font-weight: 700;
    letter-spacing: 0.5px; text-transform: uppercase; width: fit-content;
}
.teklif-tag-dot {
    width: 5px; height: 5px; background: #FFC200;
    border-radius: 50%; animation: teklif-blink 1.5s ease-in-out infinite;
}
@keyframes teklif-blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
.teklif-header-sub { font-size: 11px; color: #999; font-weight: 400; }
.teklif-close {
    width: 28px; height: 28px; background: none; border: 1px solid #e5e5e5;
    border-radius: 8px; color: #aaa; cursor: pointer; display: flex;
    align-items: center; justify-content: center; transition: all 0.15s ease; flex-shrink: 0;
}
.teklif-close:hover { border-color: #ccc; color: #555; }
.teklif-tabs {
    display: flex; gap: 0; margin: 0 -16px; padding: 0;
}
.teklif-tab {
    flex: 1; padding: 10px 16px; background: none; border: none;
    font-size: 12px; font-weight: 600; color: #999; cursor: pointer;
    font-family: inherit; position: relative; transition: color 0.2s ease;
    text-align: center;
}
.teklif-tab::after {
    content: ''; position: absolute; bottom: 0; left: 16px; right: 16px;
    height: 2px; background: transparent; border-radius: 2px;
    transition: background 0.2s ease;
}
.teklif-tab.active { color: #111; }
.teklif-tab.active::after { background: #FFC200; }
.teklif-tab:hover:not(.active) { color: #666; }
.teklif-slider-wrapper { position: relative; }
.teklif-slider { position: relative; }
.teklif-slide { display: none; }
.teklif-slide.active { display: block; animation: teklif-slideFadeIn 0.25s ease; }
@keyframes teklif-slideFadeIn { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }
.teklif-slider-nav {
    position: absolute; top: 90px; width: 30px; height: 30px;
    background: rgba(255,255,255,0.92); border: 1px solid #e5e5e5;
    border-radius: 50%; display: flex; align-items: center;
    justify-content: center; cursor: pointer; z-index: 3;
    transition: all 0.15s ease; color: #666; backdrop-filter: blur(4px);
}
.teklif-slider-nav:hover { background: #fff; color: #111; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
.teklif-slider-nav.disabled { opacity: 0; pointer-events: none; }
.teklif-slider-prev { left: 8px; }
.teklif-slider-next { right: 8px; }
.teklif-dots { display: flex; justify-content: center; gap: 5px; padding: 10px 0 18px; }
.teklif-dot {
    width: 6px; height: 6px; border-radius: 50%; background: #ddd;
    border: none; padding: 0; cursor: pointer; transition: all 0.25s ease;
}
.teklif-dot.active { background: #FFC200; width: 16px; border-radius: 3px; }
.teklif-slide-inner { padding: 0; }
.teklif-product-image { position: relative; width: 100%; overflow: hidden; background: #f5f5f4; }
.teklif-product-image img { width: 100%; height: auto; display: block; max-height: 320px; object-fit: contain; }
.teklif-discount-badge {
    position: absolute; top: 10px; left: 10px; background: #FFC200;
    color: #111; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 700;
}
.teklif-slide-counter {
    position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5);
    color: #fff; padding: 2px 8px; border-radius: 10px; font-size: 10px;
    font-weight: 600; backdrop-filter: blur(4px);
}
.teklif-product-info { padding: 14px 16px 0; }
.teklif-product-brand {
    font-size: 10px; text-transform: uppercase; letter-spacing: 1.2px;
    color: #b8900e; font-weight: 700; display: block; margin-bottom: 4px;
}
.teklif-product-name {
    font-size: 14px; font-weight: 600; color: #111; line-height: 1.35;
    display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    overflow: hidden; margin-bottom: 10px;
}
.teklif-pricing { display: flex; align-items: baseline; gap: 8px; margin-bottom: 4px; }
.teklif-price-current { font-size: 22px; font-weight: 800; color: #111; letter-spacing: -0.5px; }
.teklif-price-old { font-size: 13px; color: #ccc; text-decoration: line-through; font-weight: 400; }
.teklif-savings {
    display: inline-block; font-size: 10px; color: #b8900e; font-weight: 600;
    background: #fffbeb; padding: 3px 8px; border-radius: 5px;
    border: 1px solid #fef3c7; margin-bottom: 12px;
}
.teklif-actions { display: flex; gap: 8px; padding: 0 16px 14px; }
.teklif-btn-primary {
    flex: 1; padding: 11px 16px; background: #FFC200; color: #111; border: none;
    border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: inherit; transition: opacity 0.15s ease;
}
.teklif-btn-primary:hover { opacity: 0.85; }
.teklif-btn-primary:active { opacity: 0.7; }
.teklif-btn-secondary {
    padding: 11px 16px; background: #fff; color: #111; border: 1px solid #e5e5e5;
    border-radius: 10px; font-size: 13px; font-weight: 500; cursor: pointer;
    font-family: inherit; transition: all 0.15s ease;
}
.teklif-btn-secondary:hover { border-color: #ccc; background: #fafafa; }
.teklif-footer {
    display: flex; justify-content: center; gap: 16px; padding: 10px 16px;
    border-top: 1px solid #f0f0f0; background: #fafafa;
}
.teklif-trust-item { display: flex; align-items: center; gap: 4px; font-size: 10px; color: #bbb; font-weight: 400; }
.teklif-trust-icon { width: 12px; height: 12px; stroke: #bbb; fill: none; stroke-width: 1.5; }
.teklif-trust-icon.teklif-fill { stroke: none; fill: #bbb; }
.teklif-fab {
    position: fixed; bottom: 24px; left: 24px;
    background: none; border: none; padding: 0; cursor: pointer;
    z-index: 99997; transition: all 0.3s ease;
}
.teklif-fab:hover { transform: scale(1.08); }
.teklif-fab.hidden { transform: scale(0); opacity: 0; pointer-events: none; }
.teklif-fab img { height: 65px; width: auto; display: block; }
@keyframes teklif-fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
.teklif-widget.active .teklif-slider-wrapper { animation: teklif-fadeUp 0.3s ease 0.1s both; }
@media (max-width: 480px) {
    .teklif-widget {
        width: 92vw; max-width: 92vw; border-radius: 16px;
        bottom: 90px; left: 4vw; transform: translateY(20px) scale(0.96);
        border: 1px solid #e5e5e5; max-height: 75vh; overflow-y: auto;
    }
    .teklif-widget.active { transform: translateY(0) scale(1); }
    .teklif-product-image img { max-height: 200px; }
    .teklif-product-info { padding: 10px 12px 0; }
    .teklif-product-name { font-size: 13px; margin-bottom: 6px; }
    .teklif-price-current { font-size: 18px; }
    .teklif-price-old { font-size: 12px; }
    .teklif-actions { padding: 0 12px 10px; gap: 6px; }
    .teklif-btn-primary, .teklif-btn-secondary { padding: 9px 12px; font-size: 12px; }
    .teklif-dots { padding: 6px 0 10px; }
    .teklif-footer { padding: 8px 12px; gap: 10px; }
    .teklif-fab { bottom: 16px; left: 16px; }
}
`;

var styleEl = document.createElement('style');
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ===== HTML ENJEKTE =====
var root = document.createElement('div');
root.id = 'teklifWidgetRoot';
root.innerHTML = '<button class="teklif-fab" id="teklifFab"><img src="https://www.ayber.com/Data/EditorFiles/urunleri_incele_buton.png" alt="\u00DCr\u00FCnleri \u0130ncele"></button>'
+ '<div class="teklif-widget" id="teklifWidget">'
+   '<div class="teklif-header">'
+     '<div class="teklif-header-top">'
+       '<div class="teklif-header-left">'
+         '<span class="teklif-tag"><span class="teklif-tag-dot"></span> Pe\u015Fin Fiyat\u0131na 3 Taksit</span>'
+       '</div>'
+       '<button class="teklif-close" id="teklifClose"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>'
+     '</div>'
+     '<div class="teklif-tabs" id="teklifTabs"></div>'
+   '</div>'
+   '<div class="teklif-slider-wrapper">'
+     '<button class="teklif-slider-nav teklif-slider-prev disabled" id="sliderPrev"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg></button>'
+     '<button class="teklif-slider-nav teklif-slider-next" id="sliderNext"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>'
+     '<div class="teklif-slider" id="teklifSlider"></div>'
+   '</div>'
+   '<div class="teklif-dots" id="teklifDots"></div>'
+   '<div class="teklif-footer">'
+     '<div class="teklif-trust-item"><svg class="teklif-trust-icon" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> Stoktan Sat\u0131\u015F</div>'
+     '<div class="teklif-trust-item"><svg class="teklif-trust-icon teklif-fill" viewBox="0 0 440 440"><path d="M344.33,212.5c0,103.857-80.577,189.248-182.5,196.936V197.361l151.76-55.236l-10.26-28.191l-141.5,51.502V121.38l151.76-55.236l-10.26-28.191l-141.5,51.502V0h-30v100.374l-66.16,24.08l10.261,28.191L131.83,132.3v44.055l-66.16,24.08l10.261,28.191l55.899-20.346V440h15c60.813,0,117.957-23.651,160.902-66.597c42.946-42.946,66.598-100.089,66.598-160.903H344.33z"/></svg> Pe\u015Fin Fiyat\u0131na 3 Taksit</div>'
+     '<div class="teklif-trust-item"><svg class="teklif-trust-icon" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> G\u00FCvenli \u00D6deme</div>'
+   '</div>'
+ '</div>';

document.body.appendChild(root);

// ===== KATEGORİLER & ÜRÜNLER =====
var kategoriler = [
    {
        isim: "Yap\u0131 Market",
        urunler: [
            {
                isim: "Akfix Silikon 280 gr Genel Ama\u00E7l\u0131 Silikon",
                marka: "AKFIX",
                koliFiyat: 1296,
                adetFiyat: 54,
                gorsel: "https://www.ayber.com/akfix-1100e-silikon-280-gr-seffaf-genel-amacli-silikon-yapistiricilar-akfix-716-72-O.png",
                link: ""
            },
            {
                isim: "Ceresit Cs 225 \u015Eeffaf Silikon 280 ml",
                marka: "HENKEL",
                koliFiyat: 1302.08,
                adetFiyat: 52.08,
                gorsel: "https://www.ayber.com/ceresit-cs-225-seffaf-silikon-280-ml-koli-25-adet-yapistiricilar-henkel-855-42-O.jpg",
                link: ""
            },
            {
                isim: "Selsil Fren Balata Temizleyici 500ml",
                marka: "SELSIL",
                koliFiyat: 1056,
                adetFiyat: 44,
                gorsel: "https://www.ayber.com/selsil-fren-balata-temizleyici-500ml-teknik-kimyasallar-selsil-785-76-O.png",
                link: ""
            },
            {
                isim: "Sibax Poli\u00FCretan K\u00F6p\u00FCk 600 Gr Ns66",
                marka: "SIBAX",
                koliFiyat: 944,
                adetFiyat: 59,
                gorsel: "https://www.ayber.com/sibax-poliuretan-kopuk-600-gr-ns66-16-adetkoli-yapistiricilar-sibax-479-37-O.jpg",
                link: ""
            },
            {
                isim: "Makro Do\u011Fal Kau\u00E7uk Maskeleme Band\u0131 48x25 mt",
                marka: "MAKRO",
                koliFiyat: 724.50,
                adetFiyat: 20.13,
                gorsel: "https://www.ayber.com/makro-dogal-kaucuk-maskeleme-bandi-48x25-mt-kagit-bant-makro-796-77-O.png",
                link: ""
            },
            {
                isim: "\u015Eeffaf Koli Band\u0131 43mm x 90m",
                marka: "AYBER",
                koliFiyat: 1936.80,
                adetFiyat: 26.90,
                gorsel: "https://www.ayber.com/plus-proline-43mm-x-90m-seffaf-koli-bandi-koli-bandi-1029-91-O.jpg",
                link: ""
            }
        ]
    },
    {
        isim: "Otomotiv Grubu",
        urunler: [
            {
                isim: "Akrimask 18x35mt Maskeleme Band\u0131 Kahverengi Ka\u011F\u0131t Bant",
                marka: "AKRIMASK",
                koliFiyat: 2085,
                adetFiyat: 21.70,
                gorsel: "https://www.ayber.com/akrimask-18x35mt-maskeleme-bandi-kahverengi-kagit-bant-koli-96-adet-kagit-bant-akrimask-765-40-O.png",
                link: ""
            },
            {
                isim: "Akzo Nobel Kemipol Optima 411 Akrilik Astar 3,75 Litre",
                marka: "AKZO NOBEL",
                koliFiyat: 2120,
                adetFiyat: 1060,
                gorsel: "https://www.ayber.com/akzo-nobel-kemipol-optima-411-akrilik-astar-375-litre-oto-tamir-boyalari-akzo-nobel-239-18-O.jpg",
                link: ""
            },
            {
                isim: "Duxone Dx 48 2K HS Akrilik Vernik 4 Litre",
                marka: "DUXONE",
                koliFiyat: 4320,
                adetFiyat: 1440,
                gorsel: "https://www.ayber.com/duxone-dx-48-2k-hs-akrilik-vernik-4-litre-koli-4-adet-oto-tamir-boyalari-duxone-751-16-O.jpg",
                link: ""
            },
            {
                isim: "Rodex RDX1491 Polisaj Makinas\u0131 1200W",
                marka: "RODEX",
                koliFiyat: 2625,
                adetFiyat: 2625,
                gorsel: "https://www.ayber.com/rodex-rdx149-polisaj-makinasi-1200w-elektrikli-el-aletleri-rodex-214-16-O.jpg",
                link: ""
            },
            {
                isim: "Sinta\u015F Garnet 2K Akrilik Sertle\u015Ftirici H\u0131zl\u0131 5 Litre",
                marka: "SINTA\u015E",
                koliFiyat: 4000,
                adetFiyat: 1000,
                gorsel: "https://www.ayber.com/sintas-garnet-2k-akrilik-sertlestirici-hizli-5-litre-koli-6-adet-oto-tamir-boyalari-sintas-944-19-O.jpg",
                link: ""
            },
            {
                isim: "Sinta\u015F VR P\u00FCt\u00FCr 1 Litre Siyah",
                marka: "SINTA\u015E",
                koliFiyat: 1680,
                adetFiyat: 140,
                gorsel: "https://www.ayber.com/sintas-vr-putur-1-litre-siyah-koli-12-adet-oto-tamir-boyalari-sintas-233-18-O.jpg",
                link: ""
            }
        ]
    }
];

var aktifTab = 0;
var aktifSlide = 0;
var sliderEl = document.getElementById('teklifSlider');
var dotsEl = document.getElementById('teklifDots');
var tabsEl = document.getElementById('teklifTabs');
var widget = document.getElementById('teklifWidget');
var fab = document.getElementById('teklifFab');

// ===== EVENT LISTENERS =====
fab.addEventListener('click', teklifWidgetAc);
document.getElementById('teklifClose').addEventListener('click', teklifWidgetKapat);
document.getElementById('sliderPrev').addEventListener('click', function(){ sliderGit(-1); });
document.getElementById('sliderNext').addEventListener('click', function(){ sliderGit(1); });

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') teklifWidgetKapat();
    if (widget.classList.contains('active')) {
        if (e.key === 'ArrowLeft') sliderGit(-1);
        if (e.key === 'ArrowRight') sliderGit(1);
    }
});

// ===== FONKSİYONLAR =====
function teklifWidgetAc() {
    widget.classList.add('active');
    fab.classList.add('hidden');
}

function teklifWidgetKapat() {
    widget.classList.remove('active');
    setTimeout(function(){ fab.classList.remove('hidden'); }, 300);
}

function aktifUrunler() {
    return kategoriler[aktifTab].urunler;
}

function slideOlustur(urun, index) {
    var urunListesi = aktifUrunler();
    var indirimVar = urun.eskiFiyat && urun.indirimOrani;
    var html = '<div class="teklif-slide" data-index="' + index + '">'
        + '<div class="teklif-slide-inner">'
        +   '<div class="teklif-product-image">'
        +     '<img src="' + urun.gorsel + '" alt="' + urun.isim.replace(/"/g,'&quot;') + '" onerror="this.style.display=\'none\'">';
    if (indirimVar) {
        html += '<div class="teklif-discount-badge">%' + urun.indirimOrani + '</div>';
    }
    html += '<div class="teklif-slide-counter">' + (index+1) + ' / ' + urunListesi.length + '</div>'
        +   '</div>'
        +   '<div class="teklif-product-info">'
        +     '<span class="teklif-product-brand">' + urun.marka + '</span>'
        +     '<span class="teklif-product-name">' + urun.isim + '</span>'
        +     '<div class="teklif-pricing">'
        +       '<span class="teklif-price-current">\u20BA' + urun.koliFiyat.toLocaleString('tr-TR') + '</span>'
        +       '<span style="font-size:11px;color:#999;font-weight:500;">Koli Fiyat\u0131</span>'
        +     '</div>'
        +     '<div style="display:flex;align-items:baseline;gap:8px;margin-bottom:4px;">'
        +       '<span style="font-size:14px;font-weight:600;color:#555;">\u20BA' + urun.adetFiyat.toLocaleString('tr-TR') + '</span>'
        +       '<span style="font-size:11px;color:#999;font-weight:500;">Adet Fiyat\u0131</span>'
        +     '</div>';
    if (indirimVar) {
        var tasarruf = urun.eskiFiyat - urun.koliFiyat;
        html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">'
            +     '<span class="teklif-price-old">\u20BA' + urun.eskiFiyat.toLocaleString('tr-TR') + '</span>'
            +     '<span class="teklif-savings">\u20BA' + tasarruf.toLocaleString('tr-TR') + ' tasarruf</span>'
            +   '</div>';
    }
    html += '<span style="display:block;font-size:9px;color:#999;margin-bottom:4px;">* KDV dahil de\u011Fildir</span>'
        +   '</div>'
        +   '<div class="teklif-actions">'
        +     '<button class="teklif-btn-primary" data-idx="' + index + '">Sepete Ekle</button>'
        +     '<button class="teklif-btn-secondary" data-idx="' + index + '">\u0130ncele</button>'
        +   '</div>'
        + '</div></div>';
    return html;
}

function tablarOlustur() {
    if (kategoriler.length <= 1) {
        tabsEl.style.display = 'none';
        return;
    }
    tabsEl.innerHTML = kategoriler.map(function(kat, i) {
        return '<button class="teklif-tab' + (i === 0 ? ' active' : '') + '" data-tab="' + i + '">' + kat.isim + '</button>';
    }).join('');

    tabsEl.addEventListener('click', function(e) {
        var tab = e.target.closest('.teklif-tab');
        if (!tab) return;
        var idx = parseInt(tab.dataset.tab);
        if (idx === aktifTab) return;
        aktifTab = idx;
        aktifSlide = 0;

        var tabs = tabsEl.querySelectorAll('.teklif-tab');
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].classList.toggle('active', i === aktifTab);
        }
        sliderOlustur();
    });
}

function sliderOlustur() {
    var urunListesi = aktifUrunler();
    aktifSlide = 0;
    sliderEl.innerHTML = urunListesi.map(function(u, i) { return slideOlustur(u, i); }).join('');
    dotsEl.innerHTML = urunListesi.map(function(_, i) {
        return '<button class="teklif-dot' + (i === 0 ? ' active' : '') + '" data-dot="' + i + '"></button>';
    }).join('');

    var ilk = sliderEl.querySelector('.teklif-slide');
    if (ilk) ilk.classList.add('active');
    slideGuncelle();
}

function slideGuncelle() {
    var urunListesi = aktifUrunler();
    var slides = sliderEl.querySelectorAll('.teklif-slide');
    var dots = dotsEl.querySelectorAll('.teklif-dot');
    for (var i = 0; i < slides.length; i++) {
        slides[i].classList.toggle('active', i === aktifSlide);
    }
    for (var j = 0; j < dots.length; j++) {
        dots[j].classList.toggle('active', j === aktifSlide);
    }
    document.getElementById('sliderPrev').classList.toggle('disabled', aktifSlide === 0);
    document.getElementById('sliderNext').classList.toggle('disabled', aktifSlide === urunListesi.length - 1);
}

function sliderGit(yon) {
    var urunListesi = aktifUrunler();
    var yeni = aktifSlide + yon;
    if (yeni >= 0 && yeni < urunListesi.length) { aktifSlide = yeni; slideGuncelle(); }
}

function slideGit(index) {
    aktifSlide = index;
    slideGuncelle();
}

// Event delegation - dots
dotsEl.addEventListener('click', function(e) {
    var dot = e.target.closest('.teklif-dot');
    if (dot) slideGit(parseInt(dot.dataset.dot));
});

// Event delegation - butonlar
sliderEl.addEventListener('click', function(e) {
    var primary = e.target.closest('.teklif-btn-primary');
    var secondary = e.target.closest('.teklif-btn-secondary');
    var idx, urun, url;
    var urunListesi = aktifUrunler();
    if (primary) {
        idx = parseInt(primary.dataset.idx);
        urun = urunListesi[idx];
        url = urun.link + (urun.link.indexOf('?') > -1 ? '&' : '?') + 'utm_source=website&utm_medium=widget&utm_campaign=' + encodeURIComponent(urun.isim);
        window.open(url, '_blank');
    }
    if (secondary) {
        idx = parseInt(secondary.dataset.idx);
        urun = urunListesi[idx];
        url = urun.link + (urun.link.indexOf('?') > -1 ? '&' : '?') + 'utm_source=website&utm_medium=widget&utm_campaign=' + encodeURIComponent(urun.isim);
        window.open(url, '_blank');
    }
});

// Swipe
var touchStartX = 0;
sliderEl.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
sliderEl.addEventListener('touchend', function(e) {
    var fark = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(fark) > 50) sliderGit(fark > 0 ? 1 : -1);
}, { passive: true });

// ===== BAŞLAT =====
tablarOlustur();
sliderOlustur();

})();
</script>
