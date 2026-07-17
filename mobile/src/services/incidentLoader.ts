import { Incident } from '../models/incident';

// Import the bundled JSON data
const incidentsData: Incident[] = require('../data/incidents.json');

export function loadIncidents(): Promise<Incident[]> {
  return new Promise((resolve, reject) => {
    try {
      // Simulate a small network delay for realistic loading state
      setTimeout(() => {
        if (incidentsData && Array.isArray(incidentsData)) {
          resolve(incidentsData);
        } else {
          reject(new Error('Invalid incident data format'));
        }
      }, 800);
    } catch (error) {
      reject(new Error('Failed to load incident data'));
    }
  });
}
