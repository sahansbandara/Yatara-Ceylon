import { redirect } from 'next/navigation';

export default async function LoginPage({
    searchParams,
}: {
    searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
    const resolvedSearchParams = (await searchParams) || {};
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(resolvedSearchParams)) {
        if (Array.isArray(value)) {
            value.forEach((entry) => params.append(key, entry));
            continue;
        }

        if (typeof value === 'string') {
            params.set(key, value);
        }
    }

    const query = params.toString();
    redirect(query ? `/auth/login?${query}` : '/auth/login');
}
