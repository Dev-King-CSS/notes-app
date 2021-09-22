const form = document.querySelector("form")
const inputTitle = document.querySelector("input")
const inputNote = document.querySelector("textarea")
const notesContainer = document.querySelector(".notes")
const createNoteButton = document.querySelector(".create-note")

createNoteButton.addEventListener("click", () => {
  form.classList.toggle("show")
  createNoteButton.classList.toggle("close")
})

class App {
  //prettier-ignore
  notes = localStorage.getItem("notes") === null ? [] : JSON.parse(localStorage.getItem("notes"));

  constructor() {
    this.updateUI()
    form.addEventListener("submit", this.addNote.bind(this))

    notesContainer.onclick = function (e) {
      if (e.target.parentElement.classList.contains("note")) {
        const target = e.target
        const id = target.closest(".note").dataset.id
        const index = this.notes.findIndex(cur => cur.id === +id)

        if (e.target.classList.contains("remove")) {
          this.deleteNote.call(this, e)
        }

        if (e.target.classList.contains("edit")) {
          this.editNote.call(this, e, index)
        }

        if (e.target.classList.contains("fullScreen")) {
          target.parentElement.classList.toggle("wow")
        }
      }
    }.bind(this)
  }

  updateLocalStorage() {
    localStorage.setItem("notes", JSON.stringify(this.notes))
  }

  updateUI() {
    notesContainer.innerHTML = ""
    const html = this.notes
      .map(note => {
        return `
        <div class="note" data-id="${note.id}">
          <p class="fullScreen"></p>
          <p class="remove"></p>
          <p class="edit"></p>
          <input type="text" style="display:none" class="updateTitle">
          <h3 class="note-title">${note.title}</h3>
          <textarea type="text"  style="display:none;" class="updateNote"></textarea>
          <div class="note-note">
          ${note.note}
          </div>
        </div>
  `
      })
      .join("")

    notesContainer.insertAdjacentHTML("beforeend", html)
  }

  addNote(e) {
    e.preventDefault()

    if (!inputTitle.value || !inputNote.value) {
      return alert("Please fill all the fields!")
    }

    this.notes.push({
      id: Date.now(),
      title: inputTitle.value,
      note: inputNote.value,
    })

    this.updateLocalStorage()
    this.updateUI()

    inputNote.value = inputTitle.value = ""
    createNoteButton.click()
  }

  editNote(e, index) {
    const inputUpdateTitle =
      e.target.parentElement.querySelector(".updateTitle")
    const inputUpdateNote =
      e.target.parentElement.querySelector(".updateNote")
    const noteTitle = e.target.parentElement.querySelector(".note-title")
    const noteNote = e.target.parentElement.querySelector(".note-note")

    inputUpdateNote.style.display = "block"
    inputUpdateTitle.style.display = "block"
    noteTitle.style.display = "none"
    noteNote.style.display = "none"

    inputUpdateNote.value = noteNote.textContent
    inputUpdateTitle.value = noteTitle.textContent
    inputUpdateTitle.focus()

    inputUpdateNote.onblur = function () {
      this.notes[index].title = inputUpdateTitle.value
      this.notes[index].note = inputUpdateNote.value
      this.updateUI()
      this.updateLocalStorage()
    }.bind(this)
  }

  deleteNote(e) {
    const target = e.target
    const id = target.closest(".note").dataset.id
    const index = this.notes.findIndex(cur => cur.id === +id)

    this.notes.splice(index, 1)
    this.updateLocalStorage()
    this.updateUI()
  }
}

const Notes = new App()
