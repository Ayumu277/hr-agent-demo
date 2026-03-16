import type { ScenarioDefinition } from './types';
import scenario1 from './scenario1-fulfillment';
import scenario2 from './scenario2-followup';
import scenario3 from './scenario3-client';
import scenario4 from './scenario4-attendance';
import scenario5 from './scenario5-contract';

export const scenarios: ScenarioDefinition[] = [
  scenario1, scenario2, scenario3, scenario4, scenario5,
];

export function findScenario(input: string): ScenarioDefinition | null {
  for (const scenario of scenarios) {
    if (scenario.keywords.some((kw) => input.includes(kw))) {
      return scenario;
    }
  }
  return null;
}
