import animalsImg from '@assets/generated_images/animals_genre_cover_art.png';
import friendsImg from '@assets/generated_images/friends_genre_cover_art.png';
import adventureImg from '@assets/generated_images/adventure_genre_cover_art.png';

import page1Img from '@assets/generated_images/story_page_1_rabbit.png';
import page2Img from '@assets/generated_images/story_page_2_wolf.png';
import page3Img from '@assets/generated_images/story_page_3_celebration.png';

export type Genre = {
  id: string;
  title: string;
  image: string;
  description: string;
  color: string;
};

export type StoryPage = {
  text: string;
  image: string;
};

export type Story = {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  ageGroup: string;
  pages: StoryPage[];
  quiz: QuizQuestion[];
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
};

export const genres: Genre[] = [
  { 
    id: 'animals', 
    title: 'Animals', 
    image: animalsImg, 
    description: 'Tales from the forest friends',
    color: 'from-blue-100 to-blue-50' 
  },
  { 
    id: 'friends', 
    title: 'Friends', 
    image: friendsImg, 
    description: 'Stories about kindness and play',
    color: 'from-sky-100 to-sky-50' 
  },
  { 
    id: 'adventure', 
    title: 'Adventure', 
    image: adventureImg, 
    description: 'Exciting journeys and quests',
    color: 'from-cyan-100 to-cyan-50' 
  },
];

export const ageGroups = [
  { value: '3-5', label: '3-5 years' },
  { value: '6-8', label: '6-8 years' },
  { value: '9-12', label: '9-12 years' },
];

// ANIMALS STORIES
const animalsStories: Story[] = [
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

// FRIENDS STORIES
const friendsStories: Story[] = [
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
  },
  {
    id: 'friends-4',
    title: "The Broken Toy",
    author: "StoryTime Collection",
    coverImage: page1Img,
    description: "A friend helps fix a mistake",
    ageGroup: '6-8',
    pages: [
      { text: "Sam accidentally broke his friend Mia's favorite toy airplane. He was scared to tell her. What if she got angry?", image: page1Img },
      { text: "Sam decided to be honest. 'Mia, I'm so sorry. I broke your airplane by accident.' He expected her to be upset.", image: page2Img },
      { text: "'It's okay,' Mia said. 'Accidents happen. Let's fix it together!' They used glue and painted it even better. Sam learned that honesty makes friendships stronger.", image: page3Img }
    ],
    quiz: [
      { question: "What did Sam break?", options: ["A cup", "A toy airplane", "A book", "A window"], correctAnswer: 1 },
      { question: "How did Sam feel at first?", options: ["Happy", "Hungry", "Scared", "Sleepy"], correctAnswer: 2 },
      { question: "What did Sam learn?", options: ["To hide mistakes", "Honesty makes friendships stronger", "Never touch toys", "Friends always fight"], correctAnswer: 1 }
    ]
  },
  {
    id: 'friends-5',
    title: "The Birthday Surprise",
    author: "StoryTime Collection",
    coverImage: page2Img,
    description: "Friends plan a special celebration",
    ageGroup: '6-8',
    pages: [
      { text: "Emma's birthday was coming, and her friends wanted to throw her a surprise party. They planned decorations, cake, and games in secret.", image: page2Img },
      { text: "On the big day, Emma walked into her backyard expecting nothing. 'SURPRISE!' everyone shouted. Emma couldn't believe her eyes!", image: page1Img },
      { text: "Emma hugged all her friends with happy tears. 'You did this for me?' The best gift was knowing how much her friends cared.", image: page3Img }
    ],
    quiz: [
      { question: "What were Emma's friends planning?", options: ["A trip", "A surprise party", "A game", "A movie night"], correctAnswer: 1 },
      { question: "Where was the party?", options: ["At school", "In the backyard", "At a park", "At a restaurant"], correctAnswer: 1 },
      { question: "What was the best gift for Emma?", options: ["A toy", "Cake", "Knowing friends cared", "Games"], correctAnswer: 2 }
    ]
  },
  {
    id: 'friends-6',
    title: "The Team Project",
    author: "StoryTime Collection",
    coverImage: page3Img,
    description: "Working together in school",
    ageGroup: '6-8',
    pages: [
      { text: "Four students were assigned a group project: Alex, Bella, Carlos, and Dana. At first, they argued about what to do.", image: page3Img },
      { text: "Alex had an idea. 'What if each of us does what we're best at?' Bella was great at art, Carlos at research, Dana at writing, and Alex at presenting.", image: page1Img },
      { text: "They created the best project in class! Working together and using everyone's strengths made them unstoppable.", image: page2Img }
    ],
    quiz: [
      { question: "What was the assignment?", options: ["A test", "A group project", "Homework", "A speech"], correctAnswer: 1 },
      { question: "What was Alex's idea?", options: ["Do it alone", "Give up", "Use everyone's strengths", "Ask the teacher"], correctAnswer: 2 },
      { question: "What did they learn?", options: ["Teamwork wins", "Work alone", "Argue more", "Give up easily"], correctAnswer: 0 }
    ]
  },
  {
    id: 'friends-7',
    title: "The Long-Distance Friend",
    author: "StoryTime Collection",
    coverImage: page1Img,
    description: "Friendship across miles",
    ageGroup: '9-12',
    pages: [
      { text: "When Sophie's best friend Aiden moved to another country, they were heartbroken. How could their friendship survive thousands of miles?", image: page1Img },
      { text: "They decided to write letters, video chat every week, and play online games together. It wasn't the same, but their friendship adapted.", image: page2Img },
      { text: "A year later, Aiden visited. Nothing had changed between them. Sophie realized true friendship isn't measured in miles, but in memories and care.", image: page3Img }
    ],
    quiz: [
      { question: "Why were Sophie and Aiden separated?", options: ["They fought", "Aiden moved away", "Sophie was sick", "School ended"], correctAnswer: 1 },
      { question: "How did they stay connected?", options: ["They didn't", "Letters and video chats", "Telepathy", "Carrier pigeons"], correctAnswer: 1 },
      { question: "What lesson is learned?", options: ["Distance ends friendship", "True friendship survives distance", "Don't make friends", "Moving is bad"], correctAnswer: 1 }
    ]
  },
  {
    id: 'friends-8',
    title: "The Misunderstanding",
    author: "StoryTime Collection",
    coverImage: page2Img,
    description: "Resolving conflict between friends",
    ageGroup: '9-12',
    pages: [
      { text: "Jayla overheard her friend Marcus talking about a 'boring person who talks too much.' She assumed he meant her and felt deeply hurt.", image: page2Img },
      { text: "For a week, Jayla avoided Marcus. Finally, he confronted her. 'Did I do something wrong?' Jayla explained what she heard.", image: page1Img },
      { text: "Marcus was shocked. 'I was talking about a character in a book!' They laughed and hugged. Jayla learned to ask questions before assuming the worst.", image: page3Img }
    ],
    quiz: [
      { question: "What did Jayla overhear?", options: ["A secret", "Someone talking about a boring person", "A song", "A joke"], correctAnswer: 1 },
      { question: "What was Marcus actually talking about?", options: ["Jayla", "A teacher", "A book character", "His brother"], correctAnswer: 2 },
      { question: "What should you do before getting upset?", options: ["Assume the worst", "Ask questions", "Stop talking", "Run away"], correctAnswer: 1 }
    ]
  },
  {
    id: 'friends-9',
    title: "The Inclusive Group",
    author: "StoryTime Collection",
    coverImage: page3Img,
    description: "Welcoming everyone to the group",
    ageGroup: '9-12',
    pages: [
      { text: "The popular lunch table always had the same five friends. When quiet Kai started eating alone nearby, they noticed but didn't invite them over.", image: page3Img },
      { text: "One day, Priya spoke up. 'We should ask Kai to join us.' Some friends hesitated, worried it would change the group dynamics.", image: page1Img },
      { text: "Kai joined them and turned out to be hilarious and kind. The group grew stronger by opening their circle. Inclusivity made everyone's life richer.", image: page2Img }
    ],
    quiz: [
      { question: "Who was eating alone?", options: ["Priya", "Kai", "A teacher", "No one"], correctAnswer: 1 },
      { question: "Who suggested inviting Kai?", options: ["The teacher", "Kai", "Priya", "A parent"], correctAnswer: 2 },
      { question: "What happened when they included Kai?", options: ["The group fell apart", "Nothing changed", "The group became stronger", "Kai left"], correctAnswer: 2 }
    ]
  },
  {
    id: 'friends-10',
    title: "The Forgiveness",
    author: "StoryTime Collection",
    coverImage: page1Img,
    description: "Learning to forgive a friend",
    ageGroup: '9-12',
    pages: [
      { text: "Rosa and Camille had been friends for years. But when Camille shared Rosa's secret with others, their friendship shattered.", image: page1Img },
      { text: "Months passed. Camille wrote a heartfelt letter apologizing and explaining she had made a terrible mistake. Rosa read it many times.", image: page2Img },
      { text: "Rosa chose to forgive. It wasn't easy, but holding onto anger hurt more. Their rebuilt friendship was different—more honest and careful—but still precious.", image: page3Img }
    ],
    quiz: [
      { question: "What did Camille do wrong?", options: ["Stole something", "Shared Rosa's secret", "Moved away", "Forgot Rosa's birthday"], correctAnswer: 1 },
      { question: "How did Camille apologize?", options: ["She didn't", "With a letter", "With a gift", "Through a friend"], correctAnswer: 1 },
      { question: "What did Rosa learn?", options: ["Never forgive", "Holding anger hurts more than forgiving", "Secrets are unimportant", "Friends are unnecessary"], correctAnswer: 1 }
    ]
  }
];

// ADVENTURE STORIES
const adventureStories: Story[] = [
  {
    id: 'adventure-1',
    title: "The Magic Garden",
    author: "StoryTime Collection",
    coverImage: page1Img,
    description: "A child discovers a secret garden",
    ageGroup: '3-5',
    pages: [
      { text: "Emma found a hidden door in her backyard. Behind it was a magical garden full of colorful flowers and singing birds.", image: page1Img },
      { text: "In the garden, she met a friendly butterfly who showed her the way to a beautiful waterfall that sparkled in the sunlight.", image: page2Img },
      { text: "Emma visited the magic garden every day. It became her special place where anything was possible.", image: page3Img }
    ],
    quiz: [
      { question: "What did Emma find?", options: ["A magic garden", "A treasure", "A puppy", "A castle"], correctAnswer: 0 },
      { question: "Who helped Emma in the garden?", options: ["A bird", "A butterfly", "A rabbit", "A fairy"], correctAnswer: 1 },
      { question: "How often did Emma visit?", options: ["Once", "Never again", "Every day", "Every week"], correctAnswer: 2 }
    ]
  },
  {
    id: 'adventure-2',
    title: "The Pirate Treasure",
    author: "StoryTime Collection",
    coverImage: page2Img,
    description: "Finding treasure on the beach",
    ageGroup: '3-5',
    pages: [
      { text: "Leo was playing on the beach when he found an old map in a bottle. It showed an X where treasure was buried!", image: page2Img },
      { text: "He followed the map across the sand, past the rocks, and under the big palm tree. He started to dig with his little shovel.", image: page1Img },
      { text: "Leo found a treasure box! Inside were shiny shells, colorful stones, and a golden coin. What an adventure!", image: page3Img }
    ],
    quiz: [
      { question: "Where did Leo find the map?", options: ["In his room", "In a bottle", "In a book", "In a tree"], correctAnswer: 1 },
      { question: "What did Leo use to dig?", options: ["His hands", "A stick", "A little shovel", "A bucket"], correctAnswer: 2 },
      { question: "What was in the treasure box?", options: ["Toys", "Candy", "Shells and stones", "Books"], correctAnswer: 2 }
    ]
  },
  {
    id: 'adventure-3',
    title: "The Cloud Kingdom",
    author: "StoryTime Collection",
    coverImage: page3Img,
    description: "A journey to a kingdom in the sky",
    ageGroup: '3-5',
    pages: [
      { text: "Mia climbed a rainbow after a storm. At the top, she found a kingdom made of fluffy clouds!", image: page3Img },
      { text: "The cloud people welcomed her. They had cotton candy houses and played with rain drops. Mia bounced on soft cloud cushions.", image: page1Img },
      { text: "When the sun set, Mia slid back down the rainbow. She couldn't wait to visit her cloud friends again.", image: page2Img }
    ],
    quiz: [
      { question: "How did Mia get to the cloud kingdom?", options: ["She flew", "She climbed a rainbow", "She used a ladder", "She wished"], correctAnswer: 1 },
      { question: "What were the houses made of?", options: ["Wood", "Cotton candy", "Bricks", "Leaves"], correctAnswer: 1 },
      { question: "How did Mia get back home?", options: ["She fell", "She slid down the rainbow", "She woke up", "She walked"], correctAnswer: 1 }
    ]
  },
  {
    id: 'adventure-4',
    title: "The Jungle Expedition",
    author: "StoryTime Collection",
    coverImage: page1Img,
    description: "Exploring deep in the jungle",
    ageGroup: '6-8',
    pages: [
      { text: "Jake and his sister Lily ventured into the backyard jungle with their explorer gear. Their mission: find the legendary Golden Flower.", image: page1Img },
      { text: "They crawled through bushes, crossed the garden stream on stepping stones, and spotted colorful butterflies along the way.", image: page2Img },
      { text: "Behind the old oak tree, they found it—a beautiful yellow sunflower, glowing in the afternoon light. Their expedition was a success!", image: page3Img }
    ],
    quiz: [
      { question: "What were Jake and Lily looking for?", options: ["A bird", "The Golden Flower", "A treasure", "A pet"], correctAnswer: 1 },
      { question: "Where did they explore?", options: ["The beach", "Their backyard", "A forest", "A mountain"], correctAnswer: 1 },
      { question: "What was the Golden Flower really?", options: ["A rose", "A tulip", "A sunflower", "A daisy"], correctAnswer: 2 }
    ]
  },
  {
    id: 'adventure-5',
    title: "The Underground Cave",
    author: "StoryTime Collection",
    coverImage: page2Img,
    description: "Discovering secrets beneath the earth",
    ageGroup: '6-8',
    pages: [
      { text: "With flashlights in hand, Nora and Ben explored the cave they found behind the waterfall. Glittering crystals lined the walls.", image: page2Img },
      { text: "They discovered ancient drawings on the cave walls—people and animals from long ago. It felt like stepping back in time.", image: page1Img },
      { text: "The cave led to a hidden lake with water so clear they could see the bottom. Nature had created a secret masterpiece.", image: page3Img }
    ],
    quiz: [
      { question: "Where was the cave entrance?", options: ["Behind a waterfall", "In a mountain", "Underground", "In a tree"], correctAnswer: 0 },
      { question: "What lined the cave walls?", options: ["Moss", "Ice", "Crystals", "Vines"], correctAnswer: 2 },
      { question: "What did they find at the end?", options: ["Treasure", "A monster", "A hidden lake", "An exit"], correctAnswer: 2 }
    ]
  },
  {
    id: 'adventure-6',
    title: "The Space Mission",
    author: "StoryTime Collection",
    coverImage: page3Img,
    description: "A journey to the stars",
    ageGroup: '6-8',
    pages: [
      { text: "Astronaut Anna boarded her rocket ship. Her mission: plant the first tree on Mars. The countdown began. 3... 2... 1... Liftoff!", image: page3Img },
      { text: "Through the window, she watched Earth become smaller. Stars twinkled all around. After many days, the red planet appeared.", image: page1Img },
      { text: "Anna planted the little tree in special Martian soil. 'This is for everyone on Earth,' she said. One day, Mars might have forests too.", image: page2Img }
    ],
    quiz: [
      { question: "What was Anna's mission?", options: ["Collect rocks", "Plant a tree on Mars", "Take photos", "Meet aliens"], correctAnswer: 1 },
      { question: "What color is Mars?", options: ["Blue", "Green", "Red", "Yellow"], correctAnswer: 2 },
      { question: "Why did Anna plant the tree?", options: ["For herself", "For everyone on Earth", "For aliens", "For fun"], correctAnswer: 1 }
    ]
  },
  {
    id: 'adventure-7',
    title: "The Time Traveler",
    author: "StoryTime Collection",
    coverImage: page1Img,
    description: "A journey through history",
    ageGroup: '9-12',
    pages: [
      { text: "When Theo fixed his grandfather's antique watch, he didn't expect to be transported to ancient Egypt. Pyramids rose before him, workers building monuments to the pharaohs.", image: page1Img },
      { text: "Theo observed but dared not interfere. He learned about daily life, wrote notes in his journal, and photographed hieroglyphics with his phone—a device that seemed like pure magic to ancient eyes.", image: page2Img },
      { text: "Returning home, Theo became the youngest Egyptologist, using his firsthand knowledge to solve mysteries that had puzzled historians for centuries.", image: page3Img }
    ],
    quiz: [
      { question: "How did Theo time travel?", options: ["A machine", "A magic word", "His grandfather's watch", "A book"], correctAnswer: 2 },
      { question: "Where did Theo travel to?", options: ["Ancient Rome", "Ancient Egypt", "The future", "Medieval times"], correctAnswer: 1 },
      { question: "What did Theo become?", options: ["A teacher", "An Egyptologist", "A watchmaker", "A photographer"], correctAnswer: 1 }
    ]
  },
  {
    id: 'adventure-8',
    title: "The Volcano Island",
    author: "StoryTime Collection",
    coverImage: page2Img,
    description: "Survival on a remote island",
    ageGroup: '9-12',
    pages: [
      { text: "When their boat crashed during a storm, Maya and her brother Kai found themselves stranded on an island with an active volcano. They had to survive until rescue arrived.", image: page2Img },
      { text: "Using survival skills from books, they built a shelter, found fresh water, and caught fish. But the volcano rumbled ominously each night.", image: page1Img },
      { text: "When the volcano finally erupted, they signaled a passing helicopter using reflective materials from the wreckage. Rescued! Their ordeal taught them resilience and the importance of staying calm under pressure.", image: page3Img }
    ],
    quiz: [
      { question: "How did Maya and Kai end up on the island?", options: ["A plane crash", "Their boat crashed", "They swam", "They were exploring"], correctAnswer: 1 },
      { question: "What was dangerous about the island?", options: ["Wild animals", "An active volcano", "Quicksand", "Poisonous plants"], correctAnswer: 1 },
      { question: "How were they rescued?", options: ["They fixed the boat", "A ship passed", "They signaled a helicopter", "They swam home"], correctAnswer: 2 }
    ]
  },
  {
    id: 'adventure-9',
    title: "The Arctic Expedition",
    author: "StoryTime Collection",
    coverImage: page3Img,
    description: "Journey to the frozen north",
    ageGroup: '9-12',
    pages: [
      { text: "Dr. Elena's team set out across the Arctic ice to study climate change effects. Their dog sled teams pulled equipment through temperatures that could freeze skin in minutes.", image: page3Img },
      { text: "They discovered ancient ice cores containing air from thousands of years ago—crucial data about Earth's history. But a sudden blizzard separated the team.", image: page1Img },
      { text: "Using radio signals and survival training, everyone reunited safely. Their findings would help scientists understand and fight climate change. The frozen frontier had tested them, but they emerged stronger.", image: page2Img }
    ],
    quiz: [
      { question: "What was the team studying?", options: ["Animals", "Stars", "Climate change", "Ancient artifacts"], correctAnswer: 2 },
      { question: "What did they find in the ice?", options: ["Fossils", "Ancient air", "Gold", "Frozen animals"], correctAnswer: 1 },
      { question: "What separated the team?", options: ["A fight", "A blizzard", "Getting lost", "Equipment failure"], correctAnswer: 1 }
    ]
  },
  {
    id: 'adventure-10',
    title: "The Sunken City",
    author: "StoryTime Collection",
    coverImage: page1Img,
    description: "Diving into history",
    ageGroup: '9-12',
    pages: [
      { text: "Marine archaeologist Dr. Lin discovered coordinates in an ancient manuscript pointing to a city lost beneath the Mediterranean Sea for 2,000 years.", image: page1Img },
      { text: "Her dive team explored streets, temples, and homes frozen in time on the ocean floor. Artifacts told stories of a civilization advanced beyond its era—astronomy tools, medical equipment, and art.", image: page2Img },
      { text: "The discovery rewrote history books. Dr. Lin's find proved that ancient peoples were far more sophisticated than previously believed. Some mysteries of the past were finally surfacing.", image: page3Img }
    ],
    quiz: [
      { question: "What did Dr. Lin discover?", options: ["Buried treasure", "A sunken city", "A shipwreck", "A coral reef"], correctAnswer: 1 },
      { question: "How long was the city underwater?", options: ["100 years", "500 years", "2,000 years", "10,000 years"], correctAnswer: 2 },
      { question: "What did the artifacts prove?", options: ["Ancient people were primitive", "The city was a myth", "Ancient people were sophisticated", "The ocean is deep"], correctAnswer: 2 }
    ]
  }
];

export const stories: Record<string, Story[]> = {
  'animals': animalsStories,
  'friends': friendsStories,
  'adventure': adventureStories,
};
