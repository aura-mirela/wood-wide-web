// Shared behavior for all lesson pages:
// 1. Checkboxes with data-persist survive reloads (localStorage).
// 2. Quizzes grade themselves on "Check answers".

// ---------- persistent checkboxes ----------

const page = location.pathname.split('/').pop() || 'index.html'

document.querySelectorAll('input[type="checkbox"][data-persist]').forEach((box) => {
  const key = `fungal:${page}:${box.dataset.persist}`
  box.checked = localStorage.getItem(key) === '1'
  box.addEventListener('change', () => {
    localStorage.setItem(key, box.checked ? '1' : '0')
  })
})

// ---------- quiz grading ----------

document.querySelectorAll('form.quiz').forEach((quiz) => {
  quiz.addEventListener('submit', (event) => {
    event.preventDefault()
    let correct = 0
    const questions = quiz.querySelectorAll('fieldset[data-answer]')

    questions.forEach((q) => {
      q.classList.add('checked')
      q.querySelectorAll('label').forEach((l) => l.classList.remove('is-answer', 'picked-wrong'))

      const answer = q.dataset.answer
      const picked = q.querySelector('input:checked')

      q.querySelectorAll('label').forEach((label) => {
        const input = label.querySelector('input')
        if (input.value === answer) label.classList.add('is-answer')
        if (input.checked && input.value !== answer) label.classList.add('picked-wrong')
      })

      if (picked && picked.value === answer) correct += 1
    })

    const score = quiz.querySelector('.score')
    const missed = questions.length - correct
    score.textContent =
      `${correct} / ${questions.length}` +
      (missed >= 2 ? ' — redo the related exercise before moving on.' : missed === 1 ? ' — close. Reread that concept.' : ' — clean sweep.')
  })
})
