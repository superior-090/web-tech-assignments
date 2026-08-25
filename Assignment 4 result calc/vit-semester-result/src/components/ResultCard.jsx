function ResultCard({ student, subjects, totalMarks, percentage, cgpa, result }) {
  const getGrade = (marks) => {
    if (marks >= 90) return "O";
    if (marks >= 80) return "A+";
    if (marks >= 70) return "A";
    if (marks >= 60) return "B+";
    if (marks >= 50) return "B";
    if (marks >= 40) return "C";
    return "F";
  };

  return (
    <div className="result-card">
      <div className="result-header">
        <h2>Semester Result</h2>
        <span className={result === "PASS" ? "pass" : "fail"}>
          {result}
        </span>
      </div>

      <div className="student-summary">
        <p>
          <strong>Name:</strong> {student.name}
        </p>
        <p>
          <strong>PRN:</strong> {student.prn}
        </p>
        <p>
          <strong>Branch:</strong> {student.branch}
        </p>
        <p>
          <strong>Division:</strong> {student.division}
        </p>
      </div>

      <div className="result-table-container">
        <table className="result-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>MSE / 30</th>
              <th>ESE / 70</th>
              <th>Total / 100</th>
              <th>Grade</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((subject, index) => {
              const mse = Number(subject.mse) || 0;
              const ese = Number(subject.ese) || 0;
              const total = mse*0.3 + ese*0.7;

              return (
                <tr key={index}>
                  <td>{subject.name}</td>
                  <td>{(mse * 0.3).toFixed(2)}</td>
                  <td>{(ese * 0.7).toFixed(2)}</td>
                  <td>{total.toFixed(2)}</td>
                  <td>{getGrade(total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="result-summary">
        <div>
          <span>Total Marks</span>
          <strong>{totalMarks} / 400</strong>
        </div>

        <div>
          <span>Percentage</span>
          <strong>{percentage.toFixed(2)}%</strong>
        </div>

        <div>
          <span>CGPA</span>
          <strong>{cgpa.toFixed(2)} / 10</strong>
        </div>

        <div>
          <span>Result</span>
          <strong className={result === "PASS" ? "pass" : "fail"}>
            {result}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;
