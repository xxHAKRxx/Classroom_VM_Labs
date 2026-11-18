import { useState } from 'react';
import Question from './Question.jsx';

// Column 2: the selected lab's tasks, as an accordion (one task open at a time).
// App gives it:
//   lab     the lab from /api/labs/<id>/, or null while it's loading
//   done    which tasks are finished, e.g. { 1: true }
//   onDone  a function to call when a task's answers are submitted
export default function TaskList({ lab, done, onDone }) {
  // Which task is expanded: 0 = the first one, -1 = none.
  // (Hooks like useState must come before any early `return` below.)
  const [openIndex, setOpenIndex] = useState(0);

  // ---- Still loading ----
  if (lab === null) {
    return (
      <section className="tasks-sidebar bg-body-tertiary border-end">
        <div className="p-3 text-body-secondary small">Loading...</div>
      </section>
    );
  }

  // ---- Progress bar numbers, worked out from the props on every render ----
  const doneCount = lab.tasks.filter((task) => done[task.id]).length;
  const percent = lab.tasks.length > 0 ? (doneCount / lab.tasks.length) * 100 : 0;

  // ---- When a task's form is submitted ----
  function handleSubmit(event, task, index) {
    event.preventDefault(); // stop the browser's normal form submit, which would reload the page

    // Read every input in this form by its `name`, e.g. { q1: "/home/student", q2: "-a" }
    const answers = Object.fromEntries(new FormData(event.target));
    console.log('Answers for task', task.id, answers); // TODO: send to Django (see REACT_GUIDE.md)

    onDone(task.id);         // tell App this task is finished
    setOpenIndex(index + 1); // open the next task
  }

  return (
    <section className="tasks-sidebar bg-body-tertiary border-end">
      {/* ---- Header: lab title, description, progress bar ---- */}
      <div className="p-3 border-bottom bg-body">
        <h5 className="mb-1">{lab.title}</h5>
        <p className="text-body-secondary small mb-2">{lab.description}</p>
        <div className="d-flex align-items-center gap-2">
          {/* In JSX, `style` takes a JavaScript object, hence the double braces */}
          <div className="progress flex-grow-1" style={{ height: '6px' }}>
            <div className="progress-bar" style={{ width: `${percent}%` }}></div>
          </div>
          <small className="text-body-secondary">
            {doneCount}/{lab.tasks.length}
          </small>
        </div>
      </div>

      {/* ---- The tasks ---- */}
      <div className="tasks-body p-3">
        {/* `condition && <jsx>` only draws the JSX when the condition is true */}
        {lab.tasks.length === 0 && (
          <div className="text-body-secondary small text-center py-5">No tasks defined for this lab yet.</div>
        )}

        <div className="accordion">
          {lab.tasks.map((task, index) => {
            const isOpen = index === openIndex;
            return (
              <div className="accordion-item" key={task.id}>
                {/* Clickable task header: opens this task, or closes it if it's already open */}
                <h2 className="accordion-header">
                  <button
                    type="button"
                    className={'accordion-button py-2' + (isOpen ? '' : ' collapsed')}
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span className="task-status me-2">
                      {/* Green check if finished, empty circle if not */}
                      {done[task.id] ? (
                        <i className="bi bi-check-circle-fill text-success"></i>
                      ) : (
                        <i className="bi bi-circle text-body-tertiary"></i>
                      )}
                    </span>
                    <span className="small fw-semibold">
                      Task {index + 1}: {task.title}
                    </span>
                  </button>
                </h2>

                {/* Task body. Closed tasks are hidden with Bootstrap's "collapse" CSS
                    class instead of being removed, so typed answers aren't lost. */}
                <div className={'accordion-collapse collapse' + (isOpen ? ' show' : '')}>
                  <div className="accordion-body small">
                    <h6 className="text-uppercase text-body-secondary small fw-bold">Instructions</h6>
                    {/* The instructions are HTML written by the instructor in the Django admin.
                        This shows them as HTML instead of as text (see the guide). */}
                    <div dangerouslySetInnerHTML={{ __html: task.instructions }} />
                    <hr />
                    <h6 className="text-uppercase text-body-secondary small fw-bold">Questions</h6>
                    <form onSubmit={(event) => handleSubmit(event, task, index)}>
                      {task.questions.map((question) => (
                        <Question key={question.id} question={question} />
                      ))}
                      <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-sm btn-primary">
                          {done[task.id] ? 'Update answers' : 'Submit'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}