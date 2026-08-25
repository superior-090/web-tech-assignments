function SubjectForm({ subjects, setSubjects }) {
  const handleChange = (index, field, value) => {
    const updatedSubjects = [...subjects];

    updatedSubjects[index][field] = value;

    setSubjects(updatedSubjects);
  };

  return (
    <div className="card">
      <h2>Subject Marks</h2>

      <div className="subjects-container">
        {subjects.map((subject, index) => (
          <div className="subject-card" key={index}>
            <h3>{subject.name}</h3>

            <div className="marks-grid">
              <div className="form-group">
                <label>MSE Marks (Out of 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subject.mse}
                  onChange={(e) =>
                    handleChange(index, "mse", e.target.value)
                  }
                  placeholder="0 - 100"
                />
              </div>

              <div className="form-group">
                <label>ESE Marks (Out of 100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={subject.ese}
                  onChange={(e) =>
                    handleChange(index, "ese", e.target.value)
                  }
                  placeholder="0 - 100"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectForm;