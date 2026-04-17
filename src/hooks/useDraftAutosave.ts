'use client';

import { useEffect, useRef, useState } from 'react';

interface StoredDraft<T> {
    data: T;
    savedAt: string;
}

interface UseDraftAutosaveOptions<T> {
    storageKey: string;
    value: T;
    onRestore: (value: T) => void;
    enabled?: boolean;
    debounceMs?: number;
}

export function useDraftAutosave<T>({
    storageKey,
    value,
    onRestore,
    enabled = true,
    debounceMs = 800,
}: UseDraftAutosaveOptions<T>) {
    const [hasStoredDraft, setHasStoredDraft] = useState(false);
    const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
    const onRestoreRef = useRef(onRestore);
    const readyToPersistRef = useRef(false);

    onRestoreRef.current = onRestore;

    useEffect(() => {
        if (!enabled || typeof window === 'undefined') {
            return;
        }

        readyToPersistRef.current = false;

        const rawDraft = window.localStorage.getItem(storageKey);
        if (!rawDraft) {
            setHasStoredDraft(false);
            setDraftSavedAt(null);
            return;
        }

        try {
            const draft = JSON.parse(rawDraft) as StoredDraft<T>;
            const savedLabel = new Date(draft.savedAt).toLocaleString();
            const shouldRestore = window.confirm(
                `A saved draft from ${savedLabel} is available. Restore it now?`
            );

            if (shouldRestore) {
                onRestoreRef.current(draft.data);
                setHasStoredDraft(true);
                setDraftSavedAt(draft.savedAt);
                return;
            }
        } catch (error) {
            console.error('Failed to parse saved draft', error);
        }

        window.localStorage.removeItem(storageKey);
        setHasStoredDraft(false);
        setDraftSavedAt(null);
    }, [storageKey, enabled]);

    useEffect(() => {
        if (!enabled || typeof window === 'undefined') {
            return;
        }

        if (!readyToPersistRef.current) {
            readyToPersistRef.current = true;
            return;
        }

        const timeoutId = window.setTimeout(() => {
            const savedAt = new Date().toISOString();
            const nextDraft: StoredDraft<T> = {
                data: value,
                savedAt,
            };

            window.localStorage.setItem(storageKey, JSON.stringify(nextDraft));
            setHasStoredDraft(true);
            setDraftSavedAt(savedAt);
        }, debounceMs);

        return () => window.clearTimeout(timeoutId);
    }, [value, storageKey, enabled, debounceMs]);

    const discardDraft = () => {
        if (typeof window === 'undefined') {
            return;
        }

        window.localStorage.removeItem(storageKey);
        setHasStoredDraft(false);
        setDraftSavedAt(null);
    };

    return {
        hasStoredDraft,
        draftSavedAt,
        discardDraft,
    };
}
