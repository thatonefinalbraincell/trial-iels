export const listeningTest4 = {
  title: 'Cambridge-style IELTS Academic Listening — Mock Test 4',
  skill: 'listening',
  description: 'Four-part Cambridge-style listening test covering a job application enquiry, a botanical garden tour, a research discussion on marine debris, and an academic lecture on printing technology history.',
  duration_min: 40,
  extra: {
    modes: ['practice', 'test'],
    test_mode_audio: 'tts',
    practice_mode_audio: 'tts'
  },
  sections: [
    {
      title: 'Part 1: Job application enquiry',
      instructions: 'Questions 1–10. Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      audio_path: '/uploads/audio/mock-test-4-part-1.mp3',
      body: `
        <div class="ielts-sheet">
          <h2>PART 1 <span>Questions 1–10</span></h2>
          <p>Complete the notes below.</p>
          <p><strong>Write ONE WORD AND/OR A NUMBER for each answer.</strong></p>
          <h3>Riverside Hotel — Job Application Details</h3>
          <table class="ielts-table">
            <tr><td>Applicant\'s surname:</td><td><span class="sheet-gap"><span class="gap-number">1</span></span></td></tr>
            <tr><td>Position applied for:</td><td>Assistant <span class="sheet-gap"><span class="gap-number">2</span></span></td></tr>
            <tr><td>Current occupation:</td><td><span class="sheet-gap"><span class="gap-number">3</span></span></td></tr>
            <tr><td>Hourly pay rate:</td><td>£<span class="sheet-gap sheet-gap--short"><span class="gap-number">4</span></span></td></tr>
            <tr><td>Preferred start date:</td><td><span class="sheet-gap"><span class="gap-number">5</span></span> July</td></tr>
            <tr><td>Type of accommodation preferred:</td><td><span class="sheet-gap"><span class="gap-number">6</span></span> flat</td></tr>
            <tr><td>Reference name:</td><td>Mr. Gerald <span class="sheet-gap"><span class="gap-number">7</span></span></td></tr>
            <tr><td>Reference relationship:</td><td>Former <span class="sheet-gap"><span class="gap-number">8</span></span></td></tr>
            <tr><td>Uniform size needed:</td><td><span class="sheet-gap sheet-gap--short"><span class="gap-number">9</span></span></td></tr>
            <tr><td>Interview time:</td><td><span class="sheet-gap"><span class="gap-number">10</span></span> p.m.</td></tr>
          </table>
        </div>
      `,
      tts_script: `
        Hello, Riverside Hotel HR department, how can I help you?
        Hi, I'm calling to enquire about the job application I submitted online.
        Of course. Can I take your surname first?
        Yes, it's Patel. P-A-T-E-L.
        Thank you, Mr. Patel. And which position did you apply for?
        The Assistant Chef role in the main kitchen.
        Ah yes, I see your application here. What is your current occupation, Mr. Patel?
        I'm working as a kitchen porter at the moment.
        Great. The assistant chef position has an hourly rate of £14.50.
        That's fine.
        When would you be available to start?
        I could start from the tenth of July.
        Perfect. The job includes optional housing. What type of accommodation would you prefer?
        A shared flat would be great to keep the costs down.
        Understood. You've provided Mr. Gerald Henderson as a reference. What is your relationship with him?
        He was my former manager at my last job.
        Excellent. We also need to prepare your uniform in case you are hired. What size are you?
        I take a medium size.
        Great. We would like to invite you for an interview. Would tomorrow afternoon at two p.m. work for you?
        Two p.m. is perfect, thank you so much.
      `,
      questions: [
        { number: 1, type: 'listening_form_completion', prompt: "Applicant's surname:", data: { word_limit: 1 }, answer: { answer: 'Patel' } },
        { number: 2, type: 'listening_form_completion', prompt: 'Position applied for: Assistant ____', data: { word_limit: 1 }, answer: { answer: 'Chef' } },
        { number: 3, type: 'listening_form_completion', prompt: 'Current occupation:', data: { word_limit: 2 }, answer: { answer: ['kitchen porter', 'porter'] } },
        { number: 4, type: 'listening_form_completion', prompt: 'Hourly pay rate: £____', data: { word_limit: 1 }, answer: { answer: '14.50' } },
        { number: 5, type: 'listening_form_completion', prompt: 'Preferred start date: ____ July', data: { word_limit: 1 }, answer: { answer: '10' } },
        { number: 6, type: 'listening_form_completion', prompt: 'Type of accommodation preferred: ____ flat', data: { word_limit: 1 }, answer: { answer: 'shared' } },
        { number: 7, type: 'listening_form_completion', prompt: 'Reference name: Mr. Gerald ____', data: { word_limit: 1 }, answer: { answer: 'Henderson' } },
        { number: 8, type: 'listening_form_completion', prompt: 'Reference relationship: Former ____', data: { word_limit: 1 }, answer: { answer: 'manager' } },
        { number: 9, type: 'listening_form_completion', prompt: 'Uniform size needed:', data: { word_limit: 1 }, answer: { answer: 'medium' } },
        { number: 10, type: 'listening_form_completion', prompt: 'Interview time: ____ p.m.', data: { word_limit: 1 }, answer: { answer: 'two' } }
      ]
    },
    {
      title: 'Part 2: Local botanical garden audio guide',
      instructions: 'Questions 11–20. Choose the correct letter A, B or C for questions 11–15. Match the sections to their features for questions 16–20.',
      audio_path: '/uploads/audio/mock-test-4-part-2.mp3',
      body: `
        <div class="ielts-sheet">
          <h2>PART 2 <span>Questions 11–20</span></h2>
          <h3>Riverside Botanical Gardens Guide</h3>
          <p><strong>Questions 11–15:</strong> Choose the correct letter, A, B or C.</p>
          <p><strong>Questions 16–20:</strong> Match each description with the correct garden section (A–G).</p>
        </div>
      `,
      tts_script: `
        Welcome to the Riverside Botanical Gardens. My name is Sarah, and I'll be guiding you through our beautiful grounds.
        Our gardens are open daily from nine a.m. until six p.m. During the summer, we extend our hours until eight p.m. on Fridays.
        The gardens were originally opened in 1952. We recently celebrated our fiftieth anniversary back in 2002.
        For safety, we request that you stay on the marked pathways at all times. Please do not touch or pick any of the plants, as some species are highly sensitive.
        Our first stop is the tropical glasshouse, which was built in 1968. It maintains a constant temperature of twenty-four degrees Celsius to support rainforest flora.
        To the left of the glasshouse is our rose garden, featuring over a hundred varieties of heritage roses.
        Next is the Japanese garden, which was designed by a master gardener from Kyoto in 1985 and includes a traditional tea house and koi pond.
        Beyond that, you will find our herb garden, containing medicinal and culinary plants used in Europe during the Middle Ages.
        Finally, our children's play area has been relocated to the pine grove near the exit. It features wooden climbing structures designed to blend with the trees.
      `,
      questions: [
        { number: 11, type: 'listening_mcq_single', prompt: 'What time does the botanical garden close on Friday in the summer?', data: { options: ['six p.m.', 'eight p.m.', 'nine p.m.'] }, answer: { answer: 'B' } },
        { number: 12, type: 'listening_mcq_single', prompt: 'When was the botanical garden originally opened?', data: { options: ['1952', '1968', '1985'] }, answer: { answer: 'A' } },
        { number: 13, type: 'listening_mcq_single', prompt: 'What safety rule are visitors asked to follow?', data: { options: ['wear protective footwear', 'stay on the marked pathways', 'do not take photographs'] }, answer: { answer: 'B' } },
        { number: 14, type: 'listening_mcq_single', prompt: 'What temperature is maintained inside the tropical glasshouse?', data: { options: ['twenty degrees Celsius', 'twenty-four degrees Celsius', 'thirty degrees Celsius'] }, answer: { answer: 'B' } },
        { number: 15, type: 'listening_mcq_single', prompt: 'Where is the children\'s play area now located?', data: { options: ['near the main entrance', 'next to the rose garden', 'in the pine grove near the exit'] }, answer: { answer: 'C' } },
        { number: 16, type: 'listening_matching', prompt: 'features rainforest flora and high humidity', data: { options: [{ id: 'A', text: 'tropical glasshouse' }, { id: 'B', text: 'rose garden' }, { id: 'C', text: 'Japanese garden' }, { id: 'D', text: 'herb garden' }, { id: 'E', text: 'pine grove' }, { id: 'F', text: 'main entrance' }, { id: 'G', text: 'children\'s play area' }] }, answer: { answer: 'A' } },
        { number: 17, type: 'listening_matching', prompt: 'contains over a hundred heritage varieties', data: { options: [{ id: 'A', text: 'tropical glasshouse' }, { id: 'B', text: 'rose garden' }, { id: 'C', text: 'Japanese garden' }, { id: 'D', text: 'herb garden' }, { id: 'E', text: 'pine grove' }, { id: 'F', text: 'main entrance' }, { id: 'G', text: 'children\'s play area' }] }, answer: { answer: 'B' } },
        { number: 18, type: 'listening_matching', prompt: 'features a traditional tea house and pond', data: { options: [{ id: 'A', text: 'tropical glasshouse' }, { id: 'B', text: 'rose garden' }, { id: 'C', text: 'Japanese garden' }, { id: 'D', text: 'herb garden' }, { id: 'E', text: 'pine grove' }, { id: 'F', text: 'main entrance' }, { id: 'G', text: 'children\'s play area' }] }, answer: { answer: 'C' } },
        { number: 19, type: 'listening_matching', prompt: 'holds medicinal and culinary plants from the Middle Ages', data: { options: [{ id: 'A', text: 'tropical glasshouse' }, { id: 'B', text: 'rose garden' }, { id: 'C', text: 'Japanese garden' }, { id: 'D', text: 'herb garden' }, { id: 'E', text: 'pine grove' }, { id: 'F', text: 'main entrance' }, { id: 'G', text: 'children\'s play area' }] }, answer: { answer: 'D' } },
        { number: 20, type: 'listening_matching', prompt: 'contains the newly relocated play area', data: { options: [{ id: 'A', text: 'tropical glasshouse' }, { id: 'B', text: 'rose garden' }, { id: 'C', text: 'Japanese garden' }, { id: 'D', text: 'herb garden' }, { id: 'E', text: 'pine grove' }, { id: 'F', text: 'main entrance' }, { id: 'G', text: 'children\'s play area' }] }, answer: { answer: 'E' } }
      ]
    },
    {
      title: 'Part 3: Academic discussion on marine debris research',
      instructions: 'Questions 21–30. Answer the multiple choice questions and complete the sentences.',
      audio_path: '/uploads/audio/mock-test-4-part-3.mp3',
      body: `
        <div class="ielts-sheet">
          <h2>PART 3 <span>Questions 21–30</span></h2>
          <h3>Seminar: Marine Plastic Pollution Study</h3>
          <p><strong>Questions 21–22:</strong> Choose TWO letters.</p>
          <p><strong>Questions 23–24:</strong> Choose TWO letters.</p>
          <p><strong>Questions 25–30:</strong> Complete the sentences. Write ONE WORD ONLY.</p>
        </div>
      `,
      tts_script: `
        Hello everyone, for our marine biology seminar today, let's discuss our research on plastic debris in coastal waters.
        First, what were the two main sources of marine plastics that we identified during our beach survey?
        Well, for me, it was fishing gear, like discarded nets, and plastic packaging from consumer goods. Those were the most common.
        I'd agree, though we also saw a lot of industrial pellets, which was alarming.
        Okay. And what two mitigation strategies did the studies we reviewed find most successful?
        Definitely banning single-use shopping bags — that has had a huge effect in several countries.
        Also, deposit return schemes for bottles, which encourage recycling.
        Good. Now let's talk about our survey methodology.
        We found that wind direction was the most critical factor affecting where debris washed ashore.
        And the density of microplastics in the sediment was highest in sandy areas rather than rocky shores.
        We also noticed that local tides affected when the debris was deposited.
        One surprising result was that seabird nests often contained plastic fibers.
        And finally, public clean-up campaigns improved community awareness considerably.
      `,
      questions: [
        { number: 21, type: 'listening_mcq_multi', prompt: 'Which TWO main sources of marine plastic debris did the students identify?', data: { options: ['discarded fishing gear', 'tourist litter', 'consumer plastic packaging', 'agricultural runoff', 'ship waste'], choose: 2, display_numbers: '21-22' }, answer: { answer: ['A', 'C'] }, points: 2 },
        { number: 22, type: 'listening_mcq_multi', prompt: 'Question 22 shares the answer with Question 21.', data: { options: [], choose: 0, linked_to: 21 }, answer: { ignore: true }, points: 0 },
        { number: 23, type: 'listening_mcq_multi', prompt: 'Which TWO mitigation strategies were found most successful in reducing coastal debris?', data: { options: ['banning single-use bags', 'increasing beach patrol fines', 'deposit return schemes', 'installing ocean barriers', 'raising public park fees'], choose: 2, display_numbers: '23-24' }, answer: { answer: ['A', 'C'] }, points: 2 },
        { number: 24, type: 'listening_mcq_multi', prompt: 'Question 24 shares the answer with Question 23.', data: { options: [], choose: 0, linked_to: 23 }, answer: { ignore: true }, points: 0 },
        { number: 25, type: 'listening_sentence_completion', prompt: 'Debris distribution was most affected by wind ____', data: { word_limit: 1 }, answer: { answer: 'direction' } },
        { number: 26, type: 'listening_sentence_completion', prompt: 'Microplastic density was highest on ____ shores.', data: { word_limit: 1 }, answer: { answer: 'sandy' } },
        { number: 27, type: 'listening_sentence_completion', prompt: 'Local ____ determined when debris was deposited on the beach.', data: { word_limit: 1 }, answer: { answer: 'tides' } },
        { number: 28, type: 'listening_sentence_completion', prompt: 'Plastic ____ were frequently found in seabird nests.', data: { word_limit: 1 }, answer: { answer: 'fibers' } },
        { number: 29, type: 'listening_sentence_completion', prompt: 'Public clean-up campaigns helped increase community ____.', data: { word_limit: 1 }, answer: { answer: 'awareness' } },
        { number: 30, type: 'listening_sentence_completion', prompt: 'Deposit return schemes encourage the ____ of bottles.', data: { word_limit: 1 }, answer: { answer: 'recycling' } }
      ]
    },
    {
      title: 'Part 4: Academic lecture on the history of printing technology',
      instructions: 'Questions 31–40. Complete the notes below. Write ONE WORD ONLY for each answer.',
      audio_path: '/uploads/audio/mock-test-4-part-4.mp3',
      body: `
        <div class="ielts-sheet ielts-sheet--notes">
          <h2>PART 4 <span>Questions 31–40</span></h2>
          <p>Complete the notes below.</p>
          <p><strong>Write ONE WORD ONLY for each answer.</strong></p>
          <div class="note-box">
            <h3>History of Printing Technology</h3>
            <p><strong>Early methods</strong></p>
            <ul>
              <li>Woodblock printing was first developed in <span class="sheet-gap"><span class="gap-number">31</span></span></li>
              <li>Early texts were printed on sheets made of <span class="sheet-gap"><span class="gap-number">32</span></span></li>
              <li>Movable type using clay was invented by Bi Sheng in the eleventh <span class="sheet-gap"><span class="gap-number">33</span></span></li>
            </ul>
            <p><strong>The Gutenberg revolution</strong></p>
            <ul>
              <li>Gutenberg created durable type using a metal <span class="sheet-gap"><span class="gap-number">34</span></span></li>
              <li>He adapted a wooden press originally used for making <span class="sheet-gap"><span class="gap-number">35</span></span></li>
              <li>The first major book printed was the Gutenberg <span class="sheet-gap"><span class="gap-number">36</span></span></li>
            </ul>
            <p><strong>Societal impact</strong></p>
            <ul>
              <li>Rapid spread of printing lowered the cost of <span class="sheet-gap"><span class="gap-number">37</span></span></li>
              <li>Increased availability of texts helped boost global <span class="sheet-gap"><span class="gap-number">38</span></span> rates</li>
              <li>Scientific findings could be shared more quickly, accelerating <span class="sheet-gap"><span class="gap-number">39</span></span></li>
              <li>Standardization of spelling helped unify local <span class="sheet-gap"><span class="gap-number">40</span></span></li>
            </ul>
          </div>
        </div>
      `,
      tts_script: `
        Today, we'll examine the history of printing technology and its transformative impact on human society.
        Before the printing press, books were copied by hand, a slow process that made them rare luxury items.
        The earliest printing method, woodblock printing, was developed in China during the Tang dynasty.
        These early texts were printed on sheets made of silk or paper.
        In the eleventh century, an inventor named Bi Sheng created the first movable type system using clay blocks.
        The major breakthrough in Europe occurred around 1440, when Johannes Gutenberg developed a system of movable metal type.
        Gutenberg formulated a durable type using an alloy, or metal mixture, of lead, tin, and antimony.
        To press the ink onto the page, he adapted a wooden press design that was traditionally used for making wine.
        His first major printed work was the Gutenberg Bible, completed in 1455.
        The spread of this technology was rapid. Within decades, printing presses were active in major European cities.
        By reducing the labor needed to make books, printing drastically lowered the cost of books.
        This made texts accessible to a wider audience, which helped boost literacy rates among the public.
        It also transformed science. Researchers could share their findings quickly, accelerating discoveries.
        Finally, printing helped standardize spelling and grammar, unifying local languages across different regions.
      `,
      questions: [
        { number: 31, type: 'listening_note_completion', prompt: 'Woodblock printing was first developed in ____', data: { word_limit: 1 }, answer: { answer: 'China' } },
        { number: 32, type: 'listening_note_completion', prompt: 'Early texts were printed on sheets made of ____', data: { word_limit: 1 }, answer: { answer: 'silk' } },
        { number: 33, type: 'listening_note_completion', prompt: 'Movable type using clay was invented by Bi Sheng in the eleventh ____', data: { word_limit: 1 }, answer: { answer: 'century' } },
        { number: 34, type: 'listening_note_completion', prompt: 'Gutenberg created durable type using a metal ____', data: { word_limit: 1 }, answer: { answer: 'alloy' } },
        { number: 35, type: 'listening_note_completion', prompt: 'He adapted a wooden press originally used for making ____', data: { word_limit: 1 }, answer: { answer: 'wine' } },
        { number: 36, type: 'listening_note_completion', prompt: 'The first major book printed was the Gutenberg ____', data: { word_limit: 1 }, answer: { answer: 'Bible' } },
        { number: 37, type: 'listening_note_completion', prompt: 'Rapid spread of printing lowered the cost of ____', data: { word_limit: 1 }, answer: { answer: 'books' } },
        { number: 38, type: 'listening_note_completion', prompt: 'Increased availability of texts helped boost global ____ rates', data: { word_limit: 1 }, answer: { answer: 'literacy' } },
        { number: 39, type: 'listening_note_completion', prompt: 'Scientific findings could be shared more quickly, accelerating ____', data: { word_limit: 1 }, answer: { answer: 'discoveries' } },
        { number: 40, type: 'listening_note_completion', prompt: 'Standardization of spelling helped unify local ____', data: { word_limit: 1 }, answer: { answer: 'languages' } }
      ]
    }
  ]
}
