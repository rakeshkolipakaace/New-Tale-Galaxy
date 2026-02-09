export interface StoryPage {
  text: string;
  image?: any;
}

export interface Story {
  id: string;
  title: string;
  author: string;
  category: string;
  readTime: string;
  coverGradient: [string, string];
  content: string;
  pages: StoryPage[];
  icon: string;
  image: any;
  ageMin: number;
  ageMax: number;
  moral: string;
}

export const stories: Story[] = [
  {
    id: "1",
    title: "The Tortoise and the Hare",
    author: "Aesop",
    category: "Fable",
    readTime: "3 min",
    coverGradient: ["#FF6B6B", "#FF8E53"],
    icon: "leaf",
    image: require("@/assets/images/story-1.png"),
    ageMin: 3,
    ageMax: 8,
    moral: "Slow and steady wins the race.",
    content:
      "Once upon a time there was a hare who was always boasting about how fast he could run. Tired of hearing him boast, the tortoise challenged him to a race. All the animals in the forest gathered to watch. The hare ran down the road for a while and then paused to rest. He looked back at the tortoise and laughed. Poor old tortoise he said. I am so far ahead that I think I will take a nap. The hare stretched out along the road and fell asleep thinking he would surely win. The tortoise walked and walked. He never stopped until he came to the finish line. The animals who were watching cheered so loudly that they woke up the hare. The hare stretched and yawned and began to run again but it was too late. The tortoise had already won the race. Slow and steady wins the race.",
    pages: [
      {
        text: "Once upon a time there was a hare who was always boasting about how fast he could run. Tired of hearing him boast, the tortoise challenged him to a race. All the animals in the forest gathered to watch.",
        image: require("@/assets/images/story-1.png")
      },
      {
        text: "The hare ran down the road for a while and then paused to rest. He looked back at the tortoise and laughed. Poor old tortoise he said. I am so far ahead that I think I will take a nap."
      },
      {
        text: "The hare stretched out along the road and fell asleep thinking he would surely win. The tortoise walked and walked. He never stopped until he came to the finish line."
      },
      {
        text: "The animals who were watching cheered so loudly that they woke up the hare. The hare stretched and yawned and began to run again but it was too late. The tortoise had already won the race. Slow and steady wins the race."
      }
    ],
  },
  {
    id: "2",
    title: "The Fox and the Grapes",
    author: "Aesop",
    category: "Fable",
    readTime: "2 min",
    coverGradient: ["#4ECDC4", "#44A08D"],
    icon: "nutrition",
    image: require("@/assets/images/story-2.png"),
    ageMin: 3,
    ageMax: 9,
    moral: "It is easy to despise what you cannot get.",
    content:
      "One hot summer day a fox was walking through an orchard. He stopped before a bunch of grapes that were hanging from a vine high above his head. Those grapes look so juicy and sweet he said to himself. What a lovely treat they would be for a thirsty fox like me. He jumped up trying to reach the grapes but he could not quite get to them. He stepped back and tried again jumping even higher this time but still could not reach them. He tried again and again but each time he failed. Finally the fox turned away from the grapes and said to himself. Those grapes are probably sour anyway. I am sure they are not worth eating. It is easy to despise what you cannot get.",
    pages: [
      {
        text: "One hot summer day a fox was walking through an orchard. He stopped before a bunch of grapes that were hanging from a vine high above his head.",
        image: require("@/assets/images/story-2.png")
      },
      {
        text: "Those grapes look so juicy and sweet he said to himself. What a lovely treat they would be for a thirsty fox like me. He jumped up trying to reach the grapes but he could not quite get to them."
      },
      {
        text: "He stepped back and tried again jumping even higher this time but still could not reach them. He tried again and again but each time he failed."
      },
      {
        text: "Finally the fox turned away from the grapes and said to himself. Those grapes are probably sour anyway. I am sure they are not worth eating. It is easy to despise what you cannot get."
      }
    ],
  },
  {
    id: "3",
    title: "The Boy Who Cried Wolf",
    author: "Aesop",
    category: "Fable",
    readTime: "3 min",
    coverGradient: ["#A18CD1", "#FBC2EB"],
    icon: "paw",
    image: require("@/assets/images/story-3.png"),
    ageMin: 4,
    ageMax: 10,
    moral: "Nobody believes a liar even when he is telling the truth.",
    content:
      "There once was a shepherd boy who was bored as he sat on the hillside watching the village sheep. To amuse himself he took a great breath and sang out. Wolf Wolf The wolf is chasing the sheep. The villagers came running up the hill to help the boy drive the wolf away. But when they arrived at the top of the hill they found no wolf. The boy laughed at the sight of their angry faces. The boy cried wolf several more times and each time the villagers came running only to find that there was no wolf. Then one evening as the sun was going down a real wolf did come. The boy cried out as loud as he could. Wolf Wolf Please come help me the wolf is attacking the sheep. But no one came. The villagers thought he was trying to fool them again. That night the wolf ate many of the sheep. Nobody believes a liar even when he is telling the truth.",
    pages: [
      {
        text: "There once was a shepherd boy who was bored as he sat on the hillside watching the village sheep. To amuse himself he took a great breath and sang out. Wolf Wolf The wolf is chasing the sheep.",
        image: require("@/assets/images/story-3.png")
      },
      {
        text: "The villagers came running up the hill to help the boy drive the wolf away. But when they arrived at the top of the hill they found no wolf. The boy laughed at the sight of their angry faces."
      },
      {
        text: "The boy cried wolf several more times and each time the villagers came running only to find that there was no wolf. Then one evening as the sun was going down a real wolf did come."
      },
      {
        text: "The boy cried out as loud as he could. Wolf Wolf Please come help me the wolf is attacking the sheep. But no one came. The villagers thought he was trying to fool them again. That night the wolf ate many of the sheep. Nobody believes a liar even when he is telling the truth."
      }
    ],
  },
  {
    id: "4",
    title: "The Ant and the Grasshopper",
    author: "Aesop",
    category: "Fable",
    readTime: "2 min",
    coverGradient: ["#F093FB", "#F5576C"],
    icon: "bug",
    image: require("@/assets/images/story-4.png"),
    ageMin: 4,
    ageMax: 10,
    moral: "It is best to prepare for the days of necessity.",
    content:
      "In a field one summer day a grasshopper was hopping about chirping and singing to its heart content. An ant passed by bearing along with great effort a kernel of corn he was taking to the nest. Why not come and chat with me said the grasshopper instead of toiling and working in that way. I am helping to store up food for the winter said the ant and I suggest you do the same. Why bother about winter said the grasshopper. We have got plenty of food right now. The ant went on its way and continued its work. When the winter came the grasshopper had no food and found itself dying of hunger while every day it saw the ants eating from the corn they had collected in the summer. It is best to prepare for the days of necessity.",
    pages: [
      {
        text: "In a field one summer day a grasshopper was hopping about chirping and singing to its heart content. An ant passed by bearing along with great effort a kernel of corn he was taking to the nest.",
        image: require("@/assets/images/story-4.png")
      },
      {
        text: "Why not come and chat with me said the grasshopper instead of toiling and working in that way. I am helping to store up food for the winter said the ant and I suggest you do the same."
      },
      {
        text: "Why bother about winter said the grasshopper. We have got plenty of food right now. The ant went on its way and continued its work."
      },
      {
        text: "When the winter came the grasshopper had no food and found itself dying of hunger while every day it saw the ants eating from the corn they had collected in the summer. It is best to prepare for the days of necessity."
      }
    ],
  },
  {
    id: "5",
    title: "The Lion and the Mouse",
    author: "Aesop",
    category: "Fable",
    readTime: "3 min",
    coverGradient: ["#F5AF19", "#F12711"],
    icon: "sunny",
    image: require("@/assets/images/story-5.png"),
    ageMin: 3,
    ageMax: 9,
    moral: "No act of kindness, no matter how small, is ever wasted.",
    content:
      "A lion lay asleep in the forest his great head resting on his paws. A timid little mouse came upon him unexpectedly and in her fright she ran across his nose. Roused from his nap the lion laid his huge paw angrily on the tiny creature to kill her. Spare me cried the little mouse. Please let me go and some day I will surely repay you. The lion was so amused at the idea of the mouse being able to help him that he laughed and let her go. Some time later the lion was caught in a net laid by some hunters. He struggled to free himself but the ropes were too strong. Just then the little mouse happened to pass by. She gnawed at the ropes until the lion was free. You laughed when I said I would repay you said the mouse. Now you see that even a mouse can help a lion. No act of kindness no matter how small is ever wasted.",
    pages: [
      {
        text: "A lion lay asleep in the forest his great head resting on his paws. A timid little mouse came upon him unexpectedly and in her fright she ran across his nose.",
        image: require("@/assets/images/story-5.png")
      },
      {
        text: "Roused from his nap the lion laid his huge paw angrily on the tiny creature to kill her. Spare me cried the little mouse. Please let me go and some day I will surely repay you."
      },
      {
        text: "The lion was so amused at the idea of the mouse being able to help him that he laughed and let her go. Some time later the lion was caught in a net laid by some hunters."
      },
      {
        text: "He struggled to free himself but the ropes were too strong. Just then the little mouse happened to pass by. She gnawed at the ropes until the lion was free. You laughed when I said I would repay you said the mouse. Now you see that even a mouse can help a lion. No act of kindness no matter how small is ever wasted."
      }
    ],
  },
  {
    id: "6",
    title: "The Wind and the Sun",
    author: "Aesop",
    category: "Fable",
    readTime: "2 min",
    coverGradient: ["#11998E", "#38EF7D"],
    icon: "partly-sunny",
    image: require("@/assets/images/story-6.png"),
    ageMin: 5,
    ageMax: 12,
    moral: "Gentleness and kind persuasion win where force and bluster fail.",
    content:
      "The wind and the sun were disputing which was the stronger. Suddenly they saw a traveler coming down the road and the sun said. I see a way to decide our dispute. Whichever of us can cause that traveler to take off his cloak shall be regarded as the stronger. You begin said the sun and she retired behind a cloud. The wind began to blow as hard as it could upon the traveler. But the harder he blew the more closely did the traveler wrap his cloak around him. At last the wind gave up in despair. Then the sun came out and shone in all her glory upon the traveler. The traveler soon felt the warmth and took off his cloak. The sun was declared the winner. Gentleness and kind persuasion win where force and bluster fail.",
    pages: [
      {
        text: "The wind and the sun were disputing which was the stronger. Suddenly they saw a traveler coming down the road and the sun said.",
        image: require("@/assets/images/story-6.png")
      },
      {
        text: "I see a way to decide our dispute. Whichever of us can cause that traveler to take off his cloak shall be regarded as the stronger. You begin said the sun and she retired behind a cloud."
      },
      {
        text: "The wind began to blow as hard as it could upon the traveler. But the harder he blew the more closely did the traveler wrap his cloak around him. At last the wind gave up in despair."
      },
      {
        text: "Then the sun came out and shone in all her glory upon the traveler. The traveler soon felt the warmth and took off his cloak. The sun was declared the winner. Gentleness and kind persuasion win where force and bluster fail."
      }
    ],
  },
];
