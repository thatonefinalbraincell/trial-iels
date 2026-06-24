export const readingTest3 = {
  title: 'Cambridge-style IELTS Academic Reading — Mock Test 3',
  skill: 'reading',
  description: 'Three academic passages with Cambridge-style question types including completion, TFNG, matching and summary tasks.',
  duration_min: 60,
  sections: [
    {
      title: 'Reading Passage 1: The history and future of public libraries',
      instructions: 'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      body: `
<p><span class="para-label">A</span>Public libraries have long been cornerstones of community life, providing free access to information and literature. The concept of the public library as we know it today began to take shape in the mid-nineteenth century, driven by social reformers who believed that education was key to self-improvement. Previously, libraries were largely private collections open only to wealthy subscribers or scholars. The Public Libraries Act of 1850 in the United Kingdom was a watershed moment, allowing municipal councils to establish libraries funded by local taxation.</p>
<p><span class="para-label">B</span>In the United States, philanthropist Andrew Carnegie played a pivotal role. Between 1883 and 1929, Carnegie funded the construction of over 2,500 libraries worldwide, including more than 1,600 in the US. Carnegie's approach was based on a partnership: he would provide the funds for the building, but the local municipality had to commit to providing the site and funding the library's ongoing operation through public taxes. This formula ensured that communities had a direct stake in their libraries' success.</p>
<p><span class="para-label">C</span>The late twentieth and early twenty-first centuries brought profound challenges to traditional libraries, primarily driven by digital technology. The rise of the internet, e-books, and digital archives led some to predict the demise of physical library spaces. Critics argued that in an age when information is accessible with a few keystrokes, maintaining large collections of printed books is an unnecessary municipal expense. However, libraries have proved remarkably resilient, adapting to the digital era by repositioning themselves as community hubs.</p>
<p><span class="para-label">D</span>Modern libraries now offer a wide range of services beyond book lending. They have become critical providers of digital access, offering free internet, computers, and technology training for residents who lack these resources at home. Many libraries have also created "makerspaces" equipped with 3D printers, sewing machines, and digital recording equipment, encouraging hands-on learning and collaborative projects. In doing so, libraries are addressing the digital divide while continuing their traditional mission of fostering education.</p>
<p><span class="para-label">E</span>Furthermore, the architectural design of libraries has shifted to reflect their changing role. Traditional libraries were often designed as imposing, formal spaces with quiet reading rooms. In contrast, contemporary library buildings, such as the Seattle Central Library or the Oodi Central Library in Helsinki, feature open, flexible layouts with areas for socializing, workshops, and exhibitions. These buildings are designed to be welcoming public spaces that encourage community interaction rather than silent study.</p>
<p><span class="para-label">F</span>The economic value of public libraries is also being recognized. While they do not generate direct revenue, studies have shown that libraries provide a high return on investment. For example, a report by the American Library Association estimated that for every $1 of tax funding invested in public libraries, communities receive several dollars in economic value through services like job-seeking assistance, small business resources, and early childhood education programs. This evidence helps counter arguments that libraries are obsolete expenses.</p>
<p><span class="para-label">G</span>Ultimately, the enduring appeal of the public library lies in its status as a non-commercial space. In modern cities, there are few public indoor areas where individuals can spend time without being expected to spend money. By providing a safe, inclusive environment for learning, recreation, and social connection, libraries remain as essential to urban life as they were in the nineteenth century.</p>
`,
      questions: [
        { number: 1, type: 'reading_sentence_completion', prompt: 'In the mid-nineteenth century, public libraries were championed by social ____.', data: { word_limit: 1 }, answer: { answer: 'reformers' } },
        { number: 2, type: 'reading_sentence_completion', prompt: 'The Public Libraries Act of 1850 permitted councils to fund libraries through local ____.', data: { word_limit: 1 }, answer: { answer: 'taxation' } },
        { number: 3, type: 'reading_sentence_completion', prompt: 'Andrew Carnegie required municipalities to provide the ____ for new libraries.', data: { word_limit: 1 }, answer: 'site' },
        { number: 4, type: 'reading_sentence_completion', prompt: 'Libraries have adapted to the digital age by becoming community ____.', data: { word_limit: 1 }, answer: { answer: 'hubs' } },
        { number: 5, type: 'reading_sentence_completion', prompt: 'Some modern libraries feature ____ which provide access to tools like 3D printers.', data: { word_limit: 1 }, answer: { answer: 'makerspaces' } },
        { number: 6, type: 'reading_tfng', prompt: 'Before 1850, most libraries in the UK were funded by local taxes.', data: null, answer: { answer: 'FALSE' } },
        { number: 7, type: 'reading_tfng', prompt: 'Carnegie funded the construction of libraries only in the United States.', data: null, answer: { answer: 'FALSE' } },
        { number: 8, type: 'reading_tfng', prompt: 'Digital technology has led to a decrease in the number of books lent by public libraries.', data: null, answer: { answer: 'NOT GIVEN' } },
        { number: 9, type: 'reading_tfng', prompt: 'The Oodi Central Library in Helsinki was designed to discourage loud conversations.', data: null, answer: { answer: 'FALSE' } },
        { number: 10, type: 'reading_tfng', prompt: 'Public libraries generate more direct revenue today than they did in the past.', data: null, answer: { answer: 'FALSE' } },
        { number: 11, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2, summary_title: 'The changing role of public libraries', summary_body: 'Although critics predicted that libraries would become obsolete due to the rise of [11], libraries have adapted. Today, they help bridge the [12] by offering internet access and technology courses. Architecturally, newer libraries feature [13] layouts that support socializing and workshops rather than just silent reading.' }, answer: { answer: ['e-books', 'digital archives'] } },
        { number: 12, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'digital divide' } },
        { number: 13, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: ['open, flexible', 'flexible'] } }
      ]
    },
    {
      title: 'Reading Passage 2: Understanding the migration of monarch butterflies',
      instructions: 'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      body: `
<p><span class="para-label">A</span>The annual migration of the monarch butterfly (Danaus plexippus) is one of the most spectacular events in the natural world. Every autumn, millions of monarch butterflies in North America travel up to 4,000 kilometres south to their overwintering sites in Mexico and California. What makes this journey particularly astonishing is that the migrating butterflies are several generations removed from those that made the journey the previous year. Yet, they manage to find the exact same groves of trees to settle in.</p>
<p><span class="para-label">B</span>This feat of navigation has long intrigued biologists. Research has revealed that monarchs use a combination of compasses to steer. Their primary navigation tool is a sun compass, which relies on special photoreceptors in their eyes to detect the angle of the sun. However, because the sun moves across the sky during the day, the butterfly's brain must compensate for this movement. It does so using an internal circadian clock located in its antennae. Together, these systems function as a time-compensated sun compass.</p>
<p><span class="para-label">C</span>On overcast days when the sun is not visible, monarchs rely on a backup system: a magnetic compass. Researchers led by Dr Steven Reppert at the University of Massachusetts Medical School demonstrated that monarchs have light-sensitive proteins called cryptochromes in their eyes. These proteins allow the butterflies to detect the Earth's magnetic field lines, helping them maintain their southward direction even in dense cloud cover.</p>
<p><span class="para-label">D</span>The migration is also a marvel of aerodynamics and physiology. Monarchs do not fly by continuously flapping their wings; instead, they utilize thermals — columns of rising warm air — to glide and soar, conserving energy. During the journey, they feed on nectar from wildflowers, converting sugars into lipids (fat) which are stored in their abdomens. This fat is crucial not only for powering their flight but also for helping them survive the winter months when they enter a state of dormancy.</p>
<p><span class="para-label">E</span>The overwintering sites in Mexico, located in the high-altitude oyamel fir forests, provide a unique microclimate. The trees protect the monarchs from wind and freezing temperatures, while the high humidity prevents them from drying out. Unfortunately, these forests are under threat from illegal logging and climate change. Rising temperatures could make the oyamel forests unsuitable for monarchs, potentially disrupting the entire migratory cycle.</p>
<p><span class="para-label">F</span>Conservationists are working to protect the monarch migration along its entire route. A major focus is restoring habitat by planting milkweed (Asclepias), which is the only plant that monarch caterpillars eat. The widespread use of herbicides in agriculture has decimated milkweed populations across North America, leading to a significant decline in monarch numbers. Public campaigns encouraging gardeners to plant milkweed have helped raise awareness and restore local breeding habitats.</p>
<p><span class="para-label">G</span>While the eastern population of monarchs migrates to Mexico, a smaller western population travels to coastal groves in California. The challenges faced by both populations underscore the vulnerability of migratory species. Because their survival depends on multiple, geographically separated habitats, any disruption in one location can have a cascading effect on the entire species.</p>
`,
      questions: [
        { number: 14, type: 'reading_matching_headings', prompt: 'Paragraph A', data: { headings: [
          { id: 'i', text: 'A multi-faceted navigation system' },
          { id: 'ii', text: 'The critical role of milkweed restoration' },
          { id: 'iii', text: 'An extraordinary multi-generational journey' },
          { id: 'iv', text: 'Physiological adaptations for energy conservation' },
          { id: 'v', text: 'Threats to overwintering forest microclimates' },
          { id: 'vi', text: 'A magnetic compass for cloudy conditions' },
          { id: 'vii', text: 'A comparison of eastern and western populations' }
        ] }, answer: { answer: 'iii' } },
        { number: 15, type: 'reading_matching_headings', prompt: 'Paragraph B', data: { headings: [
          { id: 'i', text: 'A multi-faceted navigation system' },
          { id: 'ii', text: 'The critical role of milkweed restoration' },
          { id: 'iii', text: 'An extraordinary multi-generational journey' },
          { id: 'iv', text: 'Physiological adaptations for energy conservation' },
          { id: 'v', text: 'Threats to overwintering forest microclimates' },
          { id: 'vi', text: 'A magnetic compass for cloudy conditions' },
          { id: 'vii', text: 'A comparison of eastern and western populations' }
        ] }, answer: { answer: 'i' } },
        { number: 16, type: 'reading_matching_headings', prompt: 'Paragraph C', data: { headings: [
          { id: 'i', text: 'A multi-faceted navigation system' },
          { id: 'ii', text: 'The critical role of milkweed restoration' },
          { id: 'iii', text: 'An extraordinary multi-generational journey' },
          { id: 'iv', text: 'Physiological adaptations for energy conservation' },
          { id: 'v', text: 'Threats to overwintering forest microclimates' },
          { id: 'vi', text: 'A magnetic compass for cloudy conditions' },
          { id: 'vii', text: 'A comparison of eastern and western populations' }
        ] }, answer: { answer: 'vi' } },
        { number: 17, type: 'reading_matching_headings', prompt: 'Paragraph D', data: { headings: [
          { id: 'i', text: 'A multi-faceted navigation system' },
          { id: 'ii', text: 'The critical role of milkweed restoration' },
          { id: 'iii', text: 'An extraordinary multi-generational journey' },
          { id: 'iv', text: 'Physiological adaptations for energy conservation' },
          { id: 'v', text: 'Threats to overwintering forest microclimates' },
          { id: 'vi', text: 'A magnetic compass for cloudy conditions' },
          { id: 'vii', text: 'A comparison of eastern and western populations' }
        ] }, answer: { answer: 'iv' } },
        { number: 18, type: 'reading_matching_headings', prompt: 'Paragraph E', data: { headings: [
          { id: 'i', text: 'A multi-faceted navigation system' },
          { id: 'ii', text: 'The critical role of milkweed restoration' },
          { id: 'iii', text: 'An extraordinary multi-generational journey' },
          { id: 'iv', text: 'Physiological adaptations for energy conservation' },
          { id: 'v', text: 'Threats to overwintering forest microclimates' },
          { id: 'vi', text: 'A magnetic compass for cloudy conditions' },
          { id: 'vii', text: 'A comparison of eastern and western populations' }
        ] }, answer: { answer: 'v' } },
        { number: 19, type: 'reading_matching_headings', prompt: 'Paragraph F', data: { headings: [
          { id: 'i', text: 'A multi-faceted navigation system' },
          { id: 'ii', text: 'The critical role of milkweed restoration' },
          { id: 'iii', text: 'An extraordinary multi-generational journey' },
          { id: 'iv', text: 'Physiological adaptations for energy conservation' },
          { id: 'v', text: 'Threats to overwintering forest microclimates' },
          { id: 'vi', text: 'A magnetic compass for cloudy conditions' },
          { id: 'vii', text: 'A comparison of eastern and western populations' }
        ] }, answer: { answer: 'ii' } },
        { number: 20, type: 'reading_mcq_multi', prompt: 'Which TWO factors are mentioned as threats to the monarch butterfly overwintering sites in Mexico?', data: { choose: 2, options: [
          'Illegal logging in the oyamel fir forests.',
          'The introduction of invasive predator species.',
          'An increase in freezing winter storms.',
          'Climate change causing temperatures to rise.',
          'Excessive tourist activity in the reserves.'
        ] }, answer: { answer: ['A', 'D'] } },
        { number: 21, type: 'reading_mcq_multi', prompt: 'Which TWO factors are mentioned as threats to the monarch butterfly overwintering sites in Mexico?', data: { linked_to: 20 }, answer: { answer: ['A', 'D'] } },
        { number: 22, type: 'reading_mcq_multi', prompt: 'Which TWO statements describe physiological adaptations of migrating monarchs?', data: { choose: 2, options: [
          'They continuously flap their wings to maintain high speeds.',
          'They glide on rising warm air columns (thermals) to save energy.',
          'They store fat (lipids) in their abdomens converted from wildflower nectar.',
          'Their wings grow thicker to withstand high winds.',
          'They hibernate immediately upon arriving in northern regions.'
        ] }, answer: { answer: ['B', 'C'] } },
        { number: 23, type: 'reading_mcq_multi', prompt: 'Which TWO statements describe physiological adaptations of migrating monarchs?', data: { linked_to: 22 }, answer: { answer: ['B', 'C'] } },
        { number: 24, type: 'reading_summary_completion', prompt: '', data: { word_limit: 1, summary_title: 'Navigational compasses of monarchs', summary_body: 'To navigate successfully, monarch butterflies rely on a primary [24] compass. This system relies on photoreceptors to gauge the position of the sun, and uses a circadian clock inside the butterfly\'s [25] to compensate for its movement. When the sky is cloudy, they activate a magnetic backup system that uses light-sensitive proteins called [26] to trace the Earth\'s magnetic lines.' }, answer: { answer: 'sun' } },
        { number: 25, type: 'reading_summary_completion', prompt: '', data: { word_limit: 1 }, answer: { answer: 'antennae' } },
        { number: 26, type: 'reading_summary_completion', prompt: '', data: { word_limit: 1 }, answer: { answer: 'cryptochromes' } }
      ]
    },
    {
      title: 'Reading Passage 3: The evolution of clean drinking water systems',
      instructions: 'You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      body: `
<p><span class="para-label">A</span>Access to clean drinking water is widely considered one of the greatest achievements of public health. Throughout history, waterborne diseases such as cholera, typhoid, and dysentery have devastated human populations, particularly in densely crowded cities. The realization that clean water is essential for health evolved over centuries, shifting from simple aesthetic preferences to sophisticated chemical and biological treatment processes.</p>
<p><span class="para-label">B</span>In ancient civilizations, water treatment was primarily concerned with improving taste and appearance. Ancient Sanskrit writings dating back to 2000 BCE mention filtering water through charcoal, exposing it to sunlight, and boiling it. The Romans built elaborate aqueducts to transport clean water from distant springs, recognizing that local sources in Rome were contaminated. However, these early efforts lacked an understanding of the biological agents responsible for waterborne diseases.</p>
<p><span class="para-label">C</span>A breakthrough occurred in the mid-nineteenth century in London. During a cholera outbreak in Soho in 1854, physician John Snow mapped the occurrences of the disease and traced the source to a public water pump on Broad Street. By removing the pump handle, Snow successfully halted the outbreak, proving that cholera was transmitted through contaminated water. This discovery challenged the prevailing "miasma theory", which held that diseases were spread by foul air.</p>
<p><span class="para-label">D</span>Following Snow\'s discovery, municipal authorities began implementing sand filtration systems. Sand filters had been developed by John Gibb in Scotland in 1804 and were later refined by James Simpson. The sand beds function through a combination of physical straining and biological action: a sticky layer of microorganisms, known as the Schmutzdecke, forms on the top layer of sand and actively consumes harmful bacteria. Slow sand filtration became the gold standard for water treatment in European cities.</p>
<p><span class="para-label">E</span>In the early twentieth century, chemical disinfection revolutionized water safety. Chlorination was first used on a continuous basis in Middlekerke, Belgium, in 1902, and was introduced to Jersey City, New Jersey, in 1908. The addition of chlorine, even in minute quantities, proved highly effective at killing pathogens. The combination of filtration and chlorination led to a dramatic decline in waterborne diseases in industrialized nations, raising life expectancy significantly.</p>
<p><span class="para-label">F</span>Modern water systems face new and complex challenges. While traditional treatment methods are highly effective against bacteria, they are less successful at removing chemical pollutants, such as pharmaceuticals, microplastics, and industrial solvents. Furthermore, the aging infrastructure of water mains and piping in many cities poses a risk of contamination, as demonstrated by the crisis in Flint, Michigan, where lead leached into the drinking water supply due to changes in water chemistry.</p>
<p><span class="para-label">G</span>To address these modern threats, water treatment facilities are adopting advanced technologies. These include membrane filtration, ultraviolet (UV) disinfection, and advanced oxidation processes. As climate change alters water availability and quality, maintaining safe drinking water systems requires continuous investment and innovation, reminding us that clean water is a dynamic challenge rather than a solved problem.</p>
`,
      questions: [
        { number: 27, type: 'reading_tfng', prompt: 'Ancient Sanskrit writings suggest boiling water was used to improve its health benefits.', data: null, answer: { answer: 'FALSE' } },
        { number: 28, type: 'reading_tfng', prompt: 'The Romans constructed aqueducts because local water sources in Rome were polluted.', data: null, answer: { answer: 'TRUE' } },
        { number: 29, type: 'reading_tfng', prompt: 'John Snow\'s mapping of cholera cases supported the popular miasma theory.', data: null, answer: { answer: 'FALSE' } },
        { number: 30, type: 'reading_tfng', prompt: 'James Simpson built the first sand filtration system in Scotland in 1804.', data: null, answer: { answer: 'FALSE' } },
        { number: 31, type: 'reading_tfng', prompt: 'Continuous chlorination of water was first implemented in Belgium.', data: null, answer: { answer: 'TRUE' } },
        { number: 32, type: 'reading_tfng', prompt: 'Modern water treatment facilities find it easy to remove microplastics using chlorination.', data: null, answer: { answer: 'FALSE' } },
        { number: 33, type: 'reading_tfng', prompt: 'Flint, Michigan suffered from lead contamination due to aging pipes and changes in water chemistry.', data: null, answer: { answer: 'TRUE' } },
        { number: 34, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2, summary_title: 'The history and evolution of water safety', summary_body: 'Historical water systems evolved from improving water aesthetics to combating waterborne diseases. In Soho, Dr. John Snow demonstrated that cholera was waterborne by disabling a [34]. Following this, cities adopted slow sand filters where a biological layer called the [35] consumed pathogens. By the twentieth century, the introduction of [36] as a disinfectant dramatically improved public health.\n\nToday, facilities face newer threats from [37] and microplastics. Aging pipes also threaten water safety. To counter these, modern plants are incorporating advanced techniques like [38] filtration, UV disinfection, and oxidation, demonstrating that ensuring clean water is a [39] rather than a completed [40] achievement.' }, answer: { answer: 'public water pump' } },
        { number: 35, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'Schmutzdecke' } },
        { number: 36, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'chlorine' } },
        { number: 37, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'chemical pollutants' } },
        { number: 38, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'membrane' } },
        { number: 39, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'dynamic challenge' } },
        { number: 40, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'solved' } }
      ]
    }
  ]
}
