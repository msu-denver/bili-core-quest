# 📜 The Scroll of Your Own Chatbot

*A solo quest, to be undertaken whenever you feel ready. No party required.*

Greetings, traveler! You made it through the workshop, and this is your reward: a step by step scroll for forking bili-core and forging a chatbot that is entirely your own. Take it slowly, there is no rush, and remember that everyone in the party is happy to help if you get stuck.

By the end of this quest you will have a real, running chatbot with a personality you invented, built on the very same library that powers the Sustainability Hub.

---

## 🎒 Before you set out (prerequisites)

You will need three things:

1. **Python 3.11 or newer.** Check with `python --version`. bili-core needs at least 3.11.
2. **Your own API key for an LLM provider.** This is your chatbot's "brain," and you need to set one up yourself. We use **OpenAI** here because it is the simplest to start with (make a key on the OpenAI platform, or ask a team lead). It is a string that starts with `sk-`. Want a different provider? See the note in Step 3.
3. **A terminal and a code editor** you are comfortable in (VS Code is a fine choice).

> 🧭 **A kind note on cost.** The `gpt-4o-mini` model we use here is very inexpensive, but it is not free. A few dozen test messages costs pennies, not dollars. Still, treat your key like a house key and never commit it to git.

---

## 🗺️ Step 1 - Fork and claim the library

Forking makes your very own copy of bili-core on GitHub, so you can explore and tinker freely.

1. Go to the bili-core repository on GitHub: `https://github.com/msu-denver/bili-core`
2. Click **Fork** (top right). Now `your-username/bili-core` is yours.
3. Clone it to your machine:

```bash
git clone https://github.com/YOUR-USERNAME/bili-core.git
cd bili-core
```

---

## ⚗️ Step 2 - Brew a potion of dependencies (virtual environment)

A **virtual environment** is a private sandbox for this project's packages, so they never tangle with anything else on your machine. Create one and install bili-core into it:

```bash
python -m venv .venv
source .venv/bin/activate        # on Windows: .venv\Scripts\activate
pip install .
```

That last line reads bili-core's recipe and installs everything it needs. It may take a few minutes and print a lot of text (it is pulling in LangChain, LangGraph, and friends). That is normal. Go stretch.

> 🐉 **Beware the heavy armor.** bili-core also installs some large machine learning packages (torch, tensorflow). You do **not** need them for a hosted model like OpenAI, but they still download. If the install feels slow, that is why. Patience, hero.

---

## 🔑 Step 3 - Whisper your secret key

bili-core reads your API key from an **environment variable**, a value that lives in your shell rather than in your code (so you never accidentally share it).

```bash
export OPENAI_API_KEY="sk-your-key-here"     # on Windows: set OPENAI_API_KEY=sk-...
```

That is the only secret you need for this quest. No database, no other keys. If you skip this, the very first step of your code will politely complain that it cannot find a brain.

> 🗝️ **Choosing a different LLM?** bili-core speaks to six providers and 60+ models, so you are not locked into OpenAI. If you would rather use Google Vertex, Azure, AWS Bedrock, or another, you will set up *that* provider's own API key or login (on their side), configure those credentials here instead of `OPENAI_API_KEY`, and change `model_type` and `model_name` in Step 4 to match. Either way, the key is yours to configure, and the rest of the code stays the same.

---

## ✨ Step 4 - Cast your first spell

Create a file called `my_chatbot.py` in the root of your cloned bili-core, and write this:

```python
from bili.iris.loaders.llm_loader import load_model
from bili.iris.loaders.tools_loader import initialize_tools
from bili.iris.loaders.langchain_loader import build_agent_graph
from bili.iris.loaders.streaming_utils import invoke_agent

# 1. Choose a brain. This reads OPENAI_API_KEY from your environment.
model = load_model(model_type="remote_openai", model_name="gpt-4o-mini")

# 2. Take no tools for now. Just a talker, not yet a doer.
tools = initialize_tools(active_tools=[], tool_prompts={})

# 3. Assemble the agent. Give it a persona of your very own!
agent = build_agent_graph(
    node_kwargs={
        "llm_model": model,
        "tools": tools,
        "persona": "You are a wise and slightly dramatic tavern keeper.",
        "summarize_llm_model": model,   # see the snag note below, keep this line!
    },
)

# 4. Speak to it. thread_id names this conversation so it can be remembered.
reply = invoke_agent(agent, "Greetings! What's on the menu tonight?", thread_id="hero1")
print(reply)
```

Then run it:

```bash
python my_chatbot.py
```

If all goes well, a dramatic tavern keeper answers you. **You just built a chatbot.** 🎉

> ⚠️ **The one snag to watch for.** bili-core's default pipeline includes a memory-management step (`trim_summarize`) that needs its own model to write summaries. That is why we pass `summarize_llm_model` above. If you ever see an error mentioning *summarize* or a missing model, it is almost always because that line went missing. Keep it and you will be fine.

---

## 🍴 The fork in the road: choose your path

Your chatbot works! Now the quest branches. Take whichever road calls to you.

### 📝 Path of the Scribe (start here)

Make the bot truly yours by shaping its **persona** and holding a real conversation.

- Change the `persona` string to anything: a grumpy wizard, a cheerful robot, a Socratic tutor who only answers in questions. Re-run and see how differently it speaks.
- Ask several questions in a row, reusing the **same** `thread_id`, and notice it remembers earlier turns. That memory is the checkpointer working automatically.
- Try a **streaming** reply, where words appear one at a time like a real chat:

```python
from bili.iris.loaders.streaming_utils import stream_agent

for token in stream_agent(agent, "Tell me a short tale of a brave slime.", thread_id="hero1"):
    print(token, end="", flush=True)
```

### 🔧 Path of the Artificer (a bolder road)

Give your bot a **tool** so it can act, not just talk. bili-core keeps its tools in a registry, and you switch one on by adding its name to `active_tools`.

- Open `bili/iris/config/tool_config.py` and read the `TOOLS` dictionary. Each entry is a tool the library knows how to build, along with what it expects.
- The gentlest one to experiment with is `mock_tool`, a pretend tool that needs no extra keys, perfect for seeing how tool-calling works:

```python
tools = initialize_tools(active_tools=["mock_tool"], tool_prompts={})
```

- Rebuild your agent with those tools and ask it something that would make it reach for the tool. Watch the `react_agent` node decide to use it.
- Real tools like weather or web search live in that same registry, but they need their own API keys. Once you are comfortable with `mock_tool`, graduating to a real one is just a matter of adding a key and its name to the list.

> 🧠 **Why this works.** Remember from the workshop: `react_agent` is the node that does the thinking and decides when to call a tool. You are not writing that logic yourself. You are just handing the agent a bigger toolbox and letting it choose.

---

## 🛡️ Troubleshooting (common goblins)

| The goblin | What it means | How to defeat it |
|---|---|---|
| `ValueError: unknown model type` | Typo in `model_type` | It must be exactly `"remote_openai"` |
| Complaint about a missing key / auth | `OPENAI_API_KEY` not set in this shell | Re-run the `export` from Step 3 |
| An error mentioning *summarize* | Dropped the `summarize_llm_model` line | Add it back to `node_kwargs` |
| `ModuleNotFoundError: bili` | venv not active, or install skipped | `source .venv/bin/activate`, then `pip install .` |
| `No module named 'bili.loaders'` (or `nodes`, `config`...) | An old tutorial used the pre-v5 import paths | The real modules live under `bili.iris.*`, e.g. `bili.iris.loaders` |

---

## 🌟 Where to venture next

- **Read a real node.** Open `bili/iris/nodes/react_agent_node.py`. You have earned the right to understand it now.
- **See how the Hub extends this.** In the Sustainability Hub Engine, look at `engine/nodes/compute_title.py` and `engine/graph_config.py` to see a real app splice its own nodes into this very pipeline.
- **Peek at the frontier.** When you are curious, `bili/aether/config/examples/` is full of multi-agent recipes you can read like short stories. `simple_chain.yaml` is the friendliest starting point.

---

You did it, traveler. You forked a real open-source library and built something that runs. Come show us what personality you gave your bot, we genuinely cannot wait to meet it. 🐉📜

*Go forth and build something wonderful.*
