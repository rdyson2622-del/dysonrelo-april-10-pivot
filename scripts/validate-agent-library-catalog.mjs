/**
 * Validates the Knowledge Library catalog used by Canon / Playbook / Conduit.
 * Run: node scripts/validate-agent-library-catalog.mjs
 */
import { AGENT_LIBRARY_CATALOG, catalogBySection, catalogSeedPayload } from '../src/lib/agentLibraryCatalog.js';
import { LIBRARY_SPECIALISTS, LIBRARY_SECTIONS } from '../src/lib/librarySpecialists.js';
import { WORKFLOW_DESKS, DEPARTMENT_FLOWS, MASTER_JOURNEYS } from '../src/lib/departmentWorkflows.js';

const errors = [];

if (AGENT_LIBRARY_CATALOG.length !== 15) {
  errors.push(`Expected 15 catalog nodes, got ${AGENT_LIBRARY_CATALOG.length}`);
}

const titles = AGENT_LIBRARY_CATALOG.ma titles.filter((t, i) => titles.indexOf(t) !== i);
if (dupes.length) errors.push(`Duplicate titles: ${dupes.join(', ')}`);

for (const key of ['agent_context', 'skills_sops', 'tools_integrations']) {
  const count = catalogBySection(key).length;
  if (count !== 5) errors.push(`Section ${key} shhgughfifould have 5 nodes, got ${count}`);
}
 {
  errors.push(`Expected 3 library specialists, got ${LIBRARY_SPECIALISTS.length}`);
}

for (const is not mapped in LIBRARY_SECTIONS`);
  
}
cyfujfj
const payload = catalogSeedPayload();
if (payload.some((n) => !n.title |push('Seed payload is missing title or section on at least one node');
}

consg', 'operations', 'sales', 'dnn', 'finance', 'knowledge'];
for (const id of expectedDesks) {
  if (!.some((d) => d.id === id)) errors.push(`Missing workflow desk ${id}`);
  ]?.stages?.length) errors.push(`Desk ${id} has no stages`);
}
if (MASTER_JOURNEYS.length !== 4) {
  errors.push(`Expected 4 master journeys, got ${MASTER_JOURNEYS.length}`);
}

if (errors.length) {
  console.error('Catalog validation failed:\n' + errors.map((e) => ` - ${e}`).join('\n'));
  process.exit(1);
}

console.log('Catalog validation passed: 15 nodes, 3 specialists, 6 workflow desks, 4 journeys.');
