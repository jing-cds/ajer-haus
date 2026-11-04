import React, { useState } from 'react';
import { FORMATS, UPCOMING, SHOW_PREVIEW, PREVIEW } from '../data/events.js';

const Card = ({ e, preview = false }) => (
  <article className={'evCard' + (preview ? ' preview' : '')}>
    <div className="evDate" aria-hidden="true"><span>{e.month}</span><strong>{e.day}</strong></div>
    <div className="evMain">
      <div className="evType">{e.type === 'workshop' ? 'Candle-making workshop' : 'Scent Story'}{preview && ' · layout preview'}</div>
      <h3>{e.name}</h3>
      <p>{e.line}</p>
      <dl className="evMeta">
        <div><dt>When</dt><dd>{e.time}</dd></div>
        <div><dt>Where</dt><dd>{e.where}</dd></div>
        <div><dt>Spots</dt><dd>{e.spots}</dd></div>
        <div><dt>Price</dt><dd>{e.price}</dd></div>
      </dl>
    </div>
    <div className="evAct">
      {preview ? <span className="btn evBtn off" aria-disabled="true">Book a spot</span> : <a className="btn" href={e.url}>Book a spot</a>}
    </div>
  </article>
);

export default function EventFormats() {
  const [done, setDone] = useState(false);
  return (
    <>
      <section id="formats" className="evSec">
        <div className="wrap">
          <div className="eyebrow">Ways to join</div>
          <h2 className="psH">Two kinds of evening.</h2>
          <div className="evFormats">
            {FORMATS.map((f) => (
              <article className="evFormat" key={f.id} id={f.id}>
                <div className="evFHead"><h3>{f.name}</h3><span className={'evChip' + (f.id === 'workshops' ? ' plan' : '')}>{f.status}</span></div>
                <p className="evLine">{f.line}</p>
                <p>{f.body}</p>
                <dl className="evFacts">{f.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd className={v.includes('[') ? 'tbc' : ''}>{v}</dd></div>)}</dl>
                {f.cta && <a className="tlink" href={f.cta.href}>{f.cta.label} →</a>}
                {f.form && (done ? (
                  <p className="smThanks" role="status">Thank you. We will write when workshops are announced.</p>
                ) : (
                  <form className="stForm" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
                    <label htmlFor="wsEmail" className="sr">Email address</label>
                    <input id="wsEmail" type="email" required placeholder="Email address" autoComplete="email" />
                    <button className="btn" type="submit">Tell me when workshops open</button>
                  </form>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="upcoming" className="evSec evUp">
        <div className="wrap">
          <div className="eyebrow">Upcoming</div>
          <h2 className="psH">What is on.</h2>
          {UPCOMING.length ? (
            <div className="evList">{UPCOMING.map((e) => <Card key={e.name + e.day} e={e} />)}</div>
          ) : (
            <p className="evEmpty"><strong>Nothing on sale right now.</strong> New Scent Stories and workshops are announced here first, then on Instagram and TikTok.</p>
          )}
          {SHOW_PREVIEW && !UPCOMING.length && (
            <div className="evPrevWrap">
              <p className="evPrevNote">How an upcoming event will look (placeholder details)</p>
              <Card e={PREVIEW} preview />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
