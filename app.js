/* صوب العقارية - ربط التصميم الأصلي ببيانات قابلة للتعديل من Pages CMS.
   استضافة Cloudflare Pages + GitHub. لا يحتوي الموقع على لوحة دخول مكشوفة أو كلمة مرور في المتصفح. */
(()=>{'use strict';
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
const text=(node,value)=>{if(node&&value!==undefined&&value!==null)node.textContent=String(value);};
const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)text(n,txt);return n;};
const digits=s=>String(s||'').replace(/[^0-9]/g,'');
const validWhats=s=>/^\d{9,15}$/.test(digits(s));
const safeImage=s=> typeof s==='string' && (s.startsWith('/media/')|| /^https:\/\/[^\s]+$/i.test(s)) ? s : '';
function updateLinks(contact,hero){
  const wa=digits(contact.whatsapp_number),ph=digits(contact.phone_number);
  const waUrl=validWhats(wa)?'https://wa.me/'+wa+'?text='+encodeURIComponent(hero.button_message||'السلام عليكم، أرغب بالتواصل مع صوب العقارية.') :'';
  // If no verified number, avoid exposing the unconfirmed one left in the uploaded HTML.
  const waLinks=$$('a[href*="wa.me"]');
  waLinks.forEach(a=>{a.removeAttribute('target');a.removeAttribute('rel');
    a.href=waUrl||'#contact';
    if(waUrl){a.target='_blank';a.rel='noopener noreferrer';}
  });
  const cCards=$$('#contact .g.ch>.box');
  if(cCards[0]){const a=$('a',cCards[0]),n=$('b',a),p=$('p',a);text(n,wa?('+'+wa):'يُضاف لاحقًا');text(p,contact.whatsapp_description);a.href=waUrl||'#contact';}
  if(cCards[1]){const a=$('a',cCards[1]),n=$('b',a),p=$('p',a);text(n,ph?('+'+ph):'يُضاف لاحقًا');text(p,contact.phone_description);a.href=ph?'tel:+'+ph:'#contact';}
  if(cCards[2]){const a=$('a',cCards[2]),n=$('b',a),p=$('p',a);text(n,contact.email||'يُضاف لاحقًا');text(p,contact.email_description);a.href=contact.email&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)?'mailto:'+contact.email:'#contact';}
  const actions=$$('.hero .cta a');
  if(actions[0]){actions[0].href=waUrl||'#contact';actions[0].removeAttribute('target');actions[0].removeAttribute('rel');if(waUrl){actions[0].target='_blank';actions[0].rel='noopener noreferrer';}}
  if(actions[1])actions[1].href=ph?'tel:+'+ph:'#contact';
  const floating=$('a.fab');if(floating){floating.href=waUrl||'#contact';floating.removeAttribute('target');floating.removeAttribute('rel');if(waUrl){floating.target='_blank';floating.rel='noopener noreferrer';}}
  const form=$('#contact .form');if(form)form.classList.toggle('is-hidden',contact.form_visible===false);
  const select=$('#fs');if(select){select.replaceChildren();(contact.form_services||[]).forEach(item=>{if(typeof item==='string'&&item.trim()){const opt=el('option',null,item);select.append(opt);}})}
  const send=$('#send');if(send){send.onclick=()=>{if(!validWhats(wa)){alert('لم تتم إضافة رقم واتساب الأعمال بعد. يرجى تحديثه من لوحة إدارة الموقع.');return;}
    const name=($('#fn')?.value||'').trim(),service=select?.value||'',msg=($('#fm')?.value||'').trim();
    const payload='السلام عليكم، أنا '+(name||'عميل جديد')+'.\nالخدمة المطلوبة: '+service+(msg?'\nالتفاصيل: '+msg:'');
    window.open('https://wa.me/'+wa+'?text='+encodeURIComponent(payload),'_blank','noopener,noreferrer');};}
}
function updateHero(d){const root=$('.hero');if(!root)return;
  text($('small',root),d.eyebrow);text($('h1',root),d.heading);text($('p',root),d.description);
  const links=$$('.cta a',root);text(links[0],d.button_text||'تواصل عبر واتساب');text(links[1],d.second_button_text||'اتصل بنا');
  if(links[0] && !links[0].querySelector('svg')){const icon=document.createElementNS('http://www.w3.org/2000/svg','svg');const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href','#wa');icon.appendChild(use);links[0].prepend(icon);}
  const image=safeImage(d.background_image);root.style.background=image?'linear-gradient(160deg,rgba(24,61,50,.84),rgba(15,42,34,.8)),url("'+image.replaceAll('"','%22')+'") center/cover':'linear-gradient(160deg,var(--hero1),var(--hero2))';
}
function updateAbout(d){const root=$('#about');if(!root)return;root.hidden=d.visible===false;
  text($('h2',root),d.heading);const p=$$('div.wrap.about > div:first-child > p',root);text(p[0],d.paragraph1);text(p[1],d.paragraph2);
  const list=$('#value-cards');if(!list)return;list.replaceChildren();(d.values||[]).forEach(item=>{
    const block=el('div');block.append(el('b',null,item.title||''),document.createElement('br'),document.createTextNode(item.description||''));list.append(block);
  });
}
function updateServices(d){const root=$('#services');if(!root)return;root.hidden=d.visible===false;
  text($('h2',root),d.heading);text($('p.sub',root),d.subtitle);
  const list=$('#service-cards');if(!list)return;list.replaceChildren();(d.cards||[]).forEach((item,index)=>{
    const box=el('div','box');box.append(el('div','num',String(index+1)),el('h3',null,item.title||''),el('p',null,item.description||''));list.append(box);
  });
}
function updateExtras(sections){const parent=$('#custom-sections');if(!parent)return;parent.replaceChildren();
  (sections||[]).forEach((item,index)=>{if(item.visible===false)return;
    const sec=el('section','owner-section');sec.id='added-section-'+(index+1);
    const wrap=el('div','wrap');wrap.append(el('h2',null,item.title||''),el('p','sub',item.subtitle||''));
    const grid=el('div','g');(item.cards||[]).forEach(card=>{
      const box=el('div','box'),image=safeImage(card.image);
      if(image){const img=el('img');img.src=image;img.alt=card.title||'';img.loading='lazy';box.append(img);}
      box.append(el('h3',null,card.title||''),el('p',null,card.description||''));grid.append(box);
    });wrap.append(grid);sec.append(wrap);parent.append(sec);
  });
}
function updateContact(d){const root=$('#contact');if(!root)return;root.hidden=d.visible===false;
  text($('h2',root),d.heading);text($('p.sub',root),d.subtitle);text($('#contact .form h3'),d.form_heading);
}
function updateFooter(d){
 // بيانات المنشأة من Pages CMS: نعرض كل سطر مرة واحدة دون إدراج HTML من المستخدم.
 const legalBox=$('footer .footer-legal');
 if(!legalBox || typeof d?.legal!=='string')return;
 const lines=d.legal.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
 legalBox.replaceChildren();
 lines.forEach((line,index)=>{
   if(index===0){legalBox.append(el('div','footer-legal-name',line));return;}
   const parts=line.match(/^([^:：]+)[:：]\s*(.+)$/);
   if(!parts){legalBox.append(el('div','footer-legal-note',line));return;}
   const row=el('div','footer-legal-row');
   let label=parts[1].trim();
   if(label==='س.ت' || label==='س.ت.' || label==='السجل التجاري')label='السجل التجاري (س.ت)';
   row.append(el('span','footer-legal-label',label));
   const value=el('bdi','footer-legal-value',parts[2].trim());
   value.setAttribute('dir','ltr');
   row.append(value);legalBox.append(row);
 });
}
async function load(){try{const res=await fetch('/data/site.json',{cache:'no-store'});
 if(!res.ok)throw Error('تعذر تحميل إعدادات الموقع');
 const d=await res.json();document.title=d.site_title?d.site_title+' | SOUB REAL ESTATE':document.title;
 const desc=$('meta[name="description"]');if(desc)desc.content=d.site_description||'';
 if(d.hero)updateHero(d.hero);if(d.about)updateAbout(d.about);if(d.services)updateServices(d.services);
 updateExtras(d.extra_sections);if(d.contact){updateContact(d.contact);updateLinks(d.contact,d.hero||{});}updateFooter(d.footer);
 }catch(error){console.warn('تعذر تحميل بيانات الموقع. يظهر التصميم الأساسي.',error);
 // Prevent missing config from sending messages to unverified hardcoded numbers.
 $$('a[href*="wa.me"],a[href^="tel:"]').forEach(a=>{a.href='#contact';a.removeAttribute('target');});
 const send=$('#send');if(send)send.onclick=()=>alert('تعذر تحميل إعدادات التواصل. يرجى المحاولة لاحقًا.');
 }}
load();
})();
