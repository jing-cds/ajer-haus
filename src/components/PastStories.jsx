import React from 'react';
import { PAST_EVENTS, STORY, GALLERY, SOCIAL } from '../data/events.js';
import { PLACES } from '../data/places.js';

export default function PastStories() {
  return (
    <section id="past" className="psSec">
      <div className="wrap">
        <div className="eyebrow">Past stories · {STORY.book}</div>
        <h2 className="psH">{STORY.title}</h2>
        <p className="psMeta">{STORY.when} · {STORY.where}</p>
        <p className="psIntro">{STORY.intro}</p>
        <ul className="psFacts">{STORY.facts.map((f) => <li key={f}>{f}</li>)}</ul>

        <div className="psList">
          {PAST_EVENTS.map((e) => (
            <article className="psCard" key={e.id}>
              <img className="psPoster" src={e.poster} alt={e.alt} width="480" height="679" loading="lazy" />
              <div className="psBody">
                <div className="eyebrow">Chapter · {e.time}</div>
                <h3>{e.name}</h3>
                <p className="psLine">{e.tag}</p>
                <p>{e.body}</p>
              </div>
            </article>
          ))}
        </div>

        {PLACES.find((p) => p.id === STORY.candle) && (
          <a className="psCandle" href="/collection">
            <span className="psCandleDot" style={{ background: PLACES.find((p) => p.id === STORY.candle).bg }} />
            <span><em>The candle from this story</em><strong>{PLACES.find((p) => p.id === STORY.candle).name}</strong></span>
            <span aria-hidden="true">→</span>
          </a>
        )}
        <a className="tlink" href={STORY.url} target="_blank" rel="noopener noreferrer">View the original ticket page →</a>
        <div className="psGal">
          <div className="eyebrow">From the night</div>
          {GALLERY.length ? (
            <ul className="psPics">
              {GALLERY.map((g) => <li key={g.src}><img src={g.src} alt={g.alt} loading="lazy" /></li>)}
            </ul>
          ) : (
            <p className="psSocial">Photos from the night are on <a className="tlink" href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer">Instagram</a> and <a className="tlink" href={SOCIAL.tiktok} target="_blank" rel="noopener noreferrer">TikTok</a>.</p>
          )}
        </div>
      </div>
    </section>
  );
}
