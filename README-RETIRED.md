# RETIRED — moved into MAS-Platform

This quiz now lives at **https://academy.marketingarchitect.net/quiz**, inside
the `MAS-Platform` repo (`app/course-quiz/`, `lib/quiz/`, `components/quiz/`).

**Why it moved:** this app stored submissions in its own Supabase project.
That project was deleted, so every submission failed at the insert and
returned a 500 *before* sending the result email — visitors saw an error and
the lead was lost with no record. The rebuilt version writes straight to the
platform database (`Lead` + `CourseQuizResult`), so the quiz can only fail if
the platform itself is down.

`vercel.json` here redirects every path to the new location so old links keep
working. Nothing in this repo is deployed logic any more — do not edit it
expecting changes to appear; edit the platform copy instead.
