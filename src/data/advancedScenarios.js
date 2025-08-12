// Data skenario advanced untuk Round 8+
export const advancedScenarios = {
  'round1_s1': {
    name: 'Lawan Round 1 (Skenario 1)',
    rounds: [
      { round: 8, pattern: 'r1' },
      { round: 9, pattern: 'r2' },
      { round: 10, pattern: 'r3' },
      { round: 11, pattern: 'r4' },
      { round: 12, pattern: 'r5' },
      { round: 13, pattern: 'r6' }
    ]
  },
  'round1_s2': {
    name: 'Lawan Round 1 (Skenario 2)',
    rounds: [
      { round: 8, pattern: 'r1' },
      { round: 9, pattern: 'r4' },
      { round: 10, pattern: 'r5' },
      { round: 11, pattern: 'r7' },
      { round: 12, pattern: 'r3' },
      { round: 13, pattern: 'r2' }
    ]
  },
  'round2': {
    name: 'Lawan Round 2',
    rounds: [
      { round: 8, pattern: 'r2' },
      { round: 9, pattern: 'r4' },
      { round: 10, pattern: 'r3' },
      { round: 11, pattern: 'r7' },
      { round: 12, pattern: 'r5' },
      { round: 13, pattern: 'r1' }
    ]
  },
  'round5_s1': {
    name: 'Lawan Round 5 (Skenario 1)',
    rounds: [
      { round: 8, pattern: 'r5' },
      { round: 9, pattern: 'r4' },
      { round: 10, pattern: 'r3' },
      { round: 11, pattern: 'r9' },
      { round: 12, pattern: 'r7' }  
    ]
  },
  'round5_s2': {
    name: 'Lawan Round 5 (Skenario 2)',
    rounds: [
      { round: 8, pattern: 'r5' },
      { round: 9, pattern: 'r2' },
      { round: 10, pattern: 'r3' },
      { round: 11, pattern: 'r7' },
      { round: 12, pattern: null },
      { round: 13, pattern: null }
    ]
  },
  'round6_s1': {
    name: 'Lawan Round 6 (Skenario 1)',
    rounds: [
      { round: 8, pattern: 'r6' },
      { round: 9, pattern: 'r2' },
      { round: 10, pattern: 'r5' },
      { round: 11, pattern: 'r4' },
      { round: 12, pattern: 'r7' },
      { round: 13, pattern: 'r1' }
    ]
  },
  'round6_s2': {
    name: 'Lawan Round 6 (Skenario 2 - Mati 1)',
    rounds: [
      { round: 8, pattern: 'r6' },
      { round: 9, pattern: 'r2' },
      { round: 10, pattern: 'r5' },
      { round: 11, pattern: 'r4' },
      { round: 12, pattern: 'r5' }, // Mati 1 effect
      { round: 13, pattern: 'r1' },
      { round: 14, pattern: 'r3' }
    ]
  }
};

// Fungsi helper untuk mendapatkan opponent dari pattern
export const getOpponentFromPattern = (pattern, basicRounds) => {
  if (!pattern) return '';
  
  const roundIndex = parseInt(pattern.replace('r', '')) - 1;
  if (roundIndex >= 0 && roundIndex < basicRounds.length) {
    // Ambil dari kolom userVs jika ada, kalau tidak dari p8Vs
    return basicRounds[roundIndex].userVs || basicRounds[roundIndex].p8Vs || '';
  }
  return '';
};