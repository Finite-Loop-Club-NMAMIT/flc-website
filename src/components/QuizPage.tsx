import React from "react";
import { api } from "~/utils/api"; // Adjust the import path based on your project structure

const QuizPage = () => {
  const submitQuizMutation = api.quiz.userSubmitQuiz.useMutation();
  const {data} = api.quiz.getQuizResultsForUser.useQuery({
    quizTemplateId: "cly5hq96a0003j80z4poo7tsd",
  });
  return (
    <div>
      <h1>Quiz Page</h1>
      <button
        className="rounded-md bg-black p-2 text-white"
        onClick={async () => {
          await submitQuizMutation.mutateAsync({
            quizTemplateId: "cly5hq96a0003j80z4poo7tsd",
            answers: [
              {
                questionId: "cly5ja561000fj80zvl8532sd",
                selectedOptionId: "cly5rnyz3000jj80ztjohgueu",
              },
              {
                questionId: "cly5v8xtx000nj80z0488cdty",
                selectedOptionId: "cly5v8xtz000qj80zvrd8ov05",
              },
            ],
          });
        }}
      >
        Submit Quiz
      </button>
      <pre>certificate: {JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default QuizPage;
