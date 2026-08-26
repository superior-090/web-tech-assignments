const subjects = [
    'Web Technology',
    'Database Management',
    'Computer Networks',
    'Software Engineering'
];

const form = document.querySelector('#resultCalculator');

const round = n => Math.round(n * 100) / 100;

const grade = n =>
    n >= 90 ? 'O' :
    n >= 80 ? 'A+' :
    n >= 70 ? 'A' :
    n >= 60 ? 'B+' :
    n >= 50 ? 'B' :
    n >= 40 ? 'C' :
    'F';


// ===============================
// Generate Subject Fields
// ===============================

document.querySelector('#subjects').innerHTML = subjects
    .map(s => `
        <article class="subject" data-subject="${s}">
            <h3>${s}</h3>

            <div class="marks">

                <div class="field">
                    <label>MSE / 100</label>
                    <input
                        class="mark"
                        data-kind="mse"
                        type="number"
                        min="0"
                        max="100"
                        step=".01"
                        required
                    >
                    <small></small>
                </div>

                <div class="field">
                    <label>ESE / 100</label>
                    <input
                        class="mark"
                        data-kind="ese"
                        type="number"
                        min="0"
                        max="100"
                        step=".01"
                        required
                    >
                    <small></small>
                </div>

            </div>
        </article>
    `)
    .join('');


// ===============================
// Display Validation Error
// ===============================

function error(x, m) {

    x.classList.toggle('invalid', !!m);

    x.closest('.field').querySelector('small').textContent = m;
}


// ===============================
// Validate Student Details
// ===============================

function detail(x) {

    let v = x.value.trim();
    let m = !v ? 'This field is required.' : '';

    if (
        v &&
        x.id === 'name' &&
        !/^[A-Za-z ]+$/.test(v)
    ) {
        m = 'Use letters and spaces only.';
    }

    if (
        v &&
        x.id === 'prn' &&
        (!/^\d+$/.test(v) || Number(v) < 10000000)
    ) {
        m = 'Enter a valid numeric PRN.';
    }

    error(x, m);

    return !m;
}


// ===============================
// Validate Marks
// ===============================

function mark(x) {

    let n = Number(x.value);

    let ok =
        x.value !== '' &&
        n >= 0 &&
        n <= 100;

    error(
        x,
        ok ? '' : 'Enter 0 to 100.'
    );

    return ok;
}


// ===============================
// Generate Result Preview
// ===============================

function preview() {

    let complete = true;
    let total = 0;
    let failed = false;

    let values = [];
    let rows = '';

    document.querySelectorAll('.subject').forEach(c => {

        let a = c.querySelector('[data-kind=mse]');
        let b = c.querySelector('[data-kind=ese]');

        let m = Number(a.value) || 0;
        let e = Number(b.value) || 0;

        let ok =
            a.value !== '' &&
            b.value !== '' &&
            m >= 0 &&
            m <= 100 &&
            e >= 0 &&
            e <= 100;

        let mc = round(m * 0.3);
        let ec = round(e * 0.7);
        let t = round(mc + ec);

        let g = ok ? grade(t) : '—';

        complete &&= ok;
        failed ||= ok && g === 'F';

        total += t;

        values.push({
            m,
            e
        });

        rows += `
            <tr>
                <td>${c.dataset.subject}</td>
                <td>${mc.toFixed(2)}</td>
                <td>${ec.toFixed(2)}</td>
                <td>${t.toFixed(2)}</td>
                <td>
                    <span class="grade">${g}</span>
                </td>
            </tr>
        `;
    });

    total = round(total);

    document.querySelector('#resultRows').innerHTML = rows;

    document.querySelector('#totalMarks').innerHTML =
        `${total.toFixed(2)} <em>/ 400</em>`;

    document.querySelector('#percentage').textContent =
        `${(total / 4).toFixed(2)}%`;

    document.querySelector('#cgpa').innerHTML =
        `${round(total / 40).toFixed(2)} <em>/ 10</em>`;


    // ===============================
    // Result Status
    // ===============================

    let text = complete
        ? (failed ? 'FAIL' : 'PASS')
        : '—';

    let r = document.querySelector('#resultText');
    let s = document.querySelector('#resultStatus');

    r.textContent = text;

    r.className = complete
        ? (failed ? 'fail' : 'pass')
        : '';

    s.textContent = complete
        ? text
        : 'AWAITING MARKS';

    s.className = complete
        ? (failed ? 'fail' : 'pass')
        : '';


    // ===============================
    // Student Summary
    // ===============================

    let get = id =>
        document.querySelector('#' + id).value.trim() || '—';

    document.querySelector('#studentSummary').textContent =
        `Name: ${get('name')} · PRN: ${get('prn')} · Branch: ${get('branch')} · Division: ${get('division')}`;


    return {
        complete,
        values
    };
}


// ===============================
// Student Details Validation
// ===============================

[
    'name',
    'prn',
    'branch',
    'division'
].forEach(id => {

    let x = document.querySelector('#' + id);

    x.oninput = () => {
        detail(x);
        preview();
    };

    x.onchange = x.oninput;
});


// ===============================
// Marks Validation
// ===============================

document.addEventListener('input', e => {

    if (e.target.matches('.mark')) {

        mark(e.target);
        preview();
    }
});


// ===============================
// Submit Result
// ===============================

form.addEventListener('submit', async e => {

    e.preventDefault();

    let valid =
        [
            'name',
            'prn',
            'branch',
            'division'
        ].every(id =>
            detail(document.querySelector('#' + id))
        ) &&
        [
            ...document.querySelectorAll('.mark')
        ].every(mark);

    let data = preview();

    let status = document.querySelector('#formStatus');


    // ===============================
    // Validation Check
    // ===============================

    if (!valid || !data.complete) {

        status.textContent =
            'Please correct the highlighted fields.';

        status.className = 'error';

        return;
    }


    // ===============================
    // Prepare Data
    // ===============================

    let [w, d, c, s] = data.values;

    let p = {

        prn: +document.querySelector('#prn').value,

        name: document.querySelector('#name')
            .value
            .trim(),

        branch: document.querySelector('#branch')
            .value,

        division: document.querySelector('#division')
            .value,

        webTechnologyMseMarks: w.m,
        webTechnologyEseMarks: w.e,

        databaseManagementMseMarks: d.m,
        databaseManagementEseMarks: d.e,

        computerNetworksMseMarks: c.m,
        computerNetworksEseMarks: c.e,

        softwareEngineeringMseMarks: s.m,
        softwareEngineeringEseMarks: s.e
    };


    // ===============================
    // Send Data to Spring Boot
    // ===============================

    try {

        let response = await fetch(
            '/api/results',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(p)
            }
        );

        if (!response.ok) {
            throw Error();
        }

        status.textContent =
            'Semester result saved successfully.';

        status.className = 'success';

    } catch {

        status.textContent =
            'Could not save the result.';

        status.className = 'error';
    }
});


// ===============================
// Reset Form
// ===============================

form.addEventListener('reset', () => {

    setTimeout(preview);
});


// ===============================
// Initial Preview
// ===============================

preview();