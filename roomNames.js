// Generate a cute and nice name for a server room.
var roomNames = (function() {

	var adjectives = ["Adaptable","Adventurous","Affable","Affectionate","Agreeable","Ambitious","Amiable","Amicable","Amusing","Brave","Bright","Calm","Careful","Charming","Communicative","Compassionate ","Conscientious","Considerate","Convivial","Courageous","Courteous","Creative","Decisive","Determined","Diligent","Diplomatic","Discreet","Dynamic","Easygoing","Emotional","Energetic","Enthusiastic","Exuberant","Faithful","Fearless","Forceful","Frank","Friendly","Funny","Fenerous","Gentle","Good","Gregarious","Helpful","Honest","Humorous","Imaginative","Impartial","Independent","Intellectual","Intelligent","Intuitive","Inventive","Kind","Loving","Loyal","Modest","Neat","Nice","Optimistic","Passionate","Patient","Persistent ","Pioneering","Philosophical","Placid","Plucky","Polite","Powerful","Practical","Quiet","Rational","Reliable","Reserved","Resourceful","Romantic","Sensible","Sensitive","Shy","Sincere","Sociable","Straightforward","Sympathetic","Thoughtful","Tidy","Tough","Unassuming","Understanding","Versatile","Warmhearted","Willing","Witty"];
	var animals = ["Abyssinian","Affenpinscher","Akbash","Akita","Albatross","Alligator","Angelfish","Ant","Anteater","Antelope","Armadillo","Avocet","Axolotl","Baboon","Badger","Balinese","Bandicoot","Barb","Barnacle","Barracuda","Bat","Beagle","Bear","Beaver","Beetle","Binturong","Bird","Birman","Bison","Bloodhound","Bobcat","Bombay","Bongo","Bonobo","Booby","Budgerigar","Buffalo","Bulldog","Bullfrog","Burmese","Butterfly","Caiman","Camel","Capybara","Caracal","Cassowary","Cat","Caterpillar","Catfish","Centipede","Chameleon","Chamois","Cheetah","Chicken","Chihuahua","Chimpanzee","Chinchilla","Chinook","Chipmunk","Cichlid","Coati","Cockroach","Collie","Coral","Cougar","Cow","Coyote","Crab","Crane","Crocodile","Cuscus","Cuttlefish","Dachshund","Dalmatian","Deer","Dhole","Dingo","Discus","Dodo","Dog","Dolphin","Donkey","Dormouse","Dragonfly","Drever","Duck","Dugong","Dunker","Eagle","Earwig","Echidna","Elephant","Emu","Falcon","Ferret","Fish","Flamingo","Flounder","Fly","Fossa","Fox","Frigatebird","Frog","Gar","Gecko","Gerbil","Gharial","Gibbon","Giraffe","Goat","Goose","Gopher","Gorilla","Grasshopper","Greyhound","Grouse","Guppy","Hamster","Hare","Harrier","Havanese","Hedgehog","Heron","Himalayan","Hippopotamus","Horse","Human","Hummingbird","Hyena","Ibis","Iguana","Impala","Indri","Insect","Jackal","Jaguar","Javanese","Jellyfish","Kakapo","Kangaroo","Kingfisher","Kiwi","Koala","Kudu","Labradoodle","Ladybird","Lemming","Lemur","Leopard","Liger","Lion","Lionfish","Lizard","Llama","Lobster","Lynx","Macaw","Magpie","Maltese","Manatee","Mandrill","Markhor","Mastiff","Mayfly","Meerkat","Millipede","Mole","Molly","Mongoose","Mongrel","Monkey","Moorhen","Moose","Moth","Mouse","Mule","Neanderthal","Newfoundland","Newt","Nightingale","Numbat","Ocelot","Octopus","Okapi","Olm","Opossum","Orangutan","Ostrich","Otter","Oyster","Pademelon","Panther","Parrot","Peacock","Pekingese","Pelican","Penguin","Persian","Pheasant","Pig","Pika","Pike","Piranha","Platypus","Pointer","Poodle","Porcupine","Possum","Prawn","Puffin","Pug","Puma","Quail","Quetzal","Quokka","Quoll","Rabbit","Raccoon","Ragdoll","Rat","Rattlesnake","Reindeer","Rhinoceros","Robin","Rottweiler","Salamander","Saola","Scorpion","Seahorse","Seal","Serval","Sheep","Shrimp","Siamese","Siberian","Skunk","Sloth","Snail","Snake","Snowshoe","Somali","Sparrow","Sponge","Squid","Squirrel","Starfish","Stingray","Stoat","Swan","Tang","Tapir","Tarsier","Termite","Tetra","Tiffany","Tiger","Tortoise","Toucan","Tropicbird","Tuatara","Turkey","Uakari","Uguisu","Umbrellabird","Vulture","Wallaby","Walrus","Warthog","Wasp","Weasel","Whippet","Wildebeest","Wolf","Wolverine","Wombat","Woodlouse","Woodpecker","Wrasse","Yak","Zebra","Zebu","Zonkey","Zorse"];

	var gen = function(rooms) {

		var adj = adjectives[Math.floor(Math.random() * adjectives.length)];
		var animal = animals[Math.floor(Math.random() * animals.length)];

		var name = adj + animal;
		return rooms.indexOf(name) < 0 ? name : gen(rooms);

	}

	this.gen = gen;
	return this;

})();

module.exports = {
	gen: roomNames.gen
};