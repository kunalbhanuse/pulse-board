import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CreatePoll.css";
import Navbar from "../components/Navbar";

const createQuestion = () => ({
  question: "",
  options: [{ text: "" }, { text: "" }],
  isRequired: true,
});

function CreatePoll() {
  const navigate = useNavigate();
  const API_URL = "https://pulse-board-9f1s.onrender.com";

  const [form, setForm] = useState({
    title: "",
    description: "",
    requiresAuth: false,
    expiresAt: 7,
    questions: [createQuestion()],
  });
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateQuestion = (questionIndex, field, value) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex ? { ...question, [field]: value } : question,
      ),
    }));
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) => {
        if (index !== questionIndex) return question;

        return {
          ...question,
          options: question.options.map((option, optionPosition) =>
            optionPosition === optionIndex ? { text: value } : option,
          ),
        };
      }),
    }));
  };

  const addQuestion = () => {
    setForm((prev) => ({
      ...prev,
      questions: [...prev.questions, createQuestion()],
    }));
  };

  const removeQuestion = (questionIndex) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex),
    }));
  };

  const addOption = (questionIndex) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) =>
        index === questionIndex
          ? { ...question, options: [...question.options, { text: "" }] }
          : question,
      ),
    }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    setForm((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) => {
        if (index !== questionIndex || question.options.length <= 2)
          return question;
        return {
          ...question,
          options: question.options.filter(
            (_, position) => position !== optionIndex,
          ),
        };
      }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setIsSubmitting(true);

    const days = parseInt(form.expiresAt, 10);

    const expiryDate =
      Number.isFinite(days) && days > 0
        ? new Date(Date.now() + days * 24 * 60 * 60 * 1000)
        : null;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      navigate("/login");
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      expiresAt: expiryDate,
      questions: form.questions.map((question) => ({
        question: question.question.trim(),
        options: question.options
          .map((option) => ({ text: option.text.trim() }))
          .filter((option) => option.text),
        isRequired: question.isRequired,
      })),
    };

    try {
      await axios.post(`${API_URL}/api/poll/create-poll`, payload, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });
      navigate("/dashboard");
    } catch (error) {
      setStatus({
        type: "error",
        text:
          error.response?.data?.error ||
          "Unable to create this poll. Please review the fields and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="poll-page">
      <Navbar />
      <form className="poll-form" onSubmit={handleSubmit}>
        <div className="poll-header">
          <div>
            <p className="poll-eyebrow">New poll</p>
            <h1>Create a polished voting experience.</h1>
            <p>
              Add a clear title, concise description, and focused questions your
              audience can answer quickly.
            </p>
          </div>

          <button
            className="button button-secondary"
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Back
          </button>
        </div>

        <section className="poll-card">
          <label>
            Poll title
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Product roadmap priorities"
              minLength={5}
              maxLength={50}
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Help us decide what to improve next."
              rows="4"
              minLength={15}
              maxLength={200}
              required
            />
          </label>

          <div className="poll-row">
            <label>
              Duration in days
              <input
                type="number"
                name="expiresAt"
                value={form.expiresAt}
                onChange={handleChange}
                min="1"
                max="30"
                required
              />
            </label>

            <label className="toggle-label">
              <input
                type="checkbox"
                name="requiresAuth"
                checked={form.requiresAuth}
                onChange={handleChange}
              />
              <span>
                <strong>Require authentication</strong>
                <small>Ask voters to sign in before responding.</small>
              </span>
            </label>
          </div>
        </section>

        <section className="questions-area">
          <div className="questions-title">
            <div>
              <p className="poll-eyebrow">Questions</p>
              <h2>Build your response form</h2>
            </div>
            <button
              className="button button-secondary"
              type="button"
              onClick={addQuestion}
            >
              Add question
            </button>
          </div>

          {form.questions.map((question, questionIndex) => (
            <article
              className="question-card"
              key={`question-${questionIndex}`}
            >
              <div className="question-top">
                <h3>Question {questionIndex + 1}</h3>
                {form.questions.length > 1 && (
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <label>
                Question text
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) =>
                    updateQuestion(questionIndex, "question", e.target.value)
                  }
                  placeholder="Which feature should we prioritize?"
                  required
                />
              </label>

              <div className="options-block">
                <span>Answer options</span>
                {question.options.map((option, optionIndex) => (
                  <div
                    className="option-row"
                    key={`option-${questionIndex}-${optionIndex}`}
                  >
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        updateOption(questionIndex, optionIndex, e.target.value)
                      }
                      placeholder={`Option ${optionIndex + 1}`}
                      required
                    />
                    <button
                      className="button button-secondary"
                      type="button"
                      disabled={question.options.length <= 2}
                      onClick={() => removeOption(questionIndex, optionIndex)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => addOption(questionIndex)}
                >
                  Add option
                </button>
              </div>

              <label className="checkbox-label required-check">
                <input
                  type="checkbox"
                  checked={question.isRequired}
                  onChange={(e) =>
                    updateQuestion(
                      questionIndex,
                      "isRequired",
                      e.target.checked,
                    )
                  }
                />
                Required question
              </label>
            </article>
          ))}
        </section>

        {status.text && (
          <p className={`status-message ${status.type}`}>{status.text}</p>
        )}

        <button
          className="button button-primary submit-btn"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating poll..." : "Create poll"}
        </button>
      </form>
    </main>
  );
}

export default CreatePoll;
