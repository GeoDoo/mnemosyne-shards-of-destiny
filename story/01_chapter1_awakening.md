# Chapter 1: The Awakening

> *Alkmaeon leaves his village to explore the Temple of Apollo. He faces his first battles, receives a divine vision from Apollo himself, and learns the skill that will define his journey. Upon returning, he meets Theano — the oracle apprentice who will become his first companion.*

**Prerequisites**: Prologue complete (`red_moon_witnessed` flag set)

---

## Scene 1.1: Dawn Departure

**Type**: Story / Emotional beat  
**Location**: Alkmaeon's home → Village exit  
**Time**: Dawn  
**Audio**: Quiet morning, birdsong, somber tone

---

### Waking at Dawn

*[Interior — Alkmaeon's home, first light through the window]*

> You did not sleep.

> The Red Moon has set, but its image burns behind your eyes.

> You know what you must do.

*[Alkmaeon rises, gathers his things]*

> Your mother sits by the cold hearth, waiting.

> She has not slept either.

---

### Dialogue: Mother's Farewell

**Alkmaeon's Mother:**
> "So. You're leaving."

> "I knew this day would come. I just... hoped it wouldn't be so soon."

*[She stands, approaches Alkmaeon]*

**Alkmaeon's Mother:**
> "Your father heard the call too, you know."

> "The temple. The visions. He climbed that mountain and never came back the same."

**Alkmaeon's Mother:**
> "He went searching for answers. Out into the world."

> "He died searching."

*[She takes Alkmaeon's hands]*

**Alkmaeon's Mother:**
> "I won't ask you to stay. The gods don't give us that choice."

> "But promise me — promise me you'll come back."

*[Player choice]*

**Option A: "I promise."**
> **Mother:** "Then go. And may Apollo light your path."
> *[She embraces him]*

**Option B: "I'll try."**
> **Mother:** "That's all any of us can do."
> *[She embraces him, tears in her eyes]*

**Option C: "I don't know if I can."**
> **Mother:** "Honest, like your father."
> "Then at least promise you'll remember us. Remember home."
> *[She embraces him]*

---

*[Mother gives Alkmaeon an item]*

**Alkmaeon's Mother:**
> "Take this. It was your father's."

> "He said it guided him when he was lost."

> ***Received: Father's Compass***
> *An old bronze compass. The needle spins slowly, pointing... somewhere.*
> *Effect: Key item — reveals hidden paths*

**Alkmaeon's Mother:**
> "Now go. Before I change my mind and lock you in the cellar."

*[She manages a small smile]*

---

### Leaving the Village

*[Exterior — Village square at dawn]*

> The village is quiet. Most are still asleep.

> But a few faces watch from windows. Word has spread.

> The boy who saw visions. The boy the Red Moon marked.

---

### NPC: Epimenides (Dawn)

**Location**: Standing at the village gate

**Epimenides:**
> "Alkmaeon. I knew you would not wait."

> "The pull is too strong now. I understand."

**Epimenides:**
> "Return to the temple. Go deeper than before."

> "There is a sanctum at its heart — an altar where the priests once communed with Apollo."

> "If answers exist, they will be there."

**Epimenides:**
> "But be warned. The temple is no longer sacred ground."

> "Spirits linger there. Echoes of the past, twisted by centuries of neglect."

> "They will not welcome you."

*[Player choice]*

**Option A: "I can handle myself."**
> **Epimenides:** "Confidence is good. Overconfidence is fatal."
> "Here. You may need this."

**Option B: "What kind of spirits?"**
> **Epimenides:** "The lost. The forgotten. Fragments of memory given form."
> "They are not evil — merely confused. Trapped between what was and what is."
> "But they will attack anything that disturbs their slumber."

**Option C: "Will you come with me?"**
> **Epimenides:** "These old bones would slow you down."
> "Besides, my place is here. Watching. Waiting."
> "Your path lies ahead, not behind."

---

*[Epimenides gives Alkmaeon items]*

**Epimenides:**
> "Take these. Healing herbs from my garden."

> "And remember — when in doubt, defend. Live to strike another day."

> ***Received: Healing Herb x3***
> *Restores 30 HP when used.*

**Epimenides:**
> "Go now. The temple awaits."

> "And Alkmaeon — trust the visions. They are trying to show you the truth."

*[Story flag set: `chapter1_started`]*

---

## Scene 1.2: Temple Exterior

**Type**: Exploration / Combat introduction  
**Location**: Temple of Apollo — Outer Ruins  
**Audio**: Wind, distant whispers, unsettling ambience

---

### Entering the Ruins

*[Player arrives at the temple — different feel from prologue visit]*

> The temple feels different in the morning light.

> Last night's vision has changed something — or perhaps changed you.

> The stones hum with energy you couldn't sense before.

> And in the shadows between the columns... movement.

---

### First Combat Encounter

*[A TEMPLE SPIRIT materializes — tutorial combat trigger]*

> A shape coalesces from the morning mist.

> Pale. Translucent. A face twisted in confusion and rage.

> It sees you — and screams.

***Combat Tutorial Initiated***

---

### Combat Tutorial

**System Message:**
> *A hostile spirit attacks! This is your first battle.*

**Tutorial Step 1: Turn Order**
> *Combat is turn-based. The combatant with the highest Speed acts first.*
> *Your Speed: 10 | Enemy Speed: 6*
> *You act first!*

**Tutorial Step 2: Basic Commands**
> *Choose your action:*
> - **Attack** — Strike the enemy with a basic attack
> - **Defend** — Reduce incoming damage by 50% this turn
> - **Items** — Use items from your inventory

**Tutorial Step 3: Attacking**
> *Select Attack, then choose your target.*
> *Damage is calculated from your Attack stat vs. enemy Defense.*

*[Player defeats the Temple Spirit]*

**Victory!**
> *You defeated the Temple Spirit!*
> *Gained 12 XP*
> *Gained 8 currency*

---

### After First Combat

> The spirit dissolves into motes of light.

> For a moment, you see a flash — a priest in white robes, praying at this very spot.

> Then it's gone.

> These spirits... they were people once. Worshippers. Priests.

> What happened to them?

*[Player regains control — can explore the outer ruins]*

---

### Outer Ruins Exploration

**Area Description:**
> *The outer ruins are a maze of fallen columns and crumbling walls.*
> *Three paths lead deeper into the temple complex.*

---

**Path A: Western Colonnade**

*[Contains 1-2 random encounters: Temple Spirits]*

**Examine: Fallen Statue**
> *A statue of Apollo, toppled and cracked.*
> *His marble eyes stare at the sky, sightless.*
> *One hand is missing — the hand that once held a golden lyre.*

**Examine: Faded Mural**
> *Traces of paint cling to the wall.*
> *You can barely make out the image: Apollo driving his chariot across the heavens.*
> *Below, tiny figures raise their hands in worship.*

**Item: Hidden Alcove**
> *Behind a collapsed pillar, you find a small offering niche.*
> ***Found: Ancient Coin x2***

---

**Path B: Eastern Garden**

*[Contains 1-2 random encounters: Memory Wisps]*

**Examine: Dead Fountain**
> *A fountain, long dry. Moss grows in the basin.*
> *Once, sacred water flowed here — water said to grant prophetic dreams.*

**Examine: Withered Laurel**
> *A laurel tree, sacred to Apollo, stands dead at the garden's center.*
> *But at its base, a single green shoot pushes through the soil.*

**NPC: Lingering Echo**
> *A translucent figure kneels by the fountain, weeping.*
> *It does not attack — it doesn't seem to notice you at all.*

*[If approached]*
> **Lingering Echo:** "The light... the light has gone..."
> "Why have the gods abandoned us?"
> *[The figure fades before you can respond]*

---

**Path C: Northern Steps (to Inner Temple)**

*[Blocked by a CORRUPTED SHADE — mini-boss encounter]*

> The steps leading to the inner temple are guarded.

> A shadow darker than the others coils at the threshold.

> It turns toward you — and you see a face within the darkness.

> Hollow eyes. A silent scream.

***Boss Encounter: Corrupted Shade***

---

### Mini-Boss: Corrupted Shade

**Corrupted Shade** (HP: 28, High Speed)
- Uses: Basic Attack, Shadow Strike
- Weakness: Light element
- Immune: Shadow element

**Battle Start:**
> *The Corrupted Shade hisses — a sound like tearing silk.*
> *It was a priest once. You can see the remnants of robes in its form.*
> *Now it is only hunger and shadow.*

**At 50% HP:**
> *The shade recoils, flickering.*
> *For a moment, you see the priest it once was — terrified, reaching out.*
> **Corrupted Shade:** "Help... me..."
> *Then the darkness swallows the vision, and it attacks with renewed fury.*

**Victory:**
> *The Corrupted Shade dissolves — but slowly, reluctantly.*
> *As it fades, you hear a whisper:*
> **Voice:** "Thank... you..."
> *Then silence.*

> *Gained 15 XP*
> *Gained 10 currency*
> ***Found: Shadow Essence***
> *A fragment of crystallized darkness. Used for crafting.*

---

## Scene 1.3: The Inner Temple

**Type**: Exploration / Story  
**Location**: Temple of Apollo — Inner Sanctum  
**Audio**: Deep resonance, echoing space, faint divine harmony

---

### Entering the Sanctum

> Beyond the shade's vigil, the temple opens into a vast chamber.

> This is the inner sanctum — the heart of Apollo's worship.

> Shattered though it is, you can feel the power here.

> It thrums in the stones. It sings in the air.

> At the chamber's center: the altar.

---

### Inner Sanctum Exploration

**Examine: Broken Pillars**
> *Massive columns, each carved with scenes of Apollo's deeds.*
> *His victory over the serpent Python. His gift of prophecy to mortals.*
> *His contest with Marsyas — the satyr who dared challenge a god.*

**Examine: Mosaic Floor**
> *Beneath the dust, a mosaic depicts the sun — Apollo's symbol.*
> *Golden tiles still glimmer faintly, catching the light.*

**Examine: Empty Pedestal**
> *A pedestal where something once stood.*
> *The shape of the base suggests a lyre — Apollo's sacred instrument.*
> *It's gone now. Stolen or lost centuries ago.*

**Examine: Priest's Quarters (Side Room)**
> *A small chamber where the priests once lived.*
> *Simple beds. A writing desk. Scrolls crumbled to dust.*
> ***Found: Faded Scroll***
> *"When the Red Moon rises, the Sleeper stirs. Only Memory can bind what Chaos would free."*

---

### The Altar

**Location**: Center of the Inner Sanctum

> *The altar stands at the chamber's heart.*
> *Cracked down the middle, yet still radiating faint warmth.*
> *You feel drawn to it. Compelled.*

*[Interact with Altar — triggers vision sequence]*

---

## Scene 1.4: Vision of Apollo

**Type**: Vision sequence (auto-advancing)  
**Visuals**: Bright, golden, overwhelming  
**Audio**: Divine choir, ringing light, Apollo's voice (resonant, beautiful, inhuman)

---

### Vision Sequence

*[Screen flashes gold as Alkmaeon touches the altar]*

> Your hand touches the stone —

> — and the world falls away.

*[Vision: The temple whole and magnificent]*

> You stand in the temple as it once was.

> Gleaming marble. Golden light. Incense in the air.

> Worshippers fill the space — hundreds, thousands — their voices raised in hymn.

*[Vision: Apollo appears]*

> And there, before the altar...

> A figure of impossible beauty.

> Golden hair like sunlight. Eyes that see past, present, and future all at once.

> Apollo. God of light. God of truth. God of prophecy.

> He turns to face you.

---

### Apollo Speaks

**Apollo:**
> "Child of Memory."

> "You have come at last."

*[The temple fades — you stand in a void of golden light, alone with the god]*

**Apollo:**
> "Do you know what you are?"

*[Player choice — but Apollo continues regardless]*

**Apollo:**
> "You are a vessel. A bearer of Mnemosyne's gift."

> "The memories of the cosmos flow through you — though you do not yet know how to hear them."

**Apollo:**
> "Long ago, my mother Mnemosyne wove the Order of Destiny."

> "A harmony that bound chaos and preserved the shape of the world."

> "But that order was shattered. Its fragments — the Shards of Destiny — were scattered and lost."

**Apollo:**
> "One such shard rests in this very temple. Buried. Forgotten."

> "It calls to you because you are the one meant to find it."

---

**Apollo:**
> "But you are not ready. Not yet."

> "The spirits here are merely echoes. What lies ahead is far more dangerous."

> "You must grow stronger. Learn to channel the power within you."

**Apollo:**
> "I give you a gift — a fragment of my light, shaped by Mnemosyne's memory."

> "Use it well."

*[Apollo raises his hand — light flows into Alkmaeon]*

> ***Learned: Memory Flash***
> *Strike with a flash of divine memory. Deals Light damage to one enemy.*
> *MP Cost: 12 | Power: 25 | Scales with Magic*

---

**Apollo:**
> "Find the Shards, child. Restore what was broken."

> "The Red Moon rises. Typhon stirs in his prison."

> "If the Order is not restored before the moon reaches its zenith..."

> "...chaos will consume everything."

**Apollo:**
> "Go now. My light will guide you — but the path is yours to walk."

*[The vision begins to fade]*

**Apollo:**
> "And child..."

> "Beware Hécate's crossroads. She serves order... but her methods are her own."

> "Not all guides lead where you wish to go."

*[Vision ends — white flash]*

---

### After the Vision

*[Alkmaeon collapses, then wakes on the altar floor]*

> You gasp awake.

> The sanctum is silent. The golden light is gone.

> But something remains — a warmth in your chest, a light behind your eyes.

> You feel... different. Stronger.

> The power Apollo gave you pulses through your veins.

*[System message]*
> ***Memory Flash has been added to your skills.***
> *You can now use this skill in combat!*

---

### Skill Tutorial

*[A MEMORY WISP appears — tutorial for new skill]*

> As you rise, the air shimmers.

> A wisp of light coalesces — drawn by the power you now carry.

> It doesn't attack immediately. It seems... curious.

> But then instinct takes over, and it lunges.

***Combat: Memory Wisp***

**Tutorial: Using Skills**
> *You've learned a new skill! Skills cost MP to use.*
> *Your MP: 30 | Memory Flash cost: 12*
> *Select Skills → Memory Flash to try it!*

*[Player uses Memory Flash — deals heavy damage due to Light weakness]*

> *Memory Flash deals 45 damage! (Light weakness)*
> *The Memory Wisp is defeated!*

**Victory!**
> *Gained 8 XP*
> *Gained 5 currency*

---

### Leaving the Temple

> The temple feels quieter now. Calmer.

> The spirits that remain seem to watch you differently.

> Not with hostility — with something like hope.

> You've done something here. Changed something.

> But there's more to do. Apollo's words echo in your mind.

> *Find the Shards. Restore what was broken.*

> It's time to return to the village.

---

## Scene 1.5: Return to Helikon

**Type**: Story / Character introduction  
**Location**: Helikon  
**Time**: Late afternoon  
**Audio**: Village ambience, but more somber than before

---

### Village Changed

*[Player enters village — atmosphere is different]*

> The village feels changed.

> Or perhaps you are the one who has changed.

> The familiar streets seem smaller now. The faces more distant.

> Word has spread. They know you went to the temple again.

> They watch you with a mixture of awe and fear.

---

### NPC: Damon (Changed Dialogue)

**Damon:**
> "Alkmaeon... is it true? You went into the inner temple?"

> "My grandfather says no one's been that deep in generations."

*[He looks at you differently — uncertain]*

**Damon:**
> "You seem... different. Did something happen up there?"

*[Player choice]*

**Option A: "I met a god."**
> **Damon:** "A god?! You're joking. You have to be joking."
> *[He backs away slowly]*
> "I... I need to go. The sheep. I need to check on the sheep."

**Option B: "I learned some things about myself."**
> **Damon:** "Yeah? Well... good for you, I guess."
> "Just... be careful, okay? Strange things happen to people who mess with the old places."

**Option C: "Nothing I want to talk about."**
> **Damon:** "Right. Sure. I get it."
> "Just... you know where to find me. If you ever want to talk."

---

### NPC: Kleio (Changed Dialogue)

**Kleio:**
> "The temple boy returns."

> "I can see it in your eyes. The same look your father had."

**Kleio:**
> "He went seeking answers too. Found them, I suppose."

> "Cost him everything."

*[She studies you]*

**Kleio:**
> "But you... you might be different. Stronger, maybe."

> "Or maybe the gods are just crueler than I thought."

**Kleio:**
> "There's a girl at the shrine. Arrived this morning."

> "She's been asking about you. About the visions."

> "You might want to talk to her."

---

### NPC: Epimenides (Changed Dialogue)

**Location**: His house

**Epimenides:**
> "Alkmaeon. You've returned — and I can see you've been... touched."

> "The light of Apollo. I haven't seen it in mortal eyes since..."

*[He trails off]*

**Epimenides:**
> "Tell me. What did you see?"

*[Player recounts the vision — summarized]*

**Epimenides:**
> "The Shards of Destiny. So the old texts were true."

> "Fragments of cosmic order, scattered when Typhon was imprisoned."

> "If Apollo himself has tasked you with finding them..."

**Epimenides:**
> "This is beyond anything I can help you with, boy."

> "But there is someone who might know more."

> "A young woman arrived at the village shrine this morning."

> "She says she's an apprentice oracle. Trained at the sanctuary of Demeter itself."

**Epimenides:**
> "Her name is Theano. Find her. She may have answers I do not."

---

## Scene 1.6: Meeting Theano

**Type**: Character introduction  
**Location**: Village Shrine  
**Audio**: Gentle, mystical undertone

---

### Approaching the Shrine

> The village shrine stands at the eastern edge of town.

> Small, modest — nothing like the Temple of Apollo.

> But as you approach, you feel something. A presence.

> Someone is here who understands.

*[A young woman kneels before the shrine, deep in prayer]*

> She wears simple white robes. Her dark hair is braided with silver thread.

> An oracle's apprentice. You can tell by the way she holds herself.

> Calm. Centered. Listening to voices you cannot hear.

---

### Dialogue: Theano Introduction

*[LYRA senses your approach and rises]*

**Theano:**
> "You're him. The one who touched Apollo's light."

> "I felt it from across the valley. A flash like a second sun."

*[She turns to face you — her eyes are a striking pale blue, almost silver]*

**Theano:**
> "I am Theano. Apprentice of the Pythia — the Oracle of the sanctuary of Demeter."

> "I was sent here three days ago, following a vision."

> "A vision of this village. This mountain. And a boy who carries Memory's flame."

---

**Theano:**
> "You are Alkmaeon, yes? The villagers speak of nothing else."

*[Player choice]*

**Option A: "How do you know about the visions?"**
> **Theano:** "I am an oracle, Alkmaeon. Visions are my life."
> "But yours are different. Stronger. More... direct."
> "Apollo speaks to many. But few hear him as clearly as you seem to."

**Option B: "Why were you sent here?"**
> **Theano:** "The Pythia saw a disturbance. A stirring in the cosmic order."
> "She sent me to investigate — and to help, if I could."
> "I think you are the disturbance she saw."

**Option C: "I don't need an oracle's help."**
> **Theano:** "Perhaps not. But you have it anyway."
> "The gods do not send us where we are not needed."
> "Whether you accept my help is your choice. But I will not abandon my task."

---

**Theano:**
> "I know what happened in the temple. I could feel the vision from here."

> "Apollo has given you a great gift — and a terrible burden."

> "The Shards of Destiny... I have read of them in the oldest texts."

**Theano:**
> "They are fragments of Mnemosyne's power, scattered across the world."

> "Each one contains a memory — a piece of cosmic truth."

> "Gathering them is the only way to restore the Order of Destiny."

**Theano:**
> "But you cannot do it alone. The path is too dangerous."

> "There are those who would stop you. Forces that want chaos to reign."

---

**Theano:**
> "Let me come with you."

> "I can heal wounds. I can read the signs the gods leave us."

> "And I know things about the old world that might help."

*[Player choice]*

**Option A: "I'd be glad for the company."**
> **Theano:** "Then it's settled. We leave at dawn."
> *[She smiles — the first genuine warmth you've seen from her]*
> "I have a feeling this is the beginning of something important."

**Option B: "Can you fight?"**
> **Theano:** "I trained with the temple guards at the sanctuary of Demeter."
> "I won't be cutting down monsters with a sword, but I can hold my own."
> "And more importantly, I can keep you alive when the monsters fight back."

**Option C: "I need to think about it."**
> **Theano:** "Of course. This is not a decision to make lightly."
> "I'll be here when you're ready."
> *[She returns to her prayers]*

*[If player accepts or speaks to her again after declining]*

---

### Theano Joins the Party

**Theano:**
> "The Red Moon is waxing. We don't have much time."

> "Epimenides spoke of a place — a hidden spring north of the village."

> "He called it the Well of Mnemosyne. A sacred site of the old Orphic mysteries."

**Theano:**
> "If the Shards are tied to Mnemosyne's power, that well may be the key."

> "We should go there first. See what secrets it holds."

> ***Theano has joined the party!***

**Party Member: Theano**
- Class: Priestess of Demeter
- Role: Healer / Support
- Starting Skills: Basic Attack, Defend, Heal
- Stats: High Magic, High MP, Lower HP and Attack

---

### Theano's Equipment

**Theano:**
> "Before we go — take this."

> "It's not much, but it might help."

> ***Received: Demeter's Balm x2***
> *Restores 50 HP when used. Theano's personal supply.*

---

## Scene 1.7: Night in the Village

**Type**: Story / Setup for Chapter 2  
**Location**: Helikon — Evening  
**Audio**: Night ambience, distant wolves, ominous undertone

---

### Evening Preparations

*[Time skip — evening falls]*

> You spend the rest of the day preparing.

> Your mother packs food and supplies, saying little.

> Epimenides provides what knowledge he can — old maps, half-remembered legends.

> And Theano prays at the shrine, communing with forces you cannot see.

---

### Dialogue: Mother's Second Farewell

*[ALKMAEON's MOTHER approaches as he prepares to sleep]*

**Alkmaeon's Mother:**
> "So you're really going. And taking the oracle girl with you."

> "I suppose I should be grateful you're not going alone."

*[She hands him a wrapped bundle]*

**Alkmaeon's Mother:**
> "Food for the journey. And your father's old traveling cloak."

> "It's seen better days, but it's warm."

> ***Received: Father's Cloak***
> *A worn but sturdy traveling cloak.*
> *Effect: +3 Defense*

**Alkmaeon's Mother:**
> "Come back to me, Alkmaeon."

> "Come back."

---

### Final Night Narration

*[Alkmaeon lies awake, looking out the window]*

> The Red Moon hangs in the sky — larger than before. Brighter.

> How much time do you have? Days? Weeks?

> Apollo's warning echoes in your mind.

> *If the Order is not restored before the moon reaches its zenith...*

> You close your eyes and try to sleep.

> Tomorrow, everything changes.

*[Fade to black]*

---

> When dawn breaks, you and Theano set out.

> Northward. Toward the mountains.

> Toward the Well of Mnemosyne.

> Toward destiny.

*[Story flag set: `chapter1_complete`]*

*[End of Chapter 1]*

---

## Story Flags Set

| Flag | Description |
|------|-------------|
| `chapter1_started` | Alkmaeon has left the village |
| `first_combat_complete` | Tutorial combat finished |
| `apollo_vision_complete` | Received vision from Apollo |
| `memory_flash_learned` | Memory Flash skill acquired |
| `lyra_joined` | Theano has joined the party |
| `chapter1_complete` | Chapter 1 finished, ready for Chapter 2 |

## Skills Learned

| Skill | Character | Source |
|-------|-----------|--------|
| Memory Flash | Alkmaeon | Apollo's gift at the altar |

## Items Received

| Item | Effect | Source |
|------|--------|--------|
| Father's Compass | Key item — reveals hidden paths | Mother |
| Healing Herb x3 | Restores 30 HP | Epimenides |
| Ancient Coin x2 | Currency | Temple exploration |
| Shadow Essence | Crafting material | Corrupted Shade |
| Faded Scroll | Lore item | Priest's quarters |
| Demeter's Balm x2 | Restores 50 HP | Theano |
| Father's Cloak | +3 Defense | Mother |

## Party Status

| Character | Level | Role |
|-----------|-------|------|
| Alkmaeon | 1-2 | Memory Seeker (Balanced) |
| Theano | 1 | Priestess of Demeter (Healer) |

## Enemies Encountered

| Enemy | HP | XP | Notes |
|-------|-----|-----|-------|
| Temple Spirit | 35 | 12 | Basic enemy, tutorial fight |
| Memory Wisp | 20 | 8 | Low HP, skill tutorial |
| Corrupted Shade | 28 | 15 | Mini-boss, guards inner temple |

## Transitions

**Previous**: Prologue — The Chorus of Ruin  
**Next**: Chapter 2 — The Call of Memory (Well of Mnemosyne, Hécate's guidance)
