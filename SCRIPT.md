# The bili-core Quest - Speaker Script

Hello future presenter (probably me)! This is the full walk-through script for the workshop, written to be read warmly and out loud. It is paced for about two hours with one short break. You do not have to say any of this word for word. Think of it as a friendly companion you can lean on when you lose your place.

**How to run the deck:** open `index.html` in any browser, press `F` for fullscreen, and use the arrow keys or the space bar to move forward. Many slides reveal their bullet points one at a time, so a press might unveil the next line rather than jump to the next slide (that is on purpose, it keeps the room with you). Press `?` any time to see the controls.

**The three interactive "skill check" slides** (Arcana, History, Insight) each have a golden button. Do not click it right away! Ask the room to call out or vote first, let a little suspense build, then roll. That is where the energy lives.

**Timing map (roughly):**
- Act 0, Gathering the Party: 10 minutes
- Act I, The Map: 14 minutes
- Act II, The Three Realms: 34 minutes
- *(short break, 8 minutes)*
- Act III, Provisions: 15 minutes
- Act IV, The Kingdom of the Hub: 25 minutes
- Act V, Your Own Quest: 15 minutes

A gentle note on the audience: these are computer science students, most with solid fundamentals and some with data structures under their belt. So words like "state machine," "dictionary," and "inheritance" are safe friends. But most of them have never seen a production codebase with CI, code review, and deployments, and many have never touched an LLM framework. So whenever a new idea shows up (a factory function, a checkpointer, a graph node), pause and name it plainly. We are here to welcome them in, not to impress them.

---

## Act 0 - Gathering the Party

### Slide 1 - Title

Greetings, travelers, and welcome! Today the party sets out on a quest together, and I mean that pretty literally. We are going to journey into a real open source library called bili-core, the one that quietly powers our Sustainability Hub, and by the end you will walk out with a scroll (a little guide) that lets you fork it and forge a chatbot that is entirely your own.

A quick promise before we shoulder our packs: you do not have to code along today. You can just travel with me, watch the map unfurl, and take the building part home whenever you are ready. So settle in by the fire, get comfortable, and let yourself enjoy the tale of how this whole thing actually works.

*(If the room is shy, this is a lovely moment for a little "roll call." Have everyone give their name and one video game or book they adventure in. It sets the playful tone and tells you who is in your party.)*

### Slide 2 - The campaign map

Gather round and behold our path. Five acts lie ahead. We will start by unrolling the map of the whole library, then venture through its three realms, gather our provisions, tour the kingdom that is built on top of it (that is our Hub), and finally send each of you off on a quest of your own. That last reward, the take home scroll, means nobody has to stop and mend a broken laptop today. We keep the party moving, and you build at your own pace once you are home.

### Slide 3 - What is bili-core?

Every quest has the one who hands it to you, and here is ours. So what actually is bili-core? It is an open source shared library for building AI agents, which is a fancy way of saying chatbots that can reason, wield tools, and remember what you said earlier. The wonderful part, and the reason it is such a great thing to learn on, is that it was forged right here at MSU Denver. You can open any file and read exactly how it works. Nothing is hidden behind a company wall.

It leans on two well known tools from the wider world, LangChain and LangGraph, which we will meet properly in a bit. And inside it live three big **subsystems**, each one its own self-contained Python package. Those three subsystems are what we will affectionately call our three realms. So any time I say "realm" today, just hear "subsystem," a major chunk of the library.

### Slide 4 - Why a *shared* library?

Here is a question worth asking: why bother making it a shared library at all? Because the same pieces (loading a model, remembering a conversation, checking who a user is) are needed by every AI app you could imagine. Instead of every team writing those from scratch, we write them once, carefully, and everyone reuses them.

Our Sustainability Hub is one such application, one "kingdom," built on this library. Your future chatbot will be another. (So whenever I say "kingdom" today, just hear "an application that depends on the library.") And here is the responsibility that comes with the power: if we fix a bug down in the library, every application that uses it gets the fix for free. That is the whole promise of shared code, and a real idea you will meet again, the dependency: one piece of software relying on another.

---

## Act I - The Map

### Slide 5 - The lay of the land

Let's unroll the map across the table. This is the folder structure inside `bili/`. Notice the three realms marked right at the top: iris, aether, and aegis. Those do the actual AI work. Everything below them is the party's support and supplies: auth for figuring out who you are, utils for common helpers, prompts for reusable prompt templates, and a couple of ready made interfaces.

I want you to remember one little thing from this slide. See how I mentioned the State living in utils? Every conversation carries a shared bundle of data called the State, and it lives right there. We will come back to it, and it will tie the whole day together.

### Slide 6 - Your provisions (dependencies)

No party sets out with an empty pack, and for a software library the provisions are its dependencies, the other packages it relies on. The big two are LangChain and LangGraph, the backbone for stitching LLM steps together. Then there are provider SDKs, little adapters for parleying with OpenAI, Google, Amazon, and others. And there are database drivers, for when we want to remember our travels.

One friendly heads up. The library also ships some very heavy machine learning packages, torch and tensorflow. Those are only needed if you run a model locally on your own machine. If you use a hosted provider like OpenAI, which is what I will show you, they just ride along in your backpack and you never draw them.

### Slide 7 - LangGraph, in one breath

Before we cross into the realms, let's dispel the mystery around LangGraph, because the name sounds far scarier than the idea. If you have ever drawn a flowchart, or met a state machine in a class, you already know this spell.

There are just three words. A node is one step that does a single job. An edge is an arrow from one step to the next. And the State, our friend from earlier, is the pack of data that gets carried along and updated at each step. That is genuinely all of it. bili-core's whole job is to build and run these little graphs for you, so you can think about your chatbot instead of the plumbing.

---

## Act II - The Three Realms

### Slide 8 - Meet the three realms

Now we reach the heart of the library, its three subsystems, which we are calling realms. IRIS is one adventurer, honed to a fine edge: a single chatbot with a model, tools, and memory. AETHER is a whole party working together, a team of agents described in a configuration file. And AEGIS is the loyal adversary, a security-testing subsystem that lays siege to a party of agents on purpose, just to see what breaks.

Here is the reassuring part. Our Hub, the real app we will tour later, lives entirely in the first realm, IRIS. The other two are the exciting frontier, and they are wonderful research territory, but you do not need them to build something real. So if AETHER and AEGIS feel big today, that is fine, just enjoy the view.

### Slide 9 - IRIS, the single agent

IRIS stands for Interactive Reasoning and Integration Services, but you can just think of it as "the single chatbot realm." The recipe is simple: give it a model to think with, some tools to act with, and a memory to remember with, and it will run a whole conversation for you.

A couple of nice details. It supports more than sixty models across six providers, and you pick one just by passing a string. And it remembers conversations automatically, so a user can come back tomorrow and pick up where they left off. This is the realm your take home quest lives in, so it is the one to pay closest attention to.

### Slide 10 - Four steps to a living chatbot

And here is the whole thing, in four steps. Step one, choose a brain by loading a model. Step two, hand it some tools, or none at all if you just want it to chat. Step three, assemble the graph, and memory is handled for you. Step four, speak to it.

I want you to notice how little code this is. Four function calls and you have a working, remembering chatbot. Everything else in the library is decoration on top of this skeleton. When you go home and open the scroll, this is exactly what you will be typing.

### Slide 11 - What happens inside `invoke`

So what actually happens when you call invoke? Your message takes a little walk down a line of nodes, and each one does one small job. It adds the bot's persona and a summary of the chat so far. It notes the current date and time. Then the star of the show, react_agent, does the real thinking and any tool use. Then some bookkeeping, some memory management so the conversation does not overflow, and a final tidy up.

Please tuck this whole pipeline away in your memory, the entire lineup from start to end, not any single node. In Act Four, when we tour the Hub, you are going to watch it splice two of its own custom steps right into this exact pipeline. That moment is the payoff of the whole day.

### Slide 12 - The State, the party's shared pack

Remember the State I keep promising you? Here it is. It is the shared pack the whole party carries. Inside it are the messages, a running summary, who owns the chat, the title, the tags, timestamps, and more.

And here is the elegant part, the part I love. The nodes never hand arguments to each other directly. Each node just updates the shared State, and the next node reads it. Even better, a node only returns the fields it changed, not the whole bag. If you have met the idea of updating a dictionary with just the new keys, this will feel very familiar. It keeps every step small and honest.

### Slide 13 - Try IRIS with no code: the Streamlit app

Before we test our skills, let me show you the friendliest door into IRIS. bili-core ships a ready-made Streamlit app, and Streamlit is simply a tool for turning Python into a little web page. This app puts an IRIS agent behind a clean chat interface, so you can play with everything we just learned without writing a single line of code.

Here is the part I love. From a menu, you can pick and configure any of the sixty-plus models, and you can even swap the model right in the middle of a conversation. So you can ask a question, switch from one LLM to another, and watch how differently they answer the very same thing. It is a wonderful way to feel how a model's behavior adapts.

And a little piece of our own history goes here. This Streamlit app is actually the very first thing the team built, back when we were trying to decide which LLM was best suited for the Sustainability Hub. So this humble testing app is where our whole project began.

### Slide 14 - Skill Check: Arcana (name that realm)

Our first skill check, and this one tests your Arcana, the art of reading imports, which is a genuine superpower in a big codebase. Here is a line torn from a spellbook, an import statement, with the realm blanked out. Your job is to divine which realm it was summoned from: iris, aether, or aegis?

The clue is in what the function does. It says build_agent_graph, singular, one agent's graph.

*(Let them vote, then click "Roll for Arcana.")*

It is iris! Because it builds a single agent's pipeline. And here is a lovely bit of foreshadowing: this is the very import our Hub uses to build its chatbot. You just read production code and understood it. That is the skill.

### Slide 15 - AETHER, a party of agents

We cross now into the second realm, AETHER. Where IRIS is one adventurer, AETHER musters a whole party. Now, the important thing to know is that AETHER does not come with a fixed cast. You decide who is in your party and what each member does. To make it concrete, picture just one example, a moderation guild: a Judge, a Content Reviewer, a Policy Expert, each one its own agent with its own personality, all questing together. But that is only one shape. A research team, a customer support team, a code review team would each have completely different roles. AETHER is deliberately domain-agnostic, which is a fancy way of saying the roles are free-form and entirely up to you.

The really clever part is how you describe that team. You do not write graph code. You write a YAML file, a plain text recipe, listing your agents and how they talk. AETHER then compiles that recipe into a runnable workflow. It is declarative, meaning you describe what you want and the framework figures out the wiring.

### Slide 16 - From recipe to running team

AETHER's whole life is five steps: Define, Configure, Validate, Compile, Execute. In code it is a clean straight line, three function calls, and you have a running team of agents.

I want to point out the kind touch in the middle, Validate. Before anything runs, AETHER performs thirteen safety checks on your recipe. Did you leave an agent stranded with no connections? Is there a dead end with no way to finish? A real error stops the build right there, and warnings just gently advise. This means your team fails early, at build time, instead of halfway through a real conversation. That is a thoughtful piece of engineering worth admiring.

### Slide 17 - Choose your party's formation

How do the agents relate to each other? That is one field in the recipe, workflow_type, and it is like choosing a formation. Sequential is a relay line, one after another. Supervisor is a boss who routes work to specialists. Consensus is a group of peers who vote until they agree. There are a few more: hierarchical tiers, everyone in parallel, or fully custom arrows you draw yourself.

And here is my favorite connection of the day. A single AETHER agent that also has tools is built the exact same way as an IRIS agent. AETHER literally stands on IRIS's shoulders. So the foundation you are learning is the foundation for everything above it too.

### Slide 18 - A real recipe: content moderation

Let's make it concrete with a real file that ships in the repo. This is a moderation team in the supervisor formation. A flagged post arrives at the Judge, who then calls specialists as needed, a Content Reviewer, a Policy Expert, an Appeals Specialist, and pulls their opinions together into a final verdict.

This is not a toy. This exact file, supervisor_moderation.yaml, is in the codebase right now, and it is the very system one of our students is exploring as a possible future upgrade for the Hub's own moderation. So the frontier we are looking at is genuinely close to home.

### Slide 19 - AEGIS, the loyal adversary

The third realm, AEGIS, is the one I find the most thrilling of all. If AETHER musters the party, AEGIS is the loyal adversary who ambushes it on purpose and measures what breaks. It is a security testing tool.

It does things like inject sneaky instructions into an agent (that is called prompt injection), or plant false memories, or impersonate one agent to fool another. Then it tracks how that attack spreads from one agent to the next. This was built by our own Cybersecurity Research group here at MSU Denver, so when I say this is real security research, I mean students exactly like you built it.

### Slide 20 - Three tiers of "did it work?"

The clever core of AEGIS is how it decides whether an attack actually worked, and it uses three tiers. Tier one, structural: did the attack even run without crashing the framework? That is free and always on. Tier two, heuristic: does the output look influenced, judged by fast text checks? That is a quick and useful proxy. Tier three, semantic: an independent, separate LLM acts as a judge and confirms whether the agent was truly compromised. That is the real verdict.

And here is a genuine research gem. The gap between tier two saying "this looks bad" and tier three saying "this actually is bad" is itself a finding worth studying. Knowing the limits of your fast, cheap detector is real science.

### Slide 21 - One stack, three floors

Let's zoom out and put the realms together, because their relationship is beautifully simple. It is one stack with three floors. On the bottom, IRIS runs a single agent well. AETHER stands on IRIS to orchestrate a team of them. And AEGIS stands on AETHER to attack and measure that team.

So here is the encouraging bottom line: learn IRIS, the ground floor, and you have learned the foundation the other two are built on. You are not behind. You are exactly where you should be.

> **Make camp!** This is the natural halfway point of our journey. Rest for eight minutes, stretch your legs, refill your waterskin (or your coffee), and return for the part where we tour a real kingdom raised on everything we just learned.

---

## Act III - Provisions

### Slide 22 - Skill Check: History (recall after the break)

Welcome back, travelers! Before we gather our provisions, a quick History check, which in our world means recalling something you already learned. Right before the break, we walked the IRIS node pipeline together. Here is the question: of all those steps, which single node is the one that actually calls the model to reason and use tools?

*(Let them call it out. Then click "Roll for History.")*

It is react_agent! That is the star of the whole pipeline, the only node that talks to the LLM and decides when to reach for a tool. Every other node just preps the input or tidies up the output. Hold that thought close, because in Act Four you are going to watch the Hub splice its own two nodes in right around react_agent.


### Slide 23 - What does it take to run?

Welcome back, travelers, rested and ready! Before we tour the Hub, let's answer the practical question hiding in every pack: what does it actually take to run this thing? Happily, far less than you fear.

One provider key is enough. A single OPENAI_API_KEY and you are moving. You do not need a database at all, because if you have not configured one, the memory quietly falls back to storing conversations in memory for the session. You only add a real database like Postgres later, when you want conversations to survive a restart. So the barrier to your first run is genuinely tiny.

### Slide 24 - Two ways to carry the library

There are two ways to bring the library into your project. The first is to just use it: you pip install it straight from our GitHub, pinned to a specific version so it never changes underneath you. Your app simply depends on it.

The second is for when you want to hack on the library itself. That is called editable mode, and it means your edits to bili-core are live immediately in your app, with no reinstall. This is exactly how our Hub team develops both the app and the library at the same time. You will not need this on day one, but it is lovely to know it exists.

---

## Act IV - The Kingdom of the Hub

### Slide 25 - A real kingdom on the library

At last we reach the great kingdom, the moment our whole journey has been climbing toward. The Sustainability Hub Engine is a full, real, deployed application raised on top of bili-core, and I want to show you exactly how it turns this library into a living, running product.

It does two things, and the difference between them is the whole lesson. It uses bili-core's pieces, and it extends them with its own, and it does all of that without ever forking or copying the library. Let's see how.

### Slide 26 - Skill Check: Insight (which realms?)

Third and final skill check, a test of Insight! The Hub is a chatbot app. Of our three realms, IRIS, AETHER, and AEGIS, which ones do you think it actually imports and calls upon? Take a real guess. Many an adventurer assumes a serious kingdom must wield every enchanted blade in the armory.

*(Let them vote, then click "Roll for Insight.")*

Only IRIS! The Hub touches iris, plus auth and utils for support, and zero lines of aether or aegis. This is such an important lesson. A single, well built agent is all a production chatbot needs. The frontier realms are there for when research calls for them, but you do not have to use everything a library offers. Restraint is a design skill.

### Slide 27 - The golden rule: extend, don't modify

So how does the Hub add its own features without touching the library? With one golden rule: the library owns the data, and the app owns the behavior.

Here is the concrete example. The title and tags fields, the little labels on each conversation, live on bili-core's shared State, because any app might want a title. But how the Hub decides on a title, the actual logic, is the Hub's own business, so that lives in the Hub. Generic data down in the library, specific behavior up in the app. If you remember one design idea from today, make it this one, because it explains the entire structure.

### Slide 28 - The Hub adds two nodes of its own

In practice, the Hub adds two custom nodes. One called compute_title, which names the chat from your first message. And one called update_tags, which pulls out topic tags every few messages.

And watch how gently it does this. It copies bili-core's default pipeline and splices its two nodes in. It never mutates the shared original, so no other kingdom is affected. And look at the code on the right: a custom node is literally just bili-core's own Node class with the Hub's function tucked inside. If you have seen a factory function, a function that builds and returns another thing, that is exactly this. The Hub is not reinventing anything; it is filling in a blank the library left for it.

### Slide 29 - The Hub's assembled pipeline

And here is the payoff I promised you back in Act Two. This is the Hub's actual running pipeline. It is the same IRIS backbone you already learned, with the two Hub nodes, marked with stars, woven right in. compute_title slots in just before the agent thinks, and update_tags just after.

At the bottom you can see how it is done in one line: it merges the library's nodes and the Hub's nodes into one registry. Library nodes and Hub nodes, side by side, in one pipeline. You now fully understand a piece of real, deployed production code. That is a big deal, and you should feel good about it.

### Slide 30 - The Hub brings its own tools (RAG)

We just watched the Hub add its own nodes. Here is the second way it extends the library: it also brings its own tools. Remember, in IRIS a tool is simply something the agent can reach for, like a weather lookup. The Hub's headline tool is called knowledge_search, and it is a real piece of something you have very likely heard of, RAG.

RAG stands for Retrieval-Augmented Generation, and the plain-language version is wonderfully simple. Before the agent answers, it looks things up in a collection of documents, instead of guessing from memory alone. The Hub turns your question into a vector, searches its document store for the closest matches, and hands those documents to the agent, so the answer is grounded in real sources rather than made up.

And here is the lovely connection back to everything we learned. IRIS gives you the single agent, and the library even ships the hooks for this, an embeddings loader and retriever tools. Add a retriever tool, point it at your documents, and you have built RAG. The library provides the machinery, the Hub supplies the documents. That is the extend-don't-modify rule, one more time.

### Slide 31 - Three gates into the kingdom

A quick tour of how people actually reach the Hub. There are three gates. Streamlit, a quick user interface that mostly reuses bili-core's prebuilt pages. Flask, a REST API that handles auth and data. And WebSocket, the real time chat, which is where the full agent gets built.

On the right is a WebSocket message's whole journey: check that your login is valid and that the conversation is actually yours, build the agent graph with that spliced pipeline, run it, let the checkpointer save everything automatically, and stream the reply back with its fresh title and tags. Every concept on that list is one we met today. It all connects.

### Slide 32 - One security idea worth stealing

Before we send you off, one security idea so clean I want you to steal it. Every conversation's key is your email, then an underscore, then the conversation id. And before the Hub ever loads a thread, it checks that the key starts with your email.

That means you simply cannot open someone else's conversation by guessing an id, because it would not start with your email. One humble little check, enforced right at the door, quietly prevents a whole category of attacks. Good security is often not clever or flashy. It is just careful, in the right spot.

---

## Act V - Your Own Quest

### Slide 33 - Choose your path

Here is your reward for braving the whole journey: a take home scroll, a markdown file called FORK-YOUR-OWN-CHATBOT, and it branches at a fork in the road, because every good quest does.

The Path of the Scribe is the gentle one: build a plain chatbot with a personality you invent. Start here, truly, no shame in the easy road. The Path of the Artificer is a step bolder: hand your bot an actual tool, like weather or search, so it can act upon the world and not just speak. Both paths set out from that same four line skeleton you already met, so you are not starting from an empty map. You are starting from ground you already know.

### Slide 34 - Your first spell, in full

And here it is, your first complete spell. It is the four line skeleton, just fleshed out a little: load a model, take no tools for now, build the agent with a persona (I made mine a wise tavern keeper, you should make yours something delightful), and then speak to it.

The scroll walks you through every single line, and it honestly warns you about the one little snag you might hit, so you will not get stuck alone. One API key, a few minutes, and you will be talking to something you built. I cannot wait to see what personalities you all come up with.

### Slide 35 - Experience earned

And so our quest comes to its end! Look at all the experience your party earned today. You can read the bili-core map. You have walked the three realms. You watched IRIS become a chatbot before your eyes. You understand how the Hub extends the library without ever breaking it. You carry a scroll to forge your own. And you know now, deep in your bones, to trust the code.

Thank you all so much for adventuring with me today. Truly, from the bottom of my heart. Go forth and fork it, seek me out the moment a question strikes, and remember that the whole party, every one of us, stands right here to help. Now let's go build something wonderful, travelers!
