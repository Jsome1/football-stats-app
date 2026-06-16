const API_KEY = '146066630585405eaf821eccf8b08e43';
const BASE_URL = '/api';

const fetchFromFootballData = async (endpoint) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API Fetch Error:", error);
    return null;
  }
};

export const getLeagueStandings = async (leagueCode) => {
  return fetchFromFootballData(`/competitions/${leagueCode}/standings`);
};

export const getLeagueMatches = async (leagueCode) => {
  return fetchFromFootballData(`/competitions/${leagueCode}/matches?status=SCHEDULED,LIVE,FINISHED`);
};

export const getTeamSquad = async (teamId) => {
  return fetchFromFootballData(`/teams/${teamId}`);
};