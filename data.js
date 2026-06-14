// Khazana King OTT - Catalog Database


window.movieData = [
  // FEATURED & TRENDING MOVIES
  {
    id: "m1",
    title: "Sintel: Quest for the Dragon",
    type: "movie",
    description: "A lonely young woman named Sintel rescues a baby dragon she names Scales. When Scales is kidnapped by an adult dragon, Sintel embarks on a treacherous quest to rescue her companion.",
    rating: "8.9",
    year: 2025,
    genres: ["Action", "Drama", "Thriller"],
    language: "English",
    country: "Netherlands",
    duration: "15m 48s",
    banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    cast: ["Sintel", "Scales", "The Shaman"],
    trending: true,
    popular: true,
    topRated: true,
    recommended: true,
    isLatest: true,
    tagline: "A bond forged in fire. A search without limits."
  },
  {
    id: "m2",
    title: "Tears of Steel: The Cybernetic Age",
    type: "movie",
    description: "Set in a dystopian future Amsterdam, a group of scientists and soldiers attempt to salvage a broken relationship to prevent giant robotic spiders from destroying the planet.",
    rating: "8.7",
    year: 2024,
    genres: ["Action", "Thriller", "Horror"],
    language: "English",
    country: "USA",
    duration: "12m 14s",
    banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    cast: ["Celia", "Barak", "Zhang"],
    trending: true,
    popular: true,
    topRated: false,
    recommended: true,
    isLatest: false,
    tagline: "The cost of technology is written in steel."
  },
  {
    id: "m3",
    title: "Big Buck Bunny: Return to the Forest",
    type: "movie",
    description: "When three mischievous rodents bully a giant, friendly rabbit, he decides to orchestrate an elaborate series of traps to teach them a lesson they will never forget.",
    rating: "9.2",
    year: 2026,
    genres: ["Comedy", "Kids", "Action"],
    language: "Hindi",
    country: "India",
    duration: "9m 56s",
    banner: "https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    cast: ["Bunny", "Frank the Squirrel", "Rinky"],
    trending: true,
    popular: false,
    topRated: true,
    recommended: true,
    isLatest: true,
    tagline: "Don't mess with the big bunny."
  },
  {
    id: "m4",
    title: "Elephants Dream: Mechanical Utopia",
    type: "movie",
    description: "Two characters, Proog and Emo, wander through an infinitely complex mechanical universe that behaves like a living being, exposing the rift between reality and perception.",
    rating: "8.5",
    year: 2023,
    genres: ["Drama", "Romance", "Documentary"],
    language: "English",
    country: "UK",
    duration: "10m 54s",
    banner: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    cast: ["Proog", "Emo"],
    trending: false,
    popular: true,
    topRated: true,
    recommended: false,
    isLatest: false,
    tagline: "Dreams are built in gears."
  },

  // ACTION MOVIES
  {
    id: "m5",
    title: "Shadow Warrior: Bloodline",
    type: "movie",
    description: "An elite shadow assassin turns rogue after discovering his guild's dark secret, leading him into an all-out war with his former masters.",
    rating: "8.4",
    year: 2025,
    genres: ["Action", "Thriller"],
    language: "Hindi",
    country: "India",
    duration: "2h 15m",
    banner: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    cast: ["Kabir Khan", "Arya Singh", "Vikram Rathore"],
    trending: true,
    popular: true,
    topRated: false,
    recommended: true,
    isLatest: true
  },
  {
    id: "m6",
    title: "The Chase: Amsterdam Drift",
    type: "movie",
    description: "An undercover cop finds himself trapped in a high-stakes car chase across the historic canals and narrow streets of Amsterdam.",
    rating: "8.2",
    year: 2024,
    genres: ["Action", "Thriller"],
    language: "English",
    country: "Netherlands",
    duration: "1h 50m",
    banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    cast: ["Leo Vance", "Sofia Rossi", "Dirk de Boer"],
    trending: false,
    popular: true,
    topRated: false,
    recommended: true,
    isLatest: false
  },

  // THRILLER & HORROR
  {
    id: "m7",
    title: "Whispers in the Dark",
    type: "movie",
    description: "A paranormal investigator visits an abandoned asylum, only to discover that the spirits dwelling inside are seeking an escape vessel.",
    rating: "7.9",
    year: 2025,
    genres: ["Horror", "Thriller"],
    language: "English",
    country: "USA",
    duration: "1h 45m",
    banner: "https://images.unsplash.com/photo-1505635339358-75c102a0a2df?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1505635339358-75c102a0a2df?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    cast: ["Sarah Paul", "David Miller"],
    trending: true,
    popular: false,
    topRated: false,
    recommended: false,
    isLatest: true
  },
  {
    id: "m8",
    title: "Apex Predator",
    type: "movie",
    description: "A group of scientists tracking an extinct creature deep inside the Siberian forests become the prey of something far worse.",
    rating: "8.1",
    year: 2024,
    genres: ["Thriller", "Action"],
    language: "Spanish",
    country: "Spain",
    duration: "2h 05m",
    banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    cast: ["Mateo Silva", "Elena Gomez"],
    trending: false,
    popular: true,
    topRated: true,
    recommended: true,
    isLatest: false
  },

  // COMEDY & KIDS
  {
    id: "m9",
    title: "The Grand Comedy Show",
    type: "movie",
    description: "Five stand-up comedians embark on a cross-country road trip, facing ridiculous situations, flat tires, and unexpected love.",
    rating: "8.3",
    year: 2025,
    genres: ["Comedy", "Romance"],
    language: "Hindi",
    country: "India",
    duration: "1h 55m",
    banner: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    cast: ["Rahul Gupta", "Neha Sharma", "Rohan Verma"],
    trending: true,
    popular: true,
    topRated: false,
    recommended: true,
    isLatest: true
  },
  {
    id: "m10",
    title: "Forest Adventures",
    type: "movie",
    description: "An animated story of a group of friendly forest animals that try to defend their habitat from a modern urbanization project.",
    rating: "8.6",
    year: 2026,
    genres: ["Kids", "Comedy"],
    language: "English",
    country: "UK",
    duration: "1h 32m",
    banner: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    cast: ["Voice: John Doe", "Voice: Jane Smith"],
    trending: false,
    popular: false,
    topRated: true,
    recommended: true,
    isLatest: true
  },

  // DRAMA, ROMANCE & DOCUMENTARY
  {
    id: "m11",
    title: "Echoes of the Heart",
    type: "movie",
    description: "Two musicians from different cultures meet at an international music festival, discovering that melody has no translation.",
    rating: "8.8",
    year: 2024,
    genres: ["Romance", "Drama"],
    language: "Spanish",
    country: "Spain",
    duration: "2h 10m",
    banner: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    cast: ["Carlos Sainz", "Lily Evans"],
    trending: true,
    popular: true,
    topRated: true,
    recommended: true,
    isLatest: false
  },
  {
    id: "m12",
    title: "Planet Earth: The Deep Blue",
    type: "movie",
    description: "A visually stunning cinematic documentary exploring the uncharted depths of the Pacific Ocean and its rare bioluminescent life.",
    rating: "9.5",
    year: 2025,
    genres: ["Documentary"],
    language: "English",
    country: "UK",
    duration: "1h 40m",
    banner: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    cast: ["David Attenborough (Narrator)"],
    trending: true,
    popular: true,
    topRated: true,
    recommended: true,
    isLatest: true
  },

  // WEB SERIES
  {
    id: "s1",
    title: "The Hackers: Digital Anarchy",
    type: "series",
    description: "Season 1: A brilliant but socially isolated cybersecurity expert joins a group of digital hacktivists aiming to delete all global debt.",
    rating: "9.1",
    year: 2025,
    genres: ["Thriller", "Action"],
    language: "English",
    country: "USA",
    duration: "10 Episodes",
    banner: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    cast: ["Rami Malek", "Christian Slater"],
    trending: true,
    popular: true,
    topRated: true,
    recommended: true,
    isLatest: true
  },
  {
    id: "s2",
    title: "Sacred Legends",
    type: "series",
    description: "Season 1: A crime thriller set in the underworld of Mumbai, where a police inspector receives a mysterious phone call detailing a catastrophic event.",
    rating: "8.9",
    year: 2024,
    genres: ["Drama", "Thriller", "Action"],
    language: "Hindi",
    country: "India",
    duration: "8 Episodes",
    banner: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    cast: ["Saif Ali Khan", "Nawazuddin Siddiqui"],
    trending: true,
    popular: true,
    topRated: true,
    recommended: true,
    isLatest: false
  },
  {
    id: "s3",
    title: "Laughter Therapy",
    type: "series",
    description: "Season 2: Follow six young professionals in their mid-20s navigating careers, romance, and daily life in a shared apartment complex.",
    rating: "8.6",
    year: 2025,
    genres: ["Comedy", "Romance"],
    language: "Hindi",
    country: "India",
    duration: "12 Episodes",
    banner: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    cast: ["Abhishek Kumar", "Srishti Dixit"],
    trending: false,
    popular: true,
    topRated: false,
    recommended: true,
    isLatest: true
  },
  {
    id: "s4",
    title: "Tales of Horror",
    type: "series",
    description: "Season 1: Anthology series detailing paranormal legends from remote villages, featuring ancient curses and vengeful shape-shifters.",
    rating: "8.0",
    year: 2024,
    genres: ["Horror", "Drama"],
    language: "English",
    country: "UK",
    duration: "6 Episodes",
    banner: "https://images.unsplash.com/photo-1505635339358-75c102a0a2df?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1505635339358-75c102a0a2df?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    cast: ["Arthur Pendelton", "Guinevere Vance"],
    trending: false,
    popular: false,
    topRated: false,
    recommended: false,
    isLatest: false
  },
  {
    id: "s5",
    title: "Ancient Mysteries",
    type: "series",
    description: "Season 1: Archaeological evidence and CGI representations uncover the secret engineering behind the pyramids and lost civilizations.",
    rating: "8.7",
    year: 2025,
    genres: ["Documentary", "Kids"],
    language: "English",
    country: "USA",
    duration: "8 Episodes",
    banner: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80",
    thumbnail: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    cast: ["Dr. Sarah Johnson", "Prof. Alan Ross"],
    trending: true,
    popular: true,
    topRated: true,
    recommended: true,
    isLatest: true
  }
];

// LIVE TV CHANNELS
window.liveChannels = [
  {
    id: "c1",
    name: "Khazana Sports HD",
    logo: "🏆",
    program: "Live Premier League: Man City vs Liverpool",
    nextProgram: "Next: NBA Classics - Bulls vs Lakers (20:30)",
    category: "Sports",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  },
  {
    id: "c2",
    name: "Khazana Cinema",
    logo: "🎬",
    program: "Now Playing: Tears of Steel - Special Edition",
    nextProgram: "Next: Sintel Director's Commentary (21:00)",
    category: "Movies",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: "c3",
    name: "King Action TV",
    logo: "💥",
    program: "Now Playing: Shadow Warrior (Rewind)",
    nextProgram: "Next: Cyberpunk Legends (20:00)",
    category: "Movies",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
  },
  {
    id: "c4",
    name: "Khazana News Live",
    logo: "📰",
    program: "Prime Time News Bulletin with Rajdeep",
    nextProgram: "Next: Global Business Report (20:00)",
    category: "News",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: "c5",
    name: "Kids Zone",
    logo: "🦄",
    program: "Now Playing: Big Buck Bunny and Friends",
    nextProgram: "Next: The Toy Castle Chronicles (19:45)",
    category: "Kids",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: "c6",
    name: "Khazana Music Plus",
    logo: "🎵",
    program: "Non-Stop Indie Hits 2026",
    nextProgram: "Next: Late Night Chill Beats (21:00)",
    category: "Music",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  }
];

// SUBSCRIPTION PLANS
window.subscriptionPlans = [
  {
    id: "plan-basic",
    name: "Mobile Plan",
    monthlyPrice: 199,
    yearlyPrice: 1599,
    resolution: "480p",
    screens: 1,
    downloads: "No",
    audio: "Stereo 2.0",
    popular: true,
    features: [
      "Access to all Movies and Shows",
      "Watch on Phone or Tablet",
      "480p SD Video Quality",
      "Ad-supported streaming"
    ]
  },
  {
    id: "plan-standard",
    name: "Standard Plan",
    monthlyPrice: 499,
    yearlyPrice: 3999,
    resolution: "1080p",
    screens: 2,
    downloads: "Yes (30 Titles)",
    audio: "Dolby Audio 5.1",
    popular: false,
    features: [
      "Ad-free streaming",
      "Watch on TV, Laptop, Phone & Tablet",
      "Full HD 1080p Video Quality",
      "Download & Watch Offline",
      "2 Active Screens simultaneously"
    ]
  },
  {
    id: "plan-premium",
    name: "Premium Plan",
    monthlyPrice: 799,
    yearlyPrice: 6399,
    resolution: "4K + HDR",
    screens: 4,
    downloads: "Unlimited",
    audio: "Dolby Atmos + Spatial Audio",
    popular: false,
    features: [
      "Ultra HD 4K, HDR10 & Dolby Vision",
      "Ad-free premium experience",
      "Watch on 4 screens simultaneously",
      "Download on up to 10 devices",
      "Immersive Dolby Atmos Sound",
      "First look at new releases"
    ]
  }
];

// FAQS
window.faqs = [
  {
    question: "What is Khazana King OTT?",
    answer: "Khazana King OTT is a premium streaming service that offers a wide variety of award-winning movies, web series, live TV channels, and documentaries on thousands of internet-connected devices. You can watch as much as you want, whenever you want, without a single commercial – all for one low monthly price!"
  },
  {
    question: "How much does Khazana King OTT cost?",
    answer: "Watch Khazana King OTT on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₹199 to ₹799 a month. No extra costs, no contracts. You can save up to 20% by subscribing to our yearly package!"
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Yes, you can easily cancel your subscription anytime online. There are no cancellation fees or lock-in contracts – start or stop your account in the User Dashboard with a single click."
  },
  {
    question: "Where can I watch?",
    answer: "Watch anywhere, anytime. Sign in with your Khazana King OTT account to watch instantly on the web at khazanaking.com from your personal computer or on any internet-connected device, including smart TVs, smartphones, tablets, media players and game consoles."
  },
  {
    question: "Is there content suitable for children?",
    answer: "Yes, the Khazana King OTT Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own dedicated space. You can also filter content by the 'Kids' category in our navigation menu."
  }
];

// TESTIMONIALS
window.testimonials = [
  {
    name: "Aarav Mehta",
    role: "Movie Enthusiast",
    rating: 5,
    text: "The streaming quality is absolutely stellar! I subscribed to the Premium plan and the 4K Dolby Atmos audio feels exactly like a theatre experience. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    name: "Priya Sharma",
    role: "Binge-Watcher",
    rating: 5,
    text: "I love the Web Series collection. Khazana King has a super clean interface, smooth animations, and the Resume Playback feature is extremely convenient.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80"
  },
  {
    name: "Vikram Malhotra",
    role: "Tech Professional",
    rating: 4,
    text: "The PWA support is fantastic. I installed the app on my phone directly from the browser. It loads super fast and uses very little data while traveling.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80"
  }
];

// CATEGORY METADATA
window.categoriesList = [
  { name: "Action", icon: "🔥", gradient: "linear-gradient(135deg, #FF416C, #FF4B2B)" },
  { name: "Drama", icon: "🎭", gradient: "linear-gradient(135deg, #8A2387, #E94057)" },
  { name: "Thriller", icon: "👁️", gradient: "linear-gradient(135deg, #111111, #461b1b)" },
  { name: "Comedy", icon: "😄", gradient: "linear-gradient(135deg, #F9D423, #FF4E50)" },
  { name: "Horror", icon: "🧟", gradient: "linear-gradient(135deg, #2c3e50, #000000)" },
  { name: "Romance", icon: "💖", gradient: "linear-gradient(135deg, #ff9a9e, #fecfef)" },
  { name: "Documentary", icon: "🌍", gradient: "linear-gradient(135deg, #2b5876, #4e4376)" },
  { name: "Kids", icon: "🎈", gradient: "linear-gradient(135deg, #00c6ff, #0072ff)" }
];
