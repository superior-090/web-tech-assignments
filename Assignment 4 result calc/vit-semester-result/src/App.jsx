import { useState } from "react";
import StudentForm from "./components/StudentForm";
import SubjectForm from "./components/SubjectForm";
import ResultCard from "./components/ResultCard";
import "./App.css";

function App() {
  const [student, setStudent] = useState({
    name: "",
    prn: "",
    branch: "",
    division: "",
  });

  const [subjects, setSubjects] = useState([
    { name: "Web Technology", mse: "", ese: "" },
    { name: "Database Management", mse: "", ese: "" },
    { name: "Computer Networks", mse: "", ese: "" },
    { name: "Software Engineering", mse: "", ese: "" },
  ]);

  const [showResult, setShowResult] = useState(false);
  const [errors, setErrors] = useState([]);

  const validateForm = () => {
    const newErrors = [];

    if (!student.name.trim()) {
      newErrors.push("Student name is required.");
    } else if (!/^[A-Za-z ]+$/.test(student.name.trim())) {
      newErrors.push("Student name can contain only letters.");
    }

    if (!student.prn.trim()) {
      newErrors.push("PRN is required.");
    } else if (!/^\d+$/.test(student.prn)) {
      newErrors.push("PRN can contain only numbers.");
    }

    if (!student.branch) {
      newErrors.push("Please select a branch.");
    }

    if (!student.division) {
      newErrors.push("Please select a division.");
    }

    subjects.forEach((subject) => {
      if (subject.mse === "") {
        newErrors.push(`${subject.name}: MSE marks are required.`);
      } else if (!/^\d+(\.\d+)?$/.test(subject.mse) || Number(subject.mse) < 0 || Number(subject.mse) > 100) {
        newErrors.push(`${subject.name}: MSE marks must be between 0 and 100.`);
      }

      if (subject.ese === "") {
        newErrors.push(`${subject.name}: ESE marks are required.`);
      } else if (!/^\d+(\.\d+)?$/.test(subject.ese) || Number(subject.ese) < 0 || Number(subject.ese) > 100) {
        newErrors.push(`${subject.name}: ESE marks must be between 0 and 100.`);
      }
    });

    setErrors(newErrors);

    return newErrors.length === 0;
  };

  const calculateResult = () => {
    if (!validateForm()) {
      setShowResult(false);
      return;
    }

    setShowResult(true);
  };

  const resetForm = () => {
    setStudent({
      name: "",
      prn: "",
      branch: "",
      division: "",
    });

    setSubjects([
      { name: "Web Technology", mse: "", ese: "" },
      { name: "Database Management", mse: "", ese: "" },
      { name: "Computer Networks", mse: "", ese: "" },
      { name: "Software Engineering", mse: "", ese: "" },
    ]);

    setErrors([]);
    setShowResult(false);
  };

  const totalMarks = subjects.reduce((total, subject) => {
    return total + Number(subject.mse || 0)*0.3 + Number(subject.ese || 0)*0.7;
  }, 0);

  const percentage = (totalMarks / 400) * 100;

  const getGrade = (marks) => {
    if (marks >= 90) return { grade: "O", point: 10 };
    if (marks >= 80) return { grade: "A+", point: 9 };
    if (marks >= 70) return { grade: "A", point: 8 };
    if (marks >= 60) return { grade: "B+", point: 7 };
    if (marks >= 50) return { grade: "B", point: 6 };
    if (marks >= 40) return { grade: "C", point: 5 };
    return { grade: "F", point: 0 };
  };

  const cgpa = subjects.reduce((total, subject) => {
    const weightedMarks = Number(subject.mse || 0) * 0.3 + Number(subject.ese || 0) * 0.7;
    return total + getGrade(weightedMarks).point;
  }, 0) / subjects.length;

  const result =
    subjects.every(
      (subject) =>
        Number(subject.mse) + Number(subject.ese) >= 40
    )
      ? "PASS"
      : "FAIL";

  return (
    <div className="app">
      <header className="header">
        <h1>VIT Semester Result Calculator</h1>
        <p>Prepare your semester result using MSE and ESE marks</p>
      </header>

      <main className="container">
        <StudentForm
          student={student}
          setStudent={setStudent}
        />

        <SubjectForm
          subjects={subjects}
          setSubjects={setSubjects}
        />

        {errors.length > 0 && (
          <div className="error-box">
            <h3>Please fix the following:</h3>

            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="button-container">
          <button
            className="calculate-btn"
            onClick={calculateResult}
          >
            Calculate Result
          </button>

          <button
            className="reset-btn"
            onClick={resetForm}
          >
            Reset
          </button>
        </div>

        {showResult && (
          <ResultCard
            student={student}
            subjects={subjects}
            totalMarks={totalMarks}
            percentage={percentage}
            cgpa={cgpa}
            result={result}
          />
        )}
      </main>

      <footer>
        <p>VIT Semester Result Calculator • React Project • Made by Suyash Moon</p>
      </footer>
    </div>
  );
}

export default App;
