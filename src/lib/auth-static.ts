// auth-static.ts - Soporte de autenticación para modo estático en Next.js

interface User {
  id: number;
  userId: string;
  name: string;
  email: string;
  role: string;
}

export function getAuthUser(): User | null {
  if (typeof window === 'undefined') {
    // En tiempo de construcción, devolver null
    return null;
  }
  
  try {
    const userJson = localStorage.getItem('podcast-user');
    if (!userJson) return null;
    
    return JSON.parse(userJson) as User;
  } catch (e) {
    console.error('Error parsing user data', e);
    return null;
  }
}

export function setAuthUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('podcast-user', JSON.stringify(user));
  }
}

export function removeAuthUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('podcast-user');
  }
}
