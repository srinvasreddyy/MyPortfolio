# Project 3: Resume_Evaluator (`srinvasreddyy/resume_evaluator`) — Exhaustive Pin-Point Technical Specification

* **Repository / Archive Commit:** `05a094f64dca9ac61c5ff4a5ee44faa7c6826adf`
* **Project Name (`pyproject.toml`):** `resume-evaluator` (`v0.1.0`)
* **Python Runtime Requirement:** `>=3.11` (`.python-version` pinned to `3.11`)
* **Package & Lockfile Manager:** `uv` (`uv.lock` + `hatchling` build backend)
* **Application Entrypoint:** `main.py` (invoked via `uv run streamlit run main.py`)
* **Core Domain:** Stateful Multi-Node AI Resume Evaluation & Automated Interview Preparation Agent built with **LangGraph**, **LangChain Google GenAI** (`gemini-2.5-flash`), **Pydantic** structured outputs, **PyPDF**, and **Streamlit**.

---

## 1. Complete Repository Directory Tree

The repository contains **7 distinct files** organized for a `uv`-managed Python project:

```text
Resume_Evaluator-05a094f64dca9ac61c5ff4a5ee44faa7c6826adf/
├── .gitignore
├── .python-version
├── README.md
├── main.py
├── pyproject.toml
├── uv.lock
└── src/
    └── resume_evaluator/
        └── __init__.py
```

---

## 2. Dependencies, Build System & Environment Configuration

### 2.1 Direct Project Dependencies (`pyproject.toml`)
* `langchain` (`>=1.2.12`) — Core LLM abstraction framework.
* `langchain-community` (`>=0.4.1`) — Community integrations and document loaders.
* `langchain-core` (`>=1.2.19`) — Prompt templates (`PromptTemplate`) and runnable interfaces.
* `langchain-google-genai` (`>=4.2.1`) — `ChatGoogleGenerativeAI` wrapper binding `gemini-2.5-flash` with `.with_structured_output()`.
* `langgraph` (`>=1.1.2`) — Stateful directed graph orchestration (`StateGraph`, `START`, `END`).
* `pydantic` (`>=2.12.5`) — Strict schema definitions (`BaseModel`, `Field`) for deterministic JSON extraction from Gemini.
* `pypdf` (`>=6.8.0`) — Pure-Python PDF parser (`PdfReader`) for extracting raw text from uploaded resumes.
* `python-dotenv` (`>=1.2.2`) — Loads environment variables from `.env` via `load_dotenv()`.
* `streamlit` (`>=1.55.0`) — Interactive web UI framework hosting the 2-column uploader and multi-tab results dashboard.

### 2.2 Package Entrypoint (`pyproject.toml` & `src/resume_evaluator/__init__.py`)
* Build system: `hatchling` (`build-backend = "hatchling.build"`).
* Script entrypoint defined in `pyproject.toml`: `resume-evaluator = "resume_evaluator:main"`.
* `src/resume_evaluator/__init__.py` defines a CLI stub:
  ```python
  def main() -> None:
      print("Hello from resume-evaluator!")
  ```

### 2.3 Environment & Version Control (`.gitignore` & `.env`)
* **Required Environment Variable:** `GOOGLE_API_KEY` (loaded automatically by `load_dotenv()` and consumed by `ChatGoogleGenerativeAI`).
* **`.gitignore` Exclusions:** `__pycache__/`, `*.py[oc]`, `build/`, `dist/`, `wheels/`, `*.egg-info`, `.venv`, and `.env` (added to prevent API key leakage).

---

## 3. Core Architecture: LangGraph State & Pydantic Schemas (`main.py`)

### 3.1 Graph State Definition (` EvaluatorState`)
The LangGraph workflow passes a single typed dictionary (`EvaluatorState(TypedDict)`) across all nodes:

```python
class EvaluatorState(TypedDict):
    resume_text: str
    job_description: str
     candidate_name: str
    ats_score: int
    skill_gaps: List[str]
    matching_skills: List[str]
    overall_feedback: str
    action_plan: List[str]
    interview_questions: List[str]
```

### 3.2 Structured Output Pydantic Models
To guarantee type-safe, hallucination-free responses from `gemini-2.5-flash`, `main.py` defines three Pydantic `BaseModel` classes passed into `llm.with_structured_output(...)`:

1. **`ResumeAnalysis(BaseModel)` — Bound to Node 1 (`analyze_resume_node`):**
   * `candidate_name` (`str`): *"The full name of the candidate extracted from the resume. If not found, output 'Candidate'."*
   * `ats_score` (`int`): *"ATS match score from 0 to 100 based on how well the resume matches the job description."*
   * `matching_skills` (`List[str]`): *"List of skills present in both the resume and the job description."*
   * `skill_gaps` (`List[str]`): *"List of required skills or qualifications from the JD that are missing in the resume."*
   * `overall_feedback` (`str`): *"A concise, 2-3 sentence executive summary of the candidate's fit for the role."*

2. **`ActionPlan(BaseModel)` — Bound to Node 2A (`generate_action_plan_node`):**
   * `steps` (`List[str]`): *"3 to 5 concrete, actionable steps the candidate can take to improve their resume and bridge the skill gaps (e.g., specific projects to build, certifications, or how to rephrase existing experience)."*

3. **`InterviewPrep(BaseModel)` — Bound to Node 2B (`generate_interview_prep_node`):**
   * `questions` (`List[str]`): *"3 to 5 tailored technical and behavioral interview questions based on the candidate's matching skills and the job description, Including a brief hint on how they should answer."*

---

## 4. LangGraph Nodes, Prompts & Conditional Routing (`main.py`)

### 4.1 LLM Initialization (`get_llm()`)
```python
def get_llm():
    return ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2)
```
* Uses a low `temperature=0.2` to prioritize analytical consistency and deterministic scoring.

### 4.2 Node 1: `analyze_resume_node(state: EvaluatorState)`
* **Structured LLM:** `structured_llm = llm.with_structured_output(ResumeAnalysis)`
* **Prompt (`PromptTemplate`):** Instructs the model to act as an expert technical recruiter and ATS system, comparing `{job_description}` and `{resume_text}` strictly to extract the candidate's name, calculate a realistic ATS score (`0`–`100`), list matching skills, identify critical skill gaps, and write an executive summary.
* **Chain Execution:** `chain = prompt | structured_llm` $\rightarrow$ `result = chain.invoke({"job_description": state["job_description"], "resume_text": state["resume_text"]})`
* **State Mutation Returned:**
  ```python
  {
      "candidate_name": result.candidate_name,
      "ats_score": result.ats_score,
      "matching_skills": result.matching_skills,
      "skill_gaps": result.skill_gaps,
      "overall_feedback": result.overall_feedback
  }
  ```

### 4.3 Conditional Edge Router: `route_based_on_score(state: EvaluatorState) -> str`
Evaluates `state.get("ats_score", 0)` immediately after `analyze_resume` completes and branches execution into one of two mutually exclusive downstream nodes:
* **Condition:** `if score < 70:` $\rightarrow$ returns `"generate_action_plan"`
* **Else (`score >= 70`):** $\rightarrow$ returns `"generate_interview_prep"`

### 4.4 Node 2A (Low/Medium Match Path, `< 70%`): `generate_action_plan_node(state: EvaluatorState)`
* **Structured LLM:** `structured_llm = llm.with_structured_output(ActionPlan)`
* **Prompt (`PromptTemplate`):** Injects `{ats_score}` and `{skill_gaps}` (`", ".join(state["skill_gaps"])`), instructing the model to act as a career coach for a candidate who scored below the threshold (`70`) and generate specific, actionable steps to bridge the gaps and rewrite their resume.
* **State Mutation Returned:** `{"action_plan": result.steps, "interview_questions": []}`

### 4.5 Node 2B (High Match Path, `>= 70%`): `generate_interview_prep_node(state: EvaluatorState)`
* **Structured LLM:** `structured_llm = llm.with_structured_output(InterviewPrep)`
* **Prompt (`PromptTemplate`):** Injects `{ats_score}`, `{matching_skills}`, and `{skill_gaps}`, instructing the model to act as a hiring manager preparing to interview a strong candidate (`>= 70`) by crafting challenging interview questions that test their matching skills and probe how they would handle the minor missing skills.
* **State Mutation Returned:** `{"interview_questions": result.questions, "action_plan": []}`

### 4.6 Graph Compilation (`build_graph()`)
Decorated with `@st.cache_resource` so the compiled state graph is instantiated only once per Streamlit server lifecycle:

```python
@st.cache_resource
def build_graph():
    workflow = StateGraph(EvaluatorState)
    
    workflow.add_node("analyze_resume", analyze_resume_node)
    workflow.add_node("generate_action_plan", generate_action_plan_node)
    workflow.add_node("generate_interview_prep", generate_interview_prep_node)
    
    workflow.add_edge(START, "analyze_resume")
    
    workflow.add_conditional_edges(
        "analyze_resume",
        route_based_on_score,
        {
            "generate_action_plan": "generate_action_plan",
            "generate_interview_prep": "generate_interview_prep"
        }
    )
    
    workflow.add_edge("generate_action_plan", END)
    workflow.add_edge("generate_interview_prep", END)
    
    return workflow.compile()
```

---

## 5. PDF Text Extraction & Streamlit UI Layer (`main.py`)

### 5.1 PDF Parsing Utility (`extract_text_from_pdf(uploaded_file) -> str`)
* Instantiates `reader = PdfReader(uploaded_file)` from `pypdf`.
* Iterates across `reader.pages`, calling `page.extract_text() or ""` and concatenating with newline separators (`"\n"`).
* Returns `text.strip()`.
* Wraps extraction in a `try...except Exception as e` block that surfaces errors directly in the UI via `st.error(f"Error reading PDF: {e}")` and returns `""`.

### 5.2 Streamlit Page Configuration & Custom CSS
* Calls `st.set_page_config(page_title="AI Resume Evaluator", page_icon="📄", layout="wide")`.
* Injects custom CSS styling `.stProgress > div > div > div > div` with `background-color: #4CAF50` for the ATS progress bar.

### 5.3 Input Layout & Validation Gate
* **2-Column Input Layout (`col1, col2 = st.columns(2)`):**
  * `col1`: `st.file_uploader("1. Upload Resume (PDF)", type=["pdf"])`
  * `col2`: `st.text_area("2. Paste the Job Description", height=200, placeholder="Paste the full job description here...")`
* **Execution Trigger (`st.button("🚀 Evaluate Resume", use_container_width=True, type="primary")`):**
  * Guard 1: Checks `if not os.environ.get("GOOGLE_API_KEY"):` $\rightarrow$ halts with `st.error("🚨 GOOGLE_API_KEY is missing! Please set it in your .env file.")`.
  * Guard 2: Checks `if not uploaded_file or not jd_input.strip():` $\rightarrow$ halts with `st.warning("⚠️ Please both upload a resume and paste a job description.")`.
  * Runs `extract_text_from_pdf(uploaded_file)` inside `st.spinner("Extracting text from PDF and running LangGraph workflow...")` and invokes `graph.invoke(initial_state)`.

### 5.4 Dynamic Multi-Tab Results Dashboard
Once `final_state` returns from `graph.invoke(initial_state)`, the UI renders:

1. **Candidate Header & Score Banner (`score_col1, score_col2 = st.columns([1, 3])`):**
   * Displays `st.subheader(f"📊 Evaluation Results for: *{final_state.get('candidate_name', 'Candidate')}*")`.
   * Renders `st.metric(label="ATS Match Score", value=f"{score}%")` and `st.progress(score / 100.0)` alongside the `overall_feedback` executive summary.
2. **3-Tab Analysis Breakdown (`tab1, tab2, tab3 = st.tabs(...)`):**
   * **Tab 1 (`"✅ Matching Skills"`):** Renders each skill in `final_state["matching_skills"]` with `st.markdown(f"- 🟢 **{skill}**")` (or warns if no matching skills were found).
   * **Tab 2 (`"⚠️ Skill Gaps"`):** Renders each missing qualification in `final_state["skill_gaps"]` with `st.markdown(f"- 🔴 **{gap}**")` (or displays `st.balloons()` + `"🎉 No major skill gaps identified!"` if empty).
   * **Tab 3 (`"🗺️ Next Steps (AI Recommendation)"`):** Dynamically switches its view based on which LangGraph branch executed:
     * If `final_state.get("action_plan")` is populated (`score < 70`), displays an `st.warning` banner (*"Your score is below 70%. The AI Agent routed you to the **Action Plan Generator**..."*) and lists numbered improvement steps.
     * If `final_state.get("interview_questions")` is populated (`score >= 70`), displays an `st.success` banner (*"Your score is 70% or above! The AI Agent routed you to the **Interview Prep Generator**..."*) and renders numbered technical/behavioral questions.