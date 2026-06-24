export const readingTest4 = {
  title: 'Cambridge-style IELTS Academic Reading — Mock Test 4',
  skill: 'reading',
  description: 'Full-length academic reading mock with mixed question types across three passages.',
  duration_min: 60,
  sections: [
    {
      title: 'Reading Passage 1: The renaissance of cycling in modern cities',
      instructions: 'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      body: `
<p><span class="para-label">A</span>In many metropolitan centers across the globe, the bicycle is experiencing a major resurgence. Once pushed to the margins of urban transport by the rapid expansion of car ownership in the mid-twentieth century, cycling is now being embraced by city planners as a key solution to congestion, pollution, and public health issues. European capitals like Amsterdam and Copenhagen have set the standard, but cities in North America and Asia are now trying to replicate their success.</p>
<p><span class="para-label">B</span>The shift is being driven by significant investments in cycling infrastructure. Planners have realized that simply painting lanes on roads is insufficient to encourage widespread cycling. Instead, they are building protected cycle tracks separated from motor vehicle traffic by physical barriers such as curbs or planters. These separated lanes drastically improve safety and, crucially, lower the psychological barrier to cycling, making it appealing to children, elderly residents, and less confident riders.</p>
<p><span class="para-label">C</span>The economic and health arguments for cycling are backed by extensive research. A study by the World Health Organization estimated that investments in active transport yield a high economic benefit, primarily through reduced healthcare costs. Regular cycling lowers the risk of cardiovascular disease, obesity, and type 2 diabetes. Furthermore, replacing short car trips with cycling reduces local air pollution and carbon emissions, contributing directly to climate goals in urban areas.</p>
<p><span class="para-label">D</span>However, the redistribution of street space is often met with resistance. Business owners sometimes oppose the removal of street parking to make way for cycle lanes, fearing it will reduce customer footfall. Studies in cities like Toronto and London, however, have overturned this assumption, showing that cyclists and pedestrians actually spend more in local shops over a month than car drivers do, even if their individual transaction sizes are smaller. This highlights a gap between perception and reality in urban retail planning.</p>
<p><span class="para-label">E</span>The rise of electric bicycles (e-bikes) has further expanded what is possible. By providing motor assistance, e-bikes allow riders to cover longer distances, tackle steep hills, and commute without arriving at work exhausted. This technology has made cycling a viable option for people who live in hilly cities or have longer commutes, effectively widening the demographic of potential cyclists. However, it also requires planners to reconsider speed differentials on cycle lanes.</p>
<p><span class="para-label">F</span>Moreover, bike-sharing schemes have democratized access to cycling. First introduced as basic coin-operated systems in the 1960s, modern bike-share networks are high-tech operations utilizing smartphone apps and GPS tracking. Many cities now offer dockless or hybrid systems, allowing users to pick up and drop off bikes anywhere within a designated zone. These schemes have proved highly popular for "last-mile" trips, bridging the gap between public transport stations and final destinations.</p>
<p><span class="para-label">G</span>Ultimately, the success of the cycling renaissance depends on a cultural shift. While infrastructure is necessary, cities must also cultivate a "cycling culture" where the bicycle is viewed as a normal, respectable mode of transport rather than a recreational toy or a low-status choice. As cities continue to redesign their streets around people rather than cars, the bicycle is likely to reclaim its central place in urban mobility.</p>
`,
      questions: [
        { number: 1, type: 'reading_sentence_completion', prompt: 'In the mid-twentieth century, cycling was sidelined due to the rise of ____.', data: { word_limit: 1 }, answer: { answer: 'car ownership' } },
        { number: 2, type: 'reading_sentence_completion', prompt: 'Planners are building ____ cycle tracks separated from motor traffic by physical barriers.', data: { word_limit: 1 }, answer: { answer: 'protected' } },
        { number: 3, type: 'reading_sentence_completion', prompt: 'Active transport investments reduce municipal ____ costs.', data: { word_limit: 1 }, answer: { answer: 'healthcare' } },
        { number: 4, type: 'reading_sentence_completion', prompt: 'Modern bike-sharing systems are used for ____ trips between transit stations and destinations.', data: { word_limit: 1 }, answer: { answer: 'last-mile' } },
        { number: 5, type: 'reading_sentence_completion', prompt: 'A key to the renaissance is viewing bicycles as a normal mode of ____.', data: { word_limit: 1 }, answer: { answer: 'transport' } },
        { number: 6, type: 'reading_tfng', prompt: 'Amsterdam and Copenhagen have always had high rates of cycling since the 19th century.', data: null, answer: { answer: 'NOT GIVEN' } },
        { number: 7, type: 'reading_tfng', prompt: 'Painting lanes on roads is enough to make less confident riders feel safe.', data: null, answer: { answer: 'FALSE' } },
        { number: 8, type: 'reading_tfng', prompt: 'Business owners always benefit immediately from the removal of street parking.', data: null, answer: { answer: 'FALSE' } },
        { number: 9, type: 'reading_tfng', prompt: 'Pedestrians and cyclists spend more in local shops over a month than car drivers.', data: null, answer: { answer: 'TRUE' } },
        { number: 10, type: 'reading_tfng', prompt: 'E-bikes have reduced the distance that commuters are willing to travel.', data: null, answer: { answer: 'FALSE' } },
        { number: 11, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2, summary_title: 'Infrastructure and tech in urban cycling', summary_body: 'To encourage cycling, cities must install physical barriers like [11] to separate lanes. Technology has also helped, notably through [12] which assist with hills, and bike-sharing schemes that help bridge the gap for [13] journeys.' }, answer: { answer: ['curbs or planters', 'planters'] } },
        { number: 12, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: ['electric bicycles', 'e-bikes'] } },
        { number: 13, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'last-mile' } }
      ]
    },
    {
      title: 'Reading Passage 2: Cognitive abilities of crows and ravens',
      instructions: 'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      body: `
<p><span class="para-label">A</span>Crows, ravens, and other members of the corvid family are among the most intelligent birds on the planet. For decades, scientists have studied their cognitive abilities, discovering that they possess skills once thought to be unique to humans and other primates. Corvids can manufacture and use tools, solve complex puzzles, plan for the future, and even recognize individual human faces, demonstrating a level of cognitive flexibility that is truly remarkable.</p>
<p><span class="para-label">B</span>One of the most famous demonstrations of corvid intelligence occurred in New Caledonia. The New Caledonian crow (Corvus moneduloides) is renowned for its ability to fashion hooks from twigs and leaves to extract grubs from tree bark. In laboratory experiments, researchers showed that these crows could choose the correct length of stick to reach food, and even use a short stick to retrieve a longer stick that was otherwise out of reach — a behavior known as sequential tool use.</p>
<p><span class="para-label">C</span>Furthermore, ravens have demonstrated an impressive capacity for planning. In a study led by Dr. Mathias Osvath at Lund University, ravens were trained to use a tool to open a puzzle box containing a food reward. The researchers then presented the ravens with the tool along with several distracting objects, but did not give them the puzzle box until fifteen hours later. In the vast majority of trials, the ravens chose the correct tool and kept it until they could use it, showing that they could anticipate a future reward rather than acting on immediate impulse.</p>
<p><span class="para-label">D</span>Social intelligence is another area where corvids excel. Crows live in complex social groups and rely on cooperative behaviors. They have been observed warning one another about potential threats, such as predators or hostile humans. Researchers at the University of Washington found that crows could remember the face of a human who had captured them, and would "scold" that person whenever they saw them, even years later. What was even more surprising was that other crows, who had never met the human, would join in the scolding, indicating that the information was shared socially.</p>
<p><span class="para-label">E</span>The biological basis of this intelligence is fascinating. While bird brains lack the cerebral cortex found in mammals, they possess a structure called the nidopallium, which is responsible for executive functions and complex cognition. In corvids, the ratio of brain size to body size is comparable to that of chimpanzees. This high level of encephalization explains their ability to perform complex cognitive tasks despite the structural differences in their nervous systems.</p>
<p><span class="para-label">F</span>Some skeptics argue that these behaviors can be explained by simple conditioning rather than genuine insight. However, the flexibility and novelty of corvid responses in experiments suggest otherwise. When faced with a new challenge, they do not rely on trial-and-error; instead, they often pause, look at the apparatus, and then perform the correct sequence of actions on their first attempt, indicating a form of mental simulation or planning.</p>
<p><span class="para-label">G</span>As research continues, the line between human and animal cognition becomes increasingly blurred. By studying species like crows and ravens, biologists gain insight into how intelligence evolved independently along different evolutionary branches, showing that there are multiple biological paths to high-level thinking.</p>
`,
      questions: [
        { number: 14, type: 'reading_matching_headings', prompt: 'Paragraph A', data: { headings: [
          { id: 'i', text: 'Social sharing of danger warnings' },
          { id: 'ii', text: 'Sequential tool use in the laboratory' },
          { id: 'iii', text: 'A comparison of bird and primate brain structures' },
          { id: 'iv', text: 'Evidence of foresight and planning' },
          { id: 'v', text: 'Crows and ravens as cognitive equals of primates' },
          { id: 'vi', text: 'Insight versus trial-and-error learning' },
          { id: 'vii', text: 'Multiple evolutionary paths to intelligence' }
        ] }, answer: { answer: 'v' } },
        { number: 15, type: 'reading_matching_headings', prompt: 'Paragraph B', data: { headings: [
          { id: 'i', text: 'Social sharing of danger warnings' },
          { id: 'ii', text: 'Sequential tool use in the laboratory' },
          { id: 'iii', text: 'A comparison of bird and primate brain structures' },
          { id: 'iv', text: 'Evidence of foresight and planning' },
          { id: 'v', text: 'Crows and ravens as cognitive equals of primates' },
          { id: 'vi', text: 'Insight versus trial-and-error learning' },
          { id: 'vii', text: 'Multiple evolutionary paths to intelligence' }
        ] }, answer: { answer: 'ii' } },
        { number: 16, type: 'reading_matching_headings', prompt: 'Paragraph C', data: { headings: [
          { id: 'i', text: 'Social sharing of danger warnings' },
          { id: 'ii', text: 'Sequential tool use in the laboratory' },
          { id: 'iii', text: 'A comparison of bird and primate brain structures' },
          { id: 'iv', text: 'Evidence of foresight and planning' },
          { id: 'v', text: 'Crows and ravens as cognitive equals of primates' },
          { id: 'vi', text: 'Insight versus trial-and-error learning' },
          { id: 'vii', text: 'Multiple evolutionary paths to intelligence' }
        ] }, answer: { answer: 'iv' } },
        { number: 17, type: 'reading_matching_headings', prompt: 'Paragraph D', data: { headings: [
          { id: 'i', text: 'Social sharing of danger warnings' },
          { id: 'ii', text: 'Sequential tool use in the laboratory' },
          { id: 'iii', text: 'A comparison of bird and primate brain structures' },
          { id: 'iv', text: 'Evidence of foresight and planning' },
          { id: 'v', text: 'Crows and ravens as cognitive equals of primates' },
          { id: 'vi', text: 'Insight versus trial-and-error learning' },
          { id: 'vii', text: 'Multiple evolutionary paths to intelligence' }
        ] }, answer: { answer: 'i' } },
        { number: 18, type: 'reading_matching_headings', prompt: 'Paragraph E', data: { headings: [
          { id: 'i', text: 'Social sharing of danger warnings' },
          { id: 'ii', text: 'Sequential tool use in the laboratory' },
          { id: 'iii', text: 'A comparison of bird and primate brain structures' },
          { id: 'iv', text: 'Evidence of foresight and planning' },
          { id: 'v', text: 'Crows and ravens as cognitive equals of primates' },
          { id: 'vi', text: 'Insight versus trial-and-error learning' },
          { id: 'vii', text: 'Multiple evolutionary paths to intelligence' }
        ] }, answer: { answer: 'iii' } },
        { number: 19, type: 'reading_matching_headings', prompt: 'Paragraph F', data: { headings: [
          { id: 'i', text: 'Social sharing of danger warnings' },
          { id: 'ii', text: 'Sequential tool use in the laboratory' },
          { id: 'iii', text: 'A comparison of bird and primate brain structures' },
          { id: 'iv', text: 'Evidence of foresight and planning' },
          { id: 'v', text: 'Crows and ravens as cognitive equals of primates' },
          { id: 'vi', text: 'Insight versus trial-and-error learning' },
          { id: 'vii', text: 'Multiple evolutionary paths to intelligence' }
        ] }, answer: { answer: 'vi' } },
        { number: 20, type: 'reading_mcq_multi', prompt: 'Which TWO behaviors did the New Caledonian crow display in laboratory tests?', data: { choose: 2, options: [
          'Fabricating hooks from natural materials.',
          'Opening complex puzzle boxes with keys.',
          'Selecting sticks of appropriate length to reach food.',
          'Using a short stick to get a longer stick.',
          'Remembering the faces of specific researchers.'
        ] }, answer: { answer: ['C', 'D'] } },
        { number: 21, type: 'reading_mcq_multi', prompt: 'Which TWO behaviors did the New Caledonian crow display in laboratory tests?', data: { linked_to: 20 }, answer: { answer: ['C', 'D'] } },
        { number: 22, type: 'reading_mcq_multi', prompt: 'Which TWO statements describe the social intelligence of crows?', data: { choose: 2, options: [
          'They cooperate to hunt larger mammals.',
          'They warn other crows about dangerous humans.',
          'They pass on information about threat faces to other crows.',
          'They nest in huge groups to conserve body heat.',
          'They share their food tools with younger generations.'
        ] }, answer: { answer: ['B', 'C'] } },
        { number: 23, type: 'reading_mcq_multi', prompt: 'Which TWO statements describe the social intelligence of crows?', data: { linked_to: 22 }, answer: { answer: ['B', 'C'] } },
        { number: 24, type: 'reading_summary_completion', prompt: '', data: { word_limit: 1, summary_title: 'Corvid brain structure and insight', summary_body: 'Corvids have a brain-to-body size ratio comparable to [24]. While they do not have a mammal-like cerebral cortex, they utilize a structure called the [25] for executive tasks. Their performance in tests indicates that rather than relying on trial-and-error, they use mental [26] to solve new problems.' }, answer: { answer: 'chimpanzees' } },
        { number: 25, type: 'reading_summary_completion', prompt: '', data: { word_limit: 1 }, answer: { answer: 'nidopallium' } },
        { number: 26, type: 'reading_summary_completion', prompt: '', data: { word_limit: 1 }, answer: { answer: 'simulation' } }
      ]
    },
    {
      title: 'Reading Passage 3: Preserving historical soundscapes',
      instructions: 'You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      body: `
<p><span class="para-label">A</span>History is usually understood through visual records: documents, paintings, and archaeological remains. However, a growing group of researchers argues that to fully understand the past, we must also study its acoustic environment, or soundscape. Acoustic ecology, or archaeoacoustics, aims to reconstruct the sounds of historical eras, from the din of industrial-revolution factories to the echoes of ancient stone circles.</p>
<p><span class="para-label">B</span>The challenges of doing so are obvious. Unlike visual artifacts, sound does not leave a direct physical record. Old audio recordings only date back to the late nineteenth century. For earlier eras, researchers must rely on indirect clues: written descriptions of noise, the musical notations of the time, and the acoustic properties of surviving buildings and sites. By studying how sound travels through these spaces, researchers can infer how they were experienced.</p>
<p><span class="para-label">C</span>One area of focus is ancient monuments. In studies at Stonehenge in England and the Chavín de Huántar temple in Peru, researchers have analyzed the acoustic resonance of the sites. At Chavín, archaeologists discovered that the underground galleries were designed to amplify the sound of conch-shell trumpets, creating a disorienting acoustic effect for participants in religious rituals. This suggests that ancient builders actively manipulated sound to evoke specific emotional responses.</p>
<p><span class="para-label">D</span>The industrial revolution represents another key soundscape transition. The shift from rural, animal-powered life to urban, steam-powered factories marked a dramatic increase in ambient noise levels. Historian Dr. Emily Thompson has documented how the roar of steam engines, the clatter of looms, and the screech of iron wheels reshaped the sensory experience of workers. These sounds were not merely byproducts of technology; they became symbols of progress and industrial power, changing how people thought about time and work.</p>
<p><span class="para-label">E</span>In addition, the preservation of historical soundscapes has practical applications for museums. Many museums are moving away from quiet display rooms to immersive, multi-sensory exhibitions. By introducing authentic historical sounds — such as the chatter of a medieval marketplace or the clatter of a Victorian printing press — curators can create a more engaging experience for visitors. However, sound designer Marcus Laurent cautions that these soundscapes must be carefully calibrated to avoid overwhelming visitors or distracting from the visual artifacts.</p>
<p><span class="para-label">F</span>However, there is also a risk of romanticizing historical soundscapes. The past was not always filled with pleasant birdsong or quiet contemplation. Many historical environments were incredibly noisy, filled with the cries of street vendors, the rumble of iron-rimmed wheels on cobblestones, and the noise of open sewers. Reconstructing these soundscapes requires a balanced approach that avoids sanitizing the historical record.</p>
<p><span class="para-label">G</span>Ultimately, the study of historical soundscapes reminds us that history was a sensory experience. By restoring the dimension of sound to our understanding of the past, researchers can create a richer, more complete picture of human history, helping us connect with our ancestors in a more immediate and empathetic way.</p>
`,
      questions: [
        { number: 27, type: 'reading_tfng', prompt: 'Acoustic ecology is concerned with both industrial and ancient soundscapes.', data: null, answer: { answer: 'TRUE' } },
        { number: 28, type: 'reading_tfng', prompt: 'Researchers possess physical recordings of soundscapes dating back to the eighteenth century.', data: null, answer: { answer: 'FALSE' } },
        { number: 29, type: 'reading_tfng', prompt: 'Ancient builders at Chavín de Huántar designed galleries to damp the sound of trumpets.', data: null, answer: { answer: 'FALSE' } },
        { number: 30, type: 'reading_tfng', prompt: 'The industrial revolution caused a noticeable increase in ambient noise in cities.', data: null, answer: { answer: 'TRUE' } },
        { number: 31, type: 'reading_tfng', prompt: 'Dr. Emily Thompson argued that industrial noises were perceived as symbols of progress.', data: null, answer: { answer: 'TRUE' } },
        { number: 32, type: 'reading_tfng', prompt: 'Marcus Laurent recommends that museums make their soundscapes as loud as possible to engage visitors.', data: null, answer: { answer: 'FALSE' } },
        { number: 33, type: 'reading_tfng', prompt: 'Reconstructing historical soundscapes should avoid excluding unpleasant historical noises.', data: null, answer: { answer: 'TRUE' } },
        { number: 34, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2, summary_title: 'Archaeoacoustics and sensory history', summary_body: 'Historical research has typically ignored soundscapes, but archaeoacoustics is changing this. By studying the [34] of sites like Stonehenge, researchers can learn about ancient rituals. For example, the Chavín temple amplified [35] to disorient participants.\n\nThe industrial era brought steam power, which altered the sensory experiences of [36]. Today, museums are incorporating these sounds to build [37] exhibitions. However, experts warn that these must be carefully [38] so they do not distract from the exhibits. Reconstructing soundscapes requires a balanced approach to prevent [39] the past, which was often filled with [40] noises.' }, answer: { answer: 'acoustic properties' } },
        { number: 35, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'conch-shell trumpets' } },
        { number: 36, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'workers' } },
        { number: 37, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'immersive' } },
        { number: 38, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'calibrated' } },
        { number: 39, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'romanticizing' } },
        { number: 40, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'unpleasant' } }
      ]
    }
  ]
}
