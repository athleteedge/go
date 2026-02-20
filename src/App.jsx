import { useState, useEffect, useRef } from "react";

// NOTE: This import works in your local VS Code project with supabase.js in src/
// import { supabase } from "./supabase";

const SPORTS = ["Swimming","Basketball","Soccer","Fencing","Ice Skating","Track & Field","Gymnastics","Cycling","Tennis","Volleyball","Wrestling","Rowing"];
const LEVELS = ["Recreational","Amateur","Elite"];
const GOALS = ["Weight Management","Endurance","Strength","Recovery","Competition Prep"];
const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const AVATARS = ["🏊","🏀","⚽","🤺","⛸️","🏃","🤸","🚴","🎾","🏐","🤼","🚣","👤"];
const COLORS = {
  Swimming:"#0ea5e9",Basketball:"#f97316",Soccer:"#22c55e",Fencing:"#8b5cf6",
  "Ice Skating":"#38bdf8","Track & Field":"#eab308",Gymnastics:"#ec4899",
  Cycling:"#f43f5e",Tennis:"#84cc16",Volleyball:"#fb923c",Wrestling:"#a855f7",Rowing:"#14b8a6"
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NUTRITION_DATA = {
  Swimming:{
    macros:{carbs:55,protein:25,fats:20},
    weeklyMeals:{
      Mon:{breakfast:"Oatmeal with banana, honey & almonds + 2 boiled eggs",lunch:"Grilled chicken wrap with avocado, spinach & brown rice",dinner:"Salmon fillet with sweet potato mash & steamed broccoli",snacks:"Greek yogurt + mixed berries | Handful of trail mix"},
      Tue:{breakfast:"Whole grain toast with peanut butter + protein smoothie",lunch:"Tuna salad with quinoa, cucumber & lemon dressing",dinner:"Turkey stir-fry with noodles & bok choy",snacks:"Apple slices with almond butter | Rice cakes"},
      Wed:{breakfast:"Scrambled eggs (3) with spinach, tomato on sourdough",lunch:"Lentil soup with crusty bread & side salad",dinner:"Grilled sea bass, roasted vegetables & couscous",snacks:"Banana + protein bar | Cottage cheese"},
      Thu:{breakfast:"Overnight oats with chia seeds, mango & coconut flakes",lunch:"Chicken Caesar salad with whole grain croutons",dinner:"Beef mince stir-fry with brown rice & mixed peppers",snacks:"Handful of nuts | Orange + dark chocolate"},
      Fri:{breakfast:"Smoothie bowl: banana, berries, granola, flaxseed",lunch:"Prawn & avocado salad with wholegrain bread",dinner:"Pasta with lean bolognese & side salad",snacks:"Protein shake | Carrot sticks with hummus"},
      Sat:{breakfast:"Pancakes (whole grain) with Greek yogurt & strawberries",lunch:"Grilled chicken with sweet potato wedges & slaw",dinner:"Tuna steak, asparagus & roasted new potatoes",snacks:"Pre-competition: banana + energy gel | Post: chocolate milk"},
      Sun:{breakfast:"Full recovery breakfast: eggs, avocado, smoked salmon, rye bread",lunch:"Buddha bowl: quinoa, roasted veg, chickpeas, tahini",dinner:"Slow-cooked chicken casserole with root vegetables",snacks:"Rest day: fruit salad | Low-fat yogurt"},
    },
    foods:{eat:["Oily fish (salmon, tuna, mackerel)","Complex carbs (oats, brown rice, sweet potato)","Lean proteins (chicken, turkey, eggs)","Leafy greens (spinach, kale)","Nuts & seeds","Greek yogurt","Bananas & berries"],avoid:["Processed sugars","Fried foods","Carbonated drinks","High-fat dairy before training","Alcohol","Excessive caffeine"]},
  },
  Basketball:{
    macros:{carbs:50,protein:30,fats:20},
    weeklyMeals:{
      Mon:{breakfast:"Overnight oats with protein powder, banana & walnuts",lunch:"Grilled chicken breast with brown rice & roasted peppers",dinner:"Lean beef tacos with black beans, salsa & guacamole",snacks:"Protein shake | Apple with peanut butter"},
      Tue:{breakfast:"Egg white omelette with mushrooms, spinach & whole grain toast",lunch:"Turkey & avocado sandwich on whole grain with side salad",dinner:"Baked salmon with quinoa & steamed green beans",snacks:"Banana + trail mix | Greek yogurt with honey"},
      Wed:{breakfast:"Protein smoothie: whey, oats, banana, almond milk, berries",lunch:"Lentil & vegetable curry with brown rice",dinner:"Grilled chicken thighs with sweet potato fries & coleslaw",snacks:"Rice cakes with cottage cheese | Orange"},
      Thu:{breakfast:"French toast (whole grain) with eggs, maple syrup & berries",lunch:"Prawn stir-fry with noodles & mixed vegetables",dinner:"Turkey meatballs with whole grain pasta & tomato sauce",snacks:"Pre-practice: banana + energy bar | Post: chocolate milk"},
      Fri:{breakfast:"Granola with Greek yogurt, honey & mixed berries",lunch:"Chicken Caesar wrap with whole grain tortilla",dinner:"Steak with roasted potatoes & asparagus",snacks:"Protein bar | Handful of mixed nuts"},
      Sat:{breakfast:"Power breakfast: 3 eggs, avocado toast, orange juice",lunch:"Game day meal: pasta with chicken & light tomato sauce",dinner:"Recovery: grilled fish, brown rice & steamed vegetables",snacks:"Game: banana halftime | Post: protein shake"},
      Sun:{breakfast:"Veggie omelette with goat cheese & whole grain toast",lunch:"Buddha bowl with roasted chicken, quinoa & tahini dressing",dinner:"Slow-roasted chicken with root vegetables & gravy",snacks:"Rest day: smoothie | Dark chocolate & nuts"},
    },
    foods:{eat:["Lean meats (chicken, turkey, fish)","Complex carbs (brown rice, oats, sweet potato)","Legumes (black beans, lentils)","Avocado","Berries & citrus fruits","Nuts & seeds","Electrolyte drinks during games"],avoid:["Fast food","Sugary drinks","Heavy pasta before games","Alcohol","Processed snacks","Large meals within 2hrs of play"]},
  },
  Soccer:{
    macros:{carbs:58,protein:22,fats:20},
    weeklyMeals:{
      Mon:{breakfast:"Porridge with banana and honey + orange juice",lunch:"Pasta with grilled chicken, olive oil and vegetables",dinner:"Salmon with brown rice and steamed spinach",snacks:"Energy bar | Banana"},
      Tue:{breakfast:"Whole grain toast + scrambled eggs + avocado",lunch:"Quinoa salad with tuna, cucumber and lemon",dinner:"Chicken stir fry with noodles and mixed veg",snacks:"Greek yogurt | Apple"},
      Wed:{breakfast:"Smoothie: oats, banana, almond milk, protein powder",lunch:"Lentil soup with wholegrain bread",dinner:"Lean beef burger (no bun) with sweet potato and salad",snacks:"Rice cakes with peanut butter | Orange"},
      Thu:{breakfast:"Oatmeal with berries, flaxseed and almonds",lunch:"Grilled chicken with couscous and roasted peppers",dinner:"Prawn pasta with tomato sauce and side salad",snacks:"Trail mix | Protein shake"},
      Fri:{breakfast:"Eggs benedict on wholegrain with spinach",lunch:"Brown rice bowl with teriyaki chicken and broccoli",dinner:"Baked cod with potatoes and green beans",snacks:"Banana + energy gel pre-training | Milk post"},
      Sat:{breakfast:"Match day: pasta with light sauce 3hrs before",lunch:"Light snack 2hrs before: banana + toast",dinner:"Recovery meal: chicken, rice and steamed veg",snacks:"Half time: orange slices | Post-match: protein shake"},
      Sun:{breakfast:"Full English (healthy): eggs, beans, grilled tomato, wholegrain toast",lunch:"Buddha bowl with mixed grains and roasted veg",dinner:"Slow cooker chicken and vegetable stew",snacks:"Rest: fruit salad | Smoothie"},
    },
    foods:{eat:["Pasta and brown rice for carbs","Lean meats and fish","Fresh fruits and vegetables","Isotonic sports drinks","Eggs for protein recovery","Beetroot juice for endurance","Iron-rich foods (spinach, lean red meat)"],avoid:["Carbonated drinks on match day","Heavy fatty meals before games","Alcohol especially post-match","Excessive sugar","Processed foods","Dehydrating foods (excess salt)"]},
  },
  "Track & Field":{
    macros:{carbs:52,protein:28,fats:20},
    weeklyMeals:{
      Mon:{breakfast:"Oatmeal with protein powder, banana and nut butter",lunch:"Grilled chicken with brown rice and roasted vegetables",dinner:"Salmon with quinoa and steamed asparagus",snacks:"Protein shake | Mixed nuts"},
      Tue:{breakfast:"Eggs (3) on wholegrain toast with avocado",lunch:"Turkey and quinoa salad with lemon dressing",dinner:"Beef stir fry with noodles and bok choy",snacks:"Banana | Rice cakes with hummus"},
      Wed:{breakfast:"Greek yogurt parfait with granola and berries",lunch:"Lentil curry with brown rice",dinner:"Grilled chicken thighs with sweet potato and greens",snacks:"Energy bar | Apple with peanut butter"},
      Thu:{breakfast:"Smoothie bowl with protein, berries and seeds",lunch:"Tuna salad wrap with whole grain tortilla",dinner:"Turkey meatballs with pasta and tomato sauce",snacks:"Pre-session: banana | Post: protein shake"},
      Fri:{breakfast:"Overnight oats with chia, mango and coconut",lunch:"Chicken breast with couscous and roasted peppers",dinner:"Baked salmon with new potatoes and green beans",snacks:"Trail mix | Chocolate milk"},
      Sat:{breakfast:"Competition day: toast with honey 2-3hrs before",lunch:"Light: banana + peanut butter rice cakes",dinner:"Recovery: steak, rice and steamed vegetables",snacks:"During: energy gels | Post: protein + carbs"},
      Sun:{breakfast:"Full recovery: eggs, avocado, smoked salmon, rye toast",lunch:"Buddha bowl with quinoa, chickpeas and tahini",dinner:"Slow cooked beef and vegetable casserole",snacks:"Rest day: light snacks | Fruit and yogurt"},
    },
    foods:{eat:["Iron rich foods (lean red meat, spinach)","Complex carbs on hard training days","Beetroot juice for performance","Lean proteins every meal","Magnesium rich foods (nuts, seeds)","Tart cherry juice for recovery","Caffeine strategically pre-competition"],avoid:["Heavy meals before speed sessions","Excessive fibre pre-competition","Alcohol during training blocks","Sugary processed foods","Undereating on hard days","Skipping post-training nutrition"]},
  },
  Gymnastics:{
    macros:{carbs:45,protein:30,fats:25},
    weeklyMeals:{
      Mon:{breakfast:"Overnight oats with berries, chia seeds and almond milk",lunch:"Grilled chicken salad with quinoa and avocado",dinner:"Salmon with roasted sweet potato and green beans",snacks:"Greek yogurt | Small handful of almonds"},
      Tue:{breakfast:"Protein pancakes with berries and maple syrup",lunch:"Turkey and avocado wrap on whole grain",dinner:"Chicken stir fry with brown rice and vegetables",snacks:"Apple with peanut butter | Rice cakes"},
      Wed:{breakfast:"Scrambled eggs with spinach and whole grain toast",lunch:"Lentil soup with crusty whole grain bread",dinner:"Lean beef with roasted vegetables and couscous",snacks:"Protein bar | Orange segments"},
      Thu:{breakfast:"Smoothie: banana, spinach, protein powder, almond milk",lunch:"Tuna salad with quinoa and cucumber",dinner:"Baked chicken with sweet potato mash and broccoli",snacks:"Cottage cheese | Berries"},
      Fri:{breakfast:"Granola with Greek yogurt, honey and seeds",lunch:"Prawn and avocado salad with whole grain crackers",dinner:"Turkey mince with pasta and tomato sauce",snacks:"Banana + nut mix | Chocolate milk"},
      Sat:{breakfast:"Performance: oats with banana 2hrs before training",lunch:"Light: yogurt bowl with fruit and granola",dinner:"Recovery: grilled fish, rice, steamed veg",snacks:"Pre-training: energy bar | Post: protein shake"},
      Sun:{breakfast:"Rest day: eggs benedict with whole grain",lunch:"Buddha bowl: quinoa, roasted veg, tahini dressing",dinner:"Slow cooked chicken casserole",snacks:"Rest: fruit platter | Low fat yogurt"},
    },
    foods:{eat:["Calcium rich foods (dairy, leafy greens)","Vitamin D (eggs, salmon, fortified foods)","Lean proteins for muscle tone","Complex carbs for energy","Iron rich foods for female athletes","Antioxidant rich berries","Bone broth for joint health"],avoid:["Extreme calorie restriction","High fat foods before training","Carbonated drinks","Excessive sugar","Skipping meals","Disordered eating patterns — seek help if needed"]},
  },
};
const getNutrition = s => NUTRITION_DATA[s] || NUTRITION_DATA.Swimming;

const WORKOUT_DATA = {
  Swimming:{
    Recreational:{
      Mon:{focus:"Endurance Swim",warmup:"10 min easy freestyle, 200m drills",exercises:[{name:"Freestyle Intervals",sets:"6x100m",rest:"30s",tips:"Focus on breathing every 3 strokes",alt:"Breaststroke if tired",prog:"Increase to 8x100m after 2 weeks",yt:"https://youtube.com/results?search_query=freestyle+swimming+technique"},{name:"Kickboard Drills",sets:"4x50m",rest:"20s",tips:"Keep hips high, small fast kicks",alt:"Pull buoy instead",prog:"Add fins for resistance",yt:"https://youtube.com/results?search_query=swimming+kickboard+drills"},{name:"Pull Buoy Sets",sets:"4x100m",rest:"30s",tips:"Focus on arm pull and high elbow",alt:"Paddles for extra resistance",prog:"Increase distance to 150m",yt:"https://youtube.com/results?search_query=pull+buoy+swimming+technique"}],cooldown:"200m easy backstroke + stretching"},
      Tue:{focus:"Strength & Dryland",warmup:"10 min jog + dynamic stretching",exercises:[{name:"Push-Ups",sets:"3x15",rest:"60s",tips:"Keep core tight, full range of motion",alt:"Knee push-ups for beginners",prog:"Progress to diamond push-ups",yt:"https://youtube.com/results?search_query=proper+pushup+form"},{name:"Lat Pulldowns",sets:"3x12",rest:"60s",tips:"Pull to upper chest, squeeze lats",alt:"Resistance band pulldowns",prog:"Increase weight 5% each week",yt:"https://youtube.com/results?search_query=lat+pulldown+technique"},{name:"Plank Hold",sets:"3x45s",rest:"45s",tips:"Keep hips level, breathe steadily",alt:"Knee plank",prog:"Increase to 60s then add shoulder taps",yt:"https://youtube.com/results?search_query=plank+core+exercise"}],cooldown:"Full body stretch 10 min"},
      Wed:{focus:"Active Recovery",warmup:"None needed",exercises:[{name:"Easy Swim",sets:"20 min continuous",rest:"N/A",tips:"Stay at 50-60% effort, enjoy it",alt:"Light water walking",prog:"Focus on technique not speed",yt:"https://youtube.com/results?search_query=active+recovery+swimming"},{name:"Yoga / Mobility",sets:"30 min session",rest:"N/A",tips:"Focus on shoulders, hips and thoracic spine",alt:"Foam rolling session",prog:"Add 10 min daily",yt:"https://youtube.com/results?search_query=yoga+for+swimmers"}],cooldown:"5 min meditation or breathing"},
      Thu:{focus:"Speed Work",warmup:"400m easy + 4x25m accelerations",exercises:[{name:"Sprint 25m",sets:"8x25m",rest:"45s",tips:"Maximum effort, explosive start",alt:"Reduce to 6 reps",prog:"Reduce rest to 30s",yt:"https://youtube.com/results?search_query=swimming+sprint+technique"},{name:"Turn Practice",sets:"10 turns",rest:"20s",tips:"Tight tuck, push hard off wall",alt:"Practice above water first",prog:"Add underwater dolphin kicks",yt:"https://youtube.com/results?search_query=swimming+flip+turn+tutorial"},{name:"Race Pace 50m",sets:"4x50m",rest:"60s",tips:"Hold race pace, not all-out",alt:"25m intervals",prog:"Increase to 6 reps",yt:"https://youtube.com/results?search_query=swimming+race+pace+training"}],cooldown:"300m easy + full stretch"},
      Fri:{focus:"Technique Day",warmup:"200m easy choice stroke",exercises:[{name:"Catch-Up Drill",sets:"6x50m",rest:"20s",tips:"Full arm extension before other arm pulls",alt:"Fingertip drag drill",prog:"Combine with pull buoy",yt:"https://youtube.com/results?search_query=catch+up+drill+swimming"},{name:"Bilateral Breathing",sets:"4x100m",rest:"30s",tips:"Breathe every 3 strokes consistently",alt:"Every 5 strokes for advanced",prog:"Maintain in race situations",yt:"https://youtube.com/results?search_query=bilateral+breathing+freestyle"}],cooldown:"200m backstroke + stretching"},
      Sat:{focus:"Long Distance",warmup:"400m progressive",exercises:[{name:"Continuous Swim",sets:"1500m steady",rest:"N/A",tips:"Maintain consistent pace throughout",alt:"Break into 3x500m with 1 min rest",prog:"Increase by 200m per week",yt:"https://youtube.com/results?search_query=open+water+swimming+technique"},{name:"Negative Split 400m",sets:"2x400m",rest:"2 min",tips:"Second 200m faster than first 200m",alt:"Even split if tired",prog:"Apply to longer distances",yt:"https://youtube.com/results?search_query=negative+split+swimming"}],cooldown:"400m easy + full stretch"},
      Sun:{focus:"Rest & Recovery",warmup:"N/A",exercises:[{name:"Full Rest or Walk",sets:"20-30 min walk",rest:"N/A",tips:"Keep it easy, focus on mental recovery",alt:"Complete rest is fine",prog:"Add mindfulness practice",yt:"https://youtube.com/results?search_query=active+recovery+day+athletes"},{name:"Foam Rolling",sets:"15 min full body",rest:"N/A",tips:"Spend extra time on shoulders and quads",alt:"Massage gun",prog:"Add lacrosse ball for deeper work",yt:"https://youtube.com/results?search_query=foam+rolling+full+body"}],cooldown:"N/A"},
    },
    Amateur:{
      Mon:{focus:"High Volume Endurance",warmup:"600m progressive build",exercises:[{name:"Distance Sets",sets:"4x400m",rest:"25s",tips:"Hold threshold pace throughout",alt:"Reduce to 3x400m if fatigued",prog:"Increase to 5x400m",yt:"https://youtube.com/results?search_query=swimming+threshold+training"},{name:"IM Sets",sets:"3x200m IM",rest:"40s",tips:"Strong butterfly, maintain stroke quality",alt:"2x200m IM",prog:"Reduce rest by 5s weekly",yt:"https://youtube.com/results?search_query=individual+medley+swimming"},{name:"Descending 100s",sets:"6x100m descending",rest:"20s",tips:"Each rep faster than the last",alt:"4 reps",prog:"Add 2 reps monthly",yt:"https://youtube.com/results?search_query=descending+sets+swimming"}],cooldown:"500m easy mixed strokes + stretching"},
      Tue:{focus:"Strength & Power",warmup:"10 min jog + dynamic stretching",exercises:[{name:"Pull-Ups",sets:"4x8",rest:"90s",tips:"Full range, dead hang to chin over bar",alt:"Assisted pull-ups or lat pulldown",prog:"Add weight belt",yt:"https://youtube.com/results?search_query=pull+ups+technique"},{name:"Medicine Ball Slams",sets:"4x12",rest:"60s",tips:"Full extension overhead, explosive slam",alt:"Kettlebell swings",prog:"Increase ball weight",yt:"https://youtube.com/results?search_query=medicine+ball+slams"},{name:"TRX Rows",sets:"3x15",rest:"60s",tips:"Keep body straight, squeeze shoulder blades",alt:"Dumbbell rows",prog:"Elevate feet",yt:"https://youtube.com/results?search_query=TRX+row+technique"}],cooldown:"Full body stretch 15 min"},
      Wed:{focus:"Active Recovery + Technique",warmup:"300m easy",exercises:[{name:"Stroke Drills",sets:"8x50m drills",rest:"15s",tips:"Focus on one aspect per rep",alt:"Video analysis if available",prog:"Apply to full stroke",yt:"https://youtube.com/results?search_query=swimming+stroke+drills"},{name:"Mobility Flow",sets:"20 min",rest:"N/A",tips:"Thoracic rotation, hip flexors, ankles",alt:"Yoga for swimmers video",prog:"Add shoulder specific work",yt:"https://youtube.com/results?search_query=mobility+flow+athletes"}],cooldown:"10 min stretching"},
      Thu:{focus:"Speed & Lactate",warmup:"500m + 6x25m fast",exercises:[{name:"Sprint 50m",sets:"10x50m",rest:"30s",tips:"Maximum effort each rep",alt:"8 reps",prog:"Reduce rest to 20s",yt:"https://youtube.com/results?search_query=swimming+lactate+training"},{name:"Race Sim 200m",sets:"3x200m race pace",rest:"3 min",tips:"Negative split if possible",alt:"2x200m",prog:"Reduce rest to 2 min",yt:"https://youtube.com/results?search_query=race+simulation+swimming"}],cooldown:"400m easy + stretching"},
      Fri:{focus:"Technique Refinement",warmup:"400m easy",exercises:[{name:"Video Analysis Swim",sets:"6x100m",rest:"1 min",tips:"Focus on feedback from coach or video",alt:"Drill-swim-drill sets",prog:"Implement 1 change per session",yt:"https://youtube.com/results?search_query=swimming+technique+analysis"},{name:"Underwaters",sets:"8x25m underwater",rest:"45s",tips:"Dolphin kick, streamline off every wall",alt:"Reduce to 15m",prog:"Increase distance",yt:"https://youtube.com/results?search_query=underwater+dolphin+kick"}],cooldown:"300m choice + stretching"},
      Sat:{focus:"Race Prep",warmup:"800m progressive",exercises:[{name:"Race Pace Sets",sets:"4x100m at race pace",rest:"2 min",tips:"Simulate race conditions exactly",alt:"2x100m",prog:"Add 50m at start above race pace",yt:"https://youtube.com/results?search_query=race+pace+swimming+training"},{name:"Race Simulation",sets:"Full race distance",rest:"N/A",tips:"Full effort, treat as real race",alt:"Half race distance",prog:"Add warm-up and cool-down protocol",yt:"https://youtube.com/results?search_query=swimming+race+simulation"}],cooldown:"600m easy + full stretch"},
      Sun:{focus:"Full Rest",warmup:"N/A",exercises:[{name:"Rest & Recovery",sets:"No training",rest:"N/A",tips:"Sleep 9hrs, eat well, hydrate",alt:"Light walk if restless",prog:"Mental preparation for next week",yt:"https://youtube.com/results?search_query=athlete+rest+day+recovery"},{name:"Foam Roll & Stretch",sets:"20 min",rest:"N/A",tips:"Full body focus on sore areas",alt:"Hot bath with Epsom salts",prog:"Book monthly sports massage",yt:"https://youtube.com/results?search_query=foam+rolling+recovery"}],cooldown:"N/A"},
    },
    Elite:{
      Mon:{focus:"High Volume Endurance",warmup:"800m progressive build",exercises:[{name:"Distance Sets",sets:"5x400m",rest:"20s",tips:"Hold threshold pace throughout all sets",alt:"Reduce to 4x400m if fatigued",prog:"Increase to 6x400m, tighten rest",yt:"https://youtube.com/results?search_query=elite+swimming+endurance+training"},{name:"IM Sets",sets:"4x200m IM",rest:"30s",tips:"Strong butterfly, maintain stroke quality",alt:"2x400m IM",prog:"Reduce rest interval by 5s weekly",yt:"https://youtube.com/results?search_query=individual+medley+swimming+training"},{name:"Descending 100s",sets:"8x100m descending",rest:"15s",tips:"Each rep faster than the last",alt:"6 reps",prog:"Add 2 reps monthly",yt:"https://youtube.com/results?search_query=descending+sets+swimming"}],cooldown:"600m easy mixed strokes + stretching"},
      Tue:{focus:"Power & Strength",warmup:"Dynamic + activation",exercises:[{name:"Olympic Lifts (Power Clean)",sets:"5x3",rest:"2 min",tips:"Explosive triple extension, catch in quarter squat",alt:"Hang clean",prog:"Increase load 2.5kg weekly",yt:"https://youtube.com/results?search_query=power+clean+technique"},{name:"Weighted Pull-Ups",sets:"5x5",rest:"2 min",tips:"Full range, controlled descent",alt:"Lat pulldown",prog:"Add 2.5kg weekly",yt:"https://youtube.com/results?search_query=weighted+pull+ups"},{name:"Core Circuit",sets:"4 rounds",rest:"30s between exercises",tips:"Dead bugs, hollow holds, pallof press",alt:"Plank variations",prog:"Add instability (bosu ball)",yt:"https://youtube.com/results?search_query=elite+core+training+athletes"}],cooldown:"Full body stretch 20 min"},
      Wed:{focus:"Active Recovery + Drills",warmup:"400m easy",exercises:[{name:"Technical Drills",sets:"10x50m drills",rest:"10s",tips:"Perfect execution over speed",alt:"Video review session",prog:"Translate to full stroke immediately",yt:"https://youtube.com/results?search_query=elite+swimming+drills"},{name:"Yoga & Mobility",sets:"45 min",rest:"N/A",tips:"Thoracic, hip, ankle mobility focus",alt:"Pilates for swimmers",prog:"Daily 15 min minimum",yt:"https://youtube.com/results?search_query=yoga+flexibility+elite+athletes"}],cooldown:"15 min stretching"},
      Thu:{focus:"Speed & Lactate Threshold",warmup:"600m + 8x25m sprint",exercises:[{name:"Sprint Sets",sets:"12x50m",rest:"25s",tips:"Max effort, perfect technique",alt:"10 reps",prog:"Reduce rest 5s monthly",yt:"https://youtube.com/results?search_query=elite+swimming+speed+work"},{name:"Lactate Sets",sets:"4x200m above threshold",rest:"3 min",tips:"Uncomfortable pace you can barely hold",alt:"3x200m",prog:"Reduce rest by 30s",yt:"https://youtube.com/results?search_query=lactate+threshold+swimming"},{name:"Fast 25s",sets:"8x25m all-out",rest:"60s",tips:"Explosive start, hold speed to wall",alt:"6 reps",prog:"Add resisted (parachute)",yt:"https://youtube.com/results?search_query=all+out+sprint+swimming"}],cooldown:"500m easy + stretch"},
      Fri:{focus:"Technique & Video Analysis",warmup:"500m",exercises:[{name:"Coach Feedback Set",sets:"8x100m",rest:"45s",tips:"Apply coach feedback each rep",alt:"Self-record and review",prog:"One technical focus per month",yt:"https://youtube.com/results?search_query=elite+swimming+coaching"},{name:"Starts & Turns",sets:"20 starts, 20 turns",rest:"30s",tips:"Reaction time + underwater maximised",alt:"Starts only if turns fatiguing",prog:"Time underwater splits",yt:"https://youtube.com/results?search_query=competitive+swimming+starts+turns"}],cooldown:"400m easy + full stretch"},
      Sat:{focus:"Race Simulation",warmup:"1000m progressive",exercises:[{name:"Full Race Simulation",sets:"2x full race distance",rest:"20 min",tips:"Full effort, race conditions, taper mindset",alt:"1x race distance",prog:"Add warm-up race simulation",yt:"https://youtube.com/results?search_query=race+simulation+elite+swimming"},{name:"Race Pace Broken Swims",sets:"4x(25+25) broken 100",rest:"10s between 25s, 3 min between sets",tips:"Maintain race pace each 25",alt:"2 sets",prog:"Reduce break to 5s",yt:"https://youtube.com/results?search_query=broken+swim+sets"}],cooldown:"800m easy + full body stretch"},
      Sun:{focus:"Full Rest",warmup:"N/A",exercises:[{name:"Complete Rest",sets:"No training",rest:"N/A",tips:"9-10 hrs sleep, hydrate, eat well",alt:"Very light walk only",prog:"Mental imagery 15 min",yt:"https://youtube.com/results?search_query=elite+athlete+rest+day"},{name:"Recovery Protocols",sets:"Full routine",rest:"N/A",tips:"Ice bath, compression, massage, nutrition",alt:"Contrast shower + foam roll",prog:"Weekly sports massage",yt:"https://youtube.com/results?search_query=elite+athlete+recovery+protocols"}],cooldown:"N/A"},
    },
  },
  Basketball:{
    Recreational:{
      Mon:{focus:"Strength & Explosiveness",warmup:"10 min jog + dynamic stretches + 20 jumps",exercises:[{name:"Box Jumps",sets:"4x8",rest:"90s",tips:"Land softly with knees bent, full extension on jump",alt:"Step-ups if no box",prog:"Increase box height or add vest",yt:"https://youtube.com/results?search_query=box+jumps+basketball+training"},{name:"Squats",sets:"4x10",rest:"90s",tips:"Knees track toes, sit back into hips",alt:"Goblet squat with dumbbell",prog:"Add barbell, increase weight weekly",yt:"https://youtube.com/results?search_query=squat+form+basketball"},{name:"Lateral Bounds",sets:"3x10 each side",rest:"60s",tips:"Push off outside foot, stick landing",alt:"Side shuffles",prog:"Add resistance band above knees",yt:"https://youtube.com/results?search_query=lateral+bounds+basketball+agility"}],cooldown:"Full body stretch + foam roll legs"},
      Tue:{focus:"Ball Handling & Shooting",warmup:"5 min dribbling warm-up",exercises:[{name:"Dribble Combos",sets:"5 min continuous",rest:"N/A",tips:"Eyes up, fingertips not palm",alt:"Two ball dribbling",prog:"Add behind-back and crossover",yt:"https://youtube.com/results?search_query=basketball+dribbling+drills"},{name:"Catch & Shoot",sets:"50 shots from 5 spots",rest:"Walk between spots",tips:"Square up early, follow through",alt:"Off-the-dribble if comfortable",prog:"Add shot fake before shooting",yt:"https://youtube.com/results?search_query=catch+and+shoot+basketball"},{name:"Free Throws",sets:"3x20",rest:"Walk to retrieve",tips:"Same routine every time, bend knees",alt:"Reduce to 10 if wrist fatigue",prog:"Add pressure (make 5 in a row)",yt:"https://youtube.com/results?search_query=free+throw+routine+basketball"}],cooldown:"Upper body stretch + wrist circles"},
      Wed:{focus:"Active Recovery",warmup:"None",exercises:[{name:"Light Jog",sets:"20 min easy",rest:"N/A",tips:"60% effort max, conversational pace",alt:"Cycling or swimming",prog:"Add 5 min each week",yt:"https://youtube.com/results?search_query=active+recovery+run"},{name:"Stretch & Roll",sets:"20 min",rest:"N/A",tips:"Focus on hips, quads, calves",alt:"Yoga session",prog:"Add daily morning stretch",yt:"https://youtube.com/results?search_query=basketball+flexibility+stretching"}],cooldown:"5 min breathing"},
      Thu:{focus:"Agility & Defense",warmup:"Agility ladder + 10 min jog",exercises:[{name:"Agility Ladder Drills",sets:"10 min",rest:"30s between drills",tips:"Quick feet, arms pumping, eyes up",alt:"Cone drills instead",prog:"Increase speed and complexity",yt:"https://youtube.com/results?search_query=agility+ladder+basketball"},{name:"Defensive Slides",sets:"4x30s",rest:"30s",tips:"Stay low, wide base, no crossing feet",alt:"Mirror drill with partner",prog:"Add resistance band",yt:"https://youtube.com/results?search_query=defensive+slides+basketball"},{name:"Closeout Drills",sets:"3x10 each side",rest:"45s",tips:"High hands, chop feet on arrival",alt:"Solo shadow defense",prog:"Add live ball",yt:"https://youtube.com/results?search_query=closeout+drills+basketball"}],cooldown:"Full stretch + foam roll"},
      Fri:{focus:"Conditioning",warmup:"10 min progressive jog",exercises:[{name:"Court Sprints",sets:"10x full court",rest:"30s",tips:"Full effort down, jog back",alt:"Half court",prog:"Reduce rest to 20s",yt:"https://youtube.com/results?search_query=basketball+court+sprints"},{name:"17s Drill",sets:"3 sets",rest:"60s",tips:"Touch each sideline 17 times in 60s",alt:"Reduce to 10 sideline touches",prog:"Increase target",yt:"https://youtube.com/results?search_query=17s+basketball+conditioning"},{name:"Jump Rope",sets:"3x3 min",rest:"60s",tips:"Light on feet, consistent rhythm",alt:"High knees in place",prog:"Add double-unders",yt:"https://youtube.com/results?search_query=jump+rope+basketball+conditioning"}],cooldown:"Full body stretch"},
      Sat:{focus:"Game Simulation",warmup:"Full warm-up protocol",exercises:[{name:"3-on-3 or 5-on-5",sets:"Full game",rest:"Normal substitutions",tips:"Apply all week's training, communicate",alt:"Solo shooting workout",prog:"Increase game intensity",yt:"https://youtube.com/results?search_query=basketball+game+tips"},{name:"Post-Game Shooting",sets:"50 free throws",rest:"Walk between",tips:"Simulate fatigue of game situation",alt:"Reduce to 20",prog:"Add game-winning scenario pressure",yt:"https://youtube.com/results?search_query=post+game+basketball+shooting"}],cooldown:"Full stretch + ice any sore areas"},
      Sun:{focus:"Rest",warmup:"N/A",exercises:[{name:"Full Rest",sets:"No training",rest:"N/A",tips:"Sleep 8-9 hrs, hydrate well",alt:"Light walk",prog:"Mental visualization 10 min",yt:"https://youtube.com/results?search_query=athlete+recovery+day"},{name:"Foam Rolling",sets:"15 min",rest:"N/A",tips:"Quads, hamstrings, calves, IT band",alt:"Massage gun",prog:"Monthly sports massage",yt:"https://youtube.com/results?search_query=foam+rolling+legs"}],cooldown:"N/A"},
    },
    Amateur:{
      Mon:{focus:"Power & Vertical",warmup:"Full dynamic warm-up + 30 jumps",exercises:[{name:"Depth Jumps",sets:"5x6",rest:"2 min",tips:"Minimal ground contact, max height",alt:"Box jumps",prog:"Increase drop height",yt:"https://youtube.com/results?search_query=depth+jumps+basketball"},{name:"Trap Bar Deadlift",sets:"4x6",rest:"2 min",tips:"Hip hinge, drive through heels",alt:"Romanian deadlift",prog:"Add 5kg weekly",yt:"https://youtube.com/results?search_query=trap+bar+deadlift+athletes"},{name:"Single Leg RDL",sets:"3x10 each",rest:"75s",tips:"Hinge at hip, slight knee bend, flat back",alt:"Dumbbell RDL",prog:"Add weight",yt:"https://youtube.com/results?search_query=single+leg+rdl+basketball"}],cooldown:"Full stretch 15 min"},
      Tue:{focus:"Skills & IQ",warmup:"Ball handling circuit 10 min",exercises:[{name:"Pick & Roll Read",sets:"20 min drill",rest:"N/A",tips:"Read the defense: reject, use, pop",alt:"Solo dribble reads",prog:"Add live defender",yt:"https://youtube.com/results?search_query=pick+and+roll+basketball+drill"},{name:"Floater & Finishing",sets:"60 reps",rest:"Walk to retrieve",tips:"Off both feet, soft touch off glass",alt:"Basic layups",prog:"Add contact from partner",yt:"https://youtube.com/results?search_query=floater+basketball+finishing"},{name:"Mid-Range Pull-Up",sets:"60 shots",rest:"Walk",tips:"One dribble pull-up, balanced landing",alt:"Catch and shoot",prog:"Add dribble before pull-up",yt:"https://youtube.com/results?search_query=mid+range+pull+up+basketball"}],cooldown:"Upper body + wrist stretch"},
      Wed:{focus:"Conditioning",warmup:"10 min jog + stretching",exercises:[{name:"Sprint Intervals",sets:"8x200m",rest:"60s",tips:"85-90% effort each rep",alt:"400m at 75%",prog:"Add 2 reps weekly",yt:"https://youtube.com/results?search_query=sprint+interval+training+basketball"},{name:"Explosive Cone Drills",sets:"6 drills x 3 rounds",rest:"45s",tips:"Change of direction with low center of gravity",alt:"Slower pace, focus on form",prog:"Time each drill, beat previous week",yt:"https://youtube.com/results?search_query=cone+drills+basketball+speed"}],cooldown:"Full stretch"},
      Thu:{focus:"Strength",warmup:"Dynamic warm-up",exercises:[{name:"Bench Press",sets:"4x8",rest:"90s",tips:"Control descent, drive through sticking point",alt:"Dumbbell press",prog:"Add 2.5kg each session",yt:"https://youtube.com/results?search_query=bench+press+basketball+training"},{name:"Bulgarian Split Squat",sets:"4x10 each",rest:"75s",tips:"Vertical shin, knee behind toes on front foot",alt:"Reverse lunge",prog:"Add dumbbells, increase weight",yt:"https://youtube.com/results?search_query=bulgarian+split+squat"},{name:"Core Anti-Rotation",sets:"3x12 each side",rest:"45s",tips:"Paloff press or cable rotation, resist movement",alt:"Dead bugs",prog:"Increase load",yt:"https://youtube.com/results?search_query=anti+rotation+core+basketball"}],cooldown:"Full stretch 15 min"},
      Fri:{focus:"Scrimmage Prep",warmup:"Full team warm-up",exercises:[{name:"Film Study",sets:"30 min",rest:"N/A",tips:"Study opponent tendencies and your own mistakes",alt:"Podcast on basketball IQ",prog:"Weekly habit",yt:"https://youtube.com/results?search_query=basketball+film+study+tips"},{name:"Set Plays Practice",sets:"30 min",rest:"N/A",tips:"Walk through, then 50%, then full speed",alt:"Solo movement practice",prog:"Add live defense",yt:"https://youtube.com/results?search_query=basketball+set+plays"},{name:"Shooting Workout",sets:"100 shots",rest:"Walk",tips:"Game spots, game speed",alt:"50 shots",prog:"Add off-screen and movement",yt:"https://youtube.com/results?search_query=basketball+shooting+workout"}],cooldown:"Full stretch"},
      Sat:{focus:"Game Day",warmup:"Full game warm-up",exercises:[{name:"Pre-Game Activation",sets:"15 min",rest:"N/A",tips:"Glute activation, jump prep, shooting warm-up",alt:"Light jog + shots",prog:"Consistent pre-game routine",yt:"https://youtube.com/results?search_query=basketball+pre+game+warmup"},{name:"Game",sets:"Full game",rest:"Halftime",tips:"Trust your training, communicate, compete",alt:"N/A",prog:"Review performance after",yt:"https://youtube.com/results?search_query=basketball+game+performance+tips"}],cooldown:"Ice, stretch, nutrition"},
      Sun:{focus:"Recovery",warmup:"N/A",exercises:[{name:"Pool Recovery",sets:"20 min easy swim",rest:"N/A",tips:"Very light movement in water",alt:"Light walk",prog:"Add contrast bath",yt:"https://youtube.com/results?search_query=pool+recovery+athletes"},{name:"Full Body Stretch",sets:"30 min",rest:"N/A",tips:"Hold each stretch 30-60s",alt:"Yoga session",prog:"Daily morning routine",yt:"https://youtube.com/results?search_query=basketball+recovery+stretching"}],cooldown:"N/A"},
    },
    Elite:{
      Mon:{focus:"Max Strength + Power",warmup:"Full CNS activation protocol",exercises:[{name:"Power Cleans",sets:"5x3",rest:"3 min",tips:"Triple extension, explosive pull",alt:"Hang power clean",prog:"2.5kg increase weekly",yt:"https://youtube.com/results?search_query=power+clean+basketball+strength"},{name:"Back Squat",sets:"5x5",rest:"3 min",tips:"Below parallel, brace core, knees out",alt:"Front squat",prog:"5kg increase weekly",yt:"https://youtube.com/results?search_query=back+squat+basketball+athlete"},{name:"Banded Jumps",sets:"5x5",rest:"90s",tips:"Overcome band resistance, full extension",alt:"Unresisted jumps with pause",prog:"Increase band resistance",yt:"https://youtube.com/results?search_query=banded+jumps+vertical+basketball"}],cooldown:"Active stretching 20 min"},
      Tue:{focus:"Elite Skills",warmup:"15 min ball handling",exercises:[{name:"Advanced Footwork",sets:"45 min",rest:"As needed",tips:"Euro step, spin move, drop step precision",alt:"Basic footwork",prog:"Add defender",yt:"https://youtube.com/results?search_query=elite+basketball+footwork"},{name:"Shooting Off Screens",sets:"100 shots",rest:"Walk",tips:"Curl, flat, fade reads off each screen",alt:"Stationary shooting",prog:"Add hand-off and pin-down",yt:"https://youtube.com/results?search_query=shooting+off+screens+basketball"},{name:"3-Point Volume",sets:"150 shots",rest:"Walk",tips:"Game spots, game pace, game footwork",alt:"100 shots",prog:"Add pull-up 3s",yt:"https://youtube.com/results?search_query=elite+3+point+shooting+workout"}],cooldown:"Upper body stretch + wrist care"},
      Wed:{focus:"Conditioning",warmup:"20 min progressive",exercises:[{name:"Max Aerobic Speed Runs",sets:"6x400m at MAS",rest:"90s",tips:"Calculated at 100% VO2max speed",alt:"800m at 90% MAS",prog:"Increase volume weekly",yt:"https://youtube.com/results?search_query=maximal+aerobic+speed+training"},{name:"Reactive Agility",sets:"10x6s drills",rest:"45s",tips:"React to visual cue, no pre-planned direction",alt:"Pre-planned agility",prog:"Randomise cues",yt:"https://youtube.com/results?search_query=reactive+agility+basketball"}],cooldown:"Full stretch + cold plunge"},
      Thu:{focus:"Auxiliary Strength",warmup:"Dynamic warm-up",exercises:[{name:"Nordic Hamstring Curls",sets:"4x6",rest:"2 min",tips:"Control descent, hamstring dominant",alt:"Leg curl machine",prog:"Add loading",yt:"https://youtube.com/results?search_query=nordic+hamstring+curl+athletes"},{name:"Single Leg Press",sets:"4x10 each",rest:"75s",tips:"Full range, drive through heel",alt:"Split squat",prog:"Increase load weekly",yt:"https://youtube.com/results?search_query=single+leg+press+basketball"},{name:"Rotator Cuff Work",sets:"3x15 each",rest:"45s",tips:"Internal + external rotation, face pulls",alt:"Band work",prog:"Add load progressively",yt:"https://youtube.com/results?search_query=rotator+cuff+basketball+injury+prevention"}],cooldown:"Full stretch 20 min"},
      Fri:{focus:"Game Prep",warmup:"Full activation + shooting",exercises:[{name:"Opponent Scouting",sets:"45 min film",rest:"N/A",tips:"Identify tendencies, preferred moves, weaknesses",alt:"Team film session",prog:"Weekly habit",yt:"https://youtube.com/results?search_query=basketball+scouting+report"},{name:"Walk-Through",sets:"30 min",rest:"N/A",tips:"Perfect play execution at low intensity",alt:"Mental walk-through only",prog:"Add complexity",yt:"https://youtube.com/results?search_query=basketball+walk+through+practice"},{name:"Shooting Touch",sets:"50 shots",rest:"Walk",tips:"Light maintenance, feel and rhythm only",alt:"Free throws only",prog:"Maintain consistency",yt:"https://youtube.com/results?search_query=game+day+eve+shooting+basketball"}],cooldown:"Light stretch + visualization"},
      Sat:{focus:"Game",warmup:"Elite pre-game protocol",exercises:[{name:"Pre-Game Protocol",sets:"45 min",rest:"N/A",tips:"Activation, shooting routine, mental prep",alt:"N/A",prog:"Never skip",yt:"https://youtube.com/results?search_query=elite+pre+game+warmup+basketball"},{name:"Game",sets:"Full 40 min",rest:"Halftime",tips:"Elite execution, trust reads, compete",alt:"N/A",prog:"Post-game review within 24hrs",yt:"https://youtube.com/results?search_query=elite+basketball+game+performance"}],cooldown:"Ice bath, nutrition, stretch"},
      Sun:{focus:"Full Recovery",warmup:"N/A",exercises:[{name:"Ice Bath",sets:"10-15 min at 10-12°C",rest:"N/A",tips:"Contrast with warm shower after",alt:"Cold shower",prog:"Weekly habit",yt:"https://youtube.com/results?search_query=ice+bath+recovery+athletes"},{name:"Sports Massage",sets:"60 min full body",rest:"N/A",tips:"Focus on legs and lower back",alt:"Foam rolling + self-massage",prog:"Weekly or bi-weekly",yt:"https://youtube.com/results?search_query=sports+massage+recovery"}],cooldown:"N/A"},
    },
  },
  "Track & Field":{
    Recreational:{
      Mon:{focus:"Speed Development",warmup:"10 min jog + A-skips, B-skips, high knees",exercises:[{name:"Sprint Drills 30m",sets:"6x30m",rest:"2 min",tips:"Drive knees high, pump arms",alt:"Reduce to 20m",prog:"Progress to 40m sprints",yt:"https://youtube.com/results?search_query=sprint+mechanics+drills"},{name:"Acceleration Runs",sets:"4x60m",rest:"3 min",tips:"Build speed gradually over 60m",alt:"30m with walk back",prog:"Progress to flying 30s",yt:"https://youtube.com/results?search_query=acceleration+running+technique"},{name:"Hill Sprints",sets:"5x30m uphill",rest:"Walk down recovery",tips:"Drive forward, lean into hill",alt:"Treadmill incline 10%",prog:"Increase to 8 reps",yt:"https://youtube.com/results?search_query=hill+sprint+training"}],cooldown:"10 min easy jog + full stretch"},
      Tue:{focus:"Strength & Power",warmup:"Dynamic warm-up + bodyweight squats",exercises:[{name:"Deadlifts",sets:"4x6",rest:"2 min",tips:"Neutral spine, drive through heels",alt:"Romanian deadlift with dumbbells",prog:"Add 5kg every 2 weeks",yt:"https://youtube.com/results?search_query=deadlift+form+for+runners"},{name:"Single Leg Squat",sets:"3x8 each",rest:"90s",tips:"Control descent, drive knee out",alt:"Split squats",prog:"Add weight in each hand",yt:"https://youtube.com/results?search_query=single+leg+squat+progression"},{name:"Med Ball Throws",sets:"4x8",rest:"60s",tips:"Explosive rotation from hips",alt:"Resistance band rotations",prog:"Increase ball weight",yt:"https://youtube.com/results?search_query=medicine+ball+throw+track"}],cooldown:"Full stretch focusing on hip flexors"},
      Wed:{focus:"Tempo Run",warmup:"10 min easy jog",exercises:[{name:"Tempo Run",sets:"20-25 min at 70% effort",rest:"N/A",tips:"Comfortably hard, can say a few words",alt:"Walk/run intervals",prog:"Increase duration by 5 min",yt:"https://youtube.com/results?search_query=tempo+run+technique"},{name:"Strides",sets:"4x80m",rest:"Walk back",tips:"Relaxed acceleration to 85% then hold",alt:"2 reps",prog:"Add 2 reps monthly",yt:"https://youtube.com/results?search_query=running+strides+technique"}],cooldown:"10 min walk + full stretch"},
      Thu:{focus:"Plyometrics & Power",warmup:"Dynamic full body",exercises:[{name:"Bounding",sets:"4x30m",rest:"2 min",tips:"Exaggerated running stride, drive knee",alt:"Skip for height",prog:"Increase distance to 40m",yt:"https://youtube.com/results?search_query=bounding+plyometrics+track"},{name:"Triple Jump Hops",sets:"3x6 each leg",rest:"90s",tips:"Hop, hop, jump sequence, stick landing",alt:"Single leg hops",prog:"Add 2 reps",yt:"https://youtube.com/results?search_query=triple+jump+training+drills"},{name:"Depth Jumps",sets:"4x6",rest:"2 min",tips:"Minimal ground contact, reactive",alt:"Box jumps",prog:"Increase drop height",yt:"https://youtube.com/results?search_query=depth+jumps+plyometrics"}],cooldown:"Full stretch"},
      Fri:{focus:"Easy Run + Drills",warmup:"Walk 5 min",exercises:[{name:"Easy Run",sets:"20-30 min very easy",rest:"N/A",tips:"Can hold full conversation, very relaxed",alt:"Walk if fatigued",prog:"Extend by 5 min weekly",yt:"https://youtube.com/results?search_query=easy+run+pace+benefits"},{name:"Running Drills",sets:"6 drills x 30m",rest:"Walk back",tips:"A-skip, B-skip, high knees, ankling",alt:"2 drills only",prog:"Add C-skip and carioca",yt:"https://youtube.com/results?search_query=running+form+drills+track"}],cooldown:"10 min stretch"},
      Sat:{focus:"Race or Race Simulation",warmup:"Full pre-race warm-up",exercises:[{name:"Race / Time Trial",sets:"Event distance",rest:"N/A",tips:"Execute race plan, even or negative split",alt:"Time trial solo",prog:"Track personal best progression",yt:"https://youtube.com/results?search_query=running+race+tactics"},{name:"Post-Race Jog",sets:"10-15 min easy",rest:"N/A",tips:"Flush lactate, normalise heart rate",alt:"Walk",prog:"Extend to 20 min",yt:"https://youtube.com/results?search_query=post+race+recovery+run"}],cooldown:"Full stretch + ice if needed"},
      Sun:{focus:"Full Rest",warmup:"N/A",exercises:[{name:"Complete Rest",sets:"No running",rest:"N/A",tips:"Eat well, sleep 8-9 hrs, hydrate",alt:"Light walk only",prog:"Add weekly planning review",yt:"https://youtube.com/results?search_query=rest+day+athletes+recovery"},{name:"Foam Rolling",sets:"15 min",rest:"N/A",tips:"Calves, quads, hamstrings, IT band",alt:"Epsom salt bath",prog:"Monthly sports massage",yt:"https://youtube.com/results?search_query=foam+rolling+runners"}],cooldown:"N/A"},
    },
    Elite:{
      Mon:{focus:"Speed-Endurance",warmup:"2km easy + drills + strides",exercises:[{name:"300m Repeats",sets:"6x300m",rest:"3 min",tips:"Consistent splits, controlled aggression",alt:"4 reps",prog:"Reduce rest by 30s",yt:"https://youtube.com/results?search_query=300m+repeats+elite+track"},{name:"Flying 30m",sets:"6x30m flying",rest:"5 min",tips:"Rolling start at 30m, max velocity held",alt:"4 reps",prog:"Add radar gun timing",yt:"https://youtube.com/results?search_query=flying+30+sprint+training"},{name:"Block Starts",sets:"10 starts",rest:"3 min",tips:"Drive phase 10-15 steps, don't come up early",alt:"Standing start",prog:"Add timing gates",yt:"https://youtube.com/results?search_query=block+start+sprint+technique"}],cooldown:"2km easy + full stretch"},
      Tue:{focus:"Olympic Lifting & Plyos",warmup:"Full CNS activation",exercises:[{name:"Power Snatch",sets:"5x3",rest:"3 min",tips:"Fast pull under, overhead stability",alt:"Hang snatch",prog:"2.5kg weekly",yt:"https://youtube.com/results?search_query=power+snatch+track+athlete"},{name:"Hurdle Hops",sets:"5x8 hurdles",rest:"2 min",tips:"Dorsiflexed foot, fast off ground, tall hips",alt:"Mini hurdles",prog:"Increase hurdle height",yt:"https://youtube.com/results?search_query=hurdle+hops+plyometrics+sprint"},{name:"Single Leg Bounding",sets:"4x40m each",rest:"3 min",tips:"Maximum distance per bound, aggressive drive",alt:"Alternate leg bounding",prog:"Add resistance vest",yt:"https://youtube.com/results?search_query=single+leg+bounding+elite+track"}],cooldown:"Full stretch + cold plunge"},
      Wed:{focus:"Tempo Volume",warmup:"2km easy",exercises:[{name:"Tempo 200s",sets:"10x200m at 75%",rest:"60s",tips:"All reps within 1s of each other",alt:"8 reps",prog:"Increase to 12 reps",yt:"https://youtube.com/results?search_query=tempo+200s+track+training"},{name:"Technical Strides",sets:"6x100m",rest:"Walk back",tips:"Perfect mechanics, 90% effort max",alt:"4 strides",prog:"Add 2 strides monthly",yt:"https://youtube.com/results?search_query=technical+strides+sprint"}],cooldown:"2km easy + stretch"},
      Thu:{focus:"Max Strength",warmup:"Full dynamic warm-up",exercises:[{name:"Back Squat",sets:"5x4",rest:"3 min",tips:"Below parallel, aggressive drive",alt:"Front squat",prog:"5kg increase monthly",yt:"https://youtube.com/results?search_query=back+squat+sprinter"},{name:"Romanian Deadlift",sets:"4x6",rest:"2 min",tips:"Hip hinge, hamstring stretch, neutral spine",alt:"Single leg RDL",prog:"Add weight weekly",yt:"https://youtube.com/results?search_query=romanian+deadlift+sprinter"},{name:"Hip Thrust",sets:"4x8",rest:"90s",tips:"Full extension, squeeze glutes at top",alt:"Glute bridge",prog:"Add barbell, increase load",yt:"https://youtube.com/results?search_query=hip+thrust+sprinting+power"}],cooldown:"Full stretch 20 min"},
      Fri:{focus:"Technical Speed",warmup:"1km + drills + strides",exercises:[{name:"30m Flyers",sets:"8x30m",rest:"5 min",tips:"Maximum velocity, relax jaw and hands",alt:"6 reps",prog:"Add EMG feedback if available",yt:"https://youtube.com/results?search_query=maximum+velocity+sprint+training"},{name:"Wicket Runs",sets:"6x30m",rest:"3 min",tips:"Even stride length over wickets, tall posture",alt:"Without wickets",prog:"Adjust spacing to optimal stride",yt:"https://youtube.com/results?search_query=wicket+runs+sprint+training"},{name:"Video Analysis",sets:"Review session",rest:"N/A",tips:"Compare to previous week, identify one change",alt:"Coach feedback",prog:"Monthly biomechanical screen",yt:"https://youtube.com/results?search_query=sprint+biomechanics+analysis"}],cooldown:"Easy 1km + full stretch"},
      Sat:{focus:"Competition",warmup:"Elite race warm-up 45 min",exercises:[{name:"Pre-Race Activation",sets:"20 min",rest:"N/A",tips:"Glutes, hamstrings, explosive prep jumps",alt:"N/A",prog:"Never skip",yt:"https://youtube.com/results?search_query=elite+sprint+warm+up+competition"},{name:"Race",sets:"Event + heats if needed",rest:"Between rounds",tips:"Execute, compete, adjust between rounds",alt:"Time trial",prog:"Season periodisation",yt:"https://youtube.com/results?search_query=elite+100m+200m+400m+race+tactics"}],cooldown:"Easy jog + full stretch + ice"},
      Sun:{focus:"Recovery",warmup:"N/A",exercises:[{name:"Ice Bath",sets:"12 min at 11°C",rest:"N/A",tips:"Contrast with warm shower after",alt:"Cold shower",prog:"Consistent weekly",yt:"https://youtube.com/results?search_query=ice+bath+sprint+recovery"},{name:"Sports Massage",sets:"60-90 min",rest:"N/A",tips:"Focus on hamstrings, quads, calves, glutes",alt:"Foam roll + lacrosse ball",prog:"Weekly during competition season",yt:"https://youtube.com/results?search_query=sports+massage+sprinter+recovery"}],cooldown:"N/A"},
    },
  },
};
const getWorkouts=(sport,level)=>{const s=WORKOUT_DATA[sport]||WORKOUT_DATA.Swimming;return s[level]||s.Recreational;};

const RECOVERY_DATA={
  weeklySchedule:[
    {day:"Day 1-2",phase:"Acute Recovery",focus:"Reduce inflammation",actions:["R.I.C.E for any sore areas","Cold water immersion 10-15 min","Light walk 20 min","Hydrate with electrolytes","Sleep 9-10 hrs"]},
    {day:"Day 3-4",phase:"Repair Phase",focus:"Tissue repair & nutrition",actions:["Gentle mobility work 20 min","Foam rolling full body","Protein-rich meals every 3-4 hrs","Contrast shower (hot/cold)","Sleep 8-9 hrs"]},
    {day:"Day 5-6",phase:"Reactivation",focus:"Return to light training",actions:["Light technical work only","Dynamic stretching 15 min","Gradual intensity increase","Monitor fatigue levels","Sleep 8 hrs"]},
    {day:"Day 7",phase:"Full Training",focus:"Return to full load",actions:["Full warm-up protocol","Normal training load","Post-session recovery routine","Weekly review of load","Plan next recovery week"]},
  ],
  injuryPrevention:{
    Swimming:["Shoulder rotator cuff exercises daily (3x15 internal/external rotation)","Hip flexor stretching post-swim","Core stability work 3x/week","Gradual yardage increases (max 10%/week)","Bilateral breathing to balance muscle use"],
    Basketball:["Ankle mobility drills before every session","Knee stability (VMO exercises 3x15)","Jump landing mechanics (soft, two-foot landings)","Hamstring flexibility (hold 30s+ each stretch)","Wrist and finger taping for game days"],
    Soccer:["Hip flexor release daily (pigeon pose 2 min each side)","Ankle stability work before every session","Hamstring eccentric work (Nordic curls)","Gradual mileage increase (10% rule)","Adductor strengthening to prevent groin strain"],
    "Track & Field":["Hip flexor release daily (pigeon pose 2 min each side)","Glute activation before runs","Gradual mileage increase (10% rule)","Calf raises for Achilles health","Shin splint prevention: tibialis anterior exercises"],
    Gymnastics:["Wrist conditioning daily (circles, extensions)","Hip flexor and hamstring flexibility","Core stability 5x/week minimum","Gradual skill progression","Ankle strengthening for landings"],
    Cycling:["Bike fit assessment every season","Hip flexor stretching daily","Knee tracking exercises (VMO)","Lower back strengthening","Chamois cream and correct saddle height"],
    Tennis:["Rotator cuff exercises daily","Lateral ankle stability","Eccentric wrist exercises","Hip rotation flexibility","Core anti-rotation work"],
    Volleyball:["Jump landing mechanics","Rotator cuff prehab","Ankle taping or bracing","Patellar tendon eccentric work","Finger taping on game days"],
    Fencing:["Lunge depth and ankle mobility","Knee stability work","Wrist and forearm strengthening","Hip flexor balance (both sides)","Achilles loading exercises"],
    "Ice Skating":["Hip abductor strengthening","Ankle stability off-ice","Knee alignment work","Core stability for spins","Hamstring and groin flexibility"],
    Wrestling:["Neck strengthening exercises","Shoulder stability work","Hip mobility and flexibility","Core bracing and anti-rotation","Knee ligament prehab (VMO, hamstrings)"],
    Rowing:["Lower back mobilisation daily","Hip flexor release","Core endurance (long holds)","Shoulder external rotation work","Gradual volume increase"],
  },
  sleepProtocol:["Set consistent sleep/wake times (±30 min)","Cool room temperature (16-18°C / 60-65°F)","No screens 1 hour before bed","Magnesium supplement before sleep","Legs elevated 15 min post-training","Avoid caffeine after 2pm","Nap 20 min post-training if tired"],
  mentalRecovery:["Breathing exercises: 4-7-8 technique (4 in, 7 hold, 8 out)","Visualisation: replay perfect performances for 10 min","Journaling: write 3 positives from each training session","Cold exposure builds mental toughness — try cold showers","Talk to a sports psychologist if performance anxiety persists"],
};

const POSTS_INIT=[
  {id:1,name:"Alex R.",sport:"Swimming",level:"Amateur",avatar:"🏊",time:"2h ago",title:"Pre-meet breakfast ideas?",body:"I always feel sluggish during warm-up. Any suggestions for what to eat the morning of a competition?",likes:12,replies:2,repliesList:[{id:11,name:"Sam T.",sport:"Track & Field",avatar:"🏃",time:"1h ago",body:"I always do oatmeal with a banana 2.5hrs before. Works perfectly!",color:"#eab308"},{id:12,name:"Jordan K.",sport:"Gymnastics",avatar:"🤸",time:"45m ago",body:"Toast with peanut butter and a small coffee. Keeps me light but energised.",color:"#ec4899"}],color:"#0ea5e9"},
  {id:2,name:"Jordan K.",sport:"Gymnastics",level:"Elite",avatar:"🤸",time:"5h ago",title:"Wrist recovery after minor sprain",body:"Rolled my wrist during beam practice. Doing RICE but wondering if there are specific exercises to speed up recovery safely.",likes:8,replies:1,repliesList:[{id:21,name:"Alex R.",sport:"Swimming",avatar:"🏊",time:"3h ago",body:"Rice + wrist circles in warm water helped me. See a physio though!",color:"#0ea5e9"}],color:"#ec4899"},
  {id:3,name:"Sam T.",sport:"Track & Field",level:"Recreational",avatar:"🏃",time:"1d ago",title:"Best protein sources on a budget",body:"Training for my first 10K. Can't afford expensive supplements. What whole foods give the best protein bang for my buck?",likes:21,replies:0,repliesList:[],color:"#eab308"},
];

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Card=({children,style={}})=><div style={{background:"#1e293b",borderRadius:16,padding:24,...style}}>{children}</div>;
const Tag=({label,color})=><span style={{background:color+"22",color,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700}}>{label}</span>;
const Input=({label,placeholder,value,onChange,type="text",required=false})=>(
  <div style={{marginBottom:16}}>
    <label style={{display:"block",fontWeight:700,fontSize:13,color:"#94a3b8",marginBottom:6}}>{label}{required&&<span style={{color:"#f43f5e"}}> *</span>}</label>
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:10,padding:"12px 16px",color:"#e2e8f0",fontSize:14,boxSizing:"border-box",outline:"none"}}/>
  </div>
);
const SportBadge=({sport,selected,onClick})=>(
  <button onClick={onClick} style={{background:selected?COLORS[sport]:"#1e293b",color:selected?"#fff":"#94a3b8",border:selected?`2px solid ${COLORS[sport]}`:"2px solid #334155",borderRadius:20,padding:"8px 16px",cursor:"pointer",fontWeight:600,fontSize:13,transition:"all 0.2s"}}>{sport}</button>
);

// ─── ICS GENERATOR ────────────────────────────────────────────────────────────
const generateICS=(workouts,sport,level,reminderTime)=>{
  const [h,m]=reminderTime.split(":").map(Number);
  const today=new Date();
  let ics="BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//AthleteEdge//EN\nCALSCALE:GREGORIAN\n";
  Object.entries(workouts).forEach(([day,data])=>{
    const date=new Date(today);
    const targetDay=DAYS.indexOf(day);
    const currentDay=today.getDay()===0?6:today.getDay()-1;
    let ahead=targetDay-currentDay;if(ahead<=0)ahead+=7;
    date.setDate(today.getDate()+ahead);
    const yr=date.getFullYear(),mo=String(date.getMonth()+1).padStart(2,"0"),dy=String(date.getDate()).padStart(2,"0");
    const hh=String(h).padStart(2,"0"),mm=String(m).padStart(2,"0"),endH=String(h+1).padStart(2,"0");
    ics+=`BEGIN:VEVENT\nUID:ae-${day}-${Date.now()}\nDTSTART:${yr}${mo}${dy}T${hh}${mm}00\nDTEND:${yr}${mo}${dy}T${endH}${mm}00\nSUMMARY:AthleteEdge - ${data.focus} (${sport})\nDESCRIPTION:${data.exercises.map(e=>`${e.name}: ${e.sets}`).join("\\n")}\nRRULE:FREQ=WEEKLY\nBEGIN:VALARM\nTRIGGER:-PT30M\nACTION:DISPLAY\nDESCRIPTION:Reminder: ${data.focus} in 30 min!\nEND:VALARM\nEND:VEVENT\n`;
  });
  ics+="END:VCALENDAR";
  const blob=new Blob([ics],{type:"text/calendar"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="athleteedge-workouts.ics";a.click();
  URL.revokeObjectURL(url);
};

// ─── AUTH SCREEN ──────────────────────────────────────────────────────────────
const AuthScreen=({onAuth})=>{
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [msg,setMsg]=useState("");
  const [loading,setLoading]=useState(false);

  const handleSubmit=async()=>{
    setError("");setMsg("");
    if(!email||!password){setError("Please fill in all fields.");return;}
    if(password.length<6){setError("Password must be at least 6 characters.");return;}
    setLoading(true);
    try{
      // ── PASTE YOUR SUPABASE CODE HERE ──
      // Replace the 4 lines below with real Supabase auth:
      //
      // if(mode==="signup"){
      //   const {error}=await supabase.auth.signUp({email,password});
      //   if(error) throw error;
      //   setMsg("✅ Account created! Check your email to confirm, then log in.");
      //   setMode("login");
      // } else {
      //   const {data,error}=await supabase.auth.signInWithPassword({email,password});
      //   if(error) throw error;
      //   onAuth(data.user);
      // }
      //
      // ── DEMO AUTH (remove when using Supabase) ──
      await new Promise(r=>setTimeout(r,600));
      if(mode==="signup"){setMsg("✅ Account created! You can now log in.");setMode("login");}
      else{onAuth({id:"demo_"+Date.now(),email,name:email.split("@")[0]});}
    }catch(e){setError(e.message);}
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:48,marginBottom:8}}>🏅</div>
          <h1 style={{color:"#fff",fontWeight:900,fontSize:28,margin:0}}><span style={{color:"#facc15"}}>Athlete</span>Edge</h1>
          <p style={{color:"#64748b",marginTop:8}}>Your sports nutrition & recovery community</p>
        </div>
        <Card>
          <div style={{display:"flex",marginBottom:24,background:"#0f172a",borderRadius:10,padding:4}}>
            {["login","signup"].map(m=><button key={m} onClick={()=>setMode(m)} style={{flex:1,background:mode===m?"#facc15":"transparent",color:mode===m?"#0f172a":"#64748b",border:"none",borderRadius:8,padding:"10px",fontWeight:700,cursor:"pointer",fontSize:14}}>{m==="login"?"Log In":"Sign Up"}</button>)}
          </div>
          {msg&&<div style={{background:"#22c55e22",border:"1px solid #22c55e",borderRadius:10,padding:12,marginBottom:16,color:"#86efac",fontSize:13}}>{msg}</div>}
          {error&&<div style={{background:"#f43f5e22",border:"1px solid #f43f5e",borderRadius:10,padding:12,marginBottom:16,color:"#fca5a5",fontSize:13}}>⚠️ {error}</div>}
          <Input label="Email Address" placeholder="you@example.com" value={email} onChange={setEmail} type="email" required/>
          <Input label="Password" placeholder="Min. 6 characters" value={password} onChange={setPassword} type="password" required/>
          <button onClick={handleSubmit} disabled={loading} style={{width:"100%",background:"#facc15",color:"#0f172a",border:"none",borderRadius:10,padding:"14px",fontWeight:800,fontSize:15,cursor:loading?"not-allowed":"pointer",opacity:loading?0.7:1,marginTop:8}}>
            {loading?"Please wait...":mode==="login"?"Log In →":"Create Account →"}
          </button>
        </Card>
        <p style={{textAlign:"center",color:"#334155",fontSize:12,marginTop:16}}>Your data is stored securely and never shared.</p>
      </div>
    </div>
  );
};

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
const Onboarding=({userId,onComplete})=>{
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:"",age:"",gender:"",sport:"Swimming",level:"Amateur",goals:["Endurance"],email:"",phone:"",country:"",city:"",social:"",club:"",coach:"",trainingDays:[],clubWebsite:"",photo:null,avatar:"👤"});
  const fileRef=useRef();
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const toggleGoal=g=>set("goals",form.goals.includes(g)?form.goals.filter(x=>x!==g):[...form.goals,g]);
  const toggleDay=d=>set("trainingDays",form.trainingDays.includes(d)?form.trainingDays.filter(x=>x!==d):[...form.trainingDays,d]);
  const sc=COLORS[form.sport]||"#facc15";
  const handlePhoto=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>set("photo",ev.target.result);r.readAsDataURL(f);};
  const canProceed=()=>{if(step===1)return form.name.trim()&&form.age&&form.gender;if(step===2)return form.email.trim();return true;};
  const stepLabels=["Personal","Contact","Club","Photo"];
  return(
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:560}}>
        <div style={{textAlign:"center",marginBottom:32}}><div style={{fontSize:48}}>🏅</div><h1 style={{color:"#fff",fontWeight:900,fontSize:28,margin:"8px 0 0"}}><span style={{color:"#facc15"}}>Athlete</span>Edge</h1><p style={{color:"#64748b"}}>Set up your athlete profile</p></div>
        <div style={{display:"flex",alignItems:"center",marginBottom:32}}>
          {stepLabels.map((l,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{display:"flex",alignItems:"center",width:"100%"}}>
                {i>0&&<div style={{flex:1,height:2,background:step>i?"#facc15":"#334155"}}/>}
                <div style={{width:32,height:32,borderRadius:"50%",background:step>i+1?"#facc15":step===i+1?sc:"#1e293b",border:`2px solid ${step>=i+1?sc:"#334155"}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,color:step>i+1?"#0f172a":"#fff",flexShrink:0}}>{step>i+1?"✓":i+1}</div>
                {i<3&&<div style={{flex:1,height:2,background:step>i+1?"#facc15":"#334155"}}/>}
              </div>
              <div style={{fontSize:10,color:step===i+1?"#facc15":"#475569",marginTop:6,fontWeight:600}}>{l}</div>
            </div>
          ))}
        </div>
        <Card>
          {step===1&&<div>
            <h2 style={{fontWeight:800,fontSize:20,marginBottom:20,marginTop:0}}>👤 Personal Information</h2>
            <Input label="Full Name" placeholder="e.g. Jordan Smith" value={form.name} onChange={v=>set("name",v)} required/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <Input label="Age" placeholder="22" value={form.age} onChange={v=>set("age",v)} type="number" required/>
              <div style={{marginBottom:16}}><label style={{display:"block",fontWeight:700,fontSize:13,color:"#94a3b8",marginBottom:6}}>Gender *</label><div style={{display:"flex",gap:8}}>{["Male","Female","Other"].map(g=><button key={g} onClick={()=>set("gender",g)} style={{flex:1,background:form.gender===g?sc:"#0f172a",color:form.gender===g?"#fff":"#64748b",border:`2px solid ${form.gender===g?sc:"#334155"}`,borderRadius:10,padding:"10px 4px",cursor:"pointer",fontWeight:700,fontSize:13}}>{g}</button>)}</div></div>
            </div>
            <div style={{marginBottom:16}}><label style={{display:"block",fontWeight:700,fontSize:13,color:"#94a3b8",marginBottom:10}}>Your Sport *</label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{SPORTS.map(s=><SportBadge key={s} sport={s} selected={form.sport===s} onClick={()=>set("sport",s)}/>)}</div></div>
            <div style={{marginBottom:16}}><label style={{display:"block",fontWeight:700,fontSize:13,color:"#94a3b8",marginBottom:10}}>Level</label><div style={{display:"flex",gap:8}}>{LEVELS.map(l=><button key={l} onClick={()=>set("level",l)} style={{flex:1,background:form.level===l?"#facc15":"#0f172a",color:form.level===l?"#0f172a":"#64748b",border:`2px solid ${form.level===l?"#facc15":"#334155"}`,borderRadius:10,padding:"10px 4px",cursor:"pointer",fontWeight:700,fontSize:13}}>{l}</button>)}</div></div>
            <div><label style={{display:"block",fontWeight:700,fontSize:13,color:"#94a3b8",marginBottom:10}}>Goals</label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{GOALS.map(g=>{const a=form.goals.includes(g);return<button key={g} onClick={()=>toggleGoal(g)} style={{background:a?"#7c3aed22":"#0f172a",color:a?"#a78bfa":"#64748b",border:`2px solid ${a?"#7c3aed":"#334155"}`,borderRadius:20,padding:"8px 16px",cursor:"pointer",fontWeight:600,fontSize:13}}>{g}</button>;})}</div></div>
          </div>}
          {step===2&&<div>
            <h2 style={{fontWeight:800,fontSize:20,marginBottom:20,marginTop:0}}>📬 Contact Details</h2>
            <Input label="Email Address" placeholder="you@example.com" value={form.email} onChange={v=>set("email",v)} type="email" required/>
            <Input label="Phone Number (optional)" placeholder="+1 555 000 0000" value={form.phone} onChange={v=>set("phone",v)}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}><Input label="Country" placeholder="United States" value={form.country} onChange={v=>set("country",v)}/><Input label="City" placeholder="Chicago" value={form.city} onChange={v=>set("city",v)}/></div>
            <Input label="Social Media (optional)" placeholder="@yourhandle" value={form.social} onChange={v=>set("social",v)}/>
          </div>}
          {step===3&&<div>
            <h2 style={{fontWeight:800,fontSize:20,marginBottom:20,marginTop:0}}>🏟️ Club & Team</h2>
            <Input label="Club / Team Name" placeholder="City Aquatics Club" value={form.club} onChange={v=>set("club",v)}/>
            <Input label="Coach's Name" placeholder="Coach Martinez" value={form.coach} onChange={v=>set("coach",v)}/>
            <div style={{marginBottom:16}}><label style={{display:"block",fontWeight:700,fontSize:13,color:"#94a3b8",marginBottom:10}}>Training Days</label><div style={{display:"flex",gap:8}}>{DAYS.map(d=>{const a=form.trainingDays.includes(d);return<button key={d} onClick={()=>toggleDay(d)} style={{flex:1,background:a?sc:"#0f172a",color:a?"#fff":"#64748b",border:`2px solid ${a?sc:"#334155"}`,borderRadius:10,padding:"10px 4px",cursor:"pointer",fontWeight:700,fontSize:12}}>{d}</button>;})}</div></div>
            <Input label="Club Website" placeholder="https://myclub.com" value={form.clubWebsite} onChange={v=>set("clubWebsite",v)}/>
          </div>}
          {step===4&&<div>
            <h2 style={{fontWeight:800,fontSize:20,marginBottom:8,marginTop:0}}>📸 Profile Photo</h2>
            <p style={{color:"#64748b",fontSize:14,marginBottom:24}}>Upload a photo or choose an avatar.</p>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:20}}>
              <div style={{width:120,height:120,borderRadius:"50%",background:sc+"33",border:`3px solid ${sc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:60,overflow:"hidden"}}>{form.photo?<img src={form.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="av"/>:form.avatar}</div>
              <button onClick={()=>fileRef.current.click()} style={{background:sc,color:"#0f172a",border:"none",borderRadius:10,padding:"10px 20px",fontWeight:700,cursor:"pointer"}}>📁 Upload Photo</button>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center"}}>{AVATARS.map(a=><button key={a} onClick={()=>{set("avatar",a);set("photo",null);}} style={{width:44,height:44,borderRadius:"50%",background:form.avatar===a&&!form.photo?sc+"33":"#0f172a",border:`2px solid ${form.avatar===a&&!form.photo?sc:"#334155"}`,fontSize:22,cursor:"pointer"}}>{a}</button>)}</div>
            </div>
          </div>}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:28}}>
            <button onClick={()=>step>1&&setStep(step-1)} style={{background:"transparent",color:step===1?"#334155":"#94a3b8",border:`2px solid ${step===1?"#1e293b":"#334155"}`,borderRadius:10,padding:"10px 20px",fontWeight:600,cursor:step===1?"default":"pointer"}}>← Back</button>
            <span style={{color:"#475569",fontSize:13}}>{step} of 4</span>
            {step<4?<button onClick={()=>canProceed()&&setStep(step+1)} style={{background:canProceed()?"#facc15":"#334155",color:canProceed()?"#0f172a":"#64748b",border:"none",borderRadius:10,padding:"10px 24px",fontWeight:700,cursor:canProceed()?"pointer":"default"}}>Next →</button>
            :<button onClick={()=>onComplete(form)} style={{background:"#facc15",color:"#0f172a",border:"none",borderRadius:10,padding:"10px 24px",fontWeight:700,cursor:"pointer"}}>Complete Setup 🎉</button>}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ─── WELCOME ──────────────────────────────────────────────────────────────────
const WelcomeScreen=({user,onEnter})=>{
  const sc=COLORS[user.sport]||"#facc15";
  return(
    <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{maxWidth:520,width:"100%",textAlign:"center"}}>
        <div style={{width:100,height:100,borderRadius:"50%",background:sc+"33",border:`3px solid ${sc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:52,margin:"0 auto 24px",overflow:"hidden"}}>{user.photo?<img src={user.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="av"/>:user.avatar}</div>
        <div style={{fontSize:13,color:"#facc15",fontWeight:700,letterSpacing:2,marginBottom:12}}>WELCOME TO ATHLETEEDGE</div>
        <h1 style={{color:"#fff",fontWeight:900,fontSize:34,margin:"0 0 8px"}}>Hey, <span style={{color:sc}}>{user.name.split(" ")[0]}!</span> 👋</h1>
        <p style={{color:"#64748b",marginBottom:28}}>Your personalised athlete hub is ready.</p>
        <Card style={{textAlign:"left",marginBottom:24}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[{l:"Sport",v:user.sport,i:"🏅"},{l:"Level",v:user.level,i:"🎯"},{l:"Club",v:user.club||"Independent",i:"🏟️"},{l:"Goals",v:(user.goals||[]).join(", ")||"—",i:"⭐"}].map(x=>(
              <div key={x.l} style={{background:"#0f172a",borderRadius:12,padding:14}}><div style={{fontSize:18,marginBottom:4}}>{x.i}</div><div style={{fontSize:11,color:"#64748b",fontWeight:700}}>{x.l}</div><div style={{fontSize:13,color:"#e2e8f0",fontWeight:600,marginTop:2}}>{x.v}</div></div>
            ))}
          </div>
        </Card>
        <button onClick={onEnter} style={{background:sc,color:"#0f172a",border:"none",borderRadius:12,padding:"16px 48px",fontWeight:800,fontSize:17,cursor:"pointer",width:"100%"}}>Enter AthleteEdge →</button>
      </div>
    </div>
  );
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const Nav=({page,setPage,user,onLogout})=>{
  const sc=COLORS[user.sport]||"#facc15";
  return(
    <nav style={{background:"#0f172a",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:60,position:"sticky",top:0,zIndex:100,borderBottom:"1px solid #1e293b"}}>
      <div style={{color:"#fff",fontWeight:800,fontSize:20}}>🏅 <span style={{color:"#facc15"}}>Athlete</span>Edge</div>
      <div style={{display:"flex",gap:4}}>
        {["Home","Nutrition","Fitness","Workouts","Recovery","Community"].map(p=>(
          <button key={p} onClick={()=>setPage(p)} style={{background:page===p?"#facc15":"transparent",color:page===p?"#0f172a":"#94a3b8",border:"none",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontWeight:600,fontSize:12}}>{p}</button>
        ))}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}} onClick={()=>setPage("Profile")}>
          <div style={{width:32,height:32,borderRadius:"50%",background:sc+"33",border:`2px solid ${sc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,overflow:"hidden"}}>{user.photo?<img src={user.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="av"/>:user.avatar}</div>
          <span style={{color:"#e2e8f0",fontSize:13,fontWeight:600}}>{user.name?.split(" ")[0]}</span>
        </div>
        <button onClick={onLogout} style={{background:"transparent",color:"#64748b",border:"1px solid #334155",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:11}}>Log Out</button>
      </div>
    </nav>
  );
};

// ─── NUTRITION PAGE ───────────────────────────────────────────────────────────
const NutritionPage=({profile})=>{
  const sc=COLORS[profile.sport]||"#facc15";
  const data=getNutrition(profile.sport);
  const [activeDay,setActiveDay]=useState("Mon");
  const dayData=data.weeklyMeals[activeDay]||data.weeklyMeals.Mon;
  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:32}}>
      <div style={{display:"flex",gap:8,marginBottom:8}}><Tag label={profile.sport} color={sc}/><Tag label={profile.level} color="#facc15"/></div>
      <h2 style={{fontWeight:900,fontSize:28,marginBottom:24}}>🥗 Nutrition Plans</h2>
      <Card style={{marginBottom:20}}>
        <div style={{fontWeight:800,fontSize:16,marginBottom:16}}>📊 Daily Macro Breakdown</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[{l:"Carbohydrates",v:data.macros.carbs,c:"#eab308",icon:"🍚"},{l:"Protein",v:data.macros.protein,c:sc,icon:"🥩"},{l:"Healthy Fats",v:data.macros.fats,c:"#f97316",icon:"🥑"}].map(m=>(
            <div key={m.l} style={{background:"#0f172a",borderRadius:12,padding:16,textAlign:"center"}}>
              <div style={{fontSize:28}}>{m.icon}</div>
              <div style={{fontSize:32,fontWeight:900,color:m.c,marginTop:4}}>{m.v}%</div>
              <div style={{fontSize:12,color:"#64748b",marginTop:4}}>{m.l}</div>
              <div style={{height:6,background:"#334155",borderRadius:3,marginTop:8}}><div style={{height:"100%",width:`${m.v}%`,background:m.c,borderRadius:3}}/></div>
            </div>
          ))}
        </div>
      </Card>
      <Card style={{marginBottom:20}}>
        <div style={{fontWeight:800,fontSize:16,marginBottom:16}}>📅 Weekly Meal Plan</div>
        <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
          {DAYS.map(d=><button key={d} onClick={()=>setActiveDay(d)} style={{background:activeDay===d?sc:"#0f172a",color:activeDay===d?"#0f172a":"#64748b",border:`2px solid ${activeDay===d?sc:"#334155"}`,borderRadius:10,padding:"8px 16px",cursor:"pointer",fontWeight:700,fontSize:13}}>{d}</button>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {[{l:"🌅 Breakfast",v:dayData.breakfast},{l:"☀️ Lunch",v:dayData.lunch},{l:"🌙 Dinner",v:dayData.dinner},{l:"🍎 Snacks",v:dayData.snacks}].map(m=>(
            <div key={m.l} style={{background:"#0f172a",borderRadius:12,padding:16}}><div style={{fontWeight:700,color:sc,marginBottom:8,fontSize:14}}>{m.l}</div><div style={{color:"#cbd5e1",fontSize:13,lineHeight:1.6}}>{m.v}</div></div>
          ))}
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card style={{borderTop:"4px solid #22c55e"}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>✅ Foods to Eat</div>
          {data.foods.eat.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #0f172a"}}><span style={{color:"#22c55e"}}>●</span><span style={{color:"#cbd5e1",fontSize:13}}>{f}</span></div>)}
        </Card>
        <Card style={{borderTop:"4px solid #f43f5e"}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>❌ Foods to Avoid</div>
          {data.foods.avoid.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #0f172a"}}><span style={{color:"#f43f5e"}}>●</span><span style={{color:"#cbd5e1",fontSize:13}}>{f}</span></div>)}
        </Card>
      </div>
    </div>
  );
};

// ─── FITNESS PAGE ─────────────────────────────────────────────────────────────
const FitnessPage=({profile})=>{
  const sc=COLORS[profile.sport]||"#facc15";
  const tips={Swimming:["Dry-land strength training 3x/week","Core stability exercises (planks, dead bugs)","Shoulder mobility work daily","Plyometrics for explosive starts","Hip flexor stretching post-swim","Bilateral breathing drills"],Basketball:["Agility ladder drills","Vertical jump training","Core and hip strength","Zone 2 cardio for base endurance","Ankle stability work","Reaction time drills"],Soccer:["HIIT sessions 2x/week","Single-leg strength exercises","Hip flexor mobility","Sprinting mechanics drills","Lateral quickness ladders","Core rotation work"],"Track & Field":["Sprint mechanics drills","Strength training 3x/week","Plyometrics for power","Flexibility and mobility daily","Hill runs for strength","Tempo runs for base"],Gymnastics:["Handstand conditioning","Ring/bar strength work","Flexibility routines","Body tension drills","Core stability 5x/week","Wrist conditioning"],Cycling:["Interval training on bike","Core strength for stability","Hip flexor flexibility","Leg strength (squats, deadlifts)","Upper body for bike handling","Zone 2 endurance rides"],Tennis:["Agility ladder","Rotator cuff exercises","Lateral quickness","Core rotation strength","Wrist and forearm work","Explosive leg drills"],Volleyball:["Vertical jump training","Shoulder stability work","Core rotation exercises","Agility and footwork","Jump landing mechanics","Blocking arm drills"],Fencing:["Lunge depth work","Wrist and forearm strength","Lateral quickness","Core stability","Reaction time drills","Hip flexor flexibility"],"Ice Skating":["Off-ice edge work","Single-leg squats","Hip abductor work","Core for spins","Balance and stability","Ankle strength"],Wrestling:["Explosive hip work","Grip strength training","Core anti-rotation","Neck strengthening","Takedown drills","Conditioning circuits"],Rowing:["Erg intervals","Core endurance","Hip hinge mechanics","Lat and back strength","Leg drive power","Recovery stretching"]}[profile.sport]||["Sport-specific drills","Strength training","Cardio base","Mobility and flexibility","Core work","Recovery protocols"];
  const intensity={Recreational:{volume:"Low-Medium",frequency:"3-4x/week",restDays:"3",focus:"Technique & Base Fitness"},Amateur:{volume:"Medium-High",frequency:"4-5x/week",restDays:"2",focus:"Performance & Strength"},Elite:{volume:"High-Very High",frequency:"6x/week",restDays:"1",focus:"Peak Performance"}}[profile.level]||{volume:"Low-Medium",frequency:"3-4x/week",restDays:"3",focus:"Technique & Base Fitness"};
  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:32}}>
      <div style={{display:"flex",gap:8,marginBottom:8}}><Tag label={profile.sport} color={sc}/><Tag label={profile.level} color="#facc15"/></div>
      <h2 style={{fontWeight:900,fontSize:28,marginBottom:24}}>💪 Fitness Tips</h2>
      <Card style={{marginBottom:20,borderTop:`4px solid ${sc}`}}>
        <div style={{fontWeight:800,fontSize:16,marginBottom:16}}>⚡ Your Training Profile — {profile.level}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          {[{l:"Volume",v:intensity.volume},{l:"Frequency",v:intensity.frequency},{l:"Rest Days",v:intensity.restDays+" days/week"},{l:"Focus",v:intensity.focus}].map(x=>(
            <div key={x.l} style={{background:"#0f172a",borderRadius:12,padding:14,textAlign:"center"}}><div style={{fontSize:12,color:"#64748b",fontWeight:700}}>{x.l}</div><div style={{fontSize:13,color:sc,fontWeight:700,marginTop:4}}>{x.v}</div></div>
          ))}
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <Card style={{borderTop:`4px solid ${sc}`}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:16}}>🎯 Sport-Specific Drills</div>
          {tips.map((tip,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #0f172a"}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:sc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#0f172a",flexShrink:0}}>{i+1}</div>
              <div style={{color:"#cbd5e1",fontSize:13,lineHeight:1.5}}>{tip}</div>
            </div>
          ))}
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card style={{borderTop:"4px solid #22c55e"}}>
            <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>🕐 Weekly Structure</div>
            {[{day:"Mon/Thu",focus:"Strength & Power",c:"#f97316"},{day:"Tue/Fri",focus:"Sport-Specific Skills",c:sc},{day:"Wed",focus:"Active Recovery",c:"#22c55e"},{day:"Sat",focus:"Competition Simulation",c:"#8b5cf6"},{day:"Sun",focus:"Full Rest",c:"#64748b"}].map(d=>(
              <div key={d.day} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #0f172a"}}>
                <span style={{fontWeight:700,color:d.c,minWidth:70,fontSize:13}}>{d.day}</span>
                <span style={{color:"#94a3b8",fontSize:13}}>{d.focus}</span>
              </div>
            ))}
          </Card>
          <Card style={{borderTop:"4px solid #ec4899"}}>
            <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>🧘 Warm-Up Protocol</div>
            {["5 min light cardio (jog/bike)","Dynamic leg swings (10 each side)","Arm circles & shoulder rolls","Hip circles (10 each direction)","Sport-specific movement prep"].map((x,i)=>(
              <div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid #0f172a"}}><span style={{color:"#ec4899"}}>→</span><span style={{color:"#cbd5e1",fontSize:13}}>{x}</span></div>
            ))}
          </Card>
        </div>
      </div>
      <Card>
        <div style={{fontWeight:800,fontSize:15,marginBottom:16}}>🏋️ Body Composition Goals</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[{title:"Build Lean Muscle",tips:["Progressive overload in weights","Protein within 30 min post-training","Sleep 8+ hrs for muscle repair","Track strength gains weekly"],c:"#f97316"},{title:"Improve Endurance",tips:["Zone 2 cardio 2x/week","Increase volume by 10%/week","Build aerobic base first","Race simulation training"],c:sc},{title:"Reduce Body Fat",tips:["Caloric deficit on rest days only","High protein to preserve muscle","Avoid cutting during competition","Focus on performance not weight"],c:"#22c55e"}].map(b=>(
            <div key={b.title} style={{background:"#0f172a",borderRadius:12,padding:16}}>
              <div style={{fontWeight:700,color:b.c,marginBottom:10,fontSize:14}}>{b.title}</div>
              {b.tips.map((t,i)=><div key={i} style={{display:"flex",gap:6,marginBottom:6}}><span style={{color:b.c,fontSize:12}}>✓</span><span style={{color:"#94a3b8",fontSize:12}}>{t}</span></div>)}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

// ─── WORKOUTS PAGE ────────────────────────────────────────────────────────────
const WorkoutsPage=({profile})=>{
  const sc=COLORS[profile.sport]||"#facc15";
  const workouts=getWorkouts(profile.sport,profile.level);
  const todayIdx=new Date().getDay();
  const todayDay=DAYS[todayIdx===0?6:todayIdx-1];
  const [activeDay,setActiveDay]=useState(todayDay);
  const [completed,setCompleted]=useState({});
  const [reminderTime,setReminderTime]=useState("07:00");
  const [showCalModal,setShowCalModal]=useState(false);
  const [calSynced,setCalSynced]=useState(false);
  const [showBanner,setShowBanner]=useState(true);
  const dayData=workouts[activeDay]||Object.values(workouts)[0];
  const toggleEx=(day,idx)=>setCompleted(c=>({...c,[`${day}-${idx}`]:!c[`${day}-${idx}`]}));
  const totalEx=dayData?.exercises?.length||0;
  const doneCount=dayData?.exercises?.filter((_,i)=>completed[`${activeDay}-${i}`]).length||0;
  const progress=totalEx?Math.round(doneCount/totalEx*100):0;
  const handleDownload=()=>{generateICS(workouts,profile.sport,profile.level,reminderTime);setShowCalModal(false);setCalSynced(true);};
  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:32}}>
      {showBanner&&dayData&&(
        <div style={{background:`linear-gradient(135deg,${sc}22,#1e293b)`,border:`1px solid ${sc}44`,borderRadius:16,padding:16,marginBottom:24,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{fontSize:32}}>🔔</div>
            <div><div style={{fontWeight:800,color:sc,fontSize:15}}>Today's Workout — {todayDay}</div><div style={{color:"#94a3b8",fontSize:13,marginTop:2}}>{workouts[todayDay]?.focus||"Rest Day"} · {doneCount}/{totalEx} completed</div></div>
          </div>
          <button onClick={()=>setShowBanner(false)} style={{background:"transparent",color:"#64748b",border:"none",cursor:"pointer",fontSize:18}}>✕</button>
        </div>
      )}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><div style={{display:"flex",gap:8,marginBottom:8}}><Tag label={profile.sport} color={sc}/><Tag label={profile.level} color="#facc15"/></div><h2 style={{fontWeight:900,fontSize:28,margin:0}}>📅 Daily Workout Plans</h2></div>
        <button onClick={()=>setShowCalModal(true)} style={{background:calSynced?"#22c55e":sc,color:"#0f172a",border:"none",borderRadius:12,padding:"12px 20px",fontWeight:700,cursor:"pointer",fontSize:14}}>{calSynced?"✅ Calendar Synced":"📆 Add to Calendar"}</button>
      </div>
      {showCalModal&&(
        <div style={{position:"fixed",inset:0,background:"#000000aa",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
          <Card style={{maxWidth:460,width:"100%",border:`1px solid ${sc}`}}>
            <div style={{fontWeight:800,fontSize:18,marginBottom:8}}>📆 Add Workouts to Calendar</div>
            <p style={{color:"#94a3b8",fontSize:14,marginBottom:20}}>Download your weekly workout plan as a .ics file. Works with Google Calendar, Apple Calendar & Outlook. Each event repeats weekly automatically.</p>
            <div style={{marginBottom:20}}>
              <label style={{display:"block",fontWeight:700,fontSize:13,color:"#94a3b8",marginBottom:8}}>⏰ Preferred Workout Time</label>
              <input type="time" value={reminderTime} onChange={e=>setReminderTime(e.target.value)} style={{background:"#0f172a",border:`1px solid ${sc}`,borderRadius:10,padding:"12px 16px",color:"#e2e8f0",fontSize:16,fontWeight:700,width:"100%",boxSizing:"border-box"}}/>
              <p style={{color:"#64748b",fontSize:12,marginTop:6}}>A 30-minute reminder notification will be set before each workout.</p>
            </div>
            <div style={{background:"#0f172a",borderRadius:12,padding:16,marginBottom:20}}>
              <div style={{fontWeight:700,fontSize:13,color:"#facc15",marginBottom:10}}>📋 Workouts included:</div>
              {Object.entries(workouts).map(([d,w])=>(
                <div key={d} style={{display:"flex",gap:8,marginBottom:6}}><span style={{color:sc,fontWeight:700,minWidth:36,fontSize:13}}>{d}</span><span style={{color:"#94a3b8",fontSize:13}}>{w.focus}</span></div>
              ))}
            </div>
            <div style={{display:"flex",gap:12}}>
              <button onClick={handleDownload} style={{flex:1,background:sc,color:"#0f172a",border:"none",borderRadius:10,padding:"12px",fontWeight:700,cursor:"pointer"}}>⬇️ Download .ics File</button>
              <button onClick={()=>setShowCalModal(false)} style={{background:"transparent",color:"#94a3b8",border:"1px solid #334155",borderRadius:10,padding:"12px 20px",fontWeight:600,cursor:"pointer"}}>Cancel</button>
            </div>
            <p style={{color:"#475569",fontSize:11,marginTop:12,textAlign:"center"}}>Open the downloaded file to import into your calendar app.</p>
          </Card>
        </div>
      )}
      <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
        {Object.keys(workouts).map(d=>(
          <button key={d} onClick={()=>setActiveDay(d)} style={{background:activeDay===d?sc:d===todayDay?"#1e293b":"#0f172a",color:activeDay===d?"#0f172a":d===todayDay?sc:"#64748b",border:`2px solid ${activeDay===d?sc:d===todayDay?sc:"#334155"}`,borderRadius:12,padding:"10px 18px",cursor:"pointer",fontWeight:700,fontSize:13,position:"relative"}}>
            {d}{d===todayDay&&<span style={{position:"absolute",top:-4,right:-4,width:8,height:8,borderRadius:"50%",background:sc}}/>}
          </button>
        ))}
      </div>
      {dayData&&<>
        <Card style={{marginBottom:20,borderTop:`4px solid ${sc}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div><div style={{fontWeight:800,fontSize:18}}>{dayData.focus}</div><div style={{color:"#64748b",fontSize:13,marginTop:2}}>🔥 Warm-up: {dayData.warmup}</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:28,fontWeight:900,color:progress===100?"#22c55e":sc}}>{progress}%</div><div style={{fontSize:12,color:"#64748b"}}>Complete</div></div>
          </div>
          <div style={{height:8,background:"#0f172a",borderRadius:4}}><div style={{height:"100%",width:`${progress}%`,background:progress===100?"#22c55e":sc,borderRadius:4,transition:"width 0.4s"}}/></div>
          {progress===100&&<div style={{marginTop:12,textAlign:"center",color:"#22c55e",fontWeight:700}}>🎉 Workout Complete! Great work, {profile.name.split(" ")[0]}!</div>}
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:20}}>
          {dayData.exercises.map((ex,i)=>{
            const done=completed[`${activeDay}-${i}`];
            return(
              <Card key={i} style={{borderLeft:`4px solid ${done?"#22c55e":sc}`,opacity:done?0.8:1}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:done?"#22c55e":sc,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,color:"#0f172a",fontSize:15,flexShrink:0}}>{done?"✓":i+1}</div>
                    <div><div style={{fontWeight:800,fontSize:16,textDecoration:done?"line-through":"none",color:done?"#64748b":"#e2e8f0"}}>{ex.name}</div><div style={{color:done?"#64748b":sc,fontWeight:700,fontSize:14,marginTop:2}}>{ex.sets}</div></div>
                  </div>
                  <button onClick={()=>toggleEx(activeDay,i)} style={{background:done?"#22c55e22":"#0f172a",color:done?"#22c55e":sc,border:`2px solid ${done?"#22c55e":sc}`,borderRadius:10,padding:"8px 16px",cursor:"pointer",fontWeight:700,fontSize:13}}>{done?"✅ Done":"Mark Done"}</button>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div style={{background:"#0f172a",borderRadius:10,padding:12}}><div style={{fontSize:11,color:"#64748b",fontWeight:700,marginBottom:4}}>💡 TIPS</div><div style={{color:"#cbd5e1",fontSize:13,lineHeight:1.5}}>{ex.tips}</div></div>
                  <div style={{background:"#0f172a",borderRadius:10,padding:12}}><div style={{fontSize:11,color:"#64748b",fontWeight:700,marginBottom:4}}>🔄 ALTERNATIVE</div><div style={{color:"#cbd5e1",fontSize:13,lineHeight:1.5}}>{ex.alt}</div></div>
                  <div style={{background:"#0f172a",borderRadius:10,padding:12}}><div style={{fontSize:11,color:"#64748b",fontWeight:700,marginBottom:4}}>📈 PROGRESSION</div><div style={{color:"#cbd5e1",fontSize:13,lineHeight:1.5}}>{ex.prog}</div></div>
                  <div style={{background:"#0f172a",borderRadius:10,padding:12}}><div style={{fontSize:11,color:"#64748b",fontWeight:700,marginBottom:4}}>🎬 VIDEO GUIDE</div><a href={ex.yt} target="_blank" rel="noreferrer" style={{color:"#0ea5e9",fontSize:13,textDecoration:"none",fontWeight:600}}>Watch on YouTube →</a></div>
                </div>
              </Card>
            );
          })}
        </div>
        <Card style={{borderTop:"4px solid #8b5cf6"}}><div style={{fontWeight:800,fontSize:15,marginBottom:8}}>🧊 Cool-Down</div><div style={{color:"#cbd5e1",fontSize:14}}>{dayData.cooldown}</div></Card>
      </>}
    </div>
  );
};

// ─── RECOVERY PAGE ────────────────────────────────────────────────────────────
const RecoveryPage=({profile})=>{
  const sc=COLORS[profile.sport]||"#facc15";
  const injuryTips=RECOVERY_DATA.injuryPrevention[profile.sport]||RECOVERY_DATA.injuryPrevention.Swimming;
  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:32}}>
      <h2 style={{fontWeight:900,fontSize:28,marginBottom:24}}>🛌 Recovery Center</h2>
      <Card style={{marginBottom:20}}>
        <div style={{fontWeight:800,fontSize:16,marginBottom:16}}>📅 Post-Competition Recovery Schedule</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
          {RECOVERY_DATA.weeklySchedule.map((s,i)=>(
            <div key={i} style={{background:"#0f172a",borderRadius:12,padding:16,borderLeft:`4px solid ${[sc,"#22c55e","#f97316","#facc15"][i]}`}}>
              <div style={{fontWeight:700,color:[sc,"#22c55e","#f97316","#facc15"][i],fontSize:14}}>{s.day} — {s.phase}</div>
              <div style={{color:"#64748b",fontSize:12,marginBottom:10}}>{s.focus}</div>
              {s.actions.map((a,j)=><div key={j} style={{display:"flex",gap:6,marginBottom:4}}><span style={{color:[sc,"#22c55e","#f97316","#facc15"][i],fontSize:12}}>✓</span><span style={{color:"#94a3b8",fontSize:12}}>{a}</span></div>)}
            </div>
          ))}
        </div>
      </Card>
      <Card style={{marginBottom:20}}>
        <div style={{fontWeight:800,fontSize:16,marginBottom:16}}>🧊 Recovery Modalities</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
          {[{name:"Cold Water Immersion",desc:"10–15°C for 10–15 min post-competition. Reduces inflammation significantly.",icon:"🥶",c:"#0ea5e9",detail:"Best within 30 min of finishing"},{name:"Compression Therapy",desc:"Wear compression garments for 2-4 hrs post-training.",icon:"🩹",c:"#8b5cf6",detail:"Focus on legs and calves"},{name:"Sleep Optimization",desc:"8–10 hrs. Dark, cool room (16-18°C). No screens 1hr before.",icon:"😴",c:"#facc15",detail:"Consistency > duration"},{name:"Foam Rolling",desc:"10-15 min on major muscle groups. Move slowly over tight spots.",icon:"🪵",c:"#f97316",detail:"Quads, hamstrings, calves, lats"},{name:"Active Recovery",desc:"Light activity at 50-60% effort to flush lactic acid.",icon:"🚶",c:"#22c55e",detail:"Walk, swim easy or cycle"},{name:"Massage Therapy",desc:"Deep tissue 1-2x/month. Weekly for elite athletes.",icon:"💆",c:"#ec4899",detail:"Book 24-48hrs post competition"}].map(m=>(
            <div key={m.name} style={{background:"#0f172a",borderRadius:12,padding:16}}><div style={{fontSize:28}}>{m.icon}</div><div style={{fontWeight:700,color:m.c,marginTop:8,fontSize:14}}>{m.name}</div><div style={{color:"#64748b",fontSize:12,marginTop:6,lineHeight:1.5}}>{m.desc}</div><div style={{background:m.c+"22",color:m.c,borderRadius:6,padding:"4px 8px",fontSize:11,fontWeight:700,marginTop:8,display:"inline-block"}}>{m.detail}</div></div>
          ))}
        </div>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        <Card style={{borderTop:`4px solid ${sc}`}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>🛡️ Injury Prevention — {profile.sport}</div>
          {injuryTips.map((t,i)=><div key={i} style={{display:"flex",gap:8,padding:"8px 0",borderBottom:"1px solid #0f172a"}}><span style={{color:sc,fontWeight:700,flexShrink:0}}>✓</span><span style={{color:"#cbd5e1",fontSize:13,lineHeight:1.5}}>{t}</span></div>)}
        </Card>
        <Card style={{borderTop:"4px solid #f43f5e"}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>🩹 Minor Injury Protocol (R.I.C.E)</div>
          <div style={{background:"#f43f5e11",border:"1px solid #f43f5e44",borderRadius:10,padding:12,marginBottom:12}}><p style={{color:"#fca5a5",fontSize:12,margin:0}}>⚠️ General guidance only. Always consult a sports physiotherapist.</p></div>
          {[{l:"Rest",d:"Stop activity immediately. Avoid weight-bearing for 24-48hrs.",c:"#f43f5e"},{l:"Ice",d:"Apply for 15-20 min every 2-3 hrs. Never directly on skin.",c:"#0ea5e9"},{l:"Compression",d:"Elastic bandage to reduce swelling. Not too tight.",c:"#8b5cf6"},{l:"Elevation",d:"Raise above heart level to reduce swelling.",c:"#22c55e"}].map(r=>(
            <div key={r.l} style={{display:"flex",gap:10,padding:"8px 0",borderBottom:"1px solid #0f172a"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:r.c,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:11,color:"#fff",flexShrink:0}}>{r.l[0]}</div>
              <div><div style={{fontWeight:700,color:r.c,fontSize:13}}>{r.l}</div><div style={{color:"#94a3b8",fontSize:12,marginTop:2}}>{r.d}</div></div>
            </div>
          ))}
        </Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card style={{borderTop:"4px solid #facc15"}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>😴 Sleep Protocol</div>
          {RECOVERY_DATA.sleepProtocol.map((s,i)=><div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid #0f172a"}}><span style={{color:"#facc15"}}>→</span><span style={{color:"#cbd5e1",fontSize:13}}>{s}</span></div>)}
        </Card>
        <Card style={{borderTop:"4px solid #a78bfa"}}>
          <div style={{fontWeight:800,fontSize:15,marginBottom:12}}>🧠 Mental Recovery</div>
          {RECOVERY_DATA.mentalRecovery.map((s,i)=><div key={i} style={{display:"flex",gap:8,padding:"6px 0",borderBottom:"1px solid #0f172a"}}><span style={{color:"#a78bfa"}}>→</span><span style={{color:"#cbd5e1",fontSize:13}}>{s}</span></div>)}
        </Card>
      </div>
    </div>
  );
};

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
const ProfilePage=({user,onUpdate})=>{
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState(user);
  const [saved,setSaved]=useState(false);
  const fileRef=useRef();
  const sc=COLORS[form.sport]||"#facc15";
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const handleSave=()=>{onUpdate(form);setEditing(false);setSaved(true);setTimeout(()=>setSaved(false),3000);};
  const handlePhoto=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>set("photo",ev.target.result);r.readAsDataURL(f);};
  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:32}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <h2 style={{fontWeight:900,fontSize:28,margin:0}}>👤 My Profile</h2>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          {saved&&<span style={{color:"#22c55e",fontWeight:700,fontSize:14}}>✅ Saved!</span>}
          <button onClick={()=>editing?handleSave():setEditing(true)} style={{background:editing?"#22c55e":sc,color:"#0f172a",border:"none",borderRadius:10,padding:"10px 24px",fontWeight:700,cursor:"pointer"}}>{editing?"✅ Save":"✏️ Edit"}</button>
          {editing&&<button onClick={()=>setEditing(false)} style={{background:"transparent",color:"#94a3b8",border:"1px solid #334155",borderRadius:10,padding:"10px 16px",fontWeight:600,cursor:"pointer"}}>Cancel</button>}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"260px 1fr",gap:24}}>
        <Card style={{textAlign:"center"}}>
          <div style={{width:90,height:90,borderRadius:"50%",background:sc+"33",border:`3px solid ${sc}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:46,margin:"0 auto 16px",overflow:"hidden"}}>{form.photo?<img src={form.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="pf"/>:form.avatar}</div>
          {editing&&<><button onClick={()=>fileRef.current.click()} style={{background:sc,color:"#0f172a",border:"none",borderRadius:8,padding:"6px 14px",fontWeight:700,cursor:"pointer",fontSize:12,marginBottom:10}}>Change Photo</button><input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/></>}
          <div style={{fontWeight:800,fontSize:18}}>{form.name}</div>
          <div style={{color:"#64748b",fontSize:13,marginTop:4}}>{form.city}{form.city&&form.country?", ":""}{form.country}</div>
          <div style={{marginTop:12,display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center"}}><Tag label={form.sport} color={sc}/><Tag label={form.level} color="#facc15"/></div>
          {form.social&&<div style={{marginTop:10,color:"#0ea5e9",fontSize:13}}>{form.social}</div>}
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card>
            <div style={{fontWeight:800,fontSize:15,marginBottom:16}}>📋 Personal Details</div>
            {editing?(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["name","Full Name"],["age","Age"],["email","Email"],["phone","Phone"],["country","Country"],["city","City"]].map(([k,l])=>(
                  <div key={k}><label style={{display:"block",fontSize:12,color:"#64748b",fontWeight:700,marginBottom:4}}>{l}</label><input value={form[k]||""} onChange={e=>set(k,e.target.value)} style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:8,padding:"10px 12px",color:"#e2e8f0",fontSize:13,boxSizing:"border-box"}}/></div>
                ))}
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["Name",form.name],["Age",form.age],["Gender",form.gender],["Email",form.email],["Phone",form.phone||"—"],["Location",`${form.city||""}${form.city&&form.country?", ":""}${form.country||""}`||"—"]].map(([l,v])=>(
                  <div key={l} style={{background:"#0f172a",borderRadius:10,padding:12}}><div style={{fontSize:11,color:"#64748b",fontWeight:700}}>{l}</div><div style={{fontSize:14,color:"#e2e8f0",fontWeight:600,marginTop:2}}>{v}</div></div>
                ))}
              </div>
            )}
          </Card>
          <Card>
            <div style={{fontWeight:800,fontSize:15,marginBottom:16}}>🏟️ Club & Team</div>
            {editing?(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["club","Club / Team"],["coach","Coach"],["clubWebsite","Website"]].map(([k,l])=>(
                  <div key={k}><label style={{display:"block",fontSize:12,color:"#64748b",fontWeight:700,marginBottom:4}}>{l}</label><input value={form[k]||""} onChange={e=>set(k,e.target.value)} style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:8,padding:"10px 12px",color:"#e2e8f0",fontSize:13,boxSizing:"border-box"}}/></div>
                ))}
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                {[["Club",form.club||"Independent"],["Coach",form.coach||"—"],["Training Days",(form.trainingDays||[]).join(", ")||"—"],["Website",form.clubWebsite||"—"]].map(([l,v])=>(
                  <div key={l} style={{background:"#0f172a",borderRadius:10,padding:12}}><div style={{fontSize:11,color:"#64748b",fontWeight:700}}>{l}</div><div style={{fontSize:14,color:"#e2e8f0",fontWeight:600,marginTop:2}}>{v}</div></div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App(){
  const [appState,setAppState]=useState("auth");
  const [authUser,setAuthUser]=useState(null);
  const [profile,setProfile]=useState(null);
  const [page,setPage]=useState("Home");
  const [liked,setLiked]=useState({});
  const [posts,setPosts]=useState(POSTS_INIT);
  const [newPost,setNewPost]=useState({title:"",body:""});
  const [postSubmitted,setPostSubmitted]=useState(false);
  const [expandedPost,setExpandedPost]=useState(null);
  const [replyText,setReplyText]=useState({});

  // ── UNCOMMENT FOR SUPABASE SESSION ──
  // useEffect(()=>{
  //   supabase.auth.getSession().then(({data:{session}})=>{
  //     if(session?.user){setAuthUser(session.user);loadProfile(session.user.id);}
  //     else{setAppState("auth");}
  //   });
  //   const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{
  //     if(event==="SIGNED_OUT"){setAppState("auth");setAuthUser(null);setProfile(null);}
  //   });
  //   return ()=>subscription.unsubscribe();
  // },[]);
  //
  // const loadProfile=async(userId)=>{
  //   const {data}=await supabase.from("profiles").select("*").eq("id",userId).single();
  //   if(data){setProfile({...data,trainingDays:data.training_days||[],id:userId});setAppState("app");}
  //   else{setAppState("onboarding");}
  // };

  const handleAuth=u=>{setAuthUser(u);setAppState("onboarding");};
  const handleOnboardingComplete=form=>{setProfile({...form,id:authUser?.id});setAppState("welcome");};
  const handleEnterApp=()=>setAppState("app");
  const handleUpdateProfile=updated=>setProfile({...updated,id:authUser?.id});
  const handleLogout=()=>{setAppState("auth");setAuthUser(null);setProfile(null);setPage("Home");};

  const submitPost=()=>{
    if(!newPost.title.trim()||!newPost.body.trim())return;
    const p={id:Date.now(),name:profile.name,sport:profile.sport,level:profile.level,avatar:profile.avatar||"👤",time:"just now",title:newPost.title,body:newPost.body,likes:0,replies:0,repliesList:[],color:COLORS[profile.sport]||"#facc15"};
    setPosts([p,...posts]);setNewPost({title:"",body:""});setPostSubmitted(true);
    setTimeout(()=>setPostSubmitted(false),3000);
  };
  const submitReply=postId=>{
    const text=(replyText[postId]||"").trim();if(!text)return;
    const reply={id:Date.now(),name:profile.name,sport:profile.sport,avatar:profile.avatar||"👤",time:"just now",body:text,color:COLORS[profile.sport]||"#facc15"};
    setPosts(posts.map(p=>p.id===postId?{...p,replies:p.replies+1,repliesList:[...p.repliesList,reply]}:p));
    setReplyText({...replyText,[postId]:""});
  };

  if(appState==="auth")return<AuthScreen onAuth={handleAuth}/>;
  if(appState==="onboarding")return<Onboarding userId={authUser?.id} onComplete={handleOnboardingComplete}/>;
  if(appState==="welcome")return<WelcomeScreen user={profile} onEnter={handleEnterApp}/>;
  if(!profile)return<div style={{color:"#fff",padding:32,background:"#0f172a",minHeight:"100vh"}}>Loading...</div>;

  const sc=COLORS[profile.sport]||"#facc15";

  return(
    <div style={{minHeight:"100vh",background:"#0f172a",color:"#e2e8f0",fontFamily:"'Segoe UI', sans-serif"}}>
      <Nav page={page} setPage={setPage} user={profile} onLogout={handleLogout}/>
      {page==="Profile"&&<ProfilePage user={profile} onUpdate={handleUpdateProfile}/>}
      {page==="Nutrition"&&<NutritionPage profile={profile}/>}
      {page==="Fitness"&&<FitnessPage profile={profile}/>}
      {page==="Workouts"&&<WorkoutsPage profile={profile}/>}
      {page==="Recovery"&&<RecoveryPage profile={profile}/>}
      {page==="Home"&&(
        <div style={{maxWidth:900,margin:"0 auto",padding:32}}>
          <div style={{background:"linear-gradient(135deg,#1e293b,#0f172a)",borderRadius:24,padding:"48px 40px",marginBottom:32,border:"1px solid #334155",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",right:-20,top:-20,fontSize:180,opacity:0.05}}>🏅</div>
            <div style={{fontSize:13,color:"#facc15",fontWeight:700,marginBottom:12,letterSpacing:2}}>WELCOME BACK</div>
            <h1 style={{fontSize:36,fontWeight:900,margin:"0 0 16px",lineHeight:1.1}}>Ready to train, <span style={{color:sc}}>{profile.name.split(" ")[0]}?</span> 💪</h1>
            <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}><Tag label={profile.sport} color={sc}/><Tag label={profile.level} color="#facc15"/>{(profile.goals||[]).map(g=><Tag key={g} label={g} color="#a78bfa"/>)}</div>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button onClick={()=>setPage("Workouts")} style={{background:sc,color:"#0f172a",border:"none",borderRadius:10,padding:"12px 24px",fontWeight:700,fontSize:15,cursor:"pointer"}}>Today's Workout →</button>
              <button onClick={()=>setPage("Nutrition")} style={{background:"transparent",color:"#e2e8f0",border:"2px solid #334155",borderRadius:10,padding:"12px 24px",fontWeight:600,fontSize:15,cursor:"pointer"}}>Meal Plan</button>
              <button onClick={()=>setPage("Community")} style={{background:"transparent",color:"#e2e8f0",border:"2px solid #334155",borderRadius:10,padding:"12px 24px",fontWeight:600,fontSize:15,cursor:"pointer"}}>Community</button>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
            {[{icon:"🥗",label:"Nutrition Plans",val:"Weekly meal plans + macros",color:"#22c55e",p:"Nutrition"},{icon:"💪",label:"Fitness Tips",val:"Sport & level tailored",color:"#f97316",p:"Fitness"},{icon:"📅",label:"Workout Plans",val:"Daily exercises + calendar",color:sc,p:"Workouts"},{icon:"🛌",label:"Recovery",val:"Science-backed protocols",color:"#8b5cf6",p:"Recovery"},{icon:"🌍",label:"Community",val:"Connect with athletes",color:"#0ea5e9",p:"Community"},{icon:"👤",label:"My Profile",val:"Manage your details",color:"#facc15",p:"Profile"}].map(s=>(
              <Card key={s.label} style={{textAlign:"center",cursor:"pointer",border:"1px solid #334155"}} onClick={()=>setPage(s.p)}>
                <div style={{fontSize:36}}>{s.icon}</div>
                <div style={{fontWeight:800,color:s.color,fontSize:15,marginTop:8}}>{s.label}</div>
                <div style={{color:"#64748b",fontSize:12,marginTop:4}}>{s.val}</div>
              </Card>
            ))}
          </div>
        </div>
      )}
      {page==="Community"&&(
        <div style={{maxWidth:900,margin:"0 auto",padding:32}}>
          <h2 style={{fontWeight:900,fontSize:28,marginBottom:4}}>🌍 Community Feed</h2>
          <p style={{color:"#64748b",marginBottom:24}}>Ask questions, share tips, and connect with athletes.</p>
          <Card style={{marginBottom:24,border:`1px solid ${sc}44`}}>
            <div style={{fontWeight:800,fontSize:16,marginBottom:16}}>✍️ Share with the community</div>
            <input value={newPost.title} onChange={e=>setNewPost({...newPost,title:e.target.value})} placeholder="Post title..." style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:10,padding:"12px 16px",color:"#e2e8f0",fontSize:14,marginBottom:10,boxSizing:"border-box"}}/>
            <textarea value={newPost.body} onChange={e=>setNewPost({...newPost,body:e.target.value})} placeholder="Share your question, tip, or experience..." rows={3} style={{width:"100%",background:"#0f172a",border:"1px solid #334155",borderRadius:10,padding:"12px 16px",color:"#e2e8f0",fontSize:14,resize:"none",boxSizing:"border-box"}}/>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:sc+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,overflow:"hidden"}}>{profile.photo?<img src={profile.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="av"/>:profile.avatar||"👤"}</div>
                <span style={{fontSize:13,color:"#64748b"}}><span style={{color:sc,fontWeight:700}}>{profile.name}</span> · {profile.sport} · {profile.level}</span>
              </div>
              <button onClick={submitPost} style={{background:sc,color:"#0f172a",border:"none",borderRadius:10,padding:"10px 24px",fontWeight:700,cursor:"pointer"}}>{postSubmitted?"✅ Posted!":"Post →"}</button>
            </div>
          </Card>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            {posts.map(p=>(
              <Card key={p.id} style={{borderLeft:`4px solid ${p.color}`}}>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:38,height:38,borderRadius:"50%",background:p.color+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{p.avatar}</div>
                  <div><div style={{fontWeight:700,fontSize:14}}>{p.name}</div><div style={{fontSize:12,color:"#64748b"}}><Tag label={p.sport} color={p.color}/>&nbsp;{p.level} · {p.time}</div></div>
                </div>
                <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>{p.title}</div>
                <p style={{color:"#94a3b8",fontSize:14,lineHeight:1.6,margin:0}}>{p.body}</p>
                <div style={{display:"flex",gap:16,marginTop:14}}>
                  <button onClick={()=>setLiked({...liked,[p.id]:!liked[p.id]})} style={{background:liked[p.id]?"#f43f5e22":"transparent",color:liked[p.id]?"#f43f5e":"#64748b",border:"1px solid "+(liked[p.id]?"#f43f5e":"#334155"),borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:600}}>❤️ {p.likes+(liked[p.id]?1:0)}</button>
                  <button onClick={()=>setExpandedPost(expandedPost===p.id?null:p.id)} style={{background:expandedPost===p.id?"#0ea5e922":"transparent",color:expandedPost===p.id?"#0ea5e9":"#64748b",border:"1px solid "+(expandedPost===p.id?"#0ea5e9":"#334155"),borderRadius:8,padding:"6px 14px",cursor:"pointer",fontSize:13,fontWeight:600}}>💬 {p.replies} {p.replies===1?"reply":"replies"}</button>
                </div>
                {expandedPost===p.id&&(
                  <div style={{marginTop:16,borderTop:"1px solid #334155",paddingTop:16}}>
                    {p.repliesList.length>0&&<div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>{p.repliesList.map(r=>(
                      <div key={r.id} style={{display:"flex",gap:10,background:"#0f172a",borderRadius:12,padding:12}}>
                        <div style={{width:30,height:30,borderRadius:"50%",background:r.color+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{r.avatar}</div>
                        <div><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontWeight:700,fontSize:13}}>{r.name}</span><Tag label={r.sport} color={r.color}/><span style={{color:"#475569",fontSize:12}}>{r.time}</span></div><p style={{color:"#94a3b8",fontSize:13,margin:0}}>{r.body}</p></div>
                      </div>
                    ))}</div>}
                    {p.repliesList.length===0&&<p style={{color:"#475569",fontSize:13,marginBottom:16}}>No replies yet. Be the first!</p>}
                    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:30,height:30,borderRadius:"50%",background:sc+"33",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0,overflow:"hidden"}}>{profile.photo?<img src={profile.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt="av"/>:profile.avatar||"👤"}</div>
                      <div style={{flex:1}}>
                        <textarea value={replyText[p.id]||""} onChange={e=>setReplyText({...replyText,[p.id]:e.target.value})} placeholder="Write a reply..." rows={2} style={{width:"100%",background:"#1e293b",border:"1px solid #334155",borderRadius:10,padding:"10px 14px",color:"#e2e8f0",fontSize:13,resize:"none",boxSizing:"border-box"}}/>
                        <button onClick={()=>submitReply(p.id)} style={{background:sc,color:"#0f172a",border:"none",borderRadius:8,padding:"8px 18px",fontWeight:700,cursor:"pointer",fontSize:13,marginTop:8}}>Reply →</button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
      <div style={{textAlign:"center",padding:32,color:"#334155",fontSize:13}}>
        🏅 AthleteEdge · Built for athletes, by athletes · <span style={{color:"#facc15"}}>Not a substitute for professional medical advice.</span>
      </div>
    </div>
  );
}