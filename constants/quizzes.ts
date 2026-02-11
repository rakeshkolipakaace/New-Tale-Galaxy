export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  storyId: string;
  questions: QuizQuestion[];
}

export const quizzes: Quiz[] = [
  {
    storyId: "1",
    questions: [
      {
        id: "tortoise-1",
        question: "Who challenged the hare to a race?",
        options: ["The fox", "The tortoise", "The lion", "The mouse"],
        correctAnswer: 1,
        explanation: "The tortoise challenged the hare to a race because he was tired of hearing the hare boast about how fast he could run."
      },
      {
        id: "tortoise-2", 
        question: "What did the hare do during the race?",
        options: ["Ran the whole time", "Took a nap", "Gave up", "Got lost"],
        correctAnswer: 1,
        explanation: "The hare was so far ahead that he decided to take a nap during the race."
      },
      {
        id: "tortoise-3",
        question: "Who won the race?",
        options: ["The hare", "The tortoise", "Both tied", "Neither finished"],
        correctAnswer: 1,
        explanation: "The tortoise won the race because he kept going steadily while the hare slept."
      },
      {
        id: "tortoise-4",
        question: "What is the moral of the story?",
        options: ["Fast is always better", "Slow and steady wins the race", "Napping is good", "Boasting helps you win"],
        correctAnswer: 1,
        explanation: "The moral is 'Slow and steady wins the race' - persistence and consistency are more important than speed."
      }
    ]
  },
  {
    storyId: "2",
    questions: [
      {
        id: "fox-1",
        question: "What did the fox see in the orchard?",
        options: ["Apples", "Oranges", "Grapes", "Berries"],
        correctAnswer: 2,
        explanation: "The fox saw a bunch of grapes hanging from a vine high above his head."
      },
      {
        id: "fox-2",
        question: "Why couldn't the fox reach the grapes?",
        options: ["They were too high", "He was too tired", "Someone stopped him", "He didn't try"],
        correctAnswer: 0,
        explanation: "The grapes were hanging too high above the fox's head for him to reach."
      },
      {
        id: "fox-3",
        question: "What did the fox say about the grapes at the end?",
        options: ["They were delicious", "They were probably sour", "He would try again", "He asked for help"],
        correctAnswer: 1,
        explanation: "The fox said 'Those grapes are probably sour anyway' because he couldn't reach them."
      },
      {
        id: "fox-4",
        question: "What is the moral of this story?",
        options: ["Always keep trying", "It's easy to despise what you cannot get", "Grapes are healthy", "Foxes are clever"],
        correctAnswer: 1,
        explanation: "The moral is 'It is easy to despise what you cannot get' - people often criticize things they can't have."
      }
    ]
  },
  {
    storyId: "3",
    questions: [
      {
        id: "wolf-1",
        question: "What was the shepherd boy's job?",
        options: ["Farming", "Watching sheep", "Hunting wolves", "Building houses"],
        correctAnswer: 1,
        explanation: "The shepherd boy was responsible for watching the village sheep on the hillside."
      },
      {
        id: "wolf-2",
        question: "What did the boy cry out when he was bored?",
        options: ["Fire!", "Help!", "Wolf! Wolf!", "Thief!"],
        correctAnswer: 2,
        explanation: "The boy cried 'Wolf! Wolf!' to amuse himself and get attention from the villagers."
      },
      {
        id: "wolf-3",
        question: "What happened when a real wolf came?",
        options: ["The boy ran away", "The villagers helped", "No one came to help", "The wolf left"],
        correctAnswer: 2,
        explanation: "When a real wolf actually came, no one came to help because they thought the boy was lying again."
      },
      {
        id: "wolf-4",
        question: "What is the moral of the story?",
        options: ["Always tell the truth", "Wolves are dangerous", "Shepherding is easy", "Villagers are kind"],
        correctAnswer: 0,
        explanation: "The moral is 'Nobody believes a liar even when he is telling the truth' - honesty is important."
      }
    ]
  },
  {
    storyId: "4",
    questions: [
      {
        id: "ant-1",
        question: "What was the grasshopper doing in summer?",
        options: ["Working hard", "Chirping and singing", "Sleeping", "Eating"],
        correctAnswer: 1,
        explanation: "The grasshopper was hopping about, chirping and singing to his heart's content."
      },
      {
        id: "ant-2",
        question: "What was the ant doing?",
        options: ["Playing", "Resting", "Storing food for winter", "Building a house"],
        correctAnswer: 2,
        explanation: "The ant was working hard to store up food for the winter."
      },
      {
        id: "ant-3",
        question: "What happened to the grasshopper in winter?",
        options: ["He had plenty of food", "He was dying of hunger", "He migrated south", "He slept through winter"],
        correctAnswer: 1,
        explanation: "When winter came, the grasshopper had no food and found himself dying of hunger."
      },
      {
        id: "ant-4",
        question: "What is the moral of this story?",
        options: ["Having fun is important", "It's best to prepare for difficult times", "Ants are better than grasshoppers", "Winter is cold"],
        correctAnswer: 1,
        explanation: "The moral is 'It is best to prepare for the days of necessity' - planning ahead is wise."
      }
    ]
  },
  {
    storyId: "5",
    questions: [
      {
        id: "lion-1",
        question: "What was the lion doing when the mouse found him?",
        options: ["Hunting", "Eating", "Sleeping", "Playing"],
        correctAnswer: 2,
        explanation: "The lion lay asleep in the forest with his great head resting on his paws."
      },
      {
        id: "lion-2",
        question: "What did the mouse promise the lion?",
        options: ["To bring him food", "To repay him someday", "To be his friend", "To never bother him again"],
        correctAnswer: 1,
        explanation: "The mouse cried 'Please let me go and some day I will surely repay you.'"
      },
      {
        id: "lion-3",
        question: "How was the lion caught later?",
        options: ["In a trap", "In a net", "In a cave", "By hunters"],
        correctAnswer: 1,
        explanation: "Some time later, the lion was caught in a net laid by some hunters."
      },
      {
        id: "lion-4",
        question: "What is the moral of this story?",
        options: ["Lions are powerful", "Mice are weak", "No act of kindness is ever wasted", "Always help others"],
        correctAnswer: 2,
        explanation: "The moral is 'No act of kindness, no matter how small, is ever wasted' - even small favors can be returned."
      }
    ]
  },
  {
    storyId: "6",
    questions: [
      {
        id: "wind-1",
        question: "What were the wind and the sun disputing?",
        options: ["Who was faster", "Who was stronger", "Who was older", "Who was smarter"],
        correctAnswer: 1,
        explanation: "The wind and the sun were disputing which of them was the stronger."
      },
      {
        id: "wind-2",
        question: "Who did they see coming down the road?",
        options: ["A merchant", "A child", "A traveler", "A farmer"],
        correctAnswer: 2,
        explanation: "Suddenly they saw a traveler coming down the road."
      },
      {
        id: "wind-3",
        question: "What happened when the wind blew hard?",
        options: ["The traveler removed his cloak", "The traveler wrapped his cloak tighter", "The traveler ran away", "The traveler fell down"],
        correctAnswer: 1,
        explanation: "The harder the wind blew, the more closely the traveler wrapped his cloak around him."
      },
      {
        id: "wind-4",
        question: "What is the moral of the story?",
        options: ["Strength always wins", "Gentleness wins where force fails", "Travel is dangerous", "Weather is unpredictable"],
        correctAnswer: 1,
        explanation: "The moral is 'Gentleness and kind persuasion win where force and bluster fail' - being gentle is more effective than being harsh."
      }
    ]
  }
];
