import React from 'react';

export default function Transparency() {
  const steps = [
    { title: 'Identity Check', desc: 'Beneficiaries must provide government-issued identification verified against national databases.' },
    { title: 'Medical Audit', desc: 'Official medical reports from recognized health institutions are reviewed by our internal team.' },
    { title: 'Hospital Liaison', desc: 'Direct contact with hospital billing departments to confirm necessary funds and treatment plans.' }
  ];

  return (
    <div className="fade-in">
      <section style={{ background: 'var(--background)', padding: '8rem 0 6rem' }}>
        <div className="container">
          <span className="label-muted" style={{ display: 'block', textAlign: 'center', marginBottom: '1.5rem' }}>Radical Accountability</span>
          <h1 className="editorial-heading" style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', fontWeight: 900, lineHeight: 0.9, textAlign: 'center', color: 'var(--text-main)', letterSpacing: '-0.04em', marginBottom: '4rem' }}>
            A Platform Built on <span style={{ color: 'var(--primary)' }}>Trust</span>.
          </h1>
          <p style={{ textAlign: 'center', width: '100%', maxWidth: '800px', margin: '0 auto', fontSize: '1.5rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            We believe that transparency isn't just a feature—it's the foundation of healthcare crowdfunding. We've redesigned our model to ensure maximum accountability at every step.
          </p>
        </div>
      </section>

      <div className="container" style={{ paddingBottom: '10rem' }}>
        {/* Verification Shield */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '6rem', marginBottom: '10rem', alignItems: 'center' }}>
          <div>
            <h2 className="underline-accent" style={{ fontSize: '2.5rem', marginBottom: '2.5rem' }}>The 3-Step Verification Shield</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '3rem', lineHeight: 1.8 }}>
              To protect donor generosity, we maintain a rigorous onboarding process for every beneficiary. No campaign goes live without passing our Shield protocols.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {steps.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.5rem' }}>
                  <div style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 800, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>{s.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: '4rem', background: '#F9F9F9', border: '1px solid var(--border)', borderRadius: '4px', textAlign: 'center' }}>
            <div className="stat-value" style={{ color: 'var(--primary)', fontSize: '5rem', marginBottom: '1rem' }}>0%</div>
            <div style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '1.5rem' }}>Platform Fees for Donors</div>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
              We do not take a cut from your donation. 100% of your contribution (minus unavoidable payment processor fees) goes directly toward the medical medical goals.
            </p>
          </div>
        </section>

        {/* Fund Flow */}
        <section style={{ textAlign: 'center', borderTop: '1px solid var(--border)', paddingTop: '8rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '4rem' }}>How the Funds Flow</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', alignItems: 'center' }}>
            <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '8px', minWidth: '200px' }}>Your Donation</div>
            <div style={{ fontSize: '2rem' }}>→</div>
            <div style={{ padding: '2rem', border: '1px solid var(--primary)', borderRadius: '8px', minWidth: '240px', color: 'var(--primary)', fontWeight: 800 }}>ImpactBridge Verified Escrow</div>
            <div style={{ fontSize: '2rem' }}>→</div>
            <div style={{ padding: '2rem', border: '1px solid var(--border)', borderRadius: '8px', minWidth: '200px' }}>Verified Hospital/Case</div>
          </div>
          <p style={{ marginTop: '4rem', maxWidth: '700px', margin: '4rem auto 0', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Our integration with Interswitch allows for real-time tracking of transaction status, providing donors with immediate digital receipts and peace of mind.
          </p>
        </section>
      </div>
    </div>
  );
}
