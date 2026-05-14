import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-bg-dark text-txt-light">
      {/* ── Hero ── */}
      <section className="relative border-b border-border-dark bg-surface-dark">
        <div className="mx-auto max-w-3xl px-5 py-20 md:py-28 text-center">
          <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-5">
            Marketing Architecture Quiz
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-txt-light mb-6">
            მარკეტინგი არ არის პოსტები, რეკლამა და სოციალური მედია.
          </h1>
          <p className="text-base md:text-lg text-txt-muted leading-relaxed max-w-2xl mx-auto mb-10">
            გაიარე 5-წუთიანი ქვიზი და გაიგე, რამდენად სწორად იხარჯება მარკეტინგის ბიუჯეტი შენს ბიზნესში — და რა უნდა დალაგდეს პირველ რიგში.
          </p>
          <Link href="/quiz" className="btn-primary text-base px-8 py-4">
            გაიგე, რა უნდა დალაგდეს პირველ რიგში
          </Link>
          <p className="mt-4 text-xs text-txt-muted">
            5 წუთი · საწყისი შეფასება · შედეგი ელფოსტაზე
          </p>
        </div>
      </section>

      {/* ── Supporting copy ── */}
      <section className="bg-bg-light/5 border-b border-border-dark">
        <div className="mx-auto max-w-2xl px-5 py-14 text-center">
          <p className="text-base leading-relaxed text-txt-muted">
            თუ რეკლამას უშვებ, კონტენტი იქმნება, მარკეტერი ან სააგენტო მუშაობს, მაგრამ მაინც არ ჩანს რა მოაქვს ამას ბიზნესისთვის — პრობლემა შეიძლება ერთ ცუდ პოსტში ან ერთ ცუდ კამპანიაში არ იყოს.
          </p>
          <p className="mt-5 text-base leading-relaxed text-txt-muted">
            შეიძლება მარკეტინგს აკლდეს სამუშაო სისტემა: ვის ელაპარაკება, რას სთავაზობს, როგორ ქმნის ნდობას, როგორ მიჰყავს ადამიანი ყიდვამდე და როგორ კითხულობ შედეგს.
          </p>
        </div>
      </section>

      {/* ── Section 1: Why more ads aren't enough ── */}
      <section className="border-b border-border-dark">
        <div className="mx-auto max-w-3xl px-5 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            რატომ არ კმარა უბრალოდ მეტი რეკლამა
          </h2>
          <p className="text-txt-muted leading-relaxed mb-5">
            ბევრი ბიზნესის პირველი რეაქციაა: მეტი ბიუჯეტი, მეტი პოსტი, ახალი ვიზუალი, ახალი კამპანია ან ახალი სოცმედია მენეჯერი.
          </p>
          <p className="text-txt-muted leading-relaxed mb-10">
            ზოგჯერ ეს საჭიროა. მაგრამ თუ სისტემა არ ჩანს, მეტი აქტივობა ხშირად უბრალოდ უფრო ძვირად გაჩვენებს იმავე ქაოსს.
          </p>

          <ul className="space-y-3">
            {[
              "ბიუჯეტი იხარჯება, მაგრამ არ ჩანს რა ქმნის გაყიდვას",
              "პოტენციური კლიენტები მოდიან, მაგრამ გზაში იკარგებიან",
              "მარკეტერი ან სააგენტო მუშაობს, მაგრამ არ იცი რა მოსთხოვო",
              "კონტენტი კეთდება, მაგრამ გაყიდვასთან კავშირი ბუნდოვანია",
              "გადაწყვეტილებები ხშირად შეგრძნებით მიიღება და არა მონაცემით",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-txt-muted text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Section 2: What you get ── */}
      <section className="border-b border-border-dark bg-surface-dark">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
            რას მიიღებ ქვიზის ბოლოს
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "ბიუჯეტის გამოყენების საწყისი შეფასება",
                body: "დაინახავ, რამდენად სისტემურად იხარჯება მარკეტინგის ბიუჯეტი შენს ბიზნესში.",
              },
              {
                title: "პირველი დასალაგებელი ზონა",
                body: "ქვიზი გაჩვენებს, საიდან ჯობს დაიწყო: აუდიტორიიდან, შეთავაზებიდან, ნდობიდან, გაყიდვამდე გზიდან თუ კონტროლიდან.",
              },
              {
                title: "7-დღიანი მოქმედების რუკა",
                body: "მიიღებ პრაქტიკულ შემდეგ ნაბიჯს, რომ იცოდე რა შეამოწმო პირველ რიგში.",
              },
              {
                title: "რეკომენდებული გზა",
                body: "გაიგებ, უფრო გჭირდება კურსი, Premium Review, Team Seat თუ ინდივიდუალური დიაგნოსტიკა.",
              },
            ].map((card) => (
              <div key={card.title} className="card-dark">
                <div className="w-8 h-1 rounded bg-accent mb-4" />
                <h3 className="text-base font-semibold text-txt-light mb-2">{card.title}</h3>
                <p className="text-sm text-txt-muted leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Situation cards ── */}
      <section className="border-b border-border-dark">
        <div className="mx-auto max-w-4xl px-5 py-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
            რა ტიპის პრობლემაზეა ეს ქვიზი
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "რეკლამა მიდის, მაგრამ ლიდები აღარ შემოდის",
                body: "ხშირად პრობლემა მხოლოდ რეკლამაში არ არის. შეიძლება შეთავაზება, ნდობა ან შემდეგი ნაბიჯი არ იყოს საკმარისად მკაფიო.",
              },
              {
                title: "მარკეტერი ავიყვანე, მაგრამ ვერ ვიღებ იმას, რაც მინდა",
                body: "თუ owner-ს არ აქვს სამუშაო რუკა, რთულია მარკეტერს ან სააგენტოს ზუსტად მოსთხოვო შედეგი, report და შემდეგი მოქმედება.",
              },
              {
                title: "კურსის დრო სად მაქვს?",
                body: "ეს ქვიზი არ გთხოვს ახალი თეორიის სწავლას. ჯერ გაჩვენებს, რა არის ყველაზე მნიშვნელოვანი დასალაგებელი — რომ დრო არ დახარჯო არასწორ რამეზე.",
              },
              {
                title: "ყველაფერი კეთდება, მაგრამ სისტემა არ ჩანს",
                body: "პოსტები, რეკლამა, შეთავაზება, განმეორებითი დაკავშირება და გაყიდვა ცალ-ცალკე არ უნდა ცხოვრობდეს. ისინი ერთ სამუშაო სისტემაში უნდა ჯდებოდეს.",
              },
            ].map((card) => (
              <div key={card.title} className="rounded-2xl border border-border-dark p-6 bg-surface-dark/50">
                <h3 className="text-base font-semibold text-txt-light mb-2">{card.title}</h3>
                <p className="text-sm text-txt-muted leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── Final CTA ── */}
      <section className="bg-surface-dark border-t border-border-dark">
        <div className="mx-auto max-w-2xl px-5 py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-5">
            გაიგე, რა უნდა დალაგდეს პირველ რიგში
          </h2>
          <p className="text-txt-muted leading-relaxed mb-8 max-w-lg mx-auto">
            თუ მარკეტინგში ფული იხარჯება, მაგრამ შედეგი ბუნდოვანია, ჯერ ახალი კამპანია არ არის პასუხი. ჯერ უნდა დაინახო, სად არის სისტემა არეული.
          </p>
          <Link href="/quiz" className="btn-primary text-base px-8 py-4">
            ქვიზის დაწყება
          </Link>
          <p className="mt-6 text-xs text-txt-muted max-w-sm mx-auto leading-relaxed">
            ეს არ არის სრული Marketing MRI ან ინდივიდუალური კონსულტაცია. ეს არის საწყისი შეფასება, რომელიც გეხმარება სწორი შემდეგი ნაბიჯის დანახვაში.
          </p>
        </div>
      </section>
    </div>
  );
}
