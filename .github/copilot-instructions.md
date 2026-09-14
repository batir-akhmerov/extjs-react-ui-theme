---
applyTo: "**"
---

# classic-app — ExtJS 8.0 Classic Toolkit

This is an **Ext JS 8.0.0.43 Classic Toolkit** application. Modern LLMs have weak and often
outdated knowledge of this framework — do not rely on recall, and do not guess config names.

## Before writing any ExtJS code

Read `.github/skills/extjs8-classic/SKILL.md`. It contains verified patterns for this exact
version, the app's conventions, and the known silent-failure traps.

## Looking up API details — order matters

1. Copy an existing working example from `app/desktop/src/view/**`.
2. Grep the local framework source: `node_modules/@sencha/ext-classic/src/**` — this *is* the
   shipped 8.0.0.43 source. Read targeted line ranges; many files exceed 3000 lines.
3. Only then, `https://docs.sencha.com/extjs/8.0.0/classic/Ext.html`.

**Never crawl the Sencha API site.** Class pages are enormous and the tree is thousands of
pages; fetching several will exceed the context window and hard-fail the request with
`model_max_prompt_tokens_exceeded`. Fetch at most one specific class page for one specific
question, and prefer the local source.

For any lookup that might be large, delegate it to an Explore subagent and ask for a short
distilled answer so the bulk never enters the main context.
