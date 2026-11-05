/* ================================
   4 NYELVŰ FORDÍTÁSOK
================================ */

const translations = {
    hu: {
        home: "Főoldal",
        apartment1: "Apartman 1",
        apartment2: "Apartman 2",
        ap2_desc: "Modern, jól felszerelt apartman családok számára. Mosogatógépes konyha, klíma, WiFi, gyerekbarát kialakítás. Kis testű kutyát felár ellenében fogadunk.",
        apartment3: "Apartman 3",
        contact: "Kapcsolat",
        programs: "Programok a közelben",

        desc1: "Ez egy csodálatos apartman a tengerparton, bézs és fehér designnal.",
        desc2: "Modern és letisztult, tökéletes családoknak.",
        desc3: "Luxus kivitel, privát terasszal.",
        price: "Ár: 100€/éj",

        // Főoldal bevezető szöveg
        homepage_title: "Tengerparti apartmanok Žaborićban",
        homepage_intro1: "Kényelmes, modern apartmanok Horvátország egyik legszebb tengerparti településén, Šibenik közelében.",
        homepage_intro2: "Gyerekbarát és részben állatbarát szállás, privát parkolással, klímával és ingyenes WiFi-vel, 20 méterre a tengerparttól!",

        // Short description
        short_description: "Fedezd fel a három egyedi apartmanunkat, mindegyik a kényelem és a tengerparti pihenés jegyében tervezve.",

        // Contact page
        contact_email_label: "Email:",
        contact_email: "apartman.hanasplace@gmail.com",
        contact_phone_label: "Telefon:",
        contact_phone: "+36303914439",
        contact_address_label: "Cím:",
        contact_address: "Jasenova ulica 10, 22010 Žaborić, Horvátország",
        directions_button: "Útvonaltervezés",
        name_placeholder: "Név",
        email_placeholder: "Email",
        message_placeholder: "Üzenet",
        contact_send: "Küldés",
        contact_send_not_configured: "Az üzenetküldés nincs konfigurálva.",

        // Apartman 2 részletes információk
        ap2_rooms_title: "Szobák felszereltsége",
        ap2_room_item1: "kényelmes ágyak, ágynemű (heti csere)",
        ap2_room_item2: "klímaberendezés",
        ap2_room_item3: "TV",
        ap2_room_item4: "ingyenes WiFi",

        ap2_kitchen_title: "Konyha felszereltsége",
        ap2_kitchen_item1: "mosogatógép",
        ap2_kitchen_item2: "mikrohullámú sütő",
        ap2_kitchen_item3: "hűtőszekrény fagyasztóval",
        ap2_kitchen_item4: "airfryer",
        ap2_kitchen_item5: "kapszulás kávéfőző (Dolce Gusto)",
        ap2_kitchen_item6: "vízforraló",
        ap2_kitchen_item7: "kenyérpirító",

        ap2_bathroom_title: "Fürdőszoba",
        ap2_bathroom_item1: "zuhany / fürdőkád",
        ap2_bathroom_item2: "hajszárító",
        ap2_bathroom_item3: "törölközők (heti csere)",

        ap2_kidsfriendly_title: "Gyerekbarát felszereltség",
        ap2_kidsfriendly_item1: "kiságy matraccal",
        ap2_kidsfriendly_item2: "etetőszék",
        ap2_kidsfriendly_item3: "székmagasító",
        ap2_kidsfriendly_item4: "fürdőkád",
        ap2_kidsfriendly_item5: "baba fürdetőkád",

        ap2_services_title: "Általános szolgáltatások",
        ap2_services_item1: "1 ingyenes parkolóhely az apartmanhoz",
        ap2_services_item2: "heti törölköző- és ágyneműcsere",
        ap2_services_item3: "végső takarítás külön díj ellenében",

        ap2_pets_title: "Állatbarát információk",
        ap2_pets_text: "Kis testű kutya hozható. Felár: ",
        ap2_pets_price: "20 €/nap",
        ap2_pets_note: ". Kaució fizetése kötelező.",

        ap2_prices_title: "Árak és fizetés",
        ap2_prices_price: "135 €/éj",
        ap2_prices_tax: "Idegenforgalmi adó külön fizetendő távozáskor.",
        ap2_prices_payment: "Fizetés: banki átutalás vagy készpénz.",
        booking_none: "Nincs",
        ap2_prices_cleaning: "takarítás"
        ,
        // Apartment 1 detailed information
        ap1_desc: "Tágas, világos és modern apartman párok és kisebb családok számára. Teljes felszereltséggel és klímával. Gyerekbarát kialakítással. Kis testű kutyát felár ellenében fogadunk.",
        ap1_rooms_title: "Szobák felszereltsége",
        ap1_room_item1: "kényelmes ágyak, ágynemű (heti csere)",
        ap1_room_item2: "klímaberendezés",
        ap1_room_item3: "TV",
        ap1_room_item4: "ingyenes WiFi",
        ap1_kitchen_title: "Konyha felszereltsége",
        ap1_kitchen_item1: "mosogatógép",
        ap1_kitchen_item2: "mikrohullámú sütő",
        ap1_kitchen_item3: "hűtőszekrény fagyasztóval",
        ap1_kitchen_item4: "airfryer",
        ap1_kitchen_item5: "kapszulás kávéfőző (Dolce Gusto)",
        ap1_kitchen_item6: "vízforraló",
        ap1_kitchen_item7: "kenyérpirító",
        ap1_bathroom_title: "Fürdőszoba",
        ap1_bathroom_item1: "zuhany / fürdőkád",
        ap1_bathroom_item2: "hajszárító",
        ap1_bathroom_item3: "törölközők (heti csere)",
        ap1_kidsfriendly_title: "Gyerekbarát felszereltség",
        ap1_kidsfriendly_item1: "kiságy matraccal",
        ap1_kidsfriendly_item2: "etetőszék",
        ap1_kidsfriendly_item3: "székmagasító",
        ap1_kidsfriendly_item4: "fürdőkád",
        ap1_kidsfriendly_item5: "baba fürdetőkád",
        ap1_services_title: "Általános szolgáltatások",
        ap1_services_item1: "1 ingyenes parkolóhely az apartmanhoz",
        ap1_services_item2: "heti törölköző- és ágyneműcsere",
        ap1_services_item3: "végső takarítás külön díj ellenében",
        ap1_pets_title: "Állatbarát információk",
        ap1_pets_text: "Kis testű kutya hozható. Felár: ",
        ap1_pets_price: "20 €/nap",
        ap1_pets_note: ". Kaució fizetése kötelező.",
        ap1_prices_title: "Árak és fizetés",
        ap1_prices_price: "110 €/éj",
        ap1_prices_cleaning: "50 € takarítás",
        months: ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"],
        booking_save_error: "Hiba történt a foglalás mentésekor.",
        booking_email_success: "Foglalás sikeresen elküldve! Hamarosan felvesszük veled a kapcsolatot.",
        booking_email_failure: "A foglalás mentve lett, de az e-mail küldés nem sikerült.",
        booking_success_simple: "Foglalási igény sikeresen elküldve!",
        cookie_banner_text: "Ez az oldal sütiket használ a jobb működés és a felhasználói élmény érdekében.",
        cookie_accept: "Elfogadom",
        cookie_decline: "Elutasítom",
        cookie_learn_more: "Sütik szabályzata",
        accept_terms: "Elolvastam és elfogadom az általános szerződési feltételeket.",
        terms_link_text: "Általános szerződési feltételek letöltése",
        booking_terms_required: "Kérjük, fogadd el az általános szerződési feltételeket a foglaláshoz.",
        ap1_prices_tax: "Idegenforgalmi adó külön fizetendő távozáskor.",
        ap1_prices_payment: "Fizetés: banki átutalás.",

        // Apartment 3 detailed information
        ap3_desc: "Nagy méretű, prémium apartman, mely ideális nagyobb családok vagy baráti társaságok számára. Teljesen felszerelt konyhával és modern berendezéssel. Ez az apartman nem állatbarát.",
        ap3_rooms_title: "Szobák felszereltsége",
        ap3_room_item1: "tágas hálószobák, kényelmes ágyak",
        ap3_room_item2: "ágynemű (heti csere)",
        ap3_room_item3: "klímaberendezés",
        ap3_room_item4: "TV",
        ap3_room_item5: "ingyenes WiFi",
        ap3_kitchen_title: "Konyha felszereltsége",
        ap3_kitchen_item1: "mosogatógép",
        ap3_kitchen_item2: "mikrohullámú sütő",
        ap3_kitchen_item3: "hűtőszekrény fagyasztóval",
        ap3_kitchen_item4: "airfryer",
        ap3_kitchen_item5: "kapszulás kávéfőző (Dolce Gusto)",
        ap3_kitchen_item6: "vízforraló",
        ap3_kitchen_item7: "kenyérpirító",
        ap3_bathroom_title: "Fürdőszoba",
        ap3_bathroom_item1: "fürdőkád / zuhany",
        ap3_bathroom_item2: "hajszárító",
        ap3_bathroom_item3: "törölközők (heti csere)",
        ap3_kidsfriendly_title: "Gyerekbarát felszereltség",
        ap3_kidsfriendly_item1: "kiságy matraccal",
        ap3_kidsfriendly_item2: "etetőszék",
        ap3_kidsfriendly_item3: "székmagasító",
        ap3_kidsfriendly_item4: "fürdőkád",
        ap3_kidsfriendly_item5: "baba fürdetőkád",
        ap3_services_title: "Általános szolgáltatások",
        ap3_services_item1: "1 ingyenes parkolóhely",
        ap3_services_item2: "heti törölköző- és ágyneműcsere",
        ap3_services_item3: "végső takarítás külön díj ellenében",
        ap3_pets_title: "Állatbarát információk",
        ap3_pets_text: "Ez az apartman nem állatbarát.",
        ap3_prices_title: "Árak és fizetés",
        ap3_prices_price: "230 €/éj",
        ap3_prices_tax: "Idegenforgalmi adó külön fizetendő távozáskor.",
        ap3_prices_payment: "Fizetés: banki átutalás."
        ,
        // CTAs on main page
        ap1_cta: "Foglalás",
        ap2_cta: "Foglalás",
        ap3_cta: "Foglalás",

        // Hero banner
        hero_banner_title: "Fedezd fel a dalmát tengerpart szépségeit!",
        hero_banner_sub: "Apartmanjaink közvetlenül a tenger közelében, családbarát környezetben várnak."
    },
    en: {
        home: "Home",
        apartment1: "Apartment 1",
        apartment2: "Apartment 2",
        ap2_desc: "Modern, well-equipped apartment for families. Dishwasher kitchen, air conditioning, WiFi, child-friendly design, and small dog allowed for a fee.",
        apartment3: "Apartment 3",
        contact: "Contact",
        programs: "Activities nearby",

        desc1: "This is a wonderful apartment by the sea, with beige and white design.",
        desc2: "Modern and clean, perfect for families.",
        desc3: "Luxury finish, with private terrace.",
        price: "Price: 100€/night",

        // Home intro
        homepage_title: "Seaside apartments in Žaborić",
        homepage_intro1: "Comfortable, modern apartments in one of Croatia’s most beautiful seaside towns, near Šibenik.",
        homepage_intro2: "Child-friendly and partly pet-friendly accommodation with private parking, air conditioning and free WiFi, just 20 meters from the beach!",

        // Short description
        short_description: "Discover our three unique apartments, each designed for comfort and seaside relaxation.",

        // Contact page
        contact_email_label: "Email:",
        contact_email: "apartman.hanasplace@gmail.com",
        contact_phone_label: "Phone:",
        contact_phone: "+36303914439",
        contact_address_label: "Address:",
        contact_address: "Jasenova ulica 10, 22010 Žaborić, Croatia",
        directions_button: "Get Directions",
        name_placeholder: "Name",
        email_placeholder: "Email",
        message_placeholder: "Message",
        contact_send: "Send",
        contact_send_not_configured: "Message sending is not configured.",

        // Apartment 2 detailed information
        ap2_rooms_title: "Room amenities",
        ap2_room_item1: "comfortable beds, linens (weekly change)",
        ap2_room_item2: "air conditioning",
        ap2_room_item3: "TV",
        ap2_room_item4: "free WiFi",

        ap2_kitchen_title: "Kitchen amenities",
        ap2_kitchen_item1: "dishwasher",
        ap2_kitchen_item2: "microwave",
        ap2_kitchen_item3: "refrigerator with freezer",
        ap2_kitchen_item4: "airfryer",
        ap2_kitchen_item5: "capsule coffee maker (Dolce Gusto)",
        ap2_kitchen_item6: "electric kettle",
        ap2_kitchen_item7: "toaster",

        ap2_bathroom_title: "Bathroom",
        ap2_bathroom_item1: "shower / bathtub",
        ap2_bathroom_item2: "hair dryer",
        ap2_bathroom_item3: "towels (weekly change)",

        ap2_kidsfriendly_title: "Child-friendly amenities",
        ap2_kidsfriendly_item1: "crib with mattress",
        ap2_kidsfriendly_item2: "high chair",
        ap2_kidsfriendly_item3: "seat booster",
        ap2_kidsfriendly_item4: "bathtub",
        ap2_kidsfriendly_item5: "baby bathtub",

        ap2_services_title: "General services",
        ap2_services_item1: "1 free parking space for the apartment",
        ap2_services_item2: "weekly towel and linen change",
        ap2_services_item3: "final cleaning for an additional fee",

        ap2_pets_title: "Pet-friendly information",
        ap2_pets_text: "Small dogs allowed. Additional fee: ",
        ap2_pets_price: "€20/day",
        ap2_pets_note: ". Deposit required.",

        ap2_prices_title: "Prices and payment",
        ap2_prices_price: "€135/night",
        ap2_prices_tax: "Tourist tax payable separately at checkout.",
        ap2_prices_payment: "Payment: bank transfer or cash.",
        booking_none: "None",
        ap2_prices_cleaning: "cleaning"
        ,
        // Apartment 1 detailed information
        ap1_desc: "Spacious, bright and modern apartment for couples and small families, fully equipped with air conditioning. Child-friendly and small dogs allowed.",
        ap1_rooms_title: "Room amenities",
        ap1_room_item1: "comfortable beds, linens (weekly change)",
        ap1_room_item2: "air conditioning",
        ap1_room_item3: "TV",
        ap1_room_item4: "free WiFi",
        ap1_kitchen_title: "Kitchen amenities",
        ap1_kitchen_item1: "dishwasher",
        ap1_kitchen_item2: "microwave",
        ap1_kitchen_item3: "refrigerator with freezer",
        ap1_kitchen_item4: "airfryer",
        ap1_kitchen_item5: "capsule coffee maker (Dolce Gusto)",
        ap1_kitchen_item6: "electric kettle",
        ap1_kitchen_item7: "toaster",
        ap1_bathroom_title: "Bathroom",
        ap1_bathroom_item1: "shower / bathtub",
        ap1_bathroom_item2: "hair dryer",
        ap1_bathroom_item3: "towels (weekly change)",
        ap1_kidsfriendly_title: "Child-friendly amenities",
        ap1_kidsfriendly_item1: "crib with mattress",
        ap1_kidsfriendly_item2: "high chair",
        ap1_kidsfriendly_item3: "seat booster",
        ap1_kidsfriendly_item4: "bathtub",
        ap1_kidsfriendly_item5: "baby bathtub",
        ap1_services_title: "General services",
        ap1_services_item1: "1 free parking space for the apartment",
        ap1_services_item2: "weekly towel and linen change",
        ap1_services_item3: "final cleaning for an additional fee",
        ap1_pets_title: "Pet-friendly information",
        ap1_pets_text: "Small dogs allowed. Additional fee: ",
        ap1_pets_price: "€20/day",
        ap1_pets_note: ". Deposit required.",
        ap1_prices_title: "Prices and payment",
        ap1_prices_price: "€110/night",
        ap1_prices_cleaning: "€50 cleaning",
        months: ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"],
        booking_save_error: "An error occurred while saving the booking.",
        booking_email_success: "Booking sent successfully! We'll contact you shortly.",
        booking_email_failure: "The booking was saved, but sending the email failed.",
        booking_success_simple: "Booking request sent successfully!",
        cookie_banner_text: "This site uses cookies to improve functionality and your experience.",
        cookie_accept: "Accept",
        cookie_decline: "Decline",
        cookie_learn_more: "Cookie Policy",
        accept_terms: "I have read and accept the Terms and Conditions.",
        terms_link_text: "Download Terms and Conditions",
        booking_terms_required: "Please accept the Terms and Conditions to proceed with the booking.",
        ap1_prices_tax: "Tourist tax payable separately at checkout.",
        ap1_prices_payment: "Payment: bank transfer.",

        // Apartment 3 detailed information
        ap3_desc: "Large premium apartment for multiple guests, ideal for bigger families or groups. Fully equipped kitchen and modern furnishings.",
        ap3_rooms_title: "Room amenities",
        ap3_room_item1: "spacious bedrooms, comfortable beds",
        ap3_room_item2: "linens (weekly change)",
        ap3_room_item3: "air conditioning",
        ap3_room_item4: "TV",
        ap3_room_item5: "free WiFi",
        ap3_kitchen_title: "Kitchen amenities",
        ap3_kitchen_item1: "dishwasher",
        ap3_kitchen_item2: "microwave",
        ap3_kitchen_item3: "refrigerator with freezer",
        ap3_kitchen_item4: "airfryer",
        ap3_kitchen_item5: "capsule coffee maker (Dolce Gusto)",
        ap3_kitchen_item6: "electric kettle",
        ap3_kitchen_item7: "toaster",
        ap3_bathroom_title: "Bathroom",
        ap3_bathroom_item1: "bathtub / shower",
        ap3_bathroom_item2: "hair dryer",
        ap3_bathroom_item3: "towels (weekly change)",
        ap3_kidsfriendly_title: "Child-friendly amenities",
        ap3_kidsfriendly_item1: "crib with mattress",
        ap3_kidsfriendly_item2: "high chair",
        ap3_kidsfriendly_item3: "seat booster",
        ap3_kidsfriendly_item4: "bathtub",
        ap3_kidsfriendly_item5: "baby bathtub",
        ap3_services_title: "General services",
        ap3_services_item1: "1 free parking space",
        ap3_services_item2: "weekly towel and linen change",
        ap3_services_item3: "final cleaning for an additional fee",
        ap3_pets_title: "Pet-friendly information",
        ap3_pets_text: "This apartment is not pet-friendly.",
        ap3_prices_title: "Prices and payment",
        ap3_prices_price: "€230/night",
        ap3_prices_tax: "Tourist tax payable separately at checkout.",
        ap3_prices_payment: "Payment: bank transfer."
        ,
        // CTAs on main page
        ap1_cta: "Book",
        ap2_cta: "Book",
        ap3_cta: "Book",

        // Hero banner
        hero_banner_title: "Discover the beauty of the Dalmatian coast!",
        hero_banner_sub: "Our apartments await you near the sea, in a family-friendly environment."
    },
    de: {
        home: "Startseite",
        apartment1: "Apartment 1",
        apartment2: "Apartment 2",
        ap2_desc: "Modernes, gut ausgestattetes Apartment für Familien. Küche mit Geschirrspüler, Klimaanlage, WLAN, kinderfreundliche Ausstattung, kleiner Hund gegen Aufpreis erlaubt.",
        apartment3: "Apartment 3",
        contact: "Kontakt",
        programs: "Ausflugsziele in der Nähe",

        desc1: "Wunderschönes Apartment direkt am Meer mit Beige-Weiß-Design.",
        desc2: "Modern und schlicht, perfekt für Familien.",
        desc3: "Luxuriöse Ausstattung mit privater Terrasse.",
        price: "Preis: 100€/Nacht",

        // Startseite Intro
        homepage_title: "Ferienwohnungen am Meer in Žaborić",
        homepage_intro1: "Komfortable, moderne Apartments in einem der schönsten Küstenorte Kroatiens, in der Nähe von Šibenik.",
        homepage_intro2: "Kinderfreundliche und teilweise haustierfreundliche Unterkunft mit privatem Parkplatz, Klimaanlage und kostenlosem WLAN, nur 20 Meter vom Strand entfernt!",

        // Short description
        short_description: "Entdecke unsere drei einzigartigen Apartments, jedes für Komfort und Meeresentspannung entworfen.",

        // Contact page
        contact_email_label: "E-Mail:",
        contact_email: "apartman.hanasplace@gmail.com",
        contact_phone_label: "Telefon:",
        contact_phone: "+36303914439",
        contact_address_label: "Adresse:",
        contact_address: "Jasenova ulica 10, 22010 Žaborić, Kroatien",
        directions_button: "Route planen",
        name_placeholder: "Name",
        email_placeholder: "E-Mail",
        message_placeholder: "Nachricht",
        contact_send: "Senden",
        contact_send_not_configured: "Nachrichtenversand ist nicht konfiguriert.",

        // Apartment 2 detailed information
        ap2_rooms_title: "Zimmerausstattung",
        ap2_room_item1: "komfortable Betten, Bettwäsche (wöchentlicher Wechsel)",
        ap2_room_item2: "Klimaanlage",
        ap2_room_item3: "TV",
        ap2_room_item4: "kostenfreies WiFi",

        ap2_kitchen_title: "Küchenausstattung",
        ap2_kitchen_item1: "Geschirrspüler",
        ap2_kitchen_item2: "Mikrowelle",
        ap2_kitchen_item3: "Kühlschrank mit Gefrierfach",
        ap2_kitchen_item4: "Airfryer",
        ap2_kitchen_item5: "Kapsel-Kaffeemaschine (Dolce Gusto)",
        ap2_kitchen_item6: "Wasserkocher",
        ap2_kitchen_item7: "Toaster",

        ap2_bathroom_title: "Badezimmer",
        ap2_bathroom_item1: "Dusche / Badewanne",
        ap2_bathroom_item2: "Haartrockner",
        ap2_bathroom_item3: "Handtücher (wöchentlicher Wechsel)",

        ap2_kidsfriendly_title: "Kinderfreundliche Ausstattung",
        ap2_kidsfriendly_item1: "Babybett mit Matratze",
        ap2_kidsfriendly_item2: "Hochstuhl",
        ap2_kidsfriendly_item3: "Sitzerhöher",
        ap2_kidsfriendly_item4: "Badewanne",
        ap2_kidsfriendly_item5: "Baby-Badewanne",

        ap2_services_title: "Allgemeine Leistungen",
        ap2_services_item1: "1 kostenloser Parkplatz für das Apartment",
        ap2_services_item2: "wöchentlicher Handtuch- und Bettwäschewechsel",
        ap2_services_item3: "Endreinigung gegen Gebühr",

        ap2_pets_title: "Haustierfreundliche Informationen",
        ap2_pets_text: "Kleine Hunde erlaubt. Zusatzgebühr: ",
        ap2_pets_price: "€20/Tag",
        ap2_pets_note: ". Kaution erforderlich.",

        ap2_prices_title: "Preise und Zahlung",
        ap2_prices_price: "€135/Nacht",
        ap2_prices_tax: "Kurtaxe wird separat bei der Abreise bezahlt.",
        ap2_prices_payment: "Zahlung: Banküberweisung oder Bargeld.",
        booking_none: "Keine",
        ap2_prices_cleaning: "Reinigung"
        ,
        // Apartment 1 detailed information
        ap1_desc: "Geräumiges, helles und modernes Apartment für Paare und kleine Familien, komplett ausgestattet mit Klimaanlage. Kinderfreundlich, kleine Hunde erlaubt.",
        ap1_rooms_title: "Zimmerausstattung",
        ap1_room_item1: "komfortable Betten, Bettwäsche (wöchentlicher Wechsel)",
        ap1_room_item2: "Klimaanlage",
        ap1_room_item3: "TV",
        ap1_room_item4: "kostenfreies WiFi",
        ap1_kitchen_title: "Küchenausstattung",
        ap1_kitchen_item1: "Geschirrspüler",
        ap1_kitchen_item2: "Mikrowelle",
        ap1_kitchen_item3: "Kühlschrank mit Gefrierfach",
        ap1_kitchen_item4: "Airfryer",
        ap1_kitchen_item5: "Kapsel-Kaffeemaschine (Dolce Gusto)",
        ap1_kitchen_item6: "Wasserkocher",
        ap1_kitchen_item7: "Toaster",
        ap1_bathroom_title: "Badezimmer",
        ap1_bathroom_item1: "Dusche / Badewanne",
        ap1_bathroom_item2: "Haartrockner",
        ap1_bathroom_item3: "Handtücher (wöchentlicher Wechsel)",
        ap1_kidsfriendly_title: "Kinderfreundliche Ausstattung",
        ap1_kidsfriendly_item1: "Babybett mit Matratze",
        ap1_kidsfriendly_item2: "Hochstuhl",
        ap1_kidsfriendly_item3: "Sitzerhöher",
        ap1_kidsfriendly_item4: "Badewanne",
        ap1_kidsfriendly_item5: "Baby-Badewanne",
        ap1_services_title: "Allgemeine Leistungen",
        ap1_services_item1: "1 kostenloser Parkplatz für das Apartment",
        ap1_services_item2: "wöchentlicher Handtuch- und Bettwäschewechsel",
        ap1_services_item3: "Endreinigung gegen Gebühr",
        ap1_pets_title: "Haustierfreundliche Informationen",
        ap1_pets_text: "Kleine Hunde erlaubt. Zusatzgebühr: ",
        ap1_pets_price: "€20/Tag",
        ap1_pets_note: ". Kaution erforderlich.",
        ap1_prices_title: "Preise und Zahlung",
        ap1_prices_price: "€110/Nacht",
        ap1_prices_cleaning: "€50 Reinigung",
        months: ["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"],
        booking_save_error: "Beim Speichern der Buchung ist ein Fehler aufgetreten.",
        booking_email_success: "Buchung erfolgreich gesendet! Wir kontaktieren Sie in Kürze.",
        booking_email_failure: "Die Buchung wurde gespeichert, aber das E-Mail-Versenden ist fehlgeschlagen.",
        booking_success_simple: "Buchungsanfrage erfolgreich versendet!",
        cookie_banner_text: "Diese Website verwendet Cookies, um die Funktionalität und Ihr Erlebnis zu verbessern.",
        cookie_accept: "Akzeptieren",
        cookie_decline: "Ablehnen",
        cookie_learn_more: "Cookie-Richtlinie",
        accept_terms: "Ich habe die Allgemeinen Geschäftsbedingungen gelesen und akzeptiere sie.",
        terms_link_text: "AGB herunterladen",
        booking_terms_required: "Bitte akzeptieren Sie die Allgemeinen Geschäftsbedingungen, um mit der Buchung fortzufahren.",
        ap1_prices_tax: "Kurtaxe wird separat bei der Abreise bezahlt.",
        ap1_prices_payment: "Zahlung: Banküberweisung.",

        // Apartment 3 detailed information
        ap3_desc: "Großes Premium-Apartment für mehrere Personen, ideal für größere Familien oder Freundesgruppen. Voll ausgestattete Küche und moderne Einrichtung.",
        ap3_rooms_title: "Zimmerausstattung",
        ap3_room_item1: "geräumige Schlafzimmer, komfortable Betten",
        ap3_room_item2: "Bettwäsche (wöchentlicher Wechsel)",
        ap3_room_item3: "Klimaanlage",
        ap3_room_item4: "TV",
        ap3_room_item5: "kostenfreies WiFi",
        ap3_kitchen_title: "Küchenausstattung",
        ap3_kitchen_item1: "Geschirrspüler",
        ap3_kitchen_item2: "Mikrowelle",
        ap3_kitchen_item3: "Kühlschrank mit Gefrierfach",
        ap3_kitchen_item4: "Airfryer",
        ap3_kitchen_item5: "Kapsel-Kaffeemaschine (Dolce Gusto)",
        ap3_kitchen_item6: "Wasserkocher",
        ap3_kitchen_item7: "Toaster",
        ap3_bathroom_title: "Badezimmer",
        ap3_bathroom_item1: "Badewanne / Dusche",
        ap3_bathroom_item2: "Haartrockner",
        ap3_bathroom_item3: "Handtücher (wöchentlicher Wechsel)",
        ap3_kidsfriendly_title: "Kinderfreundliche Ausstattung",
        ap3_kidsfriendly_item1: "Babybett mit Matratze",
        ap3_kidsfriendly_item2: "Hochstuhl",
        ap3_kidsfriendly_item3: "Sitzerhöher",
        ap3_kidsfriendly_item4: "Badewanne",
        ap3_kidsfriendly_item5: "Baby-Badewanne",
        ap3_services_title: "Allgemeine Leistungen",
        ap3_services_item1: "1 kostenloser Parkplatz",
        ap3_services_item2: "wöchentlicher Handtuch- und Bettwäschewechsel",
        ap3_services_item3: "Endreinigung gegen Gebühr",
        ap3_pets_title: "Haustierfreundliche Informationen",
        ap3_pets_text: "Dieses Apartment ist nicht haustierfreundlich.",
        ap3_prices_title: "Preise und Zahlung",
        ap3_prices_price: "€230/Nacht",
        ap3_prices_tax: "Kurtaxe wird separat bei der Abreise bezahlt.",
        ap3_prices_payment: "Zahlung: Banküberweisung."
        ,
        // CTAs on main page
        ap1_cta: "Buchen",
        ap2_cta: "Buchen",
        ap3_cta: "Buchen",

        // Hero banner
        hero_banner_title: "Entdecke die Schönheit der dalmatinischen Küste!",
        hero_banner_sub: "Unsere Apartments erwarten Sie in unmittelbarer Meeresnähe, familienfreundlich."
    },
    hr: {
        home: "Početna",
        apartment1: "Apartman 1",
        apartment2: "Apartman 2",
        ap2_desc: "Moderan, dobro opremljen apartman za obitelji. Kuhinja s perilicom posuđa, klima, WiFi, dječja oprema, mali pas uz nadoplatu.",
        apartment3: "Apartman 3",
        contact: "Kontakt",
        programs: "Aktivnosti u blizini",

        desc1: "Prekrasan apartman uz more, u bež és bijeloj kombinaciji.",
        desc2: "Moderan i jednostavan, savršen za obitelji.",
        desc3: "Luksuzna izvedba s privatnom terasom.",
        price: "Cijena: 100 €/noć",

        // Početna uvod
        homepage_title: "Apartmani uz more u Žaboriću",
        homepage_intro1: "Udobni, moderni apartmani u jednom od najljepših obalnih mjesta u Hrvatskoj, blizu Šibenika.",
        homepage_intro2: "Smještaj prilagođen djeci i djelomično kućnim ljubimcima, s privatnim parkingom, klimom i besplatnim WiFi-jem, samo 20 metara od plaže!",

        // Short description
        short_description: "Otkrijte naša tri jedinstvena apartmana, svaki dizajniran za udobnost i opuštanje uz more.",

        // Contact page
        contact_email_label: "E-mail:",
        contact_email: "apartman.hanasplace@gmail.com",
        contact_phone_label: "Telefon:",
        contact_phone: "+36303914439",
        contact_address_label: "Adresa:",
        contact_address: "Jasenova ulica 10, 22010 Žaborić, Hrvatska",
        directions_button: "Planiraj rutu",
        name_placeholder: "Ime",
        email_placeholder: "E-mail",
        message_placeholder: "Poruka",
        contact_send: "Pošalji",
            contact_send_not_configured: "Slanje poruka nije konfigurirano.",

        // Apartment 2 detailed information
        ap2_rooms_title: "Oprema soba",
        ap2_room_item1: "udobni kreveti, posteljina (tjedna izmjena)",
        ap2_room_item2: "klimatizacija",
        ap2_room_item3: "TV",
        ap2_room_item4: "besplatan WiFi",

        ap2_kitchen_title: "Oprema kuhinje",
        ap2_kitchen_item1: "perilica posuđa",
        ap2_kitchen_item2: "mikrovalna pećnica",
        ap2_kitchen_item3: "hladnjak sa zamrzivačem",
        ap2_kitchen_item4: "airfryer",
        ap2_kitchen_item5: "kapsulni aparat za kavu (Dolce Gusto)",
        ap2_kitchen_item6: "električni kuhač vode",
        ap2_kitchen_item7: "toster",

        ap2_bathroom_title: "Kupaonica",
        ap2_bathroom_item1: "tuš / kada",
        ap2_bathroom_item2: "sušilo za kosu",
        ap2_bathroom_item3: "peškiri (tjedna izmjena)",

        ap2_kidsfriendly_title: "Oprema prihvatljiva za djecu",
        ap2_kidsfriendly_item1: "dječji krevetić s madracem",
        ap2_kidsfriendly_item2: "stolica za hranjenje",
        ap2_kidsfriendly_item3: "povišena sjedalica",
        ap2_kidsfriendly_item4: "kad",
        ap2_kidsfriendly_item5: "dječja kada",

        ap2_services_title: "Opće usluge",
        ap2_services_item1: "1 slobodno parking mjesto uz apartman",
        ap2_services_item2: "tjedna izmjena peškira i posteljine",
        ap2_services_item3: "završna čišćenja uz dodatnu naknadu",

        ap2_pets_title: "Informacije prihvatljive za kućne ljubimce",
        ap2_pets_text: "Mali psi su dozvoljeni. Dodatna naknada: ",
        ap2_pets_price: "€20/dan",
        ap2_pets_note: ". Depozit obavezan.",

        ap2_prices_title: "Cijene i plaćanje",
        ap2_prices_price: "€135/noć",
        ap2_prices_tax: "Usluga turizma plaća se odvojeno pri odlasku.",
        ap2_prices_payment: "Plaćanje: bankovni transfer ili gotovina.",
        // Apartment 1 detailed information
        ap1_desc: "Prostran, svijetao i moderan apartman za parove i manje obitelji, potpuno opremljen s klima-uređajem. Prikladan za djecu, dozvoljeni mali psi.",
        ap1_rooms_title: "Oprema soba",
        ap1_room_item1: "udobni kreveti, posteljina (tjedna izmjena)",
        ap1_room_item2: "klimatizacija",
        ap1_room_item3: "TV",
        ap1_room_item4: "besplatan WiFi",
        ap1_kitchen_title: "Oprema kuhinje",
        ap1_kitchen_item1: "perilica posuđa",
        ap1_kitchen_item2: "mikrovalna pećnica",
        ap1_kitchen_item3: "hladnjak sa zamrzivačem",
        ap1_kitchen_item4: "airfryer",
        ap1_kitchen_item5: "kapsulni aparat za kavu (Dolce Gusto)",
        ap1_kitchen_item6: "kuhalo za vodu",
        ap1_kitchen_item7: "toster",
        ap1_bathroom_title: "Kupaonica",
        ap1_bathroom_item1: "tuš / kada",
        ap1_bathroom_item2: "sušilo za kosu",
        ap1_bathroom_item3: "peškiri (tjedna izmjena)",
        ap1_kidsfriendly_title: "Oprema prihvatljiva za djecu",
        ap1_kidsfriendly_item1: "dječji krevetić s madracem",
        ap1_kidsfriendly_item2: "stolica za hranjenje",
        ap1_kidsfriendly_item3: "povišena sjedalica",
        ap1_kidsfriendly_item4: "kada",
        ap1_kidsfriendly_item5: "dječja kada",
        ap1_services_title: "Opće usluge",
        ap1_services_item1: "1 slobodno parking mjesto uz apartman",
        ap1_services_item2: "tjedna izmjena peškira i posteljine",
        ap1_services_item3: "završna čišćenja uz dodatnu naknadu",
        ap1_pets_title: "Informacije prihvatljive za kućne ljubimce",
        ap1_pets_text: "Mali psi su dozvoljeni. Dodatna naknada: ",
        ap1_pets_price: "€20/dan",
        ap1_pets_note: ". Depozit obavezan.",
        ap1_prices_title: "Cijene i plaćanje",
        ap1_prices_price: "€110/noć",
        ap1_prices_cleaning: "€50 čišćenje",
        months: ["Siječanj","Veljača","Ožujak","Travanj","Svibanj","Lipanj","Srpanj","Kolovoz","Rujan","Listopad","Studeni","Prosinac"],
        booking_save_error: "Pogreška pri spremanju rezervacije.",
        booking_email_success: "Rezervacija je uspješno poslana! Kontaktirat ćemo vas uskoro.",
        booking_email_failure: "Rezervacija je spremljena, ali slanje e-pošte nije uspjelo.",
        booking_success_simple: "Zahtjev za rezervaciju uspješno poslan!",
        cookie_banner_text: "Ova stranica koristi kolačiće kako bi poboljšala funkcionalnost i vaše iskustvo.",
        cookie_accept: "Prihvati",
        cookie_decline: "Odbij",
        cookie_learn_more: "Pravila o kolačićima",
        accept_terms: "Pročitao sam i prihvaćam Opće uvjete.",
        terms_link_text: "Preuzmi Opće uvjete",
        booking_terms_required: "Molimo prihvatite Opće uvjete da biste nastavili s rezervacijom.",
        ap1_prices_tax: "Usluga turizma plaća se odvojeno pri odlasku.",
        ap1_prices_payment: "Plaćanje: bankovni transfer.",

        // Apartment 3 detailed information
        ap3_desc: "Veliki premium apartman za više osoba, idealan za veće obitelji ili grupe prijatelja. Potpuno opremljena kuhinja i moderna oprema.",
        ap3_rooms_title: "Oprema soba",
        ap3_room_item1: "prostrane spavaće sobe, udobni kreveti",
        ap3_room_item2: "posteljina (tjedna izmjena)",
        ap3_room_item3: "klimatizacija",
        ap3_room_item4: "TV",
        ap3_room_item5: "besplatan WiFi",
        ap3_kitchen_title: "Oprema kuhinje",
        ap3_kitchen_item1: "perilica posuđa",
        ap3_kitchen_item2: "mikrovalna pećnica",
        ap3_kitchen_item3: "hladnjak sa zamrzivačem",
        ap3_kitchen_item4: "airfryer",
        ap3_kitchen_item5: "kapsulni aparat za kavu (Dolce Gusto)",
        ap3_kitchen_item6: "kuhalo za vodu",
        ap3_kitchen_item7: "toster",
        ap3_bathroom_title: "Kupaonica",
        ap3_bathroom_item1: "kada / tuš",
        ap3_bathroom_item2: "sušilo za kosu",
        ap3_bathroom_item3: "peškiri (tjedna izmjena)",
        ap3_kidsfriendly_title: "Oprema prihvatljiva za djecu",
        ap3_kidsfriendly_item1: "dječji krevetić s madracem",
        ap3_kidsfriendly_item2: "stolica za hranjenje",
        ap3_kidsfriendly_item3: "povišena sjedalica",
        ap3_kidsfriendly_item4: "kada",
        ap3_kidsfriendly_item5: "dječja kada",
        ap3_services_title: "Opće usluge",
        ap3_services_item1: "1 slobodno parking mjesto",
        ap3_services_item2: "tjedna izmjena peškira i posteljine",
        ap3_services_item3: "završna čišćenja uz dodatnu naknadu",
        ap3_pets_title: "Informacije prihvatljive za kućne ljubimce",
        ap3_pets_text: "Ovaj apartman nije prihvatljiv za kućne ljubimce.",
        ap3_prices_title: "Cijene i plaćanje",
        ap3_prices_price: "€230/noć",
        ap3_prices_tax: "Usluga turizma plaća se odvojeno pri odlasku.",
        ap3_prices_payment: "Plaćanje: bankovni transfer."
        ,
        // CTAs on main page
        ap1_cta: "Rezerviraj",
        ap2_cta: "Rezerviraj",
        ap3_cta: "Rezerviraj",

        // Hero banner
        hero_banner_title: "Otkrijte ljepote dalmatinske obale!",
        hero_banner_sub: "Naši apartmani čekaju vas u blizini mora, u okruženju prilagođenom obiteljima."
    }
};





/* ================================
   NYELVVÁLTÓ KEZELÉS
================================ */

let currentLang = localStorage.getItem("lang") || "hu";

function updateLanguage(lang) {
    document.querySelectorAll("[data-lang]").forEach(el => {
        const key = el.dataset.lang;
        const val = translations[lang] && translations[lang][key];
        const fallback = translations['hu'] && translations['hu'][key];
        const text = (val !== undefined && val !== null) ? val : fallback;
        if (text !== undefined && text !== null) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        }
    });

    document.querySelectorAll(".lang-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.langCode === lang);
    });

    // Update T&C download links to point to the correct language file
    document.querySelectorAll('.terms-download').forEach(a => {
        if (a.tagName === 'A') {
            a.href = `terms_${lang}.html`;
            a.target = '_blank';
            a.rel = 'noopener';
            a.setAttribute('download', '');
        }
    });

    // If translations contain localized month names, update global monthNames
    if (translations[lang] && Array.isArray(translations[lang].months)) {
        try {
            monthNames = translations[lang].months;
        } catch (e) {
            // ignore if monthNames isn't defined on this page
        }
    }

    // Re-render any calendar / UI elements if page defines an update function
    if (typeof updateUI === 'function') {
        try { updateUI(); } catch (e) { /* ignore errors */ }
    }

    localStorage.setItem("lang", lang);
}

document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        updateLanguage(btn.dataset.langCode);
    });
});


/* ================================
   HAMBURGER MENÜ
================================ */

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            navLinks.classList.toggle("active");
            hamburger.classList.toggle("active");
        });
    }
});


/* ================================
   KARUSSZEL FŐOLDALON
================================ */

function initCarousel() {
    const slides = document.querySelectorAll(".carousel img");
    if (slides.length === 0) return;

    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove("active"));
        slides[index].classList.add("active");
    }

    showSlide(0);

    // setInterval(() => {  // Removed carousel auto-slide
    //     currentSlide = (currentSlide + 1) % slides.length;
    //     showSlide(currentSlide);
    // }, 5000);
}


/* ================================
   SCROLL ANIMÁCIÓ
================================ */

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(".scroll-animate");

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                }
            });
        },
        { threshold: 0.2 }
    );

    animatedElements.forEach(el => observer.observe(el));
}


/* ================================
   EMAILJS ÜZENETKÜLDÉS
   (Csak töltsd ki a service / template ID-ket)
================================ */

document.addEventListener("DOMContentLoaded", () => {

    // EmailJS init → only if library loaded
    if (window.emailjs && typeof emailjs.init === 'function') {
        emailjs.init("kXABwQ3d9wnMq4Zbd");
    } else {
        console.warn('EmailJS not loaded — contact form will use fallback behaviour.');
    }

    const contactForm = document.getElementById("contactForm");
    const bookingForm = document.getElementById("bookingForm");

    if (contactForm) {
        contactForm.addEventListener("submit", e => {
            e.preventDefault();
            if (window.emailjs && typeof emailjs.sendForm === 'function') {
                emailjs.sendForm("service_58mwnzb", "template_h6ucz2p", contactForm)
                    .then(() => {
                        alert(translations[currentLang]?.contact_sent_success || 'Message sent!');
                        contactForm.reset();
                    })
                    .catch(() => alert(translations[currentLang]?.contact_send_error || 'An error occurred while sending the message.'));
            } else {
                alert(translations[currentLang]?.contact_send_not_configured || 'Message sending is not configured.');
                contactForm.reset();
            }
        });
    }

    // Booking form is handled on the specific apartment pages (saves to JSONBin
    // and sends emails there when configured). Do not override that behavior here.
});


/* ================================
   OLDAL INDÍTÁSA
================================ */

document.addEventListener("DOMContentLoaded", () => {
    updateLanguage(currentLang);
    // initScrollAnimations(); // Removed scroll animations
    initCarousel();
    initCookieBanner();
});

// COOKIE BANNER
function initCookieBanner() {
    try {
        const consent = localStorage.getItem('cookie_consent');
        if (consent) return; // already decided

        const lang = currentLang || 'hu';
        const t = translations[lang] || translations['hu'];

        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.style.position = 'fixed';
        banner.style.left = '1rem';
        banner.style.right = '1rem';
        banner.style.bottom = '1rem';
        banner.style.background = 'rgba(0,0,0,0.85)';
        banner.style.color = 'white';
        banner.style.padding = '1rem';
        banner.style.borderRadius = '8px';
        banner.style.zIndex = 99999;
        banner.style.display = 'flex';
        banner.style.flexWrap = 'wrap';
        banner.style.gap = '0.6rem';
        banner.style.alignItems = 'center';

        const text = document.createElement('div');
        text.style.flex = '1 1 400px';
        text.textContent = t.cookie_banner_text || 'This site uses cookies.';

        const actions = document.createElement('div');
        actions.style.display = 'flex';
        actions.style.gap = '0.5rem';

        const learn = document.createElement('a');
        learn.href = `cookie_policy_${lang}.html`;
        learn.target = '_blank';
        learn.rel = 'noopener';
        learn.textContent = t.cookie_learn_more || 'Cookie Policy';
        learn.style.color = '#fff';
        learn.style.textDecoration = 'underline';

        const btnAccept = document.createElement('button');
        btnAccept.textContent = t.cookie_accept || 'Accept';
        btnAccept.style.background = '#2b8a3e';
        btnAccept.style.color = '#fff';
        btnAccept.style.border = 'none';
        btnAccept.style.padding = '0.5rem 0.8rem';
        btnAccept.style.borderRadius = '6px';
        btnAccept.style.cursor = 'pointer';

        const btnDecline = document.createElement('button');
        btnDecline.textContent = t.cookie_decline || 'Decline';
        btnDecline.style.background = '#6b6b6b';
        btnDecline.style.color = '#fff';
        btnDecline.style.border = 'none';
        btnDecline.style.padding = '0.5rem 0.8rem';
        btnDecline.style.borderRadius = '6px';
        btnDecline.style.cursor = 'pointer';

        btnAccept.onclick = () => {
            localStorage.setItem('cookie_consent', 'accepted');
            // Place to initialize analytics if needed
            banner.remove();
        };

        btnDecline.onclick = () => {
            localStorage.setItem('cookie_consent', 'declined');
            // If any optional cookies/tracking are present, disable them here
            banner.remove();
        };

        actions.appendChild(learn);
        actions.appendChild(btnDecline);
        actions.appendChild(btnAccept);

        banner.appendChild(text);
        banner.appendChild(actions);
        document.body.appendChild(banner);
    } catch (err) {
        console.warn('Cookie banner init error', err);
    }
}
