const levelBands = [
  {
    name: "Beginner",
    levelStart: 1,
    topics: [
      {
        topic: "Introduction",
        speaking: "Say: My name is ____.",
        expectedAnswer: "My name is ____.",
        grammar: "Use 'is' in 'My name is ...'",
        listeningText: "Hello, my name is Emma.",
      },
      {
        topic: "Countries",
        speaking: "Say where you are from.",
        expectedAnswer: "I am from ____.",
        grammar: "Use 'am' with I",
        listeningText: "I am from Thailand.",
      },
      {
        topic: "Age",
        speaking: "Say your age.",
        expectedAnswer: "I am ____ years old.",
        grammar: "Use 'am' with age statements",
        listeningText: "I am 18 years old.",
      },
      {
        topic: "Feelings",
        speaking: "Say how you feel today.",
        expectedAnswer: "I feel happy today.",
        grammar: "Use a simple feeling adjective",
        listeningText: "I feel calm today.",
      },
      {
        topic: "Family",
        speaking: "Introduce one family member.",
        expectedAnswer: "This is my brother.",
        grammar: "Use 'this is' for introductions",
        listeningText: "This is my sister Anna.",
      },
      {
        topic: "Home",
        speaking: "Describe where you live.",
        expectedAnswer: "I live in a small house.",
        grammar: "Use present simple for facts",
        listeningText: "I live in a small apartment.",
      },
      {
        topic: "Daily routine",
        speaking: "Say one morning activity.",
        expectedAnswer: "I wake up at seven.",
        grammar: "Use present simple for routines",
        listeningText: "I eat breakfast at seven.",
      },
      {
        topic: "Food",
        speaking: "Say one food you like.",
        expectedAnswer: "I like rice and chicken.",
        grammar: "Use like + noun",
        listeningText: "I like noodles for lunch.",
      },
      {
        topic: "Colors",
        speaking: "Describe an object with a color.",
        expectedAnswer: "My bag is blue.",
        grammar: "Use 'is' with a singular noun",
        listeningText: "My phone is black.",
      },
      {
        topic: "Weather",
        speaking: "Describe today's weather.",
        expectedAnswer: "Today is sunny.",
        grammar: "Use 'is' with weather adjectives",
        listeningText: "Today is rainy and cool.",
      }
    ]
  },
  {
    name: "Basic Conversation",
    levelStart: 21,
    topics: [
      {
        topic: "Greeting friends",
        speaking: "Greet a friend and ask one question.",
        expectedAnswer: "Hi, how are you today?",
        grammar: "Use a simple present-tense question",
        listeningText: "Hi, how was your day?",
      },
      {
        topic: "Ordering drinks",
        speaking: "Order a drink politely.",
        expectedAnswer: "Can I have a coffee, please?",
        grammar: "Use can I have for polite requests",
        listeningText: "Can I have iced tea, please?",
      },
      {
        topic: "Asking directions",
        speaking: "Ask how to get somewhere.",
        expectedAnswer: "How can I get to the station?",
        grammar: "Use how can I get to",
        listeningText: "Where is the nearest bank?",
      },
      {
        topic: "Shopping",
        speaking: "Ask the price of an item.",
        expectedAnswer: "How much is this shirt?",
        grammar: "Use how much is for one item",
        listeningText: "How much are these shoes?",
      },
      {
        topic: "Making plans",
        speaking: "Invite someone to do something.",
        expectedAnswer: "Do you want to study tonight?",
        grammar: "Use do you want to + verb",
        listeningText: "Do you want to watch a movie?",
      },
      {
        topic: "At work",
        speaking: "Describe one task at work.",
        expectedAnswer: "I answer emails in the morning.",
        grammar: "Use present simple for work tasks",
        listeningText: "I join meetings every Monday.",
      },
      {
        topic: "Transportation",
        speaking: "Explain how you go somewhere.",
        expectedAnswer: "I go to work by bus.",
        grammar: "Use by + transport",
        listeningText: "She goes to school by train.",
      },
      {
        topic: "Free time",
        speaking: "Talk about one hobby.",
        expectedAnswer: "I play badminton on weekends.",
        grammar: "Use present simple for habits",
        listeningText: "He reads comics after dinner.",
      },
      {
        topic: "Restaurant",
        speaking: "Order a meal and a drink.",
        expectedAnswer: "I would like fried rice and water.",
        grammar: "Use would like for polite ordering",
        listeningText: "I would like soup and tea.",
      },
      {
        topic: "Phone calls",
        speaking: "Start a short phone call.",
        expectedAnswer: "Hello, this is Nina speaking.",
        grammar: "Use this is when identifying yourself",
        listeningText: "Hello, may I speak to Tom?",
      }
    ]
  },
  {
    name: "Intermediate",
    levelStart: 41,
    topics: [
      {
        topic: "Past weekend",
        speaking: "Talk about what you did last weekend.",
        expectedAnswer: "I visited my cousin and cooked dinner.",
        grammar: "Use past simple verbs",
        listeningText: "I watched a film and relaxed at home.",
      },
      {
        topic: "Travel story",
        speaking: "Describe a short travel experience.",
        expectedAnswer: "I went to Bali and stayed near the beach.",
        grammar: "Use past simple with time order",
        listeningText: "We took a train and arrived late.",
      },
      {
        topic: "Learning goals",
        speaking: "Explain what you want to improve.",
        expectedAnswer: "I want to speak more clearly in meetings.",
        grammar: "Use want to + verb",
        listeningText: "I want to improve my listening skills.",
      },
      {
        topic: "Comparing things",
        speaking: "Compare two options.",
        expectedAnswer: "The blue plan is cheaper than the gold plan.",
        grammar: "Use comparative adjectives",
        listeningText: "This route is faster than the old one.",
      },
      {
        topic: "Health habits",
        speaking: "Describe one healthy habit.",
        expectedAnswer: "I try to drink more water every day.",
        grammar: "Use try to + verb",
        listeningText: "She tries to sleep before eleven.",
      },
      {
        topic: "Problem solving",
        speaking: "Explain a small problem and solution.",
        expectedAnswer: "My laptop was slow, so I restarted it.",
        grammar: "Use so to connect cause and result",
        listeningText: "The shop was closed, so we went home.",
      },
      {
        topic: "Opinions",
        speaking: "Give a simple opinion with a reason.",
        expectedAnswer: "I think online classes are useful because they save time.",
        grammar: "Use because to support an opinion",
        listeningText: "I think public parks are important because they help people relax.",
      },
      {
        topic: "Work updates",
        speaking: "Share a short project update.",
        expectedAnswer: "We finished the first draft and sent it today.",
        grammar: "Use past simple for completed actions",
        listeningText: "Our team solved the main bug this morning.",
      },
      {
        topic: "Future plans",
        speaking: "Talk about next month.",
        expectedAnswer: "I am going to start a new course next month.",
        grammar: "Use be going to for plans",
        listeningText: "They are going to move next year.",
      },
      {
        topic: "Advice",
        speaking: "Give one suggestion to a friend.",
        expectedAnswer: "You should practice a little every day.",
        grammar: "Use should for advice",
        listeningText: "You should take a short break first.",
      }
    ]
  },
  {
    name: "Discussion",
    levelStart: 61,
    topics: [
      {
        topic: "Work balance",
        speaking: "Share your view about work-life balance.",
        expectedAnswer: "I believe balance matters because rest improves focus.",
        grammar: "Use a clear opinion plus one reason",
        listeningText: "Flexible hours can reduce stress for many workers.",
      },
      {
        topic: "Technology",
        speaking: "Discuss one benefit and one risk of technology.",
        expectedAnswer: "Technology saves time, but it can also distract people.",
        grammar: "Use contrast with but",
        listeningText: "Social media connects people, but it can spread false news.",
      },
      {
        topic: "Education",
        speaking: "Explain what makes a class effective.",
        expectedAnswer: "A good class is interactive and gives clear examples.",
        grammar: "Use parallel adjectives clearly",
        listeningText: "Effective teachers ask questions and guide discussion.",
      },
      {
        topic: "Teamwork",
        speaking: "Describe a strong team.",
        expectedAnswer: "A strong team communicates openly and supports each member.",
        grammar: "Use present simple for general truths",
        listeningText: "Good teams share goals and solve problems together.",
      },
      {
        topic: "Environment",
        speaking: "Talk about one practical way to help the environment.",
        expectedAnswer: "People can reduce waste by reusing everyday items.",
        grammar: "Use can to describe practical actions",
        listeningText: "Cities can improve air quality by planting more trees.",
      },
      {
        topic: "Customer service",
        speaking: "Explain what good service means.",
        expectedAnswer: "Good service means listening carefully and responding quickly.",
        grammar: "Use gerunds after means",
        listeningText: "Great service includes patience, clarity, and respect.",
      },
      {
        topic: "Remote work",
        speaking: "Share one challenge of remote work.",
        expectedAnswer: "Remote work can feel isolating if communication is weak.",
        grammar: "Use can for possible effects",
        listeningText: "Remote teams need strong routines to stay aligned.",
      },
      {
        topic: "Decision making",
        speaking: "Explain how you make difficult decisions.",
        expectedAnswer: "I compare options, ask questions, and then choose carefully.",
        grammar: "Use a clear sequence of verbs",
        listeningText: "She reviews the data before making a decision.",
      },
      {
        topic: "Learning habits",
        speaking: "Discuss why habits matter.",
        expectedAnswer: "Small habits matter because they build progress over time.",
        grammar: "Use because to explain impact",
        listeningText: "Consistent practice often leads to steady improvement.",
      },
      {
        topic: "Community",
        speaking: "Describe what makes a community strong.",
        expectedAnswer: "A strong community helps people feel safe and connected.",
        grammar: "Use adjectives and complete clauses",
        listeningText: "Trust grows when neighbors help one another.",
      }
    ]
  },
  {
    name: "Advanced Thinking",
    levelStart: 81,
    topics: [
      {
        topic: "Leadership",
        speaking: "Explain a leadership quality you admire.",
        expectedAnswer: "I admire leaders who stay calm and make fair decisions.",
        grammar: "Use relative clauses to add detail",
        listeningText: "Strong leaders create trust by being consistent.",
      },
      {
        topic: "Ethics",
        speaking: "Discuss a simple ethical choice.",
        expectedAnswer: "Honesty matters even when the truth is uncomfortable.",
        grammar: "Use even when to express contrast",
        listeningText: "Fair rules matter because they protect everyone.",
      },
      {
        topic: "Innovation",
        speaking: "Describe how new ideas become useful.",
        expectedAnswer: "New ideas become useful when teams test and refine them.",
        grammar: "Use when clauses to explain process",
        listeningText: "Innovation grows when people share ideas openly.",
      },
      {
        topic: "Global issues",
        speaking: "Share a view on a global challenge.",
        expectedAnswer: "Climate action requires cooperation between governments, companies, and citizens.",
        grammar: "Use parallel noun lists for clarity",
        listeningText: "Public health improves when reliable information reaches everyone.",
      },
      {
        topic: "Culture",
        speaking: "Reflect on how culture shapes communication.",
        expectedAnswer: "Culture shapes communication by influencing tone, timing, and respect.",
        grammar: "Use by + gerund to explain method",
        listeningText: "Shared customs can make conversations smoother.",
      },
      {
        topic: "Conflict resolution",
        speaking: "Explain a mature way to solve conflict.",
        expectedAnswer: "People resolve conflict faster when they listen before reacting.",
        grammar: "Use before + clause accurately",
        listeningText: "Calm language can prevent a disagreement from growing.",
      },
      {
        topic: "Career growth",
        speaking: "Discuss how people grow professionally.",
        expectedAnswer: "Professional growth happens when people seek feedback and act on it.",
        grammar: "Use clear cause-and-effect clauses",
        listeningText: "Experience becomes valuable when it leads to better judgment.",
      },
      {
        topic: "Critical thinking",
        speaking: "Explain why evidence matters in decisions.",
        expectedAnswer: "Evidence matters because it reduces guesswork and bias.",
        grammar: "Use because to support claims precisely",
        listeningText: "Strong arguments rely on facts, not assumptions.",
      },
      {
        topic: "Future society",
        speaking: "Imagine one change in the future.",
        expectedAnswer: "Cities may become more walkable as people demand healthier spaces.",
        grammar: "Use may for thoughtful prediction",
        listeningText: "Workplaces may change as automation becomes common.",
      },
      {
        topic: "Personal values",
        speaking: "Describe a value that guides your choices.",
        expectedAnswer: "Responsibility guides my choices because it builds trust.",
        grammar: "Use abstract nouns with a clear reason",
        listeningText: "Patience helps people respond with care instead of anger.",
      }
    ]
  }
];

function buildLevelCatalog() {
  return levelBands.flatMap((band) => {
    return Array.from({ length: 20 }, (_unused, index) => {
      const template = band.topics[index % band.topics.length];
      const stage = index < 10 ? 1 : 2;
      const level = band.levelStart + index;

      const stageAddOn =
        stage === 1
          ? "Keep it short and clear."
          : "Add one more detail in a second sentence.";

      const listeningQuestion =
        stage === 1
          ? "Repeat the audio in one clear sentence."
          : "Repeat the audio, then add one related detail of your own.";

      return {
        level,
        band: band.name,
        stage,
        topic: template.topic,
        speaking: `${template.speaking} ${stageAddOn}`,
        expectedAnswer: template.expectedAnswer,
        grammar:
          stage === 1
            ? template.grammar
            : `${template.grammar}. Add one short supporting sentence.`,
        listening: `Listen and repeat: ${template.listeningText}`,
        listeningText: template.listeningText,
        listeningQuestion,
        reviewFocus: [
          level % 2 === 0 ? "grammar" : "fluency",
          level % 3 === 0 ? "pronunciation" : "listening",
        ],
      };
    });
  });
}

module.exports = {
  buildLevelCatalog,
};

