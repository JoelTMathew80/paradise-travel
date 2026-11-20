/* ==========================================================================
   REST API & NETWORKING FUNDAMENTALS (RECRUITER & DEVELOPER GUIDE)
   ==========================================================================
   1. GET vs POST:
      - GET: Safe and idempotent. Used to request data from a specified resource
        without causing side-effects. Parameters are sent in the query string (e.g.
        Open-Meteo weather parameters, or fetching static destinations.json).
      - POST: Non-idempotent. Used to send data to a server to create/process a
        resource. Data is included in the HTTP request body (e.g. submitting the
        enquiry form as a JSON payload to Formspree).

   2. JSON (JavaScript Object Notation):
      - A lightweight, text-based, language-independent data interchange format.
      - JSON.stringify(object): Serializes JavaScript objects into a JSON string
        to send across the network with header 'Content-Type: application/json'.
      - response.json(): Parses the incoming JSON string stream back into a
        native JavaScript object/array.

   3. HTTP Status Codes:
      - 2xx Success: 200 OK (GET/POST succeeded), 201 Created (resource created).
      - 3xx Redirection: 301 Moved Permanently, 304 Not Modified (cached).
      - 4xx Client Error: 400 Bad Request (invalid JSON), 404 Not Found (bad URL),
        429 Too Many Requests (rate limited).
      - 5xx Server Error: 500 Internal Server Error, 502/503 Gateway/Unavailable.

   4. async/await & Promises:
      - async functions always return a Promise.
      - await pauses execution of the async function until the Promise resolves,
        producing clean, readable non-blocking code without nested callback hell.
      - try/catch blocks provide centralized, graceful error handling for
        network failures, offline conditions, or non-200 HTTP responses.
   ========================================================================== */

var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var uid = 0;

// Google Maps API Key placeholder
const GOOGLE_MAPS_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

// Formspree placeholder endpoint (POST)
var FORMSPREE_ENDPOINT = 'https://formspree.io/f/placeholder_enquiry';

// Embedded offline fallback data (in case browser blocks local file:// fetch)
var EMBEDDED_FALLBACK_DEST = [{"id": "andaman", "name": "Andaman Islands", "where": "Andaman and Nicobar, India", "type": "beach", "season": [9, 10, 11, 0, 1, 2, 3, 4], "seasonText": "Oct to May", "nights": 5, "price": 32000, "blurb": "Clear water, coral reefs and quiet white-sand beaches on Havelock and Neil.", "sc": ["beach", ["#8EDCE6", "#FBE3B8", "#FFC15E", "#0B7F86", "#F1D79B", "#16A3AA"]], "reach": {"airport": "Veer Savarkar Intl Airport (IXZ), Port Blair (connected from MAA, BLR, CCU, DEL)", "railway": "No rail connectivity; reachable only via flights or deep-sea passenger ships", "local": "High-speed catamarans (Makruzz, Nautika), govt ferries, prepaid cabs, auto-rickshaws"}, "budget": {"stay": 14000, "food": 7000, "transport": 6000, "activities": 5000}, "tips": ["Ferries: Book inter-island catamaran tickets (Port Blair\u2013Havelock\u2013Neil) weeks in advance.", "Permits: Indian nationals need no permits; RAP is lifted for foreigners on 30 inhabited islands (valid passport/visa required).", "Monsoon: Intense June to September with high sea swells and suspended boat trips.", "Cellular Jail: Closed Mondays and national holidays; book sound & light tickets online."], "days": [{"title": "Port Blair & Freedom Heritage", "morning": "Arrive at Port Blair (IXZ); transfer to your hotel and unwind with fresh tender coconut water.", "afternoon": "Tour the national memorial at Cellular Jail and explore the Kalapani freedom struggle galleries.", "evening": "Watch the historic Cellular Jail Light & Sound Show, followed by dinner at Aberdeen Bazaar."}, {"title": "Havelock (Swaraj Dweep)", "morning": "Board the 90-minute high-speed catamaran from Phoenix Bay Jetty to Havelock harbour.", "afternoon": "Check in at your beachfront resort and head to Radhanagar Beach (Beach No. 7), Asia\u2019s top white-sand stretch.", "evening": "Witness an unobstructed sunset over the turquoise Andaman Sea; dine at a relaxed garden cafe."}, {"title": "Elephant Beach Reef & Water Sports", "morning": "Take a 20-minute speed boat to Elephant Beach for guided sea-walking or reef snorkelling.", "afternoon": "Observe vibrant live corals and colourful reef fish; rest in shaded hammocks along the shore.", "evening": "Return to Havelock harbour and stroll through the local island market of Govind Nagar."}, {"title": "Neil Island (Shaheed Dweep)", "morning": "Ferry across to peaceful Neil Island; swim in the calm turquoise waters of Bharatpur Beach.", "afternoon": "Marvel at the geological wonder of the Natural Coral Bridge (Howrah Bridge) at low tide.", "evening": "Catch the crimson sunset at Laxmanpur Beach 1 before enjoying fresh grilled reef fish."}, {"title": "Chidiya Tapu & Coastal Departure", "morning": "Ferry back to Port Blair; visit the Samudrika Naval Marine Museum and Anthropological Museum.", "afternoon": "Drive along mangrove-lined coastal roads to the tranquil rainforest trails of Chidiya Tapu.", "evening": "Shop for handcrafted mother-of-pearl crafts at Sagarika Govt Emporium before your departure flight."}], "coords": {"lat": 11.6234, "lon": 92.7265}}, {"id": "goa", "name": "Goa", "where": "Goa, India", "type": "beach", "season": [10, 11, 0, 1], "seasonText": "Nov to Feb", "nights": 4, "price": 18000, "blurb": "Fort walls, Portuguese lanes and a beach for every mood.", "sc": ["beach", ["#F7A072", "#FFE0B0", "#FFD36B", "#C2563A", "#F2D2A0", "#1F8A9B"]], "reach": {"airport": "Dabolim Airport (GOI) or Manohar Intl Airport Mopa (GOX)", "railway": "Madgaon (MAO), Thivim (THVM), or Karmali (KRMI)", "local": "Pilot motorbike taxis, self-drive scooters/cars, prepaid airport cabs, Goa Kadamba buses"}, "budget": {"stay": 8000, "food": 4500, "transport": 3000, "activities": 2500}, "tips": ["Churches: Strict modest dress code at Basilica of Bom Jesus & Se Cathedral (no sleeveless tops or short skirts/shorts).", "Monsoon: Rough seas June to September; water sports suspended, swimming strictly red-flagged.", "Scooters: Carry a valid driving license; helmet is legally mandatory for both rider and pillion.", "Dudhsagar: Accessible Oct to May via forest department 4x4 jeeps from Kulem."], "days": [{"title": "North Goa Forts & Candolim", "morning": "Land at Goa airport; drive to your North Goa hotel and sip refreshing chilled kokum juice.", "afternoon": "Explore Fort Aguada\u2019s 17th-century Portuguese ramparts and the historic four-storey lighthouse.", "evening": "Watch the sunset over Candolim beach with fresh Goan poi bread and live acoustic music."}, {"title": "Old Goa & Fontainhas Heritage", "morning": "Marvel at the Baroque architecture and sacred relics of the Basilica of Bom Jesus and Se Cathedral.", "afternoon": "Stroll through Fontainhas in Panaji, photographing pastel Portuguese villas, azulejo tiles, and art cafes.", "evening": "Take a sunset cruise along the Mandovi River with traditional Goan folk music and dance."}, {"title": "South Goa & Serene Palolem", "morning": "Drive south to scenic Palolem Beach, nestled between palm-topped headlands in Canacona.", "afternoon": "Take a small boat to Butterfly Beach and Monkey Island for dolphin watching and calm swimming.", "evening": "Savour authentic Goan fish curry, prawn balchao, and bebinca at a seaside candlelit table."}, {"title": "Ponda Spice Plantations & Divar", "morning": "Visit a traditional spice plantation in Ponda; tour vanilla, nutmeg, and cinnamon plantations.", "afternoon": "Savor an authentic Goan Saraswat buffet lunch served on fresh plantain leaves.", "evening": "Take the local river ferry to peaceful Divar Island for an atmospheric countryside sunset walk."}, {"title": "Chapora Fort & Anjuna Crafts", "morning": "Hike up to the red laterite ruins of Chapora Fort for panoramic views of Vagator coastline.", "afternoon": "Browse handicrafts, cotton resort-wear, and spices at the bohemian beachside markets.", "evening": "Relax at a cliffside cafe in Vagator before your transfer to the airport or railway station."}], "coords": {"lat": 15.4909, "lon": 73.8278}}, {"id": "gokarna", "name": "Gokarna", "where": "Karnataka, India", "type": "beach", "season": [9, 10, 11, 0, 1, 2], "seasonText": "Oct to Mar", "nights": 3, "price": 12000, "blurb": "A temple town with a string of secluded beaches, reached on foot.", "sc": ["beach", ["#A8E0D2", "#F6EBC8", "#FFCF6E", "#2E8B73", "#E9CF98", "#1D9C98"]], "reach": {"airport": "Goa Dabolim (GOI, ~140 km) or Hubballi (HBX, ~150 km)", "railway": "Gokarna Road (GOK, ~9 km) or Kumta (KT, ~31 km)", "local": "Auto-rickshaws, cliff hiking trails between beaches, local motorized boat transfers"}, "budget": {"stay": 5000, "food": 3000, "transport": 2200, "activities": 1800}, "tips": ["Temple Dress Code: Mahabaleshwar Temple enforces traditional attire (dhoti for men; shirts removed in inner sanctum).", "Beach Trekking: Half Moon and Paradise beaches have no road access; carry water and headlamps for walking.", "Monsoon: Sea currents are very strong June to August; rocky headlands become dangerously slick.", "Cash: ATMs in town frequently run out; keep cash for beach cafes and boatmen."], "days": [{"title": "Arrival & Om Beach Sunset", "morning": "Arrive via Gokarna Road or Kumta; check into a cliffside cottage overlooking Om Beach.", "afternoon": "Relax on Om Beach, admiring the unique rock contours naturally shaped like the sacred symbol.", "evening": "Watch the crimson sun dip into the Arabian Sea while dining on wood-fired pizza and fresh juices."}, {"title": "The 5-Beaches Coastal Trek", "morning": "Trek the scenic coastal path from Om Beach over headlands to secluded Half Moon Beach.", "afternoon": "Reach pristine Paradise Beach, accessible only on foot or boat; swim in clear turquoise waters.", "evening": "Take a boat back to Kudle Beach; enjoy an open-air yoga session and live music at a beach cafe."}, {"title": "Mahabaleshwar Temple & Town", "morning": "Early morning darshan at the 4th-century Mahabaleshwar Temple, housing the venerated Atmalinga.", "afternoon": "Visit the holy Kotitirtha water tank and shop for brass lamps, incense, and herbal oils.", "evening": "Walk the wide expanse of Gokarna Main Beach; watch fishermen pull in their evening nets."}, {"title": "Yana Karst Rocks & Mirjan Fort", "morning": "Drive 45 km into the lush Western Ghats forest to the towering monolithic limestone Yana Rocks.", "afternoon": "Hike through rainforest shade beneath Bhairaveshwara Shikhara; stop by historic Mirjan Fort.", "evening": "Explore Mirjan Fort\u2019s moss-draped laterite walls and watch sunset over the Aghanashini river."}, {"title": "Kudle Leisure & Departure", "morning": "Wake up to a quiet beach walk along Kudle; enjoy breakfast with tropical fresh fruit bowls.", "afternoon": "Pick up handwoven cotton trousers, souvenirs, and spice packets from local stalls.", "evening": "Final coastal breeze walk before catching your train at Gokarna Road or Kumta station."}], "coords": {"lat": 14.5479, "lon": 74.3188}}, {"id": "munnar", "name": "Munnar", "where": "Kerala, India", "type": "hills", "season": [8, 9, 10, 11, 0, 1, 2], "seasonText": "Sep to Mar", "nights": 3, "price": 15000, "blurb": "Tea terraces rolling over cool mountain slopes above the clouds.", "sc": ["hills", ["#BFE3D4", "#F2F6E0", "#FFF2B8", "#4E9A7B", "#2F7A56", "#356E58"]], "reach": {"airport": "Cochin International Airport (COK, ~110 km / 3.5 hrs via NH85)", "railway": "Aluva (AWY, ~110 km) or Ernakulam Junction (ERS, ~130 km)", "local": "Hired tourist taxis, auto-rickshaws, 4WD jeeps for high-altitude spots like Kolukkumalai"}, "budget": {"stay": 6500, "food": 3500, "transport": 3000, "activities": 2000}, "tips": ["Eravikulam Park: Closed annually for ~60 days (Feb to March/early April) for Nilgiri Tahr calving; book online.", "Tea Museum: KDHP Tea Museum at Nullatanni is closed on Mondays.", "Winter Chill: Temperatures dip below 10\u00b0C (near 0\u00b0C at Kolukkumalai) in Dec\u2013Jan; pack warm layers.", "Ghat Driving: Mountain roads are subject to thick fog; avoid late-night driving."], "days": [{"title": "Tea Country & KDHP Museum", "morning": "Scenic drive up the misty Western Ghats via Neriamangalam; check into your tea-estate stay.", "afternoon": "Tour the KDHP Tea Museum at Nullatanni; observe orthodox tea processing from leaf to packet.", "evening": "Walk through emerald tea garden slopes; warm up with freshly brewed estate tea by the fireplace."}, {"title": "Eravikulam & Mattupetty Dam", "morning": "Board the forest eco-bus at Eravikulam National Park (Rajamalai) to spot the endangered Nilgiri Tahr.", "afternoon": "Stop at Mattupetty Dam for speed-boating, followed by the fun acoustic reverberations of Echo Point.", "evening": "Enjoy a serene pedal-boat ride at Kundala Lake amidst Kashmiri shikaras and tea-covered shores."}, {"title": "Top Station & High Vistas", "morning": "Ascend to Top Station viewpoint (1,880 m) on the Kerala-Tamil Nadu border before morning mist rolls in.", "afternoon": "Pause at panoramic viewpoints along the route; sample roasted spiced corn and homemade chocolates.", "evening": "Browse Munnar town market for eucalyptus oil, organic green cardamom, clove, and fresh pepper."}, {"title": "Kolukkumalai 4x4 Off-Road Sunrise", "morning": "Take a rugged early 4WD jeep ride up to Kolukkumalai (7,130 ft), the highest tea plantation in the world.", "afternoon": "Tour the heritage 1930s wood-and-roller tea factory; sample delicate floral single-origin black teas.", "evening": "Descend to Munnar; enjoy a traditional Kerala Sadhya dinner served on a fresh banana leaf."}, {"title": "Marayoor Sandalwood & Waterfalls", "morning": "Drive through the fragrant natural sandalwood forest of Marayoor; see Neolithic dolmens (Muniyaras).", "afternoon": "Stop by the roaring cascade of Cheeyappara Waterfalls tumbling down in seven distinct tiers.", "evening": "Scenic drive down through the rubber plantations towards Cochin Airport for your evening flight."}], "coords": {"lat": 10.0889, "lon": 77.0595}}, {"id": "coorg", "name": "Coorg", "where": "Karnataka, India", "type": "hills", "season": [9, 10, 11, 0, 1, 2], "seasonText": "Oct to Mar", "nights": 3, "price": 14000, "blurb": "Coffee estates, waterfalls and misty ridges, an easy drive from Bengaluru.", "sc": ["hills", ["#D4E4C9", "#F7EED2", "#FFD98A", "#6C8F5A", "#3F6B3A", "#4A6F37"]], "reach": {"airport": "Kannur Intl (CNN, ~90 km), Mangaluru (IXE, ~140 km), or Bengaluru (BLR, ~285 km)", "railway": "Mysuru Junction (MYS, ~120 km) or Hassan (HAS, ~115 km)", "local": "Hired private cars, local KSRTC buses, 4x4 jeeps for Mandalpatti peak"}, "budget": {"stay": 6000, "food": 3500, "transport": 2700, "activities": 1800}, "tips": ["Dubare Camp: Elephant bathing and feeding runs strictly 9:00 AM to 11:00 AM; river crossing subject to water level.", "Namdroling Monastery: Maintain silence in prayer halls during monk chanting sessions; remove footwear.", "Rainforest Leeches: Common around Abbey and Iruppu falls during and right after monsoon; wear proper footwear.", "Coffee Harvest: Coffee blossom season is March\u2013April; berry harvest takes place December to February."], "days": [{"title": "Abbey Falls & Coffee Walk", "morning": "Drive into Kodagu through coffee-scented valleys; check into a heritage planter\u2019s estate homestay.", "afternoon": "Walk down to Abbey Falls, roaring through dense coffee shrubs and pepper vines.", "evening": "Take a guided estate plantation walk learning about Arabica and Robusta beans, vanilla, and spices."}, {"title": "Dubare Elephants & Bylakuppe", "morning": "Cross the Cauvery River to Dubare Elephant Camp for the morning bathing and feeding interaction (9\u201311 AM).", "afternoon": "Head to Bylakuppe, the largest Tibetan settlement in South India, and visit the serene Namdroling Monastery.", "evening": "Spin Buddhist prayer wheels, listen to monks chanting, and taste authentic Tibetan steamed momos."}, {"title": "Talakaveri & Raja\u2019s Seat", "morning": "Drive to Talakaveri on Brahmagiri Hills, sacred origin of River Cauvery; climb Brahmagiri peak steps.", "afternoon": "Tour historic Madikeri Fort, the palace museum, and the Gothic-style St. Mark\u2019s Church.", "evening": "Gather at Raja\u2019s Seat garden to watch the sun drop behind mist-draped rolling valleys."}, {"title": "Mandalpatti 4x4 Viewpoint", "morning": "Board an open 4WD jeep for a rugged climb through misty grassland trails to Mandalpatti peak.", "afternoon": "Enjoy breathtaking 360-degree vistas across Pushpagiri Wildlife Sanctuary.", "evening": "Sample authentic Kodava cuisine: spicy Pandi curry, Kadambuttu (rice dumplings), and bamboo shoot curry."}, {"title": "Iruppu Falls & Estate Shopping", "morning": "Journey to sacred Iruppu Falls nestled in the Brahmagiri forest; dip your feet in cool mountain waters.", "afternoon": "Explore the fringe forest roads near Nagarhole, watching for chital deer and peacocks.", "evening": "Pick up Coorg wild honey, homemade artisanal chocolates, and freshly roasted estate coffee before departure."}], "coords": {"lat": 12.4244, "lon": 75.7382}}, {"id": "hampi", "name": "Hampi", "where": "Karnataka, India", "type": "culture", "season": [9, 10, 11, 0, 1], "seasonText": "Oct to Feb", "nights": 3, "price": 11000, "blurb": "Dramatic boulder hills and the majestic ruins of the Vijayanagara Empire.", "sc": ["culture", ["#F6B98A", "#FFE6B8", "#FFD26A", "#B5683F", "#8E4B2B", "#C47B49"]], "reach": {"airport": "Jindal Vidyanagar Airport (VDY, ~35 km) or Hubballi (HBX, ~140 km)", "railway": "Hosapete Junction (HPT, ~13 km from Hampi Bazaar)", "local": "Rented bicycles, scooters/mopeds, auto-rickshaws, licensed coracle ferries"}, "budget": {"stay": 4500, "food": 2700, "transport": 2000, "activities": 1800}, "tips": ["Scorching Summer: March to June exceeds 38\u00b0C with bare rock radiation; winter (Nov\u2013Jan) is ideal.", "ASI Protection: Tapping or touching musical pillars at Vittala Temple is strictly prohibited.", "Footwear: Extensive walking on uneven rock terrain; wear sturdy walking shoes with good grip.", "Coracles: Wearing police-approved life jackets is strictly mandatory on Tungabhadra river crossings."], "days": [{"title": "Virupaksha & Sacred Centre", "morning": "Arrive via Hosapete Junction; check into a boulder-view retreat near Hampi Bazaar.", "afternoon": "Visit the 7th-century active Virupaksha Temple, Kadalekalu Ganesha, and Sasivekalu Ganesha.", "evening": "Walk down the colonnaded Hampi Bazaar and watch sunset from Hemakuta Hill\u2019s cluster of ancient shrines."}, {"title": "Vittala Temple & Royal Enclosure", "morning": "Marvel at the iconic Stone Chariot and the intricate pillared hall at the Vittala Temple Complex.", "afternoon": "Take an eco-buggy back, then explore the Queen\u2019s Bath, Lotus Mahal, and the vaulted Elephant Stables.", "evening": "Take a traditional round coracle boat ride on the Tungabhadra River, navigating granite boulder rapids."}, {"title": "Matanga Hill Dawn & Achyutaraya", "morning": "Dawn hike up Matanga Hill for a panoramic 360-degree sunrise view over the vast ruined imperial capital.", "afternoon": "Descend through the historic Courtesan\u2019s Street to the evocative, peaceful Achyutaraya Temple ruins.", "evening": "Relax at a riverside garden cafe across the river; enjoy fresh South Indian and Mediterranean thalis."}, {"title": "Anegundi & Sanapur Lake", "morning": "Cross over to ancient Anegundi, legendary monkey kingdom of Kishkindha.", "afternoon": "Climb the white steps of Anjaneya Hill (Hanuman\u2019s birthplace); enjoy the tranquil waters of Sanapur Lake.", "evening": "Try introductory bouldering with local climbing guides or unwind with a sunset coracle glide."}, {"title": "Pattabhirama & Daroji Bear Sanctuary", "morning": "Visit the grand Pattabhirama Temple and the ASI Archaeological Museum at Kamalapura.", "afternoon": "Drive to Daroji Sloth Bear Sanctuary to observe sloth bears foraging on rocky hills from the watchtower.", "evening": "Final heritage stroll along the Tungabhadra riverbank before catching your night train from Hosapete."}], "coords": {"lat": 15.335, "lon": 76.46}}, {"id": "alleppey", "name": "Alleppey (Alappuzha)", "where": "Kerala, India", "type": "backwaters", "season": [9, 10, 11, 0, 1, 2], "seasonText": "Oct to Mar", "nights": 2, "price": 14000, "blurb": "Venice of the East with endless palm-lined canals, houseboats and below-sea-level paddy fields.", "sc": ["backwaters", ["#A0E2DC", "#F3F8E4", "#FFCA65", "#186E64", "#8B5A2B", "#0E7C7B"]], "reach": {"airport": "Cochin International Airport (COK, ~85 km / 2.5 hrs)", "railway": "Alappuzha Railway Station (ALLP, ~3 km from town boat jetty)", "local": "Auto-rickshaws, KSWTD public scenic water ferries (\u20b910\u201340), private motor shikaras, houseboats"}, "budget": {"stay": 6500, "food": 3000, "transport": 2500, "activities": 2000}, "tips": ["Houseboat Law: Kerala tourism rules require all houseboats to anchor by 5:30 PM for fishermen nets; cruising resumes 8:00 AM.", "Air Conditioning: In standard deluxe houseboats, AC runs 9:00 PM to 6:00 AM in bedrooms; book luxury for 24-hr salon AC.", "Nehru Trophy: The famous snake boat race is held on Punnamada Lake on the 2nd Saturday of August.", "Certification: Choose DTPC-accredited houseboats (Gold or Green leaf emblems) for verified waste safety."], "days": [{"title": "Boarding Kettuvallam & Lake Vembanad", "morning": "Arrive in Alleppey; transfer to Punnamada Jetty to board your private thatched houseboat (Kettuvallam).", "afternoon": "Cruise through palm-fringed backwaters while chefs prepare authentic Karimeen Pollichathu (pearl spot fish).", "evening": "Boat anchors at 5:30 PM by peaceful village banks; take an evening stroll along lush paddy dykes."}, {"title": "Kuttanad Canals & Country Canoe", "morning": "Watch village life awaken over breakfast as your boat glides past duck farms and lotus clusters.", "afternoon": "Switch to a narrow wooden country canoe to explore interior village canals inaccessible to big boats.", "evening": "Visit the historic 11th-century Karumadi Kuttan Buddha statue; catch sunset over Marari Beach."}, {"title": "Alleppey Lighthouse & Coir Heritage", "morning": "Tour the International Coir Museum to discover how coconut husk is woven into golden carpets and ropes.", "afternoon": "Climb the 1862 Alleppey Lighthouse for panoramic views over the Arabian coastline and historic pier.", "evening": "Walk the historic Alleppey Beach pier at sunset, savouring hot banana fritters and spiced tea."}, {"title": "Pathiramanal Island & Village Cycling", "morning": "Rent a bicycle to ride along quiet coastal village paths between backwaters and the sea.", "afternoon": "Take a boat to emerald Pathiramanal Island (Sands of Midnight) to observe migratory water birds.", "evening": "Dine on Malabar parotta, appams, and creamy vegetable stew under lantern-lit palm trees."}, {"title": "Champakulam Church & Departure", "morning": "Visit Champakulam Kalloorkadu St. Mary\u2019s Forane Church, established in 427 CE on the riverbank.", "afternoon": "See the prized 130-foot racing snake boats (Chundan Vallam) housed in traditional village sheds.", "evening": "Scenic drive along NH66 back towards Cochin International Airport for your connecting flight."}], "coords": {"lat": 9.4981, "lon": 76.3388}}, {"id": "kochi", "name": "Kochi (Fort Kochi)", "where": "Kerala, India", "type": "culture", "season": [9, 10, 11, 0, 1, 2], "seasonText": "Oct to Mar", "nights": 3, "price": 13500, "blurb": "Chinese fishing nets, spice warehouses, colonial churches and lively contemporary art.", "sc": ["culture", ["#E0D2BC", "#FFF2DA", "#FFA45B", "#8C5E3A", "#B27B50", "#4F6D7A"]], "reach": {"airport": "Cochin International Airport (COK, ~40 km / 1 hr 15 min)", "railway": "Ernakulam Junction (ERS) or Ernakulam Town (ERN)", "local": "Kochi Water Metro (AC electric catamarans), Ro-Ro vehicle ferries, rental cycles, auto-rickshaws"}, "budget": {"stay": 6000, "food": 3500, "transport": 2200, "activities": 1800}, "tips": ["Closures: Mattancherry Dutch Palace is closed Fridays. Paradesi Synagogue is closed Fridays, Saturdays and Jewish holidays.", "Synagogue Attire: Modest dress required (shoulders and knees covered); shoes must be deposited at entrance.", "Kochi Biennale: The prestigious art biennale runs every two years (Dec to April) across heritage warehouses.", "Kathakali Makeup: Arrive at Kerala Kathakali Centre by 5:00 PM to witness the artists applying natural mineral face makeup."], "days": [{"title": "Chinese Nets & Colonial Ramparts", "morning": "Arrive at Cochin Airport; take the electric Kochi Water Metro or drive to your heritage Fort Kochi stay.", "afternoon": "Walk along Vasco da Gama Square to watch fishermen operate the colossal cantilevered Chinese Fishing Nets.", "evening": "Visit St. Francis Church, India\u2019s oldest European church where Vasco da Gama was first buried in 1524."}, {"title": "Jew Town, Synagogue & Dutch Palace", "morning": "Explore the antique spice godowns of Jew Town and visit the 1568 Paradesi Synagogue with Belgian glass chandeliers.", "afternoon": "Tour Mattancherry Palace (Dutch Palace) to admire the vibrant 16th-century Ramayana mythological murals.", "evening": "Attend an evening classical Kathakali dance-drama at Kerala Kathakali Centre; arrive early for makeup."}, {"title": "Spice Markets & Marine Drive", "morning": "Walk through the aromatic ginger and pepper trading warehouses of Mattancherry bazaar.", "afternoon": "Take a harbor ferry across to Ernakulam mainland; stroll along the modern waterfront Marine Drive promenade.", "evening": "Enjoy a rooftop seafood dinner overlooking the illuminated container ships moving along Cochin port."}, {"title": "Kumbalangi Eco-Village", "morning": "Visit Kumbalangi Model Tourism Village to experience traditional crab farming, coir spinning, and palm weaving.", "afternoon": "Glide silently through tranquil mangrove passages in country canoes; taste fresh coconut water and local snacks.", "evening": "Watch Chinese fishing net silhouettes glow against a fiery orange sunset over the backwater estuary."}, {"title": "Hill Palace & Kerala Folklore Museum", "morning": "Visit the Kerala Folklore Museum in Thevara, showcasing 4,000 architectural wonders and wooden temple masks.", "afternoon": "Tour the sprawling Hill Palace Museum in Tripunithura, former administrative palace of the Maharaja of Cochin.", "evening": "Pick up freshly fried hot banana chips, whole cardamom, and vanilla beans before heading to Cochin Airport."}], "coords": {"lat": 9.9658, "lon": 76.2421}}, {"id": "thekkady", "name": "Thekkady (Periyar)", "where": "Idukki, Kerala, India", "type": "wildlife", "season": [8, 9, 10, 11, 0, 1, 2], "seasonText": "Sep to Mar", "nights": 3, "price": 13000, "blurb": "Periyar tiger reserve, lake safaris, wild elephant herds and cool cardamom hills.", "sc": ["wildlife", ["#B7E4C7", "#D8F3DC", "#FFB703", "#2D6A4F", "#1B4332", "#176063"]], "reach": {"airport": "Madurai Airport (IXM, ~140 km) or Cochin International (COK, ~160 km)", "railway": "Kottayam Railway Station (KTYM, ~110 km) or Madurai (140 km)", "local": "Forest eco-tourism shuttle buses, hired jeeps, local auto-rickshaws in Kumily town"}, "budget": {"stay": 5500, "food": 3200, "transport": 2300, "activities": 2000}, "tips": ["Safari Booking: KTDC Lake boat safari tickets must be booked online weeks ahead on periyartigerreserve.org.", "Clothing: Wear neutral earthy tones (khakis, greens, browns); loud music, flash photography, and plastic are banned.", "Bamboo Rafting: Requires moderate physical fitness and prior forest department booking; includes guided forest trek.", "Spice Shopping: Buy certified Grade-A green cardamom and black pepper from Sahyadri or Spices Board outlets in Kumily."], "days": [{"title": "Arrival in Kumily & Spice Tour", "morning": "Drive up winding cardamom-scented hills into Kumily; check into a jungle retreat near Periyar gate.", "afternoon": "Take a guided walking tour through an organic spice garden, identifying wild cinnamon, clove, and nutmeg.", "evening": "Watch an exhilarating Kalaripayattu ancient martial arts duel at the Kadathanadan Kalari Centre."}, {"title": "Periyar Lake Boat Safari", "morning": "Board the early morning KTDC boat safari on Periyar Lake; spot wild elephant herds and sambar deer on the banks.", "afternoon": "Join an interpretive Nature Walk along the perimeter of the evergreen jungle with a trained tribal tracker.", "evening": "Enjoy a hearty Kerala meal featuring aromatic spices and freshly harvested garden vegetables."}, {"title": "Full-Day Bamboo Rafting Expedition", "morning": "Start the Bamboo Rafting eco-trek through moist deciduous forest into the core tiger reserve habitat.", "afternoon": "Paddle quietly on bamboo rafts across the deep forested reaches of the lake with a packed jungle lunch.", "evening": "Return to Kumily town; unwind with a soothing herbal oil Abhyanga Ayurvedic rejuvenation massage."}, {"title": "Chellarkovil & Pandikuzhi Vistas", "morning": "Drive to Chellarkovil, perched on Kerala\u2019s eastern edge with stunning views looking down on the plains of Tamil Nadu.", "afternoon": "Walk through mountain stream cascades and organic farm valleys at picturesque Pandikuzhi.", "evening": "Shop for fresh cardamom, nutmeg, cinnamon quills, and wild stingless bee honey in Kumily market."}, {"title": "Gavi Wilderness Safari & Departure", "morning": "Dawn 4WD jeep excursion into the pristine, misty evergreen rainforests of Gavi, home to lion-tailed macaques.", "afternoon": "Canoe quietly across Gavi lake and visit the historic cardamom curing house nestled deep in the forest.", "evening": "Descend through the scenic tea-clad mountain ghats towards Kottayam or Madurai for your onward train or flight."}], "coords": {"lat": 9.6031, "lon": 77.1665}}, {"id": "wayanad", "name": "Wayanad", "where": "Kerala, India", "type": "hills", "season": [9, 10, 11, 0, 1, 2, 3, 4], "seasonText": "Oct to May", "nights": 3, "price": 14500, "blurb": "Mist-clad Western Ghats, prehistoric petroglyphs, earth dams and wildlife sanctuaries.", "sc": ["hills", ["#CCE3DE", "#EAF4F4", "#FFEAA7", "#52796F", "#2F3E46", "#355070"]], "reach": {"airport": "Calicut Intl Airport (CCJ, ~95 km) or Kannur Intl (CNN, ~90 km)", "railway": "Kozhikode Railway Station (CLT, ~80 km via scenic Thamarassery Churam ghat)", "local": "Rented taxis, 4x4 jeeps for rugged plantation and viewpoint tracks, KSRTC mountain buses"}, "budget": {"stay": 6500, "food": 3500, "transport": 2700, "activities": 1800}, "tips": ["Edakkal Caves: Closed on Mondays. Daily entry is capped at 1,920 visitors; arrive by 8:30 AM to secure entry tickets.", "Chembra Peak: Trek to heart-shaped lake requires early morning forest clearance at Meppadi (daily cap of 200 passes).", "Night Ghat Ban: Vehicle transit through Bandipur/Muthanga borders is closed 9:00 PM to 6:00 AM to protect wild animals.", "Heavy Rains: Southwest monsoon (June\u2013Aug) brings intense downpours; check for temporary trail alerts."], "days": [{"title": "Thamarassery Churam & Pookode Lake", "morning": "Ascend the dramatic 9 hairpin bends of Thamarassery Ghat; check into a misty treehouse resort in Vythiri.", "afternoon": "Visit freshwater Pookode Lake ringed by evergreen forests; pedal boat amongst blue water lilies.", "evening": "Drive up to Lakkidi View Point to watch evening clouds roll over the deep Thamarassery mountain valley."}, {"title": "Edakkal Caves & Heritage Museum", "morning": "Climb the stone path to Edakkal Caves to examine prehistoric petroglyphs carved into granite dating to 6000 BCE.", "afternoon": "Tour the Wayanad Heritage Museum at Ambalavayal, housing ancient tribal terracotta, hero stones, and weaponry.", "evening": "Savor bamboo-steamed puttu with spicy Kadala curry and warm spiced ginger tea at a mountain cafe."}, {"title": "Banasura Sagar Dam & Karlad Lake", "morning": "Visit Banasura Sagar Dam, India\u2019s largest earthen dam; take an exhilarating speedboat ride across the reservoir.", "afternoon": "Zipline across Karlad Lake and try bamboo kayaking along the tranquil water\u2019s edge.", "evening": "Walk through the tea gardens of Pozhuthana and watch sunset from the Kurumbalakotta viewpoint."}, {"title": "Chembra Peak Heart Lake Trek", "morning": "Obtain early forest permits at Meppadi for the trek through tea estates up to Chembra\u2019s heart-shaped lake.", "afternoon": "Relax beside the mist-enshrouded lake Hridaya Saras, enjoying panoramic views across Nilgiri mountains.", "evening": "Return for an authentic campfire dinner with grilled river fish and steamed tapioca."}, {"title": "Muthanga Sanctuary & Kuruva Island", "morning": "Dawn jeep safari through Wayanad Wildlife Sanctuary at Muthanga; look for spotted deer, gaurs, and wild elephants.", "afternoon": "Walk on bamboo bridges through the river delta islands of Kuruva Dweep on the Kabini River.", "evening": "Drive down the Western Ghats towards Kozhikode (Calicut) Railway Station or Airport for departure."}], "coords": {"lat": 11.6103, "lon": 76.0827}}, {"id": "varkala", "name": "Varkala", "where": "Thiruvananthapuram, Kerala, India", "type": "beach", "season": [9, 10, 11, 0, 1, 2], "seasonText": "Oct to Mar", "nights": 3, "price": 12500, "blurb": "Dramatic red laterite cliffs towering over the Arabian Sea, holy mineral springs and clifftop cafes.", "sc": ["beach", ["#FFDDD2", "#FEEFE8", "#FF9F1C", "#BF4E30", "#E29578", "#006D77"]], "reach": {"airport": "Thiruvananthapuram Intl Airport (TRV, ~42 km / 1 hr 15 min)", "railway": "Varkala Sivagiri Railway Station (VAK, ~3 km from North Cliff)", "local": "Auto-rickshaws, rental scooters, walking along the pedestrian-friendly cliff promenade"}, "budget": {"stay": 5500, "food": 3200, "transport": 2000, "activities": 1800}, "tips": ["Cliff Edge Safety: The red laterite cliff edge is fragile and actively eroding; strictly follow barricaded pathways.", "Rip Currents: Papanasam Beach has powerful undertows; swim only where lifeguard flags permit.", "Temple Attire: Janardhana Swamy Temple requires traditional clothing (dhoti for men; bare torso inside sanctum).", "Sunset Seating: North Cliff cafes fill up fast for sunset; grab an oceanfront table by 5:15 PM."], "days": [{"title": "North Cliff & Papanasam Sunset", "morning": "Arrive via Varkala Sivagiri station or Trivandrum airport; check into a clifftop boutique stay.", "afternoon": "Stroll along the paved North Cliff promenade, perched high above the beach with vibrant cafes and craft stalls.", "evening": "Walk down to Papanasam Beach, famed for natural mineral springs believed to cleanse sins; dine at a clifftop cafe."}, {"title": "Janardhana Swamy & Black Sand", "morning": "Visit the 2,000-year-old Janardhana Swamy Temple, a historic Vishnu shrine with an ancient Dutch brass bell.", "afternoon": "Walk along the quiet shoreline north to Odayam and Black Sand Beach, away from the bustling main cliff.", "evening": "Join an outdoor sunset yoga session overlooking the Arabian Sea, followed by fresh fruit smoothie bowls."}, {"title": "Kappil Beach & Backwater Estuary", "morning": "Rent a scooter or take an auto 7 km north to Kappil Beach, where the backwaters meet the sea across a narrow road.", "afternoon": "Take a gentle motorboat or canoe ride on the calm waters of Edava-Nadayara Lake.", "evening": "Hike up to the cliff of Kodi Hills for a spectacular aerial perspective of the sea-backwater confluence."}, {"title": "Anjengo Fort & Golden Island", "morning": "Visit the historic 17th-century East India Company outpost at Anjengo (Anchuthengu) Fort and Lighthouse.", "afternoon": "Board a country boat to Ponnumthuruthu (Golden Island), home to an ancient Shiva-Parvati shrine amidst mangroves.", "evening": "Feast on wood-fired oven pizza, tandoori tiger prawns, and iced coconut latte at a cliffside shack."}, {"title": "Sivagiri Mutt & Wellness Departure", "morning": "Visit Sivagiri Mutt, the tranquil final resting place and headquarters of Kerala social reformer Sree Narayana Guru.", "afternoon": "Enjoy a rejuvenating Kerala Ayurvedic herbal steam bath and Shirodhara oil treatment.", "evening": "Final leisurely cliff stroll to buy handmade Tibetan jewelry before your transfer to Trivandrum Airport."}], "coords": {"lat": 8.7379, "lon": 76.7163}}, {"id": "kovalam", "name": "Kovalam", "where": "Thiruvananthapuram, Kerala, India", "type": "beach", "season": [8, 9, 10, 11, 0, 1, 2], "seasonText": "Sep to Mar", "nights": 3, "price": 15000, "blurb": "Iconic striped lighthouse, three sheltered crescent beaches, and world-renowned Ayurvedic healing.", "sc": ["beach", ["#BEE1E6", "#F0EFEB", "#F77F00", "#0077B6", "#E5989B", "#023E8A"]], "reach": {"airport": "Thiruvananthapuram Intl Airport (TRV, ~14 km / 25 min)", "railway": "Thiruvananthapuram Central (TVC, ~13 km)", "local": "Prepaid taxis, auto-rickshaws, city buses to East Fort (Padmanabhaswamy Temple)"}, "budget": {"stay": 7000, "food": 3800, "transport": 2200, "activities": 2000}, "tips": ["Lighthouse Timings: Vizhinjam Lighthouse is open to visitors 3:00 PM to 5:00 PM daily (closed on Mondays); elevator available.", "Beach Zones: Lighthouse Beach is lively with cafes; Hawah Beach has morning fishermen; Samudra Beach is quiet and upscale.", "Ayurveda: Choose centers accredited with Green Leaf or Olive Leaf certification by Kerala Tourism.", "Padmanabhaswamy: Strictly enforces traditional dress codes (dhoti for men, sarees for women; phones strictly banned)."], "days": [{"title": "Lighthouse Beach & Tower View", "morning": "Short 25-minute drive from Trivandrum Airport; check in at your coastal resort facing the crescent bay.", "afternoon": "Relax on the golden sands of Lighthouse Beach; climb the 142 steps (or elevator) of Vizhinjam Lighthouse.", "evening": "Dine at beachside promenade restaurants serving freshly caught red snapper and Kerala parottas."}, {"title": "Hawah Beach & Ayurvedic Care", "morning": "Watch traditional fishermen haul in shore seine nets at Hawah Beach (Eve\u2019s Beach) in early morning sunlight.", "afternoon": "Indulge in an authentic 90-minute Ayurvedic massage and herbal body polish at a Green Leaf certified center.", "evening": "Walk the quiet palm groves of Samudra Beach; view the heritage facade of Halcyon Castle at sunset."}, {"title": "Vizhinjam Harbor & Poovar Estuary", "morning": "Tour Vizhinjam fishing harbour and visit the marine aquarium housing rare pearl oysters and clownfish.", "afternoon": "Take an excursion south to Poovar Island; cruise on a motorized country craft through lush floating mangrove canals.", "evening": "Stand on Poovar\u2019s golden sandspit where the Neyyar River meets the sea; watch sunset over the Arabian Sea."}, {"title": "Trivandrum Cultural Heritage", "morning": "Short drive into Thiruvananthapuram; marvel at the Dravidian gopuram of Sree Padmanabhaswamy Temple.", "afternoon": "Explore Kuthira Malika (Mansion of Horses) and the Napier Museum with its Indo-Saracenic timber architecture.", "evening": "Enjoy filter coffee and hot crisp medu vada at the iconic spiral Indian Coffee House near the central station."}, {"title": "Catamaran Sailing & Farewell", "morning": "Experience thrilling traditional catamaran sailing with local Kovalam boatmen across coastal swells.", "afternoon": "Shop for hand-woven Balrampuram sarees, rosewood elephant carvings, and aromatic spice packets.", "evening": "Sunset cocktail overlooking the ocean before an effortless 20-minute transfer back to Trivandrum Airport."}], "coords": {"lat": 8.4004, "lon": 76.9787}}, {"id": "athirappilly", "name": "Athirappilly", "where": "Thrissur, Kerala, India", "type": "waterfalls", "season": [5, 6, 7, 8, 9, 10, 11, 0], "seasonText": "Jun to Jan", "nights": 2, "price": 9500, "blurb": "The dramatic \"Niagara of South India\", cascading 80 feet through lush Sholayar rainforest.", "sc": ["waterfalls", ["#CBE8F5", "#E6F5FA", "#FFD166", "#2A6F68", "#1B4D47", "#157F83"]], "reach": {"airport": "Cochin International Airport (COK, ~40 km / 1 hr 15 min - closest hill retreat from airport)", "railway": "Chalakudy Railway Station (CKI, ~31 km) or Angamaly (AFK, ~35 km)", "local": "Private hired taxis from Chalakudy or Kochi, KSRTC buses running to Malakkappara"}, "budget": {"stay": 4200, "food": 2200, "transport": 1800, "activities": 1300}, "tips": ["Monsoon Flow: Peak thundering flow is June to October; winter months (Nov\u2013Jan) offer clear spray and gentle trekking.", "Plastic-Free: Strict zero-plastic zone enforced at the forest gate; reusable bottles tagged with refundable deposit.", "Base Trek: Pathway down to waterfall base is open 8:00 AM to 5:00 PM; wear slip-resistant shoes for wet mossy stone steps.", "Swimming Warning: Swimming near the bottom of the roaring cascade is strictly banned due to fatal undertows."], "days": [{"title": "First Glimpse of the Giant Cascade", "morning": "Fly into Cochin Airport (only 40 km away); drive through rubber plantations and Chalakudy river valleys.", "afternoon": "Enter the forest eco-park; walk along the stone path to the upper ledge of the 80-foot Athirappilly Falls.", "evening": "Listen to the thunderous roar echoing through Sholayar rainforest; watch hornbills return to evening roosts."}, {"title": "Base Trek & Vazhachal Rapids", "morning": "Hike down the designated forest trail to the very base of the waterfall to feel the cool billowing mist spray.", "afternoon": "Drive 5 km upstream to Vazhachal Falls, admiring foaming river rapids and rare medicinal plant gardens.", "evening": "Visit nearby Charpa Falls cascading right alongside the road, sampling hot forest tea and banana chips."}, {"title": "Thumboormuzhy Butterfly Park", "morning": "Visit Thumboormuzhy Dam; walk across the 140-meter pedestrian suspension bridge over the Chalakudy River.", "afternoon": "Walk through the landscaped butterfly garden, observing over 140 species of colourful tropical butterflies.", "evening": "Savor a homely meal of Kerala red rice, fish curry, avial, and spicy mango pickle at a riverside restaurant."}, {"title": "Sholayar Rainforest & Hornbills", "morning": "Guided jungle drive into the rainforests of Malakkappara; keep binoculars ready for Great Indian Hornbills.", "afternoon": "Spot Nilgiri langurs, sambar deer, and elephant herds grazing along the tea estates of the higher ranges.", "evening": "Relax by the river pool with local tribal guides sharing folklore about Western Ghats wilderness."}, {"title": "Ezhattumugham Nature Village", "morning": "Visit Ezhattumugham Prakriti Gramam, stepping on stone boulders across the scenic check dam.", "afternoon": "Take a final peaceful dip in shallow river streams under dense forest canopy shade.", "evening": "Quick 45-minute drive back to Cochin International Airport for your evening departure."}], "coords": {"lat": 10.315, "lon": 76.5683}}, {"id": "kumarakom", "name": "Kumarakom", "where": "Kottayam, Kerala, India", "type": "backwaters", "season": [8, 9, 10, 11, 0, 1, 2], "seasonText": "Sep to Mar", "nights": 2, "price": 16500, "blurb": "Tranquil Vembanad lake waters, migratory bird sanctuary, and luxury heritage waterfront resorts.", "sc": ["backwaters", ["#BDE0FE", "#E0FBFC", "#FFB703", "#1D7874", "#673E1B", "#0081A7"]], "reach": {"airport": "Cochin International Airport (COK, ~75 km / 2 hrs)", "railway": "Kottayam Railway Station (KTYM, ~15 km / 30 mins)", "local": "Traditional wooden canoes (vallam), motorized water taxis, auto-rickshaws, village bicycles"}, "budget": {"stay": 8000, "food": 3700, "transport": 2600, "activities": 2200}, "tips": ["Bird Sanctuary: Best birdwatching hours at Kumarakom Sanctuary are 6:00 AM to 9:00 AM; Nov\u2013Feb brings Siberian migrants.", "Pathiramanal: Reach Pathiramanal Island by motorboat or country craft; lovely 1-hour nature walk amidst rare orchids.", "Canoes vs Houseboats: For intimate encounters with narrow canals and coir makers, hire a rowed wooden canoe.", "Mosquito Protection: Carry herbal mosquito repellent for relaxing on lakeside open-air verandas at dusk."], "days": [{"title": "Lake Vembanad & Sunset Cruise", "morning": "Arrive via Kottayam or Cochin; check into a luxury lakeside resort with heritage villas and private plunge pools.", "afternoon": "Relax on the veranda watching fishermen cast small nets and country craft drift across Lake Vembanad.", "evening": "Embark on a sunset motorboat cruise into the center of the lake; sip fresh tender coconut water as egrets fly past."}, {"title": "Bird Sanctuary & Village Life", "morning": "Dawn walk (6:00 AM) through Kumarakom Bird Sanctuary to spot herons, darters, teal, and kingfishers.", "afternoon": "Take a poled wooden country canoe (vallam) through quiet village canals to watch coir spinning and duck farming.", "evening": "Savour a classic Syrian Christian dinner: Duck Roast, appams, spicy beef fry, and tender coconut souffl\u00e9."}, {"title": "Pathiramanal Island Nature Expedition", "morning": "Motorboat trip across Vembanad to Pathiramanal Island; take a guided walking tour through its untouched jungle trails.", "afternoon": "Visit the Bay Island Driftwood Museum to inspect astonishing root and wood sculptures recovered from sea currents.", "evening": "Watch a traditional flute and tabla performance by the poolside lawn under swaying coconut palms."}, {"title": "Paddy Fields of Kuttanad", "morning": "Rent a cruiser bicycle to pedal along narrow bunds between the vast emerald paddy fields of Kuttanad.", "afternoon": "Meet local farmers and learn how farming is sustained below sea level with age-old biosystem canals.", "evening": "Try a rejuvenating Ayurvedic herbal oil massage to relax your muscles."}, {"title": "Aymanam Village Heritage & Departure", "morning": "Visit picturesque Aymanam village (setting of Arundhati Roy\u2019s The God of Small Things); walk through ancient tharavadu homes.", "afternoon": "Enjoy a farewell lunch of Karimeen wrapped in banana leaf alongside traditional mango pachadi.", "evening": "Transfer to Kottayam railway station (30 min) or Cochin International Airport (2 hrs) for your journey home."}], "coords": {"lat": 9.6175, "lon": 76.4301}}];

// Application state
var DEST = [];
var state = { type: 'all', month: 'any' };
var plan = { id: 'andaman', day: 0, daysCount: 3 };
var mapState = { destId: 'andaman', placeType: 'tourist attractions', isIntersected: false };
var weatherCache = {}; // In-memory cache: { [destId]: { temp, icon, text, code } }
var apiCallCount = 0;

function $(id) { return document.getElementById(id); }
function inr(n) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
function find(id) { return DEST.filter(function (d) { return d.id === id; })[0] || DEST[0]; }

/* ==========================================================================
   API NETWORK LOG HELPER
   ========================================================================== */
function logApiCall(method, url, status, durationMs, note) {
  apiCallCount++;
  var countBadge = $('apiCallCountBadge');
  if (countBadge) countBadge.textContent = apiCallCount + (apiCallCount === 1 ? ' call' : ' calls');

  var list = $('apiLogList');
  if (!list) return;

  var item = document.createElement('div');
  var isError = status >= 400 || status === 'ERR';
  var isCached = status === 'CACHED';

  item.className = 'api-log-item' +
    (method === 'POST' ? ' method-POST' : '') +
    (method === 'EMBED' ? ' method-EMBED' : '') +
    (isError ? ' status-error' : '') +
    (isCached ? ' status-cached' : '');

  var statusBadgeClass = isCached ? 'status-cached-badge' : (status >= 400 ? 'status-4xx' : 'status-2xx');
  var timeStr = new Date().toLocaleTimeString();

  item.innerHTML = 
    '<div class="api-log-top-row">' +
      '<div class="d-flex align-items-center gap-1">' +
        '<span class="api-badge-method ' + method + '">' + method + '</span>' +
        '<span class="api-badge-status ' + statusBadgeClass + '">' + status + '</span>' +
      '</div>' +
      '<span style="color:#6C9490; font-size:10px;">⚡ ' + durationMs + 'ms</span>' +
    '</div>' +
    '<div class="api-log-url" title="' + url + '">' + (url.length > 55 ? url.substring(0, 52) + '...' : url) + '</div>' +
    '<div class="api-log-meta">' +
      '<span>' + (note || '') + '</span>' +
      '<span>' + timeStr + '</span>' +
    '</div>';

  list.insertBefore(item, list.firstChild);
}

// Collapsible API Log Drawer controls
$('apiLogHeader').addEventListener('click', function (e) {
  if (e.target.closest('#clearApiLogBtn')) return;
  var drawer = $('apiLogDrawer');
  drawer.classList.toggle('collapsed');
  var btn = $('toggleApiLogBtn');
  btn.textContent = drawer.classList.contains('collapsed') ? '▲' : '▼';
});

$('clearApiLogBtn').addEventListener('click', function (e) {
  e.stopPropagation();
  $('apiLogList').innerHTML = '<div style="color:#6C9490; padding:4px 0;"><small>Log cleared.</small></div>';
  apiCallCount = 0;
  $('apiCallCountBadge').textContent = '0 calls';
});

/* ==========================================================================
   PROCEDURAL SVG SCENE GENERATOR
   ========================================================================== */
function scene(kind, c) {
  var id = 'g' + (uid++);
  var s = '<svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs>' +
    '<rect width="400" height="240" fill="url(#' + id + ')"/><circle cx="290" cy="90" r="34" fill="' + c[2] + '"/>';
  if (kind === 'beach') {
    s += '<rect y="130" width="400" height="110" fill="' + c[5] + '"/>' +
      '<path d="M0 150 Q100 140 200 150 T400 146" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>' +
      '<path d="M0 172 Q100 150 200 172 T400 165 V240 H0Z" fill="' + c[4] + '"/>' +
      '<path d="M70 240 Q78 195 92 152" stroke="#5a3b22" stroke-width="6" fill="none" stroke-linecap="round"/>' +
      '<g stroke="' + c[3] + '" stroke-width="6" fill="none" stroke-linecap="round">' +
      '<path d="M92 152 Q62 128 34 150"/><path d="M92 152 Q72 118 48 116"/><path d="M92 152 Q98 114 124 110"/><path d="M92 152 Q122 130 148 150"/></g>';
  } else if (kind === 'hills') {
    s += '<path d="M0 150 L70 90 L140 140 L220 70 L310 145 L400 100 V240 H0Z" fill="' + c[3] + '"/>' +
      '<path d="M0 190 Q90 130 180 175 T400 160 V240 H0Z" fill="' + c[4] + '"/>' +
      '<g stroke="#fff" stroke-opacity=".3" stroke-width="2" fill="none"><path d="M0 205 Q100 165 200 195 T400 185"/><path d="M0 220 Q100 185 200 212 T400 204"/></g>';
  } else if (kind === 'culture') {
    s += '<ellipse cx="60" cy="205" rx="72" ry="42" fill="' + c[3] + '"/><ellipse cx="190" cy="220" rx="92" ry="46" fill="' + c[3] + '"/><ellipse cx="335" cy="206" rx="80" ry="40" fill="' + c[3] + '"/>' +
      '<rect x="140" y="122" width="120" height="10" fill="' + c[4] + '"/><rect x="150" y="132" width="100" height="62" fill="' + c[4] + '"/>';
    for (var i = 0; i < 5; i++) s += '<rect x="' + (158 + i * 20) + '" y="136" width="8" height="58" fill="' + c[3] + '"/>';
    s += '<rect y="196" width="400" height="44" fill="' + c[4] + '"/>';
  } else if (kind === 'backwaters') {
    s += '<rect y="125" width="400" height="115" fill="' + c[5] + '"/>' +
      '<path d="M0 135 Q80 120 160 130 T320 125 T400 130 V145 H0Z" fill="' + c[3] + '"/>' +
      '<path d="M115 178 C135 186, 235 186, 265 178 L280 168 C255 169, 125 169, 100 168 Z" fill="' + c[4] + '"/>' +
      '<path d="M125 168 Q185 136 250 168 Z" fill="#6A4526"/>' +
      '<rect x="150" y="152" width="22" height="14" rx="2" fill="' + c[2] + '" opacity="0.9"/>' +
      '<rect x="185" y="152" width="22" height="14" rx="2" fill="' + c[2] + '" opacity="0.9"/>' +
      '<path d="M45 240 Q40 170 18 120" stroke="#4A3319" stroke-width="5" fill="none" stroke-linecap="round"/>' +
      '<g stroke="' + c[3] + '" stroke-width="5" fill="none" stroke-linecap="round">' +
      '<path d="M18 120 Q-10 100 -30 115"/><path d="M18 120 Q-5 85 -20 70"/><path d="M18 120 Q20 85 45 75"/><path d="M18 120 Q45 100 65 115"/></g>' +
      '<g stroke="#fff" stroke-opacity=".4" stroke-width="1.5" fill="none">' +
      '<path d="M100 195 Q180 190 270 195"/><path d="M140 210 Q210 206 290 210"/><path d="M50 225 Q120 220 200 225"/></g>';
  } else if (kind === 'wildlife') {
    s += '<path d="M0 135 Q60 95 140 120 T300 105 T400 125 V240 H0Z" fill="' + c[3] + '"/>' +
      '<path d="M0 165 Q110 145 220 160 T400 152 V240 H0Z" fill="' + c[4] + '"/>' +
      '<rect y="185" width="400" height="55" fill="' + (c[5] || '#176063') + '"/>' +
      '<g fill="' + c[3] + '">' +
      '<ellipse cx="140" cy="155" rx="36" ry="24"/>' +
      '<circle cx="106" cy="148" r="16"/>' +
      '<path d="M96 150 Q85 160 88 174 Q92 178 95 174 Q92 165 100 158" stroke="' + c[3] + '" stroke-width="4" stroke-linecap="round" fill="none"/>' +
      '<path d="M100 158 Q95 166 90 165" stroke="#FFF" stroke-width="2" fill="none"/>' +
      '<rect x="114" y="165" width="8" height="24" rx="3"/>' +
      '<rect x="127" y="165" width="8" height="24" rx="3"/>' +
      '<rect x="152" y="165" width="8" height="24" rx="3"/>' +
      '<rect x="164" y="165" width="8" height="24" rx="3"/>' +
      '<path d="M174 150 Q180 162 178 170" stroke="' + c[3] + '" stroke-width="2" fill="none"/>' +
      '</g>' +
      '<g stroke="#fff" stroke-opacity=".3" stroke-width="1.5" fill="none">' +
      '<path d="M80 200 Q140 196 200 200"/><path d="M100 215 Q150 212 220 215"/></g>';
  } else if (kind === 'waterfalls') {
    s += '<path d="M0 70 L90 90 L120 240 H0 Z" fill="' + c[3] + '"/>' +
      '<path d="M400 60 L300 85 L270 240 H400 Z" fill="' + c[3] + '"/>' +
      '<path d="M80 100 L140 110 L130 240 H60 Z" fill="' + c[4] + '"/>' +
      '<path d="M320 95 L260 105 L265 240 H340 Z" fill="' + c[4] + '"/>' +
      '<path d="M140 100 Q200 95 260 100 L260 210 Q200 215 140 210 Z" fill="#D8F3F1"/>' +
      '<path d="M155 100 L150 210 M175 100 L170 210 M195 98 L195 210 M215 98 L220 210 M235 100 L240 210 M250 100 L255 210" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>' +
      '<rect y="205" width="400" height="35" fill="' + (c[5] || '#157F83') + '"/>' +
      '<ellipse cx="200" cy="210" rx="90" ry="16" fill="#FFFFFF" opacity="0.6"/>' +
      '<ellipse cx="200" cy="214" rx="70" ry="10" fill="#E8F9F8" opacity="0.8"/>' +
      '<g stroke="#fff" stroke-opacity=".4" stroke-width="1.5" fill="none">' +
      '<path d="M70 224 Q200 218 330 224"/><path d="M110 232 Q200 228 290 232"/></g>';
  }
  return s + '</svg>';
}

function fillMonths(el, any) {
  el.innerHTML = (any ? '<option value="any">Any month</option>' : '') +
    MONTHS.map(function (m, i) { return '<option value="' + i + '">' + m + '</option>'; }).join('');
}

// Populate month dropdowns
['hMonth', 'fMonth'].forEach(function (id) { fillMonths($(id), true); });
fillMonths($('eMonth'), true);

function populateDestDropdowns() {
  $('planDest').innerHTML = DEST.map(function (d) { return '<option value="' + d.id + '">' + d.name + '</option>'; }).join('');
  $('mapDestSelect').innerHTML = DEST.map(function (d) { return '<option value="' + d.id + '">' + d.name + '</option>'; }).join('');
  $('eDest').innerHTML = '<option value="">Not sure yet</option>' + DEST.map(function (d) { return '<option value="' + d.id + '">' + d.name + '</option>'; }).join('');
}

// Initial hero art
$('heroArt').innerHTML = scene('beach', ['#9FE3E0','#FDE7C2','#FFB347','#0B7F86','#F4D9A6','#0E9AA0']);

/* ==========================================================================
   TASK 6: GOOGLE MAPS EMBED API (Search Mode & Lazy Loading)
   ========================================================================== */
function buildMapEmbedUrl(query) {
  if (GOOGLE_MAPS_KEY && GOOGLE_MAPS_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
    return 'https://www.google.com/maps/embed/v1/search?key=' + GOOGLE_MAPS_KEY + '&q=' + encodeURIComponent(query);
  } else {
    return 'https://maps.google.com/maps?q=' + encodeURIComponent(query) + '&t=&z=13&ie=UTF8&iwloc=&output=embed';
  }
}

function updateGoogleMap(destId, placeType) {
  if (destId) mapState.destId = destId;
  if (placeType) mapState.placeType = placeType;

  var dest = find(mapState.destId);
  if (!dest) return;

  var query = mapState.placeType + ' in ' + dest.name;

  if ($('mapDestSelect') && $('mapDestSelect').value !== dest.id) {
    $('mapDestSelect').value = dest.id;
  }
  if ($('mapTypeSelect') && $('mapTypeSelect').value !== mapState.placeType) {
    $('mapTypeSelect').value = mapState.placeType;
  }

  $('mapQueryText').textContent = query;

  var gmapsExternalUrl = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(query);
  var extBtn = $('openInGoogleMapsBtn');
  if (extBtn) {
    extBtn.href = gmapsExternalUrl;
    extBtn.setAttribute('title', 'Open "' + query + '" on Google Maps in a new tab');
  }

  if (!mapState.isIntersected) {
    mapState.pendingQuery = query;
    return;
  }

  var iframe = $('googleMapIframe');
  var overlay = $('mapLoadingOverlay');
  if (overlay) overlay.classList.remove('hidden');

  var embedUrl = buildMapEmbedUrl(query);
  var startTime = performance.now();

  iframe.onload = function () {
    var dur = Math.round(performance.now() - startTime);
    if (overlay) overlay.classList.add('hidden');
    logApiCall('EMBED', 'maps.google.com/?q=' + encodeURIComponent(query), 200, dur, 'Google Maps Embed Search');
  };

  iframe.src = embedUrl;
}

// Lazy-load map iframe when map container enters viewport
var mapObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting && !mapState.isIntersected) {
      mapState.isIntersected = true;
      mapObserver.disconnect();
      updateGoogleMap(mapState.destId, mapState.placeType);
    }
  });
}, { rootMargin: '100px' });

mapObserver.observe($('mapFrameContainer'));

// Map section control listeners
$('mapDestSelect').addEventListener('change', function () {
  updateGoogleMap(this.value, null);
});

$('mapTypeSelect').addEventListener('change', function () {
  updateGoogleMap(null, this.value);
});

/* ==========================================================================
   OPTIONAL UPGRADE: Google Maps JavaScript API with Places Autocomplete
   ========================================================================== */
var ENABLE_PLACES_AUTOCOMPLETE = false;

function initMapsAutocompleteUpgrade() {
  if (!ENABLE_PLACES_AUTOCOMPLETE || GOOGLE_MAPS_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
    return;
  }

  var script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + GOOGLE_MAPS_KEY + '&libraries=places&callback=onGoogleMapsSdkLoaded';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

window.onGoogleMapsSdkLoaded = function () {
  console.log('Google Maps JavaScript API SDK ready.');
};

/* ==========================================================================
   OPEN-METEO LIVE WEATHER (GET API, In-Memory Caching)
   ========================================================================== */
function getWeatherMeta(code) {
  if (code === 0) return { icon: '☀️', text: 'Clear' };
  if (code <= 3) return { icon: '🌤️', text: 'Partly Cloudy' };
  if (code <= 48) return { icon: '🌫️', text: 'Misty / Fog' };
  if (code <= 67) return { icon: '🌧️', text: 'Rain' };
  if (code <= 77) return { icon: '❄️', text: 'Flurries' };
  if (code <= 82) return { icon: '🌦️', text: 'Showers' };
  if (code <= 99) return { icon: '⛈️', text: 'Thunderstorm' };
  return { icon: '🌡️', text: 'Fair' };
}

async function fetchWeatherForDest(dest) {
  if (!dest || !dest.coords) return null;
  var key = dest.id;

  if (weatherCache[key]) {
    logApiCall('GET', 'open-meteo.com/v1/forecast?id=' + key, 'CACHED', 0, 'In-Memory Cache Hit');
    return weatherCache[key];
  }

  var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + dest.coords.lat +
            '&longitude=' + dest.coords.lon + '&current_weather=true';

  var startTime = performance.now();
  try {
    var res = await fetch(url);
    var duration = Math.round(performance.now() - startTime);

    if (!res.ok) {
      logApiCall('GET', url, res.status, duration, 'Open-Meteo HTTP Error');
      return null;
    }

    var data = await res.json();
    logApiCall('GET', url, res.status, duration, 'Open-Meteo Live Forecast');

    var cw = data.current_weather;
    var meta = getWeatherMeta(cw.weathercode);
    var weatherResult = {
      temp: Math.round(cw.temperature),
      wind: cw.windspeed,
      icon: meta.icon,
      text: meta.text,
      time: cw.time
    };

    weatherCache[key] = weatherResult;
    return weatherResult;
  } catch (err) {
    var failDuration = Math.round(performance.now() - startTime);
    logApiCall('GET', url, 'ERR', failDuration, 'Network / CORS Error');
    return null;
  }
}

async function updateCardWeather(dest) {
  var badgeEl = $('wb-' + dest.id);
  if (!badgeEl) return;

  var w = await fetchWeatherForDest(dest);
  if (w && badgeEl) {
    badgeEl.innerHTML = '<span class="live-dot"></span><span>' + w.icon + '</span> ' + w.temp + '°C · ' + w.text;
    badgeEl.setAttribute('title', 'Live Open-Meteo weather: ' + w.text + ' (' + w.temp + '°C, Wind: ' + w.wind + ' km/h)');
  } else if (badgeEl) {
    badgeEl.innerHTML = '<span>🌡️</span> Season ' + dest.seasonText;
  }
}

function matches(d) {
  return (state.type === 'all' || d.type === state.type) &&
    (state.month === 'any' || d.season.indexOf(+state.month) !== -1);
}

function renderGrid() {
  var list = DEST.filter(matches);
  $('hType').value = state.type;
  $('hMonth').value = state.month;
  $('fMonth').value = state.month;
  document.querySelectorAll('.chip').forEach(function (b) {
    b.setAttribute('aria-pressed', String(b.dataset.type === state.type));
  });
  var when = state.month === 'any' ? '' : ' in ' + MONTHS[+state.month];
  $('count').textContent = 'Showing ' + list.length + (list.length === 1 ? ' destination' : ' destinations') + when;
  
  if (!list.length) {
    $('grid').innerHTML = '<div class="empty-state"><p>Nothing fits that combination. Try another month or category.</p><button class="btn-custom" id="clear">Clear filters</button></div>';
    $('clear').onclick = function () { state.type = 'all'; state.month = 'any'; renderGrid(); };
    return;
  }
  
  $('grid').innerHTML = list.map(function (d) {
    return '<article class="card-custom">' +
      '<div class="pic">' +
        scene(d.sc[0], d.sc[1]) +
        '<div class="weather-badge" id="wb-' + d.id + '"><span class="spinner-border spinner-border-sm" style="width:10px;height:10px;" role="status"></span> Live weather</div>' +
      '</div>' +
      '<div class="body">' +
        '<div><div class="card-title-row"><h3>' + d.name + '</h3></div><p class="where">📍 ' + d.where + '</p></div>' +
        '<p class="card-blurb">' + d.blurb + '</p>' +
        '<ul class="meta">' +
          '<li>🗓️ ' + d.seasonText + '</li>' +
          '<li>🌙 ' + d.nights + ' nights</li>' +
          '<li>' + d.type.charAt(0).toUpperCase() + d.type.slice(1) + '</li>' +
        '</ul>' +
        '<div class="foot">' +
          '<div class="price">' + inr(d.price) + '<small>sample / person (' + d.nights + 'N)</small></div>' +
          '<div class="card-actions">' +
            '<button class="link-btn" data-plan="' + d.id + '">View plan →</button>' +
            '<button class="quick-enquire" data-enquire="' + d.id + '" title="Pre-fill enquiry">Plan</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</article>';
  }).join('');

  list.forEach(function (d) {
    updateCardWeather(d);
  });
}

function updateDurationButtons() {
  document.querySelectorAll('.duration-btn').forEach(function (btn) {
    btn.setAttribute('aria-pressed', String(+btn.dataset.len === plan.daysCount));
  });
}

async function renderPlan() {
  var d = find(plan.id);
  if (!d) return;
  $('planDest').value = plan.id;
  updateDurationButtons();

  var visibleDays = Math.min(plan.daysCount, d.days.length);
  if (plan.day >= visibleDays) { plan.day = 0; }

  // Day tabs
  $('tabs').innerHTML = '';
  for (var i = 0; i < visibleDays; i++) {
    var b = document.createElement('button');
    b.className = 'tab-custom';
    b.setAttribute('role', 'tab');
    b.setAttribute('data-day', i);
    b.setAttribute('aria-selected', String(i === plan.day));
    b.textContent = 'Day ' + (i + 1);
    $('tabs').appendChild(b);
  }

  var dayObj = d.days[plan.day];

  // Main day panel with time slot styling
  $('panel').innerHTML = 
    '<div class="panel-main">' +
      '<div class="d-flex flex-wrap align-items-center justify-content-between gap-2">' +
        '<div>' +
          '<span class="eyebrow">' + d.name + ' · Day ' + (plan.day + 1) + ' of ' + visibleDays + '</span>' +
          '<h3 style="font-size:25px; margin-block:6px 6px;">' + dayObj.title + '</h3>' +
          '<p style="font-size:13.5px; color:var(--muted); font-weight:600;">Recommended Season: ' + d.seasonText + ' · 📍 ' + d.where + '</p>' +
        '</div>' +
        '<div class="plan-weather-pill" id="planWeatherLivePill">' +
          '<span class="spinner-border spinner-border-sm" role="status"></span> Live weather...' +
        '</div>' +
      '</div>' +
      '<div class="slots-grid">' +
        '<div class="slot morning">' +
          '<span class="slot-tag">🌅 Morning</span>' +
          '<p>' + dayObj.morning + '</p>' +
        '</div>' +
        '<div class="slot afternoon">' +
          '<span class="slot-tag">☀️ Afternoon</span>' +
          '<p>' + dayObj.afternoon + '</p>' +
        '</div>' +
        '<div class="slot evening">' +
          '<span class="slot-tag">🌙 Evening</span>' +
          '<p>' + dayObj.evening + '</p>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="panel-side">' +
      '<div class="art">' + scene(d.sc[0], d.sc[1]) + '</div>' +
      '<button class="btn-custom" style="width:100%;" id="planThisTripBtn">✈️ Plan this trip (Enquire now)</button>' +
    '</div>';

  $('planThisTripBtn').onclick = function () {
    prefillEnquiry(d.id);
  };

  renderRichDetails(d);

  var w = await fetchWeatherForDest(d);
  var pill = $('planWeatherLivePill');
  if (pill && w) {
    pill.innerHTML = '<span>' + w.icon + '</span> <strong>' + w.temp + '°C</strong> (' + w.text + ')';
    pill.setAttribute('title', 'Live weather at ' + d.name + ' via Open-Meteo API');
  } else if (pill) {
    pill.innerHTML = '<span>🌡️</span> Season: ' + d.seasonText;
  }
}

function renderRichDetails(d) {
  var b = d.budget;
  var totalB = b.stay + b.food + b.transport + b.activities;
  var pStay = ((b.stay / totalB) * 100).toFixed(1);
  var pFood = ((b.food / totalB) * 100).toFixed(1);
  var pTrans = ((b.transport / totalB) * 100).toFixed(1);
  var pAct = ((b.activities / totalB) * 100).toFixed(1);

  var html = 
    '<!-- How to reach -->' +
    '<div class="info-card">' +
      '<h4>🧭 How to reach</h4>' +
      '<div class="reach-list">' +
        '<div class="reach-item"><span class="reach-label">✈️ Nearest Airport</span><span>' + d.reach.airport + '</span></div>' +
        '<div class="reach-item"><span class="reach-label">🚆 Nearest Railway</span><span>' + d.reach.railway + '</span></div>' +
        '<div class="reach-item"><span class="reach-label">🚕 Local Transport</span><span>' + d.reach.local + '</span></div>' +
      '</div>' +
    '</div>' +

    '<!-- Budget Breakdown -->' +
    '<div class="info-card">' +
      '<h4>📊 Sample Budget (' + d.nights + ' Nights)</h4>' +
      '<div class="budget-bar" title="Stay ' + pStay + '%, Food ' + pFood + '%, Transport ' + pTrans + '%, Activities ' + pAct + '%">' +
        '<div class="budget-seg seg-stay" style="width:' + pStay + '%"></div>' +
        '<div class="budget-seg seg-food" style="width:' + pFood + '%"></div>' +
        '<div class="budget-seg seg-trans" style="width:' + pTrans + '%"></div>' +
        '<div class="budget-seg seg-act" style="width:' + pAct + '%"></div>' +
      '</div>' +
      '<div class="budget-list">' +
        '<div class="budget-item"><span class="dot seg-stay"></span> Stay: ' + inr(b.stay) + '</div>' +
        '<div class="budget-item"><span class="dot seg-food"></span> Food: ' + inr(b.food) + '</div>' +
        '<div class="budget-item"><span class="dot seg-trans"></span> Transit: ' + inr(b.transport) + '</div>' +
        '<div class="budget-item"><span class="dot seg-act"></span> Activities: ' + inr(b.activities) + '</div>' +
      '</div>' +
      '<div class="budget-total"><span>Total / Person:</span><span>' + inr(totalB) + '</span></div>' +
    '</div>' +

    '<!-- Trip Cost Calculator -->' +
    '<div class="info-card calc-card">' +
      '<h4>🧮 Cost Calculator</h4>' +
      '<div class="calc-fields">' +
        '<div class="field"><label for="calcTravellers">Travellers</label>' +
          '<input type="number" id="calcTravellers" min="1" max="20" value="2">' +
        '</div>' +
        '<div class="field"><label for="calcNights">Nights</label>' +
          '<input type="number" id="calcNights" min="1" max="14" value="' + d.nights + '">' +
        '</div>' +
      '</div>' +
      '<div class="calc-result">' +
        '<span class="calc-note">Estimated Total for Group</span>' +
        '<div class="calc-total" id="calcTotalOutput">₹0</div>' +
        '<span class="calc-note" id="calcPerPersonOutput">₹0 per person</span>' +
      '</div>' +
    '</div>' +

    '<!-- Travel Tips & Warnings -->' +
    '<div class="info-card">' +
      '<h4>⚠️ Travel Tips & Advice</h4>' +
      '<ul class="tips-list">' +
        d.tips.map(function (t) { return '<li>' + t + '</li>'; }).join('') +
      '</ul>' +
    '</div>';

  $('richDetails').innerHTML = html;

  function updateCalculator() {
    var travellers = Math.max(1, parseInt($('calcTravellers').value, 10) || 1);
    var nights = Math.max(1, parseInt($('calcNights').value, 10) || 1);
    var ratePerPersonPerNight = d.price / d.nights;
    var perPersonTotal = Math.round(ratePerPersonPerNight * nights);
    var grandTotal = perPersonTotal * travellers;
    $('calcTotalOutput').textContent = inr(grandTotal);
    $('calcPerPersonOutput').textContent = inr(perPersonTotal) + ' per person (' + nights + ' nights)';
  }

  $('calcTravellers').oninput = updateCalculator;
  $('calcNights').oninput = updateCalculator;
  updateCalculator();
}

function prefillEnquiry(destId) {
  var d = find(destId);
  if (!d) return;
  $('eDest').value = d.id;
  if (state.month !== 'any') {
    $('eMonth').value = state.month;
  } else if (d.season.length > 0) {
    $('eMonth').value = d.season[0];
  }
  $('contact').scrollIntoView({ behavior: 'smooth' });
  $('name').focus();
  var seasonName = MONTHS[$('eMonth').value] || d.seasonText;
  $('status').textContent = 'Selected ' + d.name + ' for ' + seasonName + '. Fill in your details below!';
}

/* ==========================================================================
   LOAD DESTINATIONS VIA FETCH() (async/await, try/catch, Bootstrap spinner & alert)
   ========================================================================== */
async function loadDestinations() {
  var spinner = $('destSpinner');
  var errorAlert = $('destErrorAlert');

  if (spinner) spinner.classList.remove('d-none');
  if (errorAlert) errorAlert.classList.add('d-none');

  var startTime = performance.now();
  var url = 'destinations.json';

  try {
    var res = await fetch(url);
    var duration = Math.round(performance.now() - startTime);

    if (!res.ok) {
      throw new Error('HTTP ' + res.status + ' ' + res.statusText);
    }

    DEST = await res.json();
    logApiCall('GET', url, res.status, duration, 'Loaded ' + DEST.length + ' destinations');

    if (spinner) spinner.classList.add('d-none');

    $('heroCount').textContent = DEST.length;
    $('placesCount').textContent = DEST.length;
    populateDestDropdowns();

    renderGrid();
    renderPlan();
    updateGoogleMap(plan.id, 'tourist attractions');
  } catch (err) {
    var failDuration = Math.round(performance.now() - startTime);
    logApiCall('GET', url, 'ERR', failDuration, err.message || 'Fetch Failed');

    if (spinner) spinner.classList.add('d-none');
    if (errorAlert) {
      errorAlert.classList.remove('d-none');
      errorAlert.classList.add('d-flex');
      $('errorMsgText').textContent = err.message || 'Network / CORS issue';
    }
  }
}

// Retry button listener
$('retryFetchBtn').addEventListener('click', function () {
  loadDestinations();
});

// Fallback button listener
$('fallbackDataBtn').addEventListener('click', function () {
  DEST = EMBEDDED_FALLBACK_DEST;
  logApiCall('GET', 'destinations.json (Fallback)', '200 OK', 0, 'Loaded Offline Backup Data');
  $('destErrorAlert').classList.add('d-none');
  $('heroCount').textContent = DEST.length;
  $('placesCount').textContent = DEST.length;
  populateDestDropdowns();
  renderGrid();
  renderPlan();
  updateGoogleMap(plan.id, 'tourist attractions');
});

/* ==========================================================================
   ENQUIRY FORM SUBMISSION (HTTP POST, JSON body, Content-Type, Toast)
   ========================================================================== */
$('form').addEventListener('submit', async function (e) {
  e.preventDefault();

  var submitBtn = $('submitEnquiryBtn');
  var originalBtnText = submitBtn.innerHTML;
  var statusEl = $('status');

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending...';
  statusEl.textContent = 'Transmitting enquiry payload...';

  var nameVal = $('name').value.trim();
  var emailVal = $('email').value.trim();
  var destIdVal = $('eDest').value;
  var destName = destIdVal ? find(destIdVal).name : 'Unspecified';
  var monthVal = $('eMonth').value;
  var monthName = monthVal !== 'any' && MONTHS[+monthVal] ? MONTHS[+monthVal] : 'Flexible';
  var msgVal = $('msg').value.trim();

  var payload = {
    name: nameVal,
    email: emailVal,
    destination: destName,
    month: monthName,
    notes: msgVal,
    submittedAt: new Date().toISOString()
  };

  var startTime = performance.now();
  var toastEl = $('enquiryToast');
  var toastMsg = $('toastMessage');

  try {
    var res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    var duration = Math.round(performance.now() - startTime);
    logApiCall('POST', FORMSPREE_ENDPOINT, res.status, duration, 'Enquiry Form Dispatch');

    if (res.ok) {
      statusEl.textContent = 'Thanks, ' + nameVal + '! Your enquiry for ' + destName + ' was successfully received.';
      toastEl.classList.remove('text-bg-danger', 'text-bg-warning');
      toastEl.classList.add('text-bg-success');
      toastMsg.innerHTML = '<strong>🎉 Enquiry Sent!</strong> Thank you ' + nameVal + ', your trip request for ' + destName + ' has been dispatched.';
      $('form').reset();
    } else {
      statusEl.textContent = 'Demo Mode: Formspree placeholder endpoint responded with HTTP ' + res.status + '. Payload logged in REST console.';
      toastEl.classList.remove('text-bg-success', 'text-bg-danger');
      toastEl.classList.add('text-bg-warning');
      toastMsg.innerHTML = '<strong>ℹ️ HTTP ' + res.status + ':</strong> Request was transmitted via POST (application/json) to Formspree placeholder. Check REST API Log!';
    }
  } catch (err) {
    var failDuration = Math.round(performance.now() - startTime);
    logApiCall('POST', FORMSPREE_ENDPOINT, 'ERR', failDuration, 'Network error / endpoint unavailable');

    statusEl.textContent = 'Transmission error: ' + (err.message || 'Network failure') + '. Check the REST API Log.';
    toastEl.classList.remove('text-bg-success', 'text-bg-warning');
    toastEl.classList.add('text-bg-danger');
    toastMsg.innerHTML = '<strong>⚠️ Transmission Error:</strong> Could not connect to Formspree endpoint (' + err.message + ').';
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;

    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
      var toast = new bootstrap.Toast(toastEl, { delay: 6000 });
      toast.show();
    }
  }
});

/* ==========================================================================
   USER INTERFACE EVENT LISTENERS
   ========================================================================== */

// Hero Finder Form
$('finder').addEventListener('submit', function (e) {
  e.preventDefault();
  state.type = $('hType').value;
  state.month = $('hMonth').value;
  renderGrid();
  $('places').scrollIntoView({ behavior: 'smooth' });
});

// Month Filter Dropdown
$('fMonth').addEventListener('change', function () {
  state.month = this.value;
  renderGrid();
  var list = DEST.filter(matches);
  if (list.length) updateGoogleMap(list[0].id, null);
});

// Filter Chips
document.querySelectorAll('.chip').forEach(function (b) {
  b.addEventListener('click', function () {
    state.type = b.dataset.type;
    renderGrid();
    var list = DEST.filter(matches);
    if (list.length) updateGoogleMap(list[0].id, null);
  });
});

// Card Grid Click Handling (delegated)
$('grid').addEventListener('click', function (e) {
  var planBtn = e.target.closest('[data-plan]');
  if (planBtn) {
    plan.id = planBtn.dataset.plan;
    plan.day = 0;
    renderPlan();
    updateGoogleMap(plan.id, null);
    $('plan').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  var enqBtn = e.target.closest('[data-enquire]');
  if (enqBtn) {
    prefillEnquiry(enqBtn.dataset.enquire);
    updateGoogleMap(enqBtn.dataset.enquire, null);
  }
});

// Destination dropdown in Planner
$('planDest').addEventListener('change', function () {
  plan.id = this.value;
  plan.day = 0;
  renderPlan();
  updateGoogleMap(plan.id, null);
});

// Trip duration buttons (2, 3, 5 days)
document.querySelectorAll('.duration-btn').forEach(function (btn) {
  btn.addEventListener('click', function () {
    plan.daysCount = +btn.dataset.len;
    plan.day = 0;
    renderPlan();
  });
});

// Day Tab Click
$('tabs').addEventListener('click', function (e) {
  var b = e.target.closest('[data-day]');
  if (!b) return;
  plan.day = +b.dataset.day;
  renderPlan();
});

// Mobile menu toggle
$('menuBtn').addEventListener('click', function () {
  var open = $('links').classList.toggle('open');
  this.setAttribute('aria-expanded', String(open));
});

$('links').addEventListener('click', function (e) {
  if (e.target.tagName === 'A') {
    $('links').classList.remove('open');
    $('menuBtn').setAttribute('aria-expanded', 'false');
  }
});

// Theme toggle
$('themeBtn').addEventListener('click', function () {
  var root = document.documentElement;
  var cur = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  var next = cur === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
});

// Kick off initial asynchronous destination fetch
loadDestinations();

// Optional upgrade initializer (disabled by default)
initMapsAutocompleteUpgrade();
