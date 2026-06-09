# GitHub Models Catalog — Comprehensive Report
*Source: `https://models.github.ai/catalog/models` · 44 models across 8 publishers*

---

## Overview

| Publisher | Model Count | Specializations |
|---|---|---|
| OpenAI | 17 | General purpose, reasoning, embeddings |
| Meta | 7 | Conversation, multimodal, long context |
| Microsoft | 6 | Reasoning, multimodal, edge/on-device |
| Mistral AI | 4 | Coding, vision, low-latency |
| Cohere | 3 | RAG, multilingual |
| DeepSeek | 3 | Reasoning, coding |
| xAI | 2 | Reasoning, summarization |
| AI21 Labs | 1 | RAG, long context |

---

## OpenAI — 17 Models

### GPT-4.1 Family
| Model | ID | Rate Tier | Max Input | Max Output | Capabilities |
|---|---|---|---|---|---|
| GPT-4.1 | `openai/gpt-4.1` | High | 1,048,576 | 32,768 | agents, agentsV2, tool-calling, streaming |
| GPT-4.1-mini | `openai/gpt-4.1-mini` | Low | 1,048,576 | 32,768 | agents, agentsV2, tool-calling, streaming |
| GPT-4.1-nano | `openai/gpt-4.1-nano` | Low | 1,048,576 | 32,768 | agents, agentsV2, tool-calling, streaming |

### GPT-4o Family
| Model | ID | Rate Tier | Max Input | Max Output | Capabilities |
|---|---|---|---|---|---|
| GPT-4o | `openai/gpt-4o` | High | 131,072 | 16,384 | agents, agentsV2, assistants, tool-calling, streaming |
| GPT-4o mini | `openai/gpt-4o-mini` | Low | 131,072 | 4,096 | agents, agentsV2, assistants, tool-calling, streaming |

### GPT-5 Family
| Model | ID | Rate Tier | Max Input | Max Output | Capabilities |
|---|---|---|---|---|---|
| GPT-5 | `openai/gpt-5` | Custom | 200,000 | 100,000 | agents, agentsV2, reasoning, tool-calling, streaming |
| GPT-5-chat (preview) | `openai/gpt-5-chat` | Custom | 200,000 | 100,000 | agents, agentsV2, reasoning, tool-calling, streaming |
| GPT-5-mini | `openai/gpt-5-mini` | Custom | 200,000 | 100,000 | agents, agentsV2, reasoning, tool-calling, streaming |
| GPT-5-nano | `openai/gpt-5-nano` | Custom | 200,000 | 100,000 | agents, agentsV2, reasoning, tool-calling, streaming |

### o-Series (Reasoning)
| Model | ID | Rate Tier | Max Input | Max Output | Capabilities |
|---|---|---|---|---|---|
| o1 | `openai/o1` | Custom | 200,000 | 100,000 | agents, agentsV2, reasoning, tool-calling |
| o1-mini | `openai/o1-mini` | Custom | 128,000 | 65,536 | agentsV2, reasoning, streaming |
| o1-preview | `openai/o1-preview` | Custom | 128,000 | 32,768 | agentsV2, reasoning |
| o3 | `openai/o3` | Custom | 200,000 | 100,000 | agents, agentsV2, reasoning, tool-calling, streaming |
| o3-mini | `openai/o3-mini` | Custom | 200,000 | 100,000 | agents, agentsV2, reasoning, tool-calling, streaming |
| o4-mini | `openai/o4-mini` | Custom | 200,000 | 100,000 | agents, agentsV2, reasoning, tool-calling, streaming |

### Embeddings
| Model | ID | Rate Tier | Max Input | Output |
|---|---|---|---|---|
| text-embedding-3-large | `openai/text-embedding-3-large` | Embeddings | 8,191 | Embeddings vector |
| text-embedding-3-small | `openai/text-embedding-3-small` | Embeddings | 8,191 | Embeddings vector |

**Modalities:** All GPT-4.x and GPT-5 models accept text + image input. GPT-4o/mini additionally accepts audio.

---

## Meta — 7 Models

| Model | ID | Rate Tier | Max Input | Max Output | Modalities | Capabilities |
|---|---|---|---|---|---|---|
| Llama 4 Scout 17B 16E | `meta/llama-4-scout-17b-16e-instruct` | High | **10,000,000** | 4,096 | text, image | agents, assistants, tool-calling, streaming |
| Llama 4 Maverick 17B 128E FP8 | `meta/llama-4-maverick-17b-128e-instruct-fp8` | High | 1,000,000 | 4,096 | text, image | agents, agentsV2, assistants, tool-calling, streaming |
| Llama-3.2-90B-Vision | `meta/llama-3.2-90b-vision-instruct` | High | 128,000 | 4,096 | text, image, audio | streaming |
| Llama-3.2-11B-Vision | `meta/llama-3.2-11b-vision-instruct` | Low | 128,000 | 4,096 | text, image, audio | streaming |
| Llama-3.3-70B-Instruct | `meta/llama-3.3-70b-instruct` | High | 128,000 | 4,096 | text | agentsV2, streaming |
| Llama-3.1-405B-Instruct | `meta/meta-llama-3.1-405b-instruct` | High | 131,072 | 4,096 | text | agents |
| Llama-3.1-8B-Instruct | `meta/meta-llama-3.1-8b-instruct` | Low | 131,072 | 4,096 | text | streaming |

**Highlight:** Llama 4 Scout holds the largest context window in the entire catalog at **10 million tokens**.

---

## Microsoft — 6 Models

| Model | ID | Rate Tier | Max Input | Max Output | Modalities | Capabilities |
|---|---|---|---|---|---|---|
| MAI-DS-R1 | `microsoft/mai-ds-r1` | Custom | 128,000 | 4,096 | text | agentsV2, reasoning, streaming |
| Phi-4 | `microsoft/phi-4` | Low | 16,384 | 16,384 | text | — |
| Phi-4-mini-instruct | `microsoft/phi-4-mini-instruct` | Low | 128,000 | 4,096 | text | — |
| Phi-4-mini-reasoning | `microsoft/phi-4-mini-reasoning` | Low | 128,000 | 4,096 | text | reasoning |
| Phi-4-multimodal-instruct | `microsoft/phi-4-multimodal-instruct` | Low | 128,000 | 4,096 | text, image, audio | streaming |
| Phi-4-reasoning | `microsoft/phi-4-reasoning` | Low | 32,768 | 4,096 | text | reasoning, streaming |

**Highlight:** MAI-DS-R1 is a Microsoft post-trained variant of DeepSeek-R1 with improved safety. Phi-4-multimodal is the only Microsoft model accepting all three input modalities (text, image, audio).

---

## Mistral AI — 4 Models

| Model | ID | Rate Tier | Max Input | Max Output | Modalities | Capabilities |
|---|---|---|---|---|---|---|
| Codestral 25.01 | `mistral-ai/codestral-2501` | Low | 256,000 | 4,096 | text | streaming |
| Mistral Medium 3 (25.05) | `mistral-ai/mistral-medium-2505` | Low | 128,000 | 4,096 | text, image | tool-calling, streaming |
| Mistral Small 3.1 | `mistral-ai/mistral-small-2503` | Low | 128,000 | 4,096 | text, image | agents, assistants, tool-calling, streaming |
| Ministral 3B | `mistral-ai/ministral-3b` | Low | 131,072 | 4,096 | text | tool-calling, streaming |

**Highlight:** Codestral 25.01 supports **80+ programming languages** and has the largest context window among Mistral models (256K).

---

## Cohere — 3 Models

| Model | ID | Rate Tier | Max Input | Max Output | Capabilities |
|---|---|---|---|---|---|
| Command A | `cohere/cohere-command-a` | Low | 131,072 | 4,096 | — |
| Command R+ 08-2024 | `cohere/cohere-command-r-plus-08-2024` | High | 131,072 | 4,096 | tool-calling, streaming |
| Command R 08-2024 | `cohere/cohere-command-r-08-2024` | Low | 131,072 | 4,096 | streaming |

All Cohere models are optimized for **RAG** and **multilingual** workloads. Command R+ is the most capable, with tool-calling support and a high rate limit tier.

---

## DeepSeek — 3 Models

| Model | ID | Rate Tier | Max Input | Max Output | Capabilities |
|---|---|---|---|---|---|
| DeepSeek-R1 | `deepseek/deepseek-r1` | Custom | 128,000 | 4,096 | reasoning, tool-calling, streaming |
| DeepSeek-R1-0528 | `deepseek/deepseek-r1-0528` | Custom | 128,000 | 4,096 | agentsV2, reasoning, tool-calling, streaming |
| DeepSeek-V3-0324 | `deepseek/deepseek-v3-0324` | High | 128,000 | 4,096 | agentsV2, tool-calling, streaming |

**Highlight:** R1-0528 improves on R1 with reduced hallucination, better function calling, and enhanced vibe coding support. V3-0324 is a non-reasoning model focused on code generation and agents, available at the higher-throughput `high` tier.

---

## xAI — 2 Models

| Model | ID | Rate Tier | Max Input | Max Output | Capabilities |
|---|---|---|---|---|---|
| Grok 3 | `xai/grok-3` | Custom | 131,072 | 4,096 | agentsV2 |
| Grok 3 Mini | `xai/grok-3-mini` | Custom | 131,072 | 4,096 | agentsV2 |

Grok 3 targets specialized domains (finance, healthcare, law). Grok 3 Mini applies chain-of-thought reasoning, making it suitable for logic and math tasks at lower cost.

---

## AI21 Labs — 1 Model

| Model | ID | Rate Tier | Max Input | Max Output | Capabilities |
|---|---|---|---|---|---|
| Jamba 1.5 Large | `ai21-labs/ai21-jamba-1.5-large` | High | 262,144 | 4,096 | tool-calling, streaming |

A 398B parameter (94B active) Mixture-of-Experts model with a **256K context window**, grounded generation, and structured output support. Best suited for long-document RAG and multilingual workloads.

---

## Capability Cross-Reference

| Capability | Publishers |
|---|---|
| Reasoning | OpenAI (o-series, GPT-5), DeepSeek (R1), Microsoft (MAI-DS-R1, Phi-4-*-reasoning), xAI (Grok 3 Mini) |
| Tool-calling | OpenAI, Meta (Llama 4), Mistral AI, Cohere (R+), DeepSeek, AI21 Labs |
| Streaming | All publishers (universal except some older o1/o3 variants) |
| Multimodal input | OpenAI (GPT-4.x, GPT-5), Meta (Llama 3.2, Llama 4), Microsoft (Phi-4-multimodal), Mistral AI (Medium, Small 3.1) |
| Audio input | OpenAI (GPT-4o family), Meta (Llama 3.2 Vision), Microsoft (Phi-4-multimodal) |
| Embeddings | OpenAI only |
| RAG-optimized | Cohere (all), AI21 Labs (Jamba) |
| Agents / AgentsV2 | OpenAI (all), Meta (Llama 4 Maverick, Llama-3.3-70B), Mistral AI (Small 3.1), DeepSeek (R1-0528, V3-0324), xAI (all), Microsoft (MAI-DS-R1) |

---

## Rate Limit Tiers

| Tier | Description | Publishers |
|---|---|---|
| **Low** | Lower throughput, free/light use | Meta (8B, 11B), Microsoft (Phi-4), Mistral AI, Cohere (R, Command A) |
| **High** | Higher throughput, production use | OpenAI (GPT-4.1, GPT-4o), Meta (Llama 4, 3.3, 3.2-90B, 3.1-405B), Cohere (R+), DeepSeek (V3), AI21 Labs |
| **Custom** | Quota-gated, requires request | OpenAI (o-series, GPT-5), DeepSeek (R1), Microsoft (MAI-DS-R1), xAI |
| **Embeddings** | Dedicated embedding quota | OpenAI (text-embedding-3-*) |
