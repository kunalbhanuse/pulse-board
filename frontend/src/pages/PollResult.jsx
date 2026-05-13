import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./PollResult.css";
import { socket } from "../socket";

const API_URL = "http://localhost:3000";

const getQuestionTotal = (question) =>
  question.options.reduce((sum, option) => sum + Number(option.count || 0), 0);

const getLeader = (question) =>
  question.options.reduce(
    (best, option) => {
      const count = Number(option.count || 0);

      return count > best.count
        ? {
            option: option.option,
            count,
          }
        : best;
    },
    {
      option: "No votes yet",
      count: 0,
    },
  );

const formatPercent = (value) => `${value.toFixed(value >= 10 ? 0 : 1)}%`;

function PollResult() {
  const { shareId } = useParams();

  const [results, setResults] = useState([]);
  const [status, setStatus] = useState({
    type: "",
    text: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  // fetch results
  const fetchResults = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/poll/shareId/${shareId}/result`,
      );

      setResults(response.data.data || []);

      setStatus({
        type: "",
        text: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        text: error.response?.data?.error || "Unable to load poll results.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // initial fetch
  useEffect(() => {
    fetchResults();
  }, [shareId]);

  // socket listener
  useEffect(() => {
    socket.on("poll-updated", () => {
      console.log("Poll updated in realtime");

      fetchResults();
    });

    return () => {
      socket.off("poll-updated");
    };
  }, []);

  const summary = useMemo(() => {
    const questionCount = results.length;

    const totalVotes = results.reduce(
      (sum, question) => sum + getQuestionTotal(question),
      0,
    );

    const allOptions = results.flatMap((question) =>
      question.options.map((option) => ({
        question: question.question,
        option: option.option,
        count: Number(option.count || 0),
      })),
    );

    const topOption = allOptions.reduce(
      (best, option) => (option.count > best.count ? option : best),
      {
        question: "",
        option: "No votes yet",
        count: 0,
      },
    );

    return {
      questionCount,
      totalVotes,
      topOption,
      averageVotes: questionCount ? totalVotes / questionCount : 0,
    };
  }, [results]);

  return (
    <main className="result-page">
      <Navbar />

      <section className="result-shell">
        <div className="result-header">
          <div>
            <p className="result-eyebrow">Poll analysis</p>

            <h1>Result breakdown</h1>

            <p>
              Review response counts, percentages, and the leading option for
              every question in this poll.
            </p>
          </div>

          <div className="result-actions">
            <Link className="button button-secondary" to="/dashboard">
              Dashboard
            </Link>

            <Link className="button button-primary" to={`/poll/${shareId}`}>
              Open poll
            </Link>
          </div>
        </div>

        {isLoading && (
          <section className="result-card result-empty">
            <p className="result-eyebrow">Loading</p>

            <h2>Fetching analysis...</h2>
          </section>
        )}

        {!isLoading && status.type === "error" && (
          <section className="result-card result-empty">
            <p className="result-eyebrow">Unavailable</p>

            <h2>Results not found</h2>

            <p className="status-message error">{status.text}</p>
          </section>
        )}

        {!isLoading && !status.type && (
          <>
            <section className="result-stats" aria-label="Result summary">
              <article>
                <span>Questions</span>

                <strong>{summary.questionCount}</strong>
              </article>

              <article>
                <span>Total votes</span>

                <strong>{summary.totalVotes}</strong>
              </article>

              <article>
                <span>Top option</span>

                <strong>{summary.topOption.option}</strong>

                <small>
                  {summary.topOption.count
                    ? `${summary.topOption.count} votes`
                    : "No selections yet"}
                </small>
              </article>

              <article>
                <span>Average votes</span>

                <strong>{summary.averageVotes.toFixed(1)}</strong>
              </article>
            </section>

            {results.length === 0 ? (
              <section className="result-card result-empty">
                <h2>No result data yet</h2>

                <p>Votes will appear here after people submit this poll.</p>
              </section>
            ) : (
              <section className="result-layout">
                <div className="result-list">
                  {results.map((question, questionIndex) => {
                    const total = getQuestionTotal(question);

                    return (
                      <article className="result-card" key={question.question}>
                        <div className="result-question-head">
                          <div>
                            <span>Question {questionIndex + 1}</span>

                            <h2>{question.question}</h2>
                          </div>

                          <strong>{total} votes</strong>
                        </div>

                        <div className="result-options">
                          {question.options.map((option) => {
                            const count = Number(option.count || 0);

                            const percent = total ? (count / total) * 100 : 0;

                            return (
                              <div
                                className="result-option"
                                key={option.option}
                              >
                                <div className="result-option-label">
                                  <span>{option.option}</span>

                                  <strong>
                                    {count} ({formatPercent(percent)})
                                  </strong>
                                </div>

                                <div
                                  className="result-bar-track"
                                  aria-label={`${option.option}: ${formatPercent(
                                    percent,
                                  )}`}
                                >
                                  <div
                                    className="result-bar"
                                    style={{
                                      width: `${percent}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </article>
                    );
                  })}
                </div>

                <aside className="result-card result-leaders">
                  <h2>Question leaders</h2>

                  <div className="leader-stack">
                    {results.map((question) => {
                      const total = getQuestionTotal(question);

                      const leader = getLeader(question);

                      const percent = total ? (leader.count / total) * 100 : 0;

                      return (
                        <div className="leader-row" key={question.question}>
                          <span>{question.question}</span>

                          <strong>{leader.option}</strong>

                          <small>{formatPercent(percent)}</small>
                        </div>
                      );
                    })}
                  </div>
                </aside>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default PollResult;
