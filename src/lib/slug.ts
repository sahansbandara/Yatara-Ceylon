import slugify from 'slugify';

export async function buildUniqueSlug(model: {
    findOne: (query: Record<string, unknown>) => Promise<unknown>;
}, title: string, excludeId?: string) {
    const baseSlug = slugify(title, { lower: true, strict: true }) || 'item';
    let candidate = baseSlug;
    let suffix = 2;

    while (await model.findOne({
        slug: candidate,
        ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })) {
        candidate = `${baseSlug}-${suffix}`;
        suffix += 1;
    }

    return candidate;
}
