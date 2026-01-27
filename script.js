const api = "https://api.api-ninjas.com/v1/exercises"
const api_key = "" //api ключ с exercises api
const exercises = []
const description_array = []
const current_view = []
const container = document.getElementById("cards")
async function checkJson(response){
    if(!response.ok){
        const text = await response.text().catch(() => '')
        throw new Error(response.status + " " + response.statusText + " " + text)
    }
    return response.json()
}
function filtersChange(){
    const muscle_input = document.getElementById("filter-muscle")
    const difficulty_input = document.getElementById("filter-difficulty")
    const type_input = document.getElementById("filter-type")

    muscle_input.addEventListener("change", filter)
    difficulty_input.addEventListener("change", filter)
    type_input.addEventListener("change", filter)
}
async function filter(){
    const muscle_value = document.getElementById("filter-muscle").value.trim()
    const difficulty_value = document.getElementById("filter-difficulty").value.trim()
    const type_value = document.getElementById("filter-type").value.trim()
    const filtered = await fetch(api + `?type=${type_value}&muscle=${muscle_value}&difficulty=${difficulty_value}`, {
        method:"GET",
        headers:{
            "X-Api-Key": api_key
        }
    })
    .then(response => checkJson(response))
    displayExercises(filtered)
}
function displayExercises(view){
    container.innerHTML = ""
    const fragment = document.createDocumentFragment()
    view.forEach(element => {
        const wrapper = document.createElement("div")
        wrapper.innerHTML = renderExercise(element).trim()
        fragment.appendChild(wrapper.firstElementChild)
    });
    container.appendChild(fragment)
}
function renderExercise(exercise){
   const name = exercise.name
   const type = exercise.type
   const muscle = exercise.muscle
   const difficulty = exercise.difficulty
   const instructions = exercise.instructions
   const equipments = exercise.equipments
   const safetyInfo = exercise.safety_info
   return`
   <div class="card">
                <div class="card-top">
                    <img src="/resourses/images/intermediate-logo.png" alt="diff_logo" class="card-img">
                    <ul class="parameter-container">
                      <li class="parameter-text">Название:${name}</li>
                      <li class="parameter-text">Группы мышц:${muscle}</li>
                      <li class="parameter-text">Сложность:${difficulty}</li>
                    </ul>
                </div>
                <div class="desc-btn-container">
                    <p class="desc-btn">Показать/скрыть описание</p>
                </div>
                <div class="card-bottom hidden">
                     <ul class="card-bottom-list">
                        <li class="card-bottom-item">Тип:${type}</li>
                        <li class="card-bottom-item">Инструкции:${instructions}</li>
                        <li class="card-bottom-item">Оборудование:${equipments}</li>
                        <li class="card-bottom-item">Правила безопасности:${safetyInfo}</li>
                     </ul>
                </div>
           </div>
   `
}
(async () =>{
    filtersChange()
})()