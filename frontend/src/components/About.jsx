import React from 'react';

export default function About() {
  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section style={{ background: 'var(--background)', padding: '8rem 0 6rem' }}>
        <div className="container">
          <h1 className="editorial-heading" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', fontWeight: 900, lineHeight: 0.9, textAlign: 'center', color: 'var(--text-main)', letterSpacing: '-0.04em', marginBottom: '4rem' }}>
            Bridging the Gap Between <span style={{ color: 'var(--primary)' }}>Compassion</span> and <span style={{ color: 'var(--primary)' }}>Survival</span>.
          </h1>
          <p style={{ textAlign: 'center', width: '100%', maxWidth: '800px', margin: '0 auto', fontSize: '1.5rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            ImpactBridge was born from a simple, urgent truth: healthcare is a human right, but its cost is often a death sentence. We exist to ensure that no life is lost simply because a payment couldn't be made in time.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '10rem' }}>
        {/* Our Story */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6rem', marginBottom: '10rem', alignItems: 'center' }}>
          <div style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/5', background: '#EEE' }}>
            <img src="https://images.unsplash.com/photo-1576091160550-217359f47bf4?auto=format&fit=crop&q=80&w=800" alt="Medical Care" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <span className="label-muted">Our Story</span>
            <h2 className="underline-accent" style={{ fontSize: '3rem', marginBottom: '2.5rem' }}>The Heart of the Bridge</h2>
            <p style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--text-main)', marginBottom: '2rem' }}>
              In many parts of Africa, hospitals require payment before life-saving procedures can begin. Families often find themselves in a desperate race against time, reaching out to friends and strangers on social media, only to face skepticism or slow processing times.
            </p>
            <p style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
              ImpactBridge is that missing link. We provide a verified, transparent, and instantaneous way to turn digital payments into hospital interventions. 
            </p>
          </div>
        </section>

        {/* Mission & Values */}
        <section style={{ background: 'var(--surface)', padding: '6rem', borderRadius: '4px', border: '1px solid var(--border)', marginBottom: '10rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 900 }}>Our Core Mission</h2>
            <div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '2rem auto' }}></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Direct Impact</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>We bypass middlemen. Funds go directly to verified medical institutions or for specific patient needs, ensuring zero leakage.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Speed Saves Lives</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>By leveraging Interswitch's robust payment rail, we ensure that verification is instant and funds are accessible when they matter most.</p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Absolute Integrity</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>Every beneficiary is vetted through a multi-point check involving medical reports, hospital staff confirmation, and valid ID.</p>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '3rem' }}>Be Part of the Bridge</h2>
          <button className="btn btn-primary btn-lg" style={{ minWidth: '300px' }}>Support a Cause Today</button>
        </section>
      </div>
    </div>
  );
}
