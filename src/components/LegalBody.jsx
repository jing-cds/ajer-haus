import React from 'react';

const UPDATED = '3 November 2026';
const ENTITY = '[Legal entity name]';
const ABN = '[ABN]';

const TERMS = {
  title: 'Terms of sale',
  lead: 'These terms cover buying from ajerhaus.com. They sit alongside your rights under the Australian Consumer Law, which we never limit.',
  sections: [
    ['Who we are', [`Ajer Haus is operated by ${ENTITY} (ABN ${ABN}), Melbourne, Victoria. Contact: hello@ajerhaus.com. We reply within 2–3 business days.`]],
    ['Orders and pre-orders', [
      'Prices are in Australian dollars and include GST where applicable. An order is accepted when we confirm it by email.',
      'Some candles are sold on pre-order. You pay when you order and we make your candle in the next batch. The estimated dispatch date is shown on the product page [dispatch date to be confirmed]. If that date moves we will email you, and if the delay is significant you can choose to wait or cancel for a full refund.',
    ]],
    ['Delivery and pickup', [
      'We deliver within Victoria only (postcodes 3000–3999) for $10.20, free on orders of $75 or more. Pickup in the Melbourne CBD is free; we will tell you the time and place by email.',
      'Delivery times are estimates. Risk in the goods passes to you on delivery or pickup.',
    ]],
    ['Returns, refunds and your consumer rights', [
      'Our goods come with guarantees that cannot be excluded under the Australian Consumer Law. You are entitled to a replacement or refund for a major failure and compensation for any other reasonably foreseeable loss or damage. You are also entitled to have goods repaired or replaced if they fail to be of acceptable quality and the failure does not amount to a major failure.',
      'If your candle arrives damaged, faulty or not as described, email us with a photo and we will fix it. Candles that have been burned are not returnable for change of mind. [Change-of-mind policy to be confirmed.]',
    ]],
    ['Using your candle safely', ['Follow the burn and care instructions on the tin and the product page. Never leave a burning candle unattended, keep it away from children, pets and flammable things, and burn it on a heatproof surface.']],
    ['Product information', ['We describe our candles as carefully as we can. Scent is personal, and colours on screen may differ slightly from the tin. If you have allergies or sensitivities, contact us before ordering.']],
    ['Intellectual property', ['The Ajer Haus name, logo, illustrations, photography and text belong to us or are used with permission. Please ask before using them.']],
    ['Liability', ['To the extent the law allows, our liability for goods that do not meet a consumer guarantee is limited to replacing or repairing them, or refunding the price. Nothing in these terms limits any right you have under the Australian Consumer Law.']],
    ['Privacy', ['How we handle your personal information is in our Privacy Policy.']],
    ['Governing law', ['These terms are governed by the laws of Victoria, Australia, and the courts of Victoria.']],
    ['Changes', ['We may update these terms. The terms that applied when you ordered continue to apply to that order.']],
  ],
};

const PRIVACY = {
  title: 'Privacy policy',
  lead: 'We keep this simple: we collect what we need to make and send your candle, and nothing more.',
  sections: [
    ['Who we are', [`${ENTITY} (ABN ${ABN}) trades as Ajer Haus. Questions about your information: hello@ajerhaus.com.`]],
    ['What we collect', [
      'Order details: your name, email, delivery address and postcode, and what you bought.',
      'Messages you send us through the contact form or by email.',
      'Your email address, if you ask to hear about Scent Stories or new places.',
      'Places you suggest on the Scent Map, and the email you give with them, if any.',
      'Basic technical data such as your browser type, collected by our host and any analytics we add [analytics tool to be confirmed].',
    ]],
    ['How we use it', [
      'To take and deliver your order, and to tell you about it.',
      'To reply to you.',
      'To send you news about Scent Stories and new places, but only if you asked. Every message has an unsubscribe link, and we stop when you ask.',
      'To meet our legal and tax obligations.',
    ]],
    ['Who we share it with', [
      'Only service providers who help us run the shop: payment processor [to be confirmed], courier [to be confirmed], website host [to be confirmed], email provider [to be confirmed], and Humanitix when you buy a ticket to an event there. They may only use your information to provide their service to us.',
      'We do not sell your information.',
      'Some providers store data outside Australia. We choose providers that protect it.',
    ]],
    ['Payments', ['Card details go straight to our payment provider. We never see or store them.']],
    ['Cookies and local storage', ['We keep your cart in your own browser (local storage) so it is still there when you come back. We do not use it to track you.']],
    ['Keeping it safe', ['We keep information only as long as we need it for the reasons above or the law requires, and take reasonable steps to protect it.']],
    ['Your choices', ['You can ask to see, correct or delete the personal information we hold about you, or to stop our emails, by writing to hello@ajerhaus.com. If you are unhappy with how we handle your information, tell us first. You can then contact the Office of the Australian Information Commissioner (oaic.gov.au).']],
    ['Updates', ['We may update this policy and will change the date below when we do.']],
  ],
};

export default function LegalBody({ doc }) {
  const d = doc === 'privacy' ? PRIVACY : TERMS;
  const other = doc === 'privacy' ? ['/terms', 'Terms of sale'] : ['/privacy', 'Privacy policy'];
  return (
    <main className="gfMain lgMain">
      <div className="wrap">
        <nav className="crumb" aria-label="Breadcrumb"><a href="/">Home</a>{' / '}<span aria-current="page">{d.title}</span></nav>
        <h1 className="gfH">{d.title}</h1>
        <p className="gfLead">{d.lead}</p>
        <p className="lgMeta">Last updated {UPDATED}. Draft: details in [brackets] are still to be confirmed.</p>
        <div className="lgBody">
          {d.sections.map(([h, ps], i) => (
            <section key={h}>
              <h2>{i + 1}. {h}</h2>
              {ps.length > 1 && ps.every((p) => p.length < 200) && doc === 'privacy' && h !== 'Who we are' && h !== 'Payments' && h !== 'Cookies and local storage' && h !== 'Keeping it safe' && h !== 'Your choices' && h !== 'Updates'
                ? <ul>{ps.map((p) => <li key={p}>{p}</li>)}</ul>
                : ps.map((p) => <p key={p}>{p}</p>)}
            </section>
          ))}
        </div>
        <p className="gfNote">See also: <a className="tlink" href={other[0]}>{other[1]}</a> · <a className="tlink" href="/delivery">Delivery, pickup &amp; returns</a></p>
      </div>
    </main>
  );
}
