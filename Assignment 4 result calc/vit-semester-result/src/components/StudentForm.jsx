function StudentForm({ student, setStudent }) {
  const handleChange = (e) => {
    const { name, value } = e.target;

    const cleanedValue = name === "name"
      ? value.replace(/[^A-Za-z ]/g, "")
      : name === "prn"
        ? value.replace(/\D/g, "")
        : value;

    setStudent({
      ...student,
      [name]: cleanedValue,
    });
  };

  return (
    <div className="card">
      <h2>Student Details</h2>

      <div className="form-grid">
        <div className="form-group">
          <label>Student Name</label>
          <input
            type="text"
            name="name"
            value={student.name}
            onChange={handleChange}
            placeholder="Enter student name"
            pattern="[A-Za-z ]+"
            title="Use letters only"
          />
        </div>

        <div className="form-group">
          <label>PRN</label>
          <input
            type="text"
            name="prn"
            value={student.prn}
            onChange={handleChange}
            placeholder="Enter PRN"
            inputMode="numeric"
            pattern="[0-9]+"
            title="Use numbers only"
          />
        </div>

        <div className="form-group">
          <label>Branch</label>
          <select
            name="branch"
            value={student.branch}
            onChange={handleChange}
          >
            <option value="">Select Branch</option>
            <option value="Computer Engineering">Computer Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Telecommunication">
              Electronics & Telecommunication
            </option>
            <option value="Mechanical Engineering">
              Mechanical Engineering
            </option>
            <option value="Civil Engineering">Civil Engineering</option>
          </select>
        </div>

        <div className="form-group">
          <label>Division</label>
          <select
            name="division"
            value={student.division}
            onChange={handleChange}
          >
            <option value="">Select Division</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="H">H</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default StudentForm;
