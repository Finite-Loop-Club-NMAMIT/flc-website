import React, { useState } from "react";
import { api } from "~/utils/api";

// Define TypeScript types for props
type SubmitFeedbackProps = {
  feedbackTemplateId: string; // Assuming this is passed as a prop
};

const SubmitFeedback: React.FC<SubmitFeedbackProps> = () => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [answers, setAnswers] = useState<{ questionId: string; ans: string }[]>(
    [],
  );
  const submitFeedback = api.feedbackTemplate.submitUserFeedback.useMutation();

  // Fetch all published feedback templates with questions
  const { data: feedbackTemplates, isLoading: templatesLoading } =
    api.feedbackTemplate.getAllPublishedFeedbackTemplatesWithQuestions.useQuery();

  // Handle template selection
  const handleTemplateChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setSelectedTemplateId(event.target.value);
    const selectedTemplate = feedbackTemplates?.find(
      (template) => template.id === event.target.value,
    );
    setAnswers(
      selectedTemplate?.Questions.map((q) => ({ questionId: q.id, ans: "" })) ??
        [],
    );
  };
  // Handle answer change
  const handleAnswerChange = (index: number, value: string) => {
    // Ensure newAnswers has at least `index + 1` elements
    const newAnswers = [...answers];

    if (!newAnswers[index]) {
      // Initialize the object if it doesn't exist
      newAnswers[index] = { questionId: "", ans: "" };
    }

    // Update the answer object with the new value
    newAnswers[index].ans = value.trim();

    // Ensure questionId is always a string
    newAnswers[index].questionId = newAnswers[index].questionId ?? "";

    // Update the state with the newAnswers array
    setAnswers(newAnswers);
  };

  // Handle feedback submission
  const handleSubmit = async () => {
    try {
      await submitFeedback.mutateAsync({
        feedbackTemplateId: selectedTemplateId,
        answers,
      });
      console.log("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  if (templatesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Submit Feedback</h1>

      {/* Dropdown to select a feedback template */}
      <div>
        <label>Select Feedback Template:</label>
        <select value={selectedTemplateId} onChange={handleTemplateChange}>
          <option value="">Select a template</option>
          {feedbackTemplates?.map((template) => (
            <option key={template.id} value={template.id}>
              Template for Event: {template.eventId}
            </option>
          ))}
        </select>
      </div>

      {/* Display questions for the selected template */}
      {selectedTemplateId && (
        <div>
          {answers.map((answer, index) => (
            <div key={answer.questionId}>
              <p>
                {
                  feedbackTemplates
                    ?.find((template) => template.id === selectedTemplateId)
                    ?.Questions.find((q) => q.id === answer.questionId)?.qs
                }
              </p>
              <input
                type="text"
                value={answer.ans}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Submit button */}
      {selectedTemplateId && (
        <button onClick={handleSubmit}>Submit Feedback</button>
      )}
    </div>
  );
};

export default SubmitFeedback;
