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
      en: "Score your CV against any job description, get actionable improvements, an AI-rewritten resume, and matching LinkedIn job openings \u2014 all in one analysis.",
      id: "Skor CV kamu terhadap job description apapun, dapatkan saran perbaikan, resume yang di-rewrite AI, dan lowongan kerja LinkedIn yang cocok \u2014 semua dalam satu analisis.",
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
      en: "ATS score, missing keywords, an improved CV, and matching LinkedIn job openings",
      id: "Skor ATS, keyword yang kurang, CV yang lebih baik, dan lowongan kerja LinkedIn yang cocok",
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
    feat4Title: { en: "LinkedIn Job Matching", id: "LinkedIn Job Matching" },
    feat4Desc: {
      en: "Discover relevant LinkedIn openings that match your profile, pulled directly from LinkedIn Jobs",
      id: "Temukan lowongan LinkedIn yang cocok dengan profil kamu, diambil langsung dari LinkedIn Jobs",
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

    // Why 3 AI models
    whyTitle: { en: "Why 3 AI models?", id: "Kenapa 3 model AI?" },
    whySubtitle: {
      en: "Each AI has blind spots. By combining GPT, Claude & Gemini, we reduce bias and catch what a single model misses.",
      id: "Setiap AI punya titik buta. Dengan menggabungkan GPT, Claude & Gemini, kami mengurangi bias dan menangkap apa yang terlewat oleh satu model saja.",
    },
    whyGptTitle: { en: "GPT-4o", id: "GPT-4o" },
    whyGptDesc: {
      en: "Strong at understanding context, job requirements, and nuanced language in CVs",
      id: "Kuat dalam memahami konteks, persyaratan kerja, dan nuansa bahasa dalam CV",
    },
    whyClaudeTitle: { en: "Claude Sonnet", id: "Claude Sonnet" },
    whyClaudeDesc: {
      en: "Excels at structured analysis, careful reasoning, and identifying subtle skill gaps",
      id: "Unggul dalam analisis terstruktur, penalaran cermat, dan mengidentifikasi skill gap yang halus",
    },
    whyGeminiTitle: { en: "Gemini Pro", id: "Gemini Pro" },
    whyGeminiDesc: {
      en: "Great at cross-referencing data, multilingual CVs, and pattern recognition",
      id: "Hebat dalam cross-referencing data, CV multibahasa, dan pengenalan pola",
    },
    whyConsensus: {
      en: "Final score = weighted consensus of all three models. No single AI decides your fate.",
      id: "Skor akhir = konsensus berbobot dari ketiga model. Tidak ada satu AI pun yang menentukan nasib kamu.",
    },
    whyConsensusCompany: {
      en: "Each candidate is scored by all three models independently, then ranked by consensus — eliminating individual AI bias from your hiring decisions.",
      id: "Setiap kandidat dinilai oleh ketiga model secara independen, lalu di-ranking berdasarkan konsensus — menghilangkan bias AI dari keputusan rekrutmen kamu.",
    },

    // FAQ
    faqTitle: { en: "Frequently Asked Questions", id: "Pertanyaan yang Sering Diajukan" },
    faqDataSafeQ: { en: "Is my data safe?", id: "Apakah data saya aman?" },
    faqDataSafeA: {
      en: "Yes. Your CV is sent directly to AI services for analysis and is never stored on our servers. The file is processed in-session and discarded immediately after.",
      id: "Ya. CV kamu dikirim langsung ke layanan AI untuk dianalisis dan tidak pernah disimpan di server kami. File diproses dalam sesi dan langsung dihapus setelahnya.",
    },
    faqFormatQ: { en: "What format should my CV be?", id: "Format apa yang harus digunakan untuk CV?" },
    faqFormatA: {
      en: "We accept PDF files. For best results, use a standard single or two-column layout without tables, images, or headers/footers — these are the same formats that pass ATS systems.",
      id: "Kami menerima file PDF. Untuk hasil terbaik, gunakan layout standar satu atau dua kolom tanpa tabel, gambar, atau header/footer — format yang sama yang lolos sistem ATS.",
    },
    faqAccuracyQ: { en: "How accurate is the scoring?", id: "Seberapa akurat scoring-nya?" },
    faqAccuracyA: {
      en: "By using 3 independent AI models and averaging their scores, we reduce individual model bias significantly. Our scoring correlates strongly with real ATS systems like Workday, Lever, and Greenhouse.",
      id: "Dengan menggunakan 3 model AI independen dan merata-ratakan skor mereka, kami mengurangi bias model individu secara signifikan. Scoring kami berkorelasi kuat dengan sistem ATS seperti Workday, Lever, dan Greenhouse.",
    },
    faqJdRequiredQ: { en: "Do I need a job description?", id: "Apakah harus ada job description?" },
    faqJdRequiredA: {
      en: "Yes — the job description is what we score your CV against. You can paste it directly or provide a LinkedIn job posting link and we'll extract it automatically.",
      id: "Ya — job description adalah acuan untuk menilai CV kamu. Kamu bisa paste langsung atau berikan link lowongan LinkedIn dan kami akan mengekstraknya secara otomatis.",
    },
    faqCostQ: { en: "Is it free?", id: "Apakah gratis?" },
    faqCostA: {
      en: "Yes, CekCV is completely free to use. No sign-up, no credit card, no limits.",
      id: "Ya, CekCV sepenuhnya gratis. Tanpa daftar, tanpa kartu kredit, tanpa batasan.",
    },
    faqTimeQ: { en: "How long does the analysis take?", id: "Berapa lama analisisnya?" },
    faqTimeA: {
      en: "Individual analysis takes about 2-3 minutes. Company batch screening depends on the number of CVs — roughly 45 seconds per candidate.",
      id: "Analisis individu memakan waktu sekitar 2-3 menit. Screening batch perusahaan tergantung jumlah CV — kira-kira 45 detik per kandidat.",
    },

    // Built with n8n
    builtWithTitle: { en: "Built with n8n", id: "Dibangun dengan n8n" },
    builtWithSubtitle: {
      en: "The entire AI pipeline is powered by n8n workflow automation",
      id: "Seluruh pipeline AI didukung oleh automasi workflow n8n",
    },
    builtWithStep1: { en: "CV files received via webhook", id: "File CV diterima via webhook" },
    builtWithStep2: { en: "PDF parsed & text extracted", id: "PDF di-parse & teks diekstrak" },
    builtWithStep3: { en: "Sent to GPT, Claude & Gemini in parallel", id: "Dikirim ke GPT, Claude & Gemini secara paralel" },
    builtWithStep4: { en: "Scores aggregated & weighted", id: "Skor diagregasi & diberi bobot" },
    builtWithStep5: { en: "Results returned to frontend", id: "Hasil dikembalikan ke frontend" },
    builtWithNodes: { en: "{count}+ nodes across 2 workflows", id: "{count}+ node di 2 workflow" },
    builtWithIntegrations: { en: "3 AI providers + LinkedIn Jobs API", id: "3 provider AI + LinkedIn Jobs API" },

    getStarted: { en: "Get started", id: "Mulai sekarang" },
    tryNow: { en: "Try now", id: "Coba sekarang" },
    startAnalysis: { en: "Start Analysis", id: "Mulai Analisis" },
    startScreening: { en: "Start Batch Screening", id: "Mulai Batch Screening" },

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
    disclaimer: {
      en: "This project was built for the N8N Automation Competition by Anjas Maradita \u2014 Belajar AI Indonesia. All names, companies, and testimonials shown are fictional and for demonstration purposes only. Files are processed in-session and not permanently stored.",
      id: "Proyek ini dibuat untuk Kompetisi Automasi N8N Anjas Maradita \u2014 Belajar AI Indonesia. Semua nama, perusahaan, dan testimoni yang ditampilkan adalah fiktif dan hanya untuk keperluan demo. File diproses dalam sesi dan tidak disimpan secara permanen.",
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
    fileTypes: { en: "PDF accepted", id: "PDF diterima" },
    labelJD: { en: "Job Description / Target Role", id: "Job Description / Target Role" },
    jdPlaceholder: {
      en: "Paste the job description here, or describe your target role...",
      id: "Paste job description di sini, atau deskripsikan target posisi kamu...",
    },
    jdOrLabel: { en: "Or", id: "Atau" },
    jdLinkedinPlaceholder: {
      en: "Paste LinkedIn job posting link...",
      id: "Paste link lowongan LinkedIn...",
    },
    jdLinkedinExample: { en: "e.g. linkedin.com/jobs/view/12345", id: "cth. linkedin.com/jobs/view/12345" },
    uploadError: { en: "Please upload a PDF file", id: "Upload file PDF" },
    submitBtn: { en: "Analyze My CV", id: "Analisis CV Saya" },
    submitting: { en: "Submitting...", id: "Mengirim..." },
    privacy: {
      en: "Your CV is processed securely and never stored permanently",
      id: "CV kamu diproses dengan aman dan tidak pernah disimpan permanen",
    },
    errorConnect: { en: "Failed to connect to the server", id: "Gagal terhubung ke server" },
    errorStart: { en: "Failed to start analysis", id: "Gagal memulai analisis" },
    validationError: {
      en: "Please upload your CV/Resume and provide either a Job Description or a LinkedIn job posting link.",
      id: "Silakan upload CV/Resume kamu dan isi Job Description atau link lowongan LinkedIn.",
    },
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
    nMore: { en: "more", id: "lainnya" },
    connectionIssue: { en: "Connection issue", id: "Masalah koneksi" },
    cancel: { en: "Cancel", id: "Batal" },
  },

  // ── Form (Company) ──
  companyForm: {
    title: { en: "Batch Candidate Screening", id: "Screening Kandidat Massal" },
    subtitle: {
      en: "Upload multiple CVs and a job description to rank candidates by fit",
      id: "Upload beberapa CV dan job description untuk me-ranking kandidat",
    },
    labelRole: { en: "Role Name", id: "Nama Posisi" },
    rolePlaceholder: { en: "e.g. Senior Software Engineer", id: "cth. Senior Software Engineer" },
    labelJD: { en: "Job Description", id: "Job Description" },
    jdPlaceholder: { en: "Paste the full job description...", id: "Paste job description lengkap..." },
    jdOrLabel: { en: "Or", id: "Atau" },
    jdLinkedinPlaceholder: {
      en: "Paste LinkedIn job posting link...",
      id: "Paste link lowongan LinkedIn...",
    },
    jdLinkedinExample: { en: "e.g. linkedin.com/jobs/view/12345", id: "cth. linkedin.com/jobs/view/12345" },
    labelCVs: { en: "Candidate CVs", id: "CV Kandidat" },
    dropText: { en: "Drag & drop CVs or click to browse", id: "Drag & drop CV atau klik untuk browse" },
    dropHover: { en: "Drop files here", id: "Lepas file di sini" },
    fileTypes: { en: "PDF accepted \u00b7 Max 5 files", id: "PDF diterima \u00b7 Maks 5 file" },
    uploadError: { en: "Only PDF files are accepted", id: "Hanya file PDF yang diterima" },
    maxFilesError: { en: "Maximum 5 CVs allowed per batch", id: "Maksimal 5 CV per batch" },
    filesSelected: { en: "{count} file(s) selected", id: "{count} file dipilih" },
    removeFile: { en: "Remove", id: "Hapus" },
    submitBtn: { en: "Screen {count} Candidate(s)", id: "Screening {count} Kandidat" },
    submitting: { en: "Submitting...", id: "Mengirim..." },
    privacy: {
      en: "CVs are processed securely and never stored permanently",
      id: "CV diproses dengan aman dan tidak pernah disimpan permanen",
    },
    errorConnect: { en: "Failed to connect to the server", id: "Gagal terhubung ke server" },
    errorStart: { en: "Failed to start screening", id: "Gagal memulai screening" },
    validationError: {
      en: "Please fill in the Role Name and provide either a Job Description or a LinkedIn job posting link.",
      id: "Silakan isi Nama Posisi dan berikan Job Description atau link lowongan LinkedIn.",
    },
    // Progress
    progressTitle: { en: "Screening Candidates", id: "Sedang Screening Kandidat" },
    progressStarting: { en: "Starting batch analysis...", id: "Memulai analisis batch..." },
    progressBatch: { en: "Processing batch of {count} CVs...", id: "Memproses {count} CV secara batch..." },
    progressAnalyzing: { en: "Analyzing candidate CVs...", id: "Menganalisis CV kandidat..." },
    progressScoring: { en: "Scoring candidates against job requirements...", id: "Menilai kandidat terhadap persyaratan kerja..." },
    progressRanking: { en: "Ranking candidates by fit...", id: "Meranking kandidat berdasarkan kecocokan..." },
    progressCandidate: { en: "Candidate {current} of {total}", id: "Kandidat {current} dari {total}" },
    // Error
    errorTitle: { en: "Screening Failed", id: "Screening Gagal" },
    errorUnknown: { en: "An unknown error occurred", id: "Terjadi kesalahan yang tidak diketahui" },
    tryAgain: { en: "Try Again", id: "Coba Lagi" },
    // Results
    resultsTitle: { en: "Screening Results", id: "Hasil Screening" },
    candidatesRanked: { en: "{count} candidate(s) ranked by score", id: "{count} kandidat diurutkan berdasarkan skor" },
    strengths: { en: "Strengths", id: "Kekuatan" },
    gaps: { en: "Gaps", id: "Kekurangan" },
    score: { en: "score", id: "skor" },
    noResults: { en: "No candidate results available. The batch may still be processing.", id: "Belum ada hasil kandidat. Batch mungkin masih diproses." },
    screenMore: { en: "Screen More Candidates", id: "Screening Kandidat Lagi" },
    cancel: { en: "Cancel", id: "Batal" },
    // Dashboard
    searchPlaceholder: { en: "Search candidates...", id: "Cari kandidat..." },
    filterAll: { en: "All", id: "Semua" },
    filterShortlist: { en: "Shortlist", id: "Shortlist" },
    filterReview: { en: "Review", id: "Review" },
    filterReject: { en: "Reject", id: "Tolak" },
    sortBy: { en: "Sort by:", id: "Urutkan:" },
    sortScore: { en: "Score", id: "Skor" },
    sortName: { en: "Name", id: "Nama" },
    sortStatus: { en: "Status", id: "Status" },
    share: { en: "Share", id: "Bagikan" },
    copied: { en: "Copied!", id: "Tersalin!" },
    exportCSV: { en: "Export CSV", id: "Ekspor CSV" },
    printPDF: { en: "Print / PDF", id: "Cetak / PDF" },
    compare: { en: "Compare", id: "Bandingkan" },
    compareCandidates: { en: "Compare Candidates", id: "Bandingkan Kandidat" },
    backToList: { en: "Back to list", id: "Kembali" },
    noFilterMatch: { en: "No candidates match your filters", id: "Tidak ada kandidat yang cocok dengan filter" },
    overall: { en: "Overall", id: "Keseluruhan" },
    mustHave: { en: "Must-Have", id: "Wajib" },
    niceToHave: { en: "Nice-to-Have", id: "Nilai Tambah" },
    source: { en: "Source", id: "Sumber" },
    email: { en: "Email", id: "Email" },
    whatsapp: { en: "WhatsApp", id: "WhatsApp" },
  },

  // ── Step labels ──
  steps: {
    upload: { en: "Upload", id: "Unggah" },
    analyze: { en: "Analyze", id: "Analisis" },
    score: { en: "Score", id: "Skor" },
    improve: { en: "Improve", id: "Perbaikan" },
    rewrite: { en: "Rewrite", id: "Tulis Ulang" },
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

    // ATS tooltip explanations
    atsTooltipHigh: {
      en: "Your CV meets the key requirements for this role. ATS systems would likely advance it to the recruiter.",
      id: "CV kamu memenuhi persyaratan utama untuk posisi ini. Sistem ATS kemungkinan besar akan meneruskannya ke recruiter.",
    },
    atsTooltipMid: {
      en: "Your CV partially matches this role. ATS systems may flag it for manual review, but it's not a strong pass.",
      id: "CV kamu sebagian cocok dengan posisi ini. Sistem ATS mungkin menandainya untuk review manual, tapi belum cukup kuat untuk lolos.",
    },
    atsTooltipLow: {
      en: "Your CV lacks critical keywords and qualifications for this role. Most ATS systems would filter it out before a recruiter sees it.",
      id: "CV kamu kurang keyword dan kualifikasi penting untuk posisi ini. Sebagian besar sistem ATS akan menyaringnya sebelum dilihat recruiter.",
    },

    // Tab labels
    overview: { en: "Overview", id: "Ringkasan" },
    improvements: { en: "Improvements", id: "Perbaikan" },
    improvedCV: { en: "Improved CV", id: "CV Perbaikan" },
    jobMatches: { en: "Job Matches", id: "Lowongan Cocok" },
    next: { en: "Next", id: "Lanjut" },

    // Overview tab
    skillMatchProfile: { en: "Skill Match Profile", id: "Profil Kecocokan Skill" },
    scoreBreakdown: { en: "Score Breakdown", id: "Rincian Skor" },
    strengths: { en: "Strengths", id: "Kekuatan" },
    gapsToAddress: { en: "Gaps to Address", id: "Kekurangan yang Perlu Diperbaiki" },
    outOf100: { en: "out of 100", id: "dari 100" },
    potentialLabel: { en: "Potential", id: "Potensi" },
    points: { en: "points", id: "poin" },
    matchPct: { en: "match", id: "kecocokan" },
    ofPoints: { en: "of", id: "dari" },
    loadingChart: { en: "Loading chart...", id: "Memuat grafik..." },

    // Improvements tab
    howToImprove: { en: "How to improve your CV for", id: "Cara meningkatkan CV kamu untuk" },
    thisRole: { en: "this role", id: "posisi ini" },
    applied: { en: "applied", id: "diterapkan" },
    estScore: { en: "est. score", id: "est. skor" },
    highestImpact: { en: "Highest impact changes", id: "Perubahan berdampak tertinggi" },
    missingKeywords: { en: "Missing Keywords", id: "Keyword yang Kurang" },
    additionalSuggestions: { en: "Additional Suggestions", id: "Saran Tambahan" },
    atsFormattingTips: { en: "ATS Formatting Tips", id: "Tips Format ATS" },
    highImpact: { en: "High Impact", id: "Dampak Tinggi" },
    mediumImpact: { en: "Medium", id: "Sedang" },
    lowImpact: { en: "Low", id: "Rendah" },

    // Resume tab
    cvOptimizedFor: { en: "Your CV, optimized for", id: "CV kamu, dioptimasi untuk" },
    cvGenerated: { en: "Your improved CV has been generated", id: "CV kamu yang sudah diperbaiki telah dibuat" },
    cvOptimizedDesc: {
      en: "Optimized with targeted keywords and restructured for maximum ATS compatibility",
      id: "Dioptimasi dengan keyword yang tepat dan direstruktur untuk kompatibilitas ATS maksimal",
    },
    savePDF: { en: "Save PDF", id: "Simpan PDF" },
    downloadCV: { en: "Download CV", id: "Unduh CV" },
    processing: { en: "Processing...", id: "Memproses..." },
    resumeGenFailed: {
      en: "Resume generation failed — please try analyzing again",
      id: "Pembuatan CV gagal — silakan coba analisis ulang",
    },
    scoreImpact: {
      en: "Applying these changes can raise your score from",
      id: "Menerapkan perubahan ini dapat menaikkan skor kamu dari",
    },
    to: { en: "to", id: "menjadi" },
    pts: { en: "pts", id: "poin" },
    changesMade: { en: "Changes made to match this role", id: "Perubahan yang dilakukan untuk posisi ini" },
    keywordsAdded: { en: "Keywords added to your CV", id: "Keyword yang ditambahkan ke CV kamu" },

    // Jobs tab
    similarRoles: { en: "Jobs you're qualified for", id: "Lowongan yang cocok untuk kamu" },
    similarRolesDesc: {
      en: "Based on your CV, we think you'd be a strong candidate for these roles — all posted in the last 7 days.",
      id: "Berdasarkan CV kamu, kami yakin kamu kandidat yang kuat untuk posisi-posisi ini — semua diposting dalam 7 hari terakhir.",
    },
    foundJobs: { en: "{count} jobs found", id: "{count} lowongan ditemukan" },
    forQuery: { en: "for", id: "untuk" },
    strong: { en: "strong", id: "kuat" },
    moderate: { en: "moderate", id: "sedang" },
    low: { en: "low", id: "rendah" },
    findingJobs: { en: "Searching jobs based on your CV...", id: "Mencari lowongan berdasarkan CV kamu..." },
    noJobsFound: { en: "No matching jobs found for this role", id: "Tidak ada lowongan yang cocok untuk posisi ini" },
    jobsAvailableLater: {
      en: "Job matching will be available once the search completes",
      id: "Pencocokan lowongan akan tersedia setelah pencarian selesai",
    },
    searchFor: { en: "Search keywords", id: "Kata kunci pencarian" },
    searchJobsBtn: { en: "Search LinkedIn Jobs", id: "Cari Lowongan LinkedIn" },
    jobSearchCta: {
      en: "Find jobs that match your CV",
      id: "Temukan lowongan yang cocok dengan CV kamu",
    },
    jobSearchCtaDesc: {
      en: "We'll search LinkedIn for recent openings (last 7 days) based on the skills and experience from your CV. Typically returns 10\u201320 results.",
      id: "Kami akan mencari lowongan terbaru di LinkedIn (7 hari terakhir) berdasarkan skill dan pengalaman dari CV kamu. Biasanya menghasilkan 10\u201320 hasil.",
    },
    jobSearchNote: {
      en: "Search takes about 1\u20132 minutes",
      id: "Pencarian membutuhkan sekitar 1\u20132 menit",
    },
  },

  // ── ATS Guide (floating panel on results page) ──
  atsGuide: {
    btnLabel: { en: "ATS Guide", id: "Panduan ATS" },
    title: { en: "Understanding Your ATS Score", id: "Memahami Skor ATS Kamu" },
    subtitle: {
      en: "Learn what your score means and how ATS systems work",
      id: "Pelajari arti skor kamu dan cara kerja sistem ATS",
    },

    // Personalized verdict
    yourScore: { en: "Your score", id: "Skor kamu" },
    verdictHigh: {
      en: "Your CV is well-matched for this role. Most ATS systems would advance it to a recruiter for review.",
      id: "CV kamu cocok dengan posisi ini. Sebagian besar sistem ATS akan meneruskannya ke recruiter.",
    },
    verdictMid: {
      en: "Your CV partially matches this role. Some ATS systems may flag it for manual review, but it's not a confident pass. Focus on the missing keywords and improvements.",
      id: "CV kamu sebagian cocok dengan posisi ini. Beberapa sistem ATS mungkin menandainya untuk review manual, tapi belum cukup kuat untuk lolos. Fokus pada keyword yang kurang dan saran perbaikan.",
    },
    verdictLow: {
      en: "Your CV is missing critical keywords and qualifications for this role. Most ATS systems would filter it out before a recruiter ever sees it.",
      id: "CV kamu kurang keyword dan kualifikasi penting untuk posisi ini. Sebagian besar sistem ATS akan menyaringnya sebelum dilihat recruiter.",
    },

    // Potential score explanation
    potentialTitle: { en: "About your potential score", id: "Tentang skor potensi kamu" },
    potentialExplainGood: {
      en: "With the suggested improvements, your score could reach {potential}, which puts you in a strong position to pass ATS screening.",
      id: "Dengan saran perbaikan yang diberikan, skor kamu bisa mencapai {potential}, yang menempatkan kamu di posisi kuat untuk lolos ATS screening.",
    },
    potentialExplainOk: {
      en: "Even with all improvements applied, your score would reach around {potential}. This is still in the 'maybe' zone for ATS \u2014 your CV may get reviewed, but isn't a strong pass. Consider gaining more relevant experience or certifications for this specific role.",
      id: "Bahkan dengan semua perbaikan yang diterapkan, skor kamu akan mencapai sekitar {potential}. Ini masih di zona 'mungkin' untuk ATS \u2014 CV kamu mungkin akan di-review, tapi belum cukup kuat. Pertimbangkan untuk menambah pengalaman atau sertifikasi yang relevan untuk posisi ini.",
    },
    potentialExplainLow: {
      en: "Even with all improvements, your score would only reach around {potential}. This means there's a fundamental gap between your current profile and this role's requirements \u2014 ATS would likely still filter you out. This doesn't mean you're not capable! Consider: applying for a more junior version of this role, gaining specific skills listed in the JD, or targeting roles that better match your current experience.",
      id: "Bahkan dengan semua perbaikan, skor kamu hanya bisa mencapai sekitar {potential}. Ini berarti ada gap fundamental antara profil kamu saat ini dan persyaratan posisi ini \u2014 ATS kemungkinan masih akan menyaring kamu. Ini bukan berarti kamu tidak mampu! Pertimbangkan: melamar posisi yang lebih junior, menambah skill spesifik dari JD, atau menargetkan posisi yang lebih sesuai dengan pengalaman kamu saat ini.",
    },

    // Score ranges section
    scaleTitle: { en: "ATS Score Ranges", id: "Rentang Skor ATS" },
    range70: { en: "70\u2013100: Likely to pass ATS", id: "70\u2013100: Kemungkinan besar lolos ATS" },
    range70Desc: {
      en: "Your CV matches most key requirements. Recruiters will likely see it.",
      id: "CV kamu cocok dengan sebagian besar persyaratan utama. Recruiter kemungkinan besar akan melihatnya.",
    },
    range50: { en: "50\u201369: Borderline", id: "50\u201369: Garis batas" },
    range50Desc: {
      en: "May pass some ATS systems but not others. Often lands in the 'maybe' pile for manual review.",
      id: "Mungkin lolos beberapa sistem ATS tapi tidak semua. Sering masuk tumpukan 'mungkin' untuk review manual.",
    },
    range0: { en: "0\u201349: Likely filtered out", id: "0\u201349: Kemungkinan besar tersaring" },
    range0Desc: {
      en: "Most ATS systems would reject this CV before a human sees it. Major keyword gaps or qualification mismatches.",
      id: "Sebagian besar sistem ATS akan menolak CV ini sebelum dilihat manusia. Ada gap besar pada keyword atau kualifikasi.",
    },

    // FAQ section
    faqTitle: { en: "Common Questions", id: "Pertanyaan Umum" },
    faq1Q: { en: "What is an ATS?", id: "Apa itu ATS?" },
    faq1A: {
      en: "An Applicant Tracking System (ATS) is software that companies use to scan, filter, and rank resumes before a human recruiter ever sees them. Over 75% of large companies use an ATS.",
      id: "Applicant Tracking System (ATS) adalah software yang digunakan perusahaan untuk memindai, menyaring, dan meranking resume sebelum recruiter melihatnya. Lebih dari 75% perusahaan besar menggunakan ATS.",
    },
    faq2Q: { en: "Why is my score low?", id: "Kenapa skor saya rendah?" },
    faq2A: {
      en: "A low score usually means your CV is missing keywords from the job description, lacks quantified achievements, or has formatting that ATS can't parse well. Check the Improvements tab for specific fixes.",
      id: "Skor rendah biasanya berarti CV kamu kurang keyword dari job description, tidak punya pencapaian yang terukur, atau formatnya sulit dibaca ATS. Cek tab Perbaikan untuk saran spesifik.",
    },
    faq3Q: {
      en: "Can I still get the job with a low score?",
      id: "Apakah masih bisa dapat kerja dengan skor rendah?",
    },
    faq3A: {
      en: "Yes! ATS is just the first filter. If you can get a referral, reach the hiring manager directly, or apply through channels that bypass ATS (like company career events), your score matters less. Networking fills 80% of positions.",
      id: "Bisa! ATS hanyalah filter pertama. Kalau kamu bisa dapat referral, menghubungi hiring manager langsung, atau melamar lewat jalur yang bypass ATS (seperti career event perusahaan), skor kamu kurang berpengaruh. Networking mengisi 80% posisi.",
    },
    faq4Q: {
      en: "Why can't improvements get me to 100?",
      id: "Kenapa perbaikan tidak bisa membuat skor saya 100?",
    },
    faq4A: {
      en: "CV improvements can only optimize how you present your existing experience. If the role requires 5 years of experience and you have 2, or requires certifications you don't have, no amount of rewording will close that gap. The potential score shows the realistic ceiling with your current background.",
      id: "Perbaikan CV hanya bisa mengoptimalkan cara kamu mempresentasikan pengalaman yang ada. Kalau posisi membutuhkan 5 tahun pengalaman dan kamu punya 2, atau butuh sertifikasi yang belum kamu punya, tidak ada revisi kata-kata yang bisa menutup gap itu. Skor potensi menunjukkan batas realistis dengan latar belakang kamu saat ini.",
    },
  },

  // ── Job search tips (shown while searching) ──
  jobTips: [
    {
      en: "Tailor your cover letter for each application \u2014 generic ones get ignored",
      id: "Sesuaikan cover letter untuk setiap lamaran \u2014 yang generik sering diabaikan",
    },
    {
      en: "Apply within 24 hours of a posting for the best chance of being seen",
      id: "Lamar dalam 24 jam sejak lowongan diposting untuk peluang terbaik dilihat recruiter",
    },
    {
      en: "Follow the company on LinkedIn before applying \u2014 it shows genuine interest",
      id: "Follow perusahaan di LinkedIn sebelum melamar \u2014 ini menunjukkan ketertarikan asli",
    },
    {
      en: "80% of jobs are filled through networking, not job boards",
      id: "80% lowongan diisi melalui networking, bukan job board",
    },
    {
      en: "Reach out to the hiring manager directly \u2014 a short, personal message stands out",
      id: "Hubungi hiring manager langsung \u2014 pesan singkat dan personal akan menonjol",
    },
    {
      en: "Prepare 2\u20133 questions about the role before applying \u2014 it sharpens your pitch",
      id: "Siapkan 2\u20133 pertanyaan tentang posisi sebelum melamar \u2014 ini mempertajam pitch kamu",
    },
    {
      en: "Use the exact job title from the posting in your application \u2014 ATS matches keywords",
      id: "Gunakan judul posisi yang sama persis dari lowongan \u2014 ATS mencocokkan keyword",
    },
    {
      en: "Research the company\u2019s recent news \u2014 mentioning it in your cover letter shows initiative",
      id: "Riset berita terbaru perusahaan \u2014 menyebutkannya di cover letter menunjukkan inisiatif",
    },
  ],

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
