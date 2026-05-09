export default function ThankYouPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-5">
      <div className="card-dark max-w-md w-full text-center py-12">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-accent/15">
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 text-accent"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-txt-light mb-3">
          მადლობა შევსებისთვის!
        </h1>
        <p className="text-sm text-txt-muted leading-relaxed mb-6">
          შედეგი შეამოწმე ელფოსტაში. Spam ან Promotions საქაღალდეც გადახედე.
        </p>
        <a href="/" className="btn-secondary text-sm">
          მთავარ გვერდზე დაბრუნება
        </a>
      </div>
    </div>
  );
}
