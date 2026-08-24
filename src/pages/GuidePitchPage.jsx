import React from "react";
import { useNavigate } from "react-router-dom";
import { Seo } from "../app/seo";
import { absUrl } from "../app/siteUrl";
import {
  calculateDistributionMetrics,
  DISTRIBUTION_CHANNELS,
  DISTRIBUTION_TARGETS,
  getAccommodationDistributionRecords,
} from "../features/print-guide/distributionData";
import { GuideToolbar, PAGE_FORMATS } from "./PrintGuidePage";
import "../styles/print-guide.css";
import "../styles/guide-pitch.css";

export const GUIDE_PITCH_PATH = "/guide-pitch";

const JOURNEY = [
  ["Arrive", "Airport transfers · Drivers"],
  ["Stay", "Hotels · Boutique hotels · Villas · Airbnbs"],
  ["Eat", "Restaurants · Cafes · Bars · Beach clubs"],
  ["Surf", "Surf schools · Board rentals · Beach venues"],
  ["Wellness", "Spas · Gyms · Yoga · Studios"],
  ["Shop", "Independent shops · Local brands"],
  ["Explore", "Experiences · Coworking · Events"],
];

const PLACEMENTS = [
  ["In-room", "Placed directly inside hotel and villa rooms."],
  ["Check-in", "Presented or made available when guests arrive."],
  ["Tabletop", "Restaurants, cafes, coworking spaces and hospitality venues."],
  ["Take one", "High-footfall surf, wellness, retail and experience locations."],
  ["Direct", "Events, concierge desks, drivers and airport transfers."],
];

const ALLOCATION_GROUPS = [
  ["Hotels", 5000],
  ["Boutique hotels", 3000],
  ["Villas / Airbnbs", 2500],
  ["Restaurants & cafes", 4000],
  ["Surf / wellness / retail / coworking / transfers", 4000],
  ["Reserve", 1500],
];

function PitchLabel({ children }) {
  return <span className="gp-label">{children}</span>;
}

function PitchHeader({ navigate, metrics }) {
  return (
    <header className="pg-workspace-header gp-workspace-header">
      <section className="pg-dashboard" aria-label="Guide commercial summary">
        <div className="pg-dashboard-title">
          <span>Ahangama Guide</span>
          <strong>2026/27</strong>
          <em>{PAGE_FORMATS.A5.label} · South Coast edition</em>
        </div>
        <div className="pg-dashboard-counts">
          <div><span>Annual copies</span><strong>{metrics.annualCirculation.toLocaleString()}</strong></div>
          <div><span>Distribution</span><strong>{DISTRIBUTION_TARGETS.minimumDistributionPoints}+</strong></div>
          <div><span>Rooms targeted</span><strong>{DISTRIBUTION_TARGETS.accommodationRooms.toLocaleString()}+</strong></div>
          <div><span>Circulation</span><strong>12 mo.</strong></div>
        </div>
        <div className="pg-dashboard-revenue">
          <div><span>Partnerships</span><strong>$500–$2,500</strong></div>
          <div><span>Full page</span><strong>$1,000</strong></div>
          <div><span>Printed-copy cost</span><strong>$0.05</strong></div>
        </div>
      </section>
      <GuideToolbar
        view="pitch"
        onViewChange={(view) => navigate(view === "pitch" ? GUIDE_PITCH_PATH : `/print-guide?view=${view}`)}
        navigationOnly
      />
    </header>
  );
}

export default function GuidePitchPage() {
  const navigate = useNavigate();
  const number = new Intl.NumberFormat("en-US");
  const metrics = calculateDistributionMetrics();
  const records = getAccommodationDistributionRecords();
  const confirmedPercent = metrics.annualCopiesAllocated
    ? (metrics.confirmedCopies / metrics.annualCopiesAllocated) * 100
    : 0;

  return (
    <main className="pg-workspace gp-page">
      <Seo
        title="Ahangama Guide 2026/27 Commercial Media Kit"
        description="The commercial case, circulation and distribution methodology for the Ahangama Guide 2026/27."
        canonical={absUrl(GUIDE_PITCH_PATH)}
        noindex
      />
      <PitchHeader navigate={navigate} metrics={metrics} />

      <section className="gp-hero">
        <PitchLabel>The commercial case</PitchLabel>
        <h1>20,000 copies.<br />Where Ahangama&apos;s visitors spend their time.</h1>
        <p>The Ahangama Guide is distributed free throughout the South Coast&apos;s accommodation, hospitality, surf, wellness, retail and experience network — putting participating brands in front of visitors while they are deciding where to stay, eat, shop and what to do.</p>
        <div className="gp-hero-metrics">
          <article><strong>{number.format(metrics.annualCirculation)}</strong><span>Annual copies</span></article>
          <article><strong>{DISTRIBUTION_TARGETS.minimumDistributionPoints}+</strong><span>Distribution points</span></article>
          <article><strong>{number.format(DISTRIBUTION_TARGETS.accommodationRooms)}+</strong><span>Accommodation rooms</span></article>
          <article><strong>{DISTRIBUTION_TARGETS.circulationMonths} months</strong><span>Of circulation</span></article>
        </div>
        <small>Free · Year-round · High-intent visitors · 2026/27 edition</small>
      </section>

      <section className="gp-section gp-journey-section">
        <PitchLabel>Repeated exposure</PitchLabel>
        <h2>We follow the visitor through Ahangama</h2>
        <div className="gp-journey">
          {JOURNEY.map(([stage, detail], index) => <article key={stage}><div><b>{String(index + 1).padStart(2, "0")}</b><strong>{stage}</strong></div><p>{detail}</p></article>)}
        </div>
        <p className="gp-section-note">Unlike a single advertising impression, the guide can encounter the same visitor repeatedly throughout their stay.</p>
      </section>

      <section className="gp-section">
        <PitchLabel>20,000-copy annual circulation</PitchLabel>
        <h2>Where visitors find us</h2>
        <div className="gp-allocation-bar" aria-label="Annual copy allocation">
          {ALLOCATION_GROUPS.map(([label, copies], index) => <div key={label} className={`is-${index + 1}`} style={{ width: `${(copies / metrics.annualCirculation) * 100}%` }}><span>{label}</span><strong>{number.format(copies)}</strong></div>)}
        </div>
        <div className="gp-allocation-key">
          {ALLOCATION_GROUPS.map(([label, copies], index) => <p key={label}><i className={`is-${index + 1}`} /><span>{label}</span><strong>{number.format(copies)}</strong></p>)}
        </div>
        <div className="gp-table-wrap">
          <table className="gp-table">
            <thead><tr><th>Channel</th><th>Partners</th><th>Rooms / units</th><th>Copies / year</th><th>Estimated audience</th></tr></thead>
            <tbody>
              {DISTRIBUTION_CHANNELS.map((channel) => <tr key={channel.channel}><td>{channel.channel}</td><td>{channel.partners}</td><td>{channel.unitsLabel}</td><td>{number.format(channel.copies)}</td><td>{number.format(channel.audience)}</td></tr>)}
              <tr className="is-total"><td>Total network</td><td>{metrics.distributionPoints}</td><td>{number.format(metrics.roomsReached)}+</td><td>{number.format(metrics.annualCopiesAllocated)}</td><td>{number.format(metrics.estimatedAnnualGuests)}+</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="gp-section gp-accommodation">
        <PitchLabel>Where visitors stay</PitchLabel>
        <h2>Inside Ahangama&apos;s accommodation network</h2>
        <div className="gp-accommodation-metrics">
          <article><strong>{number.format(DISTRIBUTION_TARGETS.accommodationRooms)}+</strong><span>Rooms targeted</span></article>
          <article><strong>{number.format(metrics.mappedRooms)}</strong><span>Rooms already mapped</span></article>
          <article><strong>~{number.format(metrics.mappedAnnualGuests)}</strong><span>Estimated annual guests<br />from currently mapped properties</span></article>
        </div>
        <div className="gp-property-list">
          {records.map((record) => <article key={record.property}><strong>{record.property}</strong><span>{record.rooms} rooms</span><small>Distribution status: {record.status}</small></article>)}
        </div>
        <p className="gp-disclosure">Properties shown are mapped distribution targets. They are not presented as confirmed partners unless their status is marked confirmed.</p>
      </section>

      <section className="gp-section">
        <PitchLabel>Placement strategy</PitchLabel>
        <h2>Not just stacked on a counter.</h2>
        <div className="gp-placement-grid">{PLACEMENTS.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className="gp-section gp-status-section">
        <PitchLabel>Live distribution</PitchLabel>
        <h2>Building the network</h2>
        <div className="gp-status-grid">
          <article><span>Confirmed</span><strong>{metrics.confirmedDistributionPoints}</strong><small>Distribution points</small><p>{number.format(metrics.confirmedRooms)} confirmed rooms · {number.format(metrics.confirmedCopies)} annual copies</p></article>
          <article><span>In discussion</span><strong>{metrics.discussionDistributionPoints}</strong><small>Distribution points</small><p>{number.format(metrics.discussionCopies)} annual copies currently recorded</p></article>
          <article><span>Target</span><strong>{metrics.distributionPoints}</strong><small>Distribution points</small><p>{number.format(metrics.annualCopiesAllocated)} planned network copies</p></article>
        </div>
        <div className="gp-progress"><div><span>Network copies secured</span><strong>{number.format(metrics.confirmedCopies)} / {number.format(metrics.annualCopiesAllocated)}</strong></div><i><b style={{ width: `${confirmedPercent}%` }} /></i><small>Confirmation statuses have not yet been populated. The {number.format(metrics.reserveCopies)} reserve copies remain separate.</small></div>
      </section>

      <section className="gp-commercial-case">
        <PitchLabel>The commercial case</PitchLabel>
        <h2>Reach visitors when they&apos;re deciding what to do next.</h2>
        <p>The guide sits within the visitor journey — in the places where people sleep, eat, surf, shop, work and spend their time.</p>
        <div><article><strong>Targeted</strong><span>Visitors already in Ahangama and the South Coast.</span></article><article><strong>Contextual</strong><span>Brands appear alongside trusted editorial recommendations.</span></article><article><strong>Year-round</strong><span>One partnership provides presence throughout the 2026/27 edition.</span></article></div>
      </section>

      <section className="gp-offer">
        <div><PitchLabel>Full-page partnership</PitchLabel><h2>A full page.<br />A full year.<br />$1,000.</h2><button type="button" onClick={() => navigate("/print-guide?view=commercial")}>View all commercial opportunities →</button></div>
        <div className="gp-offer-details"><strong>$1,000</strong><ul><li>20,000-copy annual edition</li><li>200+ targeted distribution locations</li><li>1,500+ accommodation rooms targeted</li><li>12 months circulation</li><li>Presence while visitors are choosing where to stay, eat, shop and what to do</li><li>Supporting presence on Ahangama.com</li></ul></div>
        <aside><strong>$0.05</strong><span>Per printed copy</span><small>Based on $1,000 divided by the planned 20,000-copy annual circulation.</small></aside>
      </section>

      <section className="gp-section gp-digital">
        <PitchLabel>Beyond print</PitchLabel>
        <h2>Print is only the beginning.</h2>
        <div><span>Ahangama.com</span><strong>{number.format(metrics.digitalReaders)}+</strong><small>Projected annual digital guide readers</small></div>
        <p>Participating venues can also be discovered through the Ahangama.com ecosystem. Digital readership and physical circulation are reported separately because audience duplication has not been measured.</p>
      </section>

      <section className="gp-section gp-methodology">
        <PitchLabel>Detail & methodology</PitchLabel>
        <h2>Distribution detail</h2>
        <details>
          <summary>View the circulation audit and accommodation assumptions</summary>
          <div className="gp-methodology-note"><span>Target</span> Planned distribution · <span>Estimate</span> Modelled reach · <span>Confirmed</span> Contracted distribution only</div>
          <div className="gp-table-wrap"><table className="gp-table"><thead><tr><th>Channel</th><th>Status</th><th>Partners</th><th>Rooms / units</th><th>Copies</th><th>Est. audience</th></tr></thead><tbody>{DISTRIBUTION_CHANNELS.map((channel) => <tr key={channel.channel}><td>{channel.channel}</td><td><b className={`gp-status is-${channel.status}`}>{channel.status}</b></td><td>{channel.partners}</td><td>{channel.unitsLabel}</td><td>{number.format(channel.copies)}</td><td>{number.format(channel.audience)}</td></tr>)}</tbody></table></div>
          <h3>Accommodation reach assumptions</h3>
          <p className="gp-formula">Estimated annual guests = rooms × occupancy × 365 ÷ average stay × 2 guests per occupied room</p>
          <div className="gp-table-wrap"><table className="gp-table"><thead><tr><th>Property</th><th>Status</th><th>Rooms</th><th>Occupancy</th><th>Avg. stay</th><th>Est. annual guests</th><th>Copies</th></tr></thead><tbody>{records.map((record) => <tr key={record.property}><td>{record.property}</td><td><b className={`gp-status is-${record.status}`}>{record.status}</b></td><td>{record.rooms}</td><td>{record.occupancy}%</td><td>{record.averageStay} nights</td><td>~{number.format(record.annualGuests)}</td><td>{number.format(record.copies)}</td></tr>)}</tbody></table></div>
          <div className="gp-reserve"><strong>{number.format(metrics.reserveCopies)} reserve copies</strong><span>Events · Launches · Replacement stock · Direct distribution</span></div>
        </details>
      </section>
    </main>
  );
}
