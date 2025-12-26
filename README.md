# Cognitive Architecture Playground

![Status](https://img.shields.io/badge/Status-Prototype-orange)
![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Tests](https://img.shields.io/badge/Tests-87%20Passing-green)

A modular, Python-based framework for exploring symbolic cognitive architectures. This project implements four core cognitive capabilities—Working Memory, Metacognition, Causal Reasoning, and Analogical Reasoning—grounded in established cognitive science theories.

**Purpose:** This is a "playground" for researchers and developers to experiment with how different cognitive modules interact, bridging the gap between theoretical cognitive science and runnable code.

---

## 🧠 Core Capabilities

The architecture is built on four independent but integratable modules:

1.  **Working Memory (ACT-R Inspired)**
    * **Theory:** Based on Anderson's ACT-R architecture.
    * **Features:** Chunk-based storage, activation dynamics, time-based decay, and spreading activation logic.
    * **Goal:** Simulates human-like short-term memory constraints and retrieval patterns.

2.  **Causal Reasoning (Pearl's Framework)**
    * **Theory:** Based on Judea Pearl's Causal Inference (Do-Calculus).
    * **Features:** Directed Acyclic Graphs (DAGs), d-separation algorithms, intervention analysis (`do(x)`), and counterfactual reasoning.
    * **Goal:** Allows the agent to predict the effects of actions and distinguish correlation from causation.

3.  **Analogical Reasoning (Structure-Mapping)**
    * **Theory:** Based on Gentner's Structure-Mapping Theory.
    * **Features:** Relational structure representation, greedy structure mapping, and cross-domain knowledge transfer.
    * **Goal:** Enables the agent to solve novel problems by finding structural parallels in known domains (e.g., *Solar System :: Atom*).

4.  **Metacognition**
    * **Theory:** Metacognitive monitoring and control.
    * **Features:** Confidence tracking, calibration, logical fallacy detection (e.g., anchoring bias), and reasoning reflection.
    * **Goal:** A "self-monitoring" layer that tracks the quality of the agent's own thoughts.

---

## 📂 Project Structure

```text
cognitive_arch/
├── core/                  # Base types (Belief, Thought, Goal, ReasoningTrace)
├── modules/
│   ├── working_memory/    # Chunks, AttentionManager, Activation Logic
│   ├── metacognition/     # ConfidenceTracker, Monitor, ReflectionEngine
│   ├── causal/            # CausalGraph, Inference, Interventions
│   └── analogical/        # StructureMapper, AnalogRetriever
└── examples/              # Runnable demos
    ├── demo_integrated.py # FULL SYSTEM DEMO
    ├── demo_causal_reasoning.py
    ├── demo_analogical_reasoning.py
    └── demo_working_memory.py
```

---

## 🚀 Quick Start

### 1. Installation

No heavy dependencies (like Torch/TensorFlow) required. This is a pure Python symbolic framework.

```bash
# Clone the repository
git clone [https://github.com/yourusername/conductor-playground.git](https://github.com/yourusername/conductor-playground.git)
cd conductor-playground

# Install dependencies
pip install -r requirements.txt
```

### 2. Running the Integrated Demo

The best way to see the system in action is the integrated demo, which combines all modules to solve a complex reasoning task (Medical Diagnosis).

```bash
python -m cognitive_arch.examples.demo_integrated
```

### 3. Basic Usage Example

How to use the **Working Memory** module manually:

```python
from cognitive_arch.core.architecture import CognitiveArchitecture

# Initialize the agent
agent = CognitiveArchitecture()

# 1. Perception: Feed it information
agent.remember("The sky is blue")
agent.remember("It is raining")

# 2. Retrieval: Ask it to recall based on a keyword
# (Returns 'chunks' ordered by activation levels)
memories = agent.recall("sky")

for m in memories:
    print(f"Memory: {m.content} (Activation: {m.activation:.2f})")
```

---

## 🧪 Testing

The project includes a comprehensive test suite with 87 unit tests covering algorithmic correctness (e.g., d-separation in causal graphs) and system integration.

To run the tests:

```bash
python -m unittest discover tests
```

---

## ⚠️ Limitations

* **Symbolic Only:** This project does not use Large Language Models (LLMs). It relies on structured, symbolic logic.
* **Greedy Algorithms:** The Analogical Reasoning module uses a greedy matching algorithm for performance, which may miss optimal mappings in highly complex structures.
* **No Learning:** The agent does not currently "learn" (update weights/policies) from its reflection episodes.

---

## 📄 License

This project is open-source.
