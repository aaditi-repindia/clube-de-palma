/** Club amenities — homepage carousel uses the flat list; page tabs use categories. */

export const amenityCategories = [
  {
    id: "social",
    label: "Social",
    items: [
      {
        name: "O Bar Azul",
        cardBlurb: "A relaxing club bar to enjoy evening cocktails, light bites, live music, and coastal breezes.",
        blurb:
          "Gracing the entrance of the Club is O Bar Azul, a relaxing Club Bar where guests can enjoy an evening drink with other members and their guests, grab a quick bite with a cocktail, or simply enjoy a night of music and the coastal breeze across the indoor and outdoor layout.",
        features: ["Evening drinks", "Indoor & outdoor seating", "Live music nights", "Coastal breeze"],
        image: "assets/images/amenity-bar.jpg",
        alt: "O Bar Azul lounge at Clube de Palma",
      },
      {
        name: "Sabores",
        cardBlurb: "Multi-cuisine fine dining overlooking the glittering waters of the central swimming pool.",
        blurb:
          "No club is complete without a restaurant that serves up some decadent meals. Overlooking the glittering waters of the swimming pool is Sabores, a multi-cuisine fine dining restaurant to relish a delicious meal after an enjoyable day at Clube de Palma.",
        features: ["Multi-cuisine dining", "Poolside views", "Signature menus", "Evening service"],
        image: "assets/images/amenity-restaurant.jpg",
        alt: "Sabores fine dining at Clube de Palma",
      },
      {
        name: "Café Verde",
        cardBlurb: "Relax poolside with refreshing drinks and an exclusive daytime menu crafted for sunny leisure.",
        blurb:
          "There is nothing more satisfying than enjoying some hearty food after a day in the pool, or sunning yourself on loungers as you take in some rays. Café Verde offers our exclusive pool side menu, where you can tuck in to sumptuous dishes that perfectly complement your day of fun.",
        features: ["Poolside menu", "Lounge dining", "Daytime bites", "Relaxed setting"],
        image: "assets/images/cafe-verde.jpg",
        alt: "Poolside café setting at Clube de Palma",
      },
      {
        name: "Banquet Hall",
        cardBlurb: "A lavish indoor and outdoor banquet hall hosting up to 500 guests with courtyard views.",
        blurb:
          "For those days of celebration, members can rent out our 500 person banquet hall, complete with private indoor and outdoor space to host their guests in lavish style, overlooking the central courtyard of Clube de Palma.",
        features: ["Up to 500 guests", "Indoor & outdoor spaces", "Courtyard outlook", "Private hosting"],
        image: "assets/images/amenity-banquet.jpg",
        alt: "Banquet hall at Clube de Palma",
      },
    ],
  },
  {
    id: "strength-endurance",
    label: "Strength and Endurance",
    items: [
      {
        name: "Swimming Pools",
        cardBlurb: "A half-Olympic pool for lane swimming and endurance, set in the heart of the central courtyard.",
        blurb:
          "Build your endurance with some laps at the half Olympic swimming pool in the central courtyard, encourage the strokes and splashes of our younger members as they learn to swim in our dedicated kids’ pool.",
        features: ["Half-Olympic pool", "Courtyard setting", "Lane swimming", "Kids’ pool nearby"],
        image: "assets/images/amenity-pool.jpg",
        alt: "Swimming pool courtyard at Clube de Palma",
      },
      {
        name: "Gymnasium",
        cardBlurb: "Modern strength, cardio, and functional training zones equipped for every fitness level.",
        blurb:
          "Push your limits with the latest fitness technology and tools, professional trainers for a deeper burn, and a motivating atmosphere to help you on your fitness journey. From strength training and cardio machines to free weights and functional training zones, we’ve designed a space that caters to every fitness level.",
        features: ["Strength training", "Cardio machines", "Free weights", "Functional zones"],
        image: "assets/images/amenity-gym.jpg",
        alt: "Gymnasium at Clube de Palma",
      },
      {
        name: "Yoga Garden",
        cardBlurb: "A tranquil open-air sanctuary surrounded by lush greenery for mindfulness and yoga.",
        blurb:
          "Reconnect with your mind, body, and spirit in our serene Yoga Garden. Surrounded by lush greenery, this tranquil space offers the perfect setting for mindfulness and relaxation. Whether you’re a beginner or a seasoned yogi, there’s room for you to escape the rush of daily life and find your balance in nature.",
        features: ["Open-air practice", "Lush greenery", "Mindfulness sessions", "All levels welcome"],
        image: "assets/images/amenity-yoga.jpg",
        alt: "Yoga garden at Clube de Palma",
      },
    ],
  },
  {
    id: "racquet-sports",
    label: "Racquet Sports",
    items: [
      {
        name: "Badminton",
        cardBlurb: "Professional-grade courts designed for friendly rallies, agility, and competitive matches.",
        blurb:
          "Whether you’re practicing your smash, or enjoying a friendly match, our professional grade badminton court is designed for players of all skill levels. This vibrant space offers the perfect setting to stay active, improve your agility, and have fun with like-minded players.",
        features: ["Professional court", "All skill levels", "Friendly matches", "Agility training"],
        image: "assets/images/amenity-badminton.jpg",
        alt: "Badminton court at Clube de Palma",
      },
      {
        name: "Squash",
        cardBlurb: "High-intensity indoor squash courts built to elevate your agility, power, and endurance.",
        blurb:
          "Experience the thrill of this fast-paced, high-intensity sport designed to enhance your performance and keep you energised. Sharpen your skills, compete with friends, or simply focus on boosting your endurance. Squash is a game unmatched by any other, as are its players.",
        features: ["High-intensity play", "Skill sharpening", "Endurance boost", "Competitive matches"],
        image: "assets/images/Saquase.jpg",
        alt: "Indoor sporting space at Clube de Palma",
      },
      {
        name: "Tennis Ground",
        cardBlurb: "A dynamic fusion of tennis and squash delivering fast-paced rallies and social play.",
        blurb:
          "Tennis-Ground, a thrilling fusion of tennis and squash, is rapidly gaining popularity for its dynamic play and social appeal. With its fast pace, precision, and strategy, it’s an exciting way to boost coordination, agility, and endurance, making it a favourite for players of all skill levels.",
        features: ["Dynamic play", "Social appeal", "Precision & strategy", "All skill levels"],
        image: "assets/images/amenity-tenis.jpg",
        alt: "Tennis Ground courts at Clube de Palma",
      },
      {
        name: "Pickleball",
        cardBlurb: "Fast-paced, accessible racquet sport blending tennis and ping-pong for social competition.",
        blurb:
          "Pickleball, a blend of tennis, badminton, and ping-pong, is taking the world by storm. Its quick rallies and clever strategies make it exciting and accessible for all. More than just a workout, it’s a social game that boosts agility, coordination, and connection—on and off the court.",
        features: ["Quick rallies", "Social play", "All ages", "Coordination focus"],
        image: "assets/images/tennis-garden.jpg",
        alt: "Racquet sports court at Clube de Palma",
      },
    ],
  },
  {
    id: "indoor-games",
    label: "Indoor Games",
    items: [
      {
        name: "Cards Room",
        cardBlurb: "An intimate, sophisticated parlor for bridge, poker, and leisurely strategy games.",
        blurb:
          "Test your strategy in our elegant cards room, the perfect spot for a friendly game or a serious match. This cozy space offers a relaxed atmosphere to challenge your mind, connect with others, and enjoy timeless, classic entertainment.",
        features: ["Elegant setting", "Friendly games", "Strategy play", "Classic entertainment"],
        image: "assets/images/Card-game.jpg",
        alt: "Cards and indoor games room at Clube de Palma",
      },
      {
        name: "Billiards",
        cardBlurb: "Tournament-grade tables in an inviting lounge designed for focus, finesse, and camaraderie.",
        blurb:
          "Designed to encourage both casual and competitive matches, find a space for yourself to relax and enjoy a game of billiards in the sleek and inviting room replete with high quality tables and a comfortable atmosphere, ideal for a game of focus and finesse.",
        features: ["High-quality tables", "Casual matches", "Competitive play", "Focused atmosphere"],
        image: "assets/images/Billiards.jpg",
        alt: "Billiards room at Clube de Palma",
      },
      {
        name: "Table Tennis",
        cardBlurb: "Fast-paced action and quick reflexes in a lively space built for active competition.",
        blurb:
          "Step into the table tennis room, where the fast-paced action and quick reflexes make every game exciting. The lively space offers a fun way to stay active and enjoy the thrill of competition while you challenge your skills and keep the adrenaline flowing.",
        features: ["Fast-paced play", "Skill challenges", "Active fun", "Competitive energy"],
        image: "assets/images/Table-tennis.jpg",
        alt: "Table tennis room at Clube de Palma",
      },
    ],
  },
  {
    id: "kids",
    label: "Kids",
    items: [
      {
        name: "Kids’ Swimming Pool",
        cardBlurb: "A safe, shallow dedicated pool for young swimmers to build water confidence and play.",
        blurb:
          "Let your little ones splash and play in our safe, shallow kids’ swimming pool. Designed for our young swimmers, this fun-filled space encourages water confidence and enjoyment in a supervised, secure environment. It’s the perfect place for children to have fun while developing their swimming skills and making lasting memories.",
        features: ["Shallow pool", "Safe environment", "Water confidence", "Supervised play"],
        image: "assets/images/kids-pool.jpg",
        alt: "Kids swimming pool at Clube de Palma",
      },
      {
        name: "Children’s Play Area",
        cardBlurb: "Safe, interactive play structures and activities for children to explore and create.",
        blurb:
          "Our vibrant children’s play area is a world of fun, where young imaginations can run wild. With a variety of safe, interactive play structures and activities, it’s the perfect place for kids to burn off energy, explore, and enjoy hours of creative play.",
        features: ["Interactive structures", "Creative play", "Safe surfaces", "Energy-burning fun"],
        image: "assets/images/Kids-palyarea.jpg",
        alt: "Children’s play area at Clube de Palma",
      },
      {
        name: "Toddlers’ Play Area",
        cardBlurb: "Gentle, age-appropriate sensory play spaces tailored for early exploration and safety.",
        blurb:
          "Designed with little ones in mind, our toddlers’ play area offers a safe and engaging environment for early exploration. With age appropriate structures and surfaces, it’s the perfect space for your toddler to develop motor skills, social interaction, and creativity, all while having fun in a secure supervised setting.",
        features: ["Age-appropriate play", "Motor skill focus", "Secure setting", "Early exploration"],
        image: "assets/images/kids-play-2.jpg",
        alt: "Toddlers’ play area at Clube de Palma",
      },
      {
        name: "Kids’ Activities & Sport Lessons",
        cardBlurb: "Instructor-led coaching in swimming, racquet sports, and team fitness for young members.",
        blurb:
          "Our young members can explore a variety of new interests, led by experienced instructors, across the amenities on offer, from racquet sports to swimming lessons. These lessons encourage teamwork, fitness and self-discipline, all while the kids can have a blast!",
        features: ["Instructor-led lessons", "Racquet sports", "Swimming lessons", "Teamwork & fitness"],
        image: "assets/images/Kids-acitvity.jpg",
        alt: "Kids activities at Clube de Palma",
      },
    ],
  },
]

/** Homepage carousel sequence (names must match category items). */
const homepageAmenityOrder = [
  "O Bar Azul",
  "Sabores",
  "Café Verde",
  "Pickleball",
  "Tennis Ground",
  "Squash",
  "Badminton",
  "Swimming Pools",
  "Gymnasium",
  "Yoga Garden",
  "Billiards",
  "Table Tennis",
  "Cards Room",
  "Kids’ Swimming Pool",
  "Children’s Play Area",
  "Toddlers’ Play Area",
  "Kids’ Activities & Sport Lessons",
]

const amenityByName = new Map(
  amenityCategories.flatMap((category) => category.items.map((item) => [item.name, item])),
)

/** Flat list for homepage carousel */
export const amenities = homepageAmenityOrder
  .map((name) => amenityByName.get(name))
  .filter(Boolean)
  .map((item) => ({
    name: item.name,
    blurb: item.cardBlurb || item.blurb,
    detail: item.features?.slice(0, 2).join(" · "),
    image: item.image,
    alt: item.alt,
  }))

