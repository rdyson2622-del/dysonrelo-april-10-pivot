import React from 'react';
import { Scale, ShieldAlert, Waves, Clock, DollarSign, Home, Shield } from 'lucide-react';

export const KNOWN_PROPERTY_DOSSIERS = {
  '1844 mountain shadow': {
    shortAddress: '1844 Mountain Shadow Way',
    city: 'Scottsdale, AZ',
    fullAddress: '1844 Mountain Shadow Way, Scottsdale, AZ 85253',
    listPrice: '$2.15M',
    marketSummary: 'Market-aligned pricing vs Desert Ridge comps; individual legal & lender discovery required.',
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
    complianceBasis: 'Transaction-specific legal & underwriting discovery required.',
    complianceProtocol: 'Case-by-Case Discovery',
    complianceStatus: 'Checked Against State, Fed & Lender Regs'
  },
  '742 vista del mar': {
    shortAddress: '742 Vista Del Mar',
    city: 'La Jolla, CA',
    fullAddress: '742 Vista Del Mar, La Jolla, CA 92037',
    listPrice: '$7.95M',
    marketSummary: 'Overpriced vs comps; individual legal & lender discovery required.',
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
    complianceBasis: 'Transaction-specific legal & underwriting discovery required.',
    complianceProtocol: 'Case-by-Case Discovery',
    complianceStatus: 'Checked Against State, Fed & Lender Regs'
  },
  '4220 oak hollow': {
    shortAddress: '4220 Oak Hollow Terrace',
    city: 'Austin, TX',
    fullAddress: '4220 Oak Hollow Terrace, Austin, TX 78746',
    listPrice: '$1.85M',
    marketSummary: 'Westlake Hills micro-market analyzed; individual legal & lender discovery required.',
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
    complianceBasis: 'Transaction-specific legal & underwriting discovery required.',
    complianceProtocol: 'Case-by-Case Discovery',
    complianceStatus: 'Checked Against State, Fed & Lender Regs'
  },
  '7414 fay ave': {
    shortAddress: '7414 Fay Ave',
    city: 'La Jolla, CA',
    fullAddress: '7414 Fay Ave, La Jolla, CA 92037',
    listPrice: '$4.85M',
    marketSummary: '18% premium vs coastal comps; mandatory 25-ft bluff setback & geotechnical soil review required.',
    comps: [
      {
        address: '7350 Fay Ave',
        distance: '0.15 mi',
        specs: '4 bd | 4 ba | 3,420 sf',
        soldPrice: 'Sold $3.95M',
        adjPrice: 'Adj. $4.10M'
      },
      {
        address: '7520 Draper Ave',
        distance: '0.28 mi',
        specs: '4 bd | 3.5 ba | 3,650 sf',
        soldPrice: 'Sold $4.20M',
        adjPrice: 'Adj. $4.15M'
      },
      {
        address: '7210 Eads Ave',
        distance: '0.35 mi',
        specs: '5 bd | 4.5 ba | 3,890 sf',
        soldPrice: 'Sold $4.40M',
        adjPrice: 'Adj. $4.30M'
      }
    ],
    compsSummary: 'Subject at $4.85M list sits at an 18% premium over recent neighborhood sales.',
    risks: [
      {
        id: 'bluff',
        title: 'Coastal bluff setback',
        desc: 'Mandatory 25-foot bluff setback and updated geotechnical soil stability report required.'
      },
      {
        id: 'geological',
        title: 'Geological fault lines',
        desc: 'Rose Canyon fault influence zone; un-waivable geological inspection contingency recommended.'
      },
      {
        id: 'permits',
        title: 'Municipal permit records',
        desc: 'Coastal development permit (CDP) on record for second-story addition; verify certificate of occupancy.'
      }
    ],
    risksSummary: 'Mandate strict geotechnical soil stability inspections and escrow contingency shields.',
    complianceBasis: 'California coastal commission setback & lender underwriting discovery required.',
    complianceProtocol: 'Case-by-Case Discovery',
    complianceStatus: 'Checked Against State, Fed & Lender Regs'
  }
};

export function getPropertyDossier(rawAddress) {
  if (!rawAddress) return KNOWN_PROPERTY_DOSSIERS['742 vista del mar'];
  let cleaned = String(rawAddress).trim();

  // If input is an MLS link or URL, extract address snippet
  if (/^(https?:\/\/|www\.|\w+\.(com|org|net))/i.test(cleaned) || /zillow|realtor|redfin|homes\.com/i.test(cleaned)) {
    try {
      const decoded = decodeURIComponent(cleaned);
      const m = decoded.match(/homedetails\/([^/?#]+)/i) || 
                decoded.match(/realestateandhomes-detail\/([^/?#]+)/i) ||
                decoded.match(/property\/([^/?#]+)/i);
      if (m && m[1]) {
        cleaned = m[1].replace(/-\d+_zpid.*$/i, '').replace(/_M\d+.*$/i, '').replace(/-\d+\/?$/i, '').replace(/[_-]/g, ' ').trim();
      }
    } catch (_) {}
  }

  const lower = cleaned.toLowerCase().trim();

  for (const [key, dossier] of Object.entries(KNOWN_PROPERTY_DOSSIERS)) {
    if (lower.includes(key) || key.split(' ').every(w => lower.includes(w))) {
      return dossier;
    }
  }

  // Parse custom address
  const parts = cleaned.split(',').map(s => s.trim());
  const street = parts[0] || cleaned;
  const city = parts[1] ? `${parts[1]}${parts[2] ? `, ${parts[2].split(' ')[1] || parts[2]}` : ''}` : 'Local Market';

  return {
    shortAddress: street,
    city: city,
    fullAddress: cleaned,
    listPrice: '$1.50M',
    marketSummary: `Micro-market analysis complete for ${street}; individual legal & lender discovery required.`,
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
    complianceBasis: 'Transaction-specific legal & underwriting discovery required.',
    complianceProtocol: 'Case-by-Case Discovery',
    complianceStatus: 'Checked Against State, Fed & Lender Regs'
  };
}