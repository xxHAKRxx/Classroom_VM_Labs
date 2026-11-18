// One question inside a task's form. The `kind` from the API decides which input to draw:
//   "text"      one-line text box
//   "textarea"  multi-line text box
//   "radio"     multiple choice, one radio button per option
export default function Question({ question }) {
  // Every input is named after the question's database id: q1, q2, ...
  // TaskList's handleSubmit reads the answers by these names.
  const name = `q${question.id}`;

  // The label is the same for every kind, so build it once.
  // It may contain HTML such as <code>, written by the instructor in the Django admin.
  const label = (
    <label
      className="form-label small fw-semibold"
      htmlFor={name} // JSX spells the HTML "for" attribute as htmlFor
      dangerouslySetInnerHTML={{ __html: question.label }}
    />
  );

  if (question.kind === 'textarea') {
    return (
      <div className="mb-3">
        {label}
        <textarea className="form-control form-control-sm" rows={3} id={name} name={name} />
      </div>
    );
  }

  if (question.kind === 'radio') {
    return (
      <div className="mb-3">
        {label}
        {/* All radio buttons share the same `name`, so only one can be picked.
            Each needs its own `id` so clicking its label selects it. */}
        {question.options.map((option, i) => (
          <div className="form-check" key={option}>
            <input className="form-check-input" type="radio" name={name} id={`${name}-${i}`} value={option} />
            <label className="form-check-label small" htmlFor={`${name}-${i}`}>
              {option}
            </label>
          </div>
        ))}
      </div>
    );
  }

  // "text" (and any kind we don't recognize): a one-line answer
  return (
    <div className="mb-3">
      {label}
      <input type="text" className="form-control form-control-sm" id={name} name={name} />
    </div>
  );
}