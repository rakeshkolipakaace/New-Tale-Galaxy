const animalsImg = require('../../assets/images/animals_genre_cover_art.png');
const friendsImg = require('../../assets/images/friends_genre_cover_art.png');
const adventureImg = require('../../assets/images/adventure_genre_cover_art.png');

const page1Img = require('../../assets/images/story_page_1_rabbit.png');
const page2Img = require('../../assets/images/story_page_2_wolf.png');
const page3Img = require('../../assets/images/story_page_3_celebration.png');

export const genres = [
  { 
    id: 'animals', 
    title: 'Animals', 
    image: animalsImg, 
    description: 'Tales from the forest friends',
    colors: ['#DBEAFE', '#EFF6FF']
  },
  { 
    id: 'friends', 
    title: 'Friends', 
    image: friendsImg, 
    description: 'Stories about kindness and play',
    colors: ['#E0F2FE', '#F0F9FF']
  },
  { 
    id: 'adventure', 
    title: 'Adventure', 
    image: adventureImg, 
    description: 'Exciting journeys and quests',
    colors: ['#CFFAFE', '#ECFEFF']
  },
];

export const ageGroups = [
  { value: '3-5', label: '3-5 years' },
  { value: '6-8', label: '6-8 years' },
  { value: '9-12', label: '9-12 years' },
];

const animalsStories = [
  {
    id: 'animals-1',
    title: "The Brave Rabbit",
    author: "StoryTime Collection",
    coverImage: page1Img,
    description: "A little rabbit learns about courage",
    ageGroup: '3-5',
    pages: [
      { text: "Once upon a time, there lived a little rabbit named Barnaby. He was small, but he had a very big heart. He loved to hop in the tall grass.", image: page1Img },
      { text: "One day, Barnaby saw a big wolf! The wolf looked scary. But Barnaby was brave. He thumped his foot loudly. Thump! Thump!", image: page2Img },
      { text: "The wolf was surprised by the loud noise. It turned and ran away. Barnaby's friends came out to celebrate. What a brave rabbit!", image: page3Img }
    ],
    quiz: [
      { question: "What was the rabbit's name?", options: ["Billy", "Barnaby", "Bobby", "Benny"], correctAnswer: 1 },
      { question: "What did Barnaby do when he saw the wolf?", options: ["Ran away", "Hid", "Thumped his foot", "Cried"], correctAnswer: 2 },
      { question: "How did the story end?", options: ["Wolf caught Barnaby", "Barnaby ran home", "Friends celebrated", "Barnaby got lost"], correctAnswer: 2 }
    ]
  },
  {
    id: 'animals-2',
    title: "The Curious Fox",
    author: "StoryTime Collection",
    coverImage: page2Img,
    description: "A young fox explores the meadow",
    ageGroup: '3-5',
    pages: [
      { text: "Felix the fox loved to explore. Every day he would visit new places in the meadow. Today he found a beautiful stream with shiny fish.", image: page2Img },
      { text: "By the stream, Felix met a wise old turtle. The turtle taught him about the fish that swim and the frogs that jump.", image: page1Img },
      { text: "Felix learned so much that day. He ran home to tell his family all about his new friend and the wonderful stream.", image: page3Img }
    ],
    quiz: [
      { question: "What is the fox's name?", options: ["Felix", "Max", "Sam", "Oscar"], correctAnswer: 0 },
      { question: "Who did Felix meet?", options: ["A rabbit", "A turtle", "A bird", "A deer"], correctAnswer: 1 },
      { question: "What did Felix find?", options: ["A cave", "A tree", "A stream", "A hill"], correctAnswer: 2 }
    ]
  },
  {
    id: 'animals-3',
    title: "The Singing Bird",
    author: "StoryTime Collection",
    coverImage: page3Img,
    description: "A little bird finds her voice",
    ageGroup: '3-5',
    pages: [
      { text: "Melody was a small blue bird. She loved to sing but was shy. She would only sing when she was alone in the forest.", image: page3Img },
      { text: "One day, a sad bunny sat under her tree. Melody wanted to help. She took a deep breath and sang her prettiest song.", image: page1Img },
      { text: "The bunny smiled! Other animals came to listen. Melody learned that sharing her gift made everyone happy, including herself.", image: page2Img }
    ],
    quiz: [
      { question: "What color was Melody?", options: ["Red", "Blue", "Yellow", "Green"], correctAnswer: 1 },
      { question: "Why was Melody shy?", options: ["She couldn't fly", "She was small", "She was shy to sing", "She had no friends"], correctAnswer: 2 },
      { question: "What made the bunny smile?", options: ["A carrot", "Melody's song", "The sunshine", "A joke"], correctAnswer: 1 }
    ]
  },
  {
    id: 'animals-4',
    title: "The Helpful Elephant",
    author: "StoryTime Collection",
    coverImage: page1Img,
    description: "An elephant learns the joy of helping others",
    ageGroup: '6-8',
    pages: [
      { text: "Ellie the elephant was the biggest animal in the jungle. She had a long trunk and big floppy ears. Sometimes she felt too big and clumsy.", image: page1Img },
      { text: "One hot day, the river dried up. All the animals were thirsty. Ellie remembered a hidden spring far away. She used her strong legs to walk there.", image: page2Img },
      { text: "Ellie filled her trunk with water and brought it back to her friends. She made many trips until everyone had enough to drink. Being big was actually wonderful!", image: page3Img }
    ],
    quiz: [
      { question: "What made Ellie special?", options: ["Her speed", "Her size and strength", "Her colors", "Her voice"], correctAnswer: 1 },
      { question: "What problem did the animals face?", options: ["It was cold", "They were hungry", "The river dried up", "It was raining"], correctAnswer: 2 },
      { question: "How did Ellie help?", options: ["She sang", "She danced", "She brought water", "She found food"], correctAnswer: 2 }
    ]
  },
  {
    id: 'animals-5',
    title: "The Clever Crow",
    author: "StoryTime Collection",
    coverImage: page2Img,
    description: "A crow solves a tricky problem",
    ageGroup: '6-8',
    pages: [
      { text: "Charlie the crow was very smart. He loved solving puzzles and figuring things out. His friends always came to him when they needed help.", image: page2Img },
      { text: "One day, the squirrels couldn't reach their nuts. They had fallen into a deep hole. Charlie thought and thought about how to help.", image: page1Img },
      { text: "Charlie had an idea! He dropped pebbles into the hole. The water level rose, and the nuts floated up. The squirrels cheered for their clever friend!", image: page3Img }
    ],
    quiz: [
      { question: "What was Charlie good at?", options: ["Flying fast", "Solving puzzles", "Singing", "Swimming"], correctAnswer: 1 },
      { question: "What was stuck in the hole?", options: ["Acorns", "Berries", "Nuts", "Seeds"], correctAnswer: 2 },
      { question: "How did Charlie solve the problem?", options: ["He flew in", "He used a stick", "He dropped pebbles", "He called for help"], correctAnswer: 2 }
    ]
  },
  {
    id: 'animals-6',
    title: "The Wise Owl",
    author: "StoryTime Collection",
    coverImage: page3Img,
    description: "An owl shares wisdom with forest friends",
    ageGroup: '6-8',
    pages: [
      { text: "Oliver the owl lived in the oldest tree in the forest. He had read many books and knew many things. Animals would visit him to ask questions.", image: page3Img },
      { text: "A young mouse came to Oliver feeling worried about starting school. 'What if the others don't like me?' she asked with tears in her eyes.", image: page1Img },
      { text: "Oliver smiled kindly. 'Be yourself and be kind to others. That's the secret to making friends.' The mouse felt brave and ready for her first day.", image: page2Img }
    ],
    quiz: [
      { question: "Where did Oliver live?", options: ["In a cave", "In the oldest tree", "By the river", "In a nest"], correctAnswer: 1 },
      { question: "What worried the mouse?", options: ["A cat", "Starting school", "Being hungry", "The weather"], correctAnswer: 1 },
      { question: "What was Oliver's advice?", options: ["Study hard", "Run fast", "Be yourself and kind", "Hide from others"], correctAnswer: 2 }
    ]
  },
  {
    id: 'animals-7',
    title: "The Ocean's Secret",
    author: "StoryTime Collection",
    coverImage: page1Img,
    description: "Sea creatures discover an underwater mystery",
    ageGroup: '9-12',
    pages: [
      { text: "Deep beneath the waves, a young dolphin named Marina discovered a glowing cave. Ancient symbols covered its walls, telling stories of the ocean's past.", image: page1Img },
      { text: "Marina gathered her friends: a wise octopus, a brave sea turtle, and a curious seahorse. Together they deciphered the symbols, revealing the location of a legendary coral garden.", image: page2Img },
      { text: "The coral garden was real, and it was dying. The friends worked together to clean the water and protect it. They became the ocean's guardians, teaching others to care for the sea.", image: page3Img }
    ],
    quiz: [
      { question: "What did Marina find?", options: ["A treasure chest", "A glowing cave", "A shipwreck", "A pearl"], correctAnswer: 1 },
      { question: "What did the symbols reveal?", options: ["A map to treasure", "A coral garden location", "A secret kingdom", "A monster's lair"], correctAnswer: 1 },
      { question: "What message does this story teach?", options: ["Find treasure", "Work alone", "Protect the environment", "Stay hidden"], correctAnswer: 2 }
    ]
  },
  {
    id: 'animals-8',
    title: "The Wolf Pack",
    author: "StoryTime Collection",
    coverImage: page2Img,
    description: "A young wolf learns about leadership",
    ageGroup: '9-12',
    pages: [
      { text: "Luna was the youngest wolf in her pack. Though small, she had big dreams of becoming a leader. But leadership, she would learn, wasn't about being the strongest.", image: page2Img },
      { text: "When a harsh winter came, the pack's usual hunting grounds were covered in deep snow. Luna remembered a valley her grandmother once mentioned, beyond the frozen river.", image: page1Img },
      { text: "Luna led the pack to safety through the dangerous journey. She learned that true leaders listen, remember the wisdom of elders, and put their pack's needs before their own pride.", image: page3Img }
    ],
    quiz: [
      { question: "What was Luna's dream?", options: ["To be the fastest", "To be a leader", "To find food", "To travel alone"], correctAnswer: 1 },
      { question: "What challenge did the pack face?", options: ["A fire", "Hunters", "A harsh winter", "A flood"], correctAnswer: 2 },
      { question: "What makes a true leader?", options: ["Being strongest", "Being loudest", "Listening and caring for others", "Having the best fur"], correctAnswer: 2 }
    ]
  },
  {
    id: 'animals-9',
    title: "The Migration",
    author: "StoryTime Collection",
    coverImage: page3Img,
    description: "Birds journey across continents",
    ageGroup: '9-12',
    pages: [
      { text: "Every autumn, the Arctic terns began their incredible journey—the longest migration of any animal on Earth. Young Aria would make this journey for the first time.", image: page3Img },
      { text: "Flying over oceans and continents, Aria faced storms, exhaustion, and moments of doubt. But she remembered her mother's words: 'The journey shapes who we become.'", image: page1Img },
      { text: "When Aria finally reached the Antarctic shores, she understood. The challenges had made her stronger, wiser, and ready to help guide next year's young travelers.", image: page2Img }
    ],
    quiz: [
      { question: "What type of bird is Aria?", options: ["Eagle", "Penguin", "Arctic tern", "Sparrow"], correctAnswer: 2 },
      { question: "What did Aria's mother say?", options: ["Stay home", "Fly faster", "The journey shapes us", "Follow the leader"], correctAnswer: 2 },
      { question: "What did Aria learn?", options: ["To avoid challenges", "Challenges make us stronger", "Migration is easy", "She should stay in one place"], correctAnswer: 1 }
    ]
  },
  {
    id: 'animals-10',
    title: "The Ant Colony",
    author: "StoryTime Collection",
    coverImage: page1Img,
    description: "Tiny heroes work together for big results",
    ageGroup: '9-12',
    pages: [
      { text: "In a bustling ant colony, each ant had a role. Scout Antonia discovered a new food source—a fallen apple. But it was too far and too dangerous for the colony to reach.", image: page1Img },
      { text: "Antonia proposed a daring plan: building a bridge of leaves across the stream. Many thought it impossible, but she convinced them to try. United, they could achieve the impossible.", image: page2Img },
      { text: "Working as one, thousands of ants constructed the bridge. The apple fed the entire colony for weeks. Antonia's bravery and teamwork saved them all.", image: page3Img }
    ],
    quiz: [
      { question: "What did Antonia discover?", options: ["A new home", "A fallen apple", "Water", "Danger"], correctAnswer: 1 },
      { question: "What was Antonia's plan?", options: ["Carry the apple", "Build a bridge", "Find another food", "Ask birds for help"], correctAnswer: 1 },
      { question: "What lesson does this story teach?", options: ["Work alone", "Give up easily", "Teamwork achieves great things", "Stay safe always"], correctAnswer: 2 }
    ]
  }
];

const friendsStories = [
  {
    id: 'friends-1',
    title: "Sharing is Caring",
    author: "StoryTime Collection",
    coverImage: page1Img,
    description: "Two friends learn to share their toys",
    ageGroup: '3-5',
    pages: [
      { text: "Lucy and Tom were best friends. They loved to play together. One day, they both wanted to play with the same red ball.", image: page1Img },
      { text: "At first, they were upset. But then Lucy had an idea. 'Let's take turns!' she said. Tom smiled and agreed.", image: page2Img },
      { text: "They took turns playing with the ball. They had so much fun together. Sharing made their friendship even stronger!", image: page3Img }
    ],
    quiz: [
      { question: "Who are the two friends?", options: ["Lucy and Tom", "Sam and Tim", "Max and Emma", "Ben and Sarah"], correctAnswer: 0 },
      { question: "What did they want to play with?", options: ["A doll", "A red ball", "A book", "A puzzle"], correctAnswer: 1 },
      { question: "How did they solve the problem?", options: ["They fought", "They took turns", "They found another ball", "They went home"], correctAnswer: 1 }
    ]
  },
  {
    id: 'friends-2',
    title: "The New Kid",
    author: "StoryTime Collection",
    coverImage: page2Img,
    description: "Making friends on the first day",
    ageGroup: '3-5',
    pages: [
      { text: "Maya was new at school. She didn't know anyone. She sat alone at lunch feeling sad.", image: page2Img },
      { text: "A boy named Jack saw her sitting alone. He walked over and said, 'Hi! Want to play with us?' Maya smiled and said yes.", image: page1Img },
      { text: "Maya and Jack became great friends. She learned that making friends is as easy as saying hello and being kind.", image: page3Img }
    ],
    quiz: [
      { question: "Why was Maya sad?", options: ["She lost her toy", "She was new and alone", "She was hungry", "It was raining"], correctAnswer: 1 },
      { question: "Who helped Maya?", options: ["A teacher", "Jack", "Her mom", "A pet"], correctAnswer: 1 },
      { question: "What did Maya learn?", options: ["School is boring", "Being new is hard", "Making friends is easy with kindness", "She should stay alone"], correctAnswer: 2 }
    ]
  },
  {
    id: 'friends-3',
    title: "The Picnic",
    author: "StoryTime Collection",
    coverImage: page3Img,
    description: "Friends plan a perfect day together",
    ageGroup: '3-5',
    pages: [
      { text: "Three friends wanted to have a picnic. Lily brought sandwiches, Max brought juice, and Zoe brought cookies.", image: page3Img },
      { text: "They found a nice spot under a big tree. They ate, laughed, and played games together.", image: page1Img },
      { text: "When it started to rain, they ran home together, giggling. It was the best picnic ever because they were together!", image: page2Img }
    ],
    quiz: [
      { question: "What did Lily bring?", options: ["Juice", "Cookies", "Sandwiches", "Apples"], correctAnswer: 2 },
      { question: "Where did they sit?", options: ["By a lake", "Under a tree", "On a hill", "In a cave"], correctAnswer: 1 },
      { question: "What happened at the end?", options: ["They got lost", "It rained", "They fell asleep", "They went swimming"], correctAnswer: 1 }
    ]
  }
];

const adventureStories = [
  {
    id: 'adventure-1',
    title: "The Magic Map",
    author: "StoryTime Collection",
    coverImage: page1Img,
    description: "A treasure hunt begins with a mysterious map",
    ageGroup: '3-5',
    pages: [
      { text: "Lily found an old map in her grandma's attic. It had a big X marked on it. 'I wonder what treasure is there!' she said.", image: page1Img },
      { text: "Lily followed the map through the garden, past the apple tree, and behind the old shed.", image: page2Img },
      { text: "The treasure was a box of her grandma's favorite cookies! Grandma laughed and they shared the treasure together.", image: page3Img }
    ],
    quiz: [
      { question: "Where did Lily find the map?", options: ["In the garden", "In the attic", "In school", "By the tree"], correctAnswer: 1 },
      { question: "What was marked on the map?", options: ["A star", "An X", "A circle", "An arrow"], correctAnswer: 1 },
      { question: "What was the treasure?", options: ["Gold", "Toys", "Cookies", "Books"], correctAnswer: 2 }
    ]
  },
  {
    id: 'adventure-2',
    title: "The Flying Carpet",
    author: "StoryTime Collection",
    coverImage: page2Img,
    description: "A magical journey through the clouds",
    ageGroup: '3-5',
    pages: [
      { text: "Sam found a colorful carpet in the market. When he sat on it, the carpet began to fly! Up, up, into the sky!", image: page2Img },
      { text: "Sam flew over mountains and oceans. He saw birds, clouds, and even a rainbow. It was amazing!", image: page1Img },
      { text: "The carpet brought Sam safely home. He couldn't wait to tell everyone about his magical adventure.", image: page3Img }
    ],
    quiz: [
      { question: "What did Sam find?", options: ["A hat", "A carpet", "A book", "A lamp"], correctAnswer: 1 },
      { question: "What happened when Sam sat on it?", options: ["It got soft", "It flew", "It changed color", "It disappeared"], correctAnswer: 1 },
      { question: "Where did the carpet take Sam?", options: ["To school", "Over mountains and oceans", "To the store", "Underground"], correctAnswer: 1 }
    ]
  },
  {
    id: 'adventure-3',
    title: "The Jungle Explorer",
    author: "StoryTime Collection",
    coverImage: page3Img,
    description: "An exciting trip through the jungle",
    ageGroup: '3-5',
    pages: [
      { text: "Jake put on his explorer hat. Today he would explore the backyard jungle! He packed a snack and a magnifying glass.", image: page3Img },
      { text: "Jake found amazing things: a shiny beetle, a fuzzy caterpillar, and colorful flowers. Every step was a new discovery.", image: page1Img },
      { text: "Mom called him for dinner. Jake smiled. His backyard was the best jungle in the whole world!", image: page2Img }
    ],
    quiz: [
      { question: "What did Jake wear?", options: ["A cape", "An explorer hat", "Boots", "A mask"], correctAnswer: 1 },
      { question: "What did Jake find?", options: ["Treasure", "A beetle and caterpillar", "A cave", "A river"], correctAnswer: 1 },
      { question: "Where was Jake's jungle?", options: ["In Africa", "At the zoo", "In the backyard", "At school"], correctAnswer: 2 }
    ]
  }
];

export const stories = {
  animals: animalsStories,
  friends: friendsStories,
  adventure: adventureStories
};
