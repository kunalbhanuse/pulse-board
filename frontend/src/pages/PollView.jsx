import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./PollView.css";

function PollView() {
  const { shareId } = useParams();
  const API_URL = "http://localhost:3000";
  const [pollData, setPollData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/poll/shareId/${shareId}`);
        setPollData(response.data.data);
      } catch (error) {
        setStatus({
          type: "error",
          text: error.response?.data?.error || "This poll could not be loaded.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [shareId]);

  const answeredCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    const questions = pollData?.questions || [];
    const missingRequired = questions.some(
      (question) => question.isRequired !== false && !answers[question._id],
    );

    if (missingRequired) {
      setStatus({
        type: "error",
        text: "Please answer every required question before submitting.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API_URL}/api/poll/shareId/${shareId}/vote`, {
        answers: Object.entries(answers).map(([questionId, optionId]) => ({
          questionId,
          optionId,
        })),
      });
      setIsSubmitted(true);
    } catch (error) {
      setStatus({
        type: "error",
        text: error.response?.data?.error || "Unable to submit your vote.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const poll = pollData?.poll;
  const questions = pollData?.questions || [];

  return (
    <main className="vote-page">
      <Navbar />
      <section className="vote-shell">
        {isLoading && (
          <div className="vote-card">
            <p className="vote-eyebrow">Loading</p>
            <h1>Opening poll...</h1>
          </div>
        )}

        {!isLoading && status.type === "error" && !poll && (
          <div className="vote-card">
            <p className="vote-eyebrow">Unavailable</p>
            <h1>Poll not found</h1>
            <p className="status-message error">{status.text}</p>
            <Link to="/" className="button button-primary">
              Back home
            </Link>
          </div>
        )}

        {!isLoading && poll && isSubmitted && (
          <div className="vote-card vote-success">
            <p className="vote-eyebrow">Submitted</p>
            <h1>Thanks for sharing your response.</h1>
            <p>
              Your vote has been recorded. You can close this page or return to
              PulseBoard.
            </p>
            <Link to="/" className="button button-primary">
              Back home
            </Link>
          </div>
        )}

        {!isLoading && poll && !isSubmitted && (
          <form className="vote-card" onSubmit={handleSubmit}>
            <div className="vote-header">
              <p className="vote-eyebrow">PulseBoard poll</p>
              <h1>{poll.title}</h1>
              <p>{poll.description}</p>
              <div className="vote-progress">
                <span>
                  {answeredCount} of {questions.length} answered
                </span>
                <span>{poll.requiresAuth ? "Login requested" : "Public poll"}</span>
              </div>
            </div>

            <div className="vote-questions">
              {questions.map((question, questionIndex) => (
                <fieldset className="vote-question" key={question._id}>
                  <legend>
                    <span>{questionIndex + 1}</span>
                    {question.question}
                  </legend>

                  <div className="vote-options">
                    {question.options.map((option) => (
                      <label className="vote-option" key={option._id}>
                        <input
                          type="radio"
                          name={question._id}
                          value={option._id}
                          checked={answers[question._id] === option._id}
                          onChange={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [question._id]: option._id,
                            }))
                          }
                          required={question.isRequired !== false}
                        />
                        <span>{option.text}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>

            {status.text && (
              <p className={`status-message ${status.type}`}>{status.text}</p>
            )}

            <button
              className="button button-primary vote-submit"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit vote"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}

export default PollView;
