import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { initDatabase } from '@/lib/database';

export function useDatabaseInitialization() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    try {
      // Skip initialization on web platform
      if (Platform.OS === 'web') {
        console.info('Database initialization skipped on web platform');
        if (isMounted) {
          setIsReady(true);
        }
        return;
      }

      // Initialize database synchronously
      initDatabase();
      if (isMounted) {
        setIsReady(true);
      }
    } catch (err) {
      if (isMounted) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return { isReady, error };
}
