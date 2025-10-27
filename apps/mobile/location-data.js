export const countries = [
  { id: 1, name: 'Switzerland', code: 'CH' },
  { id: 2, name: 'Germany', code: 'DE' },
  { id: 3, name: 'Austria', code: 'AT' },
  { id: 4, name: 'Italy', code: 'IT' },
  { id: 5, name: 'France', code: 'FR' },
  { id: 6, name: 'Spain', code: 'ES' },
  { id: 7, name: 'United Kingdom', code: 'GB' },
  { id: 8, name: 'Netherlands', code: 'NL' },
  { id: 9, name: 'Belgium', code: 'BE' },
  { id: 10, name: 'Poland', code: 'PL' },
  { id: 11, name: 'Czech Republic', code: 'CZ' },
  { id: 12, name: 'Portugal', code: 'PT' },
  { id: 13, name: 'United States', code: 'US' },
  { id: 14, name: 'Canada', code: 'CA' },
  { id: 15, name: 'Australia', code: 'AU' },
];

export const cities = [
  // Switzerland
  { id: 1, name: 'Zurich', countryId: 1, country: 'Switzerland' },
  { id: 2, name: 'Geneva', countryId: 1, country: 'Switzerland' },
  { id: 3, name: 'Basel', countryId: 1, country: 'Switzerland' },
  { id: 4, name: 'Bern', countryId: 1, country: 'Switzerland' },
  { id: 5, name: 'Lausanne', countryId: 1, country: 'Switzerland' },
  
  // Germany
  { id: 6, name: 'Berlin', countryId: 2, country: 'Germany' },
  { id: 7, name: 'Munich', countryId: 2, country: 'Germany' },
  { id: 8, name: 'Hamburg', countryId: 2, country: 'Germany' },
  { id: 9, name: 'Frankfurt', countryId: 2, country: 'Germany' },
  { id: 10, name: 'Cologne', countryId: 2, country: 'Germany' },
  { id: 11, name: 'Stuttgart', countryId: 2, country: 'Germany' },
  { id: 12, name: 'Düsseldorf', countryId: 2, country: 'Germany' },
  
  // Austria
  { id: 13, name: 'Vienna', countryId: 3, country: 'Austria' },
  { id: 14, name: 'Salzburg', countryId: 3, country: 'Austria' },
  { id: 15, name: 'Innsbruck', countryId: 3, country: 'Austria' },
  
  // Italy
  { id: 16, name: 'Rome', countryId: 4, country: 'Italy' },
  { id: 17, name: 'Milan', countryId: 4, country: 'Italy' },
  { id: 18, name: 'Venice', countryId: 4, country: 'Italy' },
  { id: 19, name: 'Florence', countryId: 4, country: 'Italy' },
  { id: 20, name: 'Naples', countryId: 4, country: 'Italy' },
  
  // France
  { id: 21, name: 'Paris', countryId: 5, country: 'France' },
  { id: 22, name: 'Lyon', countryId: 5, country: 'France' },
  { id: 23, name: 'Marseille', countryId: 5, country: 'France' },
  { id: 24, name: 'Nice', countryId: 5, country: 'France' },
  { id: 25, name: 'Toulouse', countryId: 5, country: 'France' },
  
  // Spain
  { id: 26, name: 'Madrid', countryId: 6, country: 'Spain' },
  { id: 27, name: 'Barcelona', countryId: 6, country: 'Spain' },
  { id: 28, name: 'Valencia', countryId: 6, country: 'Spain' },
  { id: 29, name: 'Seville', countryId: 6, country: 'Spain' },
  
  // United Kingdom
  { id: 30, name: 'London', countryId: 7, country: 'United Kingdom' },
  { id: 31, name: 'Manchester', countryId: 7, country: 'United Kingdom' },
  { id: 32, name: 'Birmingham', countryId: 7, country: 'United Kingdom' },
  { id: 33, name: 'Edinburgh', countryId: 7, country: 'United Kingdom' },
  
  // Netherlands
  { id: 34, name: 'Amsterdam', countryId: 8, country: 'Netherlands' },
  { id: 35, name: 'Rotterdam', countryId: 8, country: 'Netherlands' },
  { id: 36, name: 'The Hague', countryId: 8, country: 'Netherlands' },
  
  // Belgium
  { id: 37, name: 'Brussels', countryId: 9, country: 'Belgium' },
  { id: 38, name: 'Antwerp', countryId: 9, country: 'Belgium' },
  
  // Poland
  { id: 39, name: 'Warsaw', countryId: 10, country: 'Poland' },
  { id: 40, name: 'Krakow', countryId: 10, country: 'Poland' },
  
  // Czech Republic
  { id: 41, name: 'Prague', countryId: 11, country: 'Czech Republic' },
  
  // Portugal
  { id: 42, name: 'Lisbon', countryId: 12, country: 'Portugal' },
  { id: 43, name: 'Porto', countryId: 12, country: 'Portugal' },
  
  // United States
  { id: 44, name: 'New York', countryId: 13, country: 'United States' },
  { id: 45, name: 'Los Angeles', countryId: 13, country: 'United States' },
  { id: 46, name: 'Chicago', countryId: 13, country: 'United States' },
  { id: 47, name: 'Miami', countryId: 13, country: 'United States' },
  { id: 48, name: 'San Francisco', countryId: 13, country: 'United States' },
  
  // Canada
  { id: 49, name: 'Toronto', countryId: 14, country: 'Canada' },
  { id: 50, name: 'Vancouver', countryId: 14, country: 'Canada' },
  { id: 51, name: 'Montreal', countryId: 14, country: 'Canada' },
  
  // Australia
  { id: 52, name: 'Sydney', countryId: 15, country: 'Australia' },
  { id: 53, name: 'Melbourne', countryId: 15, country: 'Australia' },
  { id: 54, name: 'Brisbane', countryId: 15, country: 'Australia' },
];

// Helper functions
export const searchCities = (query) => {
  if (!query || query.length < 1) return [];
  
  return cities.filter(city => 
    city.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10); // Limit to 10 results
};

export const searchCountries = (query) => {
  if (!query || query.length < 1) return countries;
  
  return countries.filter(country => 
    country.name.toLowerCase().includes(query.toLowerCase())
  );
};

export const getCountryByCity = (cityName) => {
  const city = cities.find(c => 
    c.name.toLowerCase() === cityName.toLowerCase()
  );
  
  if (city) {
    return countries.find(country => country.id === city.countryId);
  }
  
  return null;
};

export const getCitiesByCountry = (countryId) => {
  return cities.filter(city => city.countryId === countryId);
};