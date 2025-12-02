export interface Pairing {
  giver: string
  receiver: string
}

export function useSecretSanta() {
  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  function shuffle<T>(array: T[]): T[] {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  /**
   * Generate valid Secret Santa pairings
   * Ensures no one is paired with themselves
   */
  function generatePairings(names: string[]): Pairing[] {
    if (names.length < 2) {
      throw new Error('Need at least 2 participants')
    }

    let shuffled: string[]
    let attempts = 0
    const maxAttempts = 100

    do {
      shuffled = shuffle(names)
      attempts++
      if (attempts > maxAttempts) {
        throw new Error('Failed to generate valid pairings after multiple attempts')
      }
    } while (shuffled.some((name, i) => name === names[i]))

    return names.map((giver, i) => ({
      giver,
      receiver: shuffled[i],
    }))
  }

  /**
   * Encode pairing data to base64 for URL
   */
  function encodePairing(pairing: Pairing): string {
    return btoa(JSON.stringify(pairing))
  }

  /**
   * Decode pairing data from base64
   */
  function decodePairing(encoded: string): Pairing {
    try {
      return JSON.parse(atob(encoded))
    }
    catch (error) {
      throw new Error('Invalid pairing data')
    }
  }

  return {
    generatePairings,
    encodePairing,
    decodePairing,
  }
}
