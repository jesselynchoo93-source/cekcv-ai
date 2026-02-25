export type Locale = "en" | "id";

export const translations = {
  // ── Nav ──
  nav: {
    individual: { en: "Individual Analysis", id: "Analisis Individu" },
    company: { en: "Company Screening", id: "Screening Perusahaan" },
  },

  // ── Landing page ──
  landing: {
    badge: { en: "Powered by 3 AI models", id: "Didukung 3 model AI" },
    headline: { en: "Get your CV", id: "Buat CV kamu" },
    headlineHighlight: { en: "interview-ready", id: "siap interview" },
    headlineEnd: { en: "in 3 minutes", id: "dalam 3 menit" },
    subtitle: {
      en: "Score your CV against any job description, get actionable improvements, an AI-rewritten resume, and matching job openings \u2014 all in one analysis.",
      id: "Skor CV kamu terhadap job description apapun, dapatkan saran perbaikan, resume yang di-rewrite AI, dan lowongan kerja yang cocok \u2014 semua dalam satu analisis.",
    },
    ctaAnalyze: { en: "Analyze My CV \u2014 Free", id: "Analisis CV Saya \u2014 Gratis" },
    ctaScreen: { en: "Screen Candidates", id: "Screening Kandidat" },
    trustPrivacy: { en: "Your CV is never stored", id: "CV kamu tidak pernah disimpan" },
    trustSpeed: { en: "Results in ~3 minutes", id: "Hasil dalam ~3 menit" },
    trustNoSignup: { en: "No sign-up required", id: "Tanpa perlu daftar" },

    howTitle: { en: "How it works", id: "Cara kerja" },
    howSubtitle: { en: "Three steps to a stronger application", id: "Tiga langkah menuju lamaran yang lebih kuat" },

    step1Title: { en: "Upload", id: "Upload" },
    step1Desc: {
      en: "Drop your CV and paste the job description you're applying for",
      id: "Upload CV dan paste job description yang kamu lamar",
    },
    step2Title: { en: "AI Analysis", id: "Analisis AI" },
    step2Desc: {
      en: "GPT, Claude & Gemini score your CV independently to reduce bias",
      id: "GPT, Claude & Gemini menilai CV kamu secara independen untuk mengurangi bias",
    },
    step3Title: { en: "Get Results", id: "Lihat Hasil" },
    step3Desc: {
      en: "ATS score, missing keywords, an improved CV, and matching job openings",
      id: "Skor ATS, keyword yang kurang, CV yang lebih baik, dan lowongan kerja yang cocok",
    },

    featTitle: { en: "What you get", id: "Apa yang kamu dapatkan" },
    featSubtitle: {
      en: "A complete analysis of your CV, not just a score",
      id: "Analisis lengkap CV kamu, bukan sekadar skor",
    },
    feat1Title: { en: "ATS-Optimized Scoring", id: "Skor Optimasi ATS" },
    feat1Desc: {
      en: "See exactly how your CV performs against real ATS systems and what keywords you're missing",
      id: "Lihat performa CV kamu di sistem ATS dan keyword apa yang kurang",
    },
    feat2Title: { en: "Actionable Improvements", id: "Saran Perbaikan Praktis" },
    feat2Desc: {
      en: "Priority-ranked changes with estimated score impact so you know what to fix first",
      id: "Perubahan yang diprioritaskan dengan estimasi dampak skor, jadi kamu tahu apa yang harus diperbaiki duluan",
    },
    feat3Title: { en: "AI-Rewritten CV", id: "CV yang Di-rewrite AI" },
    feat3Desc: {
      en: "Get an improved version of your CV with targeted keywords and better structure",
      id: "Dapatkan versi CV yang sudah diperbaiki dengan keyword yang tepat dan struktur yang lebih baik",
    },
    feat4Title: { en: "Job Matching", id: "Job Matching" },
    feat4Desc: {
      en: "Discover relevant openings that match your profile, pulled from live job boards",
      id: "Temukan lowongan yang cocok dengan profil kamu, diambil dari job board terkini",
    },

    // Company mode
    companyHeadline: { en: "Screen candidates", id: "Screening kandidat" },
    companyHighlight: { en: "10x faster", id: "10x lebih cepat" },
    companyHeadlineEnd: { en: "with AI", id: "dengan AI" },
    companySubtitle: {
      en: "Upload multiple CVs at once, let 3 AI models score and rank your candidates against any job description \u2014 unbiased, consistent, and instant.",
      id: "Upload banyak CV sekaligus, biarkan 3 model AI menilai dan me-ranking kandidat terhadap job description apapun \u2014 tanpa bias, konsisten, dan instan.",
    },
    companyStep1Title: { en: "Batch Upload", id: "Batch Upload" },
    companyStep1Desc: {
      en: "Upload multiple CVs and define the job description for the role you're hiring",
      id: "Upload banyak CV dan tentukan job description untuk posisi yang sedang kamu buka",
    },
    companyStep2Title: { en: "AI Scoring", id: "Scoring AI" },
    companyStep2Desc: {
      en: "Each CV is scored by GPT, Claude & Gemini independently for fair, unbiased results",
      id: "Setiap CV dinilai oleh GPT, Claude & Gemini secara independen untuk hasil yang adil dan tanpa bias",
    },
    companyStep3Title: { en: "Ranked Leaderboard", id: "Leaderboard Ranking" },
    companyStep3Desc: {
      en: "Get a ranked list of candidates with match scores, strengths, and gaps for each",
      id: "Dapatkan daftar kandidat yang sudah di-ranking dengan skor, kelebihan, dan kekurangan masing-masing",
    },
    companyFeat1Title: { en: "Batch CV Processing", id: "Proses CV Massal" },
    companyFeat1Desc: {
      en: "Upload and analyze up to 50 CVs in a single batch \u2014 no more manual screening one by one",
      id: "Upload dan analisis hingga 50 CV sekaligus \u2014 tidak perlu lagi screening manual satu per satu",
    },
    companyFeat2Title: { en: "Multi-Model Scoring", id: "Scoring Multi-Model" },
    companyFeat2Desc: {
      en: "Three AI models score each candidate independently, reducing individual model bias",
      id: "Tiga model AI menilai setiap kandidat secara independen, mengurangi bias model individu",
    },
    companyFeat3Title: { en: "Candidate Ranking", id: "Ranking Kandidat" },
    companyFeat3Desc: {
      en: "Automatically ranked leaderboard with detailed score breakdowns per candidate",
      id: "Leaderboard otomatis dengan breakdown skor detail per kandidat",
    },
    companyFeat4Title: { en: "Consistency at Scale", id: "Konsistensi dalam Skala" },
    companyFeat4Desc: {
      en: "Every candidate is evaluated with the same criteria \u2014 fair, consistent, and repeatable",
      id: "Setiap kandidat dievaluasi dengan kriteria yang sama \u2014 adil, konsisten, dan bisa diulang",
    },
    companyTrustBatch: { en: "Process up to 50 CVs", id: "Proses hingga 50 CV" },
    companyTrustFair: { en: "Fair & unbiased scoring", id: "Penilaian adil & tanpa bias" },

    getStarted: { en: "Get started", id: "Mulai sekarang" },
    tryNow: { en: "Try now", id: "Coba sekarang" },
    startAnalysis: { en: "Start Analysis", id: "Mulai Analisis" },
    startScreening: { en: "Start Screening", id: "Mulai Screening" },

    // Trust / social proof
    trustTitle: { en: "Trusted by professionals across Indonesia", id: "Dipercaya profesional di seluruh Indonesia" },
    companyTrustTitle: { en: "Trusted by HR teams across Indonesia", id: "Dipercaya tim HR di seluruh Indonesia" },
    trustUsersCount: { en: "2,400+ CVs analyzed", id: "2.400+ CV telah dianalisis" },
    companyTrustUsersCount: { en: "1,200+ candidates screened", id: "1.200+ kandidat telah di-screening" },
    trustRating: { en: "4.8 out of 5", id: "4,8 dari 5" },
    trustReviewCount: { en: "based on 380+ reviews", id: "berdasarkan 380+ review" },
    companyTrustReviewCount: { en: "based on 150+ HR reviews", id: "berdasarkan 150+ review HR" },

    footerTagline: {
      en: "AI-powered CV analysis using GPT, Claude & Gemini for unbiased scoring",
      id: "Analisis CV berbasis AI menggunakan GPT, Claude & Gemini untuk penilaian tanpa bias",
    },
  },

  // ── Form (Individual) ──
  form: {
    title: { en: "Analyze Your CV", id: "Analisis CV Kamu" },
    subtitle: {
      en: "Upload your CV and paste the job description to get a detailed analysis",
      id: "Upload CV kamu dan paste job description untuk mendapatkan analisis detail",
    },
    labelCV: { en: "CV / Resume", id: "CV / Resume" },
    dropText: { en: "Drag & drop your CV or click to browse", id: "Drag & drop CV kamu atau klik untuk browse" },
    dropHover: { en: "Drop your file here", id: "Lepas file di sini" },
    fileTypes: { en: "PDF & DOCX accepted", id: "PDF & DOCX diterima" },
    labelJD: { en: "Job Description / Target Role", id: "Job Description / Target Role" },
    jdPlaceholder: {
      en: "Paste the job description here, or describe your target role...",
      id: "Paste job description di sini, atau deskripsikan target posisi kamu...",
    },
    uploadError: { en: "Please upload a PDF or DOCX file", id: "Upload file PDF atau DOCX" },
    submitBtn: { en: "Analyze My CV", id: "Analisis CV Saya" },
    submitting: { en: "Submitting...", id: "Mengirim..." },
    privacy: {
      en: "Your CV is processed securely and never stored permanently",
      id: "CV kamu diproses dengan aman dan tidak pernah disimpan permanen",
    },
    errorConnect: { en: "Failed to connect to the server", id: "Gagal terhubung ke server" },
    errorStart: { en: "Failed to start analysis", id: "Gagal memulai analisis" },
  },

  // ── Progress view ──
  progress: {
    title: { en: "Analyzing your CV", id: "Menganalisis CV kamu" },
    complete: { en: "complete", id: "selesai" },
    wrapping: { en: "Wrapping up...", id: "Hampir selesai..." },
    almostDone: { en: "Almost done...", id: "Sedikit lagi..." },
    stillWorking: { en: "Still working...", id: "Masih diproses..." },
    lessThan30: { en: "Less than 30 seconds", id: "Kurang dari 30 detik" },
    estimating: { en: "Estimating...", id: "Memperkirakan..." },
    remaining: { en: "remaining", id: "tersisa" },
    yourCV: { en: "Your CV", id: "CV Kamu" },
    targetJob: { en: "Target Job", id: "Target Pekerjaan" },
    connectionIssue: { en: "Connection issue", id: "Masalah koneksi" },
    cancel: { en: "Cancel", id: "Batal" },
  },

  // ── Step labels ──
  steps: {
    upload: { en: "Upload", id: "Upload" },
    analyze: { en: "Analyze", id: "Analisis" },
    score: { en: "Score", id: "Skor" },
    improve: { en: "Improve", id: "Perbaikan" },
    rewrite: { en: "Rewrite", id: "Rewrite" },
    match: { en: "Match", id: "Cocokkan" },
    done: { en: "Done", id: "Selesai" },
  },
  stepActive: {
    started: { en: "Sending your CV to our servers...", id: "Mengirim CV kamu ke server kami..." },
    analyzing: { en: "3 AI models reading your CV...", id: "3 model AI sedang membaca CV kamu..." },
    scoring_complete: { en: "Calculating match against job...", id: "Menghitung kecocokan dengan pekerjaan..." },
    improving: { en: "Generating personalized advice...", id: "Membuat saran perbaikan personal..." },
    resume_generated: { en: "Building your optimized CV...", id: "Membuat CV yang sudah dioptimasi..." },
    jobs_found: { en: "Finding relevant job openings...", id: "Mencari lowongan kerja yang relevan..." },
  },

  // ── Results ──
  results: {
    greeting: { en: "Hi, {name}!", id: "Halo, {name}!" },
    matchText: { en: "Here's how your CV matches the", id: "Ini hasil kecocokan CV kamu dengan posisi" },
    role: { en: "role", id: "" },
    targetRole: { en: "target", id: "target" },
    currentScore: { en: "Current Score", id: "Skor Saat Ini" },
    potential: { en: "Potential", id: "Potensi" },
    analysisFailed: { en: "Analysis Failed", id: "Analisis Gagal" },
    unknownError: { en: "An unknown error occurred", id: "Terjadi kesalahan yang tidak diketahui" },
    tryAgain: { en: "Try Again", id: "Coba Lagi" },
    analyzeAnother: { en: "Analyze Another CV", id: "Analisis CV Lain" },

    // Tab labels
    overview: { en: "Overview", id: "Ringkasan" },
    improvements: { en: "Improvements", id: "Perbaikan" },
    improvedCV: { en: "Improved CV", id: "CV Perbaikan" },
    jobMatches: { en: "Job Matches", id: "Lowongan Cocok" },
  },

  // ── Rotating tips ──
  tips: [
    {
      en: "75% of resumes are rejected by ATS before a human sees them",
      id: "75% resume ditolak ATS sebelum dilihat oleh manusia",
    },
    {
      en: "Quantifying achievements can increase your interview callback rate by 40%",
      id: "Mengukur pencapaian bisa meningkatkan callback rate interview kamu hingga 40%",
    },
    {
      en: "CekCV.Ai uses 3 different AI models to reduce scoring bias",
      id: "CekCV.Ai menggunakan 3 model AI berbeda untuk mengurangi bias penilaian",
    },
    {
      en: "Matching keywords from the job description is the #1 ATS optimization",
      id: "Mencocokkan keyword dari job description adalah optimasi ATS #1",
    },
    {
      en: "Recruiters spend an average of 7 seconds on initial resume screening",
      id: "Recruiter rata-rata menghabiskan 7 detik untuk screening awal resume",
    },
    {
      en: "Tailoring your resume for each application can double your response rate",
      id: "Menyesuaikan resume untuk setiap lamaran bisa menggandakan response rate kamu",
    },
    {
      en: "Using action verbs like 'Led', 'Delivered', 'Increased' makes your resume stand out",
      id: "Gunakan kata kerja aksi seperti 'Memimpin', 'Menghasilkan', 'Meningkatkan' agar resume kamu menonjol",
    },
    {
      en: "A well-structured resume with clear sections scores 30% higher in ATS systems",
      id: "Resume yang terstruktur rapi dengan section yang jelas mendapat skor 30% lebih tinggi di sistem ATS",
    },
    {
      en: "Including measurable results (e.g., 'Grew revenue by 25%') catches a recruiter's eye",
      id: "Cantumkan hasil terukur (misal, 'Meningkatkan revenue 25%') untuk menarik perhatian recruiter",
    },
    {
      en: "Your resume is being analyzed by GPT, Claude, and Gemini simultaneously",
      id: "Resume kamu sedang dianalisis oleh GPT, Claude, dan Gemini secara bersamaan",
    },
  ],

  // ── Testimonials (Indonesian professionals) ──
  testimonials: [
    {
      name: "Rina Wijaya",
      role: { en: "Product Manager at Tokopedia", id: "Product Manager di Tokopedia" },
      text: {
        en: "I was skeptical at first, but the AI feedback was incredibly specific. My callback rate doubled after applying the suggestions.",
        id: "Awalnya agak ragu, tapi feedback AI-nya sangat spesifik. Callback rate saya naik 2x setelah menerapkan sarannya.",
      },
      rating: 5,
    },
    {
      name: "Budi Santoso",
      role: { en: "Software Engineer at Gojek", id: "Software Engineer di Gojek" },
      text: {
        en: "The ATS scoring opened my eyes \u2014 I had no idea my CV was missing so many keywords. Got 3 interview calls within a week.",
        id: "Skor ATS-nya membuka mata saya \u2014 saya nggak sadar CV saya kurang banyak keyword. Dapat 3 panggilan interview dalam seminggu.",
      },
      rating: 5,
    },
    {
      name: "Sari Putri",
      role: { en: "Marketing Lead at Bukalapak", id: "Marketing Lead di Bukalapak" },
      text: {
        en: "Finally a CV tool that actually understands the Indonesian job market. The job matching feature is a game-changer.",
        id: "Akhirnya ada tool CV yang paham market kerja Indonesia. Fitur job matching-nya benar-benar game-changer.",
      },
      rating: 5,
    },
    {
      name: "Arief Rahman",
      role: { en: "Data Analyst at Traveloka", id: "Data Analyst di Traveloka" },
      text: {
        en: "Used it before applying to my dream job. The improved CV version got me past the ATS screening for the first time.",
        id: "Saya pakai sebelum apply ke dream job saya. Versi CV yang sudah diperbaiki berhasil lolos ATS screening untuk pertama kalinya.",
      },
      rating: 4,
    },
  ],
  // ── Company Testimonials (HR professionals) ──
  companyTestimonials: [
    {
      name: "Diana Kusuma",
      role: { en: "HR Manager at Tokopedia", id: "HR Manager di Tokopedia" },
      text: {
        en: "We used to spend 3 days screening 200+ CVs. Now we get a ranked shortlist in under an hour. The AI scoring is surprisingly consistent.",
        id: "Dulu kami butuh 3 hari untuk screening 200+ CV. Sekarang dapat shortlist ter-ranking dalam kurang dari satu jam. Scoring AI-nya konsisten banget.",
      },
      rating: 5,
    },
    {
      name: "Fajar Hidayat",
      role: { en: "Talent Acquisition Lead at Gojek", id: "Talent Acquisition Lead di Gojek" },
      text: {
        en: "The multi-model approach gives us more confidence in the rankings. No single AI bias — it's like having 3 independent reviewers.",
        id: "Pendekatan multi-model memberi kami lebih percaya diri dengan ranking-nya. Tidak ada bias AI tunggal — seperti punya 3 reviewer independen.",
      },
      rating: 5,
    },
    {
      name: "Mega Anggraini",
      role: { en: "People Operations at Bukalapak", id: "People Operations di Bukalapak" },
      text: {
        en: "Finally, a screening tool that evaluates candidates fairly. The detailed breakdown per candidate saves us hours of manual review.",
        id: "Akhirnya ada tool screening yang menilai kandidat secara adil. Breakdown detail per kandidat menghemat waktu review manual berjam-jam.",
      },
      rating: 5,
    },
    {
      name: "Rendi Pratama",
      role: { en: "Recruitment Specialist at Traveloka", id: "Recruitment Specialist di Traveloka" },
      text: {
        en: "We integrated CekCV into our hiring pipeline. The batch upload feature alone cut our screening time by 80%.",
        id: "Kami integrasikan CekCV ke pipeline hiring kami. Fitur batch upload saja sudah memangkas waktu screening 80%.",
      },
      rating: 4,
    },
  ],
} as const;

// Helper to get a translated value
export function t(
  obj: { en: string; id: string } | undefined,
  locale: Locale
): string {
  if (!obj) return "";
  return obj[locale] || obj.en;
}
