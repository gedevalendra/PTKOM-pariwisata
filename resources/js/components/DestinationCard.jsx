export default function DestinationCard({
    image,
    title,
    category,
    location,
    rating = 4.8,
    reviewCount = 120,
    description,
    price,
    href = '#',
}) {
    return (
        <article className="group relative flex flex-col rounded-md has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-[#4C83AD]">
            <div className="aspect-[4/3] overflow-hidden rounded-md bg-slate-100">
                <img
                    src={image}
                    alt={title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-medium text-[#4C83AD]">{category}</span>
                <span className="flex items-center gap-1 text-slate-700">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {rating}
                    <span className="text-slate-400">({reviewCount})</span>
                </span>
            </div>

            <h3 className="mt-2 text-lg font-semibold tracking-tight text-slate-900">
                <a href={href} className="outline-none after:absolute after:inset-0">
                    {title}
                </a>
            </h3>

            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">{description}</p>

            <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-200 pt-4 text-sm">
                <span className="text-slate-500">{location}</span>
                <span className="font-medium text-slate-900">{price}</span>
            </div>
        </article>
    );
}