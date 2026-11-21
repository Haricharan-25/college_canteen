package com.campusbite.backend.config;

import com.campusbite.backend.model.Food;
import com.campusbite.backend.model.Order;
import com.campusbite.backend.model.OrderItem;
import com.campusbite.backend.model.User;
import com.campusbite.backend.repository.FoodRepository;
import com.campusbite.backend.repository.OrderRepository;
import com.campusbite.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, FoodRepository foodRepository, OrderRepository orderRepository) {
        return args -> {
            // Seed Users if table is empty
            if (userRepository.count() == 0) {
                User admin = new User(null, "Admin Canteen Staff", "admin@canteen.com", "admin123", "ADMIN");
                User student1 = new User(null, "Rahul Sharma", "rahul@college.edu", "student123", "STUDENT");
                User student2 = new User(null, "Priya Patel", "priya@college.edu", "student123", "STUDENT");
                userRepository.saveAll(Arrays.asList(admin, student1, student2));
                System.out.println(">>> Seeded default Users into MySQL database.");
            }

            // Seed / Sync rich variety of Food items across all 4 categories
            List<Food> defaultFoods = Arrays.asList(
                // ==================== BREAKFAST ====================
                new Food("Masala Dosa with Sambar & Chutney",
                         "Crispy golden crepe made of fermented rice-lentil batter filled with mildly spiced potato masala, served with coconut chutney and hot sambar.",
                         new BigDecimal("60.00"), "Breakfast",
                         "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80", true),

                new Food("Idli Vada Combo",
                         "Two steamed fluffy rice cakes and one crispy golden medu vada served with home-style spiced lentil sambar and tangy tomato chutney.",
                         new BigDecimal("50.00"), "Breakfast",
                         "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80", true),

                new Food("Onion Rava Masala Dosa",
                         "Semolina wheat crepe laced with finely chopped onions, green chilies, and roasted cumin, served crispy with podi and chutneys.",
                         new BigDecimal("65.00"), "Breakfast",
                         "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80", true),

                new Food("Indori Poha with Sev & Peanuts",
                         "Steamed flattened rice tempered with mustard seeds, turmeric, green chilies, roasted crunchy peanuts, and Ratlami sev.",
                         new BigDecimal("35.00"), "Breakfast",
                         "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80", true),

                new Food("Poori Bhaji Hot Platter",
                         "Three golden puffed whole wheat pooris served with authentic Delhi-style spiced dry potato curry and tangy carrot pickle.",
                         new BigDecimal("55.00"), "Breakfast",
                         "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80", true),

                new Food("Ghee Upma with Cashews",
                         "Roasted semolina porridge tempered with clarified butter, ginger, curry leaves, and crunchy roasted cashew nuts.",
                         new BigDecimal("40.00"), "Breakfast",
                         "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80", true),

                // ==================== LUNCH ====================
                new Food("Paneer Butter Masala Meal",
                         "Rich creamy tomato gravy with tender cottage cheese cubes, served with 2 warm butter rotis, fragrant jeera rice, and cucumber salad.",
                         new BigDecimal("120.00"), "Lunch",
                         "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80", true),

                new Food("Special Veg Biryani Combo",
                         "Dum-cooked long-grain basmati rice with farm vegetables, saffron, mint, and spices. Accompanied by creamy boondi raita and spicy salan.",
                         new BigDecimal("110.00"), "Lunch",
                         "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80", true),

                new Food("Chole Bhature Platter",
                         "Two golden fluffy deep-fried bhaturas served with spicy authentic Amritsari chickpea curry, pickled onions, and mint chutney.",
                         new BigDecimal("90.00"), "Lunch",
                         "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80", true),

                new Food("South Indian Special Thali",
                         "Complete meal with steamed rice, sambar, rasam, kootu vegetable, curd, appalam, pickle, and sweet vermicelli payasam.",
                         new BigDecimal("100.00"), "Lunch",
                         "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&auto=format&fit=crop&q=80", true),

                new Food("Dal Makhani & Jeera Rice Combo",
                         "Slow-cooked black lentils in rich butter cream gravy, served alongside aromatic cumin-tempered basmati rice and salad.",
                         new BigDecimal("95.00"), "Lunch",
                         "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&auto=format&fit=crop&q=80", true),

                new Food("Rajma Chawal Special Lunch",
                         "Authentic North Indian red kidney beans slow-simmered in thick tomato-onion gravy served over steaming basmati rice.",
                         new BigDecimal("85.00"), "Lunch",
                         "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80", true),

                // ==================== SNACKS ====================
                new Food("Samosa Chaat Platter",
                         "Two crushed golden spiced potato samosas topped with warm chana masala, sweetened yoghurt, mint chutney, and tamarind drizzle.",
                         new BigDecimal("45.00"), "Snacks",
                         "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", true),

                new Food("Veg Grilled Cheese Sandwich",
                         "Three-layer grilled whole wheat bread stuffed with melted mozzarella, bell peppers, sweet corn, and house herb-mayo spread.",
                         new BigDecimal("70.00"), "Snacks",
                         "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80", true),

                new Food("Pav Bhaji Extra Butter",
                         "Spiced buttery mashed vegetable medley slow-cooked on tawa, served with 2 toasted pav buns, lemon wedge, and chopped onions.",
                         new BigDecimal("75.00"), "Snacks",
                         "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80", true),

                new Food("Paneer Tikka Kathi Roll",
                         "Char-grilled spiced paneer cubes wrapped in layered flaky paratha with sliced bell peppers, mint mayo, and chaat masala.",
                         new BigDecimal("80.00"), "Snacks",
                         "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80", true),

                new Food("Mumbai Classic Vada Pav",
                         "Crispy fried spiced potato dumpling stuffed inside soft pav bun slathered with spicy garlic dry chutney and fried green chili.",
                         new BigDecimal("30.00"), "Snacks",
                         "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80", true),

                new Food("Masala Cheese Maggi",
                         "College canteen special double masala noodles tossed with diced capsicum, sweet corn, melted processed cheese, and oregano.",
                         new BigDecimal("50.00"), "Snacks",
                         "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80", true),

                new Food("Crispy Peri Peri French Fries",
                         "Fresh golden potato french fries dusted with spicy African bird's eye chili seasoning, served with creamy mayonnaise.",
                         new BigDecimal("60.00"), "Snacks",
                         "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80", true),

                // ==================== BEVERAGES ====================
                new Food("Kulhad Masala Chai",
                         "Freshly brewed strong Assam tea leaves boiled with crushed ginger, green cardamom, cloves, and whole milk, served piping hot.",
                         new BigDecimal("20.00"), "Beverages",
                         "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80", true),

                new Food("Cold Coffee with Ice Cream",
                         "Chilled frothy dark coffee blended with milk, sweetened cream, and crowned with a generous scoop of vanilla ice cream and chocolate syrup.",
                         new BigDecimal("55.00"), "Beverages",
                         "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80", true),

                new Food("Fresh Mango Lassi",
                         "Rich, thick chilled yogurt beverage blended with sweet Alphonso mango pulp, cardamom, and roasted pistachio slivers.",
                         new BigDecimal("50.00"), "Beverages",
                         "https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80", true),

                new Food("Kesar Badam Milk",
                         "Chilled milk infused with Kashmiri saffron strands, crushed almonds, cardamom powder, and roasted nut slivers.",
                         new BigDecimal("45.00"), "Beverages",
                         "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80", true),

                new Food("Fresh Lemon Mint Soda",
                         "Refreshing sparkling soda with fresh squeezed lemon juice, crushed mint leaves, black salt, and roasted cumin.",
                         new BigDecimal("30.00"), "Beverages",
                         "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80", true),

                new Food("Chocolate Milkshake with Choco Chips",
                         "Thick blended Belgian chocolate shake topped with rich whipped cream, cocoa dusting, and crunchy dark chocolate chips.",
                         new BigDecimal("60.00"), "Beverages",
                         "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80", true)
            );

            // Synchronize items so duplicates aren't created and missing items are saved
            List<Food> existingFoods = foodRepository.findAll();
            for (Food food : defaultFoods) {
                boolean alreadyExists = existingFoods.stream()
                        .anyMatch(existing -> existing.getName().equalsIgnoreCase(food.getName()));
                if (!alreadyExists) {
                    foodRepository.save(food);
                }
            }
            System.out.println(">>> Verified & synchronized " + foodRepository.count() + " food items in MySQL database.");

            // Seed Sample Orders for student Rahul Sharma (ID: 2) if empty
            if (orderRepository.count() == 0) {
                userRepository.findByEmail("rahul@college.edu").ifPresent(student -> {
                    Food dosa = foodRepository.findAll().stream().filter(f -> f.getName().contains("Dosa")).findFirst().orElse(null);
                    Food chai = foodRepository.findAll().stream().filter(f -> f.getName().contains("Chai")).findFirst().orElse(null);
                    Food biryani = foodRepository.findAll().stream().filter(f -> f.getName().contains("Biryani")).findFirst().orElse(null);

                    if (dosa != null && chai != null) {
                        Order sample1 = new Order("CB-DEMO-001", student, new BigDecimal("80.00"), "Preparing");
                        sample1.addItem(new OrderItem(sample1, dosa, dosa.getName(), 1, dosa.getPrice(), dosa.getPrice()));
                        sample1.addItem(new OrderItem(sample1, chai, chai.getName(), 1, chai.getPrice(), chai.getPrice()));
                        orderRepository.save(sample1);
                    }

                    if (biryani != null) {
                        Order sample2 = new Order("CB-DEMO-002", student, new BigDecimal("110.00"), "Completed");
                        sample2.addItem(new OrderItem(sample2, biryani, biryani.getName(), 1, biryani.getPrice(), biryani.getPrice()));
                        orderRepository.save(sample2);
                    }
                    System.out.println(">>> Seeded sample orders for demonstration.");
                });
            }
        };
    }
}
