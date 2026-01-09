import type { Question, Evaluation } from '@/types/interview';

// Mock question generation
export function generateMockQuestions(count: number): Question[] {
  const mockQuestions: Question[] = [
    {
      id: 'q1',
      question: 'Can you describe your experience with React and how you\'ve used it in your projects?',
      modelAnswer: 'When discussing React experience, focus on specific projects and the problems you solved. Start by mentioning the scale and complexity of applications you\'ve built. For example: "I have extensive experience with React, having built multiple production applications over the past 2 years. In my most recent project, I developed a dashboard application serving 10,000+ users, utilizing React hooks for state management, Context API for global state, and implemented code-splitting for optimal performance. I\'m particularly proud of reducing our bundle size by 40% through lazy loading and optimizing our component render cycles. I also have experience with React Testing Library and wrote comprehensive unit tests achieving 85% code coverage."',
      category: 'technical',
      difficulty: 'medium',
    },
    {
      id: 'q2',
      question: 'Tell me about a time when you had to deal with a difficult team member. How did you handle it?',
      modelAnswer: 'This is a behavioral question best answered using the STAR method. Situation: "In my previous role, I worked with a senior developer who was resistant to code reviews and often pushed changes without team consensus." Task: "As the team lead, I needed to address this while maintaining team harmony and code quality." Action: "I scheduled a one-on-one meeting to understand their perspective. I learned they felt their experience wasn\'t being respected. I then proposed a compromise: we\'d streamline our review process for their changes while still maintaining quality gates. I also asked them to mentor junior developers, which gave them recognition." Result: "This approach improved our relationship significantly. They became more collaborative, our code review process became more efficient, and the junior developers benefited from their mentorship. Team velocity increased by 25% over the next quarter."',
      category: 'behavioral',
      difficulty: 'medium',
    },
    {
      id: 'q3',
      question: 'How would you approach debugging a performance issue in a production application?',
      modelAnswer: 'Debugging performance issues requires a systematic approach. First, I would gather data: check monitoring tools (like DataDog or New Relic) to identify when the issue started and which endpoints/pages are affected. I\'d look at metrics like response times, CPU usage, memory consumption, and database query times. Next, I\'d reproduce the issue in a staging environment if possible. Then I\'d use profiling tools - Chrome DevTools for frontend issues, or APM tools for backend. For frontend, I\'d check for unnecessary re-renders, large bundle sizes, or unoptimized images. For backend, I\'d examine database queries (N+1 problems are common), API response sizes, and caching strategies. Once identified, I\'d implement fixes incrementally, test thoroughly, and monitor the results. Finally, I\'d document the issue and solution for future reference and consider adding alerts to catch similar issues early.',
      category: 'technical',
      difficulty: 'hard',
    },
    {
      id: 'q4',
      question: 'What interests you most about this position and our company?',
      modelAnswer: 'When answering this question, show you\'ve researched the company and connect your skills to their needs. For example: "I\'m excited about this position for several reasons. First, your company\'s mission to [specific company mission] aligns with my personal values - I\'m passionate about [related topic]. Second, the technical challenges you\'re facing with [specific challenge from job description] are exactly the kind of problems I enjoy solving. In my previous role, I worked on similar challenges and achieved [specific result]. Finally, I\'m impressed by your company culture of innovation and continuous learning. I saw that you recently [mention recent company achievement/news], which shows you\'re at the cutting edge of [industry]. I believe my experience with [relevant skills] combined with my eagerness to learn would allow me to contribute meaningfully to your team while growing professionally."',
      category: 'company-specific',
      difficulty: 'easy',
    },
    {
      id: 'q5',
      question: 'Describe a situation where you had to learn a new technology quickly. How did you approach it?',
      modelAnswer: 'Use the STAR method for this behavioral question. Situation: "Last year, our team needed to migrate our authentication system to use OAuth 2.0, a technology none of us had deep experience with, and we had a tight 3-week deadline." Task: "I volunteered to lead the research and implementation since I had some security background." Action: "I created a structured learning plan: spent the first 3 days reading official documentation and security best practices, then built a proof-of-concept in days 4-5. I joined online communities and studied real-world implementations from open-source projects. I also scheduled a call with a friend who had OAuth experience to review my approach. By day 7, I presented my findings and implementation plan to the team and conducted a knowledge-sharing session." Result: "We successfully implemented OAuth 2.0 in 2.5 weeks, ahead of schedule. The system handled 50,000+ authentications in the first month without issues. The experience taught me that combining official documentation with practical implementation and peer learning accelerates the learning process significantly."',
      category: 'behavioral',
      difficulty: 'medium',
    },
    {
      id: 'q6',
      question: 'How do you ensure code quality in your projects?',
      modelAnswer: 'Code quality is multi-faceted and requires consistent practices. First, I follow coding standards and style guides (like Airbnb style guide for JavaScript) enforced through linters like ESLint and Prettier for automatic formatting. Second, I write comprehensive tests - unit tests for individual functions (aiming for 80%+ coverage), integration tests for component interactions, and E2E tests for critical user flows. Third, I implement thorough code reviews where every PR requires at least one approval, focusing on logic correctness, edge cases, and maintainability. Fourth, I use static analysis tools like SonarQube to catch potential bugs and code smells. Fifth, I document complex logic and maintain up-to-date README files. Finally, I believe in continuous refactoring - addressing technical debt regularly rather than letting it accumulate. In my last project, these practices reduced our bug rate by 60% and made onboarding new developers much faster.',
      category: 'technical',
      difficulty: 'medium',
    },
    {
      id: 'q7',
      question: 'If you were given a project with unclear requirements, how would you proceed?',
      modelAnswer: 'Unclear requirements are common, and handling them well is crucial. First, I\'d schedule a meeting with stakeholders to ask clarifying questions: What problem are we solving? Who are the users? What does success look like? What are the constraints (timeline, resources, technical)? Second, I\'d create a requirements document based on our discussion and circulate it for feedback - this ensures everyone\'s aligned. Third, I\'d break the project into phases with early deliverables, allowing for feedback and course correction. I\'d propose starting with an MVP to validate assumptions. Fourth, I\'d maintain open communication channels - regular check-ins with stakeholders and transparent progress updates. Fifth, I\'d document decisions and trade-offs made along the way. For example, in a recent project with vague requirements, I organized a requirements workshop, created user stories with acceptance criteria, and delivered a prototype within 2 weeks. The early feedback revealed we were heading in the wrong direction, saving weeks of wasted effort.',
      category: 'situational',
      difficulty: 'medium',
    },
    {
      id: 'q8',
      question: 'What\'s your experience with TypeScript and why would you use it over JavaScript?',
      modelAnswer: 'I have 2+ years of experience with TypeScript and strongly advocate for its use in production applications. TypeScript provides static typing which catches errors at compile-time rather than runtime - in my experience, this prevents about 15% of bugs from reaching production. The type system serves as living documentation, making code more self-explanatory and easier to refactor. IDE support is significantly better with TypeScript, providing better autocomplete, refactoring tools, and inline documentation. I use TypeScript for: interfaces to define data structures, union types for flexible yet safe type definitions, generics for reusable components, and enums for constants. The main trade-off is initial setup time and a learning curve for the team, but I\'ve found the investment pays off quickly. In one project, after migrating from JavaScript to TypeScript, we reduced runtime errors by 40% and onboarding time for new developers decreased because the codebase was more understandable. However, for small scripts or prototypes, JavaScript can be more practical.',
      category: 'technical',
      difficulty: 'medium',
    },
    {
      id: 'q9',
      question: 'Describe a time when you missed a deadline. What happened and what did you learn?',
      modelAnswer: 'This question tests honesty and self-awareness. Situation: "In my second year as a developer, I underestimated the complexity of integrating a third-party payment API and missed a sprint deadline by 3 days." Task: "I was responsible for implementing the payment flow for our e-commerce platform, a critical feature for our Q4 launch." Action: "I should have asked for help earlier, but I was trying to solve everything independently. When I realized I wouldn\'t make the deadline, I immediately informed my manager 2 days before the due date, explained the technical blockers I was facing, and proposed solutions. We extended the deadline and I paired with a senior developer who had API integration experience." Result: "We completed the feature successfully, though late. The experience taught me valuable lessons: estimate with buffer time for unknowns, communicate risks early rather than hoping to catch up, and leverage team expertise proactively. Now I break down tasks into smaller chunks, identify risks upfront, and maintain transparent communication. Since then, I\'ve had a 95% on-time delivery rate over 2 years."',
      category: 'behavioral',
      difficulty: 'hard',
    },
    {
      id: 'q10',
      question: 'How do you stay updated with new technologies and industry trends?',
      modelAnswer: 'Staying current is essential in tech. I have a multi-pronged approach: First, I dedicate 5 hours weekly to learning - reading technical blogs (like Dev.to, Medium engineering blogs), following industry leaders on Twitter, and subscribing to newsletters like JavaScript Weekly and React Status. Second, I actively participate in developer communities - I\'m active on Stack Overflow and attend local meetups monthly. Third, I work on side projects to experiment with new technologies hands-on; for example, I recently built a mobile app with React Native to understand cross-platform development. Fourth, I take online courses when diving deep into a topic - recently completed a course on system design. Fifth, I listen to podcasts during commutes like Syntax and Software Engineering Daily. Sixth, I read technical documentation and RFCs for technologies I use professionally. Finally, I believe in "just-in-time" learning - when my team adopts a new technology, I deep-dive into it. This balanced approach keeps me informed about trends while maintaining depth in my core skills.',
      category: 'situational',
      difficulty: 'easy',
    },
    {
      id: 'q11',
      question: 'What testing strategies do you implement in your development process?',
      modelAnswer: 'I implement a comprehensive testing pyramid strategy. At the base: Unit Tests - I test individual functions and components in isolation using Jest and React Testing Library, aiming for 80%+ code coverage focusing on critical business logic. I test edge cases, error scenarios, and happy paths. Middle layer: Integration Tests - testing how multiple components work together, API integrations, and database operations. I use tools like Supertest for API testing. Top layer: End-to-End Tests - using Cypress or Playwright to test critical user journeys from the user\'s perspective. I keep these minimal (5-10 tests) as they\'re slow and brittle. Additionally, I implement: manual testing for UX/visual verification, performance testing using Lighthouse for frontend and load testing tools for backend, accessibility testing with tools like axe, and security testing for authentication flows. I practice TDD for complex logic - write tests first, then implementation. In my last project, this approach caught 85% of bugs before production, reduced debugging time by 50%, and gave the team confidence to refactor code safely.',
      category: 'technical',
      difficulty: 'hard',
    },
    {
      id: 'q12',
      question: 'Tell me about a project you\'re particularly proud of.',
      modelAnswer: 'I\'m most proud of a real-time collaboration dashboard I built for a healthcare client. The challenge was building a HIPAA-compliant application where multiple doctors could simultaneously view and update patient records with sub-second latency. Technical achievements: I architected a solution using WebSockets for real-time updates, implemented operational transformation for conflict resolution (similar to Google Docs), used Redis for caching frequently accessed data reducing database load by 70%, and implemented end-to-end encryption for data security. I optimized the frontend to handle 1000+ concurrent users without performance degradation. The project required me to learn about distributed systems, real-time data synchronization, and healthcare compliance requirements. Results: The system reduced average patient record update time from 5 minutes to 30 seconds, improved doctor collaboration across departments, and passed security audits on first try. The client reported a 40% improvement in care coordination efficiency. What made it particularly satisfying was the direct impact on patient care - doctors told us the system helped them save lives by enabling faster decision-making during emergencies.',
      category: 'behavioral',
      difficulty: 'medium',
    },
    {
      id: 'q13',
      question: 'How would you explain a complex technical concept to a non-technical stakeholder?',
      modelAnswer: 'Communicating technical concepts to non-technical audiences is a critical skill. My approach: First, understand their background and what they care about - executives care about ROI and risk, product managers care about features and timelines. Second, avoid jargon and use analogies. For example, when explaining microservices: "Imagine a restaurant. A monolithic application is like having one person cook, serve, and clean. Microservices are like having specialized staff - a chef cooks, a waiter serves, a dishwasher cleans. Each can work independently, and if one is busy, it doesn\'t stop the others." Third, focus on business impact rather than technical details - instead of "we\'ll implement Redis caching," say "this will make the app 3x faster and reduce server costs by 40%." Fourth, use visuals - diagrams, flowcharts, or simple drawings. Fifth, check for understanding by asking them to explain it back. For example, I once explained API rate limiting to our CEO as "similar to a nightclub having a maximum capacity - we let people in, but control the flow to maintain quality service for everyone inside." This approach has helped me get buy-in for technical initiatives consistently.',
      category: 'situational',
      difficulty: 'medium',
    },
    {
      id: 'q14',
      question: 'What\'s your approach to handling technical debt?',
      modelAnswer: 'Technical debt is inevitable, but managing it strategically is crucial. First, I categorize debt: critical (security vulnerabilities, major bugs), high-priority (performance issues, scalability blockers), medium (code quality, outdated dependencies), and low (nice-to-haves). Second, I maintain a technical debt log - documenting what exists, its impact, and estimated effort to fix. Third, I advocate for allocating 20% of sprint capacity to addressing technical debt - this prevents accumulation while allowing feature development. Fourth, I link debt paydown to business value: "Refactoring this module will reduce bug rate by 50% and make new feature development 30% faster." Fifth, I prevent new debt through: code reviews, architectural reviews for major features, documentation requirements, and automated quality checks. Sixth, I balance pragmatism with quality - sometimes incurring technical debt intentionally to meet deadlines is okay if we document it and schedule paydown. In my last role, we reduced technical debt by 60% over 6 months using this approach, which improved our deployment frequency and reduced production incidents significantly.',
      category: 'technical',
      difficulty: 'hard',
    },
    {
      id: 'q15',
      question: 'Where do you see yourself in 5 years?',
      modelAnswer: 'This question tests career ambition and whether you\'ll stay. Be honest but show alignment with the role. For example: "In 5 years, I see myself as a senior technical leader, either as a Staff Engineer or Engineering Manager, depending on which path I find more fulfilling as I grow. I\'m passionate about both technical excellence and mentoring others. In the next 1-2 years, I want to deepen my expertise in distributed systems and cloud architecture - I know your company is working on scaling challenges that would provide this experience. By year 3-4, I\'d like to be mentoring junior developers and leading architectural decisions for major features. Eventually, I want to contribute to technical strategy and help build high-performing engineering teams. What attracts me to this role is that I can see a clear path toward these goals here - your company values internal growth, has a strong engineering culture, and works on challenging technical problems. I\'m also committed to continuous learning and would pursue relevant certifications. Ultimately, I want to be someone who not only writes great code but also multiplies the effectiveness of the entire engineering team." This shows ambition while demonstrating commitment to growing with the company.',
      category: 'company-specific',
      difficulty: 'easy',
    },
  ];

  return mockQuestions.slice(0, count);
}

// Mock answer evaluation
export function generateMockEvaluation(userAnswer: string): Evaluation {
  const wordCount = userAnswer.trim().split(/\s+/).length;

  // Calculate score based on answer length and basic heuristics
  let score = 60; // Base score

  if (wordCount >= 100) score += 10;
  if (wordCount >= 150) score += 10;
  if (userAnswer.toLowerCase().includes('example')) score += 5;
  if (userAnswer.toLowerCase().includes('result')) score += 5;
  if (userAnswer.toLowerCase().includes('experience')) score += 5;

  score = Math.min(score, 95); // Cap at 95

  const evaluations = {
    high: {
      strengths: [
        'Your answer demonstrates clear understanding of the concept',
        'You provided concrete examples that illustrate your experience',
        'The structure of your answer is well-organized and easy to follow',
      ],
      areasForImprovement: [
        'Consider adding more specific metrics or outcomes to strengthen your impact',
        'You could elaborate slightly more on the challenges you faced',
      ],
      suggestions: [
        'Next time, try using the STAR method (Situation, Task, Action, Result) to structure your response',
        'Include specific numbers or percentages where possible to quantify your achievements',
        'Consider mentioning what you learned from this experience',
      ],
      detailedFeedback: 'This is a strong answer that demonstrates good understanding and relevant experience. Your response is well-structured and includes helpful examples. The answer shows that you can articulate your thoughts clearly, which is important in interviews. To make it even stronger, consider adding more specific metrics about the outcomes you achieved. Also, explicitly mentioning lessons learned or skills developed would add depth to your response and show self-awareness.',
    },
    medium: {
      strengths: [
        'You addressed the main points of the question',
        'Your answer shows you have relevant experience',
      ],
      areasForImprovement: [
        'The answer could be more detailed with specific examples',
        'Consider adding more context about the situation and your role',
        'The response would benefit from mentioning concrete outcomes or results',
      ],
      suggestions: [
        'Expand your answer with a specific example from your experience',
        'Use the STAR method (Situation, Task, Action, Result) to structure your response',
        'Add quantifiable metrics where possible to demonstrate impact',
        'Practice elaborating on your answers to reach 150-250 words for comprehensive responses',
      ],
      detailedFeedback: 'Your answer addresses the question but would benefit from more detail and specific examples. While you demonstrate relevant knowledge, the response lacks the depth that interviewers typically look for. Consider providing a concrete example from your experience and walking through it using the STAR method. Adding specific outcomes or metrics would significantly strengthen your answer and make it more memorable.',
    },
    low: {
      strengths: [
        'You attempted to answer the question directly',
      ],
      areasForImprovement: [
        'The answer is too brief and lacks sufficient detail',
        'No specific examples or context provided',
        'Missing important elements like outcomes or results',
        'The response doesn\'t fully demonstrate your capabilities',
      ],
      suggestions: [
        'Aim for 150-250 words to provide a comprehensive answer',
        'Include a specific example from your experience using the STAR method',
        'Add details about the situation, your actions, and the results',
        'Practice expanding your answers with relevant context and examples',
        'Prepare stories in advance that demonstrate your skills and experience',
      ],
      detailedFeedback: 'Your answer is too brief and doesn\'t provide enough information for the interviewer to assess your capabilities. Strong interview answers typically include specific examples, context, and outcomes. I recommend using the STAR method (Situation, Task, Action, Result) to structure your responses. Prepare concrete examples from your experience in advance and practice articulating them. Aim for responses in the 150-250 word range for behavioral and technical questions to ensure you\'re providing sufficient detail.',
    },
  };

  let selectedEval;
  if (score >= 75) {
    selectedEval = evaluations.high;
  } else if (score >= 60) {
    selectedEval = evaluations.medium;
  } else {
    selectedEval = evaluations.low;
  }

  return {
    score,
    ...selectedEval,
  };
}
