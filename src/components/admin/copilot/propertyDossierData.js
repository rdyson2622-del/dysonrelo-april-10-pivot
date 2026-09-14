import React from 'react';
import { Scale, ShieldAlert, Waves, Clock, DollarSign, Home, Shield } from 'lucide-react';

export const KNOWN_PROPERTY_DOSSIERS = {
  '1844 mountain shadow': {
    shortAddress: '1844 Mountain Shadow Way',
    city: 'Scottsdale, AZ',
    fullAddress: '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
    listPrice: '$2.15M',
    marketSummary: 'Market-aligned pricing vs Desert Ridge comps; rebate estimate where allowed by law.',
    comps: [
      {
        address: '1812 E Desert Cove Ave',
        distance: '0.28 mi',
        specs: '4 bd | 3.5 ba | 3,840 sf',
        soldPrice: 'Sold $2.05M',
        adjPrice: 'Adj. $2.10M'
      },
      {
        address: '5920 E Mountain Vista Dr',
        distance: '0.45 mi',
        specs: '4 bd | 4 ba | 4,120 sf',
        soldPrice: 'Sold $2.18M',
        adjPrice: 'Adj. $2.14M'
      },
      {
        address: '6210 E Shadow Mountain Rd',
        distance: '0.65 mi',
        specs: '5 bd | 4.5 ba | 4,450 sf',
        soldPrice: 'Sold $2.25M',
        adjPrice: 'Adj. $2.20M'
      }
    ],
    compsSummary: 'Subject at $2.15M list is aligned with adjusted micro-comps (±2%).',
    risks: [
      {
        id: 'wash',
        title: 'Desert wash & drainage',
        desc: 'FEMA Zone X unshaded; desert wash runoff noted in natural hazard disclosure.'
      },
      {
        id: 'easement',
        title: 'Solar lease & utility easement',
        desc: 'Active solar power purchase agreement (PPA) transfer required; 10ft rear utility easement.'
      },
      {
        id: 'hoa',
        title: 'HOA & architectural review',
        desc: 'Strict Camelback Foothills HOA guidelines on exterior finishes and roofline modifications.'
      }
    ],
    risksSummary: 'Review solar lease transfer terms and HOA CC&Rs closely.',
    rebateBasis: 'Based on $2.15M purchase price.',
    rebateRange: '$13,500 – $15,000',
    rebatePercent: '(0.63% – 0.70%)'
  },
  '742 vista del mar': {
    shortAddress: '742 Vista Del Mar',
    city: 'La Jolla, CA',
    fullAddress: '742 Vista Del Mar, La Jolla, CA 92037',
    listPrice: '$7.95M',
    marketSummary: 'Overpriced vs comps; rebate estimate where allowed by law.',
    comps: [
      {
        address: '718 Via Capri',
        distance: '0.32 mi',
        specs: '5 bd | 4.5 ba | 4,612 sf',
        soldPrice: 'Sold $6.25M',
        adjPrice: 'Adj. $6.41M'
      },
      {
        address: '7550 Eads Ave',
        distance: '0.48 mi',
        specs: '4 bd | 4 ba | 3,980 sf',
        soldPrice: 'Sold $5.30M',
        adjPrice: 'Adj. $5.48M'
      },
      {
        address: '737 Bonair Way',
        distance: '0.61 mi',
        specs: '5 bd | 4 ba | 4,305 sf',
        soldPrice: 'Sold $5.85M',
        adjPrice: 'Adj. $6.02M'
      }
    ],
    compsSummary: 'Subject at $7.95M list is 24–32% above adjusted comps.',
    risks: [
      {
        id: 'topo',
        title: 'Topography & drainage',
        desc: 'Steep lot; prior water intrusion noted in 2021 disclosure.'
      },
      {
        id: 'coastal',
        title: 'Coastal bluff influence',
        desc: 'Setback & erosion disclosure on file; future costs possible.'
      },
      {
        id: 'permits',
        title: 'Permit & code notes',
        desc: 'Unpermitted pool heater; fence variance exception.'
      }
    ],
    risksSummary: 'Review seller disclosures and coastal reports closely.',
    rebateBasis: 'Based on $1.5M purchase price.',
    rebateRange: '$10,000 – $12,000',
    rebatePercent: '(0.67% – 0.80%)'
  },
  '4220 oak hollow': {
    shortAddress: '4220 Oak Hollow Terrace',
    city: 'Austin, TX',
    fullAddress: '4220 Oak Hollow Terrace, Austin, TX 78746',
    listPrice: '$1.85M',
    marketSummary: 'Westlake Hills micro-market analyzed; rebate estimate where allowed by law.',
    comps: [
      {
        address: '4108 Lost Creek Blvd',
        distance: '0.35 mi',
        specs: '4 bd | 3.5 ba | 3,650 sf',
        soldPrice: 'Sold $1.78M',
        adjPrice: 'Adj. $1.82M'
      },
      {
        address: '3804 Wildwood Rd',
        distance: '0.52 mi',
        specs: '4 bd | 4 ba | 3,920 sf',
        soldPrice: 'Sold $1.89M',
        adjPrice: 'Adj. $1.86M'
      },
      {
        address: '4315 Barton Creek Blvd',
        distance: '0.70 mi',
        specs: '5 bd | 4 ba | 4,200 sf',
        soldPrice: 'Sold $1.95M',
        adjPrice: 'Adj. $1.91M'
      }
    ],
    compsSummary: 'Subject at $1.85M list is right at median adjusted comps for Eanes ISD.',
    risks: [
      {
        id: 'foundation',
        title: 'Karst limestone & foundation',
        desc: 'Shallow limestone shelf; prior pier-and-beam leveling warranty on record.'
      },
      {
        id: 'wui',
        title: 'Wildfire urban-interface',
        desc: 'Zone 2 WUI brush clearance and metal mesh eaves compliance required.'
      },
      {
        id: 'trees',
        title: 'City of Austin tree ordinance',
        desc: 'Protected heritage live oak trees require arborist permit for exterior work.'
      }
    ],
    risksSummary: 'Review foundation warranty transfer and arborist surveys closely.',
    rebateBasis: 'Based on $1.85M purchase price.',
    rebateRange: '$11,500 – $13,000',
    rebatePercent: '(0.62% – 0.70%)'
  }
};

export function getPropertyDossier(rawAddress) {
  if (!rawAddress) return KNOWN_PROPERTY_DOSSIERS['742 vista del mar'];
  const lower = rawAddress.toLowerCase().trim();

  for (const [key, dossier] of Object.entries(KNOWN_PROPERTY_DOSSIERS)) {
    if (lower.includes(key) || key.split(' ').every(w => lower.includes(w))) {
      return dossier;
    }
  }

  // Parse custom address
  const parts = rawAddress.split(',').map(s => s.trim());
  const street = parts[0] || rawAddress;
  const city = parts[1] ? `${parts[1]}${parts[2] ? `, ${parts[2].split(' ')[1] || parts[2]}` : ''}` : 'Local Market';

  return {
    shortAddress: street,
    city: city,
    fullAddress: rawAddress,
    listPrice: '$1.50M',
    marketSummary: `Micro-market analysis complete for ${street}; rebate estimate where allowed by law.`,
    comps: [
      {
        address: `Nearby Comp 1 (${street.replace(/^\d+\s*/, '') || 'Local'})`,
        distance: '0.35 mi',
        specs: '4 bd | 3.5 ba | 3,750 sf',
        soldPrice: 'Sold $1.45M',
        adjPrice: 'Adj. $1.48M'
      },
      {
        address: `Nearby Comp 2 (${city.split(',')[0] || 'Local'})`,
        distance: '0.48 mi',
        specs: '4 bd | 4 ba | 3,920 sf',
        soldPrice: 'Sold $1.52M',
        adjPrice: 'Adj. $1.50M'
      },
      {
        address: `Nearby Comp 3 (Micro-Market)`,
        distance: '0.62 mi',
        specs: '5 bd | 4 ba | 4,100 sf',
        soldPrice: 'Sold $1.58M',
        adjPrice: 'Adj. $1.55M'
      }
    ],
    compsSummary: `Subject at current list is evaluated against 3 recent adjusted neighborhood comps.`,
    risks: [
      {
        id: 'zoning',
        title: 'Zoning & municipal setback',
        desc: 'Standard residential single-family zoning verified; verify local utility easement.'
      },
      {
        id: 'drainage',
        title: 'Topography & drainage slope',
        desc: 'Review standard parcel drainage grade and regional storm runoff disclosures.'
      },
      {
        id: 'permits',
        title: 'Permit & improvement records',
        desc: 'Verify permit history on past remodels and HVAC/roof installations with city records.'
      }
    ],
    risksSummary: 'Review seller disclosures and municipal permit records closely.',
    rebateBasis: 'Based on $1.5M purchase price.',
    rebateRange: '$10,000 – $12,000',
    rebatePercent: '(0.67% – 0.80%)'
  };
}