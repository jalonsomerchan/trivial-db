import fs from 'node:fs/promises';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const today = '2026-06-24';
const questionsDir = path.join(process.cwd(), 'questions');

const items = [
  [11, 'geografia', ['capitales'], 'easy', '¿Cuál es la capital de Canadá?', 'Ottawa', ['Toronto', 'Montreal', 'Vancouver'], 'La capital de Canadá es Ottawa.', 'Government of Canada - Ottawa', 'https://www.canada.ca/en/canadian-heritage/services/capital-canada.html', ['canada', 'capitales', 'america-del-norte']],
  [12, 'geografia', ['rios'], 'medium', '¿Qué río atraviesa la ciudad de Londres?', 'Támesis', ['Sena', 'Danubio', 'Rin'], 'El río Támesis atraviesa Londres.', 'Encyclopaedia Britannica - River Thames', 'https://www.britannica.com/place/River-Thames', ['londres', 'rios', 'reino-unido']],
  [13, 'historia', ['edad-antigua'], 'easy', '¿Qué civilización construyó las pirámides de Guiza?', 'Egipcia', ['Romana', 'Maya', 'Persa'], 'Las pirámides de Guiza fueron construidas por la civilización egipcia antigua.', 'UNESCO - Memphis and its Necropolis', 'https://whc.unesco.org/en/list/86/', ['egipto', 'piramides', 'edad-antigua']],
  [14, 'historia', ['siglo-xv'], 'easy', '¿En qué año llegó Cristóbal Colón a América por primera vez?', '1492', ['1485', '1502', '1519'], 'El primer viaje de Colón llegó a América en 1492.', 'Encyclopaedia Britannica - Christopher Columbus', 'https://www.britannica.com/biography/Christopher-Columbus', ['colon', 'america', '1492']],
  [15, 'ciencia', ['fisica'], 'easy', '¿Qué fuerza mantiene a los planetas orbitando alrededor del Sol?', 'La gravedad', ['El magnetismo', 'La fricción', 'La electricidad estática'], 'La gravedad es la fuerza que mantiene a los planetas en órbita alrededor del Sol.', 'NASA Space Place - What is gravity?', 'https://spaceplace.nasa.gov/what-is-gravity/en/', ['gravedad', 'fisica', 'sistema-solar']],
  [16, 'ciencia', ['biologia'], 'easy', '¿Qué gas absorben principalmente las plantas durante la fotosíntesis?', 'Dióxido de carbono', ['Oxígeno', 'Nitrógeno', 'Helio'], 'Durante la fotosíntesis, las plantas absorben dióxido de carbono y liberan oxígeno.', 'Encyclopaedia Britannica - Photosynthesis', 'https://www.britannica.com/science/photosynthesis', ['fotosintesis', 'plantas', 'biologia']],
  [17, 'literatura', ['literatura-inglesa'], 'easy', '¿Quién escribió Romeo y Julieta?', 'William Shakespeare', ['Charles Dickens', 'Jane Austen', 'Oscar Wilde'], 'Romeo y Julieta es una tragedia escrita por William Shakespeare.', 'Royal Shakespeare Company - Romeo and Juliet', 'https://www.rsc.org.uk/romeo-and-juliet/', ['shakespeare', 'romeo-y-julieta', 'teatro']],
  [18, 'arte', ['pintura', 'renacimiento'], 'easy', '¿Quién pintó La Gioconda o Mona Lisa?', 'Leonardo da Vinci', ['Miguel Ángel', 'Rafael', 'Sandro Botticelli'], 'La Mona Lisa fue pintada por Leonardo da Vinci.', 'Musée du Louvre - Mona Lisa', 'https://www.louvre.fr/en/explore/the-palace/mona-lisa', ['leonardo-da-vinci', 'mona-lisa', 'renacimiento']],
  [19, 'deportes', ['futbol'], 'easy', '¿Cuántos jugadores tiene un equipo de fútbol en el campo al comenzar un partido?', '11', ['9', '10', '12'], 'Un equipo de fútbol empieza el partido con 11 jugadores en el campo.', 'IFAB - Laws of the Game', 'https://www.theifab.com/laws/latest/the-players/', ['futbol', 'reglas', 'jugadores']],
  [20, 'cine-tv', ['cine'], 'easy', '¿Qué saga cinematográfica tiene personajes como Luke Skywalker y Darth Vader?', 'Star Wars', ['Star Trek', 'El señor de los anillos', 'Matrix'], 'Luke Skywalker y Darth Vader son personajes de la saga Star Wars.', 'StarWars.com - Databank', 'https://www.starwars.com/databank', ['star-wars', 'cine', 'ciencia-ficcion']],
  [21, 'musica', ['musica-clasica'], 'medium', '¿Qué compositor escribió la Novena Sinfonía?', 'Ludwig van Beethoven', ['Wolfgang Amadeus Mozart', 'Johann Sebastian Bach', 'Franz Schubert'], 'La Novena Sinfonía es una de las obras más conocidas de Beethoven.', 'Encyclopaedia Britannica - Symphony No. 9', 'https://www.britannica.com/topic/Symphony-No-9-in-D-Minor', ['beethoven', 'sinfonia', 'musica-clasica']],
  [22, 'tecnologia', ['informatica'], 'easy', '¿Qué significa la sigla CPU en informática?', 'Unidad central de procesamiento', ['Unidad de píxeles comprimidos', 'Control principal de usuario', 'Código público universal'], 'CPU significa unidad central de procesamiento, el componente que ejecuta instrucciones en un ordenador.', 'Encyclopaedia Britannica - Central Processing Unit', 'https://www.britannica.com/technology/central-processing-unit', ['cpu', 'informatica', 'hardware']],
  [23, 'naturaleza', ['animales'], 'easy', '¿Cuál es el mamífero terrestre más grande?', 'Elefante africano', ['Rinoceronte blanco', 'Hipopótamo', 'Jirafa'], 'El elefante africano es el mamífero terrestre más grande.', 'WWF - African Elephant', 'https://www.worldwildlife.org/species/african-elephant', ['elefante', 'mamiferos', 'animales']],
  [24, 'salud', ['cuerpo-humano'], 'easy', '¿Qué órgano se encarga principalmente de filtrar la sangre y producir orina?', 'Riñón', ['Páncreas', 'Bazo', 'Pulmón'], 'Los riñones filtran la sangre y producen la orina.', 'NIDDK - Your Kidneys & How They Work', 'https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work', ['rinon', 'cuerpo-humano', 'orina']],
  [25, 'geografia', ['montanas'], 'easy', '¿Cuál es la montaña más alta del mundo sobre el nivel del mar?', 'Everest', ['K2', 'Kilimanjaro', 'Aconcagua'], 'El Everest es la montaña más alta del mundo sobre el nivel del mar.', 'Encyclopaedia Britannica - Mount Everest', 'https://www.britannica.com/place/Mount-Everest', ['everest', 'montanas', 'asia']],
  [26, 'historia', ['edad-media'], 'medium', '¿En qué península se originó el islam en el siglo VII?', 'Península arábiga', ['Península ibérica', 'Península itálica', 'Península balcánica'], 'El islam surgió en la península arábiga en el siglo VII.', 'Encyclopaedia Britannica - Islam', 'https://www.britannica.com/topic/Islam', ['islam', 'peninsula-arabiga', 'edad-media']],
  [27, 'ciencia', ['quimica'], 'easy', '¿Cuál es la fórmula química del agua?', 'H2O', ['CO2', 'O2', 'NaCl'], 'La molécula de agua está formada por dos átomos de hidrógeno y uno de oxígeno.', 'USGS - Water Science School', 'https://www.usgs.gov/special-topics/water-science-school/science/water-molecule', ['agua', 'quimica', 'moleculas']],
  [28, 'literatura', ['literatura-espanola'], 'medium', '¿Qué poeta español escribió Romancero gitano?', 'Federico García Lorca', ['Antonio Machado', 'Rafael Alberti', 'Miguel Hernández'], 'Romancero gitano es una obra poética de Federico García Lorca.', 'Instituto Cervantes - Federico García Lorca', 'https://www.cervantes.es/bibliotecas_documentacion_espanol/creadores/garcia_lorca_federico.htm', ['lorca', 'poesia', 'literatura-espanola']],
  [29, 'arte', ['arquitectura'], 'medium', '¿Qué arquitecto diseñó principalmente la Sagrada Familia de Barcelona?', 'Antoni Gaudí', ['Lluís Domènech i Montaner', 'Santiago Calatrava', 'Rafael Moneo'], 'Antoni Gaudí es el arquitecto más asociado al diseño de la Sagrada Familia.', 'Sagrada Família - Antoni Gaudí', 'https://sagradafamilia.org/en/antoni-gaudi', ['gaudi', 'sagrada-familia', 'barcelona']],
  [30, 'deportes', ['tenis'], 'easy', '¿En qué deporte se disputa el torneo de Wimbledon?', 'Tenis', ['Golf', 'Críquet', 'Bádminton'], 'Wimbledon es uno de los torneos más importantes del tenis.', 'Wimbledon - Official Site', 'https://www.wimbledon.com/', ['wimbledon', 'tenis', 'deportes']],
  [31, 'cine-tv', ['cine'], 'medium', '¿Quién dirigió la película Tiburón de 1975?', 'Steven Spielberg', ['George Lucas', 'Martin Scorsese', 'Francis Ford Coppola'], 'Tiburón fue dirigida por Steven Spielberg.', 'Encyclopaedia Britannica - Jaws', 'https://www.britannica.com/topic/Jaws-film-by-Spielberg', ['spielberg', 'tiburon', 'cine']],
  [32, 'musica', ['rock'], 'easy', '¿Qué banda británica publicó el álbum Abbey Road?', 'The Beatles', ['The Rolling Stones', 'Queen', 'Pink Floyd'], 'Abbey Road es un álbum de The Beatles.', 'The Beatles - Abbey Road', 'https://www.thebeatles.com/album/abbey-road', ['the-beatles', 'abbey-road', 'rock']],
  [33, 'tecnologia', ['internet'], 'easy', '¿Qué protocolo se usa normalmente para cargar páginas web de forma segura?', 'HTTPS', ['FTP', 'SMTP', 'Bluetooth'], 'HTTPS es la versión segura de HTTP usada en la web.', 'MDN Web Docs - HTTPS', 'https://developer.mozilla.org/en-US/docs/Glossary/HTTPS', ['https', 'internet', 'web']],
  [34, 'naturaleza', ['plantas'], 'easy', '¿Qué parte de la planta absorbe normalmente agua y minerales del suelo?', 'La raíz', ['La flor', 'El fruto', 'El tallo hueco'], 'Las raíces absorben agua y minerales del suelo.', 'Encyclopaedia Britannica - Root', 'https://www.britannica.com/science/root-plant', ['plantas', 'raices', 'botanica']],
  [35, 'salud', ['nutricion'], 'easy', '¿Qué vitamina produce la piel humana al exponerse a la luz solar?', 'Vitamina D', ['Vitamina C', 'Vitamina B12', 'Vitamina K'], 'La exposición solar ayuda a la piel a producir vitamina D.', 'NHS - Vitamin D', 'https://www.nhs.uk/conditions/vitamins-and-minerals/vitamin-d/', ['vitamina-d', 'salud', 'nutricion']],
  [36, 'geografia', ['paises'], 'easy', '¿En qué país se encuentra la ciudad de Marrakech?', 'Marruecos', ['Túnez', 'Egipto', 'Argelia'], 'Marrakech es una ciudad de Marruecos.', 'Encyclopaedia Britannica - Marrakech', 'https://www.britannica.com/place/Marrakech', ['marrakech', 'marruecos', 'africa']],
  [37, 'historia', ['edad-contemporanea'], 'medium', '¿Qué muro cayó en noviembre de 1989?', 'Muro de Berlín', ['Muro de Adriano', 'Gran Muralla China', 'Muro de las Lamentaciones'], 'El Muro de Berlín cayó en noviembre de 1989.', 'History.com - Berlin Wall', 'https://www.history.com/topics/cold-war/berlin-wall', ['muro-de-berlin', 'guerra-fria', '1989']],
  [38, 'ciencia', ['astronomia'], 'medium', '¿Cuál es la estrella más cercana a la Tierra?', 'El Sol', ['Sirio', 'Próxima Centauri', 'Betelgeuse'], 'El Sol es la estrella más cercana a la Tierra.', 'NASA Space Place - The Sun', 'https://spaceplace.nasa.gov/sun-compare/en/', ['sol', 'estrellas', 'astronomia']],
  [39, 'literatura', ['literatura-francesa'], 'medium', '¿Quién escribió Los miserables?', 'Victor Hugo', ['Julio Verne', 'Alexandre Dumas', 'Gustave Flaubert'], 'Los miserables es una novela de Victor Hugo.', 'Encyclopaedia Britannica - Les Misérables', 'https://www.britannica.com/topic/Les-Miserables-novel-by-Hugo', ['victor-hugo', 'los-miserables', 'literatura-francesa']],
  [40, 'arte', ['pintura', 'impresionismo'], 'medium', '¿Qué pintor es conocido por la serie de nenúfares?', 'Claude Monet', ['Édouard Manet', 'Vincent van Gogh', 'Paul Cézanne'], 'Claude Monet pintó numerosas obras de nenúfares.', 'Musée de l\'Orangerie - Water Lilies', 'https://www.musee-orangerie.fr/en/node/197502', ['monet', 'nenufares', 'impresionismo']],
  [41, 'deportes', ['baloncesto'], 'easy', '¿Cuántos jugadores de un equipo de baloncesto están en pista durante el juego?', '5', ['4', '6', '7'], 'En baloncesto, cada equipo juega con cinco jugadores en pista.', 'FIBA - Official Basketball Rules', 'https://www.fiba.basketball/documents/official-basketball-rules/current.pdf', ['baloncesto', 'reglas', 'jugadores']],
  [42, 'cine-tv', ['television'], 'easy', '¿En qué serie aparece el personaje Homer Simpson?', 'Los Simpson', ['Padre de familia', 'Futurama', 'South Park'], 'Homer Simpson es uno de los personajes principales de Los Simpson.', 'The Simpsons - Official Site', 'https://www.thesimpsons.com/', ['los-simpson', 'homer-simpson', 'television']],
  [43, 'musica', ['pop'], 'easy', '¿Qué artista es conocido como el Rey del Pop?', 'Michael Jackson', ['Elvis Presley', 'Prince', 'Stevie Wonder'], 'Michael Jackson es conocido popularmente como el Rey del Pop.', 'Rock & Roll Hall of Fame - Michael Jackson', 'https://rockhall.com/inductees/michael-jackson/', ['michael-jackson', 'pop', 'musica']],
  [44, 'tecnologia', ['programacion'], 'easy', '¿Qué lenguaje de programación se usa principalmente para dar interactividad a páginas web en el navegador?', 'JavaScript', ['SQL', 'Bash', 'C'], 'JavaScript se utiliza ampliamente para programar interactividad en páginas web.', 'MDN Web Docs - JavaScript', 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', ['javascript', 'web', 'programacion']],
  [45, 'naturaleza', ['animales'], 'medium', '¿Qué animal es conocido por cambiar de color para camuflarse?', 'Camaleón', ['Koala', 'Pingüino', 'Ornitorrinco'], 'Los camaleones pueden cambiar de color por comunicación, temperatura y camuflaje.', 'San Diego Zoo - Chameleon', 'https://animals.sandiegozoo.org/animals/chameleon', ['camaleon', 'reptiles', 'camuflaje']],
  [46, 'salud', ['cuerpo-humano'], 'easy', '¿Cuántos pulmones tiene normalmente una persona?', 'Dos', ['Uno', 'Tres', 'Cuatro'], 'El ser humano normalmente tiene dos pulmones.', 'MedlinePlus - Lungs', 'https://medlineplus.gov/lungsandbreathing.html', ['pulmones', 'cuerpo-humano', 'respiracion']],
  [47, 'geografia', ['capitales'], 'medium', '¿Cuál es la capital de Japón?', 'Tokio', ['Kioto', 'Osaka', 'Hiroshima'], 'Tokio es la capital de Japón.', 'Encyclopaedia Britannica - Tokyo', 'https://www.britannica.com/place/Tokyo', ['japon', 'tokio', 'capitales']],
  [48, 'historia', ['edad-antigua'], 'medium', '¿Qué ciudad fue destruida por la erupción del Vesubio en el año 79 d. C.?', 'Pompeya', ['Atenas', 'Cartago', 'Tebas'], 'Pompeya fue sepultada por la erupción del Vesubio en el año 79 d. C.', 'UNESCO - Archaeological Areas of Pompei', 'https://whc.unesco.org/en/list/829/', ['pompeya', 'vesubio', 'roma-antigua']],
  [49, 'ciencia', ['fisica'], 'medium', '¿Cuál es la unidad del Sistema Internacional para medir la fuerza?', 'Newton', ['Julio', 'Vatio', 'Pascal'], 'El newton es la unidad del Sistema Internacional para la fuerza.', 'BIPM - SI Brochure', 'https://www.bipm.org/en/publications/si-brochure', ['newton', 'fisica', 'unidades']],
  [50, 'literatura', ['literatura-inglesa'], 'medium', '¿Quién escribió 1984?', 'George Orwell', ['Aldous Huxley', 'Ray Bradbury', 'J. R. R. Tolkien'], '1984 es una novela escrita por George Orwell.', 'Encyclopaedia Britannica - Nineteen Eighty-four', 'https://www.britannica.com/topic/Nineteen-Eighty-four', ['george-orwell', '1984', 'distopia']],
  [51, 'arte', ['escultura'], 'medium', '¿Quién esculpió el David renacentista que se conserva en Florencia?', 'Miguel Ángel', ['Donatello', 'Bernini', 'Cellini'], 'El David de mármol de Florencia fue esculpido por Miguel Ángel.', 'Galleria dell\'Accademia - David', 'https://www.galleriaaccademiafirenze.it/en/artworks/david-michelangelo/', ['miguel-angel', 'david', 'renacimiento']],
  [52, 'deportes', ['juegos-olimpicos'], 'easy', '¿Cada cuántos años se celebran normalmente los Juegos Olímpicos de verano?', '4 años', ['2 años', '3 años', '5 años'], 'Los Juegos Olímpicos de verano se celebran normalmente cada cuatro años.', 'Olympics.com - Olympic Games', 'https://olympics.com/ioc/olympic-games', ['juegos-olimpicos', 'deportes', 'verano']],
  [53, 'cine-tv', ['cine'], 'medium', '¿Qué película ganó el Óscar a mejor película en 1998 por la historia del Titanic?', 'Titanic', ['Salvar al soldado Ryan', 'Gladiator', 'Braveheart'], 'Titanic ganó el Óscar a mejor película en la ceremonia de 1998.', 'Oscars.org - 1998 Academy Awards', 'https://www.oscars.org/oscars/ceremonies/1998', ['titanic', 'oscars', 'cine']],
  [54, 'musica', ['musica-espanola'], 'medium', '¿Qué cantante española popularizó la canción Mediterráneo?', 'Joan Manuel Serrat', ['Camilo Sesto', 'Nino Bravo', 'Luis Eduardo Aute'], 'Mediterráneo es una canción emblemática de Joan Manuel Serrat.', 'Discogs - Joan Manuel Serrat Mediterráneo', 'https://www.discogs.com/master/307998-Joan-Manuel-Serrat-Mediterr%C3%A1neo', ['serrat', 'mediterraneo', 'musica-espanola']],
  [55, 'tecnologia', ['internet'], 'medium', '¿Qué significa URL?', 'Localizador uniforme de recursos', ['Registro universal de líneas', 'Unidad remota lógica', 'Lenguaje único de red'], 'URL significa localizador uniforme de recursos.', 'MDN Web Docs - URL', 'https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Web_mechanics/What_is_a_URL', ['url', 'internet', 'web']],
  [56, 'naturaleza', ['geologia'], 'easy', '¿Qué fenómeno geológico mide la escala de Richter?', 'Terremotos', ['Huracanes', 'Mareas', 'Erupciones solares'], 'La escala de Richter se relaciona con la magnitud de los terremotos.', 'USGS - Earthquake Magnitude', 'https://www.usgs.gov/programs/earthquake-hazards/magnitude-types', ['terremotos', 'richter', 'geologia']],
  [57, 'salud', ['cuerpo-humano'], 'medium', '¿Qué hueso protege principalmente el cerebro?', 'Cráneo', ['Fémur', 'Esternón', 'Húmero'], 'El cráneo protege el encéfalo y forma la estructura de la cabeza.', 'Encyclopaedia Britannica - Skull', 'https://www.britannica.com/science/skull', ['craneo', 'cerebro', 'huesos']],
  [58, 'geografia', ['paises'], 'medium', '¿Qué país tiene forma de bota en los mapas de Europa?', 'Italia', ['Grecia', 'Portugal', 'Croacia'], 'Italia es conocida por su forma de bota en el mapa.', 'Encyclopaedia Britannica - Italy', 'https://www.britannica.com/place/Italy', ['italia', 'europa', 'mapas']],
  [59, 'historia', ['edad-contemporanea'], 'medium', '¿En qué país comenzó la Revolución Industrial?', 'Reino Unido', ['Francia', 'Alemania', 'Estados Unidos'], 'La Revolución Industrial comenzó en Gran Bretaña en el siglo XVIII.', 'Encyclopaedia Britannica - Industrial Revolution', 'https://www.britannica.com/event/Industrial-Revolution', ['revolucion-industrial', 'reino-unido', 'historia']],
  [60, 'ciencia', ['biologia'], 'medium', '¿Qué molécula contiene la información genética de los seres vivos?', 'ADN', ['ATP', 'Glucosa', 'Colágeno'], 'El ADN contiene la información genética hereditaria de los seres vivos.', 'National Human Genome Research Institute - DNA', 'https://www.genome.gov/genetics-glossary/Deoxyribonucleic-Acid', ['adn', 'genetica', 'biologia']],
  [61, 'literatura', ['literatura-rusa'], 'medium', '¿Quién escribió Crimen y castigo?', 'Fiódor Dostoyevski', ['León Tolstói', 'Antón Chéjov', 'Nikolái Gógol'], 'Crimen y castigo es una novela de Fiódor Dostoyevski.', 'Encyclopaedia Britannica - Crime and Punishment', 'https://www.britannica.com/topic/Crime-and-Punishment-novel', ['dostoyevski', 'crimen-y-castigo', 'literatura-rusa']],
  [62, 'arte', ['pintura'], 'easy', '¿Qué pintor neerlandés es famoso por La noche estrellada?', 'Vincent van Gogh', ['Rembrandt', 'Johannes Vermeer', 'Piet Mondrian'], 'La noche estrellada es una obra de Vincent van Gogh.', 'MoMA - The Starry Night', 'https://www.moma.org/collection/works/79802', ['van-gogh', 'noche-estrellada', 'pintura']],
  [63, 'deportes', ['ciclismo'], 'easy', '¿Qué carrera ciclista se asocia al maillot amarillo?', 'Tour de Francia', ['Giro de Italia', 'Vuelta a España', 'París-Roubaix'], 'El maillot amarillo identifica al líder del Tour de Francia.', 'Tour de France - Jerseys', 'https://www.letour.fr/en/the-jerseys-tour-de-france', ['tour-de-francia', 'ciclismo', 'maillot-amarillo']],
  [64, 'cine-tv', ['cine'], 'easy', '¿Qué objeto busca Indiana Jones en En busca del arca perdida?', 'El Arca de la Alianza', ['El Santo Grial', 'La piedra filosofal', 'El anillo único'], 'En la primera película de Indiana Jones, el objetivo central es el Arca de la Alianza.', 'Lucasfilm - Indiana Jones', 'https://www.lucasfilm.com/franchises/indiana-jones/', ['indiana-jones', 'arca-de-la-alianza', 'cine']],
  [65, 'musica', ['instrumentos'], 'easy', '¿Cuántas cuerdas tiene normalmente una guitarra española clásica?', '6', ['4', '5', '7'], 'La guitarra clásica española tiene normalmente seis cuerdas.', 'Encyclopaedia Britannica - Guitar', 'https://www.britannica.com/art/guitar', ['guitarra', 'instrumentos', 'musica']],
  [66, 'tecnologia', ['informatica'], 'easy', '¿Qué dispositivo se usa principalmente para introducir texto en un ordenador?', 'Teclado', ['Monitor', 'Altavoz', 'Impresora'], 'El teclado se utiliza principalmente para introducir texto y comandos.', 'Encyclopaedia Britannica - Computer keyboard', 'https://www.britannica.com/technology/computer-keyboard', ['teclado', 'hardware', 'informatica']],
  [67, 'naturaleza', ['animales'], 'easy', '¿Qué animal produce miel?', 'Abeja', ['Hormiga', 'Mariposa', 'Escarabajo'], 'Las abejas producen miel a partir del néctar.', 'FAO - Bees and their role', 'https://www.fao.org/pollination/background/bees-and-their-role/en/', ['abejas', 'miel', 'insectos']],
  [68, 'salud', ['nutricion'], 'easy', '¿Qué mineral se asocia especialmente con la salud de huesos y dientes?', 'Calcio', ['Sodio', 'Potasio', 'Hierro'], 'El calcio es importante para mantener huesos y dientes sanos.', 'NIH - Calcium Fact Sheet', 'https://ods.od.nih.gov/factsheets/Calcium-Consumer/', ['calcio', 'huesos', 'nutricion']],
  [69, 'geografia', ['desiertos'], 'medium', '¿Cuál es el desierto cálido más grande del mundo?', 'Sáhara', ['Gobi', 'Kalahari', 'Atacama'], 'El Sáhara es el desierto cálido más grande del mundo.', 'Encyclopaedia Britannica - Sahara', 'https://www.britannica.com/place/Sahara-desert-Africa', ['sahara', 'desiertos', 'africa']],
  [70, 'historia', ['edad-antigua'], 'medium', '¿Qué imperio tuvo como capital la ciudad de Roma?', 'Imperio romano', ['Imperio persa', 'Imperio otomano', 'Imperio carolingio'], 'Roma fue la capital del Imperio romano.', 'Encyclopaedia Britannica - Roman Empire', 'https://www.britannica.com/place/Roman-Empire', ['imperio-romano', 'roma', 'edad-antigua']],
  [71, 'ciencia', ['quimica'], 'easy', '¿Qué gas es necesario para la respiración humana?', 'Oxígeno', ['Dióxido de carbono', 'Nitrógeno puro', 'Hidrógeno'], 'El oxígeno es esencial para la respiración celular humana.', 'MedlinePlus - Oxygen', 'https://medlineplus.gov/oxygen.html', ['oxigeno', 'respiracion', 'quimica']],
  [72, 'literatura', ['literatura-infantil'], 'easy', '¿Quién creó el personaje de Harry Potter?', 'J. K. Rowling', ['Suzanne Collins', 'Roald Dahl', 'C. S. Lewis'], 'Harry Potter fue creado por la escritora J. K. Rowling.', 'Wizarding World - J.K. Rowling', 'https://www.wizardingworld.com/writing-by-jk-rowling', ['harry-potter', 'jk-rowling', 'literatura-infantil']],
  [73, 'arte', ['museos'], 'easy', '¿En qué ciudad se encuentra el Museo del Prado?', 'Madrid', ['Barcelona', 'Sevilla', 'Valencia'], 'El Museo Nacional del Prado se encuentra en Madrid.', 'Museo del Prado - Visit', 'https://www.museodelprado.es/en/visit-the-museum', ['museo-del-prado', 'madrid', 'museos']],
  [74, 'deportes', ['formula-1'], 'easy', '¿En qué deporte compitió Fernando Alonso como campeón mundial?', 'Fórmula 1', ['Rally Dakar', 'MotoGP', 'IndyCar'], 'Fernando Alonso fue campeón mundial de Fórmula 1.', 'Formula 1 - Fernando Alonso', 'https://www.formula1.com/en/drivers/fernando-alonso', ['fernando-alonso', 'formula-1', 'motor']],
  [75, 'cine-tv', ['cine'], 'medium', '¿Qué director dirigió El señor de los anillos: La comunidad del anillo?', 'Peter Jackson', ['James Cameron', 'Ridley Scott', 'Christopher Nolan'], 'La comunidad del anillo fue dirigida por Peter Jackson.', 'The Lord of the Rings - Official Site', 'https://www.lordoftherings.net/', ['peter-jackson', 'senor-de-los-anillos', 'cine']],
  [76, 'musica', ['flamenco'], 'medium', '¿Qué artista es conocido por el álbum La leyenda del tiempo?', 'Camarón de la Isla', ['Paco de Lucía', 'Enrique Morente', 'Tomatito'], 'La leyenda del tiempo es uno de los discos más conocidos de Camarón de la Isla.', 'Discogs - La Leyenda del Tiempo', 'https://www.discogs.com/master/208174-Camar%C3%B3n-La-Leyenda-Del-Tiempo', ['camaron', 'flamenco', 'musica-espanola']],
  [77, 'tecnologia', ['programacion'], 'medium', '¿Qué lenguaje de programación tiene como logotipo una taza de café?', 'Java', ['Python', 'Ruby', 'Go'], 'Java se asocia visualmente con una taza de café.', 'Oracle - Java', 'https://www.java.com/', ['java', 'programacion', 'lenguajes']],
  [78, 'naturaleza', ['ecosistemas'], 'medium', '¿Cómo se llama el ecosistema dominado por árboles en zonas tropicales muy lluviosas?', 'Selva tropical', ['Tundra', 'Taiga', 'Sabana seca'], 'La selva tropical es un ecosistema cálido y húmedo con gran densidad de vegetación.', 'NASA Earth Observatory - Tropical Rainforests', 'https://earthobservatory.nasa.gov/biome/biorainforest.php', ['selva-tropical', 'ecosistemas', 'naturaleza']],
  [79, 'salud', ['primeros-auxilios'], 'medium', '¿Qué número se usa en España para llamar a emergencias?', '112', ['091', '061', '010'], 'El 112 es el número único de emergencias en España y la Unión Europea.', 'European Commission - 112', 'https://digital-strategy.ec.europa.eu/en/policies/112', ['emergencias', '112', 'espana']],
  [80, 'geografia', ['continentes'], 'easy', '¿Cuál es el continente más pequeño por superficie?', 'Oceanía', ['Europa', 'Antártida', 'América del Sur'], 'Oceanía suele considerarse el continente más pequeño por superficie.', 'Encyclopaedia Britannica - Oceania', 'https://www.britannica.com/place/Oceania-region-Pacific-Ocean', ['oceania', 'continentes', 'geografia']],
  [81, 'historia', ['edad-moderna'], 'medium', '¿Qué revolución comenzó en Francia en 1789?', 'Revolución francesa', ['Revolución rusa', 'Revolución industrial', 'Revolución mexicana'], 'La Revolución francesa comenzó en 1789.', 'Encyclopaedia Britannica - French Revolution', 'https://www.britannica.com/event/French-Revolution', ['revolucion-francesa', '1789', 'francia']],
  [82, 'ciencia', ['astronomia'], 'medium', '¿Qué planeta es conocido como el planeta rojo?', 'Marte', ['Venus', 'Mercurio', 'Urano'], 'Marte es conocido como el planeta rojo por su aspecto rojizo.', 'NASA Science - Mars', 'https://science.nasa.gov/mars/', ['marte', 'planeta-rojo', 'astronomia']],
  [83, 'literatura', ['literatura-espanola'], 'hard', '¿Qué novela de Camilo José Cela está ambientada en la posguerra madrileña y se estructura como un retrato coral?', 'La colmena', ['La familia de Pascual Duarte', 'Nada', 'Tiempo de silencio'], 'La colmena, de Camilo José Cela, retrata la vida madrileña de posguerra con múltiples personajes.', 'Instituto Cervantes - Camilo José Cela', 'https://www.cervantes.es/bibliotecas_documentacion_espanol/creadores/cela_camilo_jose.htm', ['camilo-jose-cela', 'la-colmena', 'literatura-espanola']],
  [84, 'arte', ['arquitectura'], 'hard', '¿Qué estilo artístico se asocia principalmente con arcos apuntados y grandes vidrieras en catedrales medievales?', 'Gótico', ['Románico', 'Barroco', 'Neoclásico'], 'El gótico se caracteriza por arcos apuntados, bóvedas de crucería y grandes vidrieras.', 'Encyclopaedia Britannica - Gothic architecture', 'https://www.britannica.com/art/Gothic-architecture', ['gotico', 'arquitectura', 'edad-media']],
  [85, 'deportes', ['rugby'], 'medium', '¿Cuántos jugadores tiene un equipo de rugby union en el campo?', '15', ['11', '13', '7'], 'En rugby union juegan quince jugadores por equipo.', 'World Rugby - Laws', 'https://www.world.rugby/the-game/laws/home', ['rugby', 'reglas', 'deportes']],
  [86, 'cine-tv', ['animacion'], 'easy', '¿Qué estudio creó la película Toy Story?', 'Pixar', ['DreamWorks', 'Studio Ghibli', 'Illumination'], 'Toy Story fue producida por Pixar Animation Studios.', 'Pixar - Toy Story', 'https://www.pixar.com/feature-films/toy-story', ['toy-story', 'pixar', 'animacion']],
  [87, 'musica', ['opera'], 'medium', '¿Quién compuso la ópera La flauta mágica?', 'Wolfgang Amadeus Mozart', ['Giuseppe Verdi', 'Richard Wagner', 'Giacomo Puccini'], 'La flauta mágica es una ópera de Mozart.', 'Encyclopaedia Britannica - The Magic Flute', 'https://www.britannica.com/topic/The-Magic-Flute', ['mozart', 'opera', 'flauta-magica']],
  [88, 'tecnologia', ['hardware'], 'medium', '¿Qué tipo de almacenamiento suele ser más rápido: SSD o HDD?', 'SSD', ['HDD', 'Disquete', 'Cinta magnética'], 'Los SSD suelen ofrecer velocidades de acceso superiores a los discos duros HDD tradicionales.', 'Kingston - SSD vs HDD', 'https://www.kingston.com/en/blog/pc-performance/ssd-vs-hdd', ['ssd', 'hdd', 'almacenamiento']],
  [89, 'naturaleza', ['oceanos'], 'medium', '¿Cómo se llama el fenómeno periódico de subida y bajada del nivel del mar causado sobre todo por la Luna?', 'Marea', ['Corriente oceánica', 'Tsunami', 'Oleaje'], 'Las mareas son subidas y bajadas periódicas del nivel del mar causadas principalmente por la atracción gravitatoria de la Luna y el Sol.', 'NOAA - What causes tides?', 'https://oceanservice.noaa.gov/facts/tides.html', ['mareas', 'luna', 'oceanos']],
  [90, 'salud', ['cuerpo-humano'], 'medium', '¿Qué sistema del cuerpo humano incluye al cerebro y la médula espinal?', 'Sistema nervioso', ['Sistema digestivo', 'Sistema circulatorio', 'Sistema endocrino'], 'El sistema nervioso central incluye el cerebro y la médula espinal.', 'MedlinePlus - Central Nervous System', 'https://medlineplus.gov/ency/article/002311.htm', ['sistema-nervioso', 'cerebro', 'medula-espinal']],
  [91, 'geografia', ['rios'], 'medium', '¿Qué río es el más largo de la península ibérica?', 'Tajo', ['Ebro', 'Duero', 'Guadiana'], 'El Tajo es el río más largo de la península ibérica.', 'Confederación Hidrográfica del Tajo', 'https://www.chtajo.es/', ['tajo', 'rios', 'peninsula-iberica']],
  [92, 'historia', ['edad-contemporanea'], 'hard', '¿Qué tratado puso fin oficialmente a la Primera Guerra Mundial con Alemania?', 'Tratado de Versalles', ['Tratado de Utrecht', 'Tratado de Tordesillas', 'Tratado de París'], 'El Tratado de Versalles de 1919 puso fin oficialmente al estado de guerra entre Alemania y las potencias aliadas.', 'National Archives - Treaty of Versailles', 'https://www.archives.gov/milestone-documents/treaty-of-versailles', ['tratado-de-versalles', 'primera-guerra-mundial', '1919']],
  [93, 'ciencia', ['fisica'], 'hard', '¿Qué científico formuló las leyes del movimiento y la ley de gravitación universal?', 'Isaac Newton', ['Albert Einstein', 'Galileo Galilei', 'Niels Bohr'], 'Isaac Newton formuló las leyes del movimiento y la gravitación universal.', 'Encyclopaedia Britannica - Isaac Newton', 'https://www.britannica.com/biography/Isaac-Newton', ['isaac-newton', 'gravedad', 'fisica']],
  [94, 'literatura', ['mitologia'], 'medium', '¿En la mitología griega, quién es el dios del mar?', 'Poseidón', ['Ares', 'Hermes', 'Apolo'], 'Poseidón es el dios griego del mar.', 'Encyclopaedia Britannica - Poseidon', 'https://www.britannica.com/topic/Poseidon', ['poseidon', 'mitologia-griega', 'mar']],
  [95, 'arte', ['pintura'], 'medium', '¿Qué artista pintó El nacimiento de Venus?', 'Sandro Botticelli', ['Leonardo da Vinci', 'Tiziano', 'Caravaggio'], 'El nacimiento de Venus es una obra de Sandro Botticelli.', 'Uffizi Galleries - Birth of Venus', 'https://www.uffizi.it/en/artworks/birth-of-venus', ['botticelli', 'nacimiento-de-venus', 'renacimiento']],
  [96, 'deportes', ['atletismo'], 'easy', '¿Qué prueba de atletismo consiste en correr 42,195 kilómetros?', 'Maratón', ['100 metros lisos', 'Triatlón', 'Decatlón'], 'La maratón tiene una distancia oficial de 42,195 kilómetros.', 'World Athletics - Marathon', 'https://worldathletics.org/disciplines/road-running/marathon', ['maraton', 'atletismo', 'deportes']],
  [97, 'cine-tv', ['cine'], 'easy', '¿Qué película de Disney tiene como protagonista a Simba?', 'El rey león', ['Aladdín', 'Hércules', 'Pocahontas'], 'Simba es el protagonista de El rey león.', 'Disney - The Lion King', 'https://www.disney.com/the-lion-king', ['simba', 'rey-leon', 'disney']],
  [98, 'musica', ['instrumentos'], 'medium', '¿Qué instrumento musical tiene teclas blancas y negras y cuerdas percutidas por macillos?', 'Piano', ['Órgano', 'Arpa', 'Acordeón'], 'El piano produce sonido cuando macillos golpean cuerdas al pulsar sus teclas.', 'Encyclopaedia Britannica - Piano', 'https://www.britannica.com/art/piano', ['piano', 'instrumentos', 'musica']],
  [99, 'tecnologia', ['internet'], 'easy', '¿Qué significa Wi-Fi en el uso cotidiano?', 'Conexión inalámbrica a una red', ['Cable de fibra óptica', 'Memoria externa', 'Sistema operativo'], 'Wi-Fi se usa para referirse a tecnologías de red inalámbrica local.', 'Wi-Fi Alliance - Discover Wi-Fi', 'https://www.wi-fi.org/discover-wi-fi', ['wifi', 'redes', 'internet']],
  [100, 'naturaleza', ['animales'], 'medium', '¿Qué ave no voladora es originaria de la Antártida y se asocia al hielo?', 'Pingüino emperador', ['Avestruz', 'Kiwi', 'Ñandú'], 'El pingüino emperador vive en la Antártida y está adaptado a ambientes helados.', 'National Geographic - Emperor Penguin', 'https://www.nationalgeographic.com/animals/birds/facts/emperor-penguin', ['pinguino-emperador', 'antartida', 'aves']],
  [101, 'salud', ['nutricion'], 'medium', '¿Qué nutriente es la principal fuente de energía rápida para el cuerpo?', 'Carbohidratos', ['Vitaminas', 'Agua', 'Minerales'], 'Los carbohidratos son una fuente principal de energía para el organismo.', 'Harvard T.H. Chan - Carbohydrates', 'https://www.hsph.harvard.edu/nutritionsource/carbohydrates/', ['carbohidratos', 'nutricion', 'energia']],
  [102, 'gastronomia', ['cocina-espanola'], 'easy', '¿Cuál es el ingrediente principal tradicional de la tortilla de patatas?', 'Patata', ['Arroz', 'Pan', 'Garbanzos'], 'La tortilla de patatas se elabora principalmente con patata y huevo.', 'TasteAtlas - Tortilla de patata', 'https://www.tasteatlas.com/tortilla-de-patata', ['tortilla-de-patatas', 'cocina-espanola', 'patata']],
  [103, 'entretenimiento', ['juegos'], 'easy', '¿En qué juego de mesa se compran calles y se cobran alquileres?', 'Monopoly', ['Cluedo', 'Risk', 'Scrabble'], 'Monopoly es un juego de mesa basado en comprar propiedades y cobrar alquileres.', 'Hasbro - Monopoly', 'https://shop.hasbro.com/en-us/monopoly', ['monopoly', 'juegos-de-mesa', 'entretenimiento']],
  [104, 'geografia', ['capitales'], 'medium', '¿Cuál es la capital de Argentina?', 'Buenos Aires', ['Córdoba', 'Rosario', 'Mendoza'], 'Buenos Aires es la capital de Argentina.', 'Encyclopaedia Britannica - Buenos Aires', 'https://www.britannica.com/place/Buenos-Aires', ['argentina', 'buenos-aires', 'capitales']],
  [105, 'historia', ['edad-antigua'], 'medium', '¿Qué pueblo fundó tradicionalmente la ciudad de Cartago?', 'Fenicios', ['Griegos', 'Romanos', 'Egipcios'], 'Cartago fue fundada por colonos fenicios procedentes de Tiro, según la tradición histórica.', 'Encyclopaedia Britannica - Carthage', 'https://www.britannica.com/place/Carthage-ancient-city-Tunisia', ['cartago', 'fenicios', 'edad-antigua']],
  [106, 'ciencia', ['biologia'], 'easy', '¿Qué grupo de animales tiene escamas y suele poner huevos, como serpientes y lagartos?', 'Reptiles', ['Mamíferos', 'Anfibios', 'Aves'], 'Serpientes y lagartos pertenecen al grupo de los reptiles.', 'Encyclopaedia Britannica - Reptile', 'https://www.britannica.com/animal/reptile', ['reptiles', 'animales', 'biologia']],
  [107, 'literatura', ['literatura-inglesa'], 'hard', '¿Qué autor escribió El señor de los anillos?', 'J. R. R. Tolkien', ['C. S. Lewis', 'George R. R. Martin', 'Terry Pratchett'], 'El señor de los anillos fue escrito por J. R. R. Tolkien.', 'Encyclopaedia Britannica - The Lord of the Rings', 'https://www.britannica.com/topic/The-Lord-of-the-Rings-novel-by-Tolkien', ['tolkien', 'senor-de-los-anillos', 'fantasia']],
  [108, 'arte', ['museos'], 'medium', '¿En qué ciudad se encuentra el Museo del Louvre?', 'París', ['Roma', 'Londres', 'Viena'], 'El Museo del Louvre se encuentra en París.', 'Musée du Louvre - Visit', 'https://www.louvre.fr/en/visit', ['louvre', 'paris', 'museos']],
  [109, 'deportes', ['natacion'], 'easy', '¿En qué deporte se compite en estilos como crol, espalda, braza y mariposa?', 'Natación', ['Remo', 'Waterpolo', 'Surf'], 'Crol, espalda, braza y mariposa son estilos de natación.', 'World Aquatics - Swimming', 'https://www.worldaquatics.com/swimming', ['natacion', 'estilos', 'deportes']],
  [110, 'tecnologia', ['software'], 'medium', '¿Qué sistema operativo es desarrollado por Apple para sus ordenadores Mac?', 'macOS', ['Windows', 'Android', 'Ubuntu'], 'macOS es el sistema operativo de Apple para los ordenadores Mac.', 'Apple - macOS', 'https://www.apple.com/macos/', ['macos', 'apple', 'sistemas-operativos']]
];

function questionFromItem(item) {
  const [
    number,
    category,
    subcategories,
    difficulty,
    question,
    correct,
    wrongs,
    explanation,
    sourceTitle,
    sourceUrl,
    tags,
  ] = item;

  const id = `q-${String(number).padStart(6, '0')}`;

  return {
    id,
    status: 'published',
    language: 'es',
    category,
    subcategories,
    difficulty,
    question,
    answers: [
      {
        text: wrongs[0],
        correct: false,
      },
      {
        text: correct,
        correct: true,
      },
      {
        text: wrongs[1],
        correct: false,
      },
      {
        text: wrongs[2],
        correct: false,
      },
    ],
    explanation,
    sources: [
      {
        title: sourceTitle,
        url: sourceUrl,
      },
    ],
    tags,
    created_at: today,
    updated_at: today,
  };
}

function validateQuestion(question) {
  if (Object.prototype.hasOwnProperty.call(question, 'type')) {
    throw new Error(`${question.id} no debe tener campo type.`);
  }

  if (!Array.isArray(question.answers) || question.answers.length !== 4) {
    throw new Error(`${question.id} debe tener 4 respuestas.`);
  }

  const correctAnswers = question.answers.filter((answer) => answer.correct === true);
  if (correctAnswers.length !== 1) {
    throw new Error(`${question.id} debe tener exactamente una respuesta correcta.`);
  }

  for (const answer of question.answers) {
    const keys = Object.keys(answer).sort();
    if (keys.join(',') !== 'correct,text') {
      throw new Error(`${question.id} tiene una respuesta con campos no permitidos.`);
    }
  }
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  if (result.status !== 0) {
    throw new Error(`Error ejecutando ${command} ${args.join(' ')}`);
  }
}

await fs.mkdir(questionsDir, { recursive: true });

for (const item of items) {
  const question = questionFromItem(item);
  validateQuestion(question);

  const filePath = path.join(questionsDir, `${question.id}.json`);
  try {
    await fs.access(filePath);
    throw new Error(`Ya existe ${path.relative(process.cwd(), filePath)}.`);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  await fs.writeFile(filePath, `${JSON.stringify(question, null, 2)}\n`, 'utf8');
}

run('node', ['scripts/generate-categories.mjs']);
run('node', ['scripts/generate-index.mjs']);

console.log(`Añadidas ${items.length} preguntas y regenerados categories/ e index.json.`);
