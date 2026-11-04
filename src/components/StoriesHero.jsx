import React, { useState } from 'react';
import { NEXT_EVENT, PAST_EVENTS, SOCIAL } from '../data/events.js';

/* The diagonal "Scent Stories" band. No live events yet, so it says so and
   invites people to hear first. Used on Home (compact) and Events (full). */
export default function StoriesHero({ page = false }) {
  const [done, setDone] = useState(false);
  return (
    <section
      id="stories"
      style={{
        position: 'relative',
        background: 'linear-gradient(165deg, #C9DEEC 0%, #CFE6DC 50%, #FFFFFF 100%)',
        clipPath: page ? 'polygon(0 0, 100% 0, 100% calc(100% - 44px), 0 100%)' : 'polygon(0 44px, 100% 0, 100% calc(100% - 44px), 0 100%)',
        margin: 0,
      }}
    >
      {page && (
        <div className="wrap stCrumb">
          <nav className="crumb" aria-label="Breadcrumb"><a href="/">Home</a>{' / '}<span aria-current="page">Events</span></nav>
        </div>
      )}
      <div className="stWrap">
        <div className="stCopy">
          <div className="eyebrow">Events</div>
          {page ? <h1 className="stH">Scent Stories</h1> : <h2 className="stH">Scent Stories</h2>}
          <p className="stLead">Evenings where a place, a memory and a scent meet in the room.</p>
          {NEXT_EVENT ? (
            <a className="btn" href={NEXT_EVENT.url}>Get tickets</a>
          ) : (
            <>
              <p className="stNone"><strong>No Scent Story is on right now.</strong> The next one will be announced here first.</p>
              {done ? (
                <p className="smThanks" role="status">Thank you. We will write when the next one is announced.</p>
              ) : (
                <form className="stForm" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
                  <label htmlFor={page ? 'stEmailP' : 'stEmail'} className="sr">Email address</label>
                  <input id={page ? 'stEmailP' : 'stEmail'} type="email" required placeholder="Email address" autoComplete="email" />
                  <button className="btn" type="submit">Tell me first</button>
                </form>
              )}
              <p className="stSocial">
                Or follow along: <a className="tlink" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
                {' · '}<a className="tlink" href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>
                {!page && <>{' · '}<a className="tlink" href="/events#past">See past stories</a></>}
              </p>
            </>
          )}
        </div>
        <a className="stPast" href="/events#past" aria-label="Past story: Scent Story, The Place, Sunday 20 September 2026">
          {PAST_EVENTS.map((e, i) => (
            <img key={e.id} className={'stImg i' + i} src={e.poster} alt={e.alt} width="300" height="424" loading="lazy" />
          ))}
          <span className="stTag">Past story</span>
        </a>
      </div>
    </section>
  );
}
