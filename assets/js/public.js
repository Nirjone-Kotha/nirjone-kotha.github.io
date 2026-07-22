import { loadSiteConfig, contactOptions } from "./config.js?v=6.1.0";
import { getConsent, setConsent } from "./consent.js?v=6.1.0";
import { trackEvent, trackPage } from "./analytics.js?v=6.1.0";
import { store } from "./storage.js?v=6.1.0";
import { initAdminRuntime, getAdminRuntime, subscribeAdminRuntime } from "../../admin/public/runtime-client.js?v=6.1.0";
import { AD_PLACEMENTS, createAdSlot, isAdSlotEnabled } from "./ads.js?v=6.1.0";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const runtimePromise=initAdminRuntime();

function iconText(id) { return ({facebook:"f",email:"@",whatsapp:"⌁"})[id] || "•"; }
function runtimeConfig(config){const site=getAdminRuntime()?.settings?.site||{};return {...config,contact:{...config.contact,facebookPageUrl:site.facebookUrl||config.contact?.facebookPageUrl||"",supportEmail:site.supportEmail||config.contact?.supportEmail||"",whatsappNumber:site.whatsappNumber||config.contact?.whatsappNumber||""}}}
function renderContacts(config) {
  const locale = document.documentElement.lang === "bn" ? "bn" : "en";
  const coming = locale === "bn" ? "শিগগির যোগ হবে" : "Coming soon";
  const options = contactOptions(runtimeConfig(config), locale);
  $$('[data-contact-list]').forEach(list => {
    list.replaceChildren(...options.map(option => {
      const wrapper = document.createElement(option.enabled ? "a" : "div");
      wrapper.className = `public-contact-card${option.enabled ? "" : " is-disabled"}`;
      if (option.enabled) { wrapper.href = option.href; wrapper.setAttribute("aria-label", option.label); if (option.external) { wrapper.target = "_blank"; wrapper.rel = "noopener noreferrer"; } }
      else wrapper.setAttribute("aria-disabled", "true");
      wrapper.innerHTML = `<span class="public-contact-icon" aria-hidden="true">${iconText(option.id)}</span><span><strong>${option.label}</strong><small>${option.description}</small></span><em>${option.enabled ? "↗" : coming}</em>`;
      return wrapper;
    }));
  });
}
function protectedPublicPage(){return /\/(safety|privacy|terms|data-deletion|community-guidelines|cookie-policy|contact)\//.test(location.pathname)}
function renderPublicAds(){
  document.querySelectorAll('[data-mk-public-ad]').forEach(node=>node.remove());
  if(protectedPublicPage())return;
  const article=$('.public-article');
  if(article&&isAdSlotEnabled({placement:AD_PLACEMENTS.RESOURCE_IN_ARTICLE,slotId:'resource-in-article-1',context:'resource'})){
    const mount=document.createElement('div');mount.dataset.mkPublicAd='article';mount.style.margin='18px 0';
    const slot=createAdSlot({placement:AD_PLACEMENTS.RESOURCE_IN_ARTICLE,slotId:'resource-in-article-1',context:'resource',format:'responsive',className:'public-resource-ad'});
    if(slot){mount.appendChild(slot);const sections=article.querySelectorAll('.public-section');(sections[1]||sections[0])?.after(mount)}
  }
  const layout=$('.public-layout');
  if(layout&&isAdSlotEnabled({placement:AD_PLACEMENTS.RESOURCE_MULTIPLEX,slotId:'resource-multiplex-1',context:'resource'})){
    const mount=document.createElement('div');mount.dataset.mkPublicAd='multiplex';mount.style.gridColumn='1 / -1';mount.style.marginTop='18px';
    const slot=createAdSlot({placement:AD_PLACEMENTS.RESOURCE_MULTIPLEX,slotId:'resource-multiplex-1',context:'resource',format:'autorelaxed',className:'public-resource-ad'});
    if(slot){mount.appendChild(slot);layout.appendChild(mount)}
  }
}
function openCookieSettings() { const locale=document.documentElement.lang==="bn"?"bn":"en",current=getConsent(),dialog=$("#cookieDialog");if(!dialog)return;$("#analyticsConsent").checked=current.analytics;$("#adsConsent").checked=current.advertising;dialog.querySelector("h2").textContent=locale==="bn"?"কুকি পছন্দ":"Cookie choices";dialog.showModal();$("#analyticsConsent").focus(); }
function saveCookieSettings() { setConsent({analytics:$("#analyticsConsent")?.checked,advertising:$("#adsConsent")?.checked});$("#cookieDialog")?.close();renderPublicAds(); }
function updateTheme() { const next=document.documentElement.dataset.theme==="dark"?"light":"dark";document.documentElement.dataset.theme=next;store.set("public-theme",next); }
const savedTheme=store.getText("public-theme","");if(["light","dark"].includes(savedTheme))document.documentElement.dataset.theme=savedTheme;
Promise.all([loadSiteConfig(),runtimePromise]).then(([config])=>{renderContacts(config);renderPublicAds()});
subscribeAdminRuntime(async()=>{renderContacts(await loadSiteConfig());renderPublicAds()});
trackPage(location.href,document.body.dataset.pageType||"public");
document.addEventListener("click",event=>{const target=event.target.closest("[data-public-action]");if(!target)return;const action=target.dataset.publicAction;if(action==="theme")updateTheme();if(action==="cookie-settings")openCookieSettings();if(action==="save-cookie-settings")saveCookieSettings();if(action==="close-cookie-settings")$("#cookieDialog")?.close();if(target.matches("a"))trackEvent("public_link_open",{link_category:target.dataset.linkCategory||"internal"});});
