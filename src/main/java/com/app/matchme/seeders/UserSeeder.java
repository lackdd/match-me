package com.app.matchme.seeders;

import com.app.matchme.entities.User;
import com.app.matchme.repositories.UserRepository;
import com.app.matchme.utils.GeoUtils;
import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.locationtech.jts.geom.Point;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    private final Faker faker = new Faker();
    private static final Random random = new Random();

    private static final Map<String, double[]> estonianLocationCoordinates = Map.ofEntries(
            Map.entry("Harju County, Estonia", new double[]{59.4370, 24.7536}),
            Map.entry("Tartu County, Estonia", new double[]{58.3780, 26.7290}),
            Map.entry("Ida-Viru County, Estonia", new double[]{59.3560, 27.4138}),
            Map.entry("Pärnu County, Estonia", new double[]{58.3859, 24.4971}),
            Map.entry("Viljandi County, Estonia", new double[]{58.3642, 25.5965}),
            Map.entry("Lääne-Viru County, Estonia", new double[]{59.3534, 26.3595}),
            Map.entry("Lääne County, Estonia", new double[]{58.9294, 23.5416}),
            Map.entry("Järva County, Estonia", new double[]{58.7869, 25.5600}),
            Map.entry("Valga County, Estonia", new double[]{57.7770, 26.0475}),
            Map.entry("Rapla County, Estonia", new double[]{58.9964, 24.7895}),
            Map.entry("Saare County, Estonia", new double[]{58.2528, 22.5039}),
            Map.entry("Võru County, Estonia", new double[]{57.8334, 27.0156}),
            Map.entry("Põlva County, Estonia", new double[]{58.0603, 27.0684})
    );

    private final List<String> estonianCityLocations = new ArrayList<>(estonianLocationCoordinates.keySet());
    private static final String OTHER = "other";

    private final List<String> genderOptions = Arrays.asList("male", "female", OTHER);

    public static String getWeightedRandomGender() {
        double rand = random.nextDouble();

        if (rand < 0.45) return "any";
        else if (rand < 0.7) return "male";
        else if (rand < 0.95) return "female";
        else return OTHER;
    }

    private final List<String> musicGenres = Arrays.asList(
            "rock", "pop", "jazz", "hip-hop", "classical", "blues", "reggae", "metal",
            "country", "electronic", "folk", "funk", "soul", "punk", "rnb", "house",
            "techno", "indie", "gospel", "ska", OTHER
    );

    private final List<String> methods = Arrays.asList(
            "singing", "djing", "piano", "guitar", "bass", "drums", "violin",
            "saxophone", "flute", "harp", "harmonica", "accordion", "ukulele",
            "keyboard", "cello", "sampling", "beatmaking", "looping", "sound_design",
            "midi", "vocoder", "electronic_drums", "beatboxing", "acapella", "rapping",
            "screaming", "falsetto", "head_voice", "harmonizing", "whispering", "voice_processing",
            "melismatic_singing", "field_recording", "found_sounds", "sound_collage",
            "live_instrumentation", "foley", OTHER
    );

    private final List<String> interests = Arrays.asList(
            "sports", "movies", "books", "technology", "travel", "gaming", "art",
            "fitness", "cooking", "fashion", "history", "politics", "science",
            "photography", "education", "environment", "nature", "animals", "writing",
            "poetry", "theater", "comedy", "dancing", "gardening", "crafting",
            "mental_health", "self_improvement", "spirituality", "philanthropy",
            "social_media", "entrepreneurship", "marketing", "finance", "investing",
            "real_estate", "board_games", "esports", "virtual_reality", "fashion_design",
            "interior_design", "architecture", "astronomy", "space", "robotics",
            "fishing", "hiking", "cycling", OTHER
    );

    private final List<String> personalityTraits = Arrays.asList(
            "introverted", "extroverted", "optimistic", "pessimistic", "creative",
            "analytical", "empathetic", "independent", "dependable", "adaptable",
            "organized", "spontaneous", "confident", "humble", "reliable", "loyal",
            "honest", "compassionate", "curious", "patient", "ambitious", "passionate",
            "self-disciplined", "funny", "sarcastic", "moody", "impulsive", "emotional",
            "stubborn", "practical", "realistic", "generous", "self-sufficient", "sensitive",
            "enthusiastic", "open-minded", "humorous", "thoughtful", "meticulous", "impassioned",
            "tolerant", "disciplined", "sociable", "resourceful", "visionary", "persuasive",
            "polite", "forgiving", "assertive", "inquisitive", "caring", "decisive"
    );

    private final List<String> goals = Arrays.asList(
            "have_fun", "make_a_band", "build_a_career", "collaborate_on_projects",
            "learn_new_skills", "perform_live", "write_original_music", "record_music",
            "experiment_with_genres", "create_impactful_music", "improve_technique",
            "network_in_music_industry", "make_music_videos", "gain_exposure",
            "join_music_community", "collaborate_with_others", "become_a_producer",
            "build_an_online_presence", "create_music_for_films", "inspire_others_with_music",
            "tour_and_perform", "create_a_music_label", "sell_music", "share_music_online",
            "release_albums", "achieve_mainstream_success", "collaborate_with_legendary_artists",
            "tour_worldwide", "stay_independent", "make_impactful_messages", "create_music_for_ads",
            "teach_music", "write_for_other_artists", "perform_in_famous_venues",
            "learn_music_theory", "form_a_collaborative_project", "create_instagram_music_content",
            "become_a_beatmaker", "join_a_music_festival", "promote_music_online",
            "collaborate_on_soundtracks", "find_other_musicians_online", "grow_music_collection",
            "participate_in_jams", "build_music_business", "produce_in_studios",
            "get_signed_to_a_label", "create_unique_music_ideas", "explore_music_collaborations"
    );

    private final List<String> matchLocationOptions = Arrays.asList("anywhere", "same_city", "same_country");

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            log.info("users already exist, stopping seeder");
            return;
        }

        List<User> users = new ArrayList<>();

        for (int i = 0; i < 100; i++) {
            User user = new User();
            user.setEmail(faker.internet().emailAddress());
            user.setPassword(encoder.encode("111"));
            user.setUsername(faker.name().firstName() + " " + faker.name().lastName());
            user.setGender(randomChoice(genderOptions));
            user.setAge(faker.number().numberBetween(16, 120));
            user.setProfilePicture(null);

            String locationText = randomCityCountryFromEstonia();
            user.setLocation(locationText);

            double[] coordinates = estonianLocationCoordinates.get(locationText);
            if (coordinates != null) {
                double lat = coordinates[0] + (random.nextDouble() - 0.5) * 0.1;
                double lng = coordinates[1] + (random.nextDouble() - 0.5) * 0.1;
                Point point = GeoUtils.createPoint(lat, lng);
                user.setCoordinates(point);
            }

            user.setMaxMatchRadius(random.nextInt(191) + 10);

            user.setDescription(faker.lorem().sentence());
            user.setLinkToMusic(faker.internet().url());
            user.setYearsOfMusicExperience(faker.number().numberBetween(0, 10));

            user.setPreferredMusicGenres(randomList(musicGenres));
            user.setPreferredMethods(randomList(methods));
            user.setAdditionalInterests(randomList(interests));
            user.setPersonalityTraits(randomList(personalityTraits));
            user.setGoalsWithMusic(randomList(goals));

            user.setIdealMatchGenres(randomList(musicGenres));
            user.setIdealMatchMethods(randomList(methods));
            user.setIdealMatchGoals(randomList(goals));

            user.setIdealMatchGender(getWeightedRandomGender());
            user.setIdealMatchAge(getWeightedRandomAgeRange());
            user.setIdealMatchLocation(randomChoice(matchLocationOptions));
            user.setIdealMatchYearsOfExperience(randomExperienceRange());

            users.add(user);
        }

        userRepository.saveAll(users);
        log.info("100 users successfully inserted with geolocation data");
    }

    private String randomChoice(List<String> options) {
        return options.get(random.nextInt(options.size()));
    }

    private List<String> randomList(List<String> options) {
        int count = random.nextInt(3) + 1;
        List<String> subset = new ArrayList<>();
        while (subset.size() < count) {
            String choice = randomChoice(options);
            if (!subset.contains(choice)) {
                subset.add(choice);
            }
        }
        return subset;
    }

    public static String getWeightedRandomAgeRange() {
        List<Map.Entry<String, Double>> weightedRanges = List.of(
                Map.entry("any", 0.50),
                Map.entry("12-21", 0.58),
                Map.entry("22-31", 0.66),
                Map.entry("32-41", 0.74),
                Map.entry("42-51", 0.82),
                Map.entry("52-61", 0.90),
                Map.entry("62-71", 0.92),
                Map.entry("72-81", 0.94),
                Map.entry("82-91", 0.96),
                Map.entry("92-101", 0.98),
                Map.entry("102-111", 0.99),
                Map.entry("112-120", 1.0)
        );

        double rand = random.nextDouble();

        for (Map.Entry<String, Double> range : weightedRanges) {
            if (rand < range.getValue()) {
                return range.getKey();
            }
        }

        return "any";
    }

    private String randomExperienceRange() {
        List<String> experienceRanges = Arrays.asList("0-2", "3-5", "6-8", "9-11");
        return randomChoice(experienceRanges);
    }

    private String randomCityCountryFromEstonia() {
        return estonianCityLocations.get(random.nextInt(estonianCityLocations.size()));
    }
}
