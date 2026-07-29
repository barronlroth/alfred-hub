const OUTINGS = [
  {
    id: "audium-dark-matter",
    number: "01",
    title: "Dark Matter at Audium",
    short: "Dinner in Japantown, then 176 speakers moving sound through total darkness.",
    bucket: "few-hours",
    time: "A few hours",
    duration: "3–4 hours",
    region: "San Francisco",
    season: ["Year-round"],
    energy: "Low",
    cost: "$$",
    drive: "In the city",
    lead: "Book 1–2 weeks ahead",
    artwork: "assets/postcards/01-audium.webp",
    map: [30, 72],
    verdict: "Streaming cannot follow you around a black room through 176 speakers. Good.",
    itinerary: [
      ["5:45", "Japantown supper", "Keep it quick: noodles, curry, or izakaya plates within walking distance."],
      ["7:00", "Arrive at Audium", "Doors typically precede the performance; the small theater rewards punctuality."],
      ["7:30", "Sit in the dark", "Let the spatial composition move above, behind, and under the room."],
      ["9:00", "One quiet drink", "Debrief nearby rather than immediately poisoning the effect with another screen."]
    ],
    swaps: ["Replace dinner with a Kabuki Springs soak for the deluxe low-energy version.", "Choose pay-what-you-can door tickets only if spontaneity matters more than certainty."],
    sources: [
      ["Audium", "https://www.audium.org/"],
      ["Audium tickets", "https://www.cityboxoffice.com/eventperformances.asp?evt=1760"]
    ]
  },
  {
    id: "cable-car-machine",
    number: "02",
    title: "Ride the Cable, Meet the Machine",
    short: "Take the California line over Nob Hill, then watch the city’s cables being hauled beneath your feet.",
    bucket: "few-hours",
    time: "A few hours",
    duration: "3–4 hours",
    region: "San Francisco",
    season: ["Year-round", "Clear morning"],
    energy: "Easy",
    cost: "$",
    drive: "In the city",
    lead: "Same day; start early",
    artwork: "assets/postcards/02-cable-car.webp",
    map: [31, 71],
    verdict: "A tourist ritual improves considerably once you see the machinery doing the impossible bit.",
    itinerary: [
      ["8:00", "Board at Market", "Take the California line before the queues acquire their own municipal government."],
      ["8:30", "Stand outside", "Ride over Nob Hill with the gripman and the street doing the choreography."],
      ["9:15", "Breakfast downhill", "Fuel up near Polk, Chinatown, or North Beach depending on appetite."],
      ["10:00", "Cable Car Museum", "Watch the live winding machinery and trace the moving cables beneath the streets."],
      ["11:15", "Walk into Chinatown", "Finish through Stockton Street rather than waiting for another queue."]
    ],
    swaps: ["Use Powell–Hyde for maximum postcard drama and maximum queue tax.", "Buy a day pass if another cable-car leg or historic streetcar follows."],
    sources: [
      ["SFMTA cable cars", "https://www.sfmta.com/getting-around/muni/cable-cars"],
      ["Cable Car Museum", "https://www.cablecarmuseum.org/"]
    ]
  },
  {
    id: "fort-point-bluffs",
    number: "03",
    title: "Fort Point to the Bluffs",
    short: "Civil War brickwork, Golden Gate engineering, old gun batteries, and a Pacific cliff trail.",
    bucket: "few-hours",
    time: "A few hours",
    duration: "4–5 hours",
    region: "San Francisco",
    season: ["Year-round", "Dry day"],
    energy: "Moderate",
    cost: "$",
    drive: "In the city",
    lead: "Check fort hours",
    artwork: "assets/postcards/03-fort-point.webp",
    map: [27, 71],
    verdict: "The bridge is better when viewed from beneath it like a slightly alarming piece of machinery.",
    itinerary: [
      ["9:30", "Fort Point", "Walk the brick casemates and climb to the roof directly under the Golden Gate Bridge."],
      ["11:00", "Bridge approach", "Follow the waterfront and climb toward the overlook rather than driving between views."],
      ["12:00", "Batteries to Bluffs", "Take the coastal trail past military ruins and Pacific overlooks."],
      ["1:30", "Baker Beach", "Finish on the sand, then climb back or exit toward the Presidio."],
      ["2:15", "Tunnel Tops provisions", "Recover with lunch where the logistics are mercifully simple."]
    ],
    swaps: ["Reverse it for a Fort Point sunset when operating hours allow.", "Skip the cliff stairs and picnic at Tunnel Tops for a low-energy version."],
    sources: [
      ["Fort Point NHS", "https://www.nps.gov/fopo/index.htm"],
      ["Batteries to Bluffs", "https://presidio.gov/explore/attractions/batteries-to-bluffs-trail"]
    ]
  },
  {
    id: "mechanical-rainstorm",
    number: "04",
    title: "Mechanical Arcade to Indoor Rainstorm",
    short: "A century of coin-operated oddities followed by rum, live music, and weather inside a hotel.",
    bucket: "few-hours",
    time: "A few hours",
    duration: "4–5 hours",
    region: "San Francisco",
    season: ["Year-round", "Rainy-day proof"],
    energy: "Easy",
    cost: "$$$",
    drive: "In the city",
    lead: "Reserve Tonga Room 1–2 weeks",
    artwork: "assets/postcards/04-mechanical-rain.webp",
    map: [31, 70],
    verdict: "Begin with coin-operated nightmares; end beside a former swimming pool during a tropical storm.",
    itinerary: [
      ["4:00", "Musée Mécanique", "Bring small bills and let the antique arcade reveal several unresolved human anxieties."],
      ["5:15", "Waterfront walk", "Cross North Beach slowly; this is the digestion buffer before Polynesian maximalism."],
      ["6:00", "Tonga Room dinner", "Arrive before the room becomes adults-only and secure a view of the lagoon."],
      ["7:00", "Rainstorm and band", "Stay for live music and the indoor downpour. Subtlety has the evening off."],
      ["8:30", "Nob Hill nightcap", "One restrained drink nearby, purely for contrast."]
    ],
    swaps: ["Replace the walk with the Powell–Hyde cable car when the timing behaves.", "Do the arcade alone for a cheap, strange hour; the rainstorm is the expensive sequel."],
    sources: [
      ["Musée Mécanique", "https://museemecanique.com/"],
      ["Tonga Room", "https://www.fairmont-san-francisco.com/dine/tonga-room-hurricane-bar/"]
    ]
  },
  {
    id: "golden-gate-sunset-sail",
    number: "05",
    title: "Sail Beneath the Golden Gate",
    short: "A sunset catamaran from Pier 39, under the bridge and around Alcatraz.",
    bucket: "few-hours",
    time: "A few hours",
    duration: "2–3 hours",
    region: "San Francisco Bay",
    season: ["Spring–fall", "Clear evening"],
    energy: "Easy",
    cost: "$$",
    drive: "In the city",
    lead: "Book 1–2 weeks ahead",
    artwork: "assets/postcards/05-sunset-sail.webp",
    map: [28, 69],
    verdict: "The bridge has been photographed enough. Go under it with a drink instead.",
    itinerary: [
      ["5:00", "Early waterfront bite", "Eat before boarding; seasickness and heroic dinners are poor collaborators."],
      ["6:00", "Board the catamaran", "Claim an outside position and accept that the wind has opinions."],
      ["6:30", "Golden Gate run", "Sail toward the bridge as the city turns from grey to gold."],
      ["7:00", "Alcatraz return", "Circle the island and watch the skyline switch on."],
      ["8:00", "North Beach finish", "Walk uphill for one excellent drink or dinner, not both unless deserved."]
    ],
    swaps: ["Choose a daytime sail for warmer light and less romance theater.", "Bring serious layers; San Francisco sunset is frequently a confidence trick."],
    sources: [
      ["Adventure Cat", "https://www.adventurecat.com/"],
      ["Sunset sail details", "https://www.adventurecat.com/sunset-sail-san-francisco-bay/"]
    ]
  },
  {
    id: "alcatraz-after-dark",
    number: "06",
    title: "Alcatraz After Dark",
    short: "Take the evening ferry, hear the cellhouse settle, and return to the city lights.",
    bucket: "few-hours",
    time: "A few hours",
    duration: "4–5 hours",
    region: "San Francisco Bay",
    season: ["Year-round"],
    energy: "Moderate",
    cost: "$$",
    drive: "In the city",
    lead: "Book 3–8 weeks ahead",
    artwork: "assets/postcards/06-alcatraz-night.webp",
    map: [29, 69],
    verdict: "Touristy, yes. Also genuinely eerie, historically excellent, and far better after the day boats leave.",
    itinerary: [
      ["3:30", "Embarcadero provisions", "Eat early and arrive at Pier 33 with buffer; the ferry will not admire your optimism."],
      ["4:30", "Evening ferry", "Watch the skyline recede and listen for the island orientation."],
      ["5:00", "Cellhouse audio tour", "Take the main story seriously before chasing side rooms and views."],
      ["6:30", "Night programs", "Use the smaller evening talks and spaces unavailable on standard day visits."],
      ["8:00", "City-light return", "Let the ferry home provide the ending; no additional attraction required."]
    ],
    swaps: ["Take the Behind the Scenes option when offered and when stairs are welcome.", "Choose the first day ferry if night inventory is gone; do not buy from unofficial resellers."],
    sources: [
      ["Alcatraz NPS", "https://www.nps.gov/alca"],
      ["Official ferry tickets", "https://alcatrazcitycruises.com/tickets/"]
    ]
  },
  {
    id: "angel-island-loop",
    number: "07",
    title: "Ferry, Poems & Angel Island",
    short: "Circle the island by bike, read the immigration-station poems, and picnic above the Bay.",
    bucket: "full-day",
    time: "A full day",
    duration: "7–9 hours",
    region: "Marin / San Francisco Bay",
    season: ["Spring–fall", "Clear winter day"],
    energy: "Moderate",
    cost: "$$",
    drive: "Ferry from SF or Tiburon",
    lead: "Book ferry and bike 1–2 weeks",
    artwork: "assets/postcards/07-angel-island.webp",
    map: [30, 67],
    verdict: "One island, three histories, and the best moving panorama in the Bay.",
    itinerary: [
      ["8:30", "Ferry out", "Take the earliest practical sailing and bring food; island lunch options are not the thesis."],
      ["10:00", "Bike the perimeter", "Ride counterclockwise for changing views of Tiburon, the city, and both bridges."],
      ["11:30", "Immigration Station", "Leave time for the detention barracks and poems carved into the walls."],
      ["1:30", "Picnic with elevation", "Climb toward Mount Livermore or stop at a high overlook according to legs."],
      ["3:30", "Ayala Cove return", "Return the bike, catch the ferry, and do not discover the timetable as it departs."]
    ],
    swaps: ["Walk a shorter loop and use the tram when cycling is not the mood.", "Ferry from Tiburon for more schedule options; from SF for the better urban departure ritual."],
    sources: [
      ["Angel Island experiences", "https://angelisland.com/attractions/"],
      ["Angel Island State Park", "https://www.parks.ca.gov/?page_id=468"],
      ["SF ferry", "https://www.goldengate.org/ferry/angel-island-ferry/"]
    ]
  },
  {
    id: "crosstown-trail",
    number: "08",
    title: "Walk San Francisco Corner to Corner",
    short: "Seventeen miles of hidden stairs, gardens, ridgelines, neighborhoods, and a finish at the Pacific.",
    bucket: "full-day",
    time: "A full day",
    duration: "8–10 hours",
    region: "San Francisco",
    season: ["Year-round", "Dry day"],
    energy: "High",
    cost: "$",
    drive: "In the city",
    lead: "Plan transit and daylight",
    artwork: "assets/postcards/08-crosstown.webp",
    map: [30, 74],
    verdict: "The rare city hike that produces both bragging rights and a completely new mental map of home.",
    itinerary: [
      ["7:30", "Sunrise Point", "Start at Candlestick before the wind and mileage begin negotiating."],
      ["9:30", "McLaren to Glen Park", "Follow greenways and neighborhood connectors most residents never notice."],
      ["12:00", "Laguna Honda lunch", "Carry lunch or detour briefly; a long restaurant stop murders momentum."],
      ["2:00", "Forest Hill to Lands End", "Stairs, tiled passages, and western ridgelines deliver the best final act."],
      ["5:00", "Pacific finish", "End at Lands End and take Muni home with the posture of a war correspondent."]
    ],
    swaps: ["Walk sections 1–3 or 3–5 for a humane half-day edition.", "Reverse west-to-east when the forecast puts stronger wind at your back."],
    sources: [
      ["SF Crosstown Trail", "https://crosstowntrail.org/crosstown-trail/"],
      ["Trail organization", "https://crosstowntrail.org/"]
    ]
  },
  {
    id: "pebble-beach-proper",
    number: "09",
    title: "Pebble Beach, Properly Done",
    short: "Drive 17-Mile Drive slowly enough to deserve it, then finish with the Spanish Bay bagpiper.",
    bucket: "full-day",
    time: "A full day",
    duration: "10–12 hours",
    region: "Monterey Peninsula",
    season: ["Year-round", "Clear-day bonus"],
    energy: "Easy",
    cost: "$$$",
    drive: "2–2.5 hours",
    lead: "Reserve lunch 1–3 weeks",
    artwork: "assets/postcards/09-pebble-beach.webp",
    map: [29, 84],
    verdict: "Yes, the road has a gift shop. It also has one of California’s finest coastal crescendos.",
    itinerary: [
      ["8:00", "Leave San Francisco", "Go early enough that Highway 1 does not consume the outing before it begins."],
      ["10:30", "Pacific Grove gate", "Enter from the north and let Spanish Bay establish the scale."],
      ["11:30", "Cypress circuit", "Stop selectively: Restless Sea, Bird Rock, Lone Cypress, Ghost Trees, Pebble Beach."],
      ["1:30", "Lunch at The Bench", "Take the terrace view; the meal is part of the route, not a refueling accident."],
      ["3:30", "Carmel wander", "Walk the village or beach, then return north before sunset."],
      ["5:30", "Spanish Bay bagpiper", "Finish by the fire pits as the piper closes the day along the first fairway."]
    ],
    swaps: ["Trade Carmel for Point Lobos when hiking matters more than shops.", "Golfers can replace the central loop with a booked round, at a substantially less comic cost band."],
    sources: [
      ["17-Mile Drive", "https://www.pebblebeach.com/17-mile-drive/"],
      ["Spanish Bay bagpiper", "https://www.pebblebeach.com/dining/the-lobby-lounge/bagpiper/"],
      ["Official resort map", "https://www.pebblebeach.com/content/uploads/ResortMapWebsite-F11-13-18-FOR-OUTPUT-compressed.pdf"]
    ]
  },
  {
    id: "pescadero-circuit",
    number: "10",
    title: "Goats, Fog & Artichoke Soup",
    short: "Pigeon Point lighthouse, a working goat dairy, and Pescadero’s most defensible bowl of soup.",
    bucket: "full-day",
    time: "A full day",
    duration: "7–9 hours",
    region: "San Mateo Coast",
    season: ["Year-round", "Spring kids"],
    energy: "Easy",
    cost: "$$",
    drive: "1.5 hours",
    lead: "Book farm tour 1–2 weeks",
    artwork: "assets/postcards/10-pescadero.webp",
    map: [27, 79],
    verdict: "Goats, a 115-foot lighthouse, and soup with a cult following: no weak supporting actors.",
    itinerary: [
      ["9:00", "Coastal drive south", "Take Highway 1 and stop only when the view earns the lost momentum."],
      ["10:30", "Pigeon Point", "Walk the lighthouse grounds and coastal paths; verify tower access separately."],
      ["12:00", "Harley Farms", "Join a booked farm tour or visit the shop for cheese and a less structured goat encounter."],
      ["1:30", "Duarte’s Tavern", "Order the artichoke soup; pie is not compulsory but behaving is overrated."],
      ["3:00", "Bean Hollow", "Tidepool or walk the bluff before the return north."],
      ["5:00", "Half Moon Bay detour", "Add a final drink only if traffic has not already provided sufficient character building."]
    ],
    swaps: ["Replace Bean Hollow with Año Nuevo during elephant-seal season and with a reservation.", "Skip the farm tour and build a picnic from local shops for a fully spontaneous day."],
    sources: [
      ["Pigeon Point", "https://www.parks.ca.gov/PigeonPoint"],
      ["Harley Farms", "https://harleyfarms.com/"],
      ["Duarte’s Tavern", "https://www.duartestavern.com/"]
    ]
  },
  {
    id: "elkhorn-otters",
    number: "11",
    title: "Paddle the Otter Nursery",
    short: "Glide through Elkhorn Slough among sea otters, harbor seals, pelicans, and tidal marsh.",
    bucket: "full-day",
    time: "A full day",
    duration: "7–9 hours",
    region: "Moss Landing",
    season: ["Year-round", "Calm morning"],
    energy: "Moderate",
    cost: "$$",
    drive: "2 hours",
    lead: "Book guide 1–2 weeks",
    artwork: "assets/postcards/11-elkhorn.webp",
    map: [30, 85],
    verdict: "High-probability wildlife in calm water, with fewer maritime consequences than the open ocean.",
    itinerary: [
      ["7:30", "Drive to Moss Landing", "Morning wind is usually the saner paddling partner."],
      ["10:00", "Guided slough paddle", "Follow wildlife-distance rules and let the guide interpret the tidal ecosystem."],
      ["12:30", "Harbor lunch", "Eat seafood close enough to the boats that the premise remains coherent."],
      ["2:00", "Reserve trails", "Walk the upland trails and visitor exhibits for the habitat you just moved through."],
      ["4:00", "Coastal return", "Use Highway 1 only if daylight and traffic remain civilized."]
    ],
    swaps: ["Take the pontoon safari for lower energy or doubtful shoulders.", "Experienced paddlers can rent instead of joining a tour, but the wildlife briefing is not decorative."],
    sources: [
      ["Elkhorn Slough recreation", "https://elkhornslough.org/visit/recreation/kayaking/"],
      ["Monterey Bay Kayaks", "https://www.montereybaykayaks.com/elkhorn-slough1.html"],
      ["Elkhorn Slough Safari", "https://elkhornslough.com/"]
    ]
  },
  {
    id: "tule-elk-oysters",
    number: "12",
    title: "Tule Elk to Oyster Shells",
    short: "Hike the wild north end of Point Reyes, then earn a table of Tomales Bay oysters.",
    bucket: "full-day",
    time: "A full day",
    duration: "9–11 hours",
    region: "Point Reyes / Tomales Bay",
    season: ["Year-round", "Spring green"],
    energy: "High",
    cost: "$$$",
    drive: "1.5–2 hours",
    lead: "Reserve oysters 2–4 weeks",
    artwork: "assets/postcards/12-point-reyes.webp",
    map: [24, 63],
    verdict: "Wild elk first, immaculate shellfish second. The order is morally and logistically correct.",
    itinerary: [
      ["7:00", "Northbound early", "Point Reyes roads are beautiful and slow; budget for both facts."],
      ["9:00", "Tomales Point trail", "Start from Pierce Point Ranch and hike until elk, weather, or legs set the turnaround."],
      ["12:30", "Ranch history", "Walk the historic complex before driving back along the peninsula."],
      ["2:00", "Oyster table", "Reserve Hog Island or another legal Tomales Bay stop; shuck slowly."],
      ["4:00", "Point Reyes Station", "Cheese, bookstore, or coffee—one coda, not an additional itinerary."],
      ["5:30", "Return via coast", "Take the scenic route only while the light remains useful."]
    ],
    swaps: ["Turn around early on Tomales Point and add McClures Beach for lower mileage.", "Replace the reserved table with a Point Reyes picnic when oyster inventory is impossible."],
    sources: [
      ["Tomales Point and tule elk", "https://www.nps.gov/pore/planyourvisit/tomales_point.htm"],
      ["Hog Island Oyster", "https://hogislandoysters.com/"],
      ["Point Reyes conditions", "https://www.nps.gov/pore/planyourvisit/conditions.htm"]
    ]
  },
  {
    id: "sutter-buttes",
    number: "13",
    title: "Enter the Sutter Buttes",
    short: "Join a rare guided hike into the privately held volcanic core of the world’s smallest mountain range.",
    bucket: "full-day",
    time: "A full day",
    duration: "8–10 hours",
    region: "Sutter County",
    season: ["Fall–spring", "Wildflower season"],
    energy: "High",
    cost: "$$",
    drive: "2.5 hours",
    lead: "Book when seasonal dates open",
    artwork: "assets/postcards/13-sutter-buttes.webp",
    map: [48, 50],
    verdict: "The scarcity is real, the geology is peculiar, and the guided access makes it feel faintly illicit.",
    itinerary: [
      ["6:30", "Drive into the valley", "Leave before the Central Valley heat begins lobbying against movement."],
      ["9:00", "Meet the guide", "Access depends on the interpretive program; this is not an improvise-at-the-gate outing."],
      ["9:30", "Climb the interior", "Follow the assigned route through volcanic formations, ranchland, and cultural history."],
      ["1:00", "Field lunch", "Carry everything, including more water than optimism says you need."],
      ["3:00", "Descend", "Return with the group and resist inventing a private-land shortcut."],
      ["5:00", "Marysville stop", "One early dinner before the drive home."]
    ],
    swaps: ["Choose a lower-difficulty natural-history hike when summit routes are unnecessary.", "Pair with the Sacramento Valley Museum only if the hike schedule leaves genuine time."],
    sources: [
      ["Middle Mountain hikes", "https://middlemountainhikes.org/"],
      ["Hiking the Sutter Buttes", "https://middlemountainhikes.org/hiking-the-sutter-buttes/"],
      ["Access explanation", "https://sutterbutteslandtrust.org/touring-the-buttes/"]
    ]
  },
  {
    id: "raft-gold-rush",
    number: "14",
    title: "Raft the Gold Rush",
    short: "Run the South Fork American, then walk the exact ground where the California Gold Rush began.",
    bucket: "full-day",
    time: "A full day",
    duration: "10–12 hours",
    region: "Coloma",
    season: ["Spring–summer", "Flow-dependent"],
    energy: "High",
    cost: "$$$",
    drive: "2.5 hours",
    lead: "Book outfitter 2–4 weeks",
    artwork: "assets/postcards/14-rafting.webp",
    map: [57, 59],
    verdict: "History is markedly better when followed by Class III water instead of six more plaques.",
    itinerary: [
      ["6:30", "Drive to Coloma", "Arrive fed, hydrated, and not wearing the only shoes you respect."],
      ["9:00", "Raft briefing", "Use a permitted outfitter and take the safety talk as information, not ceremonial theater."],
      ["10:00", "South Fork run", "Paddle the selected section according to water, experience, and appetite for consequences."],
      ["2:00", "Late lunch", "Change clothes and eat in Coloma before historical concentration is attempted."],
      ["3:30", "Marshall Gold Discovery", "Walk the sawmill site, riverbank, and exhibits that explain what followed."],
      ["5:30", "Foothill return", "Leave before fatigue turns Interstate 80 into the final rapid."]
    ],
    swaps: ["Choose a shorter beginner section for a mixed group.", "Replace rafting with a riverside hike in cold or unsuitable flows; the river sets the terms."],
    sources: [
      ["South Fork American River", "https://www.blm.gov/visit/south-fork-american-river"],
      ["Marshall Gold Discovery SHP", "https://www.parks.ca.gov/marshallgold"]
    ]
  },
  {
    id: "farallon-expedition",
    number: "15",
    title: "The Farallones, If Your Stomach Agrees",
    short: "Spend a full day offshore with naturalists, whales, seabirds, and California’s least forgiving water.",
    bucket: "full-day",
    time: "A full day",
    duration: "9–10 hours",
    region: "Gulf of the Farallones",
    season: ["April–November", "Marine conditions"],
    energy: "Moderate",
    cost: "$$$",
    drive: "Depart from SF",
    lead: "Book 2–6 weeks ahead",
    artwork: "assets/postcards/15-farallones.webp",
    map: [11, 67],
    verdict: "One of America’s great wildlife days, provided your inner ear is not a committed landowner.",
    itinerary: [
      ["7:00", "Check in at the marina", "Eat lightly, medicate responsibly if appropriate, and bring serious layers."],
      ["8:00", "Head offshore", "Use the naturalist transit to learn the sanctuary rather than staring only at the horizon."],
      ["10:30", "Farallon waters", "Watch for whales, dolphins, seabirds, and the islands themselves; landings are not part of the bargain."],
      ["1:00", "Pelagic lunch", "Keep it plain. This is not the moment for artisanal bravado."],
      ["3:30", "Wildlife return", "The trip home remains active observation time."],
      ["5:00", "Marina recovery", "Leave the evening empty. The ocean has already scheduled enough."]
    ],
    swaps: ["Choose a coastal whale-watch route for a shorter, gentler day.", "Cancel bravely when operators warn of rough conditions; this outing gains nothing from martyrdom."],
    sources: [
      ["Farallon expedition", "https://www.oceanicsociety.org/expedition/farallon-islands-wildlife-expedition/"],
      ["Oceanic Society whale watching", "https://www.oceanicsociety.org/whale-watching/"]
    ]
  },
  {
    id: "anderson-valley-redwoods",
    number: "16",
    title: "Pinot Among the Redwoods",
    short: "One night linking Anderson Valley’s restrained wineries with the old-growth groves of Hendy Woods.",
    bucket: "one-night",
    time: "One night",
    duration: "30–34 hours",
    region: "Anderson Valley",
    season: ["Year-round", "Fall harvest"],
    energy: "Easy",
    cost: "$$$",
    drive: "2.5–3 hours",
    lead: "Book 3–6 weeks ahead",
    artwork: "assets/postcards/16-anderson-valley.webp",
    map: [24, 43],
    verdict: "Serious pinot and serious redwoods, with none of Napa’s choreography.",
    itinerary: [
      ["Sat 9:00", "Drive to Boonville", "Arrive for an early lunch before tasting judgment declines."],
      ["Sat 1:00", "One excellent winery", "Choose Navarro or another reservation-worthy stop; one is curation, four is logistics."],
      ["Sat 4:00", "Check in among the vines", "Stay in Philo, Boonville, or camp in Hendy Woods."],
      ["Sat 7:00", "Valley dinner", "Book the best available kitchen and let the roads go dark without you."],
      ["Sun 9:00", "Hendy Woods", "Walk the Big Hendy grove while the morning is quiet."],
      ["Sun 12:00", "Farm stop and return", "Cheese or provisions, then home via the prettier road conditions permit."]
    ],
    swaps: ["Camp among the redwoods for the lower-cost, higher-character version.", "Extend to Mendocino only with a second night; otherwise it turns the trip into windscreen tourism."],
    sources: [
      ["Hendy Woods", "https://www.parks.ca.gov/?page_id=438"],
      ["Anderson Valley Winegrowers", "https://avwines.com/visit/"],
      ["Navarro Vineyards", "https://www.navarrowine.com/visit-navarro/index.php"]
    ]
  },
  {
    id: "sea-ranch-design",
    number: "17",
    title: "The Sea Ranch Design Pilgrimage",
    short: "Spend one night inside California’s most influential experiment in architecture, restraint, and weather.",
    bucket: "one-night",
    time: "One night",
    duration: "32–36 hours",
    region: "Sonoma Coast",
    season: ["Year-round", "Storm season"],
    energy: "Easy",
    cost: "$$$$",
    drive: "3–3.5 hours",
    lead: "Book 4–8 weeks ahead",
    artwork: "assets/postcards/17-sea-ranch.webp",
    map: [19, 50],
    verdict: "Come for the architecture; stay because the wind has edited everything unnecessary.",
    itinerary: [
      ["Sat 8:00", "Coast-road departure", "Give Highway 1 the morning and enough daylight to remain scenery rather than punishment."],
      ["Sat 12:00", "Sea Ranch Lodge", "Lunch, orient with the public trail map, and absorb the original lodge complex."],
      ["Sat 2:00", "Bluff walk", "Use designated public or guest-access trails; private land is not a design feature to reinterpret."],
      ["Sat 4:00", "Architecture hour", "Check into a Sea Ranch home or the lodge and look at how building, meadow, and wind negotiate."],
      ["Sat 7:00", "Stay put", "Dinner, fireplace, and storm if fortunate. Driving has finished."],
      ["Sun 9:00", "Chapel and coast", "Visit the Sea Ranch Chapel, then one final walk before returning south."]
    ],
    swaps: ["Stay in Gualala for lower cost while keeping the lodge and public coast itinerary.", "Add Fort Ross on the drive home only if daylight and concentration remain."],
    sources: [
      ["Sea Ranch Lodge", "https://www.thesearanchlodge.com/"],
      ["Lodge trail map", "https://www.thesearanchlodge.com/pdf/trail-map.pdf"],
      ["Sea Ranch Chapel", "https://www.thesearanchchapel.org/"]
    ]
  },
  {
    id: "tomales-bioluminescence",
    number: "18",
    title: "Paddle Through Living Light",
    short: "Kayak Tomales Bay on a dark night while every paddle stroke ignites blue-green plankton.",
    bucket: "one-night",
    time: "One night",
    duration: "24–30 hours",
    region: "Tomales Bay",
    season: ["Summer–fall", "Dark moon"],
    energy: "Moderate",
    cost: "$$$",
    drive: "1.5 hours",
    lead: "Book 3–8 weeks around moon",
    artwork: "assets/postcards/18-bioluminescence.webp",
    map: [24, 60],
    verdict: "The rare natural spectacle improved by darkness, cold, and getting the moon calendar right.",
    itinerary: [
      ["Sat 2:00", "Arrive in West Marin", "Check in near Point Reyes Station, Inverness, or Marshall."],
      ["Sat 4:00", "Early dinner", "Eat before paddling and keep it civilized; dry bags have limited sympathy."],
      ["Sat 7:00", "Guide briefing", "Meet at the assigned launch for clothing, safety, and bay conditions."],
      ["Sat 8:30", "Bioluminescent paddle", "Move into the darker bay and watch the water answer each stroke."],
      ["Sat 11:00", "Sleep nearby", "Do not turn the return drive into an endurance epilogue."],
      ["Sun 9:00", "Point Reyes breakfast", "One coastal walk, then home before Sunday traffic develops ambitions."]
    ],
    swaps: ["Choose a daytime natural-history paddle when bioluminescence conditions are weak.", "Stay in a simple motel; the water is the luxury item."],
    sources: [
      ["Blue Waters bioluminescence", "https://bluewaterskayaking.com/bioluminescence-evening-tours/"],
      ["Tomales Bay Expeditions", "https://tomalesbayexpeditions.com/tours/"],
      ["Point Reyes boating safety", "https://www.nps.gov/pore/planyourvisit/safety_boating.htm"]
    ]
  },
  {
    id: "echo-desolation",
    number: "19",
    title: "Take the Boat Into Desolation",
    short: "Ride the Echo Lakes water taxi into the wilderness, then backpack to an alpine camp.",
    bucket: "one-night",
    time: "One night",
    duration: "30–36 hours",
    region: "Desolation Wilderness",
    season: ["July–September", "Snow-free"],
    energy: "High",
    cost: "$$",
    drive: "3.5 hours",
    lead: "Permit and camp 4–12 weeks",
    artwork: "assets/postcards/19-echo-lakes.webp",
    map: [68, 58],
    verdict: "A boat removes the least interesting miles and deposits you directly into Sierra competence theater.",
    itinerary: [
      ["Sat 6:00", "Drive to Echo Lakes", "Arrive before parking becomes its own wilderness challenge."],
      ["Sat 10:00", "Water taxi", "Confirm seasonal operations and ride across the linked lakes with packs aboard."],
      ["Sat 11:00", "Hike into Desolation", "Follow the permitted zone toward Tamarack, Lake Aloha, or the chosen camp."],
      ["Sat 3:00", "Alpine camp", "Swim only if conditions and judgment agree; protect food and granite equally."],
      ["Sun 8:00", "Morning hike", "Break camp early and walk the full return or catch the taxi from the designated point."],
      ["Sun 2:00", "South Lake Tahoe meal", "Eat, change, and return before fatigue wins the steering wheel."]
    ],
    swaps: ["Make it a long day hike using the taxi both ways.", "Choose a nearer permitted zone for first-time backpackers; scenery does not scale with suffering."],
    sources: [
      ["Echo Chalet", "https://www.fs.usda.gov/r05/laketahoebasin/recreation/echo-chalet"],
      ["Desolation Wilderness", "https://www.fs.usda.gov/r05/eldorado/wilderness/desolation-wilderness"],
      ["Wilderness permits", "https://www.recreation.gov/permits/233261"]
    ]
  },
  {
    id: "palisades-first-chair",
    number: "20",
    title: "First Chair at Palisades",
    short: "Two nights engineered around Friday arrival, first tracks, village recovery, and a second mountain morning.",
    bucket: "full-weekend",
    time: "A full weekend",
    duration: "2 nights",
    region: "North Lake Tahoe",
    season: ["December–April", "Snow-dependent"],
    energy: "High",
    cost: "$$$$",
    drive: "3.5–5 hours",
    lead: "Book 6–12 weeks; avoid peak dates",
    artwork: "assets/postcards/20-palisades.webp",
    map: [70, 54],
    verdict: "Tahoe works when the weekend is designed around the mountain, not around sitting in traffic near it.",
    itinerary: [
      ["Fri 2:00", "Leave before the Bay", "Depart before rush hour and before the storm convoy becomes a civic experiment."],
      ["Fri 7:00", "Sleep near the lifts", "Stay in Olympic Valley or use a shuttle-served base. Car keys retire."],
      ["Sat 8:00", "First chair", "Collect passes early and ski the terrain the weather actually opens."],
      ["Sat 3:30", "Village recovery", "Hot tub, après, dinner, and no heroic night driving."],
      ["Sun 8:30", "Second session", "Ski a focused half-day rather than squeezing every cent from the pass."],
      ["Sun 1:30", "Exit early", "Leave before the main westbound migration, conditions permitting."]
    ],
    swaps: ["Use Sugar Bowl for a more compact, old-Tahoe version with easier Bay access.", "Go Sunday–Tuesday when calendar flexibility is more valuable than pretending crowds build character."],
    sources: [
      ["Palisades Tahoe", "https://www.palisadestahoe.com/"],
      ["Parking and road conditions", "https://www.palisadestahoe.com/mountain-information/parking-and-road-conditions"],
      ["Parking reservations", "https://www.parkpalisadestahoe.com/parkingbasics"]
    ]
  },
  {
    id: "lassen-stars-steam",
    number: "21",
    title: "Steam, Stars & Lassen",
    short: "Cross a volcanic park by day, walk among fumaroles, and stay for a sky unbothered by cities.",
    bucket: "full-weekend",
    time: "A full weekend",
    duration: "2 nights",
    region: "Lassen Volcanic",
    season: ["July–October", "Road-dependent"],
    energy: "Moderate",
    cost: "$$",
    drive: "4–4.5 hours",
    lead: "Camp 2–6 months ahead",
    artwork: "assets/postcards/21-lassen.webp",
    map: [65, 29],
    verdict: "Volcanoes, hydrothermal nonsense, alpine lakes, and a dark sky—Yosemite can survive one weekend without you.",
    itinerary: [
      ["Fri 2:00", "Drive north", "Reach the park area before dark and set up camp or base in Mineral/Chester."],
      ["Sat 8:00", "Volcanic highway", "Cross the park road early, stopping at Sulphur Works and the best open overlooks."],
      ["Sat 10:30", "Bumpass Hell", "Hike the hydrothermal basin only when the trail is officially open."],
      ["Sat 3:00", "Alpine lake reset", "Swim or walk at Manzanita or Summit Lake according to route and temperature."],
      ["Sat 9:30", "Dark-sky hour", "Return outside after full dark with red lights, layers, and no campsite floodlighting."],
      ["Sun 8:00", "One final volcano", "Choose Cinder Cone, Lassen Peak, or an easier lake loop—not all three."]
    ],
    swaps: ["Base in Chester when campsites are gone or smoke makes commitment unwise.", "Replace Bumpass Hell with Sulphur Works when snow or access closes the trail."],
    sources: [
      ["Lassen Volcanic NPS", "https://www.nps.gov/lavo"],
      ["Stargazing", "https://www.nps.gov/lavo/planyourvisit/stargazing.htm"],
      ["Current conditions", "https://www.nps.gov/lavo/planyourvisit/conditions.htm"]
    ]
  },
  {
    id: "sierra-buttes-lookout",
    number: "22",
    title: "Climb the Sierra Buttes Fire Lookout",
    short: "Stay beside Sardine Lakes, then climb the improbable staircase to a lookout above a dozen alpine basins.",
    bucket: "full-weekend",
    time: "A full weekend",
    duration: "2 nights",
    region: "Lakes Basin / Sierra City",
    season: ["July–October", "Snow-free"],
    energy: "High",
    cost: "$$",
    drive: "4 hours",
    lead: "Lodging or camp 6–16 weeks",
    artwork: "assets/postcards/22-sierra-buttes.webp",
    map: [61, 46],
    verdict: "A signature summit and a first-rate lake weekend in a quieter, sharper package than Tahoe.",
    itinerary: [
      ["Fri 2:00", "Drive to Sierra City", "Reach the basin in daylight and establish camp or a room near Sardine Lakes."],
      ["Sat 7:30", "Lookout trail", "Start before heat and climb the steep final stairs only if exposure feels manageable."],
      ["Sat 12:00", "Summit lunch", "Eat below the lookout when wind or crowds make the tiny platform ridiculous."],
      ["Sat 3:00", "Sardine Lakes", "Swim, paddle, or simply sit where the granite does the visual work."],
      ["Sat 7:00", "Sierra City dinner", "One small-town evening; plan around limited hours."],
      ["Sun 9:00", "Lakes Basin coda", "Choose one mellow lake walk before the drive home."]
    ],
    swaps: ["Skip the exposed lookout stairs and hike to a lower viewpoint.", "Stay at the resort for boats and beds; camp for silence and less financial theater."],
    sources: [
      ["Tahoe National Forest recreation", "https://www.fs.usda.gov/r05/tahoe/recreation"],
      ["Sardine Lake Campground", "https://www.recreation.gov/camping/campgrounds/234539"],
      ["Sardine Lake Resort", "https://www.sardinelakeresort.com/"]
    ]
  },
  {
    id: "bodie-hot-springs",
    number: "23",
    title: "Ghost Town, Then Hot Springs",
    short: "Cross the Sierra to Bodie’s arrested decay, then soak outside Bridgeport under a cold high-desert sky.",
    bucket: "full-weekend",
    time: "A full weekend",
    duration: "2 nights",
    region: "Eastern Sierra",
    season: ["Late spring–fall", "Road-dependent"],
    energy: "Moderate",
    cost: "$$$",
    drive: "5–5.5 hours",
    lead: "Book 3–8 weeks; verify roads",
    artwork: "assets/postcards/23-bodie.webp",
    map: [78, 60],
    verdict: "The far edge of the radius earns its place with a real ghost town and geology you can sit in.",
    itinerary: [
      ["Fri 12:00", "Cross the Sierra", "Use daylight for the pass and sleep in Bridgeport; weather may rewrite the route."],
      ["Sat 9:00", "Bodie", "Drive the final road carefully and arrive near opening before the preserved streets fill."],
      ["Sat 1:00", "Picnic outside the park", "Carry lunch and respect the site’s no-take, no-stage character."],
      ["Sat 3:00", "Bridgeport return", "Check current land guidance before visiting any hot spring."],
      ["Sat 5:00", "Responsible soak", "Use established pools, pack everything out, and leave if access or ceremonial closure applies."],
      ["Sun 9:00", "Mono County coda", "One lake, pass, or historic stop before the long return west."]
    ],
    swaps: ["Use Grover Hot Springs on the western side when passes or eastern access are uncertain.", "Skip the soak entirely if official guidance is unclear; a hot spring is not a legal theory seminar."],
    sources: [
      ["Bodie State Historic Park", "https://www.parks.ca.gov/bodie"],
      ["Mono County hot springs guidance", "https://www.monocounty.org/places-to-go/hot-springs/travertine-hot-springs/"],
      ["BLM temporary closure notices", "https://www.blm.gov/announcement/travertine-hot-springs-will-be-temporarily-closed"]
    ]
  },
  {
    id: "burney-subway-cave",
    number: "24",
    title: "Waterfall to Lava Tube",
    short: "Camp near Burney Falls, then trade a spring-fed wall of water for a headlamp walk through volcanic darkness.",
    bucket: "full-weekend",
    time: "A full weekend",
    duration: "2 nights",
    region: "Shasta Cascade",
    season: ["Late spring–fall", "Cave seasonal"],
    energy: "Moderate",
    cost: "$$",
    drive: "4.5 hours",
    lead: "Camp 2–6 months ahead",
    artwork: "assets/postcards/24-burney.webp",
    map: [62, 21],
    verdict: "Two different kinds of waterless plumbing: a spring-fed wall of water and a walk-through lava tube.",
    itinerary: [
      ["Fri 1:00", "Drive north", "Set up near Burney before dark; weekend campsites are the scarce resource."],
      ["Sat 8:00", "Burney Falls early", "Walk the overlook and falls loop before the main day-use wave arrives."],
      ["Sat 11:00", "Lake or picnic reset", "Use Lake Britton or a quiet picnic site to give the waterfall crowds room."],
      ["Sat 2:00", "Subway Cave", "Bring headlamps and warm layers; the lava tube is dark, cold, and uneven."],
      ["Sat 5:00", "Hat Creek evening", "Return to camp rather than collecting another attraction."],
      ["Sun 9:00", "One Cascade detour", "Choose a short forest stop before the long drive home."]
    ],
    swaps: ["Replace the cave with an easy surface trail for anyone uneasy underground.", "Add Lake Britton paddling only when wind and operations cooperate."],
    sources: [
      ["McArthur–Burney Falls", "https://www.parks.ca.gov/?page_id=455"],
      ["Subway Cave", "https://www.fs.usda.gov/r05/lassen/recreation/subway-cave"]
    ]
  }
];

const TIME_BUCKETS = [
  { id: "few-hours", label: "A few hours", short: "2–5 hr", color: "blue" },
  { id: "full-day", label: "A full day", short: "7–12 hr", color: "yellow" },
  { id: "one-night", label: "One night", short: "24–36 hr", color: "green" },
  { id: "full-weekend", label: "A full weekend", short: "2–3 nights", color: "red" }
];
