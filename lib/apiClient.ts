const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * Helper to handle fetch responses and errors
 */
async function handleResponse(res: Response) {
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
    }
    return res.json();
}

/**
 * Enhanced fetch helper to automatically include the JWT token for authenticated routes
 */
async function authFetch(url: string, options: RequestInit = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(url, { ...options, headers });
    return handleResponse(res);
}

/* =========================================
   PREVIOUS FUNCTIONALITY (PRESERVED)
   ========================================= */

export const fetchLessons = async () => {
    try {
        const res = await fetch(`${API_BASE}/lessons`, {
            cache: 'no-store', // Ensures fresh data during development
        });
        return await handleResponse(res);
    } catch (error) {
        console.error("Error fetching lessons:", error);
        return []; // Return empty array as fallback
    }
};

export const fetchKana = async (type: 'hiragana' | 'katakana') => {
    try {
        const res = await fetch(`${API_BASE}/kana?type=${type}`, {
            next: { revalidate: 3600 }, // Optional: Cache data for 1 hour
        });
        return await handleResponse(res);
    } catch (error) {
        console.error(`Error fetching ${type}:`, error);
        return []; // Return empty array so .map() doesn't fail
    }
};

export const getVoicedVariants = (baseData: any[]) => {
    const voiced: any[] = [];
    const voicingMap: Record<string, string> = { k: "g", s: "z", t: "d", h: "b" };
    const semiVoicedMap: Record<string, string> = { h: "p" };

    baseData.forEach((k) => {
        const firstChar = k.romaji[0];
        const vowel = k.romaji.slice(1);

        // Dakuten (゛)
        if (voicingMap[firstChar]) {
            const romaji = voicingMap[firstChar] + vowel;
            voiced.push({ 
                char: k.char + "\u3099", 
                romaji: romaji === "zi" ? "ji" : romaji === "di" ? "ji" : romaji === "du" ? "zu" : romaji 
            });
        }

        // Handakuten (゜)
        if (semiVoicedMap[firstChar]) {
            voiced.push({ char: k.char + "\u309A", romaji: "p" + vowel });
        }
    });

    return voiced;
};

/* =========================================
   NEW AUTH & USER FUNCTIONALITY
   ========================================= */

/**
 * Registers a new user on the Express backend
 */
export const registerUser = async (data: any) => {
    return authFetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

/**
 * Authenticates user and retrieves JWT
 */
export const loginUser = async (data: any) => {
    return authFetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

/**
 * Fetches the logged-in user's profile (XP, Mastery, etc.)
 */
export const fetchUserProfile = async () => {
    return authFetch(`${API_BASE}/user/me`, {
        cache: 'no-store'
    });
};

/**
 * Syncs a specific drill result (stability, hits, mistakes) to the DB
 */
export const syncDrillToDB = async (charId: string, isCorrect: boolean, xpEarned: number) => {
    try {
        const token = localStorage.getItem("token");
        
        const response = await fetch(`${API_BASE}/user/sync-drill`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Ensure this is exactly like this
            },
            body: JSON.stringify({ charId, isCorrect, xpEarned }),
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("❌ Server rejected sync:", errorBody);
            throw new Error(errorBody.message || 'Sync failed');
        }
        
        return await response.json();
    } catch (err) {
        console.error("🛰️ [API_CLIENT] Critical Error:", err);
        throw err;
    }
};